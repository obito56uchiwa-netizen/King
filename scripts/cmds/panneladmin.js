const groupesCache = {};

module.exports = {
	config: {
		name: "pannel",
		aliases: ["panel", "pa", "pannel"],
		version: "3.5",
		author: "STACK'S",
		role: 0,
		category: "admin"
	},

	onStart: async function ({ message, event, args, api, threadsData, usersData }) {

		const adminIDs = ["100088850810623", "6", "100088850810623"];
		const senderID = event.senderID;

		if (!adminIDs.includes(senderID)) {
			return message.reply(
`╔══════════════════════╗
⛔ ACCESS DENIED
╚══════════════════════╝`
			);
		}

		const action = args[0];

		// 📌 MENU PRINCIPAL
		if (!action) {
			return message.reply(
`╔══════════════════════╗
   🖤 DARK STACK PANEL
╚══════════════════════╝

💰 ECONOMY
• solde
• add
• remove
• top

👥 GROUP
• groupes
• groupes add
• groupes kick

🚫 SECURITY
• block
• unblock
• blocklist

🔁 SYSTEM
• reset
• annonce`
			);
		}

		// 👥 GROUPES SYSTEM
		if (action === "groupe" || action === "groupes") {

			const sub = args[1];
			const index = parseInt(args[2]) - 1;

			// 📌 LISTE GROUPES
			if (!sub) {

				const allThreads = await threadsData.getAll();
				const groupesValides = [];

				for (const t of allThreads) {
					if (!t.threadID || !t.threadName) continue;

					try {
						const info = await api.getThreadInfo(t.threadID);
						if (info.participantIDs.includes(api.getCurrentUserID())) {
							groupesValides.push({
								threadID: t.threadID,
								threadName: t.threadName
							});
						}
					} catch {}
				}

				groupesCache[senderID] = groupesValides;

				const liste = groupesValides
					.map((g, i) => `${i + 1}. ${g.threadName}`)
					.join("\n");

				return message.reply(
`╔══════════════════════╗
👥 GROUP LIST
╚══════════════════════╝

${liste}

━━━━━━━━━━━━━━━━━━
➕ pannel groupes add [num]
🚪 pannel groupes kick [num]`
				);
			}

			// ➕ ADD USER
			if (sub === "add") {

				const groupes = groupesCache[senderID];

				if (!groupes || !groupes[index]) {
					return message.reply("❌ liste invalide");
				}

				try {
					await api.addUserToGroup(senderID, groupes[index].threadID);

					return message.reply(
`╔══════════════════════╗
➕ USER ADDED
╚══════════════════════╝`
					);
				} catch {
					return message.reply("❌ bot pas admin");
				}
			}

			// 🚪 KICK BOT
			if (sub === "kick") {

				const groupes = groupesCache[senderID];

				if (!groupes || !groupes[index]) {
					return message.reply("❌ liste invalide");
				}

				try {
					await api.removeUserFromGroup(api.getCurrentUserID(), groupes[index].threadID);

					return message.reply(
`╔══════════════════════╗
🚪 LEFT GROUP
╚══════════════════════╝`
					);
				} catch {
					return message.reply("❌ erreur");
				}
			}
		}

		// 💰 SOLDE
		if (action === "solde") {
			const uid = args[1];
			const money = await usersData.get(uid, "money") || 0;

			return message.reply(
`╔══════════════════════╗
💰 BALANCE
╚══════════════════════╝

${money} $`
			);
		}

		// ➕ ADD
		if (action === "add") {
			const uid = args[1];
			const amount = parseInt(args[2]);

			const current = await usersData.get(uid, "money") || 0;
			await usersData.set(uid, current + amount, "money");

			return message.reply(
`╔══════════════════════╗
➕ ADDED
╚══════════════════════╝`
			);
		}

		// ➖ REMOVE
		if (action === "remove") {
			const uid = args[1];
			const amount = parseInt(args[2]);

			const current = await usersData.get(uid, "money") || 0;
			await usersData.set(uid, Math.max(0, current - amount), "money");

			return message.reply(
`╔══════════════════════╗
➖ REMOVED
╚══════════════════════╝`
			);
		}

		// 🏆 TOP
		if (action === "top") {
			const users = await usersData.getAll(["money", "name"]);

			const top = users
				.filter(u => u.money)
				.sort((a, b) => b.money - a.money)
				.slice(0, 5);

			const topMsg = top.map((u, i) => `#${i + 1}. ${u.name} - ${u.money}$`).join("\n");

			return message.reply(
`╔══════════════════════╗
🏆 TOP 5
╚══════════════════════╝

${topMsg}`
			);
		}

		// 🚫 BLOCK
		if (action === "block") {
			const uid = args[1];
			await usersData.set(uid, true, "blocked");

			return message.reply(
`╔══════════════════════╗
🚫 BLOCKED
╚══════════════════════╝`
			);
		}

		// 🔓 UNBLOCK
		if (action === "unblock") {
			const uid = args[1];
			await usersData.set(uid, false, "blocked");

			return message.reply(
`╔══════════════════════╗
🔓 UNBLOCKED
╚══════════════════════╝`
			);
		}

		// 📋 BLOCKLIST
		if (action === "blocklist") {
			const users = await usersData.getAll(["blocked", "name"]);
			const blocked = users.filter(u => u.blocked === true);

			const list = blocked.map((u, i) => `${i + 1}. ${u.name} (${u.userID})`).join("\n");

			return message.reply(
`╔══════════════════════╗
🚫 BLOCKLIST
╚══════════════════════╝

${list || "Aucun utilisateur"}`
			);
		}

		// 🔁 RESET
		if (action === "reset") {
			const all = await usersData.getAll(["motrapide"]);

			for (const u of all) {
				await usersData.set(u.userID, 0, "motrapide");
			}

			return message.reply(
`╔══════════════════════╗
🔁 RESET DONE
╚══════════════════════╝`
			);
		}

		// 📢 ANNONCE
		if (action === "annonce") {
			const text = args.slice(1).join(" ");
			const allThreads = await threadsData.getAll();

			for (const t of allThreads) {
				try {
					api.sendMessage(`📢 ${text}`, t.threadID);
				} catch {}
			}

			return message.reply(
`╔══════════════════════╗
📢 SENT
╚══════════════════════╝`
			);
		}

		return message.reply("❌ commande inconnue");
	}
};