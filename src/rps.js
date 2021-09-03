const Discord = require('discord.js')

async function rps(message, options = []) {
    try{
        if(options.slash === true){
            let opponent = message.options.getUser('user')
            if (!opponent) return message.reply({ content: 'No opponent mentioned!', ephemeral: true})
            if (opponent.id == message.user.id) return message.reply({ content: 'You cannot play by yourself!', ephemeral: true})
        
            if (options.credit === false) {
                foot = options.embedFooter || "Rock Paper Scissors"
            } else {
                foot = "©️ Simply Develop. | By- ImpassiveMoon + Rahuletto"
            }
        
            let acceptEmbed = new Discord.MessageEmbed()
                .setTitle(`Waiting for ${opponent.tag} to accept!`)
                .setAuthor(message.user.tag, message.user.displayAvatarURL())
                .setColor(options.embedColor || 0x075FFF)
                .setFooter(foot)
        
            let accept = new Discord.MessageButton()
                .setLabel('Accept')
                .setStyle('SUCCESS')
                .setCustomId('accept')
        
            let decline = new Discord.MessageButton()
                .setLabel('Decline')
                .setStyle('DANGER')
                .setCustomId('decline')
        
            let accep = new Discord.MessageActionRow()
                .addComponents([accept, decline])
            message.reply({
              content: `Hey <@${opponent.id}>. You got a RPS invite`,
                embeds: [acceptEmbed],
                components: [accep]
            })
            let m = await message.fetchReply()

                let filter = (button) => button.user.id == opponent.id
                const collector = m.createMessageComponentCollector({ type: 'BUTTON', time: 30000, filter: filter })
                collector.on('collect', (button) => {
                    if (button.customId == 'decline') {
                        button.deferUpdate()
                        return collector.stop('decline')
                    }
                    button.deferUpdate()
                    let embed = new Discord.MessageEmbed()
                        .setTitle(`${message.user.tag} VS. ${opponent.tag}`)
                        .setColor(options.embedColor || 0x075FFF)
                        .setFooter(foot)
                        .setDescription("Select 🪨, 📄, or ✂️")
        
                    if (options.rockColor === 'grey') {
                        options.rockColor = 'SECONDARY'
                    } else if (options.rockColor === 'red') {
                        options.rockColor = 'DANGER'
                    } else if (options.rockColor === 'green') {
                        options.rockColor = 'SUCCESS'
                    } else if (options.rockColor === 'blurple') {
                        options.rockColor = 'PRIMARY'
                    }
        
                    let rock = new Discord.MessageButton()
                        .setLabel('ROCK')
                        .setCustomId('rock')
                        .setStyle(options.rockColor || 'SECONDARY')
                        .setEmoji("🪨")
        
                    if (options.paperColor === 'grey') {
                        options.paperColor = 'SECONDARY'
                    } else if (options.paperColor === 'red') {
                        options.paperColor = 'DANGER'
                    } else if (options.paperColor === 'green') {
                        options.paperColor = 'SUCCESS'
                    } else if (options.paperColor === 'blurple') {
                        options.paperColor = 'PRIMARY'
                    }
        
                    let paper = new Discord.MessageButton()
                        .setLabel('PAPER')
                        .setCustomId('paper')
                        .setStyle(options.paperColor || 'SECONDARY')
                        .setEmoji("📄")
        
                    if (options.scissorsColor === 'grey') {
                        options.scissorsColor = 'SECONDARY'
                    } else if (options.scissorsColor === 'red') {
                        options.scissorsColor = 'DANGER'
                    } else if (options.scissorsColor === 'green') {
                        options.scissorsColor = 'SUCCESS'
                    } else if (options.scissorsColor === 'blurple') {
                        options.scissorsColor = 'PRIMARY'
                    }
        
                    let scissors = new Discord.MessageButton()
                        .setLabel('SCISSORS')
                        .setCustomId('scissors')
                        .setStyle(options.scissorsColor || 'SECONDARY')
                        .setEmoji("✂️")
        
                    let row = new Discord.MessageActionRow()
                        .addComponents([rock, paper, scissors])
        
                    message.editReply({
                        embeds: [embed],
                        components: [row]
                    })
        
                    collector.stop()
                    let ids = new Set()
                    ids.add(message.user.id)
                    ids.add(opponent.id)
                    let op, auth
                    let filter = (button) => ids.has(button.user.id)
                    const collect = m.createMessageComponentCollector({ filter: filter, type: 'BUTTON', time: 30000 })
                    collect.on('collect', (b) => {
                        ids.delete(b.user.id)
                        b.deferUpdate()
                        if (b.user.id == opponent.id) {
                            mem = b.customId
                        }
                        if (b.user.id == message.user.id) {
                            auth = b.customId
                        }
                        if (ids.size == 0) collect.stop()
                    })
                    collect.on('end', (c, reason) => {
                        if (reason == 'time') {
                            let embed = new Discord.MessageEmbed()
                                .setTitle('Game Timed Out!')
                                .setColor(options.timeoutEmbedColor || 0xc90000)
                                .setDescription('One or more players did not make a move in time(30s)')
                                .setFooter(foot)
                            message.editReply({
                                embeds: [embed],
                                components: []
                            })
                        } else {
                            if (mem == 'rock' && auth == 'scissors') {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`${opponent.tag} Wins!`)
                                    .setColor(options.winEmbedColor || 0x06bd00)
                                    .setDescription('Rock defeats Scissors')
                                    .setFooter(foot)
                                message.editReply({ embeds: [embed], components: [] })
                            } else if (mem == 'scissors' && auth == 'rock') {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`${message.user.tag} Wins!`)
                                    .setColor(options.winEmbedColor || 0x06bd00)
                                    .setDescription('Rock defeats Scissors')
                                    .setFooter(foot)
                                message.editReply({ embeds: [embed], components: [] })
                            }
                            else if (mem == 'scissors' && auth == 'paper') {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`${opponent.tag} Wins!`)
                                    .setColor(options.winEmbedColor || 0x06bd00)
                                    .setDescription('Scissors defeats Paper')
                                    .setFooter(foot)
                                message.editReply({ embeds: [embed], components: [] })
                            } else if (mem == 'paper' && auth == 'scissors') {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`${message.user.tag} Wins!`)
                                    .setColor(options.winEmbedColor || 0x06bd00)
                                    .setDescription('Scissors defeats Paper')
                                    .setFooter(foot)
                                message.editReply({ embeds: [embed], components: [] })
                            }
                            else if (mem == 'paper' && auth == 'rock') {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`${opponent.tag} Wins!`)
                                    .setColor(options.winEmbedColor || 0x06bd00)
                                    .setDescription('Paper defeats Rock')
                                    .setFooter(foot)
                                message.editReply({ embeds: [embed], components: [] })
                            } else if (mem == 'rock' && auth == 'paper') {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`${message.user.tag} Wins!`)
                                    .setColor(options.winEmbedColor || 0x06bd00)
                                    .setDescription('Paper defeats Rock')
                                    .setFooter(foot)
                                message.editReply({ embeds: [embed], components: [] })
                            }
                            else {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle('Draw!')
                                    .setColor(options.winEmbedColor || 0x06bd00)
                                    .setDescription(`Both players chose ${mem}`)
                                    .setFooter(foot)
                                message.editReply({ embeds: [embed], components: [] })
                            }
                        }
                    })
                })
                collector.on('end', (collected, reason) => {
                    if (reason == 'time') {
                        let embed = new Discord.MessageEmbed()
                            .setTitle('Challenge Not Accepted in Time')
                            .setAuthor(message.user.tag, message.user.displayAvatarURL())
                            .setColor(options.timeoutEmbedColor || 0xc90000)
                            .setFooter(foot)
                            .setDescription('Ran out of time!\nTime limit: 30s')
                        message.editReply({
                            embeds: [embed],
                            components: []
                        })
                    }
                    if (reason == 'decline') {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Game Declined!")
                            .setAuthor(message.user.tag, message.user.displayAvatarURL())
                            .setColor(options.timeoutEmbedColor || 0xc90000)
                            .setFooter(foot)
                            .setDescription(`${opponent.tag} has declined your game!`)
                        message.editReply({
                            embeds: [embed],
                            components: []
                        })
                    }
                })
        }
       else if(!options.slash || options.slash === false){
        let opponent = message.mentions.members.first()
    if (!opponent) return message.channel.send('No opponent mentioned!')
    if (opponent.id == message.author.id) return message.channel.send('You cannot play by yourself!')

    if (options.credit === false) {
        foot = options.embedFooter || "Rock Paper Scissors"
    } else {
        foot = "©️ Simply Develop. | By- ImpassiveMoon + Rahuletto"
    }

    let acceptEmbed = new Discord.MessageEmbed()
        .setTitle(`Waiting for ${opponent.user.tag} to accept!`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(options.embedColor || 0x075FFF)
        .setFooter(foot)

    let accept = new Discord.MessageButton()
        .setLabel('Accept')
        .setStyle('SUCCESS')
        .setCustomId('accept')

    let decline = new Discord.MessageButton()
        .setLabel('Decline')
        .setStyle('DANGER')
        .setCustomId('decline')

    let accep = new Discord.MessageActionRow()
        .addComponents([accept, decline])
    message.channel.send({
        embeds: [acceptEmbed],
        components: [accep]
    }).then(m => {
        let filter = (button) => button.user.id == opponent.id
        const collector = m.createMessageComponentCollector({ type: 'BUTTON', time: 30000, filter: filter })
        collector.on('collect', (button) => {
            if (button.customId == 'decline') {
                button.deferUpdate()
                return collector.stop('decline')
            }
            button.deferUpdate()
            let embed = new Discord.MessageEmbed()
                .setTitle(`${message.author.tag} VS. ${opponent.user.tag}`)
                .setColor(options.embedColor || 0x075FFF)
                .setFooter(foot)
                .setDescription("Select 🪨, 📄, or ✂️")

            if (options.rockColor === 'grey') {
                options.rockColor = 'SECONDARY'
            } else if (options.rockColor === 'red') {
                options.rockColor = 'DANGER'
            } else if (options.rockColor === 'green') {
                options.rockColor = 'SUCCESS'
            } else if (options.rockColor === 'blurple') {
                options.rockColor = 'PRIMARY'
            }

            let rock = new Discord.MessageButton()
                .setLabel('ROCK')
                .setCustomId('rock')
                .setStyle(options.rockColor || 'SECONDARY')
                .setEmoji("🪨")

            if (options.paperColor === 'grey') {
                options.paperColor = 'SECONDARY'
            } else if (options.paperColor === 'red') {
                options.paperColor = 'DANGER'
            } else if (options.paperColor === 'green') {
                options.paperColor = 'SUCCESS'
            } else if (options.paperColor === 'blurple') {
                options.paperColor = 'PRIMARY'
            }

            let paper = new Discord.MessageButton()
                .setLabel('PAPER')
                .setCustomId('paper')
                .setStyle(options.paperColor || 'SECONDARY')
                .setEmoji("📄")

            if (options.scissorsColor === 'grey') {
                options.scissorsColor = 'SECONDARY'
            } else if (options.scissorsColor === 'red') {
                options.scissorsColor = 'DANGER'
            } else if (options.scissorsColor === 'green') {
                options.scissorsColor = 'SUCCESS'
            } else if (options.scissorsColor === 'blurple') {
                options.scissorsColor = 'PRIMARY'
            }

            let scissors = new Discord.MessageButton()
                .setLabel('SCISSORS')
                .setCustomId('scissors')
                .setStyle(options.scissorsColor || 'SECONDARY')
                .setEmoji("✂️")

            let row = new Discord.MessageActionRow()
                .addComponents([rock, paper, scissors])

            m.edit({
                embeds: [embed],
                components: [row]
            })

            collector.stop()
            let ids = new Set()
            ids.add(message.author.id)
            ids.add(opponent.id)
            let op, auth
            let filter = (button) => ids.has(button.user.id)
            const collect = m.createMessageComponentCollector({ filter: filter, type: 'BUTTON', time: 30000 })
            collect.on('collect', (b) => {
                ids.delete(b.user.id)
                b.deferUpdate()
                if (b.user.id == opponent.id) {
                    mem = b.customId
                }
                if (b.user.id == message.author.id) {
                    auth = b.customId
                }
                if (ids.size == 0) collect.stop()
            })
            collect.on('end', (c, reason) => {
                if (reason == 'time') {
                    let embed = new Discord.MessageEmbed()
                        .setTitle('Game Timed Out!')
                        .setColor(options.timeoutEmbedColor || 0xc90000)
                        .setDescription('One or more players did not make a move in time(30s)')
                        .setFooter(foot)
                    m.edit({
                        embeds: [embed],
                        components: []
                    })
                } else {
                    if (mem == 'rock' && auth == 'scissors') {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${opponent.user.tag} Wins!`)
                            .setColor(options.winEmbedColor || 0x06bd00)
                            .setDescription('Rock defeats Scissors')
                            .setFooter(foot)
                        m.edit({ embeds: [embed], components: [] })
                    } else if (mem == 'scissors' && auth == 'rock') {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${message.member.user.tag} Wins!`)
                            .setColor(options.winEmbedColor || 0x06bd00)
                            .setDescription('Rock defeats Scissors')
                            .setFooter(foot)
                        m.edit({ embeds: [embed], components: [] })
                    }
                    else if (mem == 'scissors' && auth == 'paper') {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${opponent.user.tag} Wins!`)
                            .setColor(options.winEmbedColor || 0x06bd00)
                            .setDescription('Scissors defeats Paper')
                            .setFooter(foot)
                        m.edit({ embeds: [embed], components: [] })
                    } else if (mem == 'paper' && auth == 'scissors') {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${message.member.user.tag} Wins!`)
                            .setColor(options.winEmbedColor || 0x06bd00)
                            .setDescription('Scissors defeats Paper')
                            .setFooter(foot)
                        m.edit({ embeds: [embed], components: [] })
                    }
                    else if (mem == 'paper' && auth == 'rock') {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${opponent.user.tag} Wins!`)
                            .setColor(options.winEmbedColor || 0x06bd00)
                            .setDescription('Paper defeats Rock')
                            .setFooter(foot)
                        m.edit({ embeds: [embed], components: [] })
                    } else if (mem == 'rock' && auth == 'paper') {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${message.member.user.tag} Wins!`)
                            .setColor(options.winEmbedColor || 0x06bd00)
                            .setDescription('Paper defeats Rock')
                            .setFooter(foot)
                        m.edit({ embeds: [embed], components: [] })
                    }
                    else {
                        let embed = new Discord.MessageEmbed()
                            .setTitle('Draw!')
                            .setColor(options.winEmbedColor || 0x06bd00)
                            .setDescription(`Both players chose ${mem}`)
                            .setFooter(foot)
                        m.edit({ embeds: [embed], components: [] })
                    }
                }
            })
        })
        collector.on('end', (collected, reason) => {
            if (reason == 'time') {
                let embed = new Discord.MessageEmbed()
                    .setTitle('Challenge Not Accepted in Time')
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor(options.timeoutEmbedColor || 0xc90000)
                    .setFooter(foot)
                    .setDescription('Ran out of time!\nTime limit: 30s')
                m.edit({
                    embeds: [embed],
                    components: []
                })
            }
            if (reason == 'decline') {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Game Declined!")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor(options.timeoutEmbedColor || 0xc90000)
                    .setFooter(foot)
                    .setDescription(`${opponent.user.tag} has declined your game!`)
                m.edit({
                    embeds: [embed],
                    components: []
                })
            }
        })
    })
}
} catch(err){
    console.log(`Error Occured. | rps | Error: ${err}`)
}
}
module.exports = rps;