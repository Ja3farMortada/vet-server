const express = require("express");
const router = express.Router();

const PetsController = require("../controllers/PetsController");

router.get("/", PetsController.getAllPets);
router.post("/search", PetsController.fetchPets);
router.post("/", PetsController.createPet);
router.put("/", PetsController.updatePet);
router.delete('/:id', PetsController.deletePet)

router.get("/history/:id", PetsController.fetchMedicalHistory);
router.post("/history", PetsController.createMedicalHistory);
router.put("/history", PetsController.updateMedicalHistory);
router.delete("/history/:id", PetsController.deleteMedicalHistory);

module.exports = router;
