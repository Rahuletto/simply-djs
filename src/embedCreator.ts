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
	BaseInteraction,
	PermissionFlagsBits,
	ComponentType,
	TextChannel,
	APIEmbed
} from 'discord.js';
import {
	ExtendedInteraction,
	ExtendedMessage,
	CustomizableEmbed
} from './interfaces';
import { toRgb, ms } from './misc';
import { SimplyError } from './error';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

export type embedOptions = {
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
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/embedCreator***
 * @example simplydjs.embedCreate(interaction)
 */

export async function embedCreator(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: embedOptions = {}
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
						'Select any ***option*** from the Select Menu in this message to create a custom embed for you.\n\nThis is a completed embed.'
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
					const filter = (m: BaseInteraction) =>
						m.user.id === msgOrInt.member.user.id;

					const messageFilter = (m: Message) =>
						msgOrInt.member.user.id === m.author.id;

					const buttonFilter = (m: ButtonInteraction) =>
						msgOrInt.member.user.id === m.user.id;

					const collector = msg.createMessageComponentCollector({
						filter: filter,
						componentType: ComponentType.StringSelect,
						idle: ms('3m')
					});

					const buttonCltr = msg.createMessageComponentCollector({
						filter: filter,
						componentType: ComponentType.Button,
						idle: ms('3m')
					});

					buttonCltr.on('collect', async (button) => {
						if (button.customId === 'setDelete') {
							button.reply({
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
								button.reply({
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
										button.editReply({ content: 'Done 👍' });

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

										if (menu.values[0] === 'author-name') {
											menu.reply({
												content: 'Send me an Author name',
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
												menuCollector.stop();
												m.delete().catch(() => {});

												preview
													.edit({
														content: preview.content,
														embeds: [
															EmbedBuilder.from(preview.embeds[0]).setAuthor({
																name: m.content,
																iconURL: preview.embeds[0].author?.iconURL
																	? preview.embeds[0].author?.iconURL
																	: '',
																url: preview.embeds[0].author?.url
																	? preview.embeds[0].author?.url
																	: ''
															})
														]
													})
													.catch(() => {});
											});
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
													'';
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
																	: '',
																iconURL:
																	m.content || m.attachments.first()?.url || '',
																url: preview.embeds[0].author?.url
																	? preview.embeds[0].author?.url
																	: ''
															})
														]
													})
													.catch(() => {});
											});
										}

										if (menu.values[0] === 'author-url') {
											menu.reply({
												content: 'Send me a Author HTTPS Url',
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
												if (!m.content.startsWith('http')) {
													m.delete().catch(() => {});
													menu.editReply(
														'A URL should start with http protocol. Please give a valid URL.'
													);
													return;
												} else {
													menuCollector.stop();
													m.delete().catch(() => {});

													preview
														.edit({
															content: preview.content,
															embeds: [
																EmbedBuilder.from(preview.embeds[0]).setAuthor({
																	name: preview.embeds[0].author?.name
																		? preview.embeds[0].author?.name
																		: '',
																	iconURL: preview.embeds[0].author?.iconURL
																		? preview.embeds[0].author?.iconURL
																		: '',
																	url: m.content || ''
																})
															]
														})
														.catch(() => {});
												}
											});
										}
									}
								);
							} else if (select.values[0] === 'setMessage') {
								select.reply({
									content:
										'Tell me the text you want for message outside the embed',
									ephemeral: true
								});

								const messageCollect = select.channel.createMessageCollector({
									filter: messageFilter,
									time: ms('30s'),
									max: 1
								});

								messageCollect.on('collect', async (m: Message) => {
									messageCollect.stop();
									m.delete().catch(() => {});

									preview
										.edit({ content: m.content, embeds: [preview.embeds[0]] })
										.catch(() => {});
								});
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
										'';
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
													m.content || m.attachments.first()?.url || ''
												)
											]
										})
										.catch(() => {});
								});
							} else if (select.values[0] === 'setColor') {
								select.reply({
									content: 'Tell me the color you need for embed',
									ephemeral: true
								});

								const messageCollect = select.channel.createMessageCollector({
									filter: messageFilter,
									time: ms('30s')
								});

								messageCollect.on('collect', async (m: Message) => {
									if (/^#[0-9A-F]{6}$/i.test(m.content)) {
										m.delete().catch(() => {});
										messageCollect.stop();
										preview
											.edit({
												content: preview.content,
												embeds: [
													EmbedBuilder.from(preview.embeds[0]).setColor(
														toRgb(m.content)
													)
												]
											})
											.catch(() => {
												select.followUp({
													content: 'Please provide me a valid hex code',
													ephemeral: true
												});
											});
									} else {
										await select.followUp({
											content: 'Please provide me a valid hex code',
											ephemeral: true
										});
									}
								});
							} else if (select.values[0] === 'setURL') {
								select.reply({
									content:
										'Tell me what URL you want for embed title (hyperlink for embed title)',
									ephemeral: true
								});

								const messageCollect = select.channel.createMessageCollector({
									filter: messageFilter,
									time: ms('30s'),
									max: 1
								});

								messageCollect.on('collect', async (m: Message) => {
									if (!m.content.startsWith('http')) {
										m.delete().catch(() => {});
										select.editReply(
											'A URL should start with http protocol. Please give a valid URL.'
										);
										return;
									} else {
										m.delete().catch(() => {});
										messageCollect.stop();
										preview
											.edit({
												content: preview.content,
												embeds: [
													EmbedBuilder.from(preview.embeds[0]).setURL(m.content)
												]
											})
											.catch(() => {});
									}
								});
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
										'';
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
								select.reply({
									content: 'Tell me what text you want for embed title',
									ephemeral: true
								});

								const messageCollect = select.channel.createMessageCollector({
									filter: messageFilter,
									time: ms('30s'),
									max: 1
								});

								messageCollect.on('collect', async (m: Message) => {
									m.delete().catch(() => {});
									messageCollect.stop();

									preview
										.edit({
											content: preview.content,
											embeds: [
												EmbedBuilder.from(preview.embeds[0]).setTitle(m.content)
											]
										})
										.catch(() => {});
								});
							} else if (select.values[0] === 'setDescription') {
								select.reply({
									content:
										'Tell me what text you need for the embed description',
									ephemeral: true
								});

								const messageCollect = select.channel.createMessageCollector({
									filter: messageFilter,
									time: ms('30s'),
									max: 1
								});

								messageCollect.on('collect', async (m: Message) => {
									m.delete().catch(() => {});
									messageCollect.stop();
									preview
										.edit({
											content: preview.content,
											embeds: [
												EmbedBuilder.from(preview.embeds[0]).setDescription(
													m.content
												)
											]
										})
										.catch(() => {});
								});
							} else if (select.values[0] === 'setFooter') {
								const footerSelect = new StringSelectMenuBuilder()
									.setMaxValues(1)
									.setCustomId('footer-select')
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
										idle: ms('1m')
									});

								menuCollector.on(
									'collect',
									async (menu: StringSelectMenuInteraction) => {
										if (menu.customId !== 'footer-select') return;

										if (menu.values[0] === 'footer-name') {
											menu.reply({
												content: 'Send me an Footer name',
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
												menuCollector.stop();
												m.delete().catch(() => {});

												preview
													.edit({
														content: preview.content,
														embeds: [
															EmbedBuilder.from(preview.embeds[0]).setFooter({
																text: m.content,
																iconURL: preview.embeds[0].footer?.iconURL
																	? preview.embeds[0].footer?.iconURL
																	: ''
															})
														]
													})
													.catch(() => {});
											});
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
													'';
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
																text: preview.embeds[0].footer?.text || '',
																iconURL:
																	m.content || m.attachments.first()?.url || ''
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
