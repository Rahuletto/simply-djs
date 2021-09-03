const Discord = require('discord.js')

async function ticketSystem(message, channel, options = []) {
    try{
    let { MessageButton, MessageActionRow } = require('discord.js')

    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ content: "You dont have permissions to setup a ticket system" })
    if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) return message.reply({ content: "I dont have any permissions to work with ticket system | Needed Permission: MANAGE_CHANNELS" })

    if (options.color) {

        if (options.color === 'grey') {
            options.color = 'SECONDARY'
        } else if (options.color === 'red') {
            options.color = 'DANGER'
        } else if (options.color === 'green') {
            options.color = 'SUCCESS'
        } else if (options.color === 'blurple') {
            options.color = 'PRIMARY'
        }

    }
    let ticketbtn = new MessageButton()
        .setStyle(options.color || 'SECONDARY')
        .setEmoji(options.emoji || '🎫')
        .setLabel('Ticket')
        .setCustomId('create_ticket');

    if (options.credit === false) {
        foot = options.embedFoot || message.guild.name, message.guild.iconURL()
    } else {
        foot = '©️ Simply Develop. npm i simply-djs'
    }

    let a = new MessageActionRow()
        .addComponents([ticketbtn])

    let embed = new Discord.MessageEmbed()
        .setTitle('Create a ticket')
        .setDescription(options.embedDesc || '🎫 Create a ticket by clicking the button 🎫')
        .setThumbnail(message.guild.iconURL())
        .setTimestamp()
        .setColor(options.embedColor || '#075FFF')
        .setFooter(foot)

    try {
        channel.send({ embeds: [embed], components: [a] })
    } catch (err) {
        channel.send({ content: 'ERR OCCURED ' + err })
    }

} catch(err){
    console.error(`Error Occured. | ticketSystem | Error: ${err}`)
}

}
module.exports = ticketSystem;