const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

exports.login = async (req, res, next) => {
	const io = req.io;
	try {
		const { username, password } = req.body;

		if (!(username && password)) {
			res.status(400).send("All fields are required!");
		}
		let result = await User.getByUsernameAndPassword(username, password);
		if (result) {
			const token = jwt.sign(
				{
					user_id: result.user_id.toString(),
					username,
					user_type: result.user_type,
					first_name: result.first_name,
				},
				"$3a#_cJDUV-$QsRewWXcyH-Xdji8vet101#%^$*(_ZkfNdI@#!D-Nv0E_M3a"
			);

			const user = {
				username: username,
				first_name: result.first_name,
				user_type: result.user_type,
				socket_id: result.user_id,
				token: token,
				permissions: {
					edit_pets: result.edit_pets,
					show_stock: result.show_stock,
					show_cost: result.show_cost,
					edit_invoice: result.edit_invoice,
					delete_invoice: result.delete_invoice,
					show_reports: result.show_reports,
					show_history: result.show_history,
				},
			};
			if (user.user_type !== "admin") {
				io.emit("userLoggedIn", username);
			}
			res.status(200).send(user);
		} else {
			res.status(401).send("Incorrect username or password!");
		}
	} catch (error) {
		next(error);
	}
};
