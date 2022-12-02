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
exports.menuPages = void 0;
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const Error_1 = require("./Error/Error");
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * An Embed paginator using Select Menus
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/menuPages***
 * @example simplydjs.menuPages(interaction, { data: {...} })
 */
function menuPages(message, options = {}) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let type = options.type || 1;
            type = Number(type);
            if (type > 2)
                throw new Error_1.SimplyError({
                    name: 'There are only two types. You provided a type which doesnt exist',
                    tip: 'TYPE 1: SEND EPHEMERAL MSG | TYPE 2: EDIT MSG'
                });
            const data = options.data;
            const rowz = options.rows;
            const menuOptions = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].emoji) {
                    const dataopt = {
                        label: data[i].label,
                        description: data[i].description,
                        value: data[i].label,
                        emoji: data[i].emoji
                    };
                    menuOptions.push(dataopt);
                }
                else if (!data[i].emoji) {
                    const dataopt = {
                        label: data[i].label,
                        description: data[i].description,
                        value: data[i].label
                    };
                    menuOptions.push(dataopt);
                }
            }
            let delopt;
            if (((_a = options.delete) === null || _a === void 0 ? void 0 : _a.enable) === undefined ||
                (((_b = options.delete) === null || _b === void 0 ? void 0 : _b.enable) !== false && ((_c = options.delete) === null || _c === void 0 ? void 0 : _c.enable) === true)) {
                delopt = {
                    label: ((_d = options.delete) === null || _d === void 0 ? void 0 : _d.label) || 'Delete',
                    description: ((_e = options.delete) === null || _e === void 0 ? void 0 : _e.description) || 'Delete the Select Menu Embed',
                    value: 'delete_menuemb',
                    emoji: ((_f = options.delete) === null || _f === void 0 ? void 0 : _f.emoji) || '❌'
                };
                menuOptions.push(delopt);
            }
            const slct = new discord_js_1.SelectMenuBuilder()
                .setMaxValues(1)
                .setCustomId('menuPages')
                .setPlaceholder(options.placeHolder || 'Dropdown Pages')
                .addOptions(menuOptions);
            const row = new discord_js_1.ActionRowBuilder().addComponents(slct);
            const rows = [];
            rows.push(row);
            if (rowz) {
                for (let i = 0; i < rowz.length; i++) {
                    rows.push(rowz[i]);
                }
            }
            let interaction;
            if (message.commandId) {
                interaction = message;
            }
            const int = message;
            const mes = message;
            let m;
            if (interaction) {
                m = yield int.followUp({
                    embeds: [options.embed],
                    components: rows,
                    fetchReply: true
                });
            }
            else if (!interaction) {
                m = yield mes.reply({ embeds: [options.embed], components: rows });
            }
            const collector = m.createMessageComponentCollector({
                componentType: discord_js_1.ComponentType.SelectMenu,
                idle: 600000
            });
            collector.on('collect', (menu) => __awaiter(this, void 0, void 0, function* () {
                const selected = menu.values[0];
                if (type === 2) {
                    yield menu.deferUpdate();
                    if (message.member.user.id !== menu.user.id)
                        return menu.followUp({
                            content: "You cannot access other's pagination."
                        });
                }
                else
                    yield menu.deferReply({ ephemeral: true });
                if (selected === 'delete_menuemb') {
                    if (message.member.user.id !== menu.user.id)
                        return menu.editReply({
                            content: "You cannot access other's pagination."
                        });
                    else
                        collector.stop('delete');
                }
                for (let i = 0; i < data.length; i++) {
                    if (selected === data[i].label) {
                        if (type === 1) {
                            menu.editReply({ embeds: [data[i].embed], ephemeral: true });
                        }
                        else if (type === 2) {
                            menu.message.edit({ embeds: [data[i].embed] });
                        }
                    }
                }
            }));
            collector.on('end', (collected, reason) => __awaiter(this, void 0, void 0, function* () {
                if (reason === 'delete')
                    return yield m.delete();
                if (collected.size === 0) {
                    m.edit({ embeds: [options.embed], components: [] });
                }
            }));
        }
        catch (err) {
            console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('menuPages')} | Error: ${err.stack}`);
        }
    });
}
exports.menuPages = menuPages;
