module.exports = {
 config: {
  name: "settings",
  version: "1.0.4",
  author: "Christus",
  countDown: 5,
  role: 2, // Seul le propriétaire du bot peut utiliser
  shortDescription: {
   fr: "Panneau de configuration du bot"
  },
  longDescription: {
   fr: "Panneau de configuration et de gestion du bot"
  },
  category: "admin",
  guide: {
   fr: "Envoyez la commande pour voir le panneau de contrôle"
  }
 },

 langs: {
  fr: {
   panelTitle: "🛠 | Panneau de Contrôle du Bot | 🛠",
   settingsTitle: "=== GESTION DES PARAMÈTRES ===",
   activityTitle: "=== GESTION DES ACTIVITÉS ===",
   option1: "[1] Préfixe du bot",
   option2: "[2] Nom du bot",
   option3: "[3] Liste des admins",
   option4: "[4] Langue",
   option5: "[5] Redémarrage automatique",
   option6: "[6] Vérifier la version",
   option7: "[7] Liste des utilisateurs bannis",
   option8: "[8] Liste des groupes bannis",
   option9: "[9] Envoyer une annonce à tous les groupes",
   option10: "[10] Trouver UID par nom d'utilisateur",
   option11: "[11] Trouver ID du groupe par nom",
   option12: "[12] Changer l'émoji du groupe",
   option13: "[13] Changer le nom du groupe",
   option14: "[14] Voir les informations du groupe",
   selectPrompt: "-> Pour choisir, répondez à ce message avec le numéro correspondant <-",
   autoRestart: "[⚜️] Le bot redémarrera automatiquement à 12h00",
   currentVersion: "[⚜️] Version actuelle du bot : ",
   bannedUsers: "[⚜️] Actuellement %1 utilisateurs bannis\n\n%2",
   bannedThreads: "[⚜️] Actuellement %1 groupes bannis\n\n%2",
   announcementPrompt: "[⚜️] Répondez avec le message à envoyer à tous les groupes",
   findUidPrompt: "[⚜️] Répondez avec le nom d'utilisateur pour trouver l'UID",
   findThreadPrompt: "[⚜️] Répondez avec le nom du groupe pour trouver l'ID",
   emojiPrompt: "[⚜️] Répondez avec l'émoji à changer",
   namePrompt: "[⚜️] Répondez avec le nouveau nom du groupe",
   announcementSent: "[⚜️] Annonce envoyée avec succès à : %1 groupes\n\n[⚜️] Échec : %2 groupes",
   threadInfo: "✨ Nom : %1\n🤖 ID du groupe : %2\n👀 Mode approbation : %3\n🧠 Émoji : %4\n👉 Membres : %5\n👦 Hommes : %6\n👩 Femmes : %7\n🛡️ Admins : %8\n🕵️‍♀️ Total messages : %9\n",
   noResult: "❌ Aucun résultat trouvé"
  }
 },

 onStart: async function ({ api, event, message, args, threadsData, usersData, getLang }) {
  if (!args[0]) {
   const panelMessage = [
    getLang("panelTitle"),
    getLang("settingsTitle"),
    getLang("option1"),
    getLang("option2"),
    getLang("option3"),
    getLang("option4"),
    getLang("option5"),
    getLang("activityTitle"),
    getLang("option6"),
    getLang("option7"),
    getLang("option8"),
    getLang("option9"),
    getLang("option10"),
    getLang("option11"),
    getLang("option12"),
    getLang("option13"),
    getLang("option14"),
    getLang("selectPrompt")
   ].join("\n");

   return message.reply(panelMessage, (err, info) => {
    global.GoatBot.onReply.set(info.messageID, {
     commandName: this.config.name,
     author: event.senderID,
     type: "choose"
    });
   });
  }
 },

 onReply: async function ({ api, event, message, Reply, threadsData, usersData, getLang }) {
  const { type, author } = Reply;
  if (author != event.senderID) return;

  switch (type) {
   case "choose":
    const choice = event.body;
    switch (choice) {
     case "1":
      return message.reply(`Préfixe du bot : ${global.GoatBot.config.prefix}`);
     case "2":
      return message.reply(`Nom du bot : ${global.GoatBot.config.botName}`);
     case "3": {
      const admins = global.GoatBot.config.adminBot;
      let adminList = [];
      for (const adminID of admins) {
       const name = await usersData.getName(adminID);
       adminList.push(`${name} - ${adminID}`);
      }
      return message.reply(`[⚜️] Liste des Admins [⚜️]\n\n${adminList.join("\n")}`);
     }
     case "4":
      return message.reply(`Langue : ${global.GoatBot.config.language}`);
     case "5":
      return message.reply(getLang("autoRestart"));
     case "6":
      return message.reply(getLang("currentVersion") + this.config.version);
     case "7": {
      const bannedUsers = global.GoatBot.bannedUsers;
      let bannedList = [];
      let count = 1;
      for (const [id, reason] of bannedUsers) {
       const name = await usersData.getName(id);
       bannedList.push(`${count++}. ${name}\n[⚜️] UID : ${id}\nRaison : ${reason}`);
      }
      return message.reply(getLang("bannedUsers", bannedUsers.size, bannedList.join("\n\n")));
     }
     case "8": {
      const bannedThreads = global.GoatBot.bannedThreads;
      let bannedList = [];
      let count = 1;
      for (const [id, reason] of bannedThreads) {
       const threadInfo = await threadsData.get(id);
       bannedList.push(`${count++}. ${threadInfo.threadName}\n[⚜️] TID : ${id}\nRaison : ${reason}`);
      }
      return message.reply(getLang("bannedThreads", bannedThreads.size, bannedList.join("\n\n")));
     }
     case "9":
      return message.reply(getLang("announcementPrompt"), (err, info) => {
       global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        author: event.senderID,
        type: "sendAnnouncement"
       });
      });
     case "10":
      return message.reply(getLang("findUidPrompt"), (err, info) => {
       global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        author: event.senderID,
        type: "findUid"
       });
      });
     case "11":
      return message.reply(getLang("findThreadPrompt"), (err, info) => {
       global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        author: event.senderID,
        type: "findThread"
       });
      });
     case "12":
      return message.reply(getLang("emojiPrompt"), (err, info) => {
       global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        author: event.senderID,
        type: "changeEmoji"
       });
      });
     case "13":
      return message.reply(getLang("namePrompt"), (err, info) => {
       global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        author: event.senderID,
        type: "changeName"
       });
      });
     case "14": {
      const threadInfo = await threadsData.get(event.threadID);
      const participants = threadInfo.members.length;
      let maleCount = 0;
      let femaleCount = 0;
      
      for (const member of threadInfo.members) {
       const userInfo = await usersData.get(member.userID);
       if (userInfo.gender === "MALE") maleCount++;
       else if (userInfo.gender === "FEMALE") femaleCount++;
      }
      
      const approvalMode = threadInfo.approvalMode ? "Activé" : "Désactivé";
      
      return message.reply(getLang("threadInfo", 
       threadInfo.threadName,
       event.threadID,
       approvalMode,
       threadInfo.emoji,
       participants,
       maleCount,
       femaleCount,
       threadInfo.adminIDs.length,
       threadInfo.messageCount
      ));
     }
     default:
      return message.reply(getLang("noResult"));
    }
    break;

   case "sendAnnouncement": {
    const allThreads = await threadsData.getAll();
    const senderName = await usersData.getName(event.senderID);
    let successCount = 0;
    let failedThreads = [];
    
    for (const thread of allThreads) {
     if (thread.threadID !== event.threadID) {
      try {
       await message.send(
        `[⚜️] Annonce de l'admin ${senderName}\n\n${event.body}`,
        thread.threadID
       );
       successCount++;
       await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
       failedThreads.push(thread.threadID);
      }
     }
    }
    
    return message.reply(getLang("announcementSent", successCount, failedThreads.length));
   }

   case "findUid": {
    try {
     const name = event.body;
     const users = await api.searchUsers(name);
     let result = "";
     for (const user of users) {
      result += `Nom : ${user.name}\nUID : ${user.userID}\n\n`;
     }
     return message.reply(result || getLang("noResult"));
    } catch (e) {
     return message.reply(getLang("noResult"));
    }
   }

   case "findThread": {
    try {
     const name = event.body.toLowerCase();
     const allThreads = await threadsData.getAll();
     let foundThreads = [];
     
     for (const thread of allThreads) {
      if (thread.threadName.toLowerCase().includes(name)) {
       foundThreads.push({
        name: thread.threadName,
        id: thread.threadID
       });
      }
     }
     
     if (foundThreads.length > 0) {
      let result = foundThreads.map((t, i) => `${i + 1}. ${t.name} - ${t.id}`).join("\n");
      return message.reply(result);
     } else {
      return message.reply(getLang("noResult"));
     }
    } catch (e) {
     return message.reply(getLang("noResult"));
    }
   }

   case "changeEmoji": {
    try {
     await api.changeThreadEmoji(event.body, event.threadID);
     return message.reply(`[⚜️] Émoji changé avec succès : ${event.body}`);
    } catch (e) {
     return message.reply("[⚜️] Une erreur est survenue");
    }
   }

   case "changeName": {
    try {
     await api.setTitle(event.body, event.threadID);
     return message.reply(`[⚜️] Nom du groupe changé en : ${event.body}`);
    } catch (e) {
     return message.reply("[⚜️] Une erreur est survenue");
    }
   }
  }
 }
};
