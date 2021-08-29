const Discord = require('discord.js')
const fetch = require('node-fetch')

async function chatbot(client, message, options = []) {
    if (message.author.bot) return;

    let channel = options.chid

    if (Array.isArray(channel)) {
        channel.forEach((channel) => {
            const ch = client.channels.cache.get(channel);
            if (!ch) throw new Error(`INVALID_CHANNEL_ID: ${channel}. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission. Go to https://discord.com/invite/3JzDV9T5Fn to get support`);
        })


        if (channel.includes(message.channel.id)) {

            let name = options.name || client.user.username
            let developer = options.developer || 'Rahuletto#0243'

            fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${message}&botname=${name}&ownername=${developer}&user=${message.author.id}`)
                .then(res => res.json())
                .then(reply => {

                    message.reply({ content: `${reply.message}`, allowedMentions: { repliedUser: false }}).catch(err => message.channel.send({ content: `${err}` }));
                });
        }
    } else {
        const ch = client.channels.cache.get(channel);
        if (!ch) throw new Error('INVALID_CHANNEL_ID. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission. Go to https://discord.com/invite/3JzDV9T5Fn to get support');;

        if (channel === message.channel.id) {

            let name = options.name || client.user.username
            let developer = options.developer || 'Rahuletto#0243'

            fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${message}&botname=${name}&ownername=${developer}&user=${message.author.id}`)
                .then(res => res.json())
                .then(reply => {

                    message.reply({ content: `${reply.message}`, allowedMentions: { repliedUser: false } }).catch(err => message.channel.send({ content: `${err}` }));
                });
        }
    }

}
module.exports = chatbot;
