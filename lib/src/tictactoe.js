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
exports.tictactoe = void 0;
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * One line implementation of a super enjoyable **tictactoe game**.
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Fun/tictactoe***
 * @example simplydjs.tictactoe(interaction)
 */
function tictactoe(message, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const client = message.client;
                let interaction;
                if (message.commandId) {
                    interaction = message;
                }
                let opponent;
                const int = message;
                const ms = message;
                if (interaction) {
                    opponent = options.user || int.options.getUser("user");
                    if (!opponent)
                        return int.followUp({
                            content: "You didnt mention an opponent.",
                            ephemeral: true,
                        });
                    if (opponent.bot)
                        return int.followUp({
                            content: "You cannot play with bots",
                            ephemeral: true,
                        });
                    if (opponent.id == message.user.id)
                        return int.followUp({
                            content: "You cannot play with yourself!",
                            ephemeral: true,
                        });
                }
                else if (!interaction) {
                    opponent = (_a = message.mentions.members.first()) === null || _a === void 0 ? void 0 : _a.user;
                    if (!opponent)
                        return ms.reply({
                            content: "You didnt mention an opponent",
                        });
                    if (opponent.bot)
                        return ms.reply({
                            content: "You can't play with bots !",
                        });
                    if (opponent.id === message.member.user.id)
                        return ms.reply({
                            content: "You cannot play with yourself!",
                        });
                }
                const acceptEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle(`Tictactoe with ${opponent.tag}`)
                    .setDescription("Waiting for the opponent to accept/deny")
                    .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL(),
                })
                    .setColor(((_b = options.embed) === null || _b === void 0 ? void 0 : _b.color) || `#075fff`)
                    .setFooter(((_c = options.embed) === null || _c === void 0 ? void 0 : _c.credit)
                    ? (_d = options.embed) === null || _d === void 0 ? void 0 : _d.footer
                    : {
                        text: "©️ Simply Develop. npm i simply-djs",
                        iconURL: "https://i.imgur.com/u8VlLom.png",
                    });
                const accept = new discord_js_1.ButtonBuilder()
                    .setLabel("Accept")
                    .setStyle(discord_js_1.ButtonStyle.Success)
                    .setCustomId("accept-ttt");
                const decline = new discord_js_1.ButtonBuilder()
                    .setLabel("Deny")
                    .setStyle(discord_js_1.ButtonStyle.Danger)
                    .setCustomId("deny-ttt");
                const accep = new discord_js_1.ActionRowBuilder().addComponents([accept, decline]);
                let m;
                if (interaction) {
                    m = yield int.followUp({
                        content: `<@${opponent.id}>, You got a tictactoe request from ${message.member.user.tag}`,
                        embeds: [acceptEmbed],
                        components: [accep],
                    });
                }
                else if (!interaction) {
                    m = yield ms.reply({
                        content: `<@${opponent.id}>, You got a tictactoe request from ${message.member.user.tag}`,
                        embeds: [acceptEmbed],
                        components: [accep],
                    });
                }
                const collector = m.createMessageComponentCollector({
                    componentType: discord_js_1.ComponentType.Button,
                    time: 30000,
                });
                collector.on("collect", (button) => __awaiter(this, void 0, void 0, function* () {
                    var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                    if (button.user.id !== opponent.id)
                        return button.reply({
                            content: "You cannot play the game.",
                            ephemeral: true,
                        });
                    if (button.customId == "deny-ttt") {
                        yield button.deferUpdate();
                        return collector.stop("decline");
                    }
                    else if (button.customId == "accept-ttt") {
                        collector.stop();
                        if (interaction) {
                            button.message.delete();
                        }
                        const players = [message.member.user.id, opponent.id].sort(() => Math.random() > 0.5 ? 1 : -1);
                        const x_emoji = ((_f = (_e = options.buttons) === null || _e === void 0 ? void 0 : _e.X) === null || _f === void 0 ? void 0 : _f.emoji) || "❌";
                        const o_emoji = ((_h = (_g = options.buttons) === null || _g === void 0 ? void 0 : _g.O) === null || _h === void 0 ? void 0 : _h.emoji) || "⭕";
                        const dashmoji = ((_k = (_j = options.buttons) === null || _j === void 0 ? void 0 : _j.idle) === null || _k === void 0 ? void 0 : _k.emoji) || "➖";
                        const idleClr = ((_m = (_l = options.buttons) === null || _l === void 0 ? void 0 : _l.idle) === null || _m === void 0 ? void 0 : _m.style) || discord_js_1.ButtonStyle.Secondary;
                        const XClr = ((_p = (_o = options.buttons) === null || _o === void 0 ? void 0 : _o.X) === null || _p === void 0 ? void 0 : _p.style) || discord_js_1.ButtonStyle.Danger;
                        const OClr = ((_r = (_q = options.buttons) === null || _q === void 0 ? void 0 : _q.O) === null || _r === void 0 ? void 0 : _r.style) || discord_js_1.ButtonStyle.Primary;
                        const Plrs = {
                            user: 0,
                            userid: "1234567890123",
                            a1: {
                                style: idleClr,
                                emoji: dashmoji,
                                disabled: false,
                            },
                            a2: {
                                style: idleClr,
                                emoji: dashmoji,
                                disabled: false,
                            },
                            a3: {
                                style: idleClr,
                                emoji: dashmoji,
                                disabled: false,
                            },
                            b1: {
                                style: idleClr,
                                emoji: dashmoji,
                                disabled: false,
                            },
                            b2: {
                                style: idleClr,
                                emoji: dashmoji,
                                disabled: false,
                            },
                            b3: {
                                style: idleClr,
                                emoji: dashmoji,
                                disabled: false,
                            },
                            c1: {
                                style: idleClr,
                                emoji: dashmoji,
                                disabled: false,
                            },
                            c2: {
                                style: idleClr,
                                emoji: dashmoji,
                                disabled: false,
                            },
                            c3: {
                                style: idleClr,
                                emoji: dashmoji,
                                disabled: false,
                            },
                        };
                        const epm = new discord_js_1.EmbedBuilder()
                            .setTitle("Lets play TicTacToe.")
                            .setColor(((_s = options.embed) === null || _s === void 0 ? void 0 : _s.color) || "#075fff")
                            .setFooter(((_t = options.embed) === null || _t === void 0 ? void 0 : _t.credit)
                            ? (_u = options.embed) === null || _u === void 0 ? void 0 : _u.footer
                            : {
                                text: "©️ Simply Develop. npm i simply-djs",
                                iconURL: "https://i.imgur.com/u8VlLom.png",
                            })
                            .setTimestamp();
                        let msg;
                        if (interaction) {
                            msg = yield int.followUp({
                                embeds: [
                                    epm.setDescription(`Waiting for Input | <@!${players}>, Your Emoji: ${client.emojis.cache.get(o_emoji) || "⭕"}`),
                                ],
                            });
                        }
                        else if (!interaction) {
                            msg = yield button.message.edit({
                                embeds: [
                                    epm.setDescription(`Waiting for Input | <@!${players}>, Your Emoji: ${client.emojis.cache.get(o_emoji) || "⭕"}`),
                                ],
                            });
                        }
                        yield ttt(msg);
                        function ttt(m) {
                            return __awaiter(this, void 0, void 0, function* () {
                                Plrs.userid = players[Plrs.user];
                                const won = {
                                    "O-Player": false,
                                    "X-Player": false,
                                };
                                const a1 = new discord_js_1.ButtonBuilder()
                                    .setStyle(Plrs.a1.style)
                                    .setEmoji(Plrs.a1.emoji)
                                    .setCustomId("a1")
                                    .setDisabled(Plrs.a1.disabled);
                                const a2 = new discord_js_1.ButtonBuilder()
                                    .setStyle(Plrs.a2.style)
                                    .setEmoji(Plrs.a2.emoji)
                                    .setCustomId("a2")
                                    .setDisabled(Plrs.a2.disabled);
                                const a3 = new discord_js_1.ButtonBuilder()
                                    .setStyle(Plrs.a3.style)
                                    .setEmoji(Plrs.a3.emoji)
                                    .setCustomId("a3")
                                    .setDisabled(Plrs.a3.disabled);
                                const b1 = new discord_js_1.ButtonBuilder()
                                    .setStyle(Plrs.b1.style)
                                    .setEmoji(Plrs.b1.emoji)
                                    .setCustomId("b1")
                                    .setDisabled(Plrs.b1.disabled);
                                const b2 = new discord_js_1.ButtonBuilder()
                                    .setStyle(Plrs.b2.style)
                                    .setEmoji(Plrs.b2.emoji)
                                    .setCustomId("b2")
                                    .setDisabled(Plrs.b2.disabled);
                                const b3 = new discord_js_1.ButtonBuilder()
                                    .setStyle(Plrs.b3.style)
                                    .setEmoji(Plrs.b3.emoji)
                                    .setCustomId("b3")
                                    .setDisabled(Plrs.b3.disabled);
                                const c1 = new discord_js_1.ButtonBuilder()
                                    .setStyle(Plrs.c1.style)
                                    .setEmoji(Plrs.c1.emoji)
                                    .setCustomId("c1")
                                    .setDisabled(Plrs.c1.disabled);
                                const c2 = new discord_js_1.ButtonBuilder()
                                    .setStyle(Plrs.c2.style)
                                    .setEmoji(Plrs.c2.emoji)
                                    .setCustomId("c2")
                                    .setDisabled(Plrs.c2.disabled);
                                const c3 = new discord_js_1.ButtonBuilder()
                                    .setStyle(Plrs.c3.style)
                                    .setEmoji(Plrs.c3.emoji)
                                    .setCustomId("c3")
                                    .setDisabled(Plrs.c3.disabled);
                                const a = new discord_js_1.ActionRowBuilder().addComponents([a1, a2, a3]);
                                const b = new discord_js_1.ActionRowBuilder().addComponents([b1, b2, b3]);
                                const c = new discord_js_1.ActionRowBuilder().addComponents([c1, c2, c3]);
                                const buttons = [a, b, c];
                                if (Plrs.a1.emoji == o_emoji &&
                                    Plrs.b1.emoji == o_emoji &&
                                    Plrs.c1.emoji == o_emoji)
                                    won["O-Player"] = true;
                                if (Plrs.a2.emoji == o_emoji &&
                                    Plrs.b2.emoji == o_emoji &&
                                    Plrs.c2.emoji == o_emoji)
                                    won["O-Player"] = true;
                                if (Plrs.a3.emoji == o_emoji &&
                                    Plrs.b3.emoji == o_emoji &&
                                    Plrs.c3.emoji == o_emoji)
                                    won["O-Player"] = true;
                                if (Plrs.a1.emoji == o_emoji &&
                                    Plrs.b2.emoji == o_emoji &&
                                    Plrs.c3.emoji == o_emoji)
                                    won["O-Player"] = true;
                                if (Plrs.a3.emoji == o_emoji &&
                                    Plrs.b2.emoji == o_emoji &&
                                    Plrs.c1.emoji == o_emoji)
                                    won["O-Player"] = true;
                                if (Plrs.a1.emoji == o_emoji &&
                                    Plrs.a2.emoji == o_emoji &&
                                    Plrs.a3.emoji == o_emoji)
                                    won["O-Player"] = true;
                                if (Plrs.b1.emoji == o_emoji &&
                                    Plrs.b2.emoji == o_emoji &&
                                    Plrs.b3.emoji == o_emoji)
                                    won["O-Player"] = true;
                                if (Plrs.c1.emoji == o_emoji &&
                                    Plrs.c2.emoji == o_emoji &&
                                    Plrs.c3.emoji == o_emoji)
                                    won["O-Player"] = true;
                                if (won["O-Player"] != false) {
                                    const wonner = yield client.users
                                        .fetch(players[1])
                                        .catch(console.error);
                                    resolve(wonner);
                                    if (options.result === "Button")
                                        return m
                                            .edit({
                                            content: `<@${players[Plrs.user === 0 ? 1 : 0]}> (${client.emojis.cache.get(o_emoji) || "⭕"}) won`,
                                            components: buttons,
                                            embeds: [
                                                epm.setDescription(`<@!${players[Plrs.user === 0 ? 1 : 0]}> (${client.emojis.cache.get(o_emoji) || "⭕"}) won, That was a nice game.`),
                                            ],
                                        })
                                            .then((m) => {
                                            m.react("⭕");
                                        });
                                    else if (!options.result || options.result === "Embed")
                                        return m
                                            .edit({
                                            content: `<@${players[Plrs.user === 0 ? 1 : 0]}> (${client.emojis.cache.get(o_emoji) || "⭕"}) won`,
                                            embeds: [
                                                epm.setDescription(`<@!${players[Plrs.user === 0 ? 1 : 0]}> (${client.emojis.cache.get(o_emoji) || "⭕"}) won.. That was a nice game.\n` +
                                                    `\`\`\`\n${Plrs.a1.emoji} | ${Plrs.a2.emoji} | ${Plrs.a3.emoji}\n${Plrs.b1.emoji} | ${Plrs.b2.emoji} | ${Plrs.b3.emoji}\n${Plrs.c1.emoji} | ${Plrs.c2.emoji} | ${Plrs.c3.emoji}\n\`\`\``
                                                        .replaceAll(dashmoji, "➖")
                                                        .replaceAll(o_emoji, "⭕")
                                                        .replaceAll(x_emoji, "❌")),
                                            ],
                                            components: [],
                                        })
                                            .then((m) => {
                                            m.react("⭕");
                                        });
                                }
                                if (Plrs.a1.emoji == x_emoji &&
                                    Plrs.b1.emoji == x_emoji &&
                                    Plrs.c1.emoji == x_emoji)
                                    won["X-Player"] = true;
                                if (Plrs.a2.emoji == x_emoji &&
                                    Plrs.b2.emoji == x_emoji &&
                                    Plrs.c2.emoji == x_emoji)
                                    won["X-Player"] = true;
                                if (Plrs.a3.emoji == x_emoji &&
                                    Plrs.b3.emoji == x_emoji &&
                                    Plrs.c3.emoji == x_emoji)
                                    won["X-Player"] = true;
                                if (Plrs.a1.emoji == x_emoji &&
                                    Plrs.b2.emoji == x_emoji &&
                                    Plrs.c3.emoji == x_emoji)
                                    won["X-Player"] = true;
                                if (Plrs.a3.emoji == x_emoji &&
                                    Plrs.b2.emoji == x_emoji &&
                                    Plrs.c1.emoji == x_emoji)
                                    won["X-Player"] = true;
                                if (Plrs.a1.emoji == x_emoji &&
                                    Plrs.a2.emoji == x_emoji &&
                                    Plrs.a3.emoji == x_emoji)
                                    won["X-Player"] = true;
                                if (Plrs.b1.emoji == x_emoji &&
                                    Plrs.b2.emoji == x_emoji &&
                                    Plrs.b3.emoji == x_emoji)
                                    won["X-Player"] = true;
                                if (Plrs.c1.emoji == x_emoji &&
                                    Plrs.c2.emoji == x_emoji &&
                                    Plrs.c3.emoji == x_emoji)
                                    won["X-Player"] = true;
                                if (won["X-Player"] != false) {
                                    const wonner = yield client.users
                                        .fetch(players[1])
                                        .catch(console.error);
                                    resolve(wonner);
                                    if (options.result === "Button")
                                        return m
                                            .edit({
                                            content: `<@${players[Plrs.user === 0 ? 1 : 0]}> (${client.emojis.cache.get(x_emoji) || "❌"}) won`,
                                            components: buttons,
                                            embeds: [
                                                epm.setDescription(`<@!${players[Plrs.user === 0 ? 1 : 0]}> (${client.emojis.cache.get(x_emoji) || "❌"}) won, That was a nice game.`),
                                            ],
                                        })
                                            .then((m) => {
                                            m.react("❌");
                                        });
                                    else if (!options.result || options.result === "Embed")
                                        return m
                                            .edit({
                                            content: `<@${players[Plrs.user === 0 ? 1 : 0]}> (${client.emojis.cache.get(o_emoji) || "❌"}) won`,
                                            embeds: [
                                                epm.setDescription(`<@!${players[Plrs.user === 0 ? 1 : 0]}> (${client.emojis.cache.get(x_emoji) || "❌"}) won.. That was a nice game.\n` +
                                                    `\`\`\`\n${Plrs.a1.emoji} | ${Plrs.a2.emoji} | ${Plrs.a3.emoji}\n${Plrs.b1.emoji} | ${Plrs.b2.emoji} | ${Plrs.b3.emoji}\n${Plrs.c1.emoji} | ${Plrs.c2.emoji} | ${Plrs.c3.emoji}\n\`\`\``
                                                        .replaceAll(dashmoji, "➖")
                                                        .replaceAll(o_emoji, "⭕")
                                                        .replaceAll(x_emoji, "❌")),
                                            ],
                                            components: [],
                                        })
                                            .then((m) => {
                                            m.react("❌");
                                        });
                                }
                                m.edit({
                                    content: `<@${Plrs.userid}>`,
                                    embeds: [
                                        epm.setDescription(`Waiting for Input | <@!${Plrs.userid}> | Your Emoji: ${Plrs.user == 0
                                            ? `${client.emojis.cache.get(o_emoji) || "⭕"}`
                                            : `${client.emojis.cache.get(x_emoji) || "❌"}`}`),
                                    ],
                                    components: [a, b, c],
                                });
                                const collector = m.createMessageComponentCollector({
                                    componentType: discord_js_1.ComponentType.Button,
                                    max: 1,
                                    time: 30000,
                                });
                                collector.on("collect", (b) => __awaiter(this, void 0, void 0, function* () {
                                    if (b.user.id !== Plrs.userid) {
                                        b.reply({
                                            content: "You cannot play now",
                                            ephemeral: true,
                                        });
                                        yield ttt(m);
                                    }
                                    else {
                                        yield b.deferUpdate();
                                        if (Plrs.user == 0) {
                                            Plrs.user = 1;
                                            // @ts-ignore
                                            Plrs[b.customId] = {
                                                style: OClr,
                                                emoji: o_emoji,
                                                disabled: true,
                                            };
                                        }
                                        else {
                                            Plrs.user = 0;
                                            // @ts-ignore
                                            Plrs[b.customId] = {
                                                style: XClr,
                                                emoji: x_emoji,
                                                disabled: true,
                                            };
                                        }
                                        const map = (obj, func) => Object.entries(obj).reduce((prev, [key, value]) => (Object.assign(Object.assign({}, prev), { [key]: func(key, value) })), {});
                                        const objectFilter = (obj, predicate) => Object.keys(obj)
                                            .filter((key) => predicate(obj[key])) // @ts-ignore
                                            .reduce((res, key) => ((res[key] = obj[key]), res), {});
                                        const Filer = objectFilter(map(Plrs, (_, elem) => elem.emoji == dashmoji), (num) => num == true);
                                        if (Object.keys(Filer).length == 0) {
                                            if (!won["X-Player"] && !won["O-Player"]) {
                                                yield ttt(m);
                                                if (options.result === "Button")
                                                    return m
                                                        .edit({
                                                        content: "Its a Tie!",
                                                        embeds: [
                                                            epm.setDescription(`You have tied. Play again to see who wins.`),
                                                        ],
                                                    })
                                                        .then((m) => {
                                                        m.react(dashmoji);
                                                    });
                                                else
                                                    return m
                                                        .edit({
                                                        content: "Its a Tie !",
                                                        embeds: [
                                                            epm.setDescription(`You have tied. Play again to see who wins.\n` +
                                                                `\`\`\`\n${Plrs.a1.emoji} | ${Plrs.a2.emoji} | ${Plrs.a3.emoji}\n${Plrs.b1.emoji} | ${Plrs.b2.emoji} | ${Plrs.b3.emoji}\n${Plrs.c1.emoji} | ${Plrs.c2.emoji} | ${Plrs.c3.emoji}\n\`\`\``
                                                                    .replaceAll(dashmoji, "➖")
                                                                    .replaceAll(o_emoji, "⭕")
                                                                    .replaceAll(x_emoji, "❌")),
                                                        ],
                                                        components: [],
                                                    })
                                                        .then((m) => {
                                                        m.react(dashmoji);
                                                    })
                                                        .catch(() => { });
                                            }
                                        }
                                        yield ttt(m);
                                    }
                                }));
                                collector.on("end", (collected, reason) => {
                                    if (collected.size === 0 && reason == "time")
                                        m.edit({
                                            content: `<@!${Plrs.userid}> didn\'t react in time! (30s)`,
                                            components: [],
                                        });
                                });
                            });
                        }
                    }
                }));
                collector.on("end", (collected, reason) => {
                    var _a, _b, _c, _d;
                    let embed;
                    if (reason == "time") {
                        embed = new discord_js_1.EmbedBuilder()
                            .setTitle(`Challenge not accepted in time`)
                            .setAuthor({
                            name: message.member.user.tag,
                            iconURL: message.member.user.displayAvatarURL(),
                        })
                            .setColor(`#c90000`)
                            .setFooter(((_a = options.embed) === null || _a === void 0 ? void 0 : _a.credit)
                            ? (_b = options.embed) === null || _b === void 0 ? void 0 : _b.footer
                            : {
                                text: "©️ Simply Develop. npm i simply-djs",
                                iconURL: "https://i.imgur.com/u8VlLom.png",
                            })
                            .setDescription("Ran out of time!\nTime limit: `30s`");
                        m.edit({
                            content: `<@${opponent.id}> did not accept in time !`,
                            embeds: [embed],
                            components: [],
                        });
                    }
                    else if (reason == "decline") {
                        embed = new discord_js_1.EmbedBuilder()
                            .setTitle(`Game Denied !`)
                            .setAuthor({
                            name: message.member.user.tag,
                            iconURL: message.member.user.displayAvatarURL(),
                        })
                            .setColor(`#c90000`)
                            .setFooter(((_c = options.embed) === null || _c === void 0 ? void 0 : _c.credit)
                            ? (_d = options.embed) === null || _d === void 0 ? void 0 : _d.footer
                            : {
                                text: "©️ Simply Develop. npm i simply-djs",
                                iconURL: "https://i.imgur.com/u8VlLom.png",
                            })
                            .setDescription("The Opponent decided not to play.");
                        m.edit({
                            embeds: [embed],
                            components: [],
                        });
                    }
                });
            }
            catch (err) {
                console.log(`${chalk_1.default.red("Error Occured.")} | ${chalk_1.default.magenta("tictactoe")} | Error: ${err.stack}`);
            }
        }));
    });
}
exports.tictactoe = tictactoe;
