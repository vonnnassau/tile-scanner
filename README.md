# Quad Tile Scanner

The **Quad Tile Scanner** is a Node.js command-line tool that analyzes RGBA **TGA cutout images** and extracts two properties for each tile:

- **meanBrightness** → average luminance of visible pixels  
- **alphaCoverage** → percentage of non-transparent pixels in the tile  

This metadata is written to `tile_metadata.json` and will be consumed by the Quad Placement Generator to procedurally construct generative collages (e.g. skull shapes) inside the Quad Engine.

---

## Features

| Feature | Description |
|--------|-------------|
| Reads .tga files | Supports 32-bit RGBA TGA cutouts exported from Photoshop |
| Computes brightness | Average luminance based only on visible pixels (alpha > threshold) |
| Computes alpha coverage | Measures how much of the tile shape is opaque |
| One-time preprocessing | Tiles are scanned once; metadata is cached |
| CLI | No UI, no browser, runs via Node.js directly |

---

##  Installation

Clone this repository and install dependencies:

```bash
git clone <repo-url>
cd QuadTileScanner
npm install

## Usage

Step 1 — Place your `.tga` tiles in:

./tiles

Step 2 — Run the scanner:

node tileScanner.js

Step 3 — The tool generates:

tile_metadata.json

### Example output:

[
  {
    "file": "tile_001.tga",
    "meanBrightness": 0.467,
    "alphaCoverage": 0.589
  },
  {
    "file": "tile_002.tga",
    "meanBrightness": 0.197,
    "alphaCoverage": 0.589
  }
]

## 🧠 Why This Tool Exists

The Quad Engine uses a collection of cutout tile images as generative elements to build larger shapes. To place these tiles intelligently in 2D/3D space based on mask brightness and depth rules, we need to know:

- how bright each tile is
- how dense its shape is (based on alpha coverage)

This preprocessing step computes that information once, making the placement phase extremely fast.