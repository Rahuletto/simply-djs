const Discord = require('discord.js')
const disbut = require("discord-buttons");
const math = require('mathjs')
const parse = new (require("rss-parser"))();
let users = new Map()
const fetch = require('node-fetch');

module.exports = {

    ghostPing: async function (message, options = []) {
        if (message.author.bot) return;
        if (message.mentions.users.first()) {

            if (options.credit === false) {
                foot = options.embedFoot || 'Ghost Ping.'
            } else {
                foot = '©️ Simply Develop. npm i simply-djs'
            }

            const chembed = new Discord.MessageEmbed()
                .setTitle('Ghost Ping Detected')
                .setDescription(options.embedDesc || `I Found that ${message.author} **(${message.author.tag})** just ghost pinged ${message.mentions.members.first()} **(${message.mentions.users.first().tag})**\n\nContent: **${message.content}**`)
                .setColor(options.embedColor || 0x075FFF)

                .setFooter(foot)
                .setTimestamp()

            message.channel.send(chembed)
        }
    },

    tictactoe: async function (message, options = []) {
        let opponent = message.mentions.members.first()

        if (opponent.id === message.member.id) return message.channel.send("You cant play for 2 Players. Please provide the user to challenge!");


        if (!opponent) return message.channel.send("Please provide the user to challenge!")
        let fighters = [message.member.id, opponent.id].sort(() => (Math.random() > .5) ? 1 : -1)

        let x_emoji = options.xEmoji || "❌"
        let o_emoji = options.oEmoji || "⭕"

        let dashmoji = options.idleEmoji || "➖"

        let Args = {
            user: 0,
            a1: {
                style: "gray",
                emoji: dashmoji,
                disabled: false
            },
            a2: {
                style: "gray",
                emoji: dashmoji,
                disabled: false
            },
            a3: {
                style: "gray",
                emoji: dashmoji,
                disabled: false
            },
            b1: {
                style: "gray",
                emoji: dashmoji,
                disabled: false
            },
            b2: {
                style: "gray",
                emoji: dashmoji,
                disabled: false
            },
            b3: {
                style: "gray",
                emoji: dashmoji,
                disabled: false
            },
            c1: {
                style: "gray",
                emoji: dashmoji,
                disabled: false
            },
            c2: {
                style: "gray",
                emoji: dashmoji,
                disabled: false
            },
            c3: {
                style: "gray",
                emoji: dashmoji,
                disabled: false
            }
        }
        let { MessageButton, MessageActionRow } = require('discord-buttons')

        if (options.credit === false) {
            foot = options.embedFoot || 'Make sure to win ;)'
        } else {
            foot = '©️ Simply Develop. npm i simply-djs'
        }

        const xoemb = new Discord.MessageEmbed()
            .setTitle('TicTacToe')
            .setDescription(`**How to Play ?**\n*Wait for your turn.. If its your turn, Click one of the buttons from the table to draw your emoji at there.*`)
            .setColor(options.embedColor || 0x075FFF)
            .setFooter(foot)
            .setTimestamp()
        let infomsg = await message.channel.send(xoemb).then(ms => {
            setTimeout(() => ms.delete(), 10000)
        })

        let msg = await message.channel.send(`Waiting for Input | <@!${Args.userid}>, Your Emoji: ${o_emoji}`)
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
            if (won["<:O_:863314110560993340>"] != false) return m.edit(`<@!${Args.userid}> (${o_emoji}) won.. That was a nice game.`)
            if (Args.a1.emoji == x_emoji && Args.b1.emoji == x_emoji && Args.c1.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
            if (Args.a2.emoji == x_emoji && Args.b2.emoji == x_emoji && Args.c2.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
            if (Args.a3.emoji == x_emoji && Args.b3.emoji == x_emoji && Args.c3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
            if (Args.a1.emoji == x_emoji && Args.b2.emoji == x_emoji && Args.c3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
            if (Args.a3.emoji == x_emoji && Args.b2.emoji == x_emoji && Args.c1.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
            if (Args.a1.emoji == x_emoji && Args.a2.emoji == x_emoji && Args.a3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
            if (Args.b1.emoji == x_emoji && Args.b2.emoji == x_emoji && Args.b3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
            if (Args.c1.emoji == x_emoji && Args.c2.emoji == x_emoji && Args.c3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
            if (won["<:X_:863314044781723668>"] != false) return m.edit(`<@!${Args.userid}> (${x_emoji}) won.. That was a nice game.`)
            let a1 = new MessageButton()
                .setStyle(Args.a1.style)
                .setEmoji(Args.a1.emoji)
                .setID('a1')
                .setDisabled(Args.a1.disabled);
            let a2 = new MessageButton()
                .setStyle(Args.a2.style)
                .setEmoji(Args.a2.emoji)
                .setID('a2')
                .setDisabled(Args.a2.disabled);
            let a3 = new MessageButton()
                .setStyle(Args.a3.style)
                .setEmoji(Args.a3.emoji)
                .setID('a3')
                .setDisabled(Args.a3.disabled);
            let b1 = new MessageButton()
                .setStyle(Args.b1.style)
                .setEmoji(Args.b1.emoji)
                .setID('b1')
                .setDisabled(Args.b1.disabled);
            let b2 = new MessageButton()
                .setStyle(Args.b2.style)
                .setEmoji(Args.b2.emoji)
                .setID('b2')
                .setDisabled(Args.b2.disabled);
            let b3 = new MessageButton()
                .setStyle(Args.b3.style)
                .setEmoji(Args.b3.emoji)
                .setID('b3')
                .setDisabled(Args.b3.disabled);
            let c1 = new MessageButton()
                .setStyle(Args.c1.style)
                .setEmoji(Args.c1.emoji)
                .setID('c1')
                .setDisabled(Args.c1.disabled);
            let c2 = new MessageButton()
                .setStyle(Args.c2.style)
                .setEmoji(Args.c2.emoji)
                .setID('c2')
                .setDisabled(Args.c2.disabled);
            let c3 = new MessageButton()
                .setStyle(Args.c3.style)
                .setEmoji(Args.c3.emoji)
                .setID('c3')
                .setDisabled(Args.c3.disabled);
            let a = new MessageActionRow()
                .addComponents([a1, a2, a3])
            let b = new MessageActionRow()
                .addComponents([b1, b2, b3])
            let c = new MessageActionRow()
                .addComponents([c1, c2, c3])
            let buttons = { components: [a, b, c] }

            m.edit(`Waiting for Input | <@!${Args.userid}> | Your Emoji: ${Args.user == 0 ? `${o_emoji}` : `${x_emoji}`}`, buttons)
            const filter = (button) => button.clicker.user.id === Args.userid;
            const collector = m.createButtonCollector(filter, { max: 1, time: 30000 });

            collector.on('collect', b => {
                if (Args.user == 0) {
                    Args.user = 1
                    Args[b.id] = {
                        style: "green",
                        emoji: o_emoji,
                        disabled: true
                    }
                } else {
                    Args.user = 0
                    Args[b.id] = {
                        style: "red",
                        emoji: x_emoji,
                        disabled: true
                    }
                }
                b.reply.defer()
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
                if (Object.keys(Brgs).length == 0) return m.edit('It\'s a tie!')
                tictactoe(m)
            });
            collector.on('end', collected => {
                if (collected.size == 0) m.edit(`<@!${Args.userid}> didn\'t react in time! (30s)`)
            });
        }
    },

    calculator: async function (message, options = []) {

        let { MessageButton, MessageActionRow } = require('discord-buttons')

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
            foot = button.message.guild.name, button.message.guild.iconURL()
        } else {
            foot = '©️ Simply Develop. npm i simply-djs'
        }

        const emb = new Discord.MessageEmbed()
            .setColor(options.embedColor || 0x075FFF)

            .setDescription("```0```")
            .setFooter(foot)

        message.channel.send({
            embed: emb,
            components: row
        }).then((msg) => {

            let isWrong = false;
            let time = 180000
            let value = ""

            if (options.credit === false) {
                foot = button.message.guild.name, button.message.guild.iconURL()
            } else {
                foot = '©️ Simply Develop. npm i simply-djs'
            }

            let emb1 = new Discord.MessageEmbed()
                .setFooter(foot)
                .setColor(options.embedColor || 0x075FFF)

            function createCollector(val, result = false) {
                let filter = (buttons1) => buttons1.clicker.user.id === message.author.id && buttons1.id === "cal" + val;
                let collect = msg.createButtonCollector(filter, { time: time });

                collect.on("collect", async x => {
                    x.reply.defer();

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
                        embed: emb1,
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
                row1.addComponent(btn)
            } return row1;
        }

        function createButton(label, style = "grey") {
            if (label === "Clear") style = "red"
            else if (label === ".") style = "grey"
            else if (label === "=") style = "green"
            else if (isNaN(label)) style = "blurple"

            const btn = new MessageButton()
                .setLabel(label)
                .setStyle(style)
                .setID("cal" + label)
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

        if (!pages) throw new Error("PAGES_NOT_FOUND. You didnt specify any pages to me. See Examples to clarify your doubts. https://github.com/Rahuletto/simply-djs/blob/main/Examples/embedPages.md")
        if (!client) throw new Error("client not specified. See Examples to clarify your doubts. https://github.com/Rahuletto/simply-djs/blob/main/Examples/embedPages.md")

        var timeForStart = Date.now();
        const timeout = 120000
        if (style.skipBtn == true) {
            const firstbtn = new disbut.MessageButton()
                .setID(`first_embed`)
                .setLabel("")
                .setEmoji(style.firstEmoji || "⏪")
                .setStyle(style.skipcolor || 'blurple')

            const pageMovingButtons1 = new disbut.MessageButton()
                .setID(`forward_button_embed`)
                .setLabel("")
                .setEmoji(style.forwardEmoji || "▶️")
                .setStyle(style.btncolor || 'green')

            const deleteBtn = new disbut.MessageButton()
                .setID(`delete_embed`)
                .setLabel("")
                .setEmoji(style.delEmoji || "🗑️")
                .setStyle('red')

            const pageMovingButtons2 = new disbut.MessageButton()
                .setID(`back_button_embed`)
                .setLabel("")
                .setEmoji(style.backEmoji || "◀️")
                .setStyle(style.btncolor || 'green')

            const lastbtn = new disbut.MessageButton()
                .setID(`last_embed`)
                .setLabel("")
                .setEmoji(style.lastEmoji || "⏩")
                .setStyle(style.skipcolor || 'blurple')

            pageMovingButtons = new disbut.MessageActionRow()
                .addComponent(firstbtn)
                .addComponent(pageMovingButtons2)
                .addComponent(deleteBtn)
                .addComponent(pageMovingButtons1)
                .addComponent(lastbtn)
        } else {
            const pageMovingButtons1 = new disbut.MessageButton()
                .setID(`forward_button_embed`)
                .setLabel("")
                .setEmoji(style.forwardEmoji || "▶️")
                .setStyle(style.btncolor || 'green')

            const deleteBtn = new disbut.MessageButton()
                .setID(`delete_embed`)
                .setLabel("")
                .setEmoji(style.delEmoji || "🗑️")
                .setStyle('red')

            const pageMovingButtons2 = new disbut.MessageButton()
                .setID(`back_button_embed`)
                .setLabel("")
                .setEmoji(style.backEmoji || "◀️")
                .setStyle(style.btncolor || 'green')

            pageMovingButtons = new disbut.MessageActionRow()
                .addComponent(pageMovingButtons2)
                .addComponent(deleteBtn)
                .addComponent(pageMovingButtons1)
        }

        var currentPage = 0;
        var m = await message.channel.send(pages[0], { components: [pageMovingButtons] });
        client.on("clickButton", async b => {
            if (Date.now() - timeForStart >= timeout) return;
            if (b.message.id == m.id && b.clicker.user.id == message.author.id) {
                if (b.id == "back_button_embed") {
                    if (currentPage - 1 < 0) {
                        currentPage = pages.length - 1
                    } else {
                        currentPage -= 1;
                    }
                } else if (b.id == "forward_button_embed") {
                    if (currentPage + 1 == pages.length) {
                        currentPage = 0;
                    } else {
                        currentPage += 1;
                    }
                } else if (b.id == "delete_embed") {
                    b.message.delete()
                    b.reply.send('Message Deleted').then((m) => {
                        setTimeout(() => {
                            m.delete()
                        }, 5000)
                    })
                } else if (b.id == 'last_embed') {
                    currentPage = pages.length - 1
                } else if (b.id == 'first_embed') {
                    currentPage = 0;
                }

                if (b.id == 'first_embed' || b.id == "back_button_embed" || b.id == "forward_button_embed" || b.id == 'last_embed') {
                    m.edit(pages[currentPage], { components: [pageMovingButtons] });
                    b.reply.defer(true);
                }
            }
        })
    },

    ticketSystem: async function (message, channel, options = []) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You dont have permissions to setup a ticket system")
        if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.reply("I dont have any permissions to work with ticket system | Needed Permission: MANAGE_CHANNELS")
        let ticketbtn = new disbut.MessageButton()
            .setStyle(options.color || 'grey')
            .setEmoji(options.emoji || '🎫')
            .setLabel('Ticket')
            .setID('create_ticket');

        if (options.credit === false) {
            foot = options.embedFoot || message.guild.name, message.guild.iconURL()
        } else {
            foot = '©️ Simply Develop. npm i simply-djs'
        }

        let embed = new Discord.MessageEmbed()
            .setTitle('Create a ticket')
            .setDescription(options.embedDesc || '🎫 Create a ticket by clicking the button 🎫')
            .setThumbnail(message.guild.iconURL())
            .setTimestamp()
            .setColor(options.embedColor || '#075FFF')
            .setFooter(foot)

        try {
            channel.send({ embed: embed, component: ticketbtn })
        } catch (err) {
            channel.send('ERR OCCURED ' + err)
        }
    },

    clickBtn: async function (button, options = []) {
        await button.clicker.fetch()
        if (button.id === 'create_ticket') {

            let ticketname = `ticket_${button.clicker.user.id}`

            let antispamo = await button.guild.channels.cache.find(ch => ch.name === ticketname.toLowerCase());

            if (antispamo) {
                button.reply.send(options.cooldownMsg || 'You already have a ticket opened.. Please delete it before opening another ticket.').then((msg) => {
                    setTimeout(() => {
                        msg.delete()
                    }, 5000)

                })
            } else if (!antispamo) {
                button.reply.defer();

                roles = {
                    id: options.role || button.clicker.user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                }

                chparent = options.categoryID || null
                let categ = button.guild.channels.cache.get(options.categoryID)
                if (!categ) { chparent = null }

                button.guild.channels.create(`ticket_${button.clicker.user.id}`, {
                    type: "text",
                    parent: chparent,
                    permissionOverwrites: [
                        {
                            id: button.message.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
                        },
                        {
                            id: button.clicker.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        },
                        roles
                    ],
                }).then((ch) => {

                    if (options.credit === false) {
                        foot = button.message.guild.name, button.message.guild.iconURL()
                    } else {
                        foot = '©️ Simply Develop. npm i simply-djs'
                    }

                    let emb = new Discord.MessageEmbed()
                        .setTitle('Ticket Created')
                        .setDescription(options.embedDesc || `Ticket has been raised by ${button.clicker.user}. We ask the Admins to summon here\n\nThis channel will be deleted after 10 minutes to reduce the clutter`)
                        .setThumbnail(button.message.guild.iconURL())
                        .setTimestamp()
                        .setColor(options.embedColor || '#075FFF')
                        .setFooter(foot)


                    let close_btn = new disbut.MessageButton()
                        .setStyle(options.closeColor || 'blurple')
                        .setEmoji(options.closeEmoji || '🔒')
                        .setLabel('Close')
                        .setID('close_ticket')

                    ch.send(button.clicker.user, { embed: emb, component: close_btn })
                    if (options.timeout == true || !options.timeout) {
                        setTimeout(() => {
                            ch.send('Timeout.. You have reached 10 minutes. This ticket is getting deleted right now.')

                            setTimeout(() => {
                                ch.delete()
                            }, 5000)

                        }, 600000)
                    } else return;
                })
            }
        }
        if (button.id === 'close_ticket') {

            button.reply.defer();

            button.channel.updateOverwrite([
                {
                    id: button.message.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
                },
                {
                    id: button.clicker.user.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['SEND_MESSAGES'],
                },
            ]);

            let X_btn = new disbut.MessageButton()
                .setStyle(options.delColor || 'grey')
                .setEmoji(options.delEmoji || '❌')
                .setLabel('Delete')
                .setID('delete_ticket')

            let open_btn = new disbut.MessageButton()
                .setStyle(options.openColor || 'green')
                .setEmoji(options.openEmoji || '🔓')
                .setLabel('Reopen')
                .setID('open_ticket')

            let row = new disbut.MessageActionRow()
                .addComponent(open_btn)
                .addComponent(X_btn)

            if (options.credit === false) {
                foot = button.message.guild.name, button.message.guild.iconURL()
            } else {
                foot = '©️ Simply Develop. npm i simply-djs'
            }

            let emb = new Discord.MessageEmbed()
                .setTitle('Ticket Created')
                .setDescription(options.embedDesc || `Ticket has been raised by ${button.clicker.user}. We ask the Admins to summon here\n\nThis channel will be deleted after 10 minutes to reduce the clutter`)
                .setThumbnail(button.message.guild.iconURL())
                .setTimestamp()
                .setColor(options.embedColor || '#075FFF')
                .setFooter(foot)

            button.message.edit(button.clicker.user, { embed: emb, component: row })
        }

        if (button.id === 'open_ticket') {


            button.channel.updateOverwrite([
                {
                    id: button.message.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
                },
                {
                    id: button.clicker.user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
            ]);

            if (options.credit === false) {
                foot = button.message.guild.name, button.message.guild.iconURL()
            } else {
                foot = '©️ Simply Develop. npm i simply-djs'
            }

            let emb = new Discord.MessageEmbed()
                .setTitle('Ticket Created')
                .setDescription(options.embedDesc || `Ticket has been raised by ${button.clicker.user}. We ask the Admins to summon here` + `This channel will be deleted after 10 minutes to reduce the clutter`)
                .setThumbnail(button.message.guild.iconURL())
                .setTimestamp()
                .setColor(options.embedColor || '#075FFF')
                .setFooter(foot)


            let close_btn = new disbut.MessageButton()
                .setStyle(options.closeColor || 'blurple')
                .setEmoji(options.closeEmoji || '🔒')
                .setLabel('Close')
                .setID('close_ticket')

            button.message.edit(button.clicker.user, { embed: emb, component: close_btn })
            button.reply.send('Reopened the ticket ;)').then((m) => {
                setTimeout(() => {
                    m.delete()
                }, 3000)

            })
        }

        if (button.id === 'delete_ticket') {

            let surebtn = new disbut.MessageButton()
                .setStyle('red')
                .setLabel('Sure')
                .setID('s_ticket')

            let nobtn = new disbut.MessageButton()
                .setStyle('green')
                .setLabel('Cancel')
                .setID('no_ticket')

            let row1 = new disbut.MessageActionRow()
                .addComponent(surebtn)
                .addComponent(nobtn)

            if (options.credit === false) {
                foot = button.message.guild.name, button.message.guild.iconURL()
            } else {
                foot = '©️ Simply Develop. npm i simply-djs'
            }

            let emb = new Discord.MessageEmbed()
                .setTitle('Are you sure ?')
                .setDescription(`This will delete the channel and the ticket. You cant undo this action`)
                .setThumbnail(button.message.guild.iconURL())
                .setTimestamp()
                .setColor('#c90000')
                .setFooter(foot)

            button.reply.send({ embed: emb, component: row1 })


        }

        if (button.id === 's_ticket') {

            button.reply.send('Deleting the ticket and channel.. Please wait.')

            setTimeout(() => {
                let delch = button.message.guild.channels.cache.get(button.message.channel.id)
                delch.delete().catch((err) => {
                    button.message.channel.send('An Error Occured. ' + err)
                })
            }, 2000)
        }

        if (button.id === 'no_ticket') {
            button.message.delete();
            button.reply.send('Ticket Deletion got canceled')
        }
    },

    stealEmoji: async function (message, args, options = []) {

        if (!message.member.hasPermission("MANAGE_EMOJIS")) return message.channel.send('❌ You Must Have • Server Moderator or ・ Admin Role To Use This Command ❌');

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
                        foot = options.embedFoot || 'Dont steal. its illegal'
                    } else {
                        foot = '©️ Simply Develop. npm i simply-djs'
                    }
                    const mentionav = new Discord.MessageEmbed()
                        .setTitle(options.embedTitle || `Emoji Added ;)\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``)
                        .setThumbnail(url)
                        .setColor(options.embedColor || 0x075FFF)
                        .setFooter(foot)

                    message.channel.send(mentionav)

                }).catch(err => message.channel.send('Error Occured. ' + err))

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
                        const mentionav = new Discord.MessageEmbed()
                            .setTitle(options.embedTitle || `Emoji Added ;)\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``)
                            .setThumbnail(url)
                            .setColor(options.embedColor || 0x075FFF)
                            .setFooter(options.embedFoot || 'Stop stealing.. its illegal.')

                        message.channel.send(mentionav)

                    }).catch(err => message.channel.send('Error Occured. ' + err))

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
                        const mentionav = new Discord.MessageEmbed()
                            .setTitle(options.embedTitle || `Emoji Added ;)\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``)
                            .setThumbnail(url)
                            .setColor(options.embedColor || 0x075FFF)
                            .setFooter(options.embedFoot || 'Stop stealing.. its illegal.')

                        message.channel.send(mentionav)

                    }).catch(err => message.channel.send('Error Occured. ' + err))
            }

            else {
                message.channel.send(options.failedMsg || "Couldn't find an emoji from it")
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
                        console.log(`Created webhook ${webhook}`)
                        webhook = webhook

                    });
            }

            if (!options.embed) {
                await webhook.send(options.msg || ' ', {
                    username: options.username || client.user.username,
                    avatarURL: options.avatar || client.user.displayAvatarURL(),
                })
            } else {
                await webhook.send(options.msg || ' ', {
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
                            channel.send(mssg)
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
                if (!ch) throw new Error('INVALID_CHANNEL_ID. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission. Go to https://discord.com/invite/3JzDV9T5Fn to get support');;
            })


            if (channel.includes(message.channel.id)) {

                let name = options.name || client.user.username
                let developer = options.developer || 'Rahuletto#0243'

                fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${message}&botname=${name}&ownername=${developer}&user=${message.author.id}`)
                    .then(res => res.json())
                    .then(reply => {

                        message.channel.send(`${reply.message}`).catch(err => message.channel.send(`${err}`));
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

                        message.channel.send(`${reply.message}`).catch(err => message.channel.send(`${err}`));
                    });
            }
        }
    },

    suggestSystem: async function (client, message, args, options = []) {
        let channel = options.chid

        const ch = client.channels.cache.get(channel);
        if (!ch) throw new Error('INVALID_CHANNEL_ID. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission. Go to https://discord.com/invite/3JzDV9T5Fn to get support');;

        let suggestion = args.join(" ")

        if (options.credit === false) {
            foot = options.embedFoot || 'Ghost Ping.'
        } else {
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

        let approve = new disbut.MessageButton()
            .setEmoji(options.yesEmoji || '☑️')
            .setStyle(options.yesColor || 'green')
            .setID('agree-sug')

        let no = new disbut.MessageButton()
            .setEmoji(options.noEmoji || '🇽')
            .setStyle(options.noColor || 'red')
            .setID('no-sug')

        let row = new disbut.MessageActionRow()
            .addComponents([approve, no])

        channel.send(emb, { component: row })


    },

   suggestBtn: async function (button, users, options = []) {

        if (button.id === 'no-sug') {
            let target = await button.message.channel.messages.fetch(button.message.id)
            let oldemb = target.embeds[0]

            await button.clicker.fetch();

            if (button.clicker.member.hasPermission('ADMINISTRATOR')) {

                button.reply.send('Reason ?? if not, Ill give it as `No Reason` Timeout: 15 Seconds..').then((m) => setTimeout(() => { m.delete() }, 15000))

                let filter = m => button.clicker.user.id === m.author.id

                const collector = button.message.channel.createMessageCollector(filter, { time: 15000 });

                collector.on('collect', m => {

                    if (m.content.toLowerCase() === 'cancel') {
                        m.delete()
                        button.reply.edit('Refusal Cancelled')
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

                if (users.has(`${button.message.id}-${button.clicker.user.id}-dislike`, button.clicker.user.id)) {
                    button.reply.send('You cannot react again.', true)
                }
                else {

                    if (users.has(`${button.message.id}-${button.clicker.user.id}-like`, button.clicker.user.id)) {
                        users.delete(`${button.message.id}-${button.clicker.user.id}-like`, button.clicker.user.id)

                        users.set(`${button.message.id}-${button.clicker.user.id}-dislike`, button.clicker.user.id)


                        removelike(oldemb)

                    } else {

                        button.reply.defer()
                        users.set(`${button.message.id}-${button.clicker.user.id}-dislike`, button.clicker.user.id)

                        dislike(oldemb)
                    }

                }

            }
        }

        async function removelike(oldemb) {

            let approve = new disbut.MessageButton()
                .setEmoji(options.yesEmoji || '☑️')
                .setStyle(options.yesColor || 'green')
                .setID('agree-sug')

            let no = new disbut.MessageButton()
                .setEmoji(options.noEmoji || '🇽')
                .setStyle(options.noColor || 'red')
                .setID('no-sug')

            let row = new disbut.MessageActionRow()
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
                .setFooter(oldemb.footer)
                .setImage(oldemb.image)
                .addFields(
                    { name: oldemb.fields[0].name, value: oldemb.fields[0].value },
                    { name: 'Reactions', value: `*Likes:* \`${lik}\` \n*Dislikes:* \`${dislik}\`` }
                )

            button.message.edit(newemb, { component: row })

        }

        async function dislike(oldemb) {

            let approve = new disbut.MessageButton()
                .setEmoji(options.yesEmoji || '☑️')
                .setStyle(options.yesColor || 'green')
                .setID('agree-sug')

            let no = new disbut.MessageButton()
                .setEmoji(options.noEmoji || '🇽')
                .setStyle(options.noColor || 'red')
                .setID('no-sug')

            let row = new disbut.MessageActionRow()
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
                .setFooter(oldemb.footer)
                .addFields(
                    { name: oldemb.fields[0].name, value: oldemb.fields[0].value },
                    { name: 'Reactions', value: `*Likes:* ${lik} \n*Dislikes:* \`${dislik}\`` }
                )

            button.message.edit(newemb, { component: row })
        }

        async function dec(reason, oldemb) {

            let approve = new disbut.MessageButton()
                .setEmoji(options.yesEmoji || '☑️')
                .setStyle(options.yesColor || 'green')
                .setID('agree-sug')
                .setDisabled(true)

            let no = new disbut.MessageButton()
                .setEmoji(options.noEmoji || '🇽')
                .setStyle(options.noColor || 'red')
                .setID('no-sug')
                .setDisabled(true)

            let row = new disbut.MessageActionRow()
                .addComponents([approve, no])

            let likesnd = oldemb.fields[1].value.split(/\s+/);

            let lik = likesnd[1]
            let dislik = likesnd[3]

            const newemb = new Discord.MessageEmbed()
                .setDescription(oldemb.description)
                .setColor(options.denyEmbColor || 'RED')
                .setAuthor(oldemb.author.name, oldemb.author.iconURL)
                .setImage(oldemb.image)
                .setFooter(oldemb.footer)
                .addFields({ name: 'Status:', value: `\`\`\`Rejected !\`\`\`` },
                    { name: 'Reason:', value: `\`\`\`${reason}\`\`\`` },
                    { name: 'Reactions', value: `*Likes:* ${lik} \n*Dislikes:* ${dislik}` }
                )

            button.message.edit(newemb, { component: row })

        }

        if (button.id === 'agree-sug') {

            let target = await button.message.channel.messages.fetch(button.message.id)
            let oldemb = target.embeds[0]

            await button.clicker.fetch();

            if (button.clicker.member.hasPermission('ADMINISTRATOR')) {

                button.reply.send('Tell me the reason.. if not, Ill give it as `No Reason` Timeout: 15 Seconds..').then((m) => setTimeout(() => { m.delete() }, 15000))

                let filter = m => button.clicker.user.id === m.author.id

                const collector = button.message.channel.createMessageCollector(filter, { time: 15000 });

                collector.on('collect', m => {

                    if (m.content.toLowerCase() === 'cancel') {
                        m.delete()
                        button.reply.edit('Approval Cancelled')
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


                if (users.has(`${button.message.id}-${button.clicker.user.id}-like`, button.clicker.user.id)) {
                    button.reply.send('You cannot react again.', true)
                }
                else {

                    if (users.has(`${button.message.id}-${button.clicker.user.id}-dislike`, button.clicker.user.id)) {
                        users.delete(`${button.message.id}-${button.clicker.user.id}-dislike`, button.clicker.user.id)


                        users.set(`${button.message.id}-${button.clicker.user.id}-like`, button.clicker.user.id)

                        removedislike(oldemb)

                    } else {
                        button.reply.defer()
                        users.set(`${button.message.id}-${button.clicker.user.id}-like`, button.clicker.user.id)

                        like(oldemb)
                    }

                }

            }

        }

        async function removedislike(oldemb) {

            let approve = new disbut.MessageButton()
                .setEmoji(options.yesEmoji || '☑️')
                .setStyle(options.yesColor || 'green')
                .setID('agree-sug')

            let no = new disbut.MessageButton()
                .setEmoji(options.noEmoji || '🇽')
                .setStyle(options.noColor || 'red')
                .setID('no-sug')

            let row = new disbut.MessageActionRow()
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
                .setFooter(oldemb.footer)
                .addFields(
                    { name: oldemb.fields[0].name, value: oldemb.fields[0].value },
                    { name: 'Reactions', value: `*Likes:* \`${lik}\` \n*Dislikes:* \`${dislik}\`` }
                )

            button.message.edit(newemb, { component: row })
        }

        async function like(oldemb) {

            let approve = new disbut.MessageButton()
                .setEmoji(options.yesEmoji || '☑️')
                .setStyle(options.yesColor || 'green')
                .setID('agree-sug')

            let no = new disbut.MessageButton()
                .setEmoji(options.noEmoji || '🇽')
                .setStyle(options.noColor || 'red')
                .setID('no-sug')

            let row = new disbut.MessageActionRow()
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
                .setFooter(oldemb.footer)
                .addFields(
                    { name: oldemb.fields[0].name, value: oldemb.fields[0].value },
                    { name: 'Reactions', value: `*Likes:* \`${lik}\` \n*Dislikes:* ${dislik}` }
                )

            button.message.edit(newemb, { component: row })
        }

        async function aprov(reason, oldemb) {
            let approve = new disbut.MessageButton()
                .setEmoji(options.yesEmoji || '☑️')
                .setStyle(options.yesColor || 'green')
                .setID('agree-sug')
                .setDisabled(true)

            let no = new disbut.MessageButton()
                .setEmoji(options.noEmoji || '🇽')
                .setStyle(options.noColor || 'red')
                .setID('no-sug')
                .setDisabled(true)

            let row = new disbut.MessageActionRow()
                .addComponents([approve, no])

            let likesnd = oldemb.fields[1].value.split(/\s+/);

            let lik = likesnd[1]
            let dislik = likesnd[3]

            const newemb = new Discord.MessageEmbed()
                .setDescription(oldemb.description)
                .setColor(options.agreeEmbColor || 'GREEN')
                .setAuthor(oldemb.author.name, oldemb.author.iconURL)
                .setImage(oldemb.image)
                .setFooter(oldemb.footer)
                .addFields({ name: 'Status:', value: `\`\`\`Accepted !\`\`\`` },
                    { name: 'Reason:', value: `\`\`\`${reason}\`\`\`` },
                    { name: 'Reactions', value: `*Likes:* ${lik} \n*Dislikes:* ${dislik}` }
                )

            button.message.edit(newemb, { component: row })

        }
    },

    rps: async function(message, options = []){
        let opponent = message.mentions.members.first()
        if (!opponent) return message.channel.send('Please Tag a member to challenge!')
        if (opponent.id === message.author.id) return message.channel.send('You may not play as 2 players!')

        let foot = ""
        if (options.credit === false) {
            foot = options.embedFoot || 'Rock Paper Scissors'
        } else {
            foot = '©️ Simply Develop. npm i simply-djs'
        }

        let acceptEmbed = new Discord.MessageEmbed()
        .setTitle(`Waiting for ${opponent.user.tag} to accept!`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(options.embedColor || 0x075FFF)
        .setFooter(foot)

        let accept = new disbut.MessageButton()
        .setStyle('green')
        .setID('accept')
        .setLabel('Accept')

        let accep = new disbut.MessageActionRow()
        .addComponent(accept)

        let m = await message.channel.send({embed: acceptEmbed, components: accep})
        let filter = (button) => button.clicker.user.id == opponent.user.id
        let collector = m.createButtonCollector(filter, {time:30000})
        collector.on('collect', (button) => {
            button.reply.defer()
            let embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.tag} VS. ${opponent.user.tag}`)
            .setColor(options.embedColor || 0x075FFF)
            .setFooter(foot)
            .setDescription("Select 🪨, 📄, or ✂️")

            let rock = new disbut.MessageButton()
            .setStyle('grey')
            .setID('rock')
            .setLabel('Rock')
            .setEmoji('🪨')
            
            let paper = new disbut.MessageButton()
            .setStyle('grey')
            .setID('paper')
            .setLabel('Paper')
            .setEmoji('📄')
            
            let scissors = new disbut.MessageButton()
            .setStyle('grey')
            .setID('scissors')
            .setLabel('Scissors')
            .setEmoji('✂️')
            
            let rps = new disbut.MessageActionRow()
            .addComponent(rock)
            .addComponent(paper)
            .addComponent(scissors)
            m.edit({embed:embed, components: rps})
            collector.stop()

            let ids = new Set()
            ids.add(message.author.id)
            ids.add(opponent.user.id)
            let filter = (button) => ids.has(button.clicker.user.id)
            let collect = m.createButtonCollector(filter, { time: 30000 })
            let mem, auth
            collect.on('collect', b => {
                ids.delete(b.clicker.user.id)
                b.reply.defer()
                if(b.clicker.user.id == opponent.id){
                mem = b.id
                }
                if(b.clicker.user.id == message.author.id){
                auth = b.id
                }
                if(ids.size == 0) collect.stop()
            })
            collect.on('end', c => {
                if(c.size < 2){
                    let embed = new Discord.MessageEmbed()
                    .setTitle('Game Timed Out!')
                    .setDescription('Game Time: 30s')
                    .setColor(options.embedColor || 0x07FFF)
                    .setFooter(foot)

                    m.edit({embed:embed, components: []})
                }
                else{
                if(mem == 'rock' && auth == 'scissors'){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`${opponent.user.tag} Wins!`)
                    .setColor(options.embedColor || 0x075FFF)
                    .setDescription('Rock defeats Scissors')
                    .setFooter(foot)
                    m.edit({embed:embed, components: []})
                }else if(mem == 'scissors' && auth == 'rock'){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`${message.member.user.tag} Wins!`)
                    .setColor(options.embedColor || 0x075FFF)
                    .setDescription('Rock defeats Scissors')
                    .setFooter(foot)
                    m.edit({embed:embed, components: []})
                }
                else if(mem == 'scissors' && auth == 'paper'){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`${opponent.user.tag} Wins!`)
                    .setColor(options.embedColor || 0x075FFF)
                    .setDescription('Scissors defeats Paper')
                    .setFooter(foot)
                    m.edit({embed:embed, components: []})
                }else if(mem == 'paper' && auth == 'scissors'){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`${message.member.user.tag} Wins!`)
                    .setColor(options.embedColor || 0x075FFF)
                    .setDescription('Scissors defeats Paper')
                    .setFooter(foot)
                    m.edit({embed:embed, components: []})
                }
                else if(mem == 'paper' && auth == 'rock'){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`${opponent.user.tag} Wins!`)
                    .setColor(options.embedColor || 0x075FFF)
                    .setDescription('Paper defeats Rock')
                    .setFooter(foot)
                    m.edit({embed:embed, components: []})
                }else if(mem == 'rock' && auth == 'paper'){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`${message.member.user.tag} Wins!`)
                    .setColor(options.embedColor || 0x075FFF)
                    .setDescription('Paper defeats Rock')
                    .setFooter(foot)
                    m.edit({embed:embed, components: []})
                }
                else{
                    let embed = new Discord.MessageEmbed()
                    .setTitle('Draw!')
                    .setColor(options.embedColor || 0x075FFF)
                    .setDescription(`Both players chose ${mem}`)
                    .setFooter(foot)
                    m.edit({embed:embed, components: []})
                }
                }
            })
        })
        collector.on('end', (c, r) => {
            if(c.size == 0){
                let embed = new Discord.MessageEmbed()
                .setTitle('Challenge Not Accepted')
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor(options.embedColor || 0x075FFF)
                .setFooter(foot)
                .setDescription('Ran out of time!\nTime limit: 30s')
                m.edit({embed: embed, components: []})
            }else{

            }
        })
    }

}
