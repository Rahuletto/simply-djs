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
exports.manageSug = void 0;
const discord_js_1 = require("discord.js");
const suggestion_1 = __importDefault(require("./model/suggestion"));
const chalk_1 = __importDefault(require("chalk"));
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * A **Suggestion** handler which handles all sugestions from the package
 * @param interaction
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Handler/manageSug***
 * @example simplydjs.manageSug(interaction)
 */
function manageSug(interaction, options = {}) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const button = interaction;
        if (button.isButton()) {
            try {
                options.deny = {
                    color: ((_a = options === null || options === void 0 ? void 0 : options.deny) === null || _a === void 0 ? void 0 : _a.color) || 'RED'
                };
                options.accept = {
                    color: ((_b = options === null || options === void 0 ? void 0 : options.accept) === null || _b === void 0 ? void 0 : _b.color) || 'GREEN'
                };
                if (button.customId === 'no-sug') {
                    let data = yield suggestion_1.default.findOne({
                        message: button.message.id
                    });
                    if (!data) {
                        data = new suggestion_1.default({
                            message: button.message.id
                        });
                        yield data.save().catch(() => { });
                    }
                    const oldemb = button.message.embeds[0];
                    const likesnd = oldemb.fields[1].value.split(/\s+/);
                    let likes = likesnd[1].replaceAll('`', '');
                    let dislikes = likesnd[3].replaceAll('`', '');
                    if ((!oldemb.fields[1].value.includes('%') && !isNaN(parseInt(likes))) ||
                        (!oldemb.fields[1].value.includes('%') && !isNaN(parseInt(dislikes)))) {
                        likes = parseInt(likes);
                        dislikes = parseInt(dislikes);
                        const l = Array(likes).fill({ user: '1', vote: 'up' });
                        const d = Array(dislikes).fill({ user: '2', vote: 'down' });
                        data.votes = l.concat(d);
                        yield data.save().catch(() => { });
                        yield calc(oldemb, button.message);
                    }
                    if (button.member.permissions.has("Administrator")) {
                        const surebtn = new discord_js_1.ButtonBuilder()
                            .setStyle(discord_js_1.ButtonStyle.Danger)
                            .setLabel('Downvote Suggestion')
                            .setCustomId('no-vote');
                        const nobtn = new discord_js_1.ButtonBuilder()
                            .setStyle(discord_js_1.ButtonStyle.Primary)
                            .setLabel('Deny Suggestion')
                            .setCustomId('deny-sug');
                        const row1 = new discord_js_1.ActionRowBuilder().addComponents([surebtn, nobtn]);
                        const msg = yield button.reply({
                            content: 'Do you want to Deny suggestion (or) Vote ?',
                            components: [row1],
                            ephemeral: true,
                            fetchReply: true
                        });
                        const ftter = (m) => button.user.id === m.user.id;
                        const coll = msg.createMessageComponentCollector({
                            filter: ftter,
                            componentType: discord_js_1.ComponentType.Button,
                            time: 30000
                        });
                        coll.on('collect', (btn) => __awaiter(this, void 0, void 0, function* () {
                            if (btn.customId === 'no-vote') {
                                const vt = data.votes.find((m) => m.user.toString() === btn.user.id);
                                let ot = data.votes.filter((m) => m.user.toString() !== btn.user.id) ||
                                    [];
                                if (!Array.isArray(ot)) {
                                    ot = [ot];
                                }
                                if (!vt || vt.vote === null) {
                                    const vot = { user: btn.user.id, vote: 'down' };
                                    ot.push(vot);
                                    data.votes = ot;
                                    yield data.save().catch(() => { });
                                    yield calc(oldemb, button.message);
                                    yield button.editReply({
                                        content: 'You **downvoted** the suggestion. | Suggestion ID: ' +
                                            `\`${button.message.id}\``,
                                        components: []
                                    });
                                }
                                else if (vt) {
                                    if (vt.vote === 'down') {
                                        data.votes = ot;
                                        yield data.save().catch(() => { });
                                        yield calc(oldemb, button.message);
                                        yield button.editReply({
                                            content: 'Removing your **downvote**',
                                            components: []
                                        });
                                    }
                                    else if (vt.vote === 'up') {
                                        const vot = { user: btn.user.id, vote: 'down' };
                                        ot.push(vot);
                                        data.votes = ot;
                                        yield data.save().catch(() => { });
                                        yield calc(oldemb, button.message);
                                        yield button.editReply({
                                            content: 'You **downvoted** the suggestion. | Suggestion ID: ' +
                                                `\`${button.message.id}\``,
                                            components: []
                                        });
                                    }
                                }
                            }
                            else if (btn.customId === 'deny-sug') {
                                if (!button.member.permissions.has("Administrator"))
                                    return;
                                const filter = (m) => button.user.id === m.author.id;
                                yield button.editReply({
                                    content: 'Tell me a reason to deny the suggestion. Say `cancel` to cancel. | Time: 2 minutes',
                                    components: []
                                });
                                const msgCl = btn.channel.createMessageCollector({
                                    filter,
                                    time: 120000
                                });
                                msgCl.on('collect', (m) => {
                                    if (m.content.toLowerCase() === 'cancel') {
                                        m.delete();
                                        button.editReply('Cancelled your denial');
                                        msgCl.stop();
                                    }
                                    else {
                                        m.delete();
                                        dec(m.content, oldemb, button.message, button.user);
                                        msgCl.stop();
                                    }
                                });
                                msgCl.on('end', (collected) => {
                                    if (collected.size === 0) {
                                        dec('No Reason', oldemb, button.message, button.user);
                                    }
                                });
                            }
                        }));
                    }
                    else if (!button.member.permissions.has(Admininstrator)) {
                        const vt = data.votes.find((m) => m.user.toString() === button.user.id);
                        let ot = data.votes.filter((m) => m.user.toString() !== button.user.id) ||
                            [];
                        if (!Array.isArray(ot)) {
                            ot = [ot];
                        }
                        if (!vt || vt.vote === null) {
                            const vot = { user: button.user.id, vote: 'down' };
                            ot.push(vot);
                            data.votes = ot;
                            yield data.save().catch(() => { });
                            yield calc(oldemb, button.message);
                            yield button.editReply({
                                content: 'You **downvoted** the suggestion. | Suggestion ID: ' +
                                    `\`${button.message.id}\``,
                                components: []
                            });
                        }
                        else if (vt) {
                            if (vt.vote === 'down') {
                                data.votes = ot;
                                yield data.save().catch(() => { });
                                yield calc(oldemb, button.message);
                                yield button.editReply({
                                    content: 'Removing your **downvote**',
                                    components: []
                                });
                            }
                            else if (vt.vote === 'up') {
                                const vot = { user: button.user.id, vote: 'down' };
                                ot.push(vot);
                                data.votes = ot;
                                yield data.save().catch(() => { });
                                yield calc(oldemb, button.message);
                                yield button.editReply({
                                    content: 'You **downvoted** the suggestion. | Suggestion ID: ' +
                                        `\`${button.message.id}\``,
                                    components: []
                                });
                            }
                        }
                    }
                }
                if (button.customId === 'agree-sug') {
                    let data = yield suggestion_1.default.findOne({
                        message: button.message.id
                    });
                    if (!data) {
                        data = new suggestion_1.default({
                            message: button.message.id
                        });
                        yield data.save().catch(() => { });
                    }
                    const oldemb = button.message.embeds[0];
                    const likesnd = oldemb.fields[1].value.split(/\s+/);
                    let likes = likesnd[1].replaceAll('`', '');
                    let dislikes = likesnd[3].replaceAll('`', '');
                    if ((!oldemb.fields[1].value.includes('%') && !isNaN(parseInt(likes))) ||
                        (!oldemb.fields[1].value.includes('%') && !isNaN(parseInt(dislikes)))) {
                        likes = parseInt(likes);
                        dislikes = parseInt(dislikes);
                        const l = Array(likes).fill({ user: '1', vote: 'up' });
                        const d = Array(dislikes).fill({ user: '2', vote: 'down' });
                        data.votes = l.concat(d);
                        yield data.save().catch(() => { });
                        yield calc(oldemb, button.message);
                    }
                    if (button.member.permissions.has(Administrator)) {
                        const surebtn = new discord_js_1.ButtonBuilder()
                            .setStyle(discord_js_1.ButtonStyle.Success)
                            .setLabel('Upvote Suggestion')
                            .setCustomId('yes-vote');
                        const nobtn = new discord_js_1.ButtonBuilder()
                            .setStyle(discord_js_1.ButtonStyle.Primary)
                            .setLabel('Accept Suggestion')
                            .setCustomId('accept-sug');
                        const row1 = new discord_js_1.ActionRowBuilder().addComponents([surebtn, nobtn]);
                        const msg = yield button.reply({
                            content: 'Do you want to Accept suggestion (or) Vote ?',
                            components: [row1],
                            ephemeral: true,
                            fetchReply: true
                        });
                        const ftter = (m) => button.user.id === m.user.id;
                        const coll = msg.createMessageComponentCollector({
                            filter: ftter,
                            componentType: discord_js_1.ComponentType.Button,
                            time: 30000
                        });
                        coll.on('collect', (btn) => __awaiter(this, void 0, void 0, function* () {
                            if (btn.customId === 'yes-vote') {
                                const vt = data.votes.find((m) => m.user.toString() === btn.user.id);
                                let ot = data.votes.filter((m) => m.user.toString() !== btn.user.id) ||
                                    [];
                                if (!Array.isArray(ot)) {
                                    ot = [ot];
                                }
                                if (!vt || vt.vote === null) {
                                    const vot = { user: btn.user.id, vote: 'up' };
                                    ot.push(vot);
                                    data.votes = ot;
                                    yield data.save().catch(() => { });
                                    yield calc(oldemb, button.message);
                                    yield button.editReply({
                                        content: 'You **upvoted** the suggestion. | Suggestion ID: ' +
                                            `\`${button.message.id}\``,
                                        components: []
                                    });
                                }
                                else if (vt) {
                                    if (vt.vote === 'up') {
                                        data.votes = ot;
                                        yield data.save().catch(() => { });
                                        yield calc(oldemb, button.message);
                                        yield button.editReply({
                                            content: 'Removing your **upvote**',
                                            components: []
                                        });
                                    }
                                    else if (vt.vote === 'down') {
                                        const vot = { user: btn.user.id, vote: 'up' };
                                        ot.push(vot);
                                        data.votes = ot;
                                        yield data.save().catch(() => { });
                                        yield calc(oldemb, button.message);
                                        yield button.editReply({
                                            content: 'You **upvoted** the suggestion. | Suggestion ID: ' +
                                                `\`${button.message.id}\``,
                                            components: []
                                        });
                                    }
                                }
                            }
                            else if (btn.customId === 'accept-sug') {
                                if (!button.member.permissions.has(Administrator))
                                    return;
                                const filter = (m) => button.user.id === m.author.id;
                                yield button.editReply({
                                    content: 'Tell me a reason to accept the suggestion. Say `cancel` to cancel. | Time: 2 minutes',
                                    components: []
                                });
                                const msgCl = btn.channel.createMessageCollector({
                                    filter,
                                    time: 120000
                                });
                                msgCl.on('collect', (m) => {
                                    if (m.content.toLowerCase() === 'cancel') {
                                        m.delete();
                                        button.editReply('Cancelled to accept');
                                        msgCl.stop();
                                    }
                                    else {
                                        m.delete();
                                        aprov(m.content, oldemb, button.message, button.user);
                                        msgCl.stop();
                                    }
                                });
                                msgCl.on('end', (collected) => {
                                    if (collected.size === 0) {
                                        aprov('No Reason', oldemb, button.message, button.user);
                                    }
                                });
                            }
                        }));
                    }
                    else if (!button.member.permissions.has(Administrator)) {
                        const vt = data.votes.find((m) => m.user.toString() === button.user.id);
                        let ot = data.votes.filter((m) => m.user.toString() !== button.user.id) ||
                            [];
                        if (!Array.isArray(ot)) {
                            ot = [ot];
                        }
                        if (!vt || vt.vote === null) {
                            const vot = { user: button.user.id, vote: 'up' };
                            ot.push(vot);
                            data.votes = ot;
                            yield data.save().catch(() => { });
                            yield calc(oldemb, button.message);
                            yield button.editReply({
                                content: 'You **upvoted** the suggestion. | Suggestion ID: ' +
                                    `\`${button.message.id}\``,
                                components: []
                            });
                        }
                        else if (vt) {
                            if (vt.vote === 'up') {
                                data.votes = ot;
                                yield data.save().catch(() => { });
                                yield calc(oldemb, button.message);
                                yield button.editReply({
                                    content: 'Removing your **upvote**',
                                    components: []
                                });
                            }
                            else if (vt.vote === 'down') {
                                const vot = { user: button.user.id, vote: 'up' };
                                ot.push(vot);
                                data.votes = ot;
                                yield data.save().catch(() => { });
                                yield calc(oldemb, button.message);
                                yield button.editReply({
                                    content: 'You **upvoted** the suggestion. | Suggestion ID: ' +
                                        `\`${button.message.id}\``,
                                    components: []
                                });
                            }
                        }
                    }
                }
                function calc(oldemb, msg) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const data = yield suggestion_1.default.findOne({
                            message: button.message.id
                        });
                        const l = [];
                        const d = [];
                        if (data.votes === [] || !data.votes) {
                            l.length = 0;
                            d.length = 0;
                        }
                        else {
                            data.votes.forEach((v) => {
                                if (v.vote === 'up') {
                                    l.push(v);
                                }
                                else if (v.vote === 'down') {
                                    d.push(v);
                                }
                            });
                        }
                        let dislik = d.length || 0;
                        let lik = l.length || 0;
                        if (lik <= 0) {
                            lik = 0;
                        }
                        if (dislik <= 0) {
                            dislik = 0;
                        }
                        const total = data.votes.length;
                        let uPercent = (100 * lik) / total;
                        let dPercent = (dislik * 100) / total;
                        uPercent = parseInt(uPercent.toPrecision(3)) || 0;
                        dPercent = parseInt(dPercent.toPrecision(3)) || 0;
                        let st = '⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛';
                        if (uPercent / 10 + dPercent / 10 != 0 || total != 0)
                            st = '🟩'.repeat(uPercent / 10) + '🟥'.repeat(dPercent / 10);
                        else if (total == 0) {
                            st = '⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛';
                            uPercent = 0;
                            dPercent = 0;
                        }
                        msg.components[0].components[0].label =
                            lik.toString();
                        msg.components[0].components[1].label =
                            dislik.toString();
                        oldemb.fields[1].value = `${st} [${uPercent || 0}% - ${dPercent || 0}%]`;
                        button.message.edit({
                            embeds: [oldemb],
                            components: msg.components
                        });
                    });
                }
                function dec(reason, oldemb, msg, user) {
                    var _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        oldemb = oldemb;
                        oldemb.fields[0].value = `Declined\n\n**Reason:** \`${reason}\``;
                        oldemb.setColor(((_a = options === null || options === void 0 ? void 0 : options.deny) === null || _a === void 0 ? void 0 : _a.color) || 'RED');
                        oldemb.setFooter({ text: `Declined by ${user.tag}` });
                        msg.components[0].components[0].disabled = true;
                        msg.components[0].components[1].disabled = true;
                        button.message.edit({
                            embeds: [oldemb],
                            components: msg.components
                        });
                    });
                }
                function aprov(reason, oldemb, msg, user) {
                    var _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        oldemb = oldemb;
                        oldemb.fields[0].value = `Accepted\n\n**Reason:** \`${reason}\``;
                        oldemb.setColor(((_a = options === null || options === void 0 ? void 0 : options.accept) === null || _a === void 0 ? void 0 : _a.color) || 'GREEN');
                        oldemb.setFooter({ text: `Accepted by ${user.tag}` });
                        msg.components[0].components[0].disabled = true;
                        msg.components[0].components[1].disabled = true;
                        button.message.edit({
                            embeds: [oldemb],
                            components: msg.components
                        });
                    });
                }
            }
            catch (err) {
                console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('manageSug')} | Error: ${err.stack}`);
            }
        }
    });
}
exports.manageSug = manageSug;
