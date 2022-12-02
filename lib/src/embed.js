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
exports.embedCreate = void 0;
const discord_js_1 = require("discord.js");
const interfaces_1 = require("./interfaces");
const chalk_1 = __importDefault(require("chalk"));
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * Lets you create embeds with **an interactive builder**
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/embedCreate***
 * @example simplydjs.embedCreate(message)
 */
function embedCreate(message, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            try {
                const done = new discord_js_1.ButtonBuilder()
                    .setLabel('Finish')
                    .setStyle(interfaces_1.styleObj['SUCCESS'])
                    .setCustomId('setDone');
                const reject = new discord_js_1.ButtonBuilder()
                    .setLabel('Cancel')
                    .setStyle(interfaces_1.styleObj['DANGER'])
                    .setCustomId('setDelete');
                const menuOp = [
                    {
                        name: 'Message',
                        desc: 'Message outside of the embed',
                        value: 'setMessage'
                    },
                    {
                        name: 'Author',
                        desc: 'Set author in the embed',
                        value: 'setAuthor'
                    },
                    {
                        name: 'Title',
                        desc: 'Set title in the embed',
                        value: 'setTitle'
                    },
                    {
                        name: 'URL',
                        desc: 'Set an URL for the Title in the embed',
                        value: 'setURL'
                    },
                    {
                        name: 'Description',
                        desc: 'Set description in the embed',
                        value: 'setDescription'
                    },
                    {
                        name: 'Color',
                        desc: 'Set color of the embed',
                        value: 'setColor'
                    },
                    {
                        name: 'Image',
                        desc: 'Set an image for the embed',
                        value: 'setImage'
                    },
                    {
                        name: 'Thumbnail',
                        desc: 'Set an thumbnail image in the embed',
                        value: 'setThumbnail'
                    },
                    {
                        name: 'Footer',
                        desc: 'Set an footer in the embed',
                        value: 'setFooter'
                    },
                    {
                        name: 'Timestamp',
                        desc: 'Turn on the Timestamp of the embed',
                        value: 'setTimestamp'
                    }
                ];
                const menuOptions = [];
                if (!options.embed) {
                    options.embed = {
                        footer: {
                            text: '©️ Simply Develop. npm i simply-djs',
                            iconURL: 'https://i.imgur.com/u8VlLom.png'
                        },
                        color: '#075FFF',
                        credit: true
                    };
                }
                for (let i = 0; i < menuOp.length; i++) {
                    const dataopt = {
                        label: menuOp[i].name,
                        description: menuOp[i].desc,
                        value: menuOp[i].value
                    };
                    menuOptions.push(dataopt);
                }
                const slct = new discord_js_1.SelectMenuBuilder()
                    .setMaxValues(1)
                    .setCustomId('embed-creator')
                    .setPlaceholder('Embed Creator')
                    .addOptions(menuOptions);
                const row = new discord_js_1.ActionRowBuilder().addComponents([
                    done,
                    reject
                ]);
                const row2 = new discord_js_1.ActionRowBuilder().addComponents([
                    slct
                ]);
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(((_a = options.embed) === null || _a === void 0 ? void 0 : _a.title) || 'Embed Creator')
                    .setDescription(((_b = options.embed) === null || _b === void 0 ? void 0 : _b.description) ||
                    'Select any ***option*** from the Select Menu in this message to create a custom embed for you.\n\nThis is a completed embed.')
                    .setImage('https://media.discordapp.net/attachments/885411032128978955/955066865347076226/unknown.png')
                    .setColor(((_c = options.embed) === null || _c === void 0 ? void 0 : _c.color) || '#075FFF')
                    .setFooter(((_d = options.embed) === null || _d === void 0 ? void 0 : _d.credit)
                    ? (_e = options.embed) === null || _e === void 0 ? void 0 : _e.footer
                    : {
                        text: '©️ Simply Develop. npm i simply-djs',
                        iconURL: 'https://i.imgur.com/u8VlLom.png'
                    });
                if ((_f = options.embed) === null || _f === void 0 ? void 0 : _f.author) {
                    embed.setAuthor(options.embed.author);
                }
                let interaction;
                if (message.commandId) {
                    interaction = message;
                }
                let msg;
                const int = message;
                const ms = message;
                if (interaction) {
                    yield int.followUp({
                        embeds: [options.rawEmbed || embed],
                        components: [row2, row]
                    });
                    msg = yield int.fetchReply();
                }
                else if (!interaction) {
                    msg = yield ms.reply({
                        embeds: [options.rawEmbed || embed],
                        components: [row2, row]
                    });
                }
                const emb = new discord_js_1.EmbedBuilder()
                    .setFooter(((_g = options.embed) === null || _g === void 0 ? void 0 : _g.credit)
                    ? (_h = options.embed) === null || _h === void 0 ? void 0 : _h.footer
                    : {
                        text: 'Preview Embed'
                    })
                    .setColor('#2F3136');
                message.channel
                    .send({ content: '** **', embeds: [emb] })
                    .then((preview) => __awaiter(this, void 0, void 0, function* () {
                    const filter = (m) => m.user.id === message.member.user.id;
                    const collector = msg.createMessageComponentCollector({
                        filter: filter,
                        idle: 1000 * 60 * 3
                    });
                    collector.on('collect', (button) => __awaiter(this, void 0, void 0, function* () {
                        const fitler = (m) => message.member.user.id === m.author.id;
                        const btnfilt = (m) => message.member.user.id === m.user.id;
                        if (button.customId && button.customId === 'setDelete') {
                            button.reply({
                                content: 'Cancelling the Creation.',
                                ephemeral: true
                            });
                            preview.delete().catch(() => { });
                            msg.delete().catch(() => { });
                        }
                        else if (button.customId && button.customId === 'setDone') {
                            if (message.member.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator)) {
                                button.reply({
                                    content: 'Provide me the channel to send the embed.',
                                    ephemeral: true
                                });
                                const titleclr = button.channel.createMessageCollector({
                                    filter: fitler,
                                    time: 30000,
                                    max: 1
                                });
                                titleclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                    if (m.mentions.channels.first()) {
                                        const ch = m.mentions.channels.first();
                                        button.editReply({ content: 'Done 👍', ephemeral: true });
                                        ch.send({
                                            content: preview.content,
                                            embeds: [preview.embeds[0]]
                                        });
                                        preview.delete().catch(() => { });
                                        msg.delete().catch(() => { });
                                        m.delete().catch(() => { });
                                        resolve(preview.embeds[0].toJSON());
                                    }
                                }));
                            }
                            else if (!message.member.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator)) {
                                button.reply({ content: 'Done 👍', ephemeral: true });
                                message.channel.send({
                                    content: preview.content,
                                    embeds: [preview.embeds[0]]
                                });
                                preview.delete().catch(() => { });
                                msg.delete().catch(() => { });
                                resolve(preview.embeds[0].toJSON());
                            }
                        }
                        else if (button.values[0] === 'setTimestamp') {
                            const btn = new discord_js_1.ButtonBuilder()
                                .setLabel('Enable')
                                .setCustomId('timestamp-yes')
                                .setStyle(interfaces_1.styleObj['SUCCESS']);
                            const btn2 = new discord_js_1.ButtonBuilder()
                                .setLabel('Disable')
                                .setCustomId('timestamp-no')
                                .setStyle(interfaces_1.styleObj['DANGER']);
                            button.reply({
                                content: 'Do you want a Timestamp in the embed ?',
                                ephemeral: true,
                                components: [
                                    new discord_js_1.ActionRowBuilder().addComponents([
                                        btn,
                                        btn2
                                    ])
                                ]
                            });
                            const titleclr = button.channel.createMessageComponentCollector({
                                filter: btnfilt,
                                idle: 60000
                            });
                            titleclr.on('collect', (btn) => __awaiter(this, void 0, void 0, function* () {
                                if (btn.customId === 'timestamp-yes') {
                                    button.editReply({
                                        components: [],
                                        content: 'Enabled Timestamp on the embed'
                                    });
                                    preview
                                        .edit({
                                        content: preview.content,
                                        embeds: [
                                            discord_js_1.EmbedBuilder.from(preview.embeds[0]).setTimestamp(new Date())
                                        ]
                                    })
                                        .catch(() => { });
                                }
                                if (btn.customId === 'timestamp-no') {
                                    button.editReply({
                                        components: [],
                                        content: 'Disabled Timestamp on the embed'
                                    });
                                    preview
                                        .edit({
                                        content: preview.content,
                                        embeds: [
                                            discord_js_1.EmbedBuilder.from(preview.embeds[0]).setTimestamp(null)
                                        ]
                                    })
                                        .catch(() => { });
                                }
                            }));
                        }
                        else if (button.values[0] === 'setAuthor') {
                            const autsel = new discord_js_1.SelectMenuBuilder()
                                .setMaxValues(1)
                                .setCustomId('author-selct')
                                .setPlaceholder('Author Options')
                                .addOptions([
                                {
                                    label: 'Author name',
                                    description: 'Set the author name',
                                    value: 'author-name'
                                },
                                {
                                    label: 'Author icon',
                                    description: 'Set the author icon',
                                    value: 'author-icon'
                                },
                                {
                                    label: 'Author URL',
                                    description: 'Set the author url',
                                    value: 'author-url'
                                }
                            ]);
                            button.reply({
                                content: 'Select one from the "Author" options',
                                ephemeral: true,
                                components: [
                                    new discord_js_1.ActionRowBuilder().addComponents([
                                        autsel
                                    ])
                                ]
                            });
                            const titleclr = button.channel.createMessageComponentCollector({
                                filter: btnfilt,
                                idle: 60000
                            });
                            titleclr.on('collect', (menu) => __awaiter(this, void 0, void 0, function* () {
                                yield menu.deferUpdate();
                                if (menu.customId !== 'author-selct')
                                    return;
                                if (menu.values[0] === 'author-name') {
                                    button.editReply({
                                        content: 'Send me an Author name',
                                        ephemeral: true,
                                        components: []
                                    });
                                    const authclr = button.channel.createMessageCollector({
                                        filter: fitler,
                                        time: 30000,
                                        max: 1
                                    });
                                    authclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                        var _j, _k, _l, _m;
                                        titleclr.stop();
                                        m.delete().catch(() => { });
                                        preview
                                            .edit({
                                            content: preview.content,
                                            embeds: [
                                                discord_js_1.EmbedBuilder.from(preview.embeds[0]).setAuthor({
                                                    name: m.content,
                                                    iconURL: ((_j = preview.embeds[0].author) === null || _j === void 0 ? void 0 : _j.iconURL)
                                                        ? (_k = preview.embeds[0].author) === null || _k === void 0 ? void 0 : _k.iconURL
                                                        : '',
                                                    url: ((_l = preview.embeds[0].author) === null || _l === void 0 ? void 0 : _l.url)
                                                        ? (_m = preview.embeds[0].author) === null || _m === void 0 ? void 0 : _m.url
                                                        : ''
                                                })
                                            ]
                                        })
                                            .catch(() => { });
                                    }));
                                }
                                if (menu.values[0] === 'author-icon') {
                                    button.editReply({
                                        content: 'Send me the Author icon (Attachment/Image URL)',
                                        ephemeral: true,
                                        components: []
                                    });
                                    const authclr = button.channel.createMessageCollector({
                                        filter: fitler,
                                        time: 30000,
                                        max: 1
                                    });
                                    authclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                        var _o, _p, _q, _r, _s, _t;
                                        const isthumb = m.content.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) != null ||
                                            ((_o = m.attachments.first()) === null || _o === void 0 ? void 0 : _o.url) ||
                                            '';
                                        if (!isthumb)
                                            return button.followUp({
                                                content: 'This is not a Image URL/Image Attachment. Please provide a valid image.',
                                                ephemeral: true
                                            });
                                        titleclr.stop();
                                        m.delete().catch(() => { });
                                        preview
                                            .edit({
                                            content: preview.content,
                                            embeds: [
                                                discord_js_1.EmbedBuilder.from(preview.embeds[0]).setAuthor({
                                                    name: ((_p = preview.embeds[0].author) === null || _p === void 0 ? void 0 : _p.name)
                                                        ? (_q = preview.embeds[0].author) === null || _q === void 0 ? void 0 : _q.name
                                                        : '',
                                                    iconURL: m.content || ((_r = m.attachments.first()) === null || _r === void 0 ? void 0 : _r.url) || '',
                                                    url: ((_s = preview.embeds[0].author) === null || _s === void 0 ? void 0 : _s.url)
                                                        ? (_t = preview.embeds[0].author) === null || _t === void 0 ? void 0 : _t.url
                                                        : ''
                                                })
                                            ]
                                        })
                                            .catch(() => { });
                                    }));
                                }
                                if (menu.values[0] === 'author-url') {
                                    button.editReply({
                                        content: 'Send me a Author HTTPS Url',
                                        ephemeral: true,
                                        components: []
                                    });
                                    const authclr = button.channel.createMessageCollector({
                                        filter: fitler,
                                        time: 30000,
                                        max: 1
                                    });
                                    authclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                        var _u, _v, _w, _x;
                                        if (!m.content.startsWith('http')) {
                                            m.delete().catch(() => { });
                                            return button.editReply('A URL should start with http protocol. Please give a valid URL.');
                                        }
                                        else {
                                            titleclr.stop();
                                            m.delete().catch(() => { });
                                            preview
                                                .edit({
                                                content: preview.content,
                                                embeds: [
                                                    discord_js_1.EmbedBuilder.from(preview.embeds[0]).setAuthor({
                                                        name: ((_u = preview.embeds[0].author) === null || _u === void 0 ? void 0 : _u.name)
                                                            ? (_v = preview.embeds[0].author) === null || _v === void 0 ? void 0 : _v.name
                                                            : '',
                                                        iconURL: ((_w = preview.embeds[0].author) === null || _w === void 0 ? void 0 : _w.iconURL)
                                                            ? (_x = preview.embeds[0].author) === null || _x === void 0 ? void 0 : _x.iconURL
                                                            : '',
                                                        url: m.content || ''
                                                    })
                                                ]
                                            })
                                                .catch(() => { });
                                        }
                                    }));
                                }
                            }));
                        }
                        else if (button.values[0] === 'setMessage') {
                            button.reply({
                                content: 'Tell me the text you want for message outside the embed',
                                ephemeral: true
                            });
                            const titleclr = button.channel.createMessageCollector({
                                filter: fitler,
                                time: 30000,
                                max: 1
                            });
                            titleclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                titleclr.stop();
                                m.delete().catch(() => { });
                                preview
                                    .edit({ content: m.content, embeds: [preview.embeds[0]] })
                                    .catch(() => { });
                            }));
                        }
                        else if (button.values[0] === 'setThumbnail') {
                            button.reply({
                                content: 'Send me an image for the embed thumbnail (small image at top right)',
                                ephemeral: true
                            });
                            const titleclr = button.channel.createMessageCollector({
                                filter: fitler,
                                time: 30000,
                                max: 1
                            });
                            titleclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                var _y, _z;
                                const isthumb = m.content.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) != null ||
                                    ((_y = m.attachments.first()) === null || _y === void 0 ? void 0 : _y.url) ||
                                    '';
                                if (!isthumb)
                                    return button.followUp({
                                        content: 'This is not a image url. Please provide a image url or attachment.',
                                        ephemeral: true
                                    });
                                titleclr.stop();
                                m.delete().catch(() => { });
                                preview
                                    .edit({
                                    content: preview.content,
                                    embeds: [
                                        discord_js_1.EmbedBuilder.from(preview.embeds[0]).setThumbnail(m.content || ((_z = m.attachments.first()) === null || _z === void 0 ? void 0 : _z.url) || '')
                                    ]
                                })
                                    .catch(() => { });
                            }));
                        }
                        else if (button.values[0] === 'setColor') {
                            button.reply({
                                content: 'Tell me the color you need for embed',
                                ephemeral: true
                            });
                            const titleclr = button.channel.createMessageCollector({
                                filter: fitler,
                                time: 30000
                            });
                            titleclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                if (/^#[0-9A-F]{6}$/i.test(m.content)) {
                                    m.delete().catch(() => { });
                                    titleclr.stop();
                                    preview
                                        .edit({
                                        content: preview.content,
                                        embeds: [
                                            discord_js_1.EmbedBuilder.from(preview.embeds[0]).setColor(m.content)
                                        ]
                                    })
                                        .catch(() => {
                                        button.followUp({
                                            content: 'Please provide me a valid hex code',
                                            ephemeral: true
                                        });
                                    });
                                }
                                else {
                                    yield button.followUp({
                                        content: 'Please provide me a valid hex code',
                                        ephemeral: true
                                    });
                                }
                            }));
                        }
                        else if (button.values[0] === 'setURL') {
                            button.reply({
                                content: 'Tell me what URL you want for embed title (hyperlink for embed title)',
                                ephemeral: true
                            });
                            const titleclr = button.channel.createMessageCollector({
                                filter: fitler,
                                time: 30000,
                                max: 1
                            });
                            titleclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                if (!m.content.startsWith('http')) {
                                    m.delete().catch(() => { });
                                    return button.editReply('A URL should start with http protocol. Please give a valid URL.');
                                }
                                else {
                                    m.delete().catch(() => { });
                                    titleclr.stop();
                                    preview
                                        .edit({
                                        content: preview.content,
                                        embeds: [
                                            discord_js_1.EmbedBuilder.from(preview.embeds[0]).setURL(m.content)
                                        ]
                                    })
                                        .catch(() => { });
                                }
                            }));
                        }
                        else if (button.values[0] === 'setImage') {
                            button.reply({
                                content: 'Send me the image you need for embed',
                                ephemeral: true
                            });
                            const titleclr = button.channel.createMessageCollector({
                                filter: fitler,
                                time: 30000,
                                max: 1
                            });
                            titleclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                var _0, _1;
                                const isthumb = m.content.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) != null ||
                                    ((_0 = m.attachments.first()) === null || _0 === void 0 ? void 0 : _0.url) ||
                                    '';
                                if (!isthumb)
                                    return message.reply('That is not a image url/image attachment. Please provide me a image url or attachment.');
                                m.delete().catch(() => { });
                                titleclr.stop();
                                preview
                                    .edit({
                                    content: preview.content,
                                    embeds: [
                                        discord_js_1.EmbedBuilder.from(preview.embeds[0]).setImage(m.content || ((_1 = m.attachments.first()) === null || _1 === void 0 ? void 0 : _1.url))
                                    ]
                                })
                                    .catch(() => { });
                            }));
                        }
                        else if (button.values[0] === 'setTitle') {
                            button.reply({
                                content: 'Tell me what text you want for embed title',
                                ephemeral: true
                            });
                            const titleclr = button.channel.createMessageCollector({
                                filter: fitler,
                                time: 30000,
                                max: 1
                            });
                            titleclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                m.delete().catch(() => { });
                                titleclr.stop();
                                preview
                                    .edit({
                                    content: preview.content,
                                    embeds: [
                                        discord_js_1.EmbedBuilder.from(preview.embeds[0]).setTitle(m.content)
                                    ]
                                })
                                    .catch(() => { });
                            }));
                        }
                        else if (button.values[0] === 'setDescription') {
                            button.reply({
                                content: 'Tell me what text you need for the embed description',
                                ephemeral: true
                            });
                            const titleclr = button.channel.createMessageCollector({
                                filter: fitler,
                                time: 30000,
                                max: 1
                            });
                            titleclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                m.delete().catch(() => { });
                                titleclr.stop();
                                preview
                                    .edit({
                                    content: preview.content,
                                    embeds: [
                                        discord_js_1.EmbedBuilder.from(preview.embeds[0]).setDescription(m.content)
                                    ]
                                })
                                    .catch(() => { });
                            }));
                        }
                        else if (button.values[0] === 'setFooter') {
                            const autsel = new discord_js_1.SelectMenuBuilder()
                                .setMaxValues(1)
                                .setCustomId('footer-selct')
                                .setPlaceholder('Footer Options')
                                .addOptions([
                                {
                                    label: 'Footer name',
                                    description: 'Set the footer name',
                                    value: 'footer-name'
                                },
                                {
                                    label: 'Footer icon',
                                    description: 'Set the footer icon',
                                    value: 'footer-icon'
                                }
                            ]);
                            button.reply({
                                content: 'Select one from the "Footer" options',
                                ephemeral: true,
                                components: [
                                    new discord_js_1.ActionRowBuilder().addComponents([
                                        autsel
                                    ])
                                ]
                            });
                            const titleclr = button.channel.createMessageComponentCollector({
                                filter: btnfilt,
                                idle: 60000
                            });
                            titleclr.on('collect', (menu) => __awaiter(this, void 0, void 0, function* () {
                                yield menu.deferUpdate();
                                if (menu.customId !== 'footer-selct')
                                    return;
                                if (menu.values[0] === 'footer-name') {
                                    button.editReply({
                                        content: 'Send me an Footer name',
                                        ephemeral: true,
                                        components: []
                                    });
                                    const authclr = button.channel.createMessageCollector({
                                        filter: fitler,
                                        time: 30000,
                                        max: 1
                                    });
                                    authclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                        var _2, _3;
                                        titleclr.stop();
                                        m.delete().catch(() => { });
                                        preview
                                            .edit({
                                            content: preview.content,
                                            embeds: [
                                                discord_js_1.EmbedBuilder.from(preview.embeds[0]).setFooter({
                                                    text: m.content,
                                                    iconURL: ((_2 = preview.embeds[0].footer) === null || _2 === void 0 ? void 0 : _2.iconURL)
                                                        ? (_3 = preview.embeds[0].footer) === null || _3 === void 0 ? void 0 : _3.iconURL
                                                        : ''
                                                })
                                            ]
                                        })
                                            .catch(() => { });
                                    }));
                                }
                                if (menu.values[0] === 'footer-icon') {
                                    button.editReply({
                                        content: 'Send me the Footer icon (Attachment/Image URL)',
                                        ephemeral: true,
                                        components: []
                                    });
                                    const authclr = button.channel.createMessageCollector({
                                        filter: fitler,
                                        time: 30000,
                                        max: 1
                                    });
                                    authclr.on('collect', (m) => __awaiter(this, void 0, void 0, function* () {
                                        var _4, _5, _6;
                                        const isthumb = m.content.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) != null ||
                                            ((_4 = m.attachments.first()) === null || _4 === void 0 ? void 0 : _4.url) ||
                                            '';
                                        if (!isthumb)
                                            return button.followUp({
                                                content: 'This is not a Image URL/Image Attachment. Please provide a valid image.',
                                                ephemeral: true
                                            });
                                        titleclr.stop();
                                        m.delete().catch(() => { });
                                        preview
                                            .edit({
                                            content: preview.content,
                                            embeds: [
                                                discord_js_1.EmbedBuilder.from(preview.embeds[0]).setFooter({
                                                    text: ((_5 = preview.embeds[0].footer) === null || _5 === void 0 ? void 0 : _5.text) || '',
                                                    iconURL: m.content || ((_6 = m.attachments.first()) === null || _6 === void 0 ? void 0 : _6.url) || ''
                                                })
                                            ]
                                        })
                                            .catch(() => { });
                                    }));
                                }
                            }));
                        }
                    }));
                    collector.on('end', (collected, reason) => __awaiter(this, void 0, void 0, function* () {
                        if (reason === 'time') {
                            const content = new discord_js_1.ButtonBuilder()
                                .setLabel('Timed Out')
                                .setStyle(interfaces_1.styleObj['DANGER'])
                                .setCustomId('timeout|91817623842')
                                .setDisabled(true);
                            const row = new discord_js_1.ActionRowBuilder().addComponents([
                                content
                            ]);
                            yield msg.edit({ embeds: [msg.embeds[0]], components: [row] });
                        }
                    }));
                }));
            }
            catch (err) {
                console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('embedCreate')} | Error: ${err.stack}`);
            }
        }));
    });
}
exports.embedCreate = embedCreate;
