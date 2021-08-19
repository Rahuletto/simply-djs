const Discord = require('discord.js')

async function suggestSystem(client, message, args, options = []) {
    
    let channel = options.chid
    let { MessageButton, MessageActionRow } = require('discord.js')

    const attachment = message.attachments.first();
  const url = attachment ? attachment.url : null;

    const ch = client.channels.cache.get(channel);
    if (!ch) throw new Error('INVALID_CHANNEL_ID. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission. Go to https://discord.com/invite/3JzDV9T5Fn to get support');;

    let suggestion = args.join(" ")

    if (options.credit === false) {
        foot = options.embedFoot || 'Suggestion'
    } else if (options.credit === true || !options.credit) {
        foot = '©️ Simply Develop. npm i simply-djs'
    }

    let surebtn = new MessageButton()
        .setStyle('SUCCESS')
        .setLabel('Sure')
        .setCustomId('send-sug')

    let nobtn = new MessageButton()
        .setStyle('DANGER')
        .setLabel('Cancel')
        .setCustomId('nope-sug')

    let row1 = new MessageActionRow()
        .addComponents([surebtn, nobtn])


    let embedo = new Discord.MessageEmbed()
        .setTitle('Are you sure ?')
        .setDescription(`Is this your suggestion ? \`${suggestion}\``)
        .setTimestamp()
        .setImage(url)
        .setColor(options.embedColor || '#075FFF')
        .setFooter(foot)

        message.delete()
    message.channel.send({ embeds: [embedo], components: [row1] }).then((m) => {
        const filter = (button) => button.user.id === message.author.id
        const collect = m.createMessageComponentCollector({ filter, componentType: 'BUTTON', max: 1, time: 15000 })

        collect.on("collect", async b => {

            if (b.customId === 'send-sug') {
                b.reply({ content: 'Ok Suggested.', ephemeral: true });
                b.message.delete();

                if (options.credit === false) {
                    foot = options.embedFoot || 'Suggestion'
                } else if (options.credit === true || !options.credit) {
                    foot = '©️ Simply Develop. npm i simply-djs'
                }

                const emb = new Discord.MessageEmbed()
                    .setDescription(suggestion)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor(options.embedColor || '#075FFF')
                    .setFooter(foot)
                    .setImage(url)
                    .addFields(
                        { name: 'Status:', value: `\`\`\`Waiting for the response..\`\`\`` },
                        { name: 'Reactions', value: `*Likes:* \`0\` \n*Dislikes:* \`0\`` }
                    )

                if (options.yesColor === 'grey') {
                    options.yesColor = 'SECONDARY'
                } else if (options.yesColor === 'red') {
                    options.yesColor = 'DANGER'
                } else if (options.yesColor === 'green') {
                    options.yesColor = 'SUCCESS'
                } else if (options.yesColor === 'blurple') {
                    options.yesColor = 'PRIMARY'
                }

                let approve = new MessageButton()
                    .setEmoji(options.yesEmoji || '☑️')
                    .setStyle(options.yesColor || 'SUCCESS')
                    .setCustomId('agree-sug')

                if (options.noColor === 'grey') {
                    options.noColor = 'SECONDARY'
                } else if (options.noColor === 'red') {
                    options.noColor = 'DANGER'
                } else if (options.noColor === 'green') {
                    options.noColor = 'SUCCESS'
                } else if (options.noColor === 'blurple') {
                    options.noColor = 'PRIMARY'
                }

                let no = new MessageButton()
                    .setEmoji(options.noEmoji || '🇽')
                    .setStyle(options.noColor || 'DANGER')
                    .setCustomId('no-sug')

                let row = new MessageActionRow()
                    .addComponents([approve, no])

                ch.send({ embeds: [emb], components: [row] })
            } else if (b.customId === 'nope-sug') {
                b.message.delete()
                b.reply({ content: 'Ok i am not sending the suggestion', ephemeral: true })
            }

        })

        collect.on("end", async b => {
            if (b.size == 0) {
                m.delete()
                m.channel.send({ content: 'Timeout.. So I didnt send the suggestion.' })
            }
        })

    })


}
module.exports = suggestSystem;