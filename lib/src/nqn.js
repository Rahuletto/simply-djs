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
exports.nqn = void 0;
const chalk_1 = __importDefault(require("chalk"));
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * NQN bot feature. But you have the power to do it.
 * @param message
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/nqn***
 * @example simplydjs.nqn(message)
 */
function nqn(message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { client } = message;
            if (message.author.bot)
                return;
            let msg = message.content;
            const str = msg.match(/(?<=:)([^:\s]+)(?=:)/gi);
            if (msg.includes('<:') || msg.includes('<a:'))
                return;
            msg = msg.replace('<:', '').replace('<a:', '');
            const st = msg.match(/(:)([^:\s]+)(:)/gi);
            let reply = message.content;
            if (st && st[0]) {
                st.forEach((emojii) => __awaiter(this, void 0, void 0, function* () {
                    const rlem = emojii.replaceAll(':', '');
                    const emoji = message.guild.emojis.cache.find((x) => x.name === rlem) ||
                        client.emojis.cache.find((x) => x.name === rlem);
                    if (!(emoji === null || emoji === void 0 ? void 0 : emoji.id))
                        return;
                    reply = reply.replace(emojii, emoji === null || emoji === void 0 ? void 0 : emoji.toString());
                }));
                let webhook = yield (yield message.channel.fetchWebhooks()).find((w) => w.name == `simply-djs NQN`);
                if (!webhook) {
                    webhook = yield message.channel.createWebhook('simply-djs NQN', {
                        avatar: client.user.displayAvatarURL()
                    });
                }
                yield message.delete();
                yield webhook.send({
                    username: message.member.nickname || message.author.username,
                    avatarURL: message.author.displayAvatarURL({ dynamic: true }),
                    content: reply
                });
            }
        }
        catch (err) {
            console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('nqn')} | Error: ${err.stack}`);
        }
    });
}
exports.nqn = nqn;
