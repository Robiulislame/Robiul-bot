const fs = require('fs');

module.exports = {
  config: {
    name: "file",
    aliases: ["files"],
    version: "1.0",
    author: "ROBIUL",
    countDown: 5,
    role: 0,
    shortDescription: "Send bot script",
    longDescription: "Send specified bot file content",
    category: "𝗢𝗪𝗡𝗘𝗥",
    guide: "{pn} fileName. Ex: .{pn} fileName",
  },

  onStart: async function ({ message, args, api, event }) {
    const allowedUsers = ["61584736888242"]; // শুধুমাত্র রবিউল ব্যবহার করতে পারবে
    if (!allowedUsers.includes(event.senderID)) {
      return api.sendMessage(
        "বলদ, এই কমান্ড শুধু রবিউল বস ইউজ করতে পারবে.😹",
        event.threadID,
        event.messageID
      );
    }

    const fileName = args[0];
    if (!fileName) {
      return api.sendMessage(
        "Please provide a file name. উদাহরণ: .file owner",
        event.threadID,
        event.messageID
      );
    }

    const filePath = `${__dirname}/${fileName}.js`;
    if (!fs.existsSync(filePath)) {
      return api.sendMessage(
        `File not found: ${fileName}.js`,
        event.threadID,
        event.messageID
      );
    }

    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      api.sendMessage({ body: fileContent }, event.threadID);
    } catch (err) {
      console.error("Error reading file:", err);
      api.sendMessage(
        `ফাইল পড়তে সমস্যা হয়েছে: ${fileName}.js`,
        event.threadID,
        event.messageID
      );
    }
  },
};
