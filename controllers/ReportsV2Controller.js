const ReportsV2 = require("../models/ReportsV2Model");

// Every handler takes { from, to, ...pageParams } in the body and returns one
// render-ready aggregate for its page.
const handler = (method, requiresRange = true) => async (req, res, next) => {
    try {
        const body = req.body || {};
        if (requiresRange && (!body.from || !body.to)) {
            return res.status(400).json({ message: "from and to are required" });
        }
        const data = await ReportsV2[method](body);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

exports.getOverview = handler("getOverview");
exports.getFinancial = handler("getFinancial");
exports.getSegments = handler("getSegments");
exports.getProductsTable = handler("getProductsTable");
exports.getProductsInsights = handler("getProductsInsights");
exports.getProductHistory = handler("getProductHistory");
exports.getDiscounts = handler("getDiscounts");
exports.getHeatmap = handler("getHeatmap");
exports.getInventory = handler("getInventory", false);
