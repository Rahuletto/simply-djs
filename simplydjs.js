const Discord = require('discord.js')
const math = require('mathjs')
const parse = new (require("rss-parser"))();
const fetch = require('node-fetch')

module.exports = {

    ghostPing: async function (message, options = []) {
        if (message.author.bot) return;
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
    },

    tictactoe: async function (message, options = []) {
        let opponent = message.mentions.members.first()

        if (!opponent) return message.channel.send({ content: "Please provide the user to challenge!" })

        if (opponent.id === message.member.id) return message.channel.send({ content: "You cant play for 2 Players. Please provide the user to challenge!" });

        if (options.credit === false) {
            foot = options.embedFoot || 'Make sure to win ;)'
        } else {
            foot = '©️ Simply Develop. npm i simply-djs'
        }

        let acceptEmbed = new Discord.MessageEmbed()
            .setTitle(`Waiting for ${opponent.user.tag} to accept!`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(options.embedColor || 0x075FFF)
            .setFooter(foot)

        let accept = new Discord.MessageButton()
            .setLabel('Accept')
            .setStyle('SUCCESS')
            .setCustomId('acceptttt')

        let decline = new Discord.MessageButton()
            .setLabel('Decline')
            .setStyle('DANGER')
            .setCustomId('declinettt')

        let accep = new Discord.MessageActionRow()
            .addComponents([accept, decline])
        message.channel.send({
            embeds: [acceptEmbed],
            components: [accep]
        }).then(m => {
            let filter = (button) => button.user.id == opponent.id
            const collector = m.createMessageComponentCollector({ type: 'BUTTON', time: 30000, filter: filter })
            collector.on('collect', async (button) => {
                if (button.customId == 'declinettt') {
                    button.deferUpdate()
                    return collector.stop('decline')
                } else if (button.customId == 'acceptttt') {
                    button.deferUpdate()
                    collector.stop()

                    let fighters = [message.member.id, opponent.id].sort(() => (Math.random() > .5) ? 1 : -1)

                    let x_emoji = options.xEmoji || "❌"
                    let o_emoji = options.oEmoji || "⭕"

                    let dashmoji = options.idleEmoji || "➖"

                    let Args = {
                        user: 0,
                        a1: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        a2: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        a3: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        b1: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        b2: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        b3: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        c1: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        c2: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        c3: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        }
                    }
                    const { MessageActionRow, MessageButton } = require('discord.js');

                    const xoemb = new Discord.MessageEmbed()
                        .setTitle('TicTacToe')
                        .setDescription(`**How to Play ?**\n*Wait for your turn.. If its your turn, Click one of the buttons from the table to draw your emoji at there.*`)
                        .setColor(options.embedColor || 0x075FFF)
                        .setFooter(foot)
                        .setTimestamp()
                    let infomsg = await message.channel.send({ embeds: [xoemb] }).then(ms => {
                        setTimeout(() => ms.delete(), 10000)
                    })

                    let msg = await message.channel.send({ content: `Waiting for Input | <@!${Args.userid}>, Your Emoji: ${o_emoji}` })
                    tictactoe(msg)

                    async function tictactoe(m) {
                        Args.userid = fighters[Args.user]
                        let won = {
                            "<:O_:863314110560993340>": false,
                            "<:X_:863314044781723668>": false
                        }
                        if (Args.a1.emoji == o_emoji && Args.b1.emoji == o_emoji && Args.c1.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.a2.emoji == o_emoji && Args.b2.emoji == o_emoji && Args.c2.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.a3.emoji == o_emoji && Args.b3.emoji == o_emoji && Args.c3.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.a1.emoji == o_emoji && Args.b2.emoji == o_emoji && Args.c3.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.a3.emoji == o_emoji && Args.b2.emoji == o_emoji && Args.c1.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.a1.emoji == o_emoji && Args.a2.emoji == o_emoji && Args.a3.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.b1.emoji == o_emoji && Args.b2.emoji == o_emoji && Args.b3.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.c1.emoji == o_emoji && Args.c2.emoji == o_emoji && Args.c3.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (won["<:O_:863314110560993340>"] != false) {
                            if (Args.user == 0) return m.edit({ content: `<@!${fighters[1]}> (${o_emoji}) won.. That was a nice game.`, components: [] }); else if (Args.user == 1) return m.edit({ content: `<@!${fighters[0]}> (${o_emoji}) won.. That was a nice game.`, components: [] });
                        }
                        if (Args.a1.emoji == x_emoji && Args.b1.emoji == x_emoji && Args.c1.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.a2.emoji == x_emoji && Args.b2.emoji == x_emoji && Args.c2.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.a3.emoji == x_emoji && Args.b3.emoji == x_emoji && Args.c3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.a1.emoji == x_emoji && Args.b2.emoji == x_emoji && Args.c3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.a3.emoji == x_emoji && Args.b2.emoji == x_emoji && Args.c1.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.a1.emoji == x_emoji && Args.a2.emoji == x_emoji && Args.a3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.b1.emoji == x_emoji && Args.b2.emoji == x_emoji && Args.b3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.c1.emoji == x_emoji && Args.c2.emoji == x_emoji && Args.c3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (won["<:X_:863314044781723668>"] != false) {
                            if (Args.user == 0) return m.edit({ content: `<@!${fighters[1]}> (${x_emoji}) won.. That was a nice game.`, components: [] }); else if (Args.user == 1) return m.edit({ content: `<@!${fighters[0]}> (${x_emoji}) won.. That was a nice game.`, components: [] });
                        }
                        let a1 = new MessageButton()
                            .setStyle(Args.a1.style)
                            .setEmoji(Args.a1.emoji)
                            .setCustomId('a1')
                            .setDisabled(Args.a1.disabled);
                        let a2 = new MessageButton()
                            .setStyle(Args.a2.style)
                            .setEmoji(Args.a2.emoji)
                            .setCustomId('a2')
                            .setDisabled(Args.a2.disabled);
                        let a3 = new MessageButton()
                            .setStyle(Args.a3.style)
                            .setEmoji(Args.a3.emoji)
                            .setCustomId('a3')
                            .setDisabled(Args.a3.disabled);
                        let b1 = new MessageButton()
                            .setStyle(Args.b1.style)
                            .setEmoji(Args.b1.emoji)
                            .setCustomId('b1')
                            .setDisabled(Args.b1.disabled);
                        let b2 = new MessageButton()
                            .setStyle(Args.b2.style)
                            .setEmoji(Args.b2.emoji)
                            .setCustomId('b2')
                            .setDisabled(Args.b2.disabled);
                        let b3 = new MessageButton()
                            .setStyle(Args.b3.style)
                            .setEmoji(Args.b3.emoji)
                            .setCustomId('b3')
                            .setDisabled(Args.b3.disabled);
                        let c1 = new MessageButton()
                            .setStyle(Args.c1.style)
                            .setEmoji(Args.c1.emoji)
                            .setCustomId('c1')
                            .setDisabled(Args.c1.disabled);
                        let c2 = new MessageButton()
                            .setStyle(Args.c2.style)
                            .setEmoji(Args.c2.emoji)
                            .setCustomId('c2')
                            .setDisabled(Args.c2.disabled);
                        let c3 = new MessageButton()
                            .setStyle(Args.c3.style)
                            .setEmoji(Args.c3.emoji)
                            .setCustomId('c3')
                            .setDisabled(Args.c3.disabled);
                        let a = new MessageActionRow()
                            .addComponents([a1, a2, a3])
                        let b = new MessageActionRow()
                            .addComponents([b1, b2, b3])
                        let c = new MessageActionRow()
                            .addComponents([c1, c2, c3])
                        let buttons = { components: [a, b, c] }

                        m.edit({ content: `Waiting for Input | <@!${Args.userid}> | Your Emoji: ${Args.user == 0 ? `${o_emoji}` : `${x_emoji}`}`, components: [a, b, c] })
                        const filter = (button) => button.user.id === Args.userid;

                        const collector = m.createMessageComponentCollector({ filter, componentType: 'BUTTON', max: 1, time: 30000 });

                        collector.on('collect', b => {

                            if (b.user.id !== Args.userid) return b.reply({ content: 'Wait for your chance.', ephemeral: true })

                            if (Args.user == 0) {
                                Args.user = 1
                                Args[b.customId] = {
                                    style: "SUCCESS",
                                    emoji: o_emoji,
                                    disabled: true
                                }
                            } else {
                                Args.user = 0
                                Args[b.customId] = {
                                    style: "DANGER",
                                    emoji: x_emoji,
                                    disabled: true
                                }
                            }
                            b.deferUpdate()
                            const map = (obj, fun) =>
                                Object.entries(obj).reduce(
                                    (prev, [key, value]) => ({
                                        ...prev,
                                        [key]: fun(key, value)
                                    }),
                                    {}
                                );
                            const objectFilter = (obj, predicate) =>
                                Object.keys(obj)
                                    .filter(key => predicate(obj[key]))
                                    .reduce((res, key) => (res[key] = obj[key], res), {});
                            let Brgs = objectFilter(map(Args, (_, fruit) => fruit.emoji == dashmoji), num => num == true);
                            if (Object.keys(Brgs).length == 0) return m.edit({ content: 'It\'s a tie!' })
                            tictactoe(m)
                        });
                        collector.on('end', collected => {
                            if (collected.size == 0) m.edit({ content: `<@!${Args.userid}> didn\'t react in time! (30s)`, components: [] })
                        });
                    }

                }
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
    },

    calculator: async function (message, options = []) {

        let { MessageButton, MessageActionRow } = require('discord.js')

        let button = new Array([], [], [], [], []);
        let row = [];
        let text = ["Clear", "(", ")", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", ".", "0", "00", "="];
        let current = 0;

        for (let i = 0; i < text.length; i++) {
            if (button[current].length === 4) current++;
            button[current].push(createButton(text[i]));
            if (i === text.length - 1) {
                for (let btn of button) row.push(addRow(btn));
            }
        }

        if (options.credit === false) {
            foot = options.embedFoot || 'Calculator'
        } else {
            foot = '©️ Simply Develop. npm i simply-djs'
        }

        const emb = new Discord.MessageEmbed()
            .setColor(options.embedColor || 0x075FFF)
            .setFooter(foot)
            .setDescription("```0```")

        message.channel.send({
            embeds: [emb],
            components: row
        }).then((msg) => {

            let isWrong = false;
            let time = 180000
            let value = ""

            if (options.credit === false) {
                foot = options.embedFoot || 'Make sure to win ;)'
            } else {
                foot = '©️ Simply Develop. npm i simply-djs'
            }

            let emb1 = new Discord.MessageEmbed()
                .setFooter(foot)
                .setColor(options.embedColor || 0x075FFF)

            function createCollector(val, result = false) {

                const filter = (button) => button.user.id === message.author.id && button.customId === 'cal' + val
                let collect = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: time });

                collect.on("collect", async x => {
                    if (x.user.id !== message.author.id) return;

                    x.deferUpdate();

                    if (result === "new") value = "0"
                    else if (isWrong) {
                        value = val
                        isWrong = false;
                    } else if (value === "0") value = val;
                    else if (result) {
                        isWrong = true;
                        value = mathEval(value);
                    }
                    else value += val
                    if (value.includes("Clear")) return value = "0"
                    emb1.setDescription("```" + value + "```")

                    msg.edit({
                        embeds: [emb1],
                        components: row
                    })
                })
            }

            for (let txt of text) {
                let result;
                if (txt === "Clear") result = "new";
                else if (txt === "=") result = true;
                else result = false
                createCollector(txt, result)
            }
            setTimeout(() => {
                emb1.setDescription("Your Time for using the calculator ran out (3 minutes)")
                emb1.setColor(0xc90000)
                msg.edit({ emb1 })
            }, time)

        })

        function addRow(btns) {
            let row1 = new MessageActionRow()
            for (let btn of btns) {
                row1.addComponents(btn)
            } return row1;
        }

        function createButton(label, style = "SECONDARY") {
            if (label === "Clear") style = "DANGER"
            else if (label === ".") style = "PRIMARY"
            else if (label === "=") style = "SUCCESS"
            else if (isNaN(label)) style = "PRIMARY"

            const btn = new MessageButton()
                .setLabel(label)
                .setStyle(style)
                .setCustomId("cal" + label)
            return btn;
        }

        function mathEval(input) {
            try {
                let res = `${input} = ${math.evaluate(input)}`
                return res
            } catch {
                return "Wrong Input"
            }
        }
    },

    embedPages: async function (client, message, pages, style = []) {

        let { MessageButton, MessageActionRow } = require('discord.js')

        if (!pages) throw new Error("PAGES_NOT_FOUND. You didnt specify any pages to me. See Examples to clarify your doubts. https://github.com/Rahuletto/simply-djs/blob/main/Examples/embedPages.md")
        if (!client) throw new Error("client not specified. See Examples to clarify your doubts. https://github.com/Rahuletto/simply-djs/blob/main/Examples/embedPages.md")

        var timeForStart = Date.now();
        const timeout = 120000
        if (style.skipBtn == true) {
            const firstbtn = new MessageButton()
                .setCustomId(`first_embed`)

                .setEmoji(style.firstEmoji || "⏪")
                .setStyle(style.skipcolor || 'PRIMARY')

            const pageMovingButtons1 = new MessageButton()
                .setCustomId(`forward_button_embed`)

                .setEmoji(style.forwardEmoji || "▶️")
                .setStyle(style.btncolor || 'SUCCESS')

            const deleteBtn = new MessageButton()
                .setCustomId(`delete_embed`)

                .setEmoji(style.delEmoji || "🗑️")
                .setStyle('DANGER')

            const pageMovingButtons2 = new MessageButton()
                .setCustomId(`back_button_embed`)

                .setEmoji(style.backEmoji || "◀️")
                .setStyle(style.btncolor || 'SUCCESS')

            const lastbtn = new MessageButton()
                .setCustomId(`last_embed`)

                .setEmoji(style.lastEmoji || "⏩")
                .setStyle(style.skipcolor || 'PRIMARY')

            pageMovingButtons = new MessageActionRow()
                .addComponents([firstbtn, pageMovingButtons2, deleteBtn, pageMovingButtons1, lastbtn])

        } else {
            const pageMovingButtons1 = new MessageButton()
                .setCustomId(`forward_button_embed`)

                .setEmoji(style.forwardEmoji || "▶️")
                .setStyle(style.btncolor || 'SUCCESS')

            const deleteBtn = new MessageButton()
                .setCustomId(`delete_embed`)

                .setEmoji(style.delEmoji || "🗑️")
                .setStyle('DANGER')

            const pageMovingButtons2 = new MessageButton()
                .setCustomId(`back_button_embed`)

                .setEmoji(style.backEmoji || "◀️")
                .setStyle(style.btncolor || 'SUCCESS')

            pageMovingButtons = new MessageActionRow()
                .addComponents([pageMovingButtons2, deleteBtn, pageMovingButtons1])
        }

        var currentPage = 0;
        var m = await message.channel.send({ embeds: [pages[0]], components: [pageMovingButtons] });
        client.on('interactionCreate', async b => {

            if (!b.isButton()) return;

            if (Date.now() - timeForStart >= timeout) return;
            if (b.message.id == m.id && b.user.id == message.author.id) {
                if (b.customId == "back_button_embed") {
                    if (currentPage - 1 < 0) {
                        currentPage = pages.length - 1
                    } else {
                        currentPage -= 1;
                    }
                } else if (b.customId == "forward_button_embed") {
                    if (currentPage + 1 == pages.length) {
                        currentPage = 0;
                    } else {
                        currentPage += 1;
                    }
                } else if (b.customId == "delete_embed") {
                    b.message.delete()
                    b.reply({ content: 'Message Deleted', ephemeral: true })
                } else if (b.customId == 'last_embed') {
                    currentPage = pages.length - 1
                } else if (b.customId == 'first_embed') {
                    currentPage = 0;
                }

                if (b.customId == 'first_embed' || b.customId == "back_button_embed" || b.customId == "forward_button_embed" || b.customId == 'last_embed') {
                    m.edit({ embeds: [pages[currentPage]], components: [pageMovingButtons] });
                    b.deferUpdate();
                }
            }
        })
    },

    ticketSystem: async function (message, channel, options = []) {
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

    },

    clickBtn: async function (button, options = []) {

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

        if (options.credit === false) {
            foot = button.message.guild.name, button.message.guild.iconURL()
        } else {
            foot = '©️ Simply Develop. npm i simply-djs'
        }

        if (!button.isButton()) return;

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
                button.reply({ content: options.cooldownMsg || 'You already have a ticket opened.. Please delete it before opening another ticket.' })

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
            button.reply({ content: 'Reopened the ticket ;)' })

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
                    button.message.channel.send({ content: 'An Error Occured. ' + err })
                })
            }, 2000)
        }

        if (button.customId === 'no_ticket') {
            button.message.delete();
            button.reply({ content: 'Ticket Deletion got canceled' })
        }
    },

    stealEmoji: async function (message, args, options = []) {
        if (!message.member.permissions.has("MANAGE_EMOJIS")) return message.channel.send('❌ You Must Have • Server Moderator or ・ Admin Role To Use This Command ❌');
        if (args[0].startsWith("https://cdn.discordapp.com/emojis")) {

            let url = args[0];

            if (args[1]) {
                name = args[1]
            } else {
                name = 'emojiURL'
            }
            message.guild.emojis
                .create(url, name)
                .then((emoji) => {

                    if (options.credit === false) {
                        foot = options.embedFoot || 'Ghost Ping. Oop.'
                    } else {
                        foot = '©️ Simply Develop. npm i simply-djs'
                    }

                    const mentionav = new Discord.MessageEmbed()
                        .setTitle(options.embedTitle || `Emoji Added ;)\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``)
                        .setThumbnail(url)
                        .setColor(options.embedColor || 0x075FFF)
                        .setFooter(foot)

                    message.channel.send({ embeds: [mentionav] })

                }).catch(err => message.channel.send({ content: 'Error Occured. ' + err }))

        } else {

            const hasEmoteRegex = /<a?:.+:\d+>/gm
            const emoteRegex = /<:.+:(\d+)>/gm
            const animatedEmoteRegex = /<a:.+:(\d+)>/gm

            const emoj = message.content.match(hasEmoteRegex)

            if (emoji = emoteRegex.exec(emoj)) {
                const url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".png?v=1"

                if (args[1]) {
                    name = args[1]
                } else {
                    name = emoji[1]
                }

                message.guild.emojis
                    .create(url, name)
                    .then((emoji) => {
                        if (options.credit === false) {
                            foot = options.embedFoot || 'Ghost Ping. Oop.'
                        } else {
                            foot = '©️ Simply Develop. npm i simply-djs'
                        }

                        const mentionav = new Discord.MessageEmbed()
                            .setTitle(options.embedTitle || `Emoji Added ;)\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``)
                            .setThumbnail(url)
                            .setColor(options.embedColor || 0x075FFF)
                            .setFooter(foot)

                        message.channel.send({ embeds: [mentionav] })

                    }).catch(err => message.channel.send({ content: 'Error Occured. ' + err }))

            }
            else if (emoji = animatedEmoteRegex.exec(emoj)) {
                const url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".gif?v=1"

                if (args[1]) {
                    name = args[1]
                } else {
                    name = emoji[1]
                }
                message.guild.emojis
                    .create(url, name)
                    .then((emoji) => {

                        if (options.credit === false) {
                            foot = options.embedFoot || 'Ghost Ping. Oop.'
                        } else {
                            foot = '©️ Simply Develop. npm i simply-djs'
                        }

                        const mentionav = new Discord.MessageEmbed()
                            .setTitle(options.embedTitle || `Emoji Added ;)\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``)
                            .setThumbnail(url)
                            .setColor(options.embedColor || 0x075FFF)
                            .setFooter(foot)

                        message.channel.send({ embeds: [mentionav] })

                    }).catch(err => message.channel.send({ content: 'Error Occured. ' + err }))
            }

            else {
                message.channel.send({ content: options.failedMsg || "Couldn't find an emoji from it" })
            }
        }
    },

    webhooks: async function (client, options = []) {

        if (!options.chid) throw new Error('EMPTY_CHANNEL_ID. You didnt specify a channel id. Go to https://discord.com/invite/3JzDV9T5Fn to get support');

        if (!options.msg && !options.embed) throw new Error('Cannot send a empty message. Please specify a embed or message. Go to https://discord.com/invite/3JzDV9T5Fn to get support');

        const channel = client.channels.cache.get(options.chid);

        if (!channel) throw new Error('INVALID_CHANNEL_ID. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission. Go to https://discord.com/invite/3JzDV9T5Fn to get support');

        try {
            const webhooks = await channel.fetchWebhooks();

            let webhook = webhooks.first();

            if (!webhook) {
                channel.createWebhook(options.username || client.user.username, {
                    avatar: options.avatar || client.user.displayAvatarURL(),
                })
                    .then(async (webhook) => {
                        console.log(`Created webhook`)
                        webhook = webhook

                    });
            }

            if (!options.embed) {
                await webhook.send({
                    content: options.msg || ' ',
                    username: options.username || client.user.username,
                    avatarURL: options.avatar || client.user.displayAvatarURL(),
                })
            } else {
                await webhook.send({
                    content: options.msg || ' ',
                    username: options.username || client.user.username,
                    avatarURL: options.avatar || client.user.displayAvatarURL(),
                    embeds: [options.embed],
                })
            }

        } catch (error) {
            console.error('Error trying to send: ', error);
        }
    },

    ytNotify: async function (client, db, options = []) {
        let startAt = options.startAt
        let chid = options.chid

        if (!chid) throw new Error('EMPTY_CHANNEL_ID. You didnt specify a channel id. Go to https://discord.com/invite/3JzDV9T5Fn to get support');
        if (!options.ytID && !options.ytURL) throw new Error('EMPTY_YT_CHANNEL_ID & EMPTY_YT_CHANNEL_URL. You didnt specify a channel id. Go to https://discord.com/invite/3JzDV9T5Fn to get support');

        let timer = options.timer || "10000"
        let timr = parseInt(timer)

        if (db.fetch(`postedVideos`) === null) db.set(`postedVideos`, []);
        setInterval(async () => {

            function URLtoID(url) {
                let id = null
                url = url.replace(/(>|<)/gi, "").split(/(\/channel\/|\/user\/)/);
                if (url[2]) {
                    id = url[2].split(/[^0-9a-z_-]/i)[0];
                }
                return id;
            }

            let msg = options.msg || 'Hello ! **{author}** just uploaded a new video **{title}**\n\n*{url}*'

            if (Array.isArray(options.ytID)) {

                options.ytID.forEach((ch) => { checkVid(client, ch, chid, msg, db, startAt) })

            } else if (Array.isArray(options.ytURL)) {

                options.ytID.forEach((ch) => { checkVid(client, URLtoID(ch), chid, msg, db, startAt) })

            } else if (!options.ytID && options.ytURL) {
                ytID = URLtoID(options.ytURL);

                checkVid(client, ytID, chid, msg, db, startAt)
            } else {
                ytID = options.ytID;

                checkVid(client, ytID, chid, msg, db, startAt)
            }

            async function checkVid(client, ytID, chid, msg, db, startAt) {
                parse.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${ytID}`)
                    .then(data => {
                        if (!data.items || !data.items[0] || !data || data.items === []) return;
                        if (db.fetch(`postedVideos`).includes(data.items[0].link)) return;
                        else {
                            if (new Date(data.items[0].pubDate).getTime() < startAt) return;

                            db.push("postedVideos", data.items[0].link);
                            let channel = client.channels.cache.get(chid);
                            if (!channel) return;

                            let mssg = msg
                                .replace(/{author}/g, data.items[0].author)
                                .replace(/{title}/g, Discord.Util.escapeMarkdown(data.items[0].title))
                                .replace(/{url}/g, data.items[0].link);
                            channel.send({ content: mssg })
                            console.log('Notified')
                        }
                    });
            }
        }, timr);
    },

    chatbot: async function (client, message, options = []) {
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

                        message.channel.send({ content: `${reply.message}` }).catch(err => message.channel.send({ content: `${err}` }));
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

                        message.channel.send({ content: `${reply.message}` }).catch(err => message.channel.send({ content: `${err}` }));
                    });
            }
        }

    },

    suggestSystem: async function (client, message, args, options = []) {
        let channel = options.chid
        let { MessageButton, MessageActionRow } = require('discord.js')

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
            .setColor(options.embedColor || '#075FFF')
            .setFooter(foot)

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


    },

    suggestBtn: async function (button, users, options = []) {
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
    },

    rps: async function (message, options = []) {
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
    },

    btnrole: async function (client, message, options = []) {
        if (!options.data) throw new Error('NO_DATA_PROVIDED. You didnt specify any data to make buttons..')

        let { MessageButton, MessageActionRow } = require('discord.js')

        let row = [];
        let data = options.data;

        if (data.length <= 5) {
            button = new Array([]);
            btnroleengin(data, button, row)

        } else if (data.length > 5 && data.length <= 10) {
            button = new Array([], []);
            btnroleengin(data, button, row)
        } else if (data.length > 11 && data.length <= 15) {
            button = new Array([], [], []);
            btnroleengin(data, button, row)
        } else if (data.length > 16 && data.length <= 20) {
            button = new Array([], [], [], []);
            btnroleengin(data, button, row)
        } else if (data.length > 21 && data.length <= 25) {
            button = new Array([], [], [], [], []);
            btnroleengin(data, button, row)
        } else if (data.length > 25) {
            throw new Error('Max 25 roles accepted.. Exceeding it will cause errors.')
        }
        async function btnroleengin(data, button, row) {
            let current = 0;


            for (let i = 0; i < data.length; i++) {
                if (button[current].length === 5) current++;

                let role = message.guild.roles.cache.find(r => r.id === data[i].role)

                let emoji = data[i].emoji || null
                let clr = data[i].color || 'SECONDARY'

                if (data[i].color === 'grey') {
                    data[i].color = 'SECONDARY'
                } else if (data[i].color === 'red') {
                    data[i].color = 'DANGER'
                } else if (data[i].color === 'green') {
                    data[i].color = 'SUCCESS'
                } else if (data[i].color === 'blurple') {
                    data[i].color = 'PRIMARY'
                }

                let label = data[i].label || role.name

                button[current].push(createButton(label, role, clr, emoji));
                if (i === data.length - 1) {
                    for (let btn of button) row.push(addRow(btn));
                }
            }
            if (options.credit === false) {
                foot = button.message.guild.name, button.message.guild.iconURL()
            } else {
                foot = '©️ Simply Develop. npm i simply-djs'
            }

            if (!options.embed) throw new Error('NO_EMBED_SPECIFIED. You didnt specify any embed to me to send..')

            let emb = options.embed

            message.channel.send({
                embeds: [emb],
                components: row
            })

            function addRow(btns) {
                let row1 = new MessageActionRow()
                for (let btn of btns) {
                    row1.addComponents(btn)
                } return row1;
            }

            function createButton(label, role, color, emoji) {

                if (!emoji || emoji === null) {
                    const btn = new MessageButton()
                        .setLabel(label)
                        .setStyle(color)
                        .setCustomId("role-" + role.id)
                    return btn;
                } else if (emoji && emoji !== null) {

                    const btn = new MessageButton()
                        .setLabel(label)
                        .setStyle(color)
                        .setCustomId("role-" + role.id)
                        .setEmoji(emoji)
                    return btn;
                }

            }
        }
    },

}
