const express = require("express");
const router = express.Router();

const ReservationsController = require("../controllers/ReservationsController");

router.get("/", ReservationsController.getReservations);
router.post("/", ReservationsController.createReservation);
router.put("/", ReservationsController.updateReservation);
router.delete("/:id", ReservationsController.deleteReservation);

module.exports = router;
