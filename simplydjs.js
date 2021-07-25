const Discord = require('discord.js')
const disbut = require("discord-buttons");
const math = require('mathjs')

module.exports = {
    ghostPing: async function (message, options = {}) {
        if (message.author.bot) return;
        if (message.mentions.users.first()) {
            const chembed = new Discord.MessageEmbed()
                .setTitle('Ghost Ping Detected')
                .setDescription(options.embedDesc || `I Found that ${message.author} **(${message.author.tag})** just ghost pinged ${message.mentions.members.first()} **(${message.mentions.users.first().tag})**\n\nContent: **${message.content}**`)
                .setColor(options.embedColor || 0x075FFF)

                .setFooter(options.embedFoot || 'Ghost Ping.')
                .setTimestamp()

            message.channel.send(chembed)
        }
    },

    tictactoe: async function (message, options = {}) {
        console.log('test')
        let opponent = message.mentions.members.first()
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

        const xoemb = new Discord.MessageEmbed()
            .setTitle('TicTacToe')
            .setDescription(`**How to Play ?**\n*Wait for your turn.. If its your turn, Click one of the buttons from the table to draw your emoji at there.*`)
            .setColor(options.embedColor || 0x075FFF)
            .setFooter(options.embedFoot || 'Make sure to win ;)')
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
            if (won["<:O_:863314110560993340>"] != false) return m.edit(`<@!${Args.userid}> (${oEmoji}) won.. That was a nice game.`)
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

    calculator: async function (message, options = {}) {

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

        const emb = new Discord.MessageEmbed()
            .setColor(options.embedColor || 0x075FFF)

            .setDescription("```0```")

        message.channel.send({
            embed: emb,
            components: row
        }).then((msg) => {

            let isWrong = false;
            let time = 180000
            let value = ""
            let emb1 = new Discord.MessageEmbed()

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
        var timeForStart = Date.now();
        const timeout = 120000
        const pageMovingButtons1 = new disbut.MessageButton()
            .setID(`forward_button_embed`)
            .setLabel("")
            .setEmoji(style.forwardEmoji || "⏩")
            .setStyle(style.color || 'blurple')
        const pageMovingButtons2 = new disbut.MessageButton()
            .setID(`back_button_embed`)
            .setLabel("")
            .setEmoji(style.backEmoji || "⏪")
            .setStyle(style.color || 'blurple')
        var pageMovingButtons = new disbut.MessageActionRow()
            .addComponent(pageMovingButtons2)
            .addComponent(pageMovingButtons1)
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
                }
                if (b.id == "back_button_embed" || b.id == "forward_button_embed") {
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

        let embed = new Discord.MessageEmbed()
            .setTitle('Create a ticket')
            .setDescription(options.embedDesc || '🎫 Create a ticket by clicking the button 🎫')
            .setThumbnail(message.guild.iconURL())
            .setTimestamp()
            .setColor(options.embedColor || '#075FFF')
            .setFooter(options.embedFoot || message.guild.name, message.guild.iconURL())

        try {
            channel.send({ embed: embed, component: ticketbtn })
        } catch (err) {
            channel.send('ERR OCCURED ' + err)
        }
    },

    clickBtn: async function (button, options = []) {
        if (button.id === 'create_ticket') {

            button.reply.defer();

            button.guild.channels.create(`ticket_${button.clicker.user.tag}`, {
                type: "text",
                permissionOverwrites: [
                    {
                        id: button.message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
                    },
                    {
                        id: button.clicker.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    },
                ],
            }).then((ch) => {



                let emb = new Discord.MessageEmbed()
                    .setTitle('Ticket Created')
                    .setDescription(options.embedDesc || `Ticket has been raised by ${button.clicker.user}. We ask the Admins to summon here\n\nThis channel will be deleted after 10 minutes to reduce the clutter`)
                    .setThumbnail(button.message.guild.iconURL())
                    .setTimestamp()
                    .setColor(options.embedColor || '#075FFF')
                    .setFooter(button.message.guild.name, button.message.guild.iconURL())


                let close_btn = new disbut.MessageButton()
                    .setStyle(options.closeColor || 'blurple')
                    .setEmoji(options.closeEmoji || '🔒')
                    .setLabel('Close')
                    .setID('close_ticket')

                ch.send(button.clicker.user, { embed: emb, component: close_btn })

                setTimeout(() => {
                    ch.send('Timeout.. You have reached 10 minutes. This ticket is getting deleted right now.')

                    setTimeout(() => {
                        ch.delete()
                    }, 5000)

                }, 600000)

            })

        }
        if (button.id === 'close_ticket') {

            button.reply.defer();

            button.channel.overwritePermissions([
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

            let emb = new Discord.MessageEmbed()
                .setTitle('Ticket Created')
                .setDescription(options.embedDesc || `Ticket has been raised by ${button.clicker.user}. We ask the Admins to summon here\n\nThis channel will be deleted after 10 minutes to reduce the clutter`)
                .setThumbnail(button.message.guild.iconURL())
                .setTimestamp()
                .setColor(options.embedColor || '#075FFF')
                .setFooter(button.message.guild.name, button.message.guild.iconURL())

            button.message.edit(button.clicker.user, { embed: emb, component: row })
        }

        if (button.id === 'open_ticket') {


            button.channel.overwritePermissions([
                {
                    id: button.message.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
                },
                {
                    id: button.clicker.user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
            ]);


            let emb = new Discord.MessageEmbed()
                .setTitle('Ticket Created')
                .setDescription(options.embedDesc || `Ticket has been raised by ${button.clicker.user}. We ask the Admins to summon here` + `This channel will be deleted after 10 minutes to reduce the clutter`)
                .setThumbnail(button.message.guild.iconURL())
                .setTimestamp()
                .setColor(options.embedColor || '#075FFF')
                .setFooter(button.message.guild.name, button.message.guild.iconURL())


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

            let emb = new Discord.MessageEmbed()
                .setTitle('Are you sure ?')
                .setDescription(`This will delete the channel and the ticket. You cant undo this action`)
                .setThumbnail(button.message.guild.iconURL())
                .setTimestamp()
                .setColor('#c90000')
                .setFooter(button.message.guild.name, button.message.guild.iconURL())

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

    antiSwear: async function (message, options = []) {
        if (message.author.bot) return;

        var swears = JSON.parse(fs.readFileSync("./antiswear.json"));
        var msg = message.content.toLowerCase();

        if (!options.words) return;

        if (Array.isArray(options.words)) {

            for (const swears of options.words)
                if (msg.includes(swears)) {
                    message.delete()
                    return message.channel.send(options.msg || `${message.author}` + '\n```You are not allowed to say that..```').then(msg => msg.delete({ timeout: 10000 }));
                }
        }

        if (msg.includes(options.words)) {
            message.delete()
            return message.channel.send(options.msg || `${message.author}` + '\n```You are not allowed to say that..```').then(msg => msg.delete({ timeout: 10000 }));
        }

        if (Array.isArray(options.whitelistwords)) {

            for (const whites of options.whitelistwords)
                if (msg.includes(whites)) return;
        }

        for (let i = 0; i < swears["blockedWords"].length; i++) {
            if (!msg.includes(options.whitelistwords)) {
                if (msg.includes(swears["blockedWords"][i])) {
                    message.delete()

                    return message.channel.send(options.msg || `${message.author}` + '\n```You are not allowed to say that..```').then(msg => msg.delete({ timeout: 10000 }));
                }
            }
        }
    },
}
