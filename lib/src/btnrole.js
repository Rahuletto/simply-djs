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
exports.btnRole = void 0;
const discord_js_1 = require("discord.js");
const Error_1 = require("./Error/Error");
const chalk_1 = __importDefault(require("chalk"));
const interfaces_1 = require("./interfaces");
const convStyle_1 = require("./Others/convStyle");
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * A **Button Role System** that lets you create button roles with your own message. | *Requires: [**manageBtn()**](https://simplyd.js.org/docs/handler/manageBtn)*
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/btnrole***
 * @example simplydjs.btnRole(message, { data: {...} })
 */
function btnRole(message, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!options.data)
                throw new Error_1.SimplyError({
                    name: 'NOT_SPECIFIED | Provide an data option to make buttons.',
                    tip: `Expected data object in options.. Received ${options.data || 'undefined'}`
                });
            const msg = message;
            const int = message;
            if (message.commandId) {
                if (!int.member.permissions.has('Administrator'))
                    int.followUp({
                        content: 'You need `ADMINISTRATOR` permission to use this command'
                    });
                return;
            }
            else if (!message.customId) {
                if (!msg.member.permissions.has('Administrator'))
                    return yield msg.reply({
                        content: 'You need `ADMINISTRATOR` permission to use this command'
                    });
            }
            const row = [];
            const data = options.data;
            if (data.length <= 5) {
                const button = [[]];
                btnEngine(data, button, row);
            }
            else if (data.length > 5 && data.length <= 10) {
                const button = [[], []];
                btnEngine(data, button, row);
            }
            else if (data.length > 11 && data.length <= 15) {
                const button = [[], [], []];
                btnEngine(data, button, row);
            }
            else if (data.length > 16 && data.length <= 20) {
                const button = [[], [], [], []];
                btnEngine(data, button, row);
            }
            else if (data.length > 21 && data.length <= 25) {
                const button = [[], [], [], [], []];
                btnEngine(data, button, row);
            }
            else if (data.length > 25) {
                throw new Error_1.SimplyError({
                    name: 'Reached the limit of 25 buttons..',
                    tip: 'Discord allows only 25 buttons in a message. Send a new message with more buttons.'
                });
            }
            function btnEngine(data, button, row) {
                return __awaiter(this, void 0, void 0, function* () {
                    let current = 0;
                    for (let i = 0; i < data.length; i++) {
                        if (button[current].length === 5)
                            current++;
                        const emoji = data[i].emoji || null;
                        let clr = (data[i].style || 'SECONDARY');
                        clr = (0, convStyle_1.convStyle)(clr);
                        let url = '';
                        const role = message.guild.roles.cache.find((r) => r.id === data[i].role);
                        const label = data[i].label || (role === null || role === void 0 ? void 0 : role.name);
                        if (!role && clr === discord_js_1.ButtonStyle.Link) {
                            url = data[i].url;
                            button[current].push(createLink(label, url, emoji));
                        }
                        else {
                            button[current].push(createButton(label, role, clr, emoji));
                        }
                        if (i === data.length - 1) {
                            const rero = addRow(button[current]);
                            row.push(rero);
                        }
                    }
                    if (!options.embed && !options.content)
                        throw new Error_1.SimplyError({
                            name: 'NOT_SPECIFIED | Provide an embed (or) content in the options.',
                            tip: `Expected embed (or) content options to send. Received ${options.embed || options.content || 'undefined'}`
                        });
                    const emb = options.embed;
                    if (message.commandId) {
                        if (!options.embed) {
                            message.followUp({
                                content: options.content || '** **',
                                components: row
                            });
                        }
                        else
                            message.followUp({
                                content: options.content || '** **',
                                embeds: [emb],
                                components: row
                            });
                    }
                    else if (!message.commandId) {
                        if (!options.embed) {
                            message.channel.send({
                                content: options.content || '** **',
                                components: row
                            });
                        }
                        else
                            message.channel.send({
                                content: options.content || '** **',
                                embeds: [emb],
                                components: row
                            });
                    }
                    function addRow(btns) {
                        const row1 = new discord_js_1.ActionRowBuilder();
                        row1.addComponents(btns);
                        return row1;
                    }
                    function createLink(label, url, emoji) {
                        const btn = new discord_js_1.ButtonBuilder();
                        if (!emoji || emoji === null) {
                            btn.setLabel(label).setStyle(interfaces_1.styleObj['LINK']).setURL(url);
                        }
                        else if (emoji && emoji !== null) {
                            btn
                                .setLabel(label)
                                .setStyle(interfaces_1.styleObj['LINK'])
                                .setURL(url)
                                .setEmoji(emoji);
                        }
                        return btn;
                    }
                    function createButton(label, role, color, emoji) {
                        const btn = new discord_js_1.ButtonBuilder();
                        if (!emoji || emoji === null) {
                            btn
                                .setLabel(label)
                                .setStyle((0, convStyle_1.convStyle)(color))
                                .setCustomId('role-' + role.id);
                        }
                        else if (emoji && emoji !== null) {
                            btn
                                .setLabel(label)
                                .setStyle((0, convStyle_1.convStyle)(color))
                                .setCustomId('role-' + role.id)
                                .setEmoji(emoji);
                        }
                        return btn;
                    }
                });
            }
        }
        catch (err) {
            console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('btnRole')} | Error: ${err.stack}`);
        }
    });
}
exports.btnRole = btnRole;
