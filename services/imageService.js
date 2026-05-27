const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../uploads/pet-media");

// Ensure the upload directory exists at startup
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Optimizes an image buffer and writes it to disk as WebP.
 *
 * Pipeline:
 *  - Resize to max 1200×1200, preserving aspect ratio, no upscaling
 *  - Convert to WebP at quality 80
 *  - Strip all metadata (sharp default — .withMetadata() is intentionally omitted)
 *
 * @param {Buffer} buffer  Raw image bytes from multer memoryStorage
 * @param {string|number} petId  Used to build a readable filename
 * @returns {Promise<string>}  The generated filename, e.g. "pet_5_1716543210000.webp"
 */
const processImage = async (buffer, petId) => {
    const filename = `pet_${petId}_${Date.now()}.webp`;
    const outputPath = path.join(UPLOAD_DIR, filename);

    await sharp(buffer)
        .resize(1200, 1200, {
            fit: "inside",          // keep aspect ratio
            withoutEnlargement: true, // never upscale
        })
        .webp({ quality: 80 })
        .toFile(outputPath);

    return filename;
};

module.exports = { processImage };
