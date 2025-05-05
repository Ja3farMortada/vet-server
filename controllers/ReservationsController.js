const Reservation = require("../models/ReservationsModel");
const moment = require("moment-timezone");

exports.getReservations = async (req, res, next) => {
	try {
		let reservations = await Reservation.getAll();
		res.status(200).send(reservations);
	} catch (error) {
		next(error);
	}
};

exports.createReservation = async (req, res, next) => {
	try {
		const io = req.io;
		const user = req.user;

		let data = req.body;
		moment.tz.setDefault("Asia/Beirut");
		data.start = moment(data.start).format(`YYYY-MM-DD HH:mm:ss`);
		data.end = moment(data.end).format(`YYYY-MM-DD HH:mm:ss`);
		let result = await Reservation.create(data);
		let [added] = await Reservation.getById(result.insertId);

		// emit socket
		io.emit("reservationCreated", [added, user]);

		res.status(201).send(added);
	} catch (error) {
		next(error);
	}
};

exports.updateReservation = async (req, res, next) => {
	try {
		const io = req.io;
		const user = req.user;

		let data = req.body;
		moment.tz.setDefault("Asia/Beirut");
		data.start = moment(data.start).format(`YYYY-MM-DD HH:mm:ss`);
		data.end = moment(data.end).format(`YYYY-MM-DD HH:mm:ss`);
		await Reservation.update(data);
		let [updated] = await Reservation.getById(data.id);

		// emit socket
		io.emit("reservationUpdated", [updated, user]);

		res.status(202).send(updated);
	} catch (error) {
		next(error);
	}
};

exports.deleteReservation = async (req, res, next) => {
	try {
		let id = req.params.id;
		const io = req.io;
		const user = req.user;

		await Reservation.delete(id);

		// emit socket
		io.emit("reservationUpdated", [user]);
		res.status(202).json({
			message: "Reservation has been deleted successfully!",
		});
	} catch (error) {
		next(error);
	}
};
