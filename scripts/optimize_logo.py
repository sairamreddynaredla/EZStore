#!/usr/bin/env python3
from PIL import Image, ImageFilter
from pathlib import Path
import shutil
import sys

workspace_root = Path(__file__).resolve().parent.parent
transparent_path = workspace_root / "src" / "assets" / "logo" / "ezstore-logo-transparent.png"
orig_path = workspace_root / "src" / "assets" / "logo" / "ezstore-logo.png"
backup_path = orig_path.with_suffix(orig_path.suffix + ".bak")
opt_path = workspace_root / "src" / "assets" / "logo" / "ezstore-logo-optimized.png"

if not transparent_path.exists():
    print(f"ERROR: transparent source not found: {transparent_path}")
    sys.exit(1)

img = Image.open(transparent_path).convert("RGBA")
# Smooth alpha edges to reduce haloing
r, g, b, a = img.split()
# Slight blur to alpha for smoother transitions
alpha_blur = a.filter(ImageFilter.GaussianBlur(radius=1.2))
img.putalpha(alpha_blur)

# Save optimized PNG
try:
    img.save(opt_path, format="PNG", optimize=True, compress_level=9)
except Exception as e:
    print(f"ERROR: cannot save optimized PNG: {e}")
    sys.exit(1)

# Backup original logo (if exists)
if orig_path.exists():
    try:
        shutil.copy2(orig_path, backup_path)
        print(f"Backed up original to: {backup_path}")
    except Exception as e:
        print(f"WARNING: failed to backup original: {e}")

# Replace original with optimized
try:
    shutil.copy2(opt_path, orig_path)
    print(f"Replaced original with optimized PNG: {orig_path}")
except Exception as e:
    print(f"ERROR: cannot replace original: {e}")
    sys.exit(1)

# Print sizes for verification
print(f"Optimized size: {opt_path.stat().st_size} bytes")
if orig_path.exists():
    print(f"New original size: {orig_path.stat().st_size} bytes")
if backup_path.exists():
    print(f"Backup size: {backup_path.stat().st_size} bytes")
