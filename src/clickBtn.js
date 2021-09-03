const Discord = require('discord.js')

async function clickBtn(button, options = []) {
    if (button.isButton()) {
    try{
    if (options.credit === false) {
        foot = button.message.guild.name, button.message.guild.iconURL()
    } else {
        foot = '©️ Simply Develop. npm i simply-djs'
    }

    if (button.customId.startsWith('role-')) {
        let rle = button.customId.replace("role-", "")

        let real = button.guild.roles.cache.find(r => r.id === rle)
        if (!real) return;
        else {

            if (button.member.roles.cache.find(r => r.id === real.id)) {

                button.reply({ content: 'You already have the role. Removing it now', ephemeral: true })

                button.member.roles.remove(real).catch(err => button.message.channel.send('ERROR: Role is higher than me. MISSING_PERMISSIONS'))


            } else {

                button.reply({ content: `Gave you the role Name: ${real.name} | ID: ${real.id}`, ephemeral: true })

                button.member.roles.add(real).catch(err => button.message.channel.send('ERROR: Role is higher than me. MISSING_PERMISSIONS'))
            }

        }
    }

    
    let { MessageButton, MessageActionRow } = require('discord.js')

    if (button.customId === 'create_ticket') {

        let ticketname = `ticket_${button.user.id}`

        let antispamo = await button.guild.channels.cache.find(ch => ch.name === ticketname.toLowerCase());

        if (options.closeColor) {

            if (options.closeColor === 'grey') {
                options.closeColor = 'SECONDARY'
            } else if (options.closeColor === 'red') {
                options.closeColor = 'DANGER'
            } else if (options.closeColor === 'green') {
                options.closeColor = 'SUCCESS'
            } else if (options.closeColor === 'blurple') {
                options.closeColor = 'PRIMARY'
            }

        }

        if (options.openColor) {

            if (options.openColor === 'grey') {
                options.openColor = 'SECONDARY'
            } else if (options.openColor === 'red') {
                options.openColor = 'DANGER'
            } else if (options.openColor === 'green') {
                options.openColor = 'SUCCESS'
            } else if (options.openColor === 'blurple') {
                options.openColor = 'PRIMARY'
            }

        }


        if (options.delColor) {

            if (options.delColor === 'grey') {
                options.delColor = 'SECONDARY'
            } else if (options.delColor === 'red') {
                options.delColor = 'DANGER'
            } else if (options.delColor === 'green') {
                options.delColor = 'SUCCESS'
            } else if (options.delColor === 'blurple') {
                options.delColor = 'PRIMARY'
            }

        }

        if (antispamo) {
            button.reply({ content: options.cooldownMsg || 'You already have a ticket opened.. Please delete it before opening another ticket.', ephemeral: true })

        } else if (!antispamo) {
            button.deferUpdate();

            roles = {
                id: options.role || button.user.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
            }

            chparent = options.categoryID || null
            let categ = button.guild.channels.cache.get(options.categoryID)
            if (!categ) { chparent = null }

            button.guild.channels.create(`ticket_${button.user.id}`, {
                type: "text",
                parent: chparent,
                permissionOverwrites: [
                    {
                        id: button.message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
                    },
                    {
                        id: button.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    },
                    roles
                ],
            }).then((ch) => {


                let emb = new Discord.MessageEmbed()
                    .setTitle('Ticket Created')
                    .setDescription(options.embedDesc || `Ticket has been raised by ${button.user}. We ask the Admins to summon here\n\nThis channel will be deleted after 10 minutes to reduce the clutter`)
                    .setThumbnail(button.message.guild.iconURL())
                    .setTimestamp()
                    .setColor(options.embedColor || '#075FFF')
                    .setFooter(foot)


                let close_btn = new MessageButton()
                    .setStyle(options.closeColor || 'PRIMARY')
                    .setEmoji(options.closeEmoji || '🔒')
                    .setLabel('Close')
                    .setCustomId('close_ticket')

                let closerow = new MessageActionRow()
                    .addComponents([close_btn])

                ch.send({ content: `${button.user}`, embeds: [emb], components: [closerow] })

                if (options.timeout == true || !options.timeout) {
                    setTimeout(() => {
                        ch.send({ content: 'Timeout.. You have reached 10 minutes. This ticket is getting deleted right now.' })

                        setTimeout(() => {
                            ch.delete()
                        }, 10000)

                    }, 600000)
                } else return;
            })
        }
    }
    if (button.customId === 'close_ticket') {

        button.deferUpdate();

        button.channel.permissionOverwrites.edit(button.user.id, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: true
        })
            .catch((err) => { })

        let X_btn = new MessageButton()
            .setStyle(options.delColor || 'SECONDARY')
            .setEmoji(options.delEmoji || '❌')
            .setLabel('Delete')
            .setCustomId('delete_ticket')

        let open_btn = new MessageButton()
            .setStyle(options.openColor || 'SUCCESS')
            .setEmoji(options.openEmoji || '🔓')
            .setLabel('Reopen')
            .setCustomId('open_ticket')

        let row = new MessageActionRow()
            .addComponents([open_btn, X_btn])

        let emb = new Discord.MessageEmbed()
            .setTitle('Ticket Created')
            .setDescription(options.embedDesc || `Ticket has been raised by ${button.user}. We ask the Admins to summon here\n\nThis channel will be deleted after 10 minutes to reduce the clutter`)
            .setThumbnail(button.message.guild.iconURL())
            .setTimestamp()
            .setColor(options.embedColor || '#075FFF')
            .setFooter(foot)

        button.message.edit({ content: `${button.user}`, embeds: [emb], components: [row] })
    }

    if (button.customId === 'open_ticket') {

        button.channel.permissionOverwrites.edit(button.user.id, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
        }).catch((err) => { })

        let emb = new Discord.MessageEmbed()
            .setTitle('Ticket Created')
            .setDescription(options.embedDesc || `Ticket has been raised by ${button.user}. We ask the Admins to summon here` + `This channel will be deleted after 10 minutes to reduce the clutter`)
            .setThumbnail(button.message.guild.iconURL())
            .setTimestamp()
            .setColor(options.embedColor || '#075FFF')
            .setFooter(foot)


        let close_btn = new MessageButton()
            .setStyle(options.closeColor || 'PRIMARY')
            .setEmoji(options.closeEmoji || '🔒')
            .setLabel('Close')
            .setCustomId('close_ticket')

        let closerow = new MessageActionRow()
            .addComponents([close_btn])

        button.message.edit({ content: `${button.user}`, embedDesc: [emb], components: [closerow] })
        button.reply({ content: 'Reopened the ticket ;)', ephemeral: true })

    }

    if (button.customId === 'delete_ticket') {

        let surebtn = new MessageButton()
            .setStyle('DANGER')
            .setLabel('Sure')
            .setCustomId('s_ticket')

        let nobtn = new MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Cancel')
            .setCustomId('no_ticket')

        let row1 = new MessageActionRow()
            .addComponents([surebtn, nobtn])

        let emb = new Discord.MessageEmbed()
            .setTitle('Are you sure ?')
            .setDescription(`This will delete the channel and the ticket. You cant undo this action`)
            .setTimestamp()
            .setColor('#c90000')
            .setFooter(foot)

        button.reply({ embeds: [emb], components: [row1] })


    }

    if (button.customId === 's_ticket') {

        button.reply({ content: 'Deleting the ticket and channel.. Please wait.' })

        setTimeout(() => {
            let delch = button.message.guild.channels.cache.get(button.message.channel.id)
            delch.delete().catch((err) => {
                button.message.channel.send({ content: 'An Error Occured. ' + err, ephemeral: true })
            })
        }, 2000)
    }

    if (button.customId === 'no_ticket') {
        button.message.delete();
        button.reply({ content: 'Ticket Deletion got canceled', ephemeral: true })
    }
} catch(err){
    console.log(`Error Occured. | clickBtn | Error: ${err}`)
}
    }
}
module.exports = clickBtn;