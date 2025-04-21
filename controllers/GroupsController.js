const Group = require("../models/GroupsModel");

exports.getGroups = async (req, res, next) => {
	try {
		let groups = await Group.getAll();
		res.status(200).send(groups);
	} catch (error) {
		next(error);
	}
};
