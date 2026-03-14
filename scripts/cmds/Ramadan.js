module.exports = {
  config: {
    name: "iftar",
    aliases: ["ramadan", "roza"],
    version: "3.1.0",
    author: "RAKIB",
    countDown: 5,
    role: 0,
		nixPrefix: true,
    shortDescription: "Ramadan Iftar Time",
    longDescription: "Premium Ramadan Interface",
    category: "Islamic",
    guide: "{pn} [city] --c [color]"
  },

  onStart: async function ({ api, event, args }) {

    const axios = require("axios");
    const dipto = "https://api.noobs-api.rf.gd/dipto";

    let city = args[0] || "Dhaka";
    let color = args.includes("--c")
      ? args[args.indexOf("--c") + 1]
      : "white";

    let url = `${dipto}/ifter?city=${encodeURIComponent(city)}&color=${encodeURIComponent(color)}`;

    const boldSerif = (text) => {
      const letters = {
        'A':'𝐀','B':'𝐁','C':'𝐂','D':'𝐃','E':'𝐄','F':'𝐅','G':'𝐆','H':'𝐇','I':'𝐈','J':'𝐉','K':'𝐊','L':'𝐋','M':'𝐌','N':'𝐍','O':'𝐎','P':'𝐏','Q':'𝐐','R':'𝐑','S':'𝐒','T':'𝐓','U':'𝐔','V':'𝐕','W':'𝐖','X':'𝐗','Y':'𝐘','Z':'𝐙',
        'a':'𝐚','b':'𝐛','c':'𝐜','d':'𝐝','e':'𝐞','f':'𝐟','g':'𝐠','h':'𝐡','i':'𝐢','j':'𝐣','k':'𝐤','l':'𝐥','m':'𝐦','n':'𝐧','o':'𝐨','p':'𝐩','q':'𝐪','r':'𝐫','s':'𝐬','t':'𝐭','u':'𝐮','v':'𝐯','w':'𝐰','x':'𝐱','y':'𝐲','z':'𝐳'
      };
      return text.split('').map(char => letters[char] || char).join('');
    };

    try {

      const { data } = await axios.get(url);

      if (!data || !data.today) {
        return api.sendMessage("⚠️ Invalid city name!", event.threadID, event.messageID);
      }

      let msg =
`🌙 ${boldSerif("Ramadan Kareem")}
◈━━━━━━━━━━━━━━━◈

📍 ${boldSerif("CITY")}: ${data.city.toUpperCase()}

｢ ${boldSerif("TODAY'S TIMING")} ｣
🌅 ${boldSerif("Sehri Ends")} : ${data.today.sehri}
🕌 ${boldSerif("Fajr Time")}  : ${data.today.fajr}
🌆 ${boldSerif("Iftar Time")} : ${data.today.iftar}

⏳ ${boldSerif("REMAINING TIME")}
◽ ${boldSerif("Sehri")}: ${data.sahriRemain}
◽ ${boldSerif("Iftar")}: ${data.iftarRemain}

📅 ${boldSerif("TOMORROW PLAN")}
» ${boldSerif("Sehri")}: ${data.tomorrow.sehri}
» ${boldSerif("Iftar")}: ${data.tomorrow.iftar}
» ${boldSerif("Date")}: ${data.tomorrowDate}

⏰ ${boldSerif("Current Time")}: ${data.currentTime}
◈━━━━━━━━━━━━━━━◈
🤲 ${boldSerif("DUA (IFTAR)")}
"Allahumma laka sumtu wa ala rizqika aftartu."`;

      const img = await axios.get(data.imgUrl, { responseType: "stream" });

      return api.sendMessage(
        {
          body: msg,
          attachment: img.data
        },
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.log(err);
      return api.sendMessage("❌ Connection failed! Try again later.", event.threadID, event.messageID);
    }
  }
};
