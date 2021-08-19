const Discord = require('discord.js')

async function suggestBtn(button, users, options = []) {
    if (!button.isButton()) return;

    let { MessageButton, MessageActionRow } = require('discord.js')

    if (button.customId === 'no-sug') {
        let target = await button.message.channel.messages.fetch(button.message.id)
        let oldemb = target.embeds[0]

        if (button.member.permissions.has('ADMINISTRATOR')) {

            button.reply({ content: 'Reason ?? if not, Ill give it as `No Reason` Timeout: 15 Seconds..', ephemeral: true })

            let filter = m => button.user.id === m.author.id

            const collector = button.channel.createMessageCollector({ filter, time: 15000 });

            collector.on('collect', m => {

                if (m.content.toLowerCase() === 'cancel') {
                    m.delete()
                    button.editReply('Refusal Cancelled')
                    collector.stop()
                } else {
                    m.delete()
                    dec(m.content, oldemb)
                    collector.stop()
                }
            })

            collector.on('end', collected => {

                if (collected.size === 0) {
                    dec('No Reason', oldemb)
                }

            });
        } else {
            let isit = await users.get(`${button.message.id}-${button.user.id}-dislike`)

            if (isit === button.user.id) {
                button.reply({ content: 'You cannot react again.', ephemeral: true })
            }
            else {
                let isit2 = await users.get(`${button.message.id}-${button.user.id}-like`)
                if (isit2 === button.user.id) {
                    users.delete(`${button.message.id}-${button.user.id}-like`, button.user.id)

                    users.set(`${button.message.id}-${button.user.id}-dislike`, button.user.id)


                    removelike(oldemb)

                } else {

                    let isit2 = await users.get(`${button.message.id}-${button.user.id}-dislike`)

                    button.deferUpdate()
                    users.set(`${button.message.id}-${button.user.id}-dislike`, button.user.id)

                    dislike(oldemb)
                }

            }

        }
    }

    async function removelike(oldemb) {

        let approve = new MessageButton()
            .setEmoji(options.yesEmoji || '☑️')
            .setStyle(options.yesColor || 'SUCCESS')
            .setCustomId('agree-sug')

        let no = new MessageButton()
            .setEmoji(options.noEmoji || '🇽')
            .setStyle(options.noColor || 'DANGER')
            .setCustomId('no-sug')

        let row = new MessageActionRow()
            .addComponents([approve, no])

        let likesnd = oldemb.fields[1].value.split(/\s+/);

        let likes = likesnd[1].replace('`', '')
        let dislikes = likesnd[3].replace('`', '')

        let dislik = parseInt(dislikes) + 1

        let lik = parseInt(likes) - 1

        const newemb = new Discord.MessageEmbed()
            .setDescription(oldemb.description)
            .setColor(oldemb.color)
            .setAuthor(oldemb.author.name, oldemb.author.iconURL)
            .setFooter(oldemb.footer.text)
            .setImage(oldemb.image)
            .addFields(
                { name: oldemb.fields[0].name, value: oldemb.fields[0].value },
                { name: 'Reactions', value: `*Likes:* \`${lik}\` \n*Dislikes:* \`${dislik}\`` }
            )

        button.message.edit({ embeds: [newemb], components: [row] })

    }

    async function dislike(oldemb) {

        let approve = new MessageButton()
            .setEmoji(options.yesEmoji || '☑️')
            .setStyle(options.yesColor || 'SUCCESS')
            .setCustomId('agree-sug')

        let no = new MessageButton()
            .setEmoji(options.noEmoji || '🇽')
            .setStyle(options.noColor || 'DANGER')
            .setCustomId('no-sug')

        let row = new MessageActionRow()
            .addComponents([approve, no])

        let likesnd = oldemb.fields[1].value.split(/\s+/);

        let lik = likesnd[1]
        let dislikes = likesnd[3].replace('`', '')

        let dislik = parseInt(dislikes) + 1

        const newemb = new Discord.MessageEmbed()
            .setDescription(oldemb.description)
            .setColor(oldemb.color)
            .setAuthor(oldemb.author.name, oldemb.author.iconURL)
            .setImage(oldemb.image)
            .setFooter(oldemb.footer.text)
            .addFields(
                { name: oldemb.fields[0].name, value: oldemb.fields[0].value },
                { name: 'Reactions', value: `*Likes:* ${lik} \n*Dislikes:* \`${dislik}\`` }
            )

        button.message.edit({ embeds: [newemb], components: [row] })
    }

    async function dec(reason, oldemb) {

        let approve = new MessageButton()
            .setEmoji(options.yesEmoji || '☑️')
            .setStyle(options.yesColor || 'SUCCESS')
            .setCustomId('agree-sug')
            .setDisabled(true)

        let no = new MessageButton()
            .setEmoji(options.noEmoji || '🇽')
            .setStyle(options.noColor || 'DANGER')
            .setCustomId('no-sug')
            .setDisabled(true)

        let row = new MessageActionRow()
            .addComponents([approve, no])

        let likesnd = oldemb.fields[1].value.split(/\s+/);

        let lik = likesnd[1]
        let dislik = likesnd[3]

        const newemb = new Discord.MessageEmbed()
            .setDescription(oldemb.description)
            .setColor(options.denyEmbColor || 'RED')
            .setAuthor(oldemb.author.name, oldemb.author.iconURL)
            .setImage(oldemb.image)
            .setFooter(oldemb.footer.text)
            .addFields({ name: 'Status:', value: `\`\`\`Rejected !\`\`\`` },
                { name: 'Reason:', value: `\`\`\`${reason}\`\`\`` },
                { name: 'Reactions', value: `*Likes:* ${lik} \n*Dislikes:* ${dislik}` }
            )

        button.message.edit({ embeds: [newemb], components: [row] })

    }

    if (button.customId === 'agree-sug') {

        let target = await button.message.channel.messages.fetch(button.message.id)
        let oldemb = target.embeds[0]

        if (button.member.permissions.has('ADMINISTRATOR')) {

            button.reply({ content: 'Tell me the reason.. if not, Ill give it as `No Reason` Timeout: 15 Seconds..', ephemeral: true })

            let filter = m => button.user.id === m.author.id

            const collector = button.channel.createMessageCollector({ filter, time: 15000 });

            collector.on('collect', m => {

                if (m.content.toLowerCase() === 'cancel') {
                    m.delete()
                    button.editReply('Approval Cancelled')
                    collector.stop()
                } else {
                    m.delete()
                    aprov(m.content, oldemb)
                    collector.stop()
                }
            })

            collector.on('end', collected => {

                if (collected.size === 0) {
                    aprov('No Reason', oldemb)
                }

            });
        } else {

            let isit3 = await users.get(`${button.message.id}-${button.user.id}-like`)

            if (isit3 === button.user.id) {
                button.reply({ content: 'You cannot react again.', ephemeral: true })
            }
            else {
                let isit4 = await users.get(`${button.message.id}-${button.user.id}-dislike`)

                if (isit4 === button.user.id) {
                    users.delete(`${button.message.id}-${button.user.id}-dislike`, button.user.id)


                    users.set(`${button.message.id}-${button.user.id}-like`, button.user.id)

                    removedislike(oldemb)

                } else {
                    button.deferUpdate()
                    users.set(`${button.message.id}-${button.user.id}-like`, button.user.id)

                    like(oldemb)
                }

            }

        }

    }

    async function removedislike(oldemb) {

        let approve = new MessageButton()
            .setEmoji(options.yesEmoji || '☑️')
            .setStyle(options.yesColor || 'SUCCESS')
            .setCustomId('agree-sug')

        let no = new MessageButton()
            .setEmoji(options.noEmoji || '🇽')
            .setStyle(options.noColor || 'DANGER')
            .setCustomId('no-sug')

        let row = new MessageActionRow()
            .addComponents([approve, no])

        let likesnd = oldemb.fields[1].value.split(/\s+/);

        let likes = likesnd[1].replace('`', '')


        let lik = parseInt(likes) + 1

        let dislike = likesnd[3].replace('`', '')

        let dislik = parseInt(dislike) - 1

        const newemb = new Discord.MessageEmbed()
            .setDescription(oldemb.description)
            .setColor(oldemb.color)
            .setAuthor(oldemb.author.name, oldemb.author.iconURL)
            .setImage(oldemb.image)
            .setFooter(oldemb.footer.text)
            .addFields(
                { name: oldemb.fields[0].name, value: oldemb.fields[0].value },
                { name: 'Reactions', value: `*Likes:* \`${lik}\` \n*Dislikes:* \`${dislik}\`` }
            )

        button.message.edit({ embeds: [newemb], components: [row] })
    }

    async function like(oldemb) {

        let approve = new MessageButton()
            .setEmoji(options.yesEmoji || '☑️')
            .setStyle(options.yesColor || 'SUCCESS')
            .setCustomId('agree-sug')

        let no = new MessageButton()
            .setEmoji(options.noEmoji || '🇽')
            .setStyle(options.noColor || 'DANGER')
            .setCustomId('no-sug')

        let row = new MessageActionRow()
            .addComponents([approve, no])

        let likesnd = oldemb.fields[1].value.split(/\s+/);

        let likes = likesnd[1].replace('`', '')
        let dislik = likesnd[3]

        let lik = parseInt(likes) + 1

        const newemb = new Discord.MessageEmbed()
            .setDescription(oldemb.description)
            .setColor(oldemb.color)
            .setAuthor(oldemb.author.name, oldemb.author.iconURL)
            .setImage(oldemb.image)
            .setFooter(oldemb.footer.text)
            .addFields(
                { name: oldemb.fields[0].name, value: oldemb.fields[0].value },
                { name: 'Reactions', value: `*Likes:* \`${lik}\` \n*Dislikes:* ${dislik}` }
            )

        button.message.edit({ embeds: [newemb], components: [row] })
    }

    async function aprov(reason, oldemb) {
        let approve = new MessageButton()
            .setEmoji(options.yesEmoji || '☑️')
            .setStyle(options.yesColor || 'SUCCESS')
            .setCustomId('agree-sug')
            .setDisabled(true)

        let no = new MessageButton()
            .setEmoji(options.noEmoji || '🇽')
            .setStyle(options.noColor || 'DANGER')
            .setCustomId('no-sug')
            .setDisabled(true)

        let row = new MessageActionRow()
            .addComponents([approve, no])

        let likesnd = oldemb.fields[1].value.split(/\s+/);

        let lik = likesnd[1]
        let dislik = likesnd[3]

        const newemb = new Discord.MessageEmbed()
            .setDescription(oldemb.description)
            .setColor(options.agreeEmbColor || 'GREEN')
            .setAuthor(oldemb.author.name, oldemb.author.iconURL)
            .setImage(oldemb.image)
            .setFooter(oldemb.footer.text)
            .addFields({ name: 'Status:', value: `\`\`\`Accepted !\`\`\`` },
                { name: 'Reason:', value: `\`\`\`${reason}\`\`\`` },
                { name: 'Reactions', value: `*Likes:* ${lik} \n*Dislikes:* ${dislik}` }
            )

        button.message.edit({ embeds: [newemb], components: [row] })

    }
}
module.exports = suggestBtn;