const twilioClient = require("../config/twilio");

class Whatsapp {
	static async sendTemplate(to, messageContents) {
		const response = await twilioClient.messages.create({
			from: process.env.TWILIO_WHATSAPP_NUMBER,
			to: `whatsapp:${to}`,
			contentSid: process.env.CONTENT_SID,
			contentVariables: JSON.stringify({
				1: messageContents[0],
				2: messageContents[1],
				3: messageContents[2],
			}),
		});

		return response;
	}
}

// const sendWhatsAppMessage = async (to, messageContents) => {
// 	console.log(messageContents);

// 	try {
// 		const response = await twilioClient.messages.create({
// 			from: `whatsapp:+96176713012`,
// 			to: `whatsapp:${to}`,
// 			contentSid: "HX766ce927b690154c6bcf078267874869",
// 			contentVariables: JSON.stringify({
// 				1: messageContents[0],
// 				2: messageContents[1],
// 				3: messageContents[2],
// 			})
// 		});
// 		return response;
// 	} catch (error) {
// 		throw new Error(`Error sending message: ${error.message}`);
// 	}
// };

module.exports = Whatsapp;
