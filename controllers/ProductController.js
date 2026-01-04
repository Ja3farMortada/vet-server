const Product = require("../models/ProductModel");

// ###################################### items controllers ######################################

exports.getAllProducts = async (req, res, next) => {
    try {
        let products = await Product.getAll();
        res.status(200).send(products);
    } catch (error) {
        next(error);
    }
};

exports.getByCategory = async (req, res) => {
    try {
        let category_id = req.params.category_id;
        let result = await Product.getByCategory(category_id);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.getByBarcode = async (req, res) => {
    try {
        let barcode = req.params.barcode;
        let [result] = await Product.getByBarcode(barcode);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.createProduct = async (req, res, next) => {
    // const io = req.io;
    const data = req.body;
    const user = req.user;
    delete data.product_id;
    try {
        const result = await Product.create(data, user);
        const [createdProduct] = await Product.getById(result.insertId);
        res.status(201).send(createdProduct);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    // const io = req.io;
    const product = req.body;
    const user = req.user;
    try {
        await Product.update(product, user);
        const [updatedProduct] = await Product.getById(product.product_id);

        // socket to push update
        // io.emit("productUpdated");

        res.status(201).send(updatedProduct);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    const product_id = req.params.id;
    try {
        await Product.delete(product_id);
        res.status(202).json({
            message: "Item has been deleted successfully!",
        });
    } catch (error) {
        next(error);
    }
};

exports.addStockCorrection = async (req, res, next) => {
    try {
        let data = req.body;
        await Product.updateStock(data);
        res.status(201).json({
            message: "Stock has been updated successfully!",
        });
    } catch (error) {
        next(error);
    }
};

exports.getHistoryById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let history = await Product.getHistoryById(id);
        res.status(200).send(history);
    } catch (error) {
        next(error);
    }
};

// generate barcode
exports.generateBarcode = async (req, res, next) => {
    try {
        const barcode = await Product.generateBarcode();
        res.status(201).send(barcode);
    } catch (error) {
        next(error);
    }
};

// get expired products
exports.getExpiredProducts = async (req, res, next) => {
    try {
        let expiredProducts = await Product.getExpiredProducts();
        res.status(200).send(expiredProducts);
    } catch (error) {
        next(error);
    }
};
