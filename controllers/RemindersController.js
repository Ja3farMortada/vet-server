const Reminder = require("../models/RemindersModel");

// get all
exports.getReminders = async (req, res, next) => {
	try {
		let reminders = await Reminder.getAll();
		res.status(200).send(reminders);
	} catch (error) {
		next(error);
	}
};

// create
exports.createReminder = async (req, res, next) => {
	try {
		const data = req.body;
		await Reminder.create(data);
		res.json({ message: "Reminder created successfully!" });
	} catch (error) {
		next(error);
	}
};

// update
exports.updateReminder = async (req, res, next) => {
	try {
		const data = req.body;
		await Reminder.update(data);
		// const reminder = await Reminder.getById(data.reminder_id);
		// res.status(201).send(reminder);
		res.json({ message: "Reminder updated successfully!" });
	} catch (error) {
		next(error);
	}
};

// delete
exports.deleteReminder = async (req, res, next) => {
	try {
		const id = req.params.id;
		await Reminder.delete(id);
		res.json({ message: "Reminder deleted successfully!" });
	} catch (error) {
		next(error);
	}
};

exports.markNotified = async (req, res, next) => {
	try {
		const data = req.body;
		await Reminder.markNotified(data.reminder_id);
		res.json({ message: "Reminder mark as notified!" });
	} catch (error) {
		next(error);
	}
};

exports.markCompleted = async (req, res, next) => {
	try {
		const data = req.body;
		await Reminder.markCompleted(data);
		res.json({ message: "Reminder mark as completed!" });
	} catch (error) {
		next(error);
	}
};
