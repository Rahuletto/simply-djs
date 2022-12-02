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
exports.ticketSystem = void 0;
const discord_js_1 = require("discord.js");
const Error_1 = require("./Error/Error");
const chalk_1 = __importDefault(require("chalk"));
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * A **Faster** yet Powerful ticketSystem | *Requires: [**manageBtn()**](https://simplyd.js.org/docs/handler/manageBtn)*
 *
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/ticketSystem***
 * @example simplydjs.ticketSystem(interaction, { channelId: '0123456789012' })
 */
function ticketSystem(message, options = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ch = options.channelId;
            if (!ch || ch == "")
                throw new Error_1.SimplyError({
                    name: "NOT_SPECIFIED | Provide an channel id to send memes.",
                    tip: `Expected channelId as string in options.. | Received ${ch || "undefined"}`,
                });
            let channel = yield message.client.channels.fetch(ch, {
                cache: true,
            });
            channel = channel;
            if (!channel)
                throw new Error_1.SimplyError({
                    name: `INVALID_CHID - ${options.channelId} | The channel id you specified is not valid (or) The bot has no VIEW_CHANNEL permission.`,
                    tip: "Check the permissions (or) Try using another Channel ID",
                });
            let interaction;
            if (message.commandId) {
                interaction = message;
            }
            const int = message;
            const mes = message;
            if (!message.member.permissions.has("Administrator")) {
                if (interaction) {
                    return yield int.followUp({
                        content: "You are not an admin to create a Ticket Panel",
                        ephemeral: true,
                    });
                }
                else if (!interaction) {
                    return yield mes.reply({
                        content: "You are not an admin to create a Ticket Panel",
                    });
                }
            }
            const ticketbtn = new discord_js_1.ButtonBuilder()
                .setStyle(((_a = options === null || options === void 0 ? void 0 : options.button) === null || _a === void 0 ? void 0 : _a.style) || discord_js_1.ButtonStyle.Primary)
                .setEmoji(((_b = options === null || options === void 0 ? void 0 : options.button) === null || _b === void 0 ? void 0 : _b.emoji) || "🎫")
                .setLabel(((_c = options === null || options === void 0 ? void 0 : options.button) === null || _c === void 0 ? void 0 : _c.label) || "Open a Ticket")
                .setCustomId("create_ticket");
            if (!options.embed) {
                options.embed = {
                    footer: {
                        text: "©️ Simply Develop. npm i simply-djs",
                        iconURL: "https://i.imgur.com/u8VlLom.png",
                    },
                    color: "#075FFF",
                    title: "Create an Ticket",
                    credit: true,
                };
            }
            const a = new discord_js_1.ActionRowBuilder().addComponents([ticketbtn]);
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(((_d = options.embed) === null || _d === void 0 ? void 0 : _d.title) || "Ticket System")
                .setColor(((_e = options.embed) === null || _e === void 0 ? void 0 : _e.color) || "#075FFF")
                .setDescription(((_f = options.embed) === null || _f === void 0 ? void 0 : _f.description) ||
                "🎫 Create an ticket by interacting with the button 🎫")
                .setThumbnail(message.guild.iconURL())
                .setTimestamp()
                .setFooter(((_g = options.embed) === null || _g === void 0 ? void 0 : _g.credit)
                ? (_h = options.embed) === null || _h === void 0 ? void 0 : _h.footer
                : {
                    text: "©️ Simply Develop. npm i simply-djs",
                    iconURL: "https://i.imgur.com/u8VlLom.png",
                });
            if (interaction) {
                int.followUp("Done. Setting Ticket to that channel");
                channel.send({ embeds: [embed], components: [a] });
            }
            else if (!interaction) {
                channel.send({ embeds: [embed], components: [a] });
            }
        }
        catch (err) {
            console.log(`${chalk_1.default.red("Error Occured.")} | ${chalk_1.default.magenta("ticketSystem")} | Error: ${err.stack}`);
        }
    });
}
exports.ticketSystem = ticketSystem;
