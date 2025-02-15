const Variant = require("../models/VariantsModel");
const Product = require("../models/ProductModel");

exports.createVariant = async (req, res, next) => {
	try {
		let data = req.body;

		await Variant.create(data);
		let [product] = await Product.getById(data.product_id_fk);
		res.status(201).send(product);
	} catch (error) {
		next(error);
	}
};

exports.updateVariant = async (req, res, next) => {
	try {
		let data = req.body;

		await Variant.update(data);
		let [product] = await Product.getById(data.product_id_fk);
		res.status(201).send(product);
	} catch (error) {
		next(error);
	}
};

exports.deleteVariant = async (req, res, next) => {
	try {
		let id = req.params.id;
		let { product_id_fk } = await Variant.delete(id);
		let [product] = await Product.getById(product_id_fk);
		res.status(201).send(product);
	} catch (error) {
		next(error);
	}
};
