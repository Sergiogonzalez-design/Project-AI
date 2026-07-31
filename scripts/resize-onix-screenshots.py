"""Resize ONIX Player screenshots to App Store dimensions."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ASSETS_DIR = Path(
    r"C:\Users\sergi\.cursor\projects\c-Users-sergi-project-ai\assets"
)
OUTPUT_DIR = Path(r"C:\Users\sergi\project-ai\onix-app-store-screenshots")

SIZES = {
    "1242x2688": (1242, 2688),
    "2688x1242": (2688, 1242),
    "1284x2778": (1284, 2778),
    "2778x1284": (2778, 1284),
}

SCREEN_NAMES = {
    "app_1": "01-splash",
    "app_2": "02-home",
    "app_3": "03-calendar",
    "app_4": "04-dossier",
    "app_5": "05-messages",
    "app_6": "06-settings",
}


def find_sources() -> list[Path]:
    files = sorted(ASSETS_DIR.glob("*Onix_Media_app_*.png"))
    if len(files) != 6:
        raise SystemExit(f"Expected 6 ONIX screenshots, found {len(files)}")
    return files


def resize_portrait(img: Image.Image, width: int, height: int) -> Image.Image:
    return img.resize((width, height), Image.Resampling.LANCZOS)


def resize_landscape(img: Image.Image, width: int, height: int) -> Image.Image:
    """Fit portrait screenshot on landscape canvas (letterbox on sides)."""
    scale = height / img.height
    scaled_w = round(img.width * scale)
    scaled = img.resize((scaled_w, height), Image.Resampling.LANCZOS)

    canvas = Image.new("RGB", (width, height), (0, 0, 0))
    offset_x = (width - scaled_w) // 2
    canvas.paste(scaled, (offset_x, 0))
    return canvas


def process_image(src: Path) -> None:
    # e.g. ...Onix_Media_app_1-uuid.png -> app_1
    stem = src.stem
    app_key = stem.split("_Onix_Media_")[-1].split("-")[0]
    folder_name = SCREEN_NAMES.get(app_key, app_key)
    out_dir = OUTPUT_DIR / folder_name
    out_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(src) as img:
        img = img.convert("RGB")
        for label, (w, h) in SIZES.items():
            if h > w:
                result = resize_portrait(img, w, h)
            else:
                result = resize_landscape(img, w, h)
            out_path = out_dir / f"{folder_name}_{label}.png"
            result.save(out_path, "PNG", optimize=True)
            print(f"  {out_path.name}: {result.size[0]}x{result.size[1]}")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    sources = find_sources()
    print(f"Processing {len(sources)} screenshots -> {OUTPUT_DIR}\n")
    for src in sources:
        app_key = src.stem.split("_Onix_Media_")[-1].split("-")[0]
        print(f"{SCREEN_NAMES.get(app_key, app_key)} ({src.name}):")
        process_image(src)
        print()
    print("Done.")


if __name__ == "__main__":
    main()
