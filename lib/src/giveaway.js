"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.giveawaySystem = void 0;
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const gSys_1 = __importDefault(require("./model/gSys"));
const convStyle_1 = require("./Others/convStyle");
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * A **Powerful** yet simple giveawaySystem | *Required: **manageBtn()***
 * @param client
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/givewaySystem***
 * @example simplydjs.giveawaySystem(client, message)
 */
function giveawaySystem(client, message, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
            try {
                let interaction;
                if (message.commandId) {
                    interaction = message;
                }
                const timeStart = Date.now();
                const int = message;
                const mes = message;
                let roly;
                if (options.manager)
                    roly = yield message.member.roles.cache.find((r) => r.id === options.manager.id);
                else if (options.manager)
                    roly = yield message.member.roles.cache.find((r) => r.id === options.manager);
                if (!(roly ||
                    message.member.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator))) {
                    return message.channel.send({
                        content: 'You Must Have • Administrator Permission (or) • Giveaway Manager Role'
                    });
                }
                (_a = options.winners) !== null && _a !== void 0 ? _a : (options.winners = 1);
                options.buttons = {
                    enter: {
                        style: ((_c = (_b = options.buttons) === null || _b === void 0 ? void 0 : _b.enter) === null || _c === void 0 ? void 0 : _c.style) || 'SUCCESS',
                        label: ((_e = (_d = options.buttons) === null || _d === void 0 ? void 0 : _d.enter) === null || _e === void 0 ? void 0 : _e.label) || '0',
                        emoji: ((_g = (_f = options.buttons) === null || _f === void 0 ? void 0 : _f.enter) === null || _g === void 0 ? void 0 : _g.emoji) || '🎁'
                    },
                    end: {
                        style: ((_j = (_h = options.buttons) === null || _h === void 0 ? void 0 : _h.end) === null || _j === void 0 ? void 0 : _j.style) || 'DANGER',
                        label: ((_l = (_k = options.buttons) === null || _k === void 0 ? void 0 : _k.end) === null || _l === void 0 ? void 0 : _l.label) || 'End',
                        emoji: ((_o = (_m = options.buttons) === null || _m === void 0 ? void 0 : _m.end) === null || _o === void 0 ? void 0 : _o.emoji) || '⛔'
                    },
                    reroll: {
                        style: ((_q = (_p = options.buttons) === null || _p === void 0 ? void 0 : _p.end) === null || _q === void 0 ? void 0 : _q.style) || 'PRIMARY',
                        label: ((_s = (_r = options.buttons) === null || _r === void 0 ? void 0 : _r.end) === null || _s === void 0 ? void 0 : _s.label) || 'Reroll',
                        emoji: ((_u = (_t = options.buttons) === null || _t === void 0 ? void 0 : _t.end) === null || _u === void 0 ? void 0 : _u.emoji) || '🔁'
                    }
                };
                if (!options.embed) {
                    options.embed = {
                        footer: {
                            text: '©️ Simply Develop. npm i simply-djs',
                            iconURL: 'https://i.imgur.com/u8VlLom.png'
                        },
                        color: '#075FFF',
                        title: 'Giveaways',
                        credit: true
                    };
                }
                let ch;
                let time;
                let winners;
                let prize;
                let req = 'None';
                let gid;
                let content = '** **';
                if (options.ping) {
                    content = message.guild.roles
                        .fetch(options.ping, { force: true })
                        .toString();
                }
                let val;
                if (((_v = options.req) === null || _v === void 0 ? void 0 : _v.type) === 'Role') {
                    val = yield message.guild.roles.fetch((_w = options.req) === null || _w === void 0 ? void 0 : _w.id, {
                        force: true
                    });
                    req = 'Role';
                }
                else if (((_x = options.req) === null || _x === void 0 ? void 0 : _x.type) === 'Guild') {
                    val = client.guilds.cache.get((_y = options.req) === null || _y === void 0 ? void 0 : _y.id);
                    if (!val)
                        return message.channel.send({
                            content: 'Please add me to that server so i can set the requirement.'
                        });
                    gid = val.id;
                    yield val.invites.fetch().then((a) => {
                        val = `[${val.name}](https://discord.gg/${a.first()})`;
                    });
                    req = 'Guild';
                }
                if (interaction) {
                    ch =
                        options.channel || int.options.get('channel') || interaction.channel;
                    time = options.time || int.options.get('time') || '1h';
                    winners = options.winners || int.options.get('winners');
                    prize = options.prize || int.options.get('prize');
                }
                else if (!interaction) {
                    const [...args] = mes.content.split(/ +/g);
                    ch =
                        options.channel ||
                            message.mentions.channels.first() ||
                            message.channel;
                    time = options.time || args[1] || '1h';
                    winners = args[2] || options.winners;
                    prize = options.prize || args.slice(3).join(' ');
                }
                const enter = new discord_js_1.ButtonBuilder()
                    .setCustomId('enter_giveaway')
                    .setStyle((0, convStyle_1.convStyle)(options.buttons.enter.style || 'SUCCESS'));
                if (options.disable === 'Label')
                    enter.setEmoji(options.buttons.enter.emoji || '🎁');
                else if (options.disable === 'Emoji')
                    enter.setLabel(options.buttons.enter.label || '0');
                else {
                    enter
                        .setEmoji(options.buttons.enter.emoji || '🎁')
                        .setLabel(options.buttons.enter.label || '0');
                }
                const end = new discord_js_1.ButtonBuilder()
                    .setCustomId('end_giveaway')
                    .setStyle((0, convStyle_1.convStyle)(options.buttons.end.style || 'DANGER'));
                if (options.disable === 'Label')
                    end.setEmoji(options.buttons.end.emoji || '⛔');
                else if (options.disable === 'Emoji')
                    end.setLabel(options.buttons.end.label || 'End');
                else {
                    end
                        .setEmoji(options.buttons.end.emoji || '⛔')
                        .setLabel(options.buttons.end.label || 'End');
                }
                const reroll = new discord_js_1.ButtonBuilder()
                    .setCustomId('reroll_giveaway')
                    .setStyle((0, convStyle_1.convStyle)(options.buttons.reroll.style || 'SUCCESS'))
                    .setDisabled(true);
                if (options.disable === 'Label')
                    reroll.setEmoji(options.buttons.reroll.emoji || '🔁');
                else if (options.disable === 'Emoji')
                    reroll.setLabel(options.buttons.reroll.label || 'Reroll');
                else {
                    reroll
                        .setEmoji(options.buttons.reroll.emoji || '🔁')
                        .setLabel(options.buttons.reroll.label || 'Reroll');
                }
                const row = new discord_js_1.ActionRowBuilder().addComponents([enter, reroll, end]);
                time = ms(time);
                const endtime = Number((Date.now() + time).toString().slice(0, -3));
                options.fields = options.fields || [
                    {
                        name: 'Prize',
                        value: `{prize}`,
                        inline: false
                    },
                    {
                        name: 'Hosted By',
                        value: `{hosted}`,
                        inline: true
                    },
                    {
                        name: 'Ends at',
                        value: `{endsAt}`,
                        inline: true
                    },
                    { name: 'Winner(s)', value: `{winCount}`, inline: true },
                    {
                        name: 'Requirements',
                        value: `{requirements}`,
                        inline: false
                    }
                ];
                options.fields.forEach((a) => {
                    a.value = a === null || a === void 0 ? void 0 : a.value.replaceAll('{hosted}', `<@${message.member.user.id}>`).replaceAll('{endsAt}', `<t:${endtime}:f>`).replaceAll('{prize}', prize).replaceAll('{requirements}', req === 'None'
                        ? 'None'
                        : req + ' | ' + (req === 'Role' ? `${val}` : val)).replaceAll('{winCount}', winners).replaceAll('{entered}', '0');
                });
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(((_z = options.embed) === null || _z === void 0 ? void 0 : _z.title.replaceAll('{hosted}', `<@${message.member.user.id}>`).replaceAll('{prize}', prize).replaceAll('{endsAt}', `<t:${endtime}:R>`).replaceAll('{requirements}', req === 'None'
                    ? 'None'
                    : req + ' | ' + (req === 'Role' ? `${val}` : val)).replaceAll('{winCount}', winners).replaceAll('{entered}', '0')) || prize)
                    .setColor(((_0 = options.embed) === null || _0 === void 0 ? void 0 : _0.color) || '#075FFF')
                    .setTimestamp(Number(Date.now() + time))
                    .setFooter(((_1 = options.embed) === null || _1 === void 0 ? void 0 : _1.credit)
                    ? (_2 = options.embed) === null || _2 === void 0 ? void 0 : _2.footer
                    : {
                        text: '©️ Simply Develop. npm i simply-djs',
                        iconURL: 'https://i.imgur.com/u8VlLom.png'
                    })
                    .setDescription(((_3 = options.embed) === null || _3 === void 0 ? void 0 : _3.description)
                    ? (_4 = options.embed) === null || _4 === void 0 ? void 0 : _4.description.replaceAll('{hosted}', `<@${message.member.user.id}>`).replaceAll('{prize}', prize).replaceAll('{endsAt}', `<t:${endtime}:R>`).replaceAll('{requirements}', req === 'None'
                        ? 'None'
                        : req + ' | ' + (req === 'Role' ? `${val}` : val)).replaceAll('{winCount}', winners).replaceAll('{entered}', '0')
                    : `Interact with the giveaway using the buttons.`)
                    .addFields(options.fields);
                yield ch
                    .send({ content: content, embeds: [embed], components: [row] })
                    .then((msg) => __awaiter(this, void 0, void 0, function* () {
                    var _5;
                    resolve({
                        message: msg.id,
                        winners: winners,
                        prize: prize,
                        endsAt: endtime,
                        req: req === 'None'
                            ? 'None'
                            : req + ' | ' + (req === 'Role' ? val : gid)
                    });
                    const link = new discord_js_1.ButtonBuilder()
                        .setLabel('View Giveaway.')
                        .setStyle((0, convStyle_1.convStyle)('LINK'))
                        .setURL(msg.url);
                    const rowew = new discord_js_1.ActionRowBuilder().addComponents([
                        link
                    ]);
                    if (int && interaction) {
                        yield int.followUp({
                            content: 'Giveaway has started.',
                            components: [rowew]
                        });
                    }
                    else
                        yield message.channel.send({
                            content: 'Giveaway has started.',
                            components: [rowew]
                        });
                    const tim = Number(Date.now() + time);
                    const crete = new gSys_1.default({
                        message: msg.id,
                        entered: 0,
                        winCount: winners,
                        desc: ((_5 = options.embed) === null || _5 === void 0 ? void 0 : _5.description) || null,
                        requirements: {
                            type: req === 'None' ? 'none' : req.toLowerCase(),
                            id: req === 'Role' ? val : gid
                        },
                        started: timeStart,
                        prize: prize,
                        entry: [],
                        endTime: tim,
                        host: message.member.user.id
                    });
                    yield crete.save();
                    const timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                        if (!msg)
                            return;
                        const dt = yield gSys_1.default.findOne({ message: msg.id });
                        if (dt.endTime && Number(dt.endTime) < Date.now()) {
                            const embeded = new discord_js_1.EmbedBuilder()
                                .setTitle('Processing Data...')
                                .setColor(0xcc0000)
                                .setDescription(`Please wait.. We are Processing the winner with some magiks`)
                                .setFooter({
                                text: 'Ending the Giveaway, Scraping the ticket..'
                            });
                            clearInterval(timer);
                            yield msg
                                .edit({ embeds: [embeded], components: [] })
                                .catch(() => { });
                            const dispWin = [];
                            const winArr = [];
                            const winCt = dt.winCount;
                            const entries = dt.entry;
                            for (let i = 0; i < winCt; i++) {
                                const winno = Math.floor(Math.random() * dt.entered);
                                winArr.push(entries[winno]);
                            }
                            setTimeout(() => {
                                winArr.forEach((name) => __awaiter(this, void 0, void 0, function* () {
                                    yield message.guild.members
                                        .fetch(name === null || name === void 0 ? void 0 : name.userID)
                                        .then((user) => {
                                        var _a, _b;
                                        dispWin.push(`<@${user.user.id}>`);
                                        const embod = new discord_js_1.EmbedBuilder()
                                            .setTitle('You.. Won the Giveaway !')
                                            .setDescription(`You just won \`${dt.prize}\` in the Giveaway at \`${user.guild.name}\` Go claim it fast !`)
                                            .setColor(0x075fff)
                                            .setFooter(((_a = options.embed) === null || _a === void 0 ? void 0 : _a.credit)
                                            ? (_b = options.embed) === null || _b === void 0 ? void 0 : _b.footer
                                            : {
                                                text: '©️ Simply Develop. npm i simply-djs',
                                                iconURL: 'https://i.imgur.com/u8VlLom.png'
                                            });
                                        const gothe = new discord_js_1.ButtonBuilder()
                                            .setLabel('View Giveaway')
                                            .setStyle((0, convStyle_1.convStyle)('LINK'))
                                            .setURL(msg.url);
                                        const entrow = new discord_js_1.ActionRowBuilder().addComponents([
                                            gothe
                                        ]);
                                        return user
                                            .send({ embeds: [embod], components: [entrow] })
                                            .catch(() => { });
                                    })
                                        .catch(() => { });
                                }));
                            }, 2000);
                            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                                var _6, _7, _8, _9, _10, _11;
                                if (!dt)
                                    return yield msg.delete();
                                if (dt) {
                                    const tim = Number(dt.endTime.slice(0, -3));
                                    const f = [];
                                    if (options.fields) {
                                        options.fields.forEach((a) => {
                                            a.value = a.value
                                                .replaceAll('{hosted}', `<@${dt.host}>`)
                                                .replaceAll('{endsAt}', `<t:${tim}:f>`)
                                                .replaceAll('{prize}', dt.prize.toString())
                                                .replaceAll('{requirements}', req === 'None'
                                                ? 'None'
                                                : req + ' | ' + (req === 'Role' ? `${val}` : val))
                                                .replaceAll('{winCount}', dt.winCount.toString())
                                                .replaceAll('{entered}', dt.entered.toString());
                                            f.push(a);
                                        });
                                    }
                                    const allComp = yield msg.components[0];
                                    if (dt.entered <= 0 || !winArr[0]) {
                                        embed
                                            .setTitle('No one entered')
                                            .setFields(f)
                                            .setColor('Red')
                                            .setFooter(((_6 = options.embed) === null || _6 === void 0 ? void 0 : _6.credit)
                                            ? (_7 = options.embed) === null || _7 === void 0 ? void 0 : _7.footer
                                            : {
                                                text: '©️ Simply Develop. npm i simply-djs',
                                                iconURL: 'https://i.imgur.com/u8VlLom.png'
                                            });
                                        discord_js_1.ButtonBuilder.from(allComp.components[0]).setDisabled(true);
                                        discord_js_1.ButtonBuilder.from(allComp.components[1]).setDisabled(true);
                                        discord_js_1.ButtonBuilder.from(allComp.components[2]).setDisabled(true);
                                        return yield msg.edit({
                                            embeds: [embed],
                                            components: [allComp]
                                        });
                                    }
                                    embed
                                        .setTitle('We got the winner !')
                                        .setDescription(`${dispWin.join(', ')} got the prize !\n\n` +
                                        (((_8 = options.embed) === null || _8 === void 0 ? void 0 : _8.description)
                                            ? (_9 = options.embed) === null || _9 === void 0 ? void 0 : _9.description.replaceAll('{hosted}', `<@${dt.host}>`).replaceAll('{prize}', dt.prize).replaceAll('{endsAt}', `<t:${dt.endTime}:R>`).replaceAll('{requirements}', req === 'None'
                                                ? 'None'
                                                : req +
                                                    ' | ' +
                                                    (req === 'Role' ? `${val}` : val)).replaceAll('{winCount}', dt.winCount.toString()).replaceAll('{entered}', dt.entered.toString())
                                            : `Reroll the giveaway using the button.`))
                                        .setFields(options.fields)
                                        .setColor(0x3bb143)
                                        .setFooter(((_10 = options.embed) === null || _10 === void 0 ? void 0 : _10.credit)
                                        ? (_11 = options.embed) === null || _11 === void 0 ? void 0 : _11.footer
                                        : {
                                            text: '©️ Simply Develop. npm i simply-djs',
                                            iconURL: 'https://i.imgur.com/u8VlLom.png'
                                        });
                                    discord_js_1.ButtonBuilder.from(allComp.components[0]).setDisabled(true);
                                    discord_js_1.ButtonBuilder.from(allComp.components[1]).setDisabled(false);
                                    discord_js_1.ButtonBuilder.from(allComp.components[2]).setDisabled(true);
                                    yield msg.edit({
                                        embeds: [embed],
                                        components: [allComp]
                                    });
                                }
                            }), 5200);
                        }
                    }), 5000);
                }));
            }
            catch (err) {
                console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('giveaway')} | Error: ${err.stack}`);
            }
        }));
    });
}
exports.giveawaySystem = giveawaySystem;
function ms(str) {
    let sum = 0, time, type, val;
    const arr = ('' + str)
        .split(' ')
        .filter((v) => v != '' && /^(\d{1,}\.)?\d{1,}([wdhms])?$/i.test(v));
    const length = arr.length;
    for (let i = 0; i < length; i++) {
        time = arr[i];
        type = time.match(/[wdhms]$/i);
        if (type) {
            val = Number(time.replace(type[0], ''));
            switch (type[0].toLowerCase()) {
                case 'w':
                    sum += val * 604800000;
                    break;
                case 'd':
                    sum += val * 86400000;
                    break;
                case 'h':
                    sum += val * 3600000;
                    break;
                case 'm':
                    sum += val * 60000;
                    break;
                case 's':
                    sum += val * 1000;
                    break;
            }
        }
        else if (!isNaN(parseFloat(time)) && isFinite(parseFloat(time))) {
            sum += parseFloat(time);
        }
    }
    return sum;
}
