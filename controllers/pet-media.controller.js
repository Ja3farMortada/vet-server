const PetMedia = require("../models/pet-media.model");
const { processImage } = require("../services/imageService");
const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");

/**
 * Safely removes a file from disk using its stored link_url.
 * Silently ignores missing files — avoids crashes during cleanup.
 * @param {string} linkUrl  e.g. "/uploads/pet-media/pet_5_xxx.webp"
 */
const deleteFileFromDisk = (linkUrl) => {
    if (!linkUrl) return;
    const absolute = path.join(__dirname, "..", linkUrl);
    if (fs.existsSync(absolute)) {
        fs.unlinkSync(absolute);
    }
};

// ─── GET /pet-media/:pet_id ───────────────────────────────────────────────────

exports.getByPetId = async (req, res, next) => {
    try {
        const { pet_id } = req.params;
        const media = await PetMedia.getByPetId(pet_id);
        res.status(200).json(media);
    } catch (error) {
        next(error);
    }
};

// ─── POST /pet-media ──────────────────────────────────────────────────────────

exports.create = async (req, res, next) => {
    let filename = null; // track file so we can roll back on DB failure
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }

        const { pet_id, title, description } = req.body;

        if (!pet_id || !title) {
            return res.status(400).json({ error: "pet_id and title are required" });
        }

        // 1. Optimize + persist the image
        filename = await processImage(req.file.buffer, pet_id);

        // 2. Insert DB record
        moment.tz.setDefault("Asia/Beirut");

        const data = {
            pet_id,
            title,
            description: description || null,
            link_url: `/uploads/pet-media/${filename}`,
            datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        const result = await PetMedia.create(data);
        const created = await PetMedia.getById(result.insertId);
        res.status(201).json(created);
    } catch (error) {
        // DB failed after image was written — remove the orphaned file
        if (filename) deleteFileFromDisk(`/uploads/pet-media/${filename}`);
        next(error);
    }
};

// ─── PUT /pet-media/:pet_id ───────────────────────────────────────────────────

exports.update = async (req, res, next) => {
    let newFilename = null; // track so we can roll back on DB failure
    try {
        const { pet_id } = req.params;
        const existing = await PetMedia.getById(pet_id);

        if (!existing) {
            return res.status(404).json({ error: "Media record not found" });
        }

        const { title, description } = req.body;
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;

        if (req.file) {
            // 1. Write new optimized image first
            newFilename = await processImage(req.file.buffer, pet_id);
            updateData.link_url = `/uploads/pet-media/${newFilename}`;
        }

        // 2. Persist DB changes
        await PetMedia.update(pet_id, updateData);

        // 3. DB succeeded — safe to remove old image from disk
        if (newFilename) deleteFileFromDisk(existing.link_url);

        const updated = await PetMedia.getById(pet_id);
        res.status(200).json(updated);
    } catch (error) {
        // DB failed after new image was written — remove orphaned file,
        // old image is still intact on disk
        if (newFilename) deleteFileFromDisk(`/uploads/pet-media/${newFilename}`);
        next(error);
    }
};

// ─── DELETE /pet-media/:pet_id ────────────────────────────────────────────────

exports.delete = async (req, res, next) => {
    try {
        const { pet_id } = req.params;
        const existing = await PetMedia.getById(pet_id);

        if (!existing) {
            return res.status(404).json({ error: "Media record not found" });
        }

        await PetMedia.delete(pet_id);
        deleteFileFromDisk(existing.link_url);

        res.status(200).json({ message: "Media deleted successfully" });
    } catch (error) {
        next(error);
    }
};
