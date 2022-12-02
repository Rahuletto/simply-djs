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
exports.betterBtnRole = void 0;
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const interfaces_1 = require("./interfaces");
const convStyle_1 = require("./Others/convStyle");
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * A **Button Role builder** that lets **admins create** button roles. | *Requires: [**manageBtn()**](https://simplyd.js.org/docs/handler/manageBtn)*
 * @param client
 * @param interaction
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/betterBtnRole***
 * @example simplydjs.betterBtnRole(client, interaction)
 */
function betterBtnRole(client, interaction, options = { custom: false }) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const ch = options.channel || interaction.options.get('channel', true);
            const msgid = options.messageId || interaction.options.get('message', true);
            let role = options.role || interaction.options.get('role', true);
            role = role;
            const msg = yield ch.messages
                .fetch({ message: msgid })
                .catch((e) => { })
                .then();
            if (!msg) {
                if (options.custom === true)
                    reject('NO_MSG');
                else
                    return interaction.followUp({
                        content: 'Cannot find any messages with that message id in the channel you specified',
                        ephemeral: true
                    });
            }
            if (msg.author.id !== client.user.id) {
                if (options.custom === true)
                    reject('OTHER_MSG');
                else
                    return interaction.followUp({
                        content: "Cannot make other user's message a button role ! Provide a message which I sent.",
                        ephemeral: true
                    });
            }
            if (options.type === 'add') {
                try {
                    const label = options.label || interaction.options.get('label') || role.name;
                    const color = (options.style ||
                        interaction.options.get('style') ||
                        'SECONDARY');
                    const emoji = options.emoji || interaction.options.get('emoji');
                    let st = (0, convStyle_1.convStyle)(color);
                    if (msg.components) {
                        for (let i = 0; msg.components.length > i; i++) {
                            for (let o = 0; msg.components[i].components.length > o; o++) {
                                if (msg.components[i].components[o].customId ===
                                    'role-' + role.id) {
                                    msg.components[i].components.splice(o, 1);
                                    msg.edit({
                                        content: msg.content || '\u200b',
                                        embeds: msg.embeds,
                                        components: msg.components
                                    });
                                    if (options.custom === true)
                                        return resolve('DONE');
                                    else
                                        return interaction.followUp({
                                            content: 'The message has the button with the same role already.. Re-adding it now..',
                                            ephemeral: true
                                        });
                                }
                            }
                        }
                    }
                    if (!msg.components ||
                        msg.components.length === 0 ||
                        msg.components === []) {
                        if (!emoji || emoji === null) {
                            const btn = new discord_js_1.ButtonBuilder()
                                .setLabel(label)
                                .setStyle(st)
                                .setCustomId('role-' + role.id);
                            const rowe = new discord_js_1.ActionRowBuilder().addComponents([
                                btn
                            ]);
                            yield msg
                                .edit({
                                content: msg.content || '\u200b',
                                embeds: msg.embeds,
                                components: [rowe]
                            })
                                .then((m) => __awaiter(this, void 0, void 0, function* () {
                                const link = new discord_js_1.ButtonBuilder()
                                    .setLabel('View Message')
                                    .setStyle(interfaces_1.styleObj['LINK'])
                                    .setURL(m.url);
                                const rowew = new discord_js_1.ActionRowBuilder().addComponents([link]);
                                if (options.custom === true)
                                    return resolve('DONE');
                                else
                                    yield interaction.followUp({
                                        content: 'Done.. Editing the message with the button...',
                                        components: [rowew],
                                        ephemeral: true
                                    });
                            }))
                                .catch((err) => {
                                interaction.followUp({ content: `\`${err.stack}\`` });
                            });
                        }
                        else if (emoji && emoji !== null) {
                            const btn = new discord_js_1.ButtonBuilder()
                                .setLabel(label)
                                .setStyle(color)
                                .setCustomId('role-' + role.id)
                                .setEmoji(emoji);
                            const rowe = new discord_js_1.ActionRowBuilder().addComponents([
                                btn
                            ]);
                            yield msg
                                .edit({
                                content: msg.content || '\u200b',
                                embeds: msg.embeds,
                                components: [rowe]
                            })
                                .then((m) => {
                                const link = new discord_js_1.ButtonBuilder()
                                    .setLabel('View Message')
                                    .setStyle(interfaces_1.styleObj['LINK'])
                                    .setURL(m.url);
                                const rowew = new discord_js_1.ActionRowBuilder().addComponents([link]);
                                if (options.custom === true)
                                    return resolve('DONE');
                                else
                                    interaction.followUp({
                                        content: 'Done.. Editing the message with the button...',
                                        components: [rowew],
                                        ephemeral: true
                                    });
                            })
                                .catch((err) => {
                                interaction.followUp({ content: `\`${err.stack}\`` });
                            });
                        }
                    }
                    else {
                        if (msg.components.length === 5) {
                            if (options.custom === true)
                                return reject('OVERLOAD');
                            else
                                return interaction.followUp({
                                    content: 'Sorry.. I have no space to send buttons in that message..'
                                });
                        }
                        const rowgap = msg.components[msg.components.length - 1];
                        const rowy = discord_js_1.ActionRowBuilder.from(rowgap);
                        if (rowgap.components.length < 5) {
                            if (!emoji || emoji === null) {
                                const btn = new discord_js_1.ButtonBuilder()
                                    .setLabel(label)
                                    .setStyle(color)
                                    .setCustomId('role-' + role.id);
                                rowy.addComponents([btn]);
                                yield msg
                                    .edit({
                                    content: msg.content || '\u200b',
                                    embeds: msg.embeds,
                                    components: [rowy]
                                })
                                    .then((m) => __awaiter(this, void 0, void 0, function* () {
                                    const link = new discord_js_1.ButtonBuilder()
                                        .setLabel('View Message')
                                        .setStyle(interfaces_1.styleObj['LINK'])
                                        .setURL(m.url);
                                    const rowew = new discord_js_1.ActionRowBuilder().addComponents([link]);
                                    if (options.custom === true)
                                        return resolve('DONE');
                                    else
                                        interaction.followUp({
                                            content: 'Done.. Editing the message with the button...',
                                            components: [rowew],
                                            ephemeral: true
                                        });
                                }))
                                    .catch((err) => {
                                    interaction.followUp({ content: `\`${err.stack}\`` });
                                });
                            }
                            else if (emoji && emoji !== null) {
                                const btn = new discord_js_1.ButtonBuilder()
                                    .setLabel(label)
                                    .setStyle(color)
                                    .setCustomId('role-' + role.id)
                                    .setEmoji(emoji);
                                rowy.addComponents([btn]);
                                yield msg
                                    .edit({
                                    content: msg.content || '\u200b',
                                    embeds: msg.embeds,
                                    components: [rowy]
                                })
                                    .then((m) => __awaiter(this, void 0, void 0, function* () {
                                    const link = new discord_js_1.ButtonBuilder()
                                        .setLabel('View Message')
                                        .setStyle(interfaces_1.styleObj['LINK'])
                                        .setURL(m.url);
                                    const rowew = new discord_js_1.ActionRowBuilder().addComponents([link]);
                                    if (options.custom === true)
                                        return resolve('DONE');
                                    else
                                        interaction.followUp({
                                            content: 'Done.. Editing the message with the button...',
                                            components: [rowew],
                                            ephemeral: true
                                        });
                                }))
                                    .catch((err) => {
                                    interaction.followUp({ content: `\`${err.stack}\`` });
                                });
                            }
                        }
                        else if (rowy.components.length === 5) {
                            if (!emoji || emoji === null) {
                                const btn = new discord_js_1.ButtonBuilder()
                                    .setLabel(label)
                                    .setStyle(color)
                                    .setCustomId('role-' + role.id);
                                const rowe = new discord_js_1.ActionRowBuilder().addComponents([
                                    btn
                                ]);
                                yield msg
                                    .edit({
                                    content: msg.content || '\u200b',
                                    embeds: msg.embeds,
                                    components: [...msg.components, rowe]
                                })
                                    .then((m) => __awaiter(this, void 0, void 0, function* () {
                                    const link = new discord_js_1.ButtonBuilder()
                                        .setLabel('View Message')
                                        .setStyle(interfaces_1.styleObj['LINK'])
                                        .setURL(m.url);
                                    const rowew = new discord_js_1.ActionRowBuilder().addComponents([link]);
                                    if (options.custom === true)
                                        return resolve('DONE');
                                    else
                                        return interaction.followUp({
                                            content: 'Done.. Editing the message with the button...',
                                            components: [rowew],
                                            ephemeral: true
                                        });
                                }))
                                    .catch((err) => {
                                    interaction.followUp({ content: `\`${err.stack}\`` });
                                });
                            }
                            else if (emoji && emoji !== null) {
                                const btn = new discord_js_1.ButtonBuilder()
                                    .setLabel(label)
                                    .setStyle(color)
                                    .setCustomId('role-' + role.id)
                                    .setEmoji(emoji);
                                const rowe = new discord_js_1.ActionRowBuilder().addComponents([
                                    btn
                                ]);
                                msg
                                    .edit({
                                    content: msg.content || '\u200b',
                                    embeds: msg.embeds,
                                    components: [...msg.components, rowe]
                                })
                                    .then((m) => __awaiter(this, void 0, void 0, function* () {
                                    const link = new discord_js_1.ButtonBuilder()
                                        .setLabel('View Message')
                                        .setStyle(interfaces_1.styleObj['LINK'])
                                        .setURL(m.url);
                                    const rowew = new discord_js_1.ActionRowBuilder().addComponents([link]);
                                    if (options.custom === true)
                                        return resolve('DONE');
                                    else
                                        return interaction.followUp({
                                            content: 'Done.. Editing the message with the button...',
                                            components: [rowew],
                                            ephemeral: true
                                        });
                                }))
                                    .catch((err) => {
                                    interaction.followUp({ content: `\`${err.stack}\`` });
                                });
                            }
                        }
                    }
                }
                catch (err) {
                    console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('betterBtnRole')} (type: add) | Error: ${err.stack}`);
                }
            }
            else if (options.type === 'remove') {
                try {
                    if (!msg.components ||
                        msg.components.length === 0 ||
                        msg.components === []) {
                        if (options.custom === true)
                            return reject('NO_BTN');
                        else
                            return interaction.followUp({
                                content: 'There is no button roles in that message.. Try using correct message ID that has button roles',
                                ephemeral: true
                            });
                    }
                    else if (msg.components) {
                        for (let i = 0; msg.components.length > i; i++) {
                            for (let o = 0; msg.components[i].components.length > o; o++) {
                                if (msg.components[i].components[o].customId ===
                                    'role-' + role.id) {
                                    msg.components[i].components.splice(o, 1);
                                    if (!msg.components[0].components ||
                                        msg.components[0].components.length === 0 ||
                                        msg.components[0].components === []) {
                                        yield msg
                                            .edit({
                                            content: msg.content || '\u200b',
                                            embeds: msg.embeds,
                                            components: []
                                        })
                                            .then((m) => __awaiter(this, void 0, void 0, function* () {
                                            const link = new discord_js_1.ButtonBuilder()
                                                .setLabel('View Message')
                                                .setStyle(interfaces_1.styleObj['LINK'])
                                                .setURL(m.url);
                                            const rowew = new discord_js_1.ActionRowBuilder().addComponents([
                                                link
                                            ]);
                                            if (options.custom === true)
                                                return resolve('DONE');
                                            else
                                                return interaction.followUp({
                                                    content: 'Done.. Editing the message without the button...',
                                                    components: [rowew],
                                                    ephemeral: true
                                                });
                                        }));
                                    }
                                    else {
                                        yield msg
                                            .edit({
                                            content: msg.content || '\u200b',
                                            embeds: msg.embeds,
                                            components: msg.components
                                        })
                                            .then((m) => __awaiter(this, void 0, void 0, function* () {
                                            const link = new discord_js_1.ButtonBuilder()
                                                .setLabel('View Message')
                                                .setStyle(interfaces_1.styleObj['LINK'])
                                                .setURL(m.url);
                                            const rowew = new discord_js_1.ActionRowBuilder().addComponents([
                                                link
                                            ]);
                                            if (options.custom === true)
                                                return resolve('DONE');
                                            else
                                                return interaction.followUp({
                                                    content: 'Done.. Editing the message without the button...',
                                                    components: [rowew],
                                                    ephemeral: true
                                                });
                                        }));
                                    }
                                }
                                else if (i === msg.components.length - 1) {
                                    if (o === msg.components[i].components.length - 1) {
                                        if (options.custom === true)
                                            return reject('NOT_FOUND');
                                        else
                                            return interaction.followUp({
                                                content: 'I cant identify a button role with that role in that message.',
                                                ephemeral: true
                                            });
                                    }
                                }
                            }
                        }
                    }
                }
                catch (err) {
                    console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('betterBtnRole')} (type: remove) | Error: ${err.stack}`);
                }
            }
        }));
    });
}
exports.betterBtnRole = betterBtnRole;
