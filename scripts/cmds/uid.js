module.exports = {
	config: {
		name: "uid",
		aliases: ["id", "userid"],
		version: "2.0",
		role: 0,
		description: "Get user UID + profile link",
		category: "info",
		author: "Stacks"
	},

	onStart: async function ({ api, event, message }) {

		let target = event.messageReply
			? event.messageReply.senderID
			: event.senderID;

		try {
			const userInfo = await api.getUserInfo(target);
			const name = userInfo[target].name || "Unknown";

			const profileLink = `https://facebook.com/${target}`;

			return message.reply(
`🖤 𝙳𝙰𝚁𝙺 𝚂𝚃𝙰𝙲𝙺𝚂 UID

👤 Name: ${name}
🆔 UID: ${target}
🔗 Profile: ${profileLink}

💀 Status: ACTIVE NODE`
			);

		} catch (e) {
			return message.reply(
`🆔 UID: ${target}
🔗 Profile: https://facebook.com/${target}`
			);
		}
	}
};