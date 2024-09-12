const Rate = require("../models/RateModel");

exports.getExchangeRate = async (req, res, next) => {
    try {
        let [rate] = await Rate.getRate();
        res.status(200).send(rate);
    } catch (error) {
        next(error);
    }
};

exports.addExchangeRate = async (req, res, next) => {
    let rate = req.body;
    try {
        let result = await Rate.addRate(rate);
        let [addedRate] = await Rate.getById(result.insertId);
        res.status(202).send(addedRate);
    } catch (error) {
        next(error);
    }
};

exports.getRecentRates = async (req, res, next) => {
    try {
        let rates = await Rate.getAll();
        res.status(200).send(rates);
    } catch (error) {
        next(error);
    }
};

exports.getRatesGraph = async (req, res, next) => {
    try {
        let year = req.params.year;
        let results = await Rate.getByYear(year);
        res.status(200).send(results);
    } catch (error) {
        next(error);
    }
};
