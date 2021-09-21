const Discord = require('discord.js')
const fetch = require('node-fetch')

/**
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {import('../index').chatbotOptions} options 
 */
async function chatbot(client, message, options = []) {
    if (message.author.bot) return;
if(options && options.toggle === false) return;
    let channel = options.chid
    try {
        if (Array.isArray(channel)) {
            channel.forEach((channel) => {
                const ch = client.channels.cache.get(channel);
                if (!ch) throw new Error(`INVALID_CHANNEL_ID: ${channel}. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission. Go to https://discord.com/invite/3JzDV9T5Fn to get support`);
            })


            if (channel.includes(message.channel.id)) {

                let name = client.user.username
                let developer = 'Rahuletto#0243'

                var ranges = [
                    '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
                    '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
                    '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
                  ];

            let input = message.content.replace(new RegExp(ranges.join('|'), 'g'), '.');

            const hasEmoteRegex = /<a?:.+:\d+>/gm
        const emoteRegex = /<:.+:(\d+)>/gm
        const animatedEmoteRegex = /<a:.+:(\d+)>/gm

        const emoj = message.content.match(hasEmoteRegex)

        input = input.replace(emoteRegex.exec(emoj), '')

        input = input.replace(animatedEmoteRegex.exec(emoj), '')

                fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${input}&botname=${name}&ownername=${developer}&user=${message.author.id}`)
                    .then(res => {
                        let rep = res.json()
                        return rep;
                    })
                    .then(async reply => {
                        let mes = await reply.message.replace('@everyone', '\`@everyone\`')
                        let mess = mes.replace('@here', '`@here`')
                        message.reply({ content: mess.toString(), allowedMentions: { repliedUser: false } });
                    }).catch(err => message.reply({ content: `Error: ${err}` }))
            }
        } else {
            const ch = client.channels.cache.get(channel);
            if (!ch) throw new Error('INVALID_CHANNEL_ID. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission. Go to https://discord.com/invite/3JzDV9T5Fn to get support');;

            if (channel === message.channel.id) {
                let name = client.user.username
                let developer = 'Rahuletto#0243'

                var ranges = [
                    '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
                    '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
                    '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
                  ];

            let input = message.content.replace(new RegExp(ranges.join('|'), 'g'), '.');

            const hasEmoteRegex = /<a?:.+:\d+>/gm
        const emoteRegex = /<:.+:(\d+)>/gm
        const animatedEmoteRegex = /<a:.+:(\d+)>/gm

        const emoj = message.content.match(hasEmoteRegex)

        input = input.replace(emoteRegex.exec(emoj), '')

        input = input.replace(animatedEmoteRegex.exec(emoj), '')

                fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${input}&botname=${name}&ownername=${developer}&user=${message.author.id}`)
                    .then(res => {
                        let rep = res.json()
                        return rep;
                    })
                    .then(async reply => {
                        let mes = await reply.message.replace('@everyone', '\`@everyone\`')
                        let mess = mes.replace('@here', '`@here`')
                        message.reply({ content: mess.toString(), allowedMentions: { repliedUser: false } });
                    }).catch(err => message.reply({ content: `Error: ${err}` }))
            }
        }
    } catch (err) {
        console.log(`Error Occured. | chatbot | Error: ${err.stack}`)
      }

}
module.exports = chatbot;