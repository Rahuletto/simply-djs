import {
	EmbedBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	ButtonBuilder,
	SelectMenuComponentOptionData,
	ButtonStyle,
	Message,
	ButtonInteraction,
	StringSelectMenuInteraction,
	PermissionFlagsBits,
	ComponentType,
	TextChannel,
	APIEmbed,
	ModalBuilder,
	TextInputStyle,
	TextInputBuilder,
	MessageComponentInteraction
} from 'discord.js';
import {
	ExtendedInteraction,
	ExtendedMessage,
	CustomizableEmbed
} from './typedef';
import { toRgb, ms } from './misc';
import { SimplyError } from './error';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/general/embedCreator#embedcreatoroptions
 */

export type embedCreatorOptions = {
	strict?: boolean;
	embed?: CustomizableEmbed;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * Lets you create embeds with **an interactive builder**
 * @param msgOrInt
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/general/embedCreator
 * @example simplydjs.embedCreate(interaction)
 */

export async function embedCreator(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: embedCreatorOptions = { strict: false }
): Promise<APIEmbed> {
	return new Promise(async (resolve) => {
		try {
			const done = new ButtonBuilder()
				.setLabel('Finish')
				.setStyle(ButtonStyle.Primary)
				.setCustomId('setDone');

			const reject = new ButtonBuilder()
				.setLabel('Cancel')
				.setStyle(ButtonStyle.Danger)
				.setCustomId('setDelete');

			const menuOptions: SelectMenuComponentOptionData[] = [
				{
					label: 'Message',
					description: 'Message that is outside of the embed',
					value: 'setMessage'
				},
				{
					label: 'Author',
					description: 'Set an author in the embed',
					value: 'setAuthor'
				},
				{
					label: 'Title',
					description: 'Set a title in the embed',
					value: 'setTitle'
				},
				{
					label: 'URL',
					description: 'Set an URL for the Title in the embed',
					value: 'setURL'
				},
				{
					label: 'Description',
					description: 'Set a description in the embed',
					value: 'setDescription'
				},
				{
					label: 'Color',
					description: 'Pick a color of the embed',
					value: 'setColor'
				},

				{
					label: 'Image',
					description: 'Set an image for the embed',
					value: 'setImage'
				},
				{
					label: 'Thumbnail',
					description: 'Set a thumbnail image in the embed',
					value: 'setThumbnail'
				},
				{
					label: 'Footer',
					description: 'Set a footer in the embed',
					value: 'setFooter'
				},
				{
					label: 'Timestamp',
					description: 'Turn on the Timestamp of the embed',
					value: 'setTimestamp'
				}
			];

			if (!options.embed) {
				options.embed = {
					footer: {
						text: '©️ Rahuletto. npm i simply-djs',
						iconURL: 'https://i.imgur.com/XFUIwPh.png'
					},
					color: toRgb('#406DBC')
				};
			}

			const select = new StringSelectMenuBuilder()
				.setMaxValues(1)
				.setCustomId('embed-creator')
				.setPlaceholder('Embed Creator')
				.addOptions(menuOptions);

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
				done,
				reject
			]);

			const selectRow =
				new ActionRowBuilder<StringSelectMenuBuilder>().addComponents([select]);

			const embed = new EmbedBuilder()
				.setTitle(options.embed?.title || 'Embed Generator')
				.setDescription(
					options.embed?.description ||
						'Select any option from the Select Menu in this message to create a custom embed for you.\n\nThis is a completed embed.'
				)
				.setImage(
					'https://media.discordapp.net/attachments/885411032128978955/955066865347076226/unknown.png'
				)
				.setColor(options.embed?.color || toRgb('#406DBC'))
				.setFooter(
					options.embed?.footer
						? options.embed?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				);

			if (options?.embed?.author) embed.setAuthor(options.embed?.author);
			if (options?.embed?.image) embed.setImage(options.embed?.image);
			if (options?.embed?.thumbnail)
				embed.setThumbnail(options.embed?.thumbnail);
			if (options?.embed?.timestamp)
				embed.setTimestamp(options.embed?.timestamp);
			if (options?.embed?.title) embed.setTitle(options.embed?.title);
			if (options?.embed?.url) embed.setURL(options.embed?.url);
			if (options?.embed?.fields) embed.setFields(options.embed?.fields);

			let interaction: ExtendedInteraction;

			if (msgOrInt.commandId) {
				interaction = msgOrInt as ExtendedInteraction;

				if (interaction.deferred)
					await interaction.deferReply({ fetchReply: true });
			}

			let msg: Message;

			const extInteraction = msgOrInt as ExtendedInteraction;
			const extMessage = msgOrInt as ExtendedMessage;

			if (interaction) {
				msg = await extInteraction.followUp({
					embeds: [embed],
					components: [selectRow, row],
					fetchReply: true
				});
			} else if (!interaction) {
				msg = await extMessage.reply({
					embeds: [embed],
					components: [selectRow, row]
				});
			}

			const creator = new EmbedBuilder()
				.setFooter(
					options.embed?.footer
						? options.embed?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				)
				.setColor(toRgb('#2F3136'));

			msgOrInt.channel
				.send({ content: '** **', embeds: [creator] })
				.then(async (preview) => {
					const filter = (m: MessageComponentInteraction) => {
						if (m.user.id === msgOrInt.member.user.id) return true;
						m.reply({
							content: `Only <@!${msgOrInt.member.user.id}> can use these buttons!`,
							ephemeral: true
						});
						return false;
					};

					const messageFilter = (m: Message) =>
						msgOrInt.member.user.id === m.author.id;

					const buttonFilter = (m: ButtonInteraction) => {
						if (m.user.id === msgOrInt.member.user.id) return true;
						m.reply({
							content: `Only <@!${msgOrInt.member.user.id}> can use these buttons!`,
							ephemeral: true
						});
						return false;
					};

					const collector = msg.createMessageComponentCollector({
						filter: filter,
						componentType: ComponentType.StringSelect,
						idle: ms('3m')
					});

					const buttonCltr = msg.createMessageComponentCollector({
						filter: filter,
						componentType: ComponentType.Button,
						idle: ms('5m')
					});

					buttonCltr.on('collect', async (button) => {
						if (button.customId === 'setDelete') {
							await button.reply({
								content: 'Deleting your request.',
								ephemeral: true
							});

							preview.delete().catch(() => {});
							msg.delete().catch(() => {});
						} else if (button.customId === 'setDone') {
							if (
								msgOrInt.member.permissions.has(
									PermissionFlagsBits.Administrator
								)
							) {
								await button.reply({
									content: 'Provide me a channel to send the embed.',
									ephemeral: true
								});

								const msgCollector = button.channel.createMessageCollector({
									filter: messageFilter,
									time: ms('30s'),
									max: 1
								});

								msgCollector.on('collect', async (m: Message) => {
									if (m.mentions.channels.first()) {
										const ch = m.mentions.channels.first() as TextChannel;
										await button.editReply({ content: 'Done 👍' });

										ch.send({
											content: preview.content,
											embeds: [preview.embeds[0]]
										});
										preview.delete().catch(() => {});
										msg.delete().catch(() => {});
										m.delete().catch(() => {});

										resolve(preview.embeds[0].toJSON());
									}
								});
							} else if (
								!msgOrInt.member.permissions.has(
									PermissionFlagsBits.Administrator
								)
							) {
								button.reply({ content: 'Done 👍', ephemeral: true });

								msgOrInt.channel.send({
									content: preview.content,
									embeds: [preview.embeds[0]]
								});
								preview.delete().catch(() => {});
								msg.delete().catch(() => {});

								resolve(preview.embeds[0].toJSON());
							}
						}
					});

					collector.on(
						'collect',
						async (select: StringSelectMenuInteraction) => {
							if (select.values[0] === 'setTimestamp') {
								const btn = new ButtonBuilder()
									.setLabel('Enable')
									.setCustomId('timestamp-yes')
									.setStyle(ButtonStyle.Primary);

								const btn2 = new ButtonBuilder()
									.setLabel('Disable')
									.setCustomId('timestamp-no')
									.setStyle(ButtonStyle.Danger);

								select.reply({
									content: 'Do you want a Timestamp in the embed ?',
									ephemeral: true,
									components: [
										new ActionRowBuilder<ButtonBuilder>().addComponents([
											btn,
											btn2
										])
									]
								});

								const buttonCollector =
									select.channel.createMessageComponentCollector({
										componentType: ComponentType.Button,
										filter: buttonFilter,
										idle: ms('1m')
									});

								buttonCollector.on(
									'collect',
									async (button: ButtonInteraction) => {
										if (button.customId === 'timestamp-yes') {
											select.editReply({
												components: [],
												content: 'Enabled the Timestamp on the embed'
											});

											preview
												.edit({
													content: preview.content,
													embeds: [
														EmbedBuilder.from(preview.embeds[0]).setTimestamp(
															new Date()
														)
													]
												})
												.catch(() => {});
										}

										if (button.customId === 'timestamp-no') {
											select.editReply({
												components: [],
												content: 'Disabled the Timestamp on the embed'
											});

											preview
												.edit({
													content: preview.content,
													embeds: [
														EmbedBuilder.from(preview.embeds[0]).setTimestamp(
															null
														)
													]
												})
												.catch(() => {});
										}
									}
								);
							} else if (select.values[0] === 'setAuthor') {
								const authorSelect = new StringSelectMenuBuilder()
									.setMaxValues(1)
									.setCustomId('author-select')
									.setPlaceholder('Author Options')
									.addOptions([
										{
											label: 'Author text',
											description: 'Set the author text',
											value: 'author-text'
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

								select.reply({
									content: 'Select one from the "Author" options',
									ephemeral: true,
									components: [
										new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
											[authorSelect]
										)
									]
								});

								const menuCollector =
									select.channel.createMessageComponentCollector({
										componentType: ComponentType.StringSelect,
										filter: filter,
										idle: ms('1m')
									});

								menuCollector.on(
									'collect',
									async (menu: StringSelectMenuInteraction) => {
										if (menu.customId !== 'author-select') return;

										if (menu.values[0] === 'author-text') {
											const name = new TextInputBuilder()
												.setLabel('Send me the author text')
												.setCustomId('author')
												.setStyle(TextInputStyle.Short)
												.setRequired(false);

											const modalRow =
												new ActionRowBuilder<TextInputBuilder>().setComponents([
													name
												]);

											const modal = new ModalBuilder()
												.setCustomId('author-text-modal')
												.setTitle('Author text')
												.addComponents(modalRow);

											await menu.showModal(modal);

											const submitted = await menu.awaitModalSubmit({
												time: ms('30s'),

												filter: (i) => i.user.id === menu.user.id
											});

											if (submitted) {
												const author =
													submitted.fields.getTextInputValue('author');

												if (author.toLowerCase() === 'cancel') {
													await submitted.reply({
														content: `You have cancelled.`,
														ephemeral: true
													});
												} else {
													await submitted.reply({
														content: `Done ! Setting the author text in your embed`,
														ephemeral: true
													});

													preview
														.edit({
															content: preview.content,
															embeds: [
																EmbedBuilder.from(preview.embeds[0]).setAuthor({
																	name: author,
																	iconURL: preview.embeds[0].author?.iconURL
																		? preview.embeds[0].author?.iconURL
																		: null,
																	url: preview.embeds[0].author?.url
																		? preview.embeds[0].author?.url
																		: null
																})
															]
														})
														.catch(() => {});
												}
											}
										}

										if (menu.values[0] === 'author-icon') {
											menu.reply({
												content:
													'Send me the Author icon (Attachment/Image URL)',
												ephemeral: true,
												components: []
											});

											const messageCollect =
												select.channel.createMessageCollector({
													filter: messageFilter,
													time: ms('30s'),
													max: 1
												});

											messageCollect.on('collect', async (m: Message) => {
												const isthumb =
													m.content.match(
														/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
													) != null ||
													m.attachments.first()?.url ||
													null;
												if (!isthumb)
													menu.followUp({
														content:
															'This is not a Image URL/Image Attachment. Please provide a valid image.',
														ephemeral: true
													});

												menuCollector.stop();
												m.delete().catch(() => {});

												preview
													.edit({
														content: preview.content,
														embeds: [
															EmbedBuilder.from(preview.embeds[0]).setAuthor({
																name: preview.embeds[0].author?.name
																	? preview.embeds[0].author?.name
																	: null,
																iconURL:
																	m.content ||
																	m.attachments.first()?.url ||
																	null,
																url: preview.embeds[0].author?.url
																	? preview.embeds[0].author?.url
																	: null
															})
														]
													})
													.catch(() => {});
											});
										}

										if (menu.values[0] === 'author-url') {
											const name = new TextInputBuilder()
												.setLabel('Send me the author link url')
												.setCustomId('link')
												.setStyle(TextInputStyle.Short)
												.setRequired(false);

											const modalRow =
												new ActionRowBuilder<TextInputBuilder>().setComponents([
													name
												]);

											const modal = new ModalBuilder()
												.setCustomId('author-url-modal')
												.setTitle('Author link URL')
												.addComponents(modalRow);

											await menu.showModal(modal);

											const submitted = await menu.awaitModalSubmit({
												time: ms('30s'),

												filter: (i) => i.user.id === menu.user.id
											});

											if (submitted) {
												const link = submitted.fields.getTextInputValue('link');

												if (link.toLowerCase() === 'cancel') {
													await submitted.reply({
														content: `You have cancelled.`,
														ephemeral: true
													});
												} else if (!link.startsWith('http')) {
													await submitted.reply({
														content:
															'A URL should start with http/https protocol. Please give a valid URL.',
														ephemeral: true
													});
													return;
												} else {
													await submitted.reply({
														content: `Done ! Setting the author url link in your embed`,
														ephemeral: true
													});

													preview
														.edit({
															content: preview.content,
															embeds: [
																EmbedBuilder.from(preview.embeds[0]).setAuthor({
																	name: preview.embeds[0].author?.name
																		? preview.embeds[0].author?.name
																		: null,
																	iconURL: preview.embeds[0].author?.iconURL
																		? preview.embeds[0].author?.iconURL
																		: null,
																	url: link || null
																})
															]
														})
														.catch(() => {});
												}
											}
										}
									}
								);
							} else if (select.values[0] === 'setMessage') {
								const message = new TextInputBuilder()
									.setLabel('Send me what message to set')
									.setCustomId('message')
									.setStyle(TextInputStyle.Paragraph)
									.setRequired(false);

								const modalRow =
									new ActionRowBuilder<TextInputBuilder>().setComponents([
										message
									]);

								const modal = new ModalBuilder()
									.setCustomId('set-message')
									.setTitle('Set Message')
									.addComponents(modalRow);

								await select.showModal(modal);

								const submitted = await select.awaitModalSubmit({
									time: ms('30s'),

									filter: (i) => i.user.id === select.user.id
								});

								if (submitted) {
									const message = submitted.fields.getTextInputValue('message');

									if (message.toLowerCase() === 'cancel') {
										await submitted.reply({
											content: `You have cancelled.`,
											ephemeral: true
										});
									} else {
										await submitted.reply({
											content: `Done ! Setting the content outside the embed`,
											ephemeral: true
										});

										preview
											.edit({ content: message, embeds: [preview.embeds[0]] })
											.catch(() => {});
									}
								}
							} else if (select.values[0] === 'setThumbnail') {
								select.reply({
									content:
										'Send me an image for the embed thumbnail (small image at top right)',
									ephemeral: true
								});

								const messageCollect = select.channel.createMessageCollector({
									filter: messageFilter,
									time: ms('30s'),
									max: 1
								});

								messageCollect.on('collect', async (m: Message) => {
									const isthumb =
										m.content.match(
											/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
										) != null ||
										m.attachments.first()?.url ||
										null;
									if (!isthumb) {
										select.followUp({
											content:
												'This is not a image url. Please provide a image url or attachment.',
											ephemeral: true
										});
										return;
									}

									messageCollect.stop();
									m.delete().catch(() => {});

									preview
										.edit({
											content: preview.content,
											embeds: [
												EmbedBuilder.from(preview.embeds[0]).setThumbnail(
													m.content || m.attachments.first()?.url || null
												)
											]
										})
										.catch(() => {});
								});
							} else if (select.values[0] === 'setColor') {
								const color = new TextInputBuilder()
									.setLabel('Send me the hex code to set')
									.setCustomId('color')
									.setStyle(TextInputStyle.Short)
									.setRequired(false);

								const modalRow =
									new ActionRowBuilder<TextInputBuilder>().setComponents([
										color
									]);

								const modal = new ModalBuilder()
									.setCustomId('set-color')
									.setTitle('Set Color')
									.addComponents(modalRow);

								await select.showModal(modal);

								const submitted = await select.awaitModalSubmit({
									time: ms('30s'),

									filter: (i) => i.user.id === select.user.id
								});

								if (submitted) {
									const hex = submitted.fields.getTextInputValue('color');

									if (hex.toLowerCase() === 'cancel') {
										await submitted.reply({
											content: `You have cancelled.`,
											ephemeral: true
										});
									} else if (/^#[0-9A-F]{6}$/i.test(hex)) {
										preview
											.edit({
												content: preview.content,
												embeds: [
													EmbedBuilder.from(preview.embeds[0]).setColor(
														toRgb(hex)
													)
												]
											})
											.then(async () => {
												await submitted.reply({
													content: `Done ! Setting the color on the embed`,
													ephemeral: true
												});
											})
											.catch(async () => {
												await submitted.reply({
													content: `Please provide a valid hex code`,
													ephemeral: true
												});
											});
									}
								}
							} else if (select.values[0] === 'setURL') {
								const url = new TextInputBuilder()
									.setLabel('Send me the URL to set as hyperlink')
									.setCustomId('url')
									.setStyle(TextInputStyle.Short)
									.setRequired(false);

								const modalRow =
									new ActionRowBuilder<TextInputBuilder>().setComponents([url]);

								const modal = new ModalBuilder()
									.setCustomId('set-url')
									.setTitle('Set URL')
									.addComponents(modalRow);

								await select.showModal(modal);

								const submitted = await select.awaitModalSubmit({
									time: ms('30s'),

									filter: (i) => i.user.id === select.user.id
								});

								if (submitted) {
									const url = submitted.fields.getTextInputValue('url');

									if (url.toLowerCase() === 'cancel') {
										await submitted.reply({
											content: `You have cancelled.`,
											ephemeral: true
										});
									} else if (!url.startsWith('http')) {
										await submitted.reply({
											content: `A URL should start with http protocol. Please give a valid URL.`,
											ephemeral: true
										});
									} else {
										await submitted.reply({
											content: `Done ! Setting the url hyperlink in embed`,
											ephemeral: true
										});

										preview
											.edit({
												content: preview.content,
												embeds: [
													EmbedBuilder.from(preview.embeds[0]).setURL(url)
												]
											})
											.catch(() => {});
									}
								}
							} else if (select.values[0] === 'setImage') {
								select.reply({
									content: 'Send me the image you need for embed',
									ephemeral: true
								});

								const messageCollect = select.channel.createMessageCollector({
									filter: messageFilter,
									time: ms('30s'),
									max: 1
								});

								messageCollect.on('collect', async (m: Message) => {
									const isthumb =
										m.content.match(
											/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
										) != null ||
										m.attachments.first()?.url ||
										null;
									if (!isthumb) {
										msgOrInt.reply(
											'That is not a image url/image attachment. Please provide me a image url or attachment.'
										);
										return;
									}

									m.delete().catch(() => {});
									messageCollect.stop();
									preview
										.edit({
											content: preview.content,
											embeds: [
												EmbedBuilder.from(preview.embeds[0]).setImage(
													m.content || m.attachments.first()?.url
												)
											]
										})
										.catch(() => {});
								});
							} else if (select.values[0] === 'setTitle') {
								const title = new TextInputBuilder()
									.setLabel('Send me the title to set in embed')
									.setCustomId('title')
									.setStyle(TextInputStyle.Short)
									.setRequired(false);

								const modalRow =
									new ActionRowBuilder<TextInputBuilder>().setComponents([
										title
									]);

								const modal = new ModalBuilder()
									.setCustomId('set-title')
									.setTitle('Set Title')
									.addComponents(modalRow);

								await select.showModal(modal);

								const submitted = await select.awaitModalSubmit({
									time: ms('30s'),

									filter: (i) => i.user.id === select.user.id
								});

								if (submitted) {
									const title = submitted.fields.getTextInputValue('title');

									if (title.toLowerCase() === 'cancel') {
										await submitted.reply({
											content: `You have cancelled.`,
											ephemeral: true
										});
									} else {
										await submitted.reply({
											content: `Done ! Setting the title in embed`,
											ephemeral: true
										});

										preview
											.edit({
												content: preview.content,
												embeds: [
													EmbedBuilder.from(preview.embeds[0]).setTitle(title)
												]
											})
											.catch(() => {});
									}
								}
							} else if (select.values[0] === 'setDescription') {
								const description = new TextInputBuilder()
									.setLabel('Send me the description to set in embed')
									.setCustomId('description')
									.setStyle(TextInputStyle.Paragraph)
									.setRequired(false);

								const modalRow =
									new ActionRowBuilder<TextInputBuilder>().setComponents([
										description
									]);

								const modal = new ModalBuilder()
									.setCustomId('set-description')
									.setTitle('Set Description')
									.addComponents(modalRow);

								await select.showModal(modal);

								const submitted = await select.awaitModalSubmit({
									time: ms('30s'),

									filter: (i) => i.user.id === select.user.id
								});

								if (submitted) {
									const description =
										submitted.fields.getTextInputValue('description');

									if (description.toLowerCase() === 'cancel') {
										await submitted.reply({
											content: `You have cancelled.`,
											ephemeral: true
										});
									} else {
										await submitted.reply({
											content: `Done ! Setting the description in embed`,
											ephemeral: true
										});

										preview
											.edit({
												content: preview.content,
												embeds: [
													EmbedBuilder.from(preview.embeds[0]).setDescription(
														description
													)
												]
											})
											.catch(() => {});
									}
								}
							} else if (select.values[0] === 'setFooter') {
								const footerSelect = new StringSelectMenuBuilder()
									.setMaxValues(1)
									.setCustomId('footer-select')
									.setPlaceholder('Footer Options')
									.addOptions([
										{
											label: 'Footer text',
											description: 'Set the footer text',
											value: 'footer-text'
										},
										{
											label: 'Footer icon',
											description: 'Set the footer icon',
											value: 'footer-icon'
										}
									]);

								select.reply({
									content: 'Select one from the "Footer" options',
									ephemeral: true,
									components: [
										new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
											[footerSelect]
										)
									]
								});

								const menuCollector =
									select.channel.createMessageComponentCollector({
										componentType: ComponentType.StringSelect,
										filter: filter,
										idle: ms('30s')
									});

								menuCollector.on(
									'collect',
									async (menu: StringSelectMenuInteraction) => {
										if (menu.customId !== 'footer-select') return;

										if (menu.values[0] === 'footer-text') {
											const footerText = new TextInputBuilder()
												.setLabel('Send me the Footer text')
												.setCustomId('footer-text')
												.setStyle(TextInputStyle.Short)
												.setRequired(false);

											const modalRow =
												new ActionRowBuilder<TextInputBuilder>().setComponents([
													footerText
												]);

											const modal = new ModalBuilder()
												.setCustomId('set-footer')
												.setTitle('Set Footer text')
												.addComponents(modalRow);

											await menu.showModal(modal);

											const submitted = await menu.awaitModalSubmit({
												time: ms('30s'),

												filter: (i) => i.user.id === menu.user.id
											});

											if (submitted) {
												const footerText =
													submitted.fields.getTextInputValue('footer-text');

												if (footerText.toLowerCase() === 'cancel') {
													await submitted.reply({
														content: `You have cancelled.`,
														ephemeral: true
													});
												} else {
													await submitted.reply({
														content: `Done ! Setting the footer text in embed`,
														ephemeral: true
													});

													preview
														.edit({
															content: preview.content,
															embeds: [
																EmbedBuilder.from(preview.embeds[0]).setFooter({
																	text: footerText,
																	iconURL: preview.embeds[0].footer?.iconURL
																		? preview.embeds[0].footer?.iconURL
																		: null
																})
															]
														})
														.catch(() => {});
												}
											}
										}

										if (menu.values[0] === 'footer-icon') {
											menu.reply({
												content:
													'Send me the Footer icon (Attachment/Image URL)',
												ephemeral: true,
												components: []
											});

											const messageCollect =
												select.channel.createMessageCollector({
													filter: messageFilter,
													time: ms('30s'),
													max: 1
												});

											messageCollect.on('collect', async (m: Message) => {
												const isthumb =
													m.content.match(
														/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
													) != null ||
													m.attachments.first()?.url ||
													null;
												if (!isthumb) {
													menu.followUp({
														content:
															'This is not a Image URL/Image Attachment. Please provide a valid image.',
														ephemeral: true
													});
													return;
												}

												menuCollector.stop();
												m.delete().catch(() => {});

												preview
													.edit({
														content: preview.content,
														embeds: [
															EmbedBuilder.from(preview.embeds[0]).setFooter({
																text: preview.embeds[0].footer?.text || null,
																iconURL:
																	m.content ||
																	m.attachments.first()?.url ||
																	null
															})
														]
													})
													.catch(() => {});
											});
										}
									}
								);
							}
						}
					);
					collector.on('end', async (_collected, reason: string) => {
						if (reason === 'time') {
							const content = new ButtonBuilder()
								.setLabel('Timed Out')
								.setStyle(ButtonStyle.Danger)
								.setCustomId('timeout-embedcreator')
								.setDisabled(true);

							const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
								content
							]);

							await msg.edit({ embeds: [msg.embeds[0]], components: [row] });
						}
					});
				});
		} catch (err: any) {
			if (options?.strict)
				throw new SimplyError({
					function: 'embedCreator',
					title: 'An Error occured when running the function ',
					tip: err.stack
				});
			else console.log(`SimplyError - embedCreator | Error: ${err.stack}`);
		}
	});
}
