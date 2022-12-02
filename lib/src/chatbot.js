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
exports.chatbot = void 0;
const axios_1 = __importDefault(require("axios"));
const Error_1 = require("./Error/Error");
const chalk_1 = __importDefault(require("chalk"));
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * A chatbot system that is both technically advanced and intelligent, and is your buddy.
 *
 * **URL** of the api: *https://simplyapi.js.org*
 * @param client
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Fun/chatbot***
 * @example simplydjs.chatbot(client, message)
 */
function chatbot(client, message, options = {}) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (message.author.bot)
            return;
        if (options && options.toggle === false)
            return;
        let channels = [];
        if (Array.isArray(options.channelId))
            channels = options.channelId;
        else
            channels.push(options.channelId);
        try {
            for (const chan of channels) {
                const ch = yield client.channels.fetch(chan, {
                    cache: true
                });
                if (!ch)
                    throw new Error_1.SimplyError({
                        name: `INVALID_CHID - ${options.channelId} | The channel id you specified is not valid (or) The bot has no VIEW_CHANNEL permission.`,
                        tip: 'Check the permissions (or) Try using another Channel ID'
                    });
            }
            //Return if the channel of the message is not a chatbot channel
            if (!channels.includes(message.channel.id))
                return;
            const ranges = [
                '\ud83c[\udf00-\udfff]',
                '\ud83d[\udc00-\ude4f]',
                '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
            ];
            let input = message.cleanContent.replace(new RegExp(ranges.join('|'), 'g'), '.');
            const regg = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
            //Replacing Emojis
            input = input.replace(/<a?:.+:\d+>/gm, '');
            input = input.replace(regg, '');
            (_a = options.name) !== null && _a !== void 0 ? _a : (options.name = 'Simply-DJS');
            (_b = options.developer) !== null && _b !== void 0 ? _b : (options.developer = 'Rahuletto');
            const url = new URL('https://simplyapi.js.org/chatbot'), params = url.searchParams, age = new Date().getFullYear() - client.user.createdAt.getFullYear();
            params.set('message', input);
            params.set('developer', options.developer);
            params.set('name', (_c = options.name) !== null && _c !== void 0 ? _c : client.user.username);
            params.set('age', age.toString());
            params.set('year', client.user.createdAt.getFullYear().toString());
            params.set('bday', client.user.createdAt.toLocaleDateString());
            params.set('birthplace', 'Simply-Develop');
            params.set('uid', message.author.id);
            yield message.channel.sendTyping();
            // Using await instead of .then
            const jsonRes = yield axios_1.default
                .get(url.toString())
                .then((res) => res.data); // Parsing the data
            const chatbotReply = jsonRes.reply
                .replace(/@everyone/g, '`@everyone`')
                .replace(/@here/g, '`@here`');
            if (chatbotReply === '') {
                return message.reply({
                    content: 'Wait What ?',
                    allowedMentions: { repliedUser: false }
                });
            }
            yield message.reply({
                content: chatbotReply,
                allowedMentions: { repliedUser: false }
            });
        }
        catch (err) {
            console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('chatbot')} | Error: ${err.stack}`);
        }
    });
}
exports.chatbot = chatbot;
