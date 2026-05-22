const express = require("express");
const router = express.Router();

const ReminderController = require("../controllers/reminder.controller");

router.get("/", ReminderController.getAllReminders);
router.get("/upcoming", ReminderController.getUpcomingReminders);
router.get("/pet/:pet_id", ReminderController.getRemindersByPetId);
router.get("/account/:account_id", ReminderController.getRemindersByAccountId);

router.post("/", ReminderController.createReminder);
router.put("/:id", ReminderController.updateReminder);
router.delete("/:id", ReminderController.deleteReminder);

router.put("/:id/notify", ReminderController.markAsNotified);
router.put("/:id/complete", ReminderController.markAsCompleted);

module.exports = router;
