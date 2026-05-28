const express = require("express");
const router = express.Router();
const controller = require("../controllers/settings.controller");

router.get("/reservation-options", controller.getAllReservationOptions);
router.post("/reservation-options", controller.createReservationOption);
router.put("/reservation-options/:id", controller.updateReservationOption);
router.delete("/reservation-options/:id", controller.deleteReservationOption);

module.exports = router;
