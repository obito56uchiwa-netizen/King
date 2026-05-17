module.exports = {
	config: {
		name: "ping",
		aliases: ["p"], // 👈 utilise "p"
		version: "3.2",
		role: 0,
		description: "Dark Stacks system info",
		category: "system",
		author: "Stacks"
	},

	onStart: async function ({ api, event, message }) {

		const threadInfo = await api.getThreadInfo(event.threadID);

		const start = Date.now();
		await message.reply("🖤 scanning node...");
		const ping = Date.now() - start;

		// uptime
		const uptimeSec = process.uptime();
		const h = Math.floor(uptimeSec / 3600);
		const m = Math.floor((uptimeSec % 3600) / 60);
		const s = Math.floor(uptimeSec % 60);

		// group info
		const totalMembers = threadInfo.participantIDs.length;
		const totalAdmins = threadInfo.adminIDs.length;

		// status
		let status = "LOW";
		if (ping > 150) status = "MEDIUM";
		if (ping > 300) status = "HIGH";

		const box =
`╔════════════════════╗
   🖤 DARK STACKS SYS
╚════════════════════╝

⚡ PING
━━━━━━━━━━━━━━
⚡ ${ping} ms
📶 ${status}

⏱ UPTIME
━━━━━━━━━━━━━━
🕒 ${h}h ${m}m ${s}s

👥 GROUPE
━━━━━━━━━━━━━━
👤 Membres: ${totalMembers}
🛡 Admins: ${totalAdmins}

🤖 DARK STACK'S BOT
💀 NODE: ACTIVE
╚════════════════════╝`;

		return message.reply(box);
	}
};