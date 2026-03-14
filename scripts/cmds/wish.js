const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "wish",
    version: "2.0.0",
    author: "ROBIUL",
    countDown: 5,
    role: 0,
    category: "happy",
    shortDescription: {
      en: "Generates a birthday wish image with user profile picture.",
      bn: "ব্যবহারকারীর প্রোফাইল পিকচার দিয়ে জন্মদিনের উইশ ইমেজ তৈরি করে।"
    },
    guide: {
      en: "{p}wish or {p}wish @mention",
      bn: "{p}wish অথবা {p}wish @mention"
    }
  },

  onStart: async function ({ args, message, event, usersData }) {
    const { senderID, threadID, messageID, mentions } = event;
    const targetID = Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : senderID;
    
    try {
      const userData = await usersData.get(targetID);
      const name = userData.name;

      const pathImg = path.join(__dirname, "cache", `wish_${targetID}.png`);
      const pathAvt = path.join(__dirname, "cache", `avt_${targetID}.png`);

      const backgroundURL = "https://i.imgur.com/lRpr6kd.jpeg";
      const avatarURL = `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // ইমেজ ডাউনলোড
      const [bgRes, avtRes] = await Promise.all([
        axios.get(backgroundURL, { responseType: "arraybuffer" }),
        axios.get(avatarURL, { responseType: "arraybuffer" })
      ]);

      fs.writeFileSync(pathImg, Buffer.from(bgRes.data));
      fs.writeFileSync(pathAvt, Buffer.from(avtRes.data));

      const baseImage = await loadImage(pathImg);
      const baseAvt = await loadImage(pathAvt);

      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      // ড্রয়িং লজিক
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // প্রোফাইল পিকচার পজিশন (আপনার আগের কোড অনুযায়ী)
      ctx.drawImage(baseAvt, 300, 150, 250, 250);

      // নাম লেখার লজিক
      ctx.font = "bold 30px Arial"; // ফন্ট একটু বড় ও বোল্ড করা হয়েছে ভালো দেখানোর জন্য
      ctx.fillStyle = "#1878F3";
      ctx.textAlign = "center";
      ctx.fillText(name, canvas.width / 2, 520); 

      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      const msgBody = `╭━─━─━─≪robiul-bot≫─━─━─━❯❯\n\n🎉🎁𝐇𝐀𝐏𝐏𝐘🎊𝐁𝐈𝐑𝐓𝐇𝐃𝐀𝐘🎁🎉\n\n━━━━━━━━━━━━━━━━━━━━━\n\n╔⏤⏤╝ ${name} ╚⏤⏤╗\n\n━━━━━━━━━━━━━━━━━━━━━\nhappy happy day today is your birthday, happy walk, happy talk, happy every moment and every day, happy birthday\n━━━━━━━━━━━━━━━━━━━━━\nশুভ শুভ শুভদিন আজ তোমার জন্মদিন, শুভ হোক পথচলা, অটুট হোক কথাবলা, শুভ হোক তোমার প্রতিমুহূর্ত আর প্রতিদিন, শুভ জন্মদিন\n━━━━━━━━━━━━━━━━━━━━━\n\n╰━─━─━─≪𝗝𝗢𝗬-𝗕𝗢𝗧≫─━─━─━❯❯`;

      await message.reply({
        body: msgBody,
        attachment: fs.createReadStream(pathImg)
      });

      // ফাইল ডিলিট করা
      fs.unlinkSync(pathImg);
      fs.unlinkSync(pathAvt);

    } catch (error) {
      console.error(error);
      return message.reply("ইমেজ তৈরি করার সময় একটি সমস্যা হয়েছে।");
    }
  }
};
    
