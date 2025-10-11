module.exports = {
  config: {
    name: "iloveu",
    version: "2.0.2",
    author: "ROBIUL",
    role: 0,
    shortDescription: {
      en: "Replies when someone says 'I love you'"
    },
    longDescription: {
      en: "Automatically replies when a user says 'I love you' or similar messages."
    },
    category: "fun",
    guide: {
      en: "Just say 'I love you' or 'I love u' — the bot will reply 😻"
    }
  },

  // 🟢 যখন কেউ চ্যাটে কিছু লেখে
  onChat: function({ event, api }) {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const text = body.toLowerCase().trim();

    // 💌 "I love you" জাতীয় শব্দ চেক
    const triggers = [
      "i love you",
      "i love u",
      "love you",
      "love u",
      "ami tomake bhalobashi",
      "আমি তোমাকে ভালোবাসি"
    ];

    if (triggers.includes(text)) {
      const replyList = [
        "হুম... বস রবিউলও তোমাকে ভালোবাসে 😇💖",
        "তুমি বললে আমি গলেই গেলাম 😻",
        "এই ভালোবাসা কিন্তু একদম সত্যি 💞",
        "আহা! তোমার ভালোবাসা পেয়ে মন ভরে গেলো 😍"
      ];

      const randomReply = replyList[Math.floor(Math.random() * replyList.length)];
      api.sendMessage(randomReply, threadID, messageID);
    }
  },

  // 🧠 যখন কেউ সরাসরি কমান্ড চালাবে (যেমন 'iloveu')
  onStart: function({ api, event }) {
    api.sendMessage("বলো প্রিয়... 💖 তুমি কি আমাকেও ভালোবাসো? 😚", event.threadID, event.messageID);
  }
};
