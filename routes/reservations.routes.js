const express = require("express");
const router = express.Router();

const ReservationsController = require("../controllers/ReservationsController");

router.get("/", ReservationsController.getReservations);
// static path — declared before param routes so it isn't shadowed
router.get("/search", ReservationsController.searchReservations);
router.get("/pet/:pet_id", ReservationsController.getReservationsByPetId);
router.post("/", ReservationsController.createReservation);
router.put("/", ReservationsController.updateReservation);
router.delete("/:id", ReservationsController.deleteReservation);

module.exports = router;
