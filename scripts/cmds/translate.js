const axios = require("axios");

module.exports = {
  config: {
    name: "translate",
    aliases: ["t"], // 👈 juste ça
    version: "1.5",
    author: "STACK'S",
    countDown: 5,
    role: 0,
    description: "Translate text",
    category: "utility"
  },

  langs: {
    en: {
      translateTo: "🌐 Translate from %1 to %2"
    },
    vi: {
      translateTo: "🌐 Dịch từ %1 sang %2"
    }
  },

  onStart: async function ({ message, event, args, threadsData, getLang }) {
    let body = event.body || "";
    let targetLang = await threadsData.get(event.threadID, "data.lang") || "en";
    let content = body;

    const sep = body.lastIndexOf("->");

    if (sep !== -1) {
      content = body.slice(0, sep).trim();
      targetLang = body.slice(sep + 2).trim();
    }

    if (!content) return message.reply("No text provided.");

    const result = await translate(content, targetLang);

    return message.reply(
      `${result.text}\n\n${getLang("translateTo", result.lang, targetLang)}`
    );
  }
};

async function translate(text, lang) {
  try {
    const res = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`
    );

    return {
      text: res.data[0].map(x => x[0]).join(""),
      lang: res.data[2]
    };
  } catch (err) {
    return {
      text: "Translation failed.",
      lang: "err"
    };
  }
}