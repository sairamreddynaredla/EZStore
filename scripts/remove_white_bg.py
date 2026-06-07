#!/usr/bin/env python3
from PIL import Image
from pathlib import Path
import sys

# Workspace-root-aware paths
workspace_root = Path(__file__).resolve().parent.parent
logo_path = workspace_root / "src" / "assets" / "logo" / "ezstore-logo.png"
output_path = workspace_root / "src" / "assets" / "logo" / "ezstore-logo-transparent.png"

if not logo_path.exists():
    print(f"ERROR: source not found: {logo_path}")
    sys.exit(1)

try:
    img = Image.open(logo_path).convert("RGBA")
except Exception as e:
    print(f"ERROR: cannot open image: {e}")
    sys.exit(1)

w, h = img.size
pixels = img.load()
# Threshold for white detection (0-255). Adjust if needed.
threshold = 240

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r >= threshold and g >= threshold and b >= threshold:
            pixels[x, y] = (r, g, b, 0)

try:
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")
    print(f"Size: {output_path.stat().st_size} bytes")
except Exception as e:
    print(f"ERROR: cannot save output: {e}")
    sys.exit(1)
