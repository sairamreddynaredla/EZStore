from PIL import Image
import os

# Create icons folder if it doesn't exist
icons_dir = "public/assets/icons"
os.makedirs(icons_dir, exist_ok=True)

# Open the composite image
image_path = "public/assets/icons/image.png"

if not os.path.exists(image_path):
    print(f"Error: File '{image_path}' not found!")
    exit(1)

img = Image.open(image_path)
width, height = img.size

print(f"Image size: {width}x{height}")

# Define icon positions with better coordinates
# Image is 1536x1024, 4 icons in a row
icons = [
    {"name": "secure-payment.png", "box": (0, 80, 384, 480)},         # Shield (left)
    {"name": "genuine-product.png", "box": (320, 80, 640, 480)},      # Gear
    {"name": "easy-returns.png", "box": (600, 80, 920, 480)},         # Heart
    {"name": "fast-delivery.png", "box": (880, 80, 1200, 480)},       # Truck (right)
]

# Extract each icon
for icon in icons:
    try:
        cropped = img.crop(icon["box"])
        output_path = os.path.join(icons_dir, icon["name"])
        cropped.save(output_path)
        print(f"✓ Extracted: {icon['name']} - Size: {cropped.size}")
    except Exception as e:
        print(f"✗ Error extracting {icon['name']}: {e}")

print("\nDone! Icons have been extracted to public/assets/icons/")
