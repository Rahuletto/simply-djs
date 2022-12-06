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
exports.manageBtn = void 0;
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const gSys_1 = __importDefault(require("./model/gSys"));
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * A Button Handler for **simplydjs package functions.** [Except Suggestion Handling !]
 * @param interaction
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Handler/manageBtn***
 * @example simplydjs.manageBtn(interaction)
 */
function manageBtn(interaction, options = { ticketSys: { timed: true } }) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34;
            if (interaction.isButton()) {
                try {
                    const member = interaction.member;
                    // ------------------------------
                    // ------ B T N - R O L E -------
                    // ------------------------------
                    if (interaction.customId.startsWith("role-")) {
                        const roleId = interaction.customId.replace("role-", "");
                        const role = yield interaction.guild.roles.fetch(roleId, {
                            force: true,
                        });
                        if (!role)
                            return;
                        else {
                            yield interaction.deferReply({ ephemeral: true });
                            if (!member.roles.cache.find((r) => r.id === role.id)) {
                                member.roles
                                    // @ts-ignore
                                    .add(role)
                                    .catch((err) => interaction.channel.send({
                                    content: "ERROR: Role is higher than me. `MISSING_PERMISSIONS`",
                                }));
                                yield interaction.editReply({
                                    content: ((_a = options === null || options === void 0 ? void 0 : options.btnRole) === null || _a === void 0 ? void 0 : _a.addedMsg) ||
                                        `✅ Added the ${role.toString()} role to you.`,
                                });
                            }
                            else if (member.roles.cache.find((r) => r.id === role.id)) {
                                member.roles
                                    // @ts-ignore
                                    .remove(role)
                                    .catch((err) => interaction.channel.send({
                                    content: "ERROR: Role is higher than me. `MISSING_PERMISSIONS`",
                                }));
                                yield interaction.editReply({
                                    content: ((_b = options === null || options === void 0 ? void 0 : options.btnRole) === null || _b === void 0 ? void 0 : _b.removedMsg) ||
                                        `❌ Removed the ${role.toString()} role from you.`,
                                });
                            }
                        }
                    }
                    // ------------------------------
                    // ---- T I C K E T - S Y S -----
                    // ------------------------------
                    else if (interaction.customId === "create_ticket") {
                        yield interaction.deferReply({ ephemeral: true });
                        let name = ((_c = options.ticketSys) === null || _c === void 0 ? void 0 : _c.ticketname) || `ticket_{tag}`;
                        name = name
                            .replaceAll("{username}", member.user.username)
                            .replaceAll("{tag}", member.user.tag)
                            .replaceAll("{id}", member.user.id);
                        const topic = `Ticket has been opened by <@${member.user.id}>`;
                        const check = yield interaction.guild.channels.cache.find((ch) => ch.topic === topic);
                        if (check) {
                            yield interaction.editReply({
                                content: `You have an pre-existing ticket opened (${check.toString()}). Close it before creating a new one.`,
                            });
                        }
                        else if (!check) {
                            let chparent = ((_d = options.ticketSys) === null || _d === void 0 ? void 0 : _d.category) || null;
                            const category = interaction.guild.channels.cache.get((_e = options.ticketSys) === null || _e === void 0 ? void 0 : _e.category);
                            if (!category) {
                                chparent = null;
                            }
                            const ch = yield interaction.guild.channels.create(name, {
                                type: discord_js_1.ChannelType.GuildText,
                                topic: topic,
                                parent: chparent,
                                permissionOverwrites: [
                                    {
                                        id: interaction.guild.roles.everyone,
                                        deny: ["ViewChannel", "SendMessages", "ReadMessageHistory"], //Deny permissions
                                    },
                                    {
                                        id: member.user.id,
                                        allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
                                    },
                                ],
                            });
                            yield interaction.editReply({
                                content: `🎫 Opened your support ticket in ${ch.toString()}.`,
                            });
                            const rlz = [];
                            if ((_f = options.ticketSys) === null || _f === void 0 ? void 0 : _f.pingRole) {
                                if (Array.isArray((_g = options.ticketSys) === null || _g === void 0 ? void 0 : _g.pingRole)) {
                                    (_h = options.ticketSys) === null || _h === void 0 ? void 0 : _h.pingRole.forEach((e) => __awaiter(this, void 0, void 0, function* () {
                                        const roler = yield interaction.guild.roles.fetch(e, {
                                            force: true,
                                        });
                                        if (roler) {
                                            rlz.push(roler);
                                        }
                                    }));
                                }
                                else if (!Array.isArray((_j = options.ticketSys) === null || _j === void 0 ? void 0 : _j.pingRole)) {
                                    const roler = yield interaction.guild.roles.fetch((_k = options.ticketSys) === null || _k === void 0 ? void 0 : _k.pingRole, {
                                        force: true,
                                    });
                                    if (roler) {
                                        rlz.push(roler);
                                    }
                                }
                                rlz.forEach((e) => {
                                    ch.permissionOverwrites
                                        .create(e, {
                                        ViewChannel: true,
                                        SendMessages: true,
                                        ReadMessageHistory: true,
                                    })
                                        .catch((e) => { });
                                });
                            }
                            let str = "\n\nThis channel will be deleted after 30 minutes to prevent spams.";
                            if (options.ticketSys.timed == false) {
                                str = "";
                            }
                            const emb = new discord_js_1.EmbedBuilder()
                                .setTitle("Ticket Created")
                                .setDescription(((_l = options.ticketSys.embed) === null || _l === void 0 ? void 0 : _l.description.replaceAll("{user}", member.user.toString()).replaceAll("{tag}", member.user.tag).replaceAll("{id}", member.user.id).replaceAll("{guild}", interaction.guild.name)) ||
                                `Ticket has been raised by ${member.user}. The support will reach you shortly.\n\n**User ID**: \`${member.user.id}\` | **User Tag**: \`${member.user.tag}\`${str}`)
                                .setThumbnail(interaction.guild.iconURL())
                                .setTimestamp()
                                .setColor(((_m = options.ticketSys.embed) === null || _m === void 0 ? void 0 : _m.color) || "#075FFF")
                                .setFooter(((_o = options.ticketSys.embed) === null || _o === void 0 ? void 0 : _o.credit)
                                ? (_p = options.ticketSys.embed) === null || _p === void 0 ? void 0 : _p.footer
                                : {
                                    text: "©️ Simply Develop. npm i simply-djs",
                                    iconURL: "https://i.imgur.com/u8VlLom.png",
                                });
                            const close = new discord_js_1.ButtonBuilder()
                                .setStyle(((_s = (_r = (_q = options.ticketSys) === null || _q === void 0 ? void 0 : _q.buttons) === null || _r === void 0 ? void 0 : _r.close) === null || _s === void 0 ? void 0 : _s.style) || discord_js_1.ButtonStyle.Danger)
                                .setEmoji(((_v = (_u = (_t = options.ticketSys) === null || _t === void 0 ? void 0 : _t.buttons) === null || _u === void 0 ? void 0 : _u.close) === null || _v === void 0 ? void 0 : _v.emoji) || "🔒")
                                .setLabel(((_y = (_x = (_w = options.ticketSys) === null || _w === void 0 ? void 0 : _w.buttons) === null || _x === void 0 ? void 0 : _x.close) === null || _y === void 0 ? void 0 : _y.label) || "Close")
                                .setCustomId("close_ticket");
                            const closerow = new discord_js_1.ActionRowBuilder().addComponents([close]);
                            ch.send({
                                content: `Here is your ticket ${member.user.toString()}. | ${rlz.join(",")}`,
                                embeds: [emb],
                                components: [closerow],
                            }).then((msg) => __awaiter(this, void 0, void 0, function* () {
                                yield msg.pin();
                            }));
                            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                                yield ch.delete().catch(() => { });
                            }), 1000 * 60 * 30);
                        }
                    }
                    else if (interaction.customId === "close_ticket") {
                        yield interaction.deferReply({ ephemeral: true });
                        interaction.editReply({ content: "Locking the channel." });
                        interaction.channel.permissionOverwrites
                            .edit(interaction.guild.roles.everyone, {
                            SendMessages: false,
                        })
                            .catch((err) => { });
                        const X_btn = new discord_js_1.ButtonBuilder()
                            .setStyle(((_1 = (_0 = (_z = options.ticketSys) === null || _z === void 0 ? void 0 : _z.buttons) === null || _0 === void 0 ? void 0 : _0.delete) === null || _1 === void 0 ? void 0 : _1.style) || discord_js_1.ButtonStyle.Danger)
                            .setEmoji(((_4 = (_3 = (_2 = options.ticketSys) === null || _2 === void 0 ? void 0 : _2.buttons) === null || _3 === void 0 ? void 0 : _3.delete) === null || _4 === void 0 ? void 0 : _4.emoji) || "❌")
                            .setLabel(((_7 = (_6 = (_5 = options.ticketSys) === null || _5 === void 0 ? void 0 : _5.buttons) === null || _6 === void 0 ? void 0 : _6.delete) === null || _7 === void 0 ? void 0 : _7.label) || "Delete")
                            .setCustomId("delete_ticket");
                        const open_btn = new discord_js_1.ButtonBuilder()
                            .setStyle(((_10 = (_9 = (_8 = options.ticketSys) === null || _8 === void 0 ? void 0 : _8.buttons) === null || _9 === void 0 ? void 0 : _9.reopen) === null || _10 === void 0 ? void 0 : _10.style) || discord_js_1.ButtonStyle.Success)
                            .setEmoji(((_13 = (_12 = (_11 = options.ticketSys) === null || _11 === void 0 ? void 0 : _11.buttons) === null || _12 === void 0 ? void 0 : _12.reopen) === null || _13 === void 0 ? void 0 : _13.emoji) || "🔓")
                            .setLabel(((_16 = (_15 = (_14 = options.ticketSys) === null || _14 === void 0 ? void 0 : _14.buttons) === null || _15 === void 0 ? void 0 : _15.delete) === null || _16 === void 0 ? void 0 : _16.label) || "Reopen")
                            .setCustomId("open_ticket");
                        const tr_btn = new discord_js_1.ButtonBuilder()
                            .setStyle(((_19 = (_18 = (_17 = options.ticketSys) === null || _17 === void 0 ? void 0 : _17.buttons) === null || _18 === void 0 ? void 0 : _18.transcript) === null || _19 === void 0 ? void 0 : _19.style) || discord_js_1.ButtonStyle.Primary)
                            .setEmoji(((_22 = (_21 = (_20 = options.ticketSys) === null || _20 === void 0 ? void 0 : _20.buttons) === null || _21 === void 0 ? void 0 : _21.transcript) === null || _22 === void 0 ? void 0 : _22.emoji) || "📜")
                            .setLabel(((_25 = (_24 = (_23 = options.ticketSys) === null || _23 === void 0 ? void 0 : _23.buttons) === null || _24 === void 0 ? void 0 : _24.transcript) === null || _25 === void 0 ? void 0 : _25.style) || "Transcript")
                            .setCustomId("tr_ticket");
                        const row = new discord_js_1.ActionRowBuilder().addComponents([
                            open_btn,
                            X_btn,
                            tr_btn,
                        ]);
                        yield interaction.message.edit({
                            components: [row],
                        });
                    }
                    else if (interaction.customId === "tr_ticket") {
                        yield interaction.deferReply({ ephemeral: true });
                        let messagecollection = yield interaction.channel.messages.fetch({
                            limit: 100,
                        });
                        const response = [];
                        messagecollection = messagecollection.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
                        messagecollection.forEach((m) => {
                            if (m.author.bot)
                                return;
                            const attachment = m.attachments.first();
                            const url = attachment ? attachment.url : null;
                            if (url !== null) {
                                m.content = url;
                            }
                            response.push(`[${m.author.tag} | ${m.author.id}] => ${m.content}`);
                        });
                        const tr = yield interaction.editReply({
                            content: "Collecting messages to create logs",
                        });
                        let use = interaction.channel.topic
                            .replace(`Ticket has been opened by <@`, "")
                            .replace(">", "");
                        use = yield interaction.guild.members.fetch(use);
                        const attach = new discord_js_1.AttachmentBuilder(Buffer.from(response.join(`\n`), "utf-8"), `${use.user.tag}.txt`);
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield interaction.editReply({
                                content: "Done. Generated the logs",
                                files: [attach],
                                embeds: [],
                            });
                        }), 2300);
                    }
                    else if (interaction.customId === "delete_ticket") {
                        yield interaction.deferReply({ ephemeral: true });
                        const yes = new discord_js_1.ButtonBuilder()
                            .setCustomId("yea_del")
                            .setLabel("Delete")
                            .setStyle(discord_js_1.ButtonStyle.Danger);
                        const no = new discord_js_1.ButtonBuilder()
                            .setCustomId("dont_del")
                            .setLabel("Cancel")
                            .setStyle(discord_js_1.ButtonStyle.Success);
                        const row = new discord_js_1.ActionRowBuilder().addComponents([yes, no]);
                        interaction.editReply({
                            content: "Are you sure ?? This process is not reversible !",
                            components: [row],
                        });
                    }
                    else if (interaction.customId === "yea_del") {
                        yield interaction.deferUpdate();
                        yield interaction.message.edit({ components: [] });
                        let messagecollection = yield interaction.channel.messages.fetch({
                            limit: 100,
                        });
                        const response = [];
                        messagecollection = messagecollection.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
                        messagecollection.forEach((m) => {
                            if (m.author.bot)
                                return;
                            const attachment = m.attachments.first();
                            const url = attachment ? attachment.url : null;
                            if (url !== null) {
                                m.content = url;
                            }
                            response.push(`[${m.author.tag} | ${m.author.id}] => \`${m.content}\``);
                        });
                        const attach = new discord_js_1.AttachmentBuilder(Buffer.from(response.join(`\n`), "utf-8"), `${interaction.channel.topic}.md`);
                        let use = interaction.channel.topic
                            .replace(`Ticket has been opened by <@`, "")
                            .replace(">", "");
                        use = yield interaction.guild.members.fetch(use);
                        resolve({
                            type: "Delete",
                            channelId: interaction.channel.id,
                            user: use.user,
                            data: attach,
                        });
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield interaction.channel.delete();
                        }), 2000);
                    }
                    else if (interaction.customId === "dont_del") {
                        yield interaction.deferUpdate();
                        interaction.message.edit({
                            content: "You cancelled the deletion",
                            components: [],
                        });
                    }
                    else if (interaction.customId === "open_ticket") {
                        yield interaction.deferReply({ ephemeral: true });
                        interaction.editReply({ content: "Unlocking the channel." });
                        interaction.channel.permissionOverwrites
                            .edit(interaction.guild.roles.everyone, {
                            SendMessages: true,
                        })
                            .catch((err) => { });
                        const close = new discord_js_1.ButtonBuilder()
                            .setStyle(((_28 = (_27 = (_26 = options.ticketSys) === null || _26 === void 0 ? void 0 : _26.buttons) === null || _27 === void 0 ? void 0 : _27.close) === null || _28 === void 0 ? void 0 : _28.style) || discord_js_1.ButtonStyle.Danger)
                            .setEmoji(((_31 = (_30 = (_29 = options.ticketSys) === null || _29 === void 0 ? void 0 : _29.buttons) === null || _30 === void 0 ? void 0 : _30.close) === null || _31 === void 0 ? void 0 : _31.emoji) || "🔒")
                            .setLabel(((_34 = (_33 = (_32 = options.ticketSys) === null || _32 === void 0 ? void 0 : _32.buttons) === null || _33 === void 0 ? void 0 : _33.close) === null || _34 === void 0 ? void 0 : _34.label) || "Close")
                            .setCustomId("close_ticket");
                        const closerow = new discord_js_1.ActionRowBuilder().addComponents([close]);
                        interaction.message.edit({ components: [closerow] });
                    }
                    // ------------------------------
                    // ------ G I V E A W A Y -------
                    // ------------------------------
                    else if (interaction.customId === "enter_giveaway") {
                        yield interaction.deferReply({ ephemeral: true });
                        const data = yield gSys_1.default.findOne({
                            message: interaction.message.id,
                        });
                        if (Number(data.endTime) < Date.now())
                            return;
                        else {
                            if (data.requirements.type === "role") {
                                if (!interaction.member.roles.cache.find((r) => r.id === data.requirements.id))
                                    return interaction.editReply({
                                        content: "You do not fall under the requirements. | You dont have the role",
                                    });
                            }
                            if (data.requirements.type === "guild") {
                                const g = interaction.client.guilds.cache.get(data.requirements.id);
                                const mem = yield g.members.fetch(interaction.member.user.id);
                                if (!mem)
                                    return interaction.editReply({
                                        content: "You do not fall under the requirements. | Join the server.",
                                    });
                            }
                            const entris = data.entry.find((id) => id.userID === member.user.id);
                            if (entris) {
                                yield gSys_1.default.findOneAndUpdate({
                                    message: interaction.message.id,
                                }, {
                                    $pull: { entry: { userID: member.user.id } },
                                });
                                data.entered = data.entered - 1;
                                yield data.save().then((a) => __awaiter(this, void 0, void 0, function* () {
                                    yield interaction.editReply({
                                        content: "Left the giveaway ;(",
                                    });
                                }));
                            }
                            else if (!entris) {
                                data.entry.push({
                                    userID: member.user.id,
                                    guildID: interaction.guild.id,
                                    messageID: interaction.message.id,
                                });
                                data.entered = data.entered + 1;
                                yield data.save().then((a) => __awaiter(this, void 0, void 0, function* () {
                                    yield interaction.editReply({
                                        content: "Entered the giveaway !",
                                    });
                                }));
                            }
                            const eem = interaction.message.embeds[0];
                            interaction.message.components[0].components[0].label = data.entered.toString();
                            const mes = interaction.message;
                            mes.edit({
                                embeds: [eem],
                                components: interaction.message.components,
                            });
                        }
                    }
                    if (interaction.customId === "end_giveaway" ||
                        interaction.customId === "reroll_giveaway") {
                        const allComp = yield interaction.message.components[0];
                        const ftr = yield interaction.message.embeds[0].footer;
                        const embeded = new discord_js_1.EmbedBuilder()
                            .setTitle("Processing Data...")
                            .setColor(0xcc0000)
                            .setDescription(`Please wait.. We are Processing the winner with some magiks`)
                            .setFooter({
                            text: "Ending the Giveaway, Scraping the ticket..",
                        });
                        const msg = interaction.message;
                        yield msg.edit({ embeds: [embeded], components: [] }).catch(() => { });
                        const dispWin = [];
                        const dt = yield gSys_1.default.findOne({ message: msg.id });
                        dt.endTime = undefined;
                        yield dt.save().catch(() => { });
                        const winArr = [];
                        const winCt = dt.winCount;
                        const entries = dt.entry;
                        if (dt.entered > 0) {
                            for (let i = 0; i < winCt; i++) {
                                const winno = Math.floor(Math.random() * dt.entered);
                                winArr.push(entries[winno]);
                            }
                        }
                        setTimeout(() => {
                            winArr.forEach((name) => __awaiter(this, void 0, void 0, function* () {
                                yield interaction.guild.members
                                    .fetch(name.userID)
                                    .then((user) => {
                                    dispWin.push(`<@${user.user.id}>`);
                                    const embod = new discord_js_1.EmbedBuilder()
                                        .setTitle("You.. Won the Giveaway !")
                                        .setDescription(`You just won \`${dt.prize}\` in the Giveaway at \`${user.guild.name}\` Go claim it fast !`)
                                        .setColor(0x075fff)
                                        .setFooter(ftr);
                                    const gothe = new discord_js_1.ButtonBuilder()
                                        .setLabel("View Giveaway")
                                        .setStyle(discord_js_1.ButtonStyle.Link)
                                        .setURL(msg.url);
                                    const entrow = new discord_js_1.ActionRowBuilder().addComponents([gothe]);
                                    return user
                                        .send({ embeds: [embod], components: [entrow] })
                                        .catch(() => { });
                                })
                                    .catch(() => { });
                            }));
                        }, 2000);
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            if (!dt)
                                return yield msg.delete();
                            if (dt) {
                                const embed = interaction.message.embeds[0];
                                const tim = Number(dt.endTime);
                                const f = [];
                                embed.fields.forEach((a) => {
                                    if (a.name === "Requirements")
                                        return;
                                    a.value = a.value
                                        .replaceAll("{hosted}", `<@${dt.host}>`)
                                        .replaceAll("{endsAt}", `<t:${tim}:f>`)
                                        .replaceAll("{prize}", dt.prize.toString())
                                        .replaceAll("{winCount}", dt.winCount.toString())
                                        .replaceAll("{entered}", dt.entered.toString());
                                    f.push(a);
                                });
                                if (dt.entered <= 0 || !winArr[0]) {
                                    embed
                                        .setTitle("No one entered")
                                        .setFields(f)
                                        .setColor((0, discord_js_1.colorResolvable)("RED"))
                                        .setFooter(ftr);
                                    allComp.components[0].disabled = true;
                                    allComp.components[1].disabled = true;
                                    allComp.components[2].disabled = true;
                                    return yield msg.edit({
                                        embeds: [embed],
                                        components: [allComp],
                                    });
                                }
                                const resWin = [];
                                allComp.components[0].disabled = true;
                                allComp.components[1].disabled = false;
                                allComp.components[2].disabled = true;
                                embed
                                    .setTitle("We got the winner !")
                                    .setDescription(`${dispWin.join(", ")} won the prize !\n`)
                                    .setFields(f)
                                    .setColor(0x3bb143)
                                    .setFooter(ftr);
                                //@ts-ignore
                                yield msg.edit({ embeds: [embed], components: [allComp] });
                                if (interaction.customId === "reroll_giveaway") {
                                    resolve({
                                        type: "Reroll",
                                        msgURL: msg.url,
                                        user: resWin,
                                    });
                                }
                            }
                        }), 5200);
                    }
                }
                catch (err) {
                    console.log(`${chalk_1.default.red("Error Occured.")} | ${chalk_1.default.magenta("manageBtn")} | Error: ${err.stack}`);
                }
            }
            else
                return;
        }));
    });
}
exports.manageBtn = manageBtn;
