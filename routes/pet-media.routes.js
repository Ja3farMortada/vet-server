const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/pet-media.controller");

router.get("/:pet_id", controller.getByPetId);
router.post("/", upload.single("image"), controller.create);
router.put("/:pet_id", upload.single("image"), controller.update);
router.delete("/:pet_id", controller.delete);

module.exports = router;
