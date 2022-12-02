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
exports.stealEmoji = void 0;
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = require("discord.js");
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * How cool is **stealing an emoji** from another server ? Feel the power with this function
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/stealEmoji***
 * @example simplydjs.stealEmoji(interaction)
 */
function stealEmoji(message, options = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let interaction;
            if (message.commandId) {
                interaction = message;
                if (!interaction.member.permissions.has("ManageEmojisAndStickers"))
                    return interaction.followUp({
                        content: 'You Must Have • Manage Emojis and Stickers Permission',
                        ephemeral: true
                    });
            }
            else {
                if (!message.member.permissions.has("ManageEmojisAndStickers"))
                    return message.channel.send({
                        content: 'You Must Have • Manage Emojis and Stickers Permission'
                    });
            }
            const int = interaction;
            const ms = message;
            let attachment;
            let em;
            let n;
            if (interaction) {
                n = (options === null || options === void 0 ? void 0 : options.name) || int.options.getString('name') || 'emojiURL';
                em = (options === null || options === void 0 ? void 0 : options.emoji) || int.options.getString('emoji');
                if (!em) {
                    int.followUp({
                        content: 'Send an Image URL/Attachment (Image file)/Emoji to steal [Collecting]'
                    });
                    const filter = (msg) => msg.author.id === int.member.user.id;
                    const msgCl = interaction.channel.createMessageCollector({
                        filter,
                        max: 1,
                        time: 20 * 1000
                    });
                    msgCl.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                        if (m.attachments.size != 0) {
                            attachment = m.attachments.first();
                            em = m.attachments.first().url;
                        }
                        else if (m.content.match(/https/gi))
                            em = m.content;
                        else if (m.content
                            .replace('<:', '')
                            .replace('<a:', '')
                            .match(/(:)([^:\s]+)(:)/gi))
                            em = m.content
                                .replace('<:', '')
                                .replace('<a:', '')
                                .match(/(:)([^:\s]+)(:)/gi)[1];
                        emojiCalc(em);
                    }));
                }
                else
                    emojiCalc(em);
            }
            else if (!interaction) {
                const [...args] = message.content.split(/ +/g);
                attachment = (_a = message.attachments) === null || _a === void 0 ? void 0 : _a.first();
                n = (options === null || options === void 0 ? void 0 : options.name) || args[2] || 'emojiURL';
                em = (options === null || options === void 0 ? void 0 : options.emoji) || (attachment === null || attachment === void 0 ? void 0 : attachment.url) || args[1];
                //console.log(em, n);
                if (!em || em == undefined) {
                    ms.reply({
                        content: 'Send an Image URL/Attachment (Image file)/Emoji to steal [Collecting]'
                    });
                    const filter = (msg) => msg.author.id === ms.author.id;
                    const msgCl = message.channel.createMessageCollector({
                        filter,
                        max: 1,
                        time: 20 * 1000
                    });
                    msgCl.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                        if (m.attachments.size != 0) {
                            attachment = m.attachments.first();
                            em = m.attachments.first().url;
                        }
                        else if (m.content.match(/https/gi))
                            em = m.content;
                        else if (m.content
                            .replace('<:', '')
                            .replace('<a:', '')
                            .match(/(:)([^:\s]+)(:)/gi))
                            em = m.content
                                .replace('<:', '')
                                .replace('<a:', '')
                                .match(/(:)([^:\s]+)(:)/gi)[1];
                        emojiCalc(em);
                    }));
                }
                else
                    emojiCalc(em);
            }
            function emojiCalc(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (msg.startsWith('http')) {
                        message.guild.emojis
                            .create(msg, n, {
                            reason: 'Stole an emoji using a bot.'
                        })
                            .then((emoji) => __awaiter(this, void 0, void 0, function* () {
                            var _a, _b, _c, _d;
                            const embed = new discord_js_1.EmbedBuilder()
                                .setTitle(((_a = options.embed) === null || _a === void 0 ? void 0 : _a.title.replaceAll('{name}', emoji.name).replaceAll('{id}', emoji.id).replaceAll('{url}', emoji.url)) ||
                                `Successfully added the emoji.\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``)
                                .setThumbnail(emoji.url)
                                .setColor(((_b = options.embed) === null || _b === void 0 ? void 0 : _b.color) || 0x075fff)
                                .setFooter(((_c = options.embed) === null || _c === void 0 ? void 0 : _c.credit)
                                ? (_d = options.embed) === null || _d === void 0 ? void 0 : _d.footer
                                : {
                                    text: '©️ Simply Develop. npm i simply-djs',
                                    iconURL: 'https://i.imgur.com/u8VlLom.png'
                                });
                            if (interaction) {
                                yield int.followUp({
                                    content: 'Added the emoji :+1:',
                                    embeds: [embed],
                                    ephemeral: true
                                });
                            }
                            else if (!interaction) {
                                yield ms.reply({
                                    content: 'Added the emoji :+1:',
                                    embeds: [embed]
                                });
                            }
                        }))
                            .catch((err) => message.channel.send({
                            content: `Error occured: \`\`\`\n${err}\n\`\`\``
                        }));
                    }
                    else {
                        const hasEmoteRegex = /<a?:.+:\d+>/gm;
                        const emoteRegex = /<:.+:(\d+)>/gm;
                        const animatedEmoteRegex = /<a:.+:(\d+)>/gm;
                        const emo = msg.match(hasEmoteRegex);
                        const emoji = emoteRegex.exec(emo === null || emo === void 0 ? void 0 : emo.toString());
                        const anim = animatedEmoteRegex.exec(emo === null || emo === void 0 ? void 0 : emo.toString());
                        let url;
                        if (emoji && !anim) {
                            url = 'https://cdn.discordapp.com/emojis/' + emoji[1] + '.png?v=1';
                        }
                        else if (anim) {
                            url = 'https://cdn.discordapp.com/emojis/' + emoji[1] + '.gif?v=1';
                        }
                        message.guild.emojis
                            .create(url, n, {
                            reason: 'Stole an emoji using a bot.'
                        })
                            .then((emoji) => __awaiter(this, void 0, void 0, function* () {
                            var _e, _f, _g, _h;
                            const embed = new discord_js_1.EmbedBuilder()
                                .setTitle(((_e = options.embed) === null || _e === void 0 ? void 0 : _e.title.replaceAll('{name}', emoji.name).replaceAll('{id}', emoji.id).replaceAll('{url}', emoji.url)) ||
                                `Successfully added the emoji.\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``)
                                .setThumbnail(emoji.url)
                                .setColor(((_f = options.embed) === null || _f === void 0 ? void 0 : _f.color) || 0x075fff)
                                .setFooter(((_g = options.embed) === null || _g === void 0 ? void 0 : _g.credit)
                                ? (_h = options.embed) === null || _h === void 0 ? void 0 : _h.footer
                                : {
                                    text: '©️ Simply Develop. npm i simply-djs',
                                    iconURL: 'https://i.imgur.com/u8VlLom.png'
                                });
                            if (interaction) {
                                yield int.followUp({
                                    content: 'Added the emoji :+1:',
                                    embeds: [embed],
                                    ephemeral: true
                                });
                            }
                            else if (!interaction) {
                                yield ms.reply({
                                    content: 'Added the emoji :+1:',
                                    embeds: [embed]
                                });
                            }
                        }))
                            .catch((err) => message.channel.send({
                            content: `Error occured: \`\`\`\n${err}\n\`\`\``
                        }));
                    }
                });
            }
        }
        catch (err) {
            console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('stealEmoji')} | Error: ${err.stack}`);
        }
    });
}
exports.stealEmoji = stealEmoji;
