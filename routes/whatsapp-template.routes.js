const express = require("express");
const router = express.Router();

const WhatsappTemplateController = require("../controllers/whatsapp-template.controller");

// must be registered before "/:id" so Express doesn't treat "variables" as an id
router.get("/variables/list", WhatsappTemplateController.getSupportedVariables);

router.get("/", WhatsappTemplateController.getAllTemplates);
router.get("/:id", WhatsappTemplateController.getTemplateById);

router.post("/", WhatsappTemplateController.createTemplate);
router.put("/:id", WhatsappTemplateController.updateTemplate);
router.delete("/:id", WhatsappTemplateController.deleteTemplate);

module.exports = router;
