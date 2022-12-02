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
exports.starboard = void 0;
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = require("discord.js");
const Error_1 = require("./Error/Error");
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * Efficient yet Simplest starboard system ever existed !
 *
 * `NOTE:` **Only Use it in `messageReactionAdd`, `messageReactionRemove` and `messageDelete` events.**
 * @param client
 * @param reaction
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/starboard***
 * @example simplydjs.starboard(client, reaction, { channelId: '1234567890123' })
 */
function starboard(client, reaction, options = {}) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const min = options.min || 2;
        let m = reaction;
        let r = reaction;
        if (reaction.id)
            m = reaction;
        else
            r = reaction;
        if (!min || min == NaN || min == 0)
            throw new Error_1.SimplyError({
                name: 'MIN_IS_NAN | Minimum number of stars [min] option is Not A Number.',
                tip: `Expected an Integer/Number. Received ${min || 'undefined'}.`
            });
        if (!options.channelId)
            throw new Error_1.SimplyError({
                name: 'Provide an Channel ID to set the starboard channel'
            });
        try {
            if (m || reaction.id) {
                let starboard = yield client.channels.fetch(options.channelId, {
                    cache: true
                });
                if (!m.guild)
                    return;
                if (!starboard)
                    throw new Error_1.SimplyError({
                        name: `INVALID_CHID - ${options.channelId} | The channel id you specified is not valid (or) The bot has no VIEW_CHANNEL permission.`,
                        tip: 'Check the permissions (or) Try using another Channel ID'
                    });
                starboard = yield m.guild.channels.fetch(options.channelId, {
                    cache: true
                });
                if (!starboard)
                    return;
                const msz = yield (starboard === null || starboard === void 0 ? void 0 : starboard.messages.fetch({
                    limit: 100
                }));
                const exist = msz.find((msg) => { var _a, _b; return ((_b = (_a = msg.embeds[0]) === null || _a === void 0 ? void 0 : _a.footer) === null || _b === void 0 ? void 0 : _b.text) == '⭐ | ID: ' + m.id; });
                if (exist) {
                    yield exist.delete();
                }
            }
            else if (r) {
                if (r.emoji.id == options.emoji ||
                    r.emoji.name == '⭐' ||
                    r.emoji.name == '🌟') {
                    const minmax = r.count;
                    if (minmax < min)
                        return;
                    let starboard = yield client.channels.fetch(options.channelId, {
                        cache: true
                    });
                    if (!r.message.guild)
                        return;
                    if (!starboard)
                        throw new Error_1.SimplyError({
                            name: `INVALID_CHID - ${options.channelId} | The channel id you specified is not valid (or) The bot has no VIEW_CHANNEL permission.`,
                            tip: 'Check the permissions (or) Try using another Channel ID'
                        });
                    starboard = yield ((_b = (_a = r.message) === null || _a === void 0 ? void 0 : _a.guild.channels) === null || _b === void 0 ? void 0 : _b.fetch(options.channelId, {
                        cache: true
                    }));
                    if (!starboard)
                        return;
                    if (r.count == 0 || !r.count) {
                        const msz = yield (starboard === null || starboard === void 0 ? void 0 : starboard.messages.fetch({
                            limit: 100
                        }));
                        const exist = msz.find((msg) => { var _a, _b; return ((_b = (_a = msg.embeds[0]) === null || _a === void 0 ? void 0 : _a.footer) === null || _b === void 0 ? void 0 : _b.text) == '⭐ | ID: ' + m.id; });
                        if (exist) {
                            yield exist.delete();
                        }
                    }
                    const fetch = yield r.message.fetch();
                    const attachment = fetch.attachments.first();
                    const url = attachment ? attachment.url : null;
                    if (fetch.embeds.length !== 0)
                        return;
                    const embed = new discord_js_1.EmbedBuilder()
                        .setAuthor(((_c = options.embed) === null || _c === void 0 ? void 0 : _c.author) || {
                        name: fetch.author.tag,
                        iconURL: fetch.author.displayAvatarURL()
                    })
                        .setColor(((_d = options.embed) === null || _d === void 0 ? void 0 : _d.color) || '#FFC83D')
                        .setDescription(((_e = options.embed) === null || _e === void 0 ? void 0 : _e.description) || fetch.content)
                        .setTitle(((_f = options.embed) === null || _f === void 0 ? void 0 : _f.title) || `Jump to message`)
                        .setURL(fetch.url)
                        .setFooter({ text: '⭐ | ID: ' + fetch.id });
                    if (url) {
                        embed.setImage(url);
                    }
                    const msz = yield (starboard === null || starboard === void 0 ? void 0 : starboard.messages.fetch({
                        limit: 100
                    }));
                    const emo = options.emoji
                        ? client.emojis.cache.get(options === null || options === void 0 ? void 0 : options.emoji) || '⭐'
                        : '⭐';
                    const btn = new discord_js_1.ButtonBuilder()
                        .setLabel((r.count ? r.count : 1).toString())
                        .setEmoji(emo)
                        .setCustomId('starboard')
                        .setDisabled(true)
                        .setStyle(discord_js_1.ButtonStyle.Primary);
                    const btn2 = new discord_js_1.ButtonBuilder()
                        .setLabel(`Jump to message`)
                        .setStyle(discord_js_1.ButtonStyle.Link)
                        .setURL(fetch.url);
                    const row = new discord_js_1.ActionRowBuilder().addComponents([btn, btn2]);
                    const exist = msz.find((msg) => { var _a, _b; return ((_b = (_a = msg.embeds[0]) === null || _a === void 0 ? void 0 : _a.footer) === null || _b === void 0 ? void 0 : _b.text) == '⭐ | ID: ' + fetch.id; });
                    if (exist) {
                        if (r.count < min)
                            return yield exist.delete();
                        else
                            yield exist.edit({
                                content: `**${emo} ${r.count}**`,
                                embeds: [embed],
                                components: [row]
                            });
                    }
                    else {
                        yield starboard.send({
                            content: `**${emo} ${r.count}**`,
                            embeds: [embed],
                            components: [row]
                        });
                    }
                }
            }
        }
        catch (err) {
            console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('starboard')} | Error: ${err.stack}`);
        }
    });
}
exports.starboard = starboard;
