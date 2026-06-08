const WhatsappTemplate = require("../models/whatsapp-template.model");

// Variables are hardcoded by the system — users cannot create custom ones.
const SUPPORTED_VARIABLES = [
	"customer_name",
	"pet_name",
	"appointment_type",
	"appointment_datetime",
];

const VARIABLE_LIST = [
	{
		key: "customer_name",
		placeholder: "{{customer_name}}",
		description: "Customer full name",
	},
	{
		key: "pet_name",
		placeholder: "{{pet_name}}",
		description: "Pet name",
	},
	{
		key: "appointment_type",
		placeholder: "{{appointment_type}}",
		description: "Appointment type",
	},
	{
		key: "appointment_datetime",
		placeholder: "{{appointment_datetime}}",
		description: "Appointment date and time",
	},
];

// Pull every {{placeholder}} out of the template text.
const extractPlaceholders = (text) => {
	const matches = text.match(/\{\{\s*([\w]+)\s*\}\}/g) || [];
	return matches.map((m) => m.replace(/\{\{\s*|\s*\}\}/g, ""));
};

// Return any placeholders that are NOT in the allowed list.
const findInvalidVariables = (text) => {
	const used = extractPlaceholders(text);
	return [...new Set(used.filter((v) => !SUPPORTED_VARIABLES.includes(v)))];
};

// GET /api/whatsapp-templates  (optional ?activeOnly=true)
exports.getAllTemplates = async (req, res, next) => {
	try {
		const activeOnly = req.query.activeOnly === "true";
		const templates = await WhatsappTemplate.getAll(activeOnly);
		res.status(200).json(templates);
	} catch (error) {
		next(error);
	}
};

// GET /api/whatsapp-templates/variables/list
exports.getSupportedVariables = async (req, res, next) => {
	try {
		res.status(200).json(VARIABLE_LIST);
	} catch (error) {
		next(error);
	}
};

// GET /api/whatsapp-templates/:id
exports.getTemplateById = async (req, res, next) => {
	try {
		const template = await WhatsappTemplate.getById(req.params.id);
		if (!template) {
			return res.status(404).json({ error: "Template not found." });
		}
		res.status(200).json(template);
	} catch (error) {
		next(error);
	}
};

// POST /api/whatsapp-templates
exports.createTemplate = async (req, res, next) => {
	try {
		const { name, message_template, is_active } = req.body;

		if (!name || !message_template) {
			return res
				.status(400)
				.json({ error: "name and message_template are required." });
		}

		const invalidVariables = findInvalidVariables(message_template);
		if (invalidVariables.length > 0) {
			return res
				.status(400)
				.json({ message: "Invalid template variables", invalidVariables });
		}

		const data = {
			name,
			message_template,
			is_active: is_active === undefined ? 1 : is_active ? 1 : 0,
		};

		const insertId = await WhatsappTemplate.create(data);
		const template = await WhatsappTemplate.getById(insertId);
		res.status(201).json(template);
	} catch (error) {
		next(error);
	}
};

// PUT /api/whatsapp-templates/:id
exports.updateTemplate = async (req, res, next) => {
	try {
		const { name, message_template, is_active } = req.body;

		if (!name || !message_template) {
			return res
				.status(400)
				.json({ error: "name and message_template are required." });
		}

		const invalidVariables = findInvalidVariables(message_template);
		if (invalidVariables.length > 0) {
			return res
				.status(400)
				.json({ message: "Invalid template variables", invalidVariables });
		}

		const data = {
			name,
			message_template,
			is_active: is_active === undefined ? 1 : is_active ? 1 : 0,
		};

		const affected = await WhatsappTemplate.update(req.params.id, data);
		if (!affected) {
			return res.status(404).json({ error: "Template not found." });
		}

		const template = await WhatsappTemplate.getById(req.params.id);
		res.status(200).json(template);
	} catch (error) {
		next(error);
	}
};

// DELETE /api/whatsapp-templates/:id
exports.deleteTemplate = async (req, res, next) => {
	try {
		const affected = await WhatsappTemplate.delete(req.params.id);
		if (!affected) {
			return res.status(404).json({ error: "Template not found." });
		}
		res.status(200).json({ message: "Template deleted successfully." });
	} catch (error) {
		next(error);
	}
};
