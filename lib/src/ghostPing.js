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
exports.ghostPing = void 0;
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * A Great system to see **who ghost pinged**
 *
 * **Important!**: Use it in `messageDelete` event
 *
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/ghostPing***
 * @example simplydjs.ghostPing(message)
 */
function ghostPing(message, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (message.mentions.users.first()) {
                try {
                    if (message.author.bot)
                        return;
                    if (message.content.includes(`<@${(_a = message.mentions.members.first()) === null || _a === void 0 ? void 0 : _a.user.id}>`) ||
                        message.content.includes(`<@!${(_b = message.mentions.members.first()) === null || _b === void 0 ? void 0 : _b.user.id}>`)) {
                        if (!options.custom) {
                            if (!options.embed) {
                                options.embed = {
                                    footer: {
                                        text: '©️ Simply Develop. npm i simply-djs',
                                        iconURL: 'https://i.imgur.com/u8VlLom.png'
                                    },
                                    color: '#075FFF',
                                    credit: true
                                };
                            }
                            const chembed = new discord_js_1.EmbedBuilder()
                                .setAuthor(((_c = options.embed) === null || _c === void 0 ? void 0 : _c.author) || {
                                name: message.author.tag,
                                iconURL: message.author.displayAvatarURL({ extension: 'png' })
                            })
                                .setTitle(((_d = options.embed) === null || _d === void 0 ? void 0 : _d.title) || 'Ghost Ping Detected')
                                .setDescription(((_e = options.embed) === null || _e === void 0 ? void 0 : _e.description) ||
                                `${message.author} **(${message.author.tag})** just ghost pinged ${message.mentions.members.first()} **(${message.mentions.users.first().tag})**\n\nContent: **${message.content}**`)
                                .setColor(((_f = options.embed) === null || _f === void 0 ? void 0 : _f.color) || '#075FFF')
                                .setFooter(((_g = options.embed) === null || _g === void 0 ? void 0 : _g.credit)
                                ? (_h = options.embed) === null || _h === void 0 ? void 0 : _h.footer
                                : {
                                    text: '©️ Simply Develop. npm i simply-djs',
                                    iconURL: 'https://i.imgur.com/u8VlLom.png'
                                })
                                .setTimestamp();
                            message.channel
                                .send({ embeds: [chembed] })
                                .then((msg) => __awaiter(this, void 0, void 0, function* () {
                                setTimeout(() => {
                                    msg.delete();
                                }, 10000);
                            }));
                        }
                        resolve(true);
                    }
                    else
                        resolve(false);
                }
                catch (err) {
                    console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('ghostPing')} | Error: ${err.stack}`);
                }
            }
        }));
    });
}
exports.ghostPing = ghostPing;
