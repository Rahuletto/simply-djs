const Discord = require("discord.js");
const fetch = require("node-fetch");

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {import('../index').chatbotOptions} options
 */

async function chatbot(client, message, options = {}) {
  if (message.author.bot) return;
  if (options && options.toggle === false) return;


  // make sure channel is always a array
  /** @type {string[]} */
  let channels = [];
  if (Array.isArray(options.chid)) options.chid;
  else channels.push(options.chid);

  try {
    //Check that every ID is a valid channelID
    for (let channelID of channels) {
      const ch = client.channels.cache.get(channelID);
      if (!ch)
        throw new Error(
          `INVALID_CHANNEL_ID: ${channelID}. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission. Go to https://discord.com/invite/3JzDV9T5Fn to get support`
        );
    };

    //Return if the channel of the message is not a chatbot channel
    if (!channels.includes(message.channel.id)) return;

    const botName = client.user.username,
      developer = "Rahuletto#0243",
      ranges = [
        "\ud83c[\udf00-\udfff]", // U+1F300 to U+1F3FF
        "\ud83d[\udc00-\ude4f]", // U+1F400 to U+1F64F
        "\ud83d[\ude80-\udeff]" // U+1F680 to U+1F6FF
      ];

    let input = message.content.replace(
      new RegExp(ranges.join("|"), "g"),
      "."
    );


    //Replacing Emojis
    const hasEmoteRegex = /<a?:.+:\d+>/gm;
    const emoteRegex = /<:.+:(\d+)>/gm;
    const animatedEmoteRegex = /<a:.+:(\d+)>/gm;

    const emoj = message.content.match(hasEmoteRegex);

    input = input
      .replace(emoteRegex.exec(emoj), "")
      .replace(animatedEmoteRegex.exec(emoj), "");

    // Using await instead of .then 
    const jsonRes = await fetch(
      `https://api.affiliateplus.xyz/api/chatbot?message=${input}&botname=${botName}&ownername=${developer}&user=${message.author.id}`
    )
      .then((res) => res.json()) // Parsing the JSON
      .catch((err) => message.reply({ content: `Error: ${err}` })); //Catch errors that happen while fetching

    const chatbotReply = jsonRes.message
      .replace(/@everyone/g, "`@everyone`") //RegExp with g Flag will replace every @everyone instead of just the first
      .replace(/@here/g, "`@here`");

    await message.reply({
      content: chatbotReply,
      allowedMentions: { repliedUser: false }
    });
  } catch (err) {
    console.log(`Error Occured. | chatbot | Error: ${err.stack}`);
  }
}

module.exports = chatbot;