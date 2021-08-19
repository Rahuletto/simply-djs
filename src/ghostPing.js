const Discord = require('discord.js')

async function ghostPing(message, options = []) {
    if (message.mentions.users.first()) {

        if (options.credit === false) {
            foot = options.embedFoot || 'Ghost Ping. Oop.'
        } else {
            foot = '©️ Simply Develop. npm i simply-djs'
        }

        const chembed = new Discord.MessageEmbed()
            .setTitle('Ghost Ping Detected')
            .setDescription(options.embedDesc || `I Found that ${message.author} **(${message.author.tag})** just ghost pinged ${message.mentions.members.first()} **(${message.mentions.users.first().tag})**\n\nContent: **${message.content}**`)
            .setColor(options.embedColor || 0x075FFF)

            .setFooter(foot)
            .setTimestamp()

        message.channel.send({ embeds: [options.embed || chembed] })
    }
}
module.exports = ghostPing;