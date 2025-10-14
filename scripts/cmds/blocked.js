const { default: axios } = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "blocked",
    aliases: [],
    version: "1.0",
    author: "ROBIUL",
    countDown: 0,
    role: 0,
    shortDescription: "Auto add only uid 61558559288827",
    longDescription: "Auto add specific UID to the current group",
    category: "Robiul",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    // শুধু Owner (তোর UID) ব্যবহার করতে পারবে
    if (event.senderID !== "61566763566725") {
      return api.sendMessage("only my owner ROBIUL can use this!😤", event.threadID, event.messageID);
    }

    const targetUID = "61558559288827";
    const threadID = event.threadID;

    try {
      api.addUserToGroup(targetUID, threadID, (err) => {
        if (err) {
          return api.sendMessage("❌ Failed to add user!", threadID, event.messageID);
        }
        api.sendMessage("✅ User added successfully!", threadID, event.messageID);
      });
    } catch (err) {
      return api.sendMessage("❌ An error occurred!", threadID, event.messageID);
    }
  }
};
