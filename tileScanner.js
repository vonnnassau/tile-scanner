// tileScanner.js
const fs = require("fs");
const path = require("path");
const TGA = require("tga"); // ← NEW: use 'tga' package

const TILE_FOLDER = "./tiles";
const OUTPUT_FILE = "./tile_metadata.json";
const ALPHA_THRESHOLD = 10; // 0-255; below = transparent

function computeMeanBrightness(pixels) {
  let total = 0;
  let count = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a > ALPHA_THRESHOLD) {
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      total += brightness;
      count++;
    }
  }

  return count > 0 ? total / count : 0;
}

function computeAlphaCoverage(pixels) {
  let visible = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] > ALPHA_THRESHOLD) visible++;
  }

  return visible / (pixels.length / 4);
}

function scanTiles() {
  const files = fs.readdirSync(TILE_FOLDER).filter((f) => f.endsWith(".tga"));
  const results = [];

  for (const file of files) {
    const filePath = path.join(TILE_FOLDER, file);

    let pixels;
    try {
      const buf = fs.readFileSync(filePath);
      const tga = new TGA(buf); // ← this is exactly how the README does it
      pixels = tga.pixels; // Uint8Array RGBA
      if (!pixels) {
        console.error("No pixels for", file);
        continue;
      }
    } catch (err) {
      console.error("Failed to read", file, err.message);
      continue;
    }

    const meanBrightness = computeMeanBrightness(pixels);
    const alphaCoverage = computeAlphaCoverage(pixels);

    results.push({
      file, // filename only
      meanBrightness,
      alphaCoverage,
    });

    console.log(
      `✓ Scanned ${file} | brightness=${meanBrightness.toFixed(
        3
      )} | alpha=${alphaCoverage.toFixed(3)}`
    );
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\nMetadata written to ${OUTPUT_FILE}`);
}

scanTiles();