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
exports.bumpSystem = void 0;
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const bumpSys_1 = __importDefault(require("./model/bumpSys"));
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * A Very cool bump reminder system that reminds when a bump is necessary [Only Disboard].
 *
 * **Requires you to have this in `messageCreate` and `ready` event**
 * @param client
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/bumpSystem***
 * @example simplydjs.bumpSystem(client, message)
 */
function bumpSystem(client, message, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bumpo = new discord_js_1.EmbedBuilder()
                .setTitle('Its Bump Time !')
                .setDescription('Its been 2 hours since last bump. Could someone please bump the server again ?')
                .setTimestamp()
                .setColor('#075FFF')
                .setFooter({ text: 'Do !d bump to bump the server ;)' });
            const bumpoo = new discord_js_1.EmbedBuilder()
                .setTitle('Thank you')
                .setDescription('Thank you for bumping the server. Your support means a lot. Will notify you after 2 hours')
                .setTimestamp()
                .setColor('#06bf00')
                .setFooter({ text: 'Now its time to wait for 120 minutes. (2 hours)' });
            if ((!options && message) || (!options && !message)) {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    setInterval(() => __awaiter(this, void 0, void 0, function* () {
                        const data = yield bumpSys_1.default.find({
                            counts: []
                        });
                        data.forEach((dt) => __awaiter(this, void 0, void 0, function* () {
                            var _a;
                            if (dt.nxtBump && dt.nxtBump < Date.now()) {
                                dt.nxtBump = undefined;
                                yield dt.save().catch(() => { });
                                const cho = yield client.channels.fetch(dt.channel, {
                                    force: true
                                });
                                yield cho.send({
                                    content: message.content || '\u200b',
                                    embeds: [((_a = message.embed) === null || _a === void 0 ? void 0 : _a.bumpEmb) || bumpo]
                                });
                                resolve(true);
                            }
                            else
                                return;
                        }));
                    }), 5000);
                }));
            }
            if ((options === null || options === void 0 ? void 0 : options.auto) == false) {
                if ((options === null || options === void 0 ? void 0 : options.toggle) == false)
                    return;
                let chid = [];
                if (options && message.channel) {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        var _b, _c, _d;
                        if (Array.isArray(options.channelId)) {
                            chid = options.channelId;
                        }
                        else if (!Array.isArray(options.channelId)) {
                            chid.push(options.channelId);
                        }
                        options.embed = {
                            bumpEmb: ((_b = options.embed) === null || _b === void 0 ? void 0 : _b.bumpEmb) || bumpo,
                            thankEmb: ((_c = options.embed) === null || _c === void 0 ? void 0 : _c.thankEmb) || bumpoo
                        };
                        if (message.author.id === '302050872383242240') {
                            for (let i = 0; i < chid.length; i++) {
                                if (message.channel.id === chid[i]) {
                                    if (message.embeds[0] &&
                                        message.embeds[0].description &&
                                        message.embeds[0].description.includes('Bump done')) {
                                        const timeout = 7200000;
                                        const time = Date.now() + timeout;
                                        let data = yield bumpSys_1.default.findOne({
                                            channel: chid[i]
                                        });
                                        if (!data) {
                                            data = new bumpSys_1.default({
                                                counts: [],
                                                guild: message.guild.id,
                                                channel: chid[i],
                                                nxtBump: time
                                            });
                                            yield data.save().catch(() => { });
                                        }
                                        data.nxtBump = time;
                                        yield data.save().catch(() => { });
                                        yield message.channel.send({
                                            content: options.content || '\u200b',
                                            embeds: [((_d = options.embed) === null || _d === void 0 ? void 0 : _d.thankEmb) || bumpoo]
                                        });
                                        resolve(true);
                                    }
                                }
                            }
                        }
                    }));
                }
            }
            else if (message.content || (options === null || options === void 0 ? void 0 : options.auto) == true) {
                if ((options === null || options === void 0 ? void 0 : options.toggle) == false)
                    return;
                if (message === null || message === void 0 ? void 0 : message.channel) {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        var _e, _f, _g;
                        if (message.author.id === '302050872383242240') {
                            const chid = message.channel.id;
                            const guild = message.guild.id;
                            options.embed = {
                                bumpEmb: ((_e = options === null || options === void 0 ? void 0 : options.embed) === null || _e === void 0 ? void 0 : _e.bumpEmb) || bumpo,
                                thankEmb: ((_f = options === null || options === void 0 ? void 0 : options.embed) === null || _f === void 0 ? void 0 : _f.thankEmb) || bumpoo
                            };
                            if (message.embeds[0] &&
                                message.embeds[0].description &&
                                message.embeds[0].description.includes('Bump done')) {
                                const timeout = 7200000;
                                const time = Date.now() + timeout;
                                let data = yield bumpSys_1.default.findOne({
                                    guild: guild
                                });
                                if (!data) {
                                    data = new bumpSys_1.default({
                                        counts: [],
                                        guild: guild,
                                        channel: chid,
                                        nxtBump: time
                                    });
                                    yield data.save().catch(() => { });
                                }
                                data.nxtBump = time;
                                data.channel = chid;
                                yield data.save().catch(() => { });
                                yield message.channel.send({
                                    content: options.content || '\u200b',
                                    embeds: [((_g = options.embed) === null || _g === void 0 ? void 0 : _g.thankEmb) || bumpoo]
                                });
                                resolve(true);
                            }
                        }
                    }));
                }
            }
        }
        catch (err) {
            console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('bumpSystem')} | Error: ${err.stack}`);
        }
    });
}
exports.bumpSystem = bumpSystem;
