const Pet = require("../models/PetsModel");
const moment = require("moment-timezone");

// fetch pets
exports.fetchPets = async (req, res, next) => {
	try {
		let criteria = req.body;
		let pets = await Pet.fetchPets(criteria);
		res.status(200).send(pets);
	} catch (error) {
		next(error);
	}
};

// get all
exports.getAllPets = async (req, res, next) => {
	try {
		let pets = await Pet.getAll();
		res.status(200).send(pets);
	} catch (error) {
		next(error);
	}
};

// create
exports.createPet = async (req, res, next) => {
	try {
		let data = req.body;
		moment.tz.setDefault("Asia/Beirut");
		data.birthdate = moment(data.birthdate).format(`YYYY-MM-DD`);

		let [createdPet] = await Pet.create(data);

		let [result] = await Pet.getById(createdPet.insertId);
		res.status(200).send(result);
	} catch (error) {
		next(error);
	}
};

// update
exports.updatePet = async (req, res, next) => {
	try {
		let data = req.body;
		moment.tz.setDefault("Asia/Beirut");
		data.birthdate = moment(data.birthdate).format(`YYYY-MM-DD`);

		await Pet.update(data);

		let [result] = await Pet.getById(data.pet_id);
		res.status(200).send(result);
	} catch (error) {
		next(error);
	}
};

// delete pet
exports.deletePet = async (req, res, next) => {
    const pet_id = req.params.id;
    try {
        await Pet.delete(pet_id);
        res.status(202).json({
            message: "Pet profile has been deleted successfully!",
        });
    } catch (error) {
        next(error);
    }
};

// ----------------------- Medical history ---------------------------
// -------------------------------------------------------------------

exports.fetchMedicalHistory = async (req, res, next) => {
	try {
		let id = req.params.id;
		let data = await Pet.fetchMedicalHistory(id);
		res.status(200).send(data);
	} catch (error) {
		next(error);
	}
};

exports.createMedicalHistory = async (req, res, next) => {
	try {
		let data = req.body;
		// fix date
		moment.tz.setDefault("Asia/Beirut");
		data.record_datetime = moment(data.record_datetime).format(
			`YYYY-MM-DD HH:mm:ss`
		);
		let createdRecord = await Pet.createMedicalHistory(data);

		let [result] = await Pet.fetchMedicalHistoryById(
			createdRecord.insertId
		);
		res.status(201).send(result);
	} catch (error) {
		next(error);
	}
};

exports.updateMedicalHistory = async (req, res, next) => {
	try {
		let data = req.body;
		await Pet.updateMedicalHistory(data);
		const [updatedHistory] = await Pet.fetchMedicalHistoryById(
			data.record_id
		);
		res.status(201).send(updatedHistory);
	} catch (error) {
		next(error);
	}
};

exports.deleteMedicalHistory = async (req, res, next) => {
	try {
		let id = req.params.id;
		await Pet.deleteMedicalHistory(id);
		res.status(202).json({
			message: "Record has been deleted successfully!",
		});
	} catch (error) {
		next(error);
	}
};
