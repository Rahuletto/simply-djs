const Discord = require('discord.js')
const fetch = require('node-fetch')
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

                let name = options.name || client.user.username
                let developer = options.developer || 'Rahuletto#0243'

                fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${message}&botname=${name}&ownername=${developer}&user=${message.author.id}`)
                    .then(res => {
                        let rep = res.json()

                        return rep;
                    })
                    .then(async reply => {
                        let mes = await reply.message.replace('@everyone', '\`@everyone\`')
                        let mess = mes.replace('@here', '`@here`')
                        message.reply({ content: mess.toString(), allowedMentions: { repliedUser: false } });
                    }).catch(err => message.reply({ content: err }))

            }
        } else {
            const ch = client.channels.cache.get(channel);
            if (!ch) throw new Error('INVALID_CHANNEL_ID. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission. Go to https://discord.com/invite/3JzDV9T5Fn to get support');;

            if (channel === message.channel.id) {

                let name = options.name || client.user.username
                let developer = options.developer || 'Rahuletto#0243'

                fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${message}&botname=${name}&ownername=${developer}&user=${message.author.id}`)
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
        console.log(`Error Occured. | chatbot | Error: ${err}`)
    }

}
module.exports = chatbot;