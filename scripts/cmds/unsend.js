const botMessages = [];

module.exports = {
	config: {
		name: "unsend",
		aliases: ["u", "r", "uns"],
		version: "2.0",
		role: 0,
		description: "Unsend bot messages (reply or stack delete)",
		category: "box chat"
	},

	onStart: async function ({ message, event, api, args }) {

		// --- DELETE BY REPLY ---
		if (event.messageReply) {
			if (event.messageReply.senderID != api.getCurrentUserID())
				return message.reply("Reply a bot message only.");

			return message.unsend(event.messageReply.messageID);
		}

		// --- STACK DELETE MODE ---
		if (args[0] === "S") {
			const count = parseInt(args[1]);
			if (!count || count <= 0)
				return message.reply("Give a valid number.");

			for (let i = 0; i < count && botMessages.length; i++) {
				const msgID = botMessages.pop();
				await message.unsend(msgID);
			}
			return;
		}

		// --- SIMPLE COMMAND ---
		if (args[0] === "Up") {
			const last = botMessages.pop();
			if (!last) return message.reply("No message to unsend.");
			return message.unsend(last);
		}
	},

	// Hook to store bot messages
	onChat: async function ({ event, api }) {
		if (event.senderID == api.getCurrentUserID()) {
			botMessages.push(event.messageID);
		}
	}
};