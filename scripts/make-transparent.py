#!/usr/bin/env python3
"""Make logo background transparent by removing dark charcoal pixels."""

from PIL import Image

INPUT = "public/images/logo.png"
OUTPUT = "public/images/logo.png"

def main():
    img = Image.open(INPUT).convert("RGBA")
    data = img.getdata()

    new_data = []
    for item in data:
        r, g, b, a = item
        # Dark charcoal background: all channels low, neutral (R≈G≈B)
        # Logo: light grey (high RGB) or dark blue (low R, mid G, high B)
        luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        is_neutral_dark = abs(r - g) < 25 and abs(g - b) < 25 and abs(r - b) < 25

        if luminance < 0.18 and is_neutral_dark:
            # Background: make transparent
            new_data.append((r, g, b, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(OUTPUT, "PNG")
    print(f"Saved: {OUTPUT}")

if __name__ == "__main__":
    main()
