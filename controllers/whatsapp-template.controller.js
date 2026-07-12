const WhatsappTemplate = require("../models/whatsapp-template.model");

// Locations a template can be assigned to (which screen it is offered on).
const ALLOWED_LOCATIONS = ["reminders", "reservations", "sell", "payment"];

// Variables are hardcoded by the system — users cannot create custom ones.
// `locations` restricts a variable to specific template locations; when omitted
// the variable is available everywhere.
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
		locations: ["reminders", "reservations"],
	},
	{
		key: "appointment_type",
		placeholder: "{{appointment_type}}",
		description: "Appointment type",
		locations: ["reminders", "reservations"],
	},
	{
		key: "appointment_datetime",
		placeholder: "{{appointment_datetime}}",
		description: "Appointment date and time",
		locations: ["reminders", "reservations"],
	},
	{
		key: "amount",
		placeholder: "{{amount}}",
		description: "Transaction amount",
		locations: ["sell", "payment"],
	},
	{
		key: "customer_balance",
		placeholder: "{{customer_balance}}",
		description: "Customer's current account balance",
		locations: ["sell", "payment"],
	},
	{
		key: "invoice_items",
		placeholder: "{{invoice_items}}",
		description: "List of items sold with quantity and price",
		locations: ["sell"],
	},
	{
		key: "current_datetime",
		placeholder: "{{current_datetime}}",
		description: "Current date and time",
	},
];

// Pull every {{placeholder}} out of the template text.
const extractPlaceholders = (text) => {
	const matches = text.match(/\{\{\s*([\w]+)\s*\}\}/g) || [];
	return matches.map((m) => m.replace(/\{\{\s*|\s*\}\}/g, ""));
};

// A variable is allowed when it exists and either has no location restriction
// or lists the template's location.
const isVariableAllowed = (key, location) => {
	const def = VARIABLE_LIST.find((v) => v.key === key);
	if (!def) return false;
	if (!def.locations) return true;
	return def.locations.includes(location);
};

// Return any placeholders that are not valid for the given location.
const findInvalidVariables = (text, location) => {
	const used = extractPlaceholders(text);
	return [...new Set(used.filter((v) => !isVariableAllowed(v, location)))];
};

// GET /api/whatsapp-templates  (optional ?activeOnly=true&location=reminders)
exports.getAllTemplates = async (req, res, next) => {
	try {
		const activeOnly = req.query.activeOnly === "true";
		const location = req.query.location;

		if (location && !ALLOWED_LOCATIONS.includes(location)) {
			return res.status(400).json({
				error: `location must be one of: ${ALLOWED_LOCATIONS.join(", ")}.`,
			});
		}

		const templates = await WhatsappTemplate.getAll(
			activeOnly,
			location || null,
		);
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
		const { name, message_template, location, is_active } = req.body;

		if (!name || !message_template) {
			return res
				.status(400)
				.json({ error: "name and message_template are required." });
		}

		if (!location) {
			return res.status(400).json({ error: "location is required." });
		}
		if (!ALLOWED_LOCATIONS.includes(location)) {
			return res.status(400).json({
				error: `location must be one of: ${ALLOWED_LOCATIONS.join(", ")}.`,
			});
		}

		const invalidVariables = findInvalidVariables(message_template, location);
		if (invalidVariables.length > 0) {
			return res
				.status(400)
				.json({ message: "Invalid template variables", invalidVariables });
		}

		const data = {
			name,
			message_template,
			location,
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
		const { name, message_template, location, is_active } = req.body;

		if (!name || !message_template) {
			return res
				.status(400)
				.json({ error: "name and message_template are required." });
		}

		if (!location) {
			return res.status(400).json({ error: "location is required." });
		}
		if (!ALLOWED_LOCATIONS.includes(location)) {
			return res.status(400).json({
				error: `location must be one of: ${ALLOWED_LOCATIONS.join(", ")}.`,
			});
		}

		const invalidVariables = findInvalidVariables(message_template, location);
		if (invalidVariables.length > 0) {
			return res
				.status(400)
				.json({ message: "Invalid template variables", invalidVariables });
		}

		const data = {
			name,
			message_template,
			location,
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
