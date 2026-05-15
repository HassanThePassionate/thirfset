#!/usr/bin/env python3
"""
Kisi bhi web page ka URL do — page par jo <img> (aur <picture> / srcset) images milen,
unhe ek folder mein save karega (default: JPG; PNG bhi choose kar sakte ho).

Usage:
  python scripts/download_page_images.py "https://example.com/page"
  python scripts/download_page_images.py "https://example.com" --format png
  python scripts/download_page_images.py "https://example.com" -o "C:\\Users\\me\\pics"

Zaroori: Python 3.9+ aur `pip install pillow` (JPG/PNG conversion ke liye)
"""

from __future__ import annotations

import argparse
import email.message
import html
import io
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

try:
    from PIL import Image, ImageOps, UnidentifiedImageError
except ImportError:
    Image = None  # type: ignore[misc, assignment]
    ImageOps = None  # type: ignore[misc, assignment]
    UnidentifiedImageError = Exception  # type: ignore[misc, assignment]


DEFAULT_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


def fetch_bytes(url: str, timeout: int = 30) -> tuple[bytes, str | None]:
    """Return (body, charset_from_Content-Type_or_None)."""
    req = urllib.request.Request(
        url,
        headers={"User-Agent": DEFAULT_UA, "Accept": "text/html,*/*"},
        method="GET",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read()
        ctype = resp.headers.get_content_type()
        charset = None
        if ctype:
            msg = email.message.Message()
            msg["content-type"] = resp.headers.get("Content-Type", "")
            charset = msg.get_content_charset()
        return raw, charset


def decode_html(raw: bytes, charset: str | None, page_url: str) -> str:
    if charset:
        try:
            return raw.decode(charset)
        except (LookupError, UnicodeDecodeError):
            pass
    # Try UTF-8, then latin-1 (never fails)
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("latin-1")


def urls_from_srcset(srcset: str, base_url: str) -> list[str]:
    """Parse srcset: 'url1 1x, url2 2w' -> absolute URLs (first URL per descriptor)."""
    out: list[str] = []
    if not srcset or not srcset.strip():
        return out
    for part in srcset.split(","):
        part = part.strip()
        if not part:
            continue
        # First token is usually the URL
        url_part = part.split()[0] if part.split() else part
        url_part = html.unescape(url_part.strip())
        if url_part.startswith("data:"):
            continue
        out.append(urllib.parse.urljoin(base_url, url_part))
    return out


def collect_image_urls(html_text: str, page_url: str) -> list[str]:
    seen: set[str] = set()
    ordered: list[str] = []

    def add(u: str) -> None:
        u = u.strip()
        if not u or u.startswith("data:") or u.startswith("blob:"):
            return
        abs_u = urllib.parse.urljoin(page_url, html.unescape(u))
        if abs_u not in seen:
            seen.add(abs_u)
            ordered.append(abs_u)

    # <img src="..." srcset="...">
    for m in re.finditer(
        r"<img\b[^>]*>",
        html_text,
        flags=re.IGNORECASE | re.DOTALL,
    ):
        tag = m.group(0)
        src_m = re.search(r'\bsrc\s*=\s*("|\')([^"\']*)\1', tag, re.I)
        if src_m:
            add(src_m.group(2))
        srcset_m = re.search(r'\bsrcset\s*=\s*("|\')([^"\']*)\1', tag, re.I)
        if srcset_m:
            for u in urls_from_srcset(srcset_m.group(2), page_url):
                add(u)

    # <source srcset="..."> inside <picture>
    for m in re.finditer(
        r"<source\b[^>]*>",
        html_text,
        flags=re.IGNORECASE | re.DOTALL,
    ):
        tag = m.group(0)
        srcset_m = re.search(r'\bsrcset\s*=\s*("|\')([^"\']*)\1', tag, re.I)
        if srcset_m:
            for u in urls_from_srcset(srcset_m.group(2), page_url):
                add(u)

    # og:image / twitter:image
    for prop in (
        r'property\s*=\s*["\']og:image["\']\s+content\s*=\s*("|\')([^"\']+)\1',
        r'content\s*=\s*("|\')([^"\']+)\1\s+property\s*=\s*["\']og:image["\']',
        r'name\s*=\s*["\']twitter:image["\']\s+content\s*=\s*("|\')([^"\']+)\1',
    ):
        for m in re.finditer(prop, html_text, re.I):
            add(m.group(2))

    return ordered


def safe_filename_from_url(url: str, index: int) -> str:
    parsed = urllib.parse.urlparse(url)
    name = Path(parsed.path).name or "image"
    # Remove query junk from name if empty weird
    if not name or name in ("/", "."):
        name = f"image_{index}"
    # Windows-invalid chars
    bad = '<>:"/\\|?*'
    for c in bad:
        name = name.replace(c, "_")
    if len(name) > 180:
        stem, ext = (name.rsplit(".", 1) + [""])[:2]
        if ext and len(ext) <= 5:
            name = stem[:160] + "." + ext
        else:
            name = name[:180]
    return name


def fetch_image_bytes(url: str, timeout: int = 60) -> bytes:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": DEFAULT_UA, "Accept": "image/*,*/*;q=0.8"},
        method="GET",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def normalize_format(fmt: str) -> str:
    f = fmt.strip().lower()
    if f in ("jpg", "jpeg"):
        return "jpeg"
    if f == "png":
        return "png"
    raise ValueError(f"Unsupported format: {fmt!r} (use jpg or png)")


def image_bytes_to_file(
    data: bytes,
    dest: Path,
    out_format: str,
    jpeg_quality: int,
) -> None:
    if Image is None:
        raise RuntimeError("Pillow install karo: pip install pillow")

    buf = io.BytesIO(data)
    try:
        im = Image.open(buf)
        im.load()
    except UnidentifiedImageError:
        raise ValueError("Ye file raster image nahi lagti (SVG / non-image skip).")

    # Sirf pehla frame (GIF/WebP animated)
    try:
        im.seek(0)
    except EOFError:
        pass

    try:
        im = ImageOps.exif_transpose(im)
    except Exception:
        pass

    dest.parent.mkdir(parents=True, exist_ok=True)

    if out_format == "jpeg":
        if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
            base = Image.new("RGB", im.size, (255, 255, 255))
            rgba = im.convert("RGBA")
            base.paste(rgba, mask=rgba.split()[3])
            im = base
        else:
            im = im.convert("RGB")
        im.save(dest, format="JPEG", quality=jpeg_quality, optimize=True)
    else:
        # PNG: transparency preserve
        if im.mode == "P":
            im = im.convert("RGBA")
        im.save(dest, format="PNG", optimize=True)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Web page se images nikaal kar folder mein save kare."
    )
    parser.add_argument("url", help="Page ka full URL, e.g. https://site.com/path")
    parser.add_argument(
        "-o",
        "--output",
        help="Folder jahan save karna hai (default: ./downloaded_images_<host>_<time>)",
        default=None,
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=30,
        help="HTTP timeout seconds (default: 30)",
    )
    parser.add_argument(
        "--format",
        "-f",
        choices=("jpg", "jpeg", "png"),
        default="jpg",
        help="Save format: jpg (default) ya png",
    )
    parser.add_argument(
        "--jpeg-quality",
        type=int,
        default=90,
        metavar="Q",
        help="JPG quality 1–95 (default: 90); sirf --format jpg ke liye",
    )
    args = parser.parse_args()

    if Image is None:
        print(
            "JPG/PNG ke liye Pillow chahiye. Run: pip install pillow",
            file=sys.stderr,
        )
        return 2

    out_format = normalize_format(args.format)
    ext = ".jpg" if out_format == "jpeg" else ".png"
    jq = max(1, min(95, args.jpeg_quality))

    page_url = args.url.strip()
    if not page_url.startswith(("http://", "https://")):
        page_url = "https://" + page_url

    parsed = urllib.parse.urlparse(page_url)
    if not parsed.netloc:
        print("Galat URL.", file=sys.stderr)
        return 2

    if args.output:
        out_dir = Path(args.output).expanduser().resolve()
    else:
        host = parsed.netloc.replace(":", "_")[:80]
        stamp = time.strftime("%Y%m%d_%H%M%S")
        out_dir = Path.cwd() / f"downloaded_images_{host}_{stamp}"

    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Page fetch: {page_url}")
    try:
        raw, charset = fetch_bytes(page_url, timeout=args.timeout)
    except urllib.error.HTTPError as e:
        print(f"HTTP error: {e.code} {e.reason}", file=sys.stderr)
        return 1
    except urllib.error.URLError as e:
        print(f"URL error: {e.reason}", file=sys.stderr)
        return 1
    except TimeoutError:
        print("Timeout — page load nahi hua.", file=sys.stderr)
        return 1

    html_text = decode_html(raw, charset, page_url)
    urls = collect_image_urls(html_text, page_url)

    if not urls:
        print("Is page par koi image URL nahi mila (ya HTML parse nahi hua).")
        print(f"Empty folder: {out_dir}")
        return 0

    print(f"Mil gaye {len(urls)} image URLs. Download + save as {ext} …")
    ok = 0
    used_names: dict[str, int] = {}

    for i, img_url in enumerate(urls, start=1):
        raw_name = safe_filename_from_url(img_url, i)
        stem = Path(raw_name).stem or f"image_{i}"
        key = stem + ext
        count = used_names.get(key, 0)
        used_names[key] = count + 1
        if count:
            fname = f"{stem}_{count + 1}{ext}"
        else:
            fname = f"{stem}{ext}"
        dest = out_dir / fname

        try:
            data = fetch_image_bytes(img_url, timeout=args.timeout)
            image_bytes_to_file(data, dest, out_format, jpeg_quality=jq)
            ok += 1
            print(f"  [{ok}/{len(urls)}] {fname}")
        except urllib.error.HTTPError as e:
            print(f"  SKIP (HTTP {e.code}): {img_url}", file=sys.stderr)
        except urllib.error.URLError as e:
            print(f"  SKIP ({e.reason}): {img_url}", file=sys.stderr)
        except TimeoutError:
            print(f"  SKIP (timeout): {img_url}", file=sys.stderr)
        except ValueError as e:
            print(f"  SKIP ({e}): {img_url}", file=sys.stderr)
        except OSError as e:
            print(f"  SKIP (disk): {e}", file=sys.stderr)

    print(f"\nHo gaya: {ok}/{len(urls)} files -> {out_dir}")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
