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
exports.rps = void 0;
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * A classic RPS game, except this time it's on Discord to play with your pals, how cool is that ?
 *
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Fun/rps***
 * @example simplydjs.rps(message)
 */
function rps(message, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16;
            const accept = new discord_js_1.ButtonBuilder()
                .setLabel("Accept")
                .setStyle(discord_js_1.ButtonStyle.Success)
                .setCustomId("accept");
            const decline = new discord_js_1.ButtonBuilder()
                .setLabel("Deny")
                .setStyle(discord_js_1.ButtonStyle.Danger)
                .setCustomId("decline");
            const acceptComponents = new discord_js_1.ActionRowBuilder().addComponents([
                accept,
                decline,
            ]);
            options.buttons = {
                rock: {
                    style: ((_b = (_a = options.buttons) === null || _a === void 0 ? void 0 : _a.rock) === null || _b === void 0 ? void 0 : _b.style) || discord_js_1.ButtonStyle.Primary,
                    label: ((_d = (_c = options.buttons) === null || _c === void 0 ? void 0 : _c.rock) === null || _d === void 0 ? void 0 : _d.label) || "Rock",
                    emoji: ((_f = (_e = options.buttons) === null || _e === void 0 ? void 0 : _e.rock) === null || _f === void 0 ? void 0 : _f.emoji) || "🪨",
                },
                paper: {
                    style: ((_h = (_g = options.buttons) === null || _g === void 0 ? void 0 : _g.paper) === null || _h === void 0 ? void 0 : _h.style) || discord_js_1.ButtonStyle.Success,
                    label: ((_k = (_j = options.buttons) === null || _j === void 0 ? void 0 : _j.paper) === null || _k === void 0 ? void 0 : _k.label) || "Paper",
                    emoji: ((_m = (_l = options.buttons) === null || _l === void 0 ? void 0 : _l.paper) === null || _m === void 0 ? void 0 : _m.emoji) || "📄",
                },
                scissor: {
                    style: ((_p = (_o = options.buttons) === null || _o === void 0 ? void 0 : _o.paper) === null || _p === void 0 ? void 0 : _p.style) || discord_js_1.ButtonStyle.Danger,
                    label: ((_r = (_q = options.buttons) === null || _q === void 0 ? void 0 : _q.paper) === null || _r === void 0 ? void 0 : _r.label) || "Scissor",
                    emoji: ((_t = (_s = options.buttons) === null || _s === void 0 ? void 0 : _s.paper) === null || _t === void 0 ? void 0 : _t.emoji) || "✂️",
                },
            };
            if (!options.embed) {
                options.embed = {
                    footer: {
                        text: "©️ Simply Develop. npm i simply-djs",
                        iconURL: "https://i.imgur.com/u8VlLom.png",
                    },
                    color: "#075FFF",
                    title: "Rock Paper Scissor !",
                    credit: true,
                };
            }
            const rock = new discord_js_1.ButtonBuilder()
                .setLabel((_v = (_u = options.buttons) === null || _u === void 0 ? void 0 : _u.rock) === null || _v === void 0 ? void 0 : _v.label)
                .setCustomId("rock")
                .setStyle((_x = (_w = options.buttons) === null || _w === void 0 ? void 0 : _w.rock) === null || _x === void 0 ? void 0 : _x.style)
                .setEmoji((_z = (_y = options.buttons) === null || _y === void 0 ? void 0 : _y.rock) === null || _z === void 0 ? void 0 : _z.emoji);
            const paper = new discord_js_1.ButtonBuilder()
                .setLabel((_1 = (_0 = options.buttons) === null || _0 === void 0 ? void 0 : _0.paper) === null || _1 === void 0 ? void 0 : _1.label)
                .setCustomId("paper")
                .setStyle((_3 = (_2 = options.buttons) === null || _2 === void 0 ? void 0 : _2.paper) === null || _3 === void 0 ? void 0 : _3.style)
                .setEmoji((_5 = (_4 = options.buttons) === null || _4 === void 0 ? void 0 : _4.paper) === null || _5 === void 0 ? void 0 : _5.emoji);
            const scissors = new discord_js_1.ButtonBuilder()
                .setLabel((_7 = (_6 = options.buttons) === null || _6 === void 0 ? void 0 : _6.scissor) === null || _7 === void 0 ? void 0 : _7.label)
                .setCustomId("scissors")
                .setStyle((_9 = (_8 = options.buttons) === null || _8 === void 0 ? void 0 : _8.scissor) === null || _9 === void 0 ? void 0 : _9.style)
                .setEmoji((_11 = (_10 = options.buttons) === null || _10 === void 0 ? void 0 : _10.scissor) === null || _11 === void 0 ? void 0 : _11.emoji);
            const rpsComponents = new discord_js_1.ActionRowBuilder().addComponents([
                rock,
                paper,
                scissors,
            ]);
            //Embeds
            const timeoutEmbed = new discord_js_1.EmbedBuilder()
                .setTitle("Game Timed Out!")
                .setColor((0, discord_js_1.colorResolvable)(`RED`))
                .setDescription("The opponent didnt respond in time (30s)")
                .setFooter(((_12 = options.embed) === null || _12 === void 0 ? void 0 : _12.credit)
                ? (_13 = options.embed) === null || _13 === void 0 ? void 0 : _13.footer
                : {
                    text: "©️ Simply Develop. npm i simply-djs",
                    iconURL: "https://i.imgur.com/u8VlLom.png",
                });
            try {
                let opponent;
                let interaction;
                if (message.commandId) {
                    interaction = message;
                    opponent = options.opponent || interaction.options.getUser("user");
                }
                else {
                    opponent = (_14 = message.mentions.members.first()) === null || _14 === void 0 ? void 0 : _14.user;
                }
                const int = message;
                const mes = message;
                if (!interaction) {
                    if (!opponent)
                        return mes.reply("No opponent mentioned!");
                    if (opponent.bot)
                        return mes.reply("You cannot play against bots");
                    if (opponent.id === message.member.user.id)
                        return mes.reply("You cannot play by yourself!");
                }
                else if (interaction) {
                    if (!opponent)
                        return yield int.followUp({
                            content: "No opponent mentioned!",
                            ephemeral: true,
                        });
                    if (opponent.bot)
                        return yield int.followUp({
                            content: "You can't play against bots",
                            ephemeral: true,
                        });
                    if (opponent.id === message.member.user.id)
                        return yield int.followUp({
                            content: "You cannot play by yourself!",
                            ephemeral: true,
                        });
                }
                const acceptEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle(`Request for ${opponent.tag} !`)
                    .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({
                        dynamic: true,
                    }),
                })
                    .setColor(options.embed.color || `#075FFF`)
                    .setFooter(((_15 = options.embed) === null || _15 === void 0 ? void 0 : _15.credit)
                    ? (_16 = options.embed) === null || _16 === void 0 ? void 0 : _16.footer
                    : {
                        text: "©️ Simply Develop. npm i simply-djs",
                        iconURL: "https://i.imgur.com/u8VlLom.png",
                    });
                let m;
                if (interaction) {
                    m = yield int.followUp({
                        content: `Hey <@${opponent.id}>. You got a RPS invitation !`,
                        embeds: [acceptEmbed],
                        components: [acceptComponents],
                    });
                }
                else if (!interaction) {
                    m = yield mes.reply({
                        content: `Hey <@${opponent.id}>. You got a RPS invitation !`,
                        embeds: [acceptEmbed],
                        components: [acceptComponents],
                    });
                }
                const filter = (m) => m.user.id === opponent.id;
                const acceptCollector = m.createMessageComponentCollector({
                    filter,
                    componentType: discord_js_1.ComponentType.Button,
                    time: 30000,
                    maxUsers: 1,
                });
                acceptCollector.on("collect", (button) => __awaiter(this, void 0, void 0, function* () {
                    if (button.user.id !== opponent.id)
                        return yield button.reply({
                            content: "You cannot play the game.",
                            ephemeral: true,
                        });
                    yield button.deferUpdate();
                    if (button.customId == "decline") {
                        return acceptCollector.stop("decline");
                    }
                    acceptEmbed
                        .setTitle(`${message.member.user.tag} VS. ${opponent.tag}`)
                        .setDescription("Select 🪨, 📄, or ✂️");
                    if (interaction) {
                        yield int.editReply({
                            content: "**Its time.. for RPS.**",
                            embeds: [acceptEmbed],
                            components: [rpsComponents],
                        });
                    }
                    else if (!interaction) {
                        yield m.edit({
                            content: "**Its time.. for RPS.**",
                            embeds: [acceptEmbed],
                            components: [rpsComponents],
                        });
                    }
                    acceptCollector.stop();
                    const ids = new Set();
                    ids.add(message.member.user.id);
                    ids.add(opponent.id);
                    let op, auth;
                    const btnCollector = m.createMessageComponentCollector({
                        componentType: discord_js_1.ComponentType.Button,
                        time: 30000,
                    });
                    btnCollector.on("collect", (b) => __awaiter(this, void 0, void 0, function* () {
                        yield b.deferUpdate();
                        if (!ids.has(b.user.id)) {
                            yield button.followUp({
                                content: "You cannot play the game.",
                                ephemeral: true,
                            });
                            return;
                        }
                        ids.delete(b.user.id);
                        if (b.user.id === opponent.id)
                            op = b.customId;
                        if (b.user.id === message.member.user.id)
                            auth = b.customId;
                        setTimeout(() => {
                            if (ids.size == 0)
                                btnCollector.stop();
                        }, 500);
                    }));
                    btnCollector.on("end", (coll, reason) => __awaiter(this, void 0, void 0, function* () {
                        var _17, _18, _19, _20, _21, _22;
                        if (reason === "time") {
                            if (interaction) {
                                yield interaction.editReply({
                                    content: "** **",
                                    embeds: [timeoutEmbed],
                                    components: [],
                                });
                            }
                            else if (!interaction) {
                                yield m.edit({
                                    content: "** **",
                                    embeds: [timeoutEmbed],
                                    components: [],
                                });
                            }
                        }
                        else {
                            const winnerMap = {
                                rock: "scissors",
                                scissors: "paper",
                                paper: "rock",
                            };
                            if (op === auth) {
                                op = op
                                    .replace("scissors", `${options.buttons.scissor.emoji} ${options.buttons.scissor.label}`)
                                    .replace("paper", `${options.buttons.paper.emoji} ${options.buttons.paper.label}`)
                                    .replace("rock", `${options.buttons.rock.emoji} ${options.buttons.rock.label}`);
                                const mm = {
                                    content: "** **",
                                    embeds: [
                                        new discord_js_1.EmbedBuilder()
                                            .setTitle("Draw!")
                                            .setColor(options.drawColor)
                                            .setDescription(`Both players chose **${op}**`)
                                            .setFooter(((_17 = options.embed) === null || _17 === void 0 ? void 0 : _17.credit)
                                            ? (_18 = options.embed) === null || _18 === void 0 ? void 0 : _18.footer
                                            : {
                                                text: "©️ Simply Develop. npm i simply-djs",
                                                iconURL: "https://i.imgur.com/u8VlLom.png",
                                            }),
                                    ],
                                    components: [],
                                };
                                if (interaction) {
                                    yield interaction.editReply(mm);
                                }
                                if (!interaction) {
                                    yield m.edit(mm);
                                }
                            }
                            else if (winnerMap[op] === auth) {
                                op = op
                                    .replace("scissors", `${options.buttons.scissor.emoji} ${options.buttons.scissor.label}`)
                                    .replace("paper", `${options.buttons.paper.emoji} ${options.buttons.paper.label}`)
                                    .replace("rock", `${options.buttons.rock.emoji} ${options.buttons.rock.label}`);
                                auth = auth
                                    .replace("scissors", `${options.buttons.scissor.emoji} ${options.buttons.scissor.label}`)
                                    .replace("paper", `${options.buttons.paper.emoji} ${options.buttons.paper.label}`)
                                    .replace("rock", `${options.buttons.rock.emoji} ${options.buttons.rock.label}`);
                                const mm = {
                                    content: "** **",
                                    embeds: [
                                        new discord_js_1.EmbedBuilder()
                                            .setTitle(`${opponent.tag} Won !`)
                                            .setColor(options.winColor)
                                            .setDescription(`**${op}** defeats **${auth}**`)
                                            .setFooter(((_19 = options.embed) === null || _19 === void 0 ? void 0 : _19.credit)
                                            ? (_20 = options.embed) === null || _20 === void 0 ? void 0 : _20.footer
                                            : {
                                                text: "©️ Simply Develop. npm i simply-djs",
                                                iconURL: "https://i.imgur.com/u8VlLom.png",
                                            }),
                                    ],
                                    components: [],
                                };
                                //op - won
                                if (interaction) {
                                    yield interaction.editReply(mm);
                                    resolve(opponent);
                                }
                                else if (!interaction) {
                                    resolve(opponent);
                                    yield m.edit(mm);
                                }
                            }
                            else {
                                op = op
                                    .replace("scissors", `${options.buttons.scissor.emoji} ${options.buttons.scissor.label}`)
                                    .replace("paper", `${options.buttons.paper.emoji} ${options.buttons.paper.label}`)
                                    .replace("rock", `${options.buttons.rock.emoji} ${options.buttons.rock.label}`);
                                auth = auth
                                    .replace("scissors", `${options.buttons.scissor.emoji} ${options.buttons.scissor.label}`)
                                    .replace("paper", `${options.buttons.paper.emoji} ${options.buttons.paper.label}`)
                                    .replace("rock", `${options.buttons.rock.emoji} ${options.buttons.rock.label}`);
                                const mm = {
                                    content: "** **",
                                    embeds: [
                                        new discord_js_1.EmbedBuilder()
                                            .setTitle(`${message.member.user.tag} Won !`)
                                            .setColor(options.winColor)
                                            .setDescription(`**${auth}** defeats **${op}**`)
                                            .setFooter(((_21 = options.embed) === null || _21 === void 0 ? void 0 : _21.credit)
                                            ? (_22 = options.embed) === null || _22 === void 0 ? void 0 : _22.footer
                                            : {
                                                text: "©️ Simply Develop. npm i simply-djs",
                                                iconURL: "https://i.imgur.com/u8VlLom.png",
                                            }),
                                    ],
                                    components: [],
                                };
                                //auth - won
                                if (interaction) {
                                    yield interaction.editReply(mm);
                                }
                                else if (!interaction) {
                                    yield m.edit(mm);
                                }
                                resolve(message.member.user);
                            }
                        }
                    }));
                }));
                acceptCollector.on("end", (coll, reason) => __awaiter(this, void 0, void 0, function* () {
                    var _23, _24;
                    if (reason === "time") {
                        const wee = {
                            content: "** **",
                            embeds: [timeoutEmbed],
                            components: [],
                        };
                        yield m.edit(wee);
                    }
                    else if (reason === "decline") {
                        const wee = {
                            content: "** **",
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor((0, discord_js_1.colorResolvable)(`RED`))
                                    .setFooter(((_23 = options.embed) === null || _23 === void 0 ? void 0 : _23.credit)
                                    ? (_24 = options.embed) === null || _24 === void 0 ? void 0 : _24.footer
                                    : {
                                        text: "©️ Simply Develop. npm i simply-djs",
                                        iconURL: "https://i.imgur.com/u8VlLom.png",
                                    })
                                    .setTitle("Game Declined!")
                                    .setDescription(`${opponent.tag} has declined your game request!`),
                            ],
                            components: [],
                        };
                        yield m.edit(wee);
                    }
                }));
            }
            catch (err) {
                console.log(`${chalk_1.default.red("Error Occured.")} | ${chalk_1.default.magenta("rps")} | Error: ${err.stack}`);
            }
        }));
    });
}
exports.rps = rps;
