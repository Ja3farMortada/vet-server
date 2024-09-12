const express = require("express");
const router = express.Router();

const CategoryController = require("../controllers/CategoryController");
const ProductController = require("../controllers/ProductController");
const UnitController = require("../controllers/UnitController");
const RateController = require("../controllers/RateController");

router.get("/categories", CategoryController.getCategories);
router.post("/categories", CategoryController.createCategory);
router.put("/categories", CategoryController.updateCategory);
router.delete("/categories/:id", CategoryController.deleteCategory);
router.patch("/categories/sort", CategoryController.sortCategories);

// units
router.get("/units", UnitController.getUnits);
router.post("/units", UnitController.createUnit);
router.put("/units", UnitController.updateUnit);
router.delete("/units/:id", UnitController.deleteUnit);

router.get("/items", ProductController.getAllProducts);
router.get("/items/:category_id", ProductController.getByCategory);
router.get("/item/:barcode", ProductController.getByBarcode);
router.post("/items", ProductController.createProduct);
router.put("/items", ProductController.updateProduct);
router.delete("/items/:id", ProductController.deleteProduct);
router.post("/correction", ProductController.addStockCorrection);
router.get("/history/:id", ProductController.getHistoryById);

router.get("/rate", RateController.getExchangeRate);
router.get("/rates", RateController.getRecentRates);
router.get("/rates/graph/:year", RateController.getRatesGraph);
router.post("/rate", RateController.addExchangeRate);

module.exports = router;
