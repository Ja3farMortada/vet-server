const Settings = require("../models/settings.model");

// ─── GET /settings/reservation-options ───────────────────────────────────────

exports.getAllReservationOptions = async (req, res, next) => {
    try {
        const options = await Settings.getAllReservationOptions();
        res.status(200).json(options);
    } catch (error) {
        next(error);
    }
};

// ─── POST /settings/reservation-options ──────────────────────────────────────

exports.createReservationOption = async (req, res, next) => {
    try {
        const { option_label, option_color, option_text_color } = req.body;

        if (!option_label || !option_color) {
            return res
                .status(400)
                .json({ error: "option_label and option_color are required" });
        }

        const result = await Settings.createReservationOption({
            option_label,
            option_color,
            option_text_color: option_text_color || "#ffffff",
        });

        const created = await Settings.getReservationOptionById(result.insertId);
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};

// ─── PUT /settings/reservation-options/:id ────────────────────────────────────

exports.updateReservationOption = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { option_label, option_color, option_text_color } = req.body;

        if (!option_label || !option_color) {
            return res
                .status(400)
                .json({ error: "option_label and option_color are required" });
        }

        const existing = await Settings.getReservationOptionById(id);
        if (!existing) {
            return res.status(404).json({ error: "Reservation option not found" });
        }

        await Settings.updateReservationOption(id, {
            option_label,
            option_color,
            option_text_color: option_text_color || "#ffffff",
        });

        const updated = await Settings.getReservationOptionById(id);
        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

// ─── DELETE /settings/reservation-options/:id ─────────────────────────────────

exports.deleteReservationOption = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await Settings.getReservationOptionById(id);
        if (!existing) {
            return res.status(404).json({ error: "Reservation option not found" });
        }

        await Settings.deleteReservationOption(id);
        res.status(200).json({ message: "Reservation option deleted successfully" });
    } catch (error) {
        next(error);
    }
};
