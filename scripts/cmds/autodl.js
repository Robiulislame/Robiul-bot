const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API_URL = "https://toshiroxautodl.onrender.com/download";

// Fancy platform name
function detectPlatform(url) {
  if (url.includes("tiktok.com")) return "𝙏𝙞𝙠𝙏𝙤𝙠";
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "𝙁𝙖𝙘𝙚𝙗𝙤𝙤𝙠";
  if (url.includes("instagram.com")) return "𝙄𝙣𝙨𝙩𝙖𝙜𝙧𝙖𝙢";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "𝙔𝙤𝙪𝙏𝙪𝙗𝙚";
  if (url.includes("twitter.com") || url.includes("x.com")) return "𝙓 / 𝙏𝙬𝙞𝙩𝙩𝙚𝙧";
  if (url.includes("pin.it") || url.includes("pinterest.com")) return "𝙋𝙞𝙣𝙩𝙚𝙧𝙚𝙨𝙩";
  return "𝙐𝙣𝙠𝙣𝙤𝙬𝙣";
}

module.exports = {
  config: {
    name: "autodl",
    version: "3.1",
    author: "Toshiro Editz",
    countDown: 0,
    role: 0,
    description: {
      en: "Auto download videos from TikTok, Facebook, Instagram, YouTube, X/Twitter, Pinterest and more.",
    },
    category: "media",
    guide: {
      en: "[video_link]",
    },
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const text = event.body || "";

    const SUPPORTED = [
      "https://vt.tiktok.com",
      "https://www.tiktok.com/",
      "https://vm.tiktok.com",
      "https://www.facebook.com",
      "https://fb.watch",
      "https://www.instagram.com/",
      "https://youtu.be/",
      "https://youtube.com/",
      "https://x.com/",
      "https://twitter.com/",
      "https://pin.it/",
      "https://www.pinterest.com/",
    ];

    if (!SUPPORTED.some((u) => text.startsWith(u))) return;

    api.setMessageReaction("🐤", event.messageID, () => {}, true);

    try {
      await fs.ensureDir(path.join(__dirname, "cache"));
      const cachePath = path.join(__dirname, "cache", `video_${Date.now()}.mp4`);

      const { data } = await axios.get(`${API_URL}?url=${encodeURIComponent(text)}`);

      if (!data.status) {
        api.setMessageReaction("❎", event.messageID, () => {}, true);
        return api.sendMessage(
          `❌ Failed: ${data.message || "Could not download video"}`,
          event.threadID,
          event.messageID
        );
      }

      const downloadUrl = data.high_quality || data.video || data.url;

      const videoBuffer = (
        await axios.get(downloadUrl, { responseType: "arraybuffer" })
      ).data;

      await fs.writeFile(cachePath, Buffer.from(videoBuffer));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const platform = detectPlatform(text);

      const messageBody =
        `✨ 𝙃𝙚𝙧𝙚 𝙞𝙨 𝙮𝙤𝙪𝙧 ${platform} 𝙫𝙞𝙙𝙚𝙤\n\n` +
        `📌 𝙏𝙞𝙩𝙡𝙚: ${data.title || "Unknown"}\n` +
        `🌐 𝙋𝙡𝙖𝙩𝙛𝙤𝙧𝙢: ${platform}\n` +
        `⚡ 𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝙗𝙮 𝙏𝙤𝙨𝙝𝙞𝙧𝙤 𝙀𝙙𝙞𝙩𝙯`;

      api.sendMessage(
        {
          body: messageBody,
          attachment: fs.createReadStream(cachePath),
        },
        event.threadID,
        () => fs.unlinkSync(cachePath),
        event.messageID
      );
    } catch (err) {
      console.error("AutoDL Error:", err);
      api.setMessageReaction("❎", event.messageID, () => {}, true);
      api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
  },
};
