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
exports.automeme = void 0;
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const Error_1 = require("./Error/Error");
const chalk_1 = __importDefault(require("chalk"));
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * The memes are sent automatically, so others will able to laugh at the jokes without having to do anything !
 * @param client
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/automeme***
 * @example simplydjs.automeme(client, { channelId: '1234567890123' })
 */
function automeme(client, options = { channelId: '' }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ch = options.channelId;
            if (!ch || ch == '')
                throw new Error_1.SimplyError({
                    name: 'NOT_SPECIFIED | Provide an channel id to send memes.',
                    tip: `Expected channelId as string in options.. | Received ${ch || 'undefined'}`
                });
            const sub = [
                'meme',
                'me_irl',
                'memes',
                'dankmeme',
                'dankmemes',
                'ComedyCemetery',
                'terriblefacebookmemes',
                'funny'
            ];
            if (Array.isArray(options.sub)) {
                options.sub.forEach((subb) => {
                    sub.push(subb);
                });
            }
            else if (!Array.isArray(options.sub)) {
                sub.push(options.sub);
            }
            if (!options.embed) {
                options.embed = {
                    color: '#075FFF'
                };
            }
            const random = Math.floor(Math.random() * sub.length);
            let interv;
            if (options.interval) {
                if (options.interval < 60000)
                    throw new Error_1.SimplyError({
                        name: 'Provide an interval time above 60000ms',
                        tip: `Expected Interval time above 60000ms (1 minute) | Received ${options.interval || 'undefined'}`
                    });
                interv = options.interval;
            }
            else {
                interv = 240000;
            }
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const channel = yield client.channels.fetch(ch, {
                    cache: true
                });
                if (!channel)
                    throw new Error_1.SimplyError({
                        name: `INVALID_CHID - ${options.channelId} | The channel id you specified is not valid (or) The bot has no VIEW_CHANNEL permission.`,
                        tip: 'Check the permissions (or) Try using another Channel ID'
                    });
                const response = yield axios_1.default
                    .get(`https://www.reddit.com/r/${sub[random]}/random/.json`)
                    .then((res) => res.data)
                    .catch(() => { });
                if (!response)
                    return;
                if (!response[0].data)
                    return;
                if (response[0].data.children[0].data.over_18 === true)
                    return;
                const perma = response[0].data.children[0].data.permalink;
                const url = `https://reddit.com${perma}`;
                const memeImage = response[0].data.children[0].data.url ||
                    response[0].data.children[0].data.url_overridden_by_dest;
                const title = response[0].data.children[0].data.title;
                const upp = response[0].data.children[0].data.ups;
                const ratio = response[0].data.children[0].data.upvote_ratio;
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(((_a = options.embed) === null || _a === void 0 ? void 0 : _a.title) || `${title}`)
                    .setURL(`${url}`)
                    .setImage(memeImage)
                    .setColor(((_b = options.embed) === null || _b === void 0 ? void 0 : _b.color) || '#075FFF')
                    .setFooter({ text: `🔺 ${upp} | Upvote Ratio: ${ratio}` });
                if ((_c = options.embed) === null || _c === void 0 ? void 0 : _c.author) {
                    embed.setAuthor(options.embed.author);
                }
                if ((_d = options.embed) === null || _d === void 0 ? void 0 : _d.description) {
                    embed.setDescription(options.embed.description);
                }
                yield channel.send({ embeds: [embed] });
            }), interv);
        }
        catch (err) {
            console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('automeme')} | Error: ${err.stack}`);
        }
    });
}
exports.automeme = automeme;
