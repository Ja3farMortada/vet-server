const Reminder = require("../models/reminder.model");

// get all
exports.getAllReminders = async (req, res, next) => {
	try {
		const reminders = await Reminder.getAll();
		res.status(200).send(reminders);
	} catch (error) {
		next(error);
	}
};

// create
exports.createReminder = async (req, res, next) => {
	try {
		const data = req.body;

		if (!data.reminder_title || !data.due_date) {
			return res
				.status(400)
				.json({ error: "reminder_title and due_date are required." });
		}

		const insertId = await Reminder.create(data);
		const reminder = await Reminder.getById(insertId);
		res.status(201).send(reminder);
	} catch (error) {
		next(error);
	}
};

// update
exports.updateReminder = async (req, res, next) => {
	try {
		const id = req.params.id;
		const data = req.body;

		if (data.reminder_title === "" || data.due_date === "") {
			return res
				.status(400)
				.json({ error: "reminder_title and due_date cannot be empty." });
		}

		const affected = await Reminder.update(id, data);
		if (!affected) {
			return res.status(404).json({ error: "Reminder not found." });
		}

		const updated = await Reminder.getById(id);
		res.status(200).send(updated);
	} catch (error) {
		next(error);
	}
};

// delete
exports.deleteReminder = async (req, res, next) => {
	try {
		const id = req.params.id;
		const affected = await Reminder.delete(id);
		if (!affected) {
			return res.status(404).json({ error: "Reminder not found." });
		}
		res.json({ message: "Reminder deleted successfully!" });
	} catch (error) {
		next(error);
	}
};

// upcoming (next N days, defaults to 7)
exports.getUpcomingReminders = async (req, res, next) => {
	try {
		const days = parseInt(req.query.days, 10) || 7;
		const reminders = await Reminder.getUpcoming(days);
		res.status(200).send(reminders);
	} catch (error) {
		next(error);
	}
};

// by pet
exports.getRemindersByPetId = async (req, res, next) => {
	try {
		const reminders = await Reminder.getByPetId(req.params.pet_id);
		res.status(200).send(reminders);
	} catch (error) {
		next(error);
	}
};

// by account
exports.getRemindersByAccountId = async (req, res, next) => {
	try {
		const reminders = await Reminder.getByAccountId(req.params.account_id);
		res.status(200).send(reminders);
	} catch (error) {
		next(error);
	}
};

// mark as notified
exports.markAsNotified = async (req, res, next) => {
	try {
		const affected = await Reminder.markNotified(req.params.id);
		if (!affected) {
			return res.status(404).json({ error: "Reminder not found." });
		}
		res.json({ message: "Reminder marked as notified!" });
	} catch (error) {
		next(error);
	}
};

// mark as completed (handles repeat logic inside model)
exports.markAsCompleted = async (req, res, next) => {
	try {
		const affected = await Reminder.markCompleted(req.params.id);
		if (!affected) {
			return res.status(404).json({ error: "Reminder not found." });
		}
		res.json({ message: "Reminder marked as completed!" });
	} catch (error) {
		next(error);
	}
};
