const express = require("express");
const router = express.Router();

const RemindersController = require("../controllers/RemindersController");

router.get("/", RemindersController.getReminders);
router.post("/", RemindersController.createReminder);
router.put("/", RemindersController.updateReminder);
router.delete("/:id", RemindersController.deleteReminder);

router.patch("/notify", RemindersController.markNotified);
router.patch("/complete", RemindersController.markCompleted);

module.exports = router;
