import {
	Client,
	Message,
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
	CommandInteraction,
	MessageButtonStyle,
	MessageEmbedAuthor,
	MessageEmbedFooter,
	ColorResolvable,
	ButtonInteraction,
	MessageSelectOptionData,
	Permissions
} from 'discord.js';

import chalk from 'chalk';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/CustomizableEmbed*
 */

interface CustomizableEmbed {
	author?: MessageEmbedAuthor;
	title?: string;
	footer?: MessageEmbedFooter;
	description?: string;
	color?: ColorResolvable;

	credit?: boolean;
}

export type embOptions = {
	embed?: CustomizableEmbed;
	rawEmbed?: MessageEmbed;
};

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

export async function embedCreate(
	message: Message | CommandInteraction,
	options: embOptions = {}
): Promise<MessageEmbed | any> {
	return new Promise(async (resolve) => {
		try {
			const done = new MessageButton()
				.setLabel('Finish')
				.setStyle('SUCCESS')
				.setCustomId('setDone');

			const reject = new MessageButton()
				.setLabel('Cancel')
				.setStyle('DANGER')
				.setCustomId('setDelete');

			let menuOp = [
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

			let menuOptions: MessageSelectOptionData[] = [];

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
				let dataopt = {
					label: menuOp[i].name,
					description: menuOp[i].desc,
					value: menuOp[i].value
				};

				menuOptions.push(dataopt);
			}

			let slct = new MessageSelectMenu()
				.setMaxValues(1)
				.setCustomId('embed-creator')
				.setPlaceholder('Embed Creator')
				.addOptions(menuOptions);

			const row = new MessageActionRow().addComponents([done, reject]);

			const row2 = new MessageActionRow().addComponents([slct]);

			const embed = new MessageEmbed()
				.setTitle(options.embed?.title || 'Embed Creator')
				.setDescription(
					options.embed?.description ||
						'Select any ***option*** from the Select Menu in this message to create a custom embed for you.\n\nThis is a completed embed.'
				)
				.setImage(
					'https://media.discordapp.net/attachments/885411032128978955/955066865347076226/unknown.png'
				)
				.setColor(options.embed?.color || '#075FFF')
				.setFooter(
					options.embed?.credit
						? options.embed?.footer
						: {
								text: '©️ Simply Develop. npm i simply-djs',
								iconURL: 'https://i.imgur.com/u8VlLom.png'
						  }
				);

			if (options.embed?.author) {
				embed.setAuthor(options.embed.author);
			}

			let interaction;
			//@ts-ignore
			if (message.commandId) {
				interaction = message;
			}

			let msg: any;

			let int = message as CommandInteraction;
			let ms = message as Message;

			if (interaction) {
				await int.followUp({
					embeds: [options.rawEmbed || embed],
					components: [row2, row]
				});

				msg = await int.fetchReply();
			} else if (!interaction) {
				msg = await ms.reply({
					embeds: [options.rawEmbed || embed],
					components: [row2, row]
				});
			}

			const emb = new MessageEmbed()
				.setFooter(
					options.embed?.credit
						? options.embed?.footer
						: {
								text: 'Preview Embed'
						  }
				)
				.setColor('#2F3136');

			message.channel
				.send({ content: '** **', embeds: [emb] })
				.then(async (preview) => {
					let filter = (
						m: any //@ts-ignore
					) => m.user.id === message.member.user.id;
					let collector = msg.createMessageComponentCollector({
						filter,
						idle: 1000 * 60 * 3
					});

					collector.on('collect', async (button: any) => {
						let fitler = (m: any) =>
							// @ts-ignore
							message.member.user.id === m.author.id;

						let btnfilt = (
							m: any // @ts-ignore
						) => message.member.user.id === m.user.id;

						if (button.customId && button.customId === 'setDelete') {
							button.reply({
								content: 'Cancelling the Creation.',
								ephemeral: true
							});

							preview.delete().catch(() => {});
							msg.delete().catch(() => {});
						} else if (button.customId && button.customId === 'setDone') {
							if (
								// @ts-ignore
								message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
							) {
								button.reply({
									content: 'Provide me the channel to send the embed.',
									ephemeral: true
								});

								let titleclr = button.channel.createMessageCollector({
									fitler,
									time: 30000,
									max: 1
								});

								titleclr.on('collect', async (m: any) => {
									if (m.mentions.channels.first()) {
										let ch = m.mentions.channels.first();
										button.editReply({ content: 'Done 👍', ephemeral: true });

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
								// @ts-ignore
								!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
							) {
								button.reply({ content: 'Done 👍', ephemeral: true });

								message.channel.send({
									content: preview.content,
									embeds: [preview.embeds[0]]
								});
								preview.delete().catch(() => {});
								msg.delete().catch(() => {});

								resolve(preview.embeds[0].toJSON());
							}
						} else if (button.values[0] === 'setTimestamp') {
							let btn = new MessageButton()
								.setLabel('Enable')
								.setCustomId('timestamp-yes')
								.setStyle('SUCCESS');

							let btn2 = new MessageButton()
								.setLabel('Disable')
								.setCustomId('timestamp-no')
								.setStyle('DANGER');

							button.reply({
								content: 'Do you want a Timestamp in the embed ?',
								ephemeral: true,
								components: [new MessageActionRow().addComponents([btn, btn2])]
							});

							let titleclr = button.channel.createMessageComponentCollector({
								btnfilt,
								idle: 60000
							});

							titleclr.on('collect', async (btn: any) => {
								if (btn.customId === 'timestamp-yes') {
									button.editReply({
										components: [],
										content: 'Enabled Timestamp on the embed'
									});

									preview
										.edit({
											content: preview.content,
											embeds: [preview.embeds[0].setTimestamp(new Date())]
										})
										.catch(() => {});
								}

								if (btn.customId === 'timestamp-no') {
									button.editReply({
										components: [],
										content: 'Disabled Timestamp on the embed'
									});

									preview
										.edit({
											content: preview.content,
											embeds: [preview.embeds[0].setTimestamp(null)]
										})
										.catch(() => {});
								}
							});
						} else if (button.values[0] === 'setAuthor') {
							let autsel = new MessageSelectMenu()
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
								components: [new MessageActionRow().addComponents([autsel])]
							});

							let titleclr = button.channel.createMessageComponentCollector({
								btnfilt,
								idle: 60000
							});

							titleclr.on('collect', async (menu: any) => {
								await menu.deferUpdate();
								if (menu.customId !== 'author-selct') return;

								if (menu.values[0] === 'author-name') {
									button.editReply({
										content: 'Send me an Author name',
										ephemeral: true,
										components: []
									});

									let authclr = button.channel.createMessageCollector({
										fitler,
										time: 30000,
										max: 1
									});

									authclr.on('collect', async (m: any) => {
										titleclr.stop();
										m.delete().catch(() => {});

										preview
											.edit({
												content: preview.content,
												embeds: [
													preview.embeds[0].setAuthor({
														name: m.content, // @ts-ignore
														iconURL: preview.embeds[0].author?.iconURL // @ts-ignore
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
									button.editReply({
										content: 'Send me the Author icon (Attachment/Image URL)',
										ephemeral: true,
										components: []
									});

									let authclr = button.channel.createMessageCollector({
										fitler,
										time: 30000,
										max: 1
									});

									authclr.on('collect', async (m: any) => {
										let isthumb =
											m.content.match(
												/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
											) != null ||
											m.attachments.first().url ||
											'';
										if (!isthumb)
											return button.followUp({
												content:
													'This is not a Image URL/Image Attachment. Please provide a valid image.',
												ephemeral: true
											});

										titleclr.stop();
										m.delete().catch(() => {});

										preview
											.edit({
												content: preview.content,
												embeds: [
													preview.embeds[0].setAuthor({
														name: preview.embeds[0].author?.name
															? preview.embeds[0].author?.name
															: '', // @ts-ignore
														iconURL:
															m.content || m.attachments.first().url || '',
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
									button.editReply({
										content: 'Send me a Author HTTPS Url',
										ephemeral: true,
										components: []
									});

									let authclr = button.channel.createMessageCollector({
										fitler,
										time: 30000,
										max: 1
									});

									authclr.on('collect', async (m: any) => {
										if (!m.content.startsWith('http')) {
											m.delete().catch(() => {});
											return button.editReply(
												'A URL should start with http protocol. Please give a valid URL.'
											);
										} else {
											titleclr.stop();
											m.delete().catch(() => {});

											preview
												.edit({
													content: preview.content,
													embeds: [
														preview.embeds[0].setAuthor({
															name: preview.embeds[0].author?.name
																? preview.embeds[0].author?.name
																: '', // @ts-ignore
															iconURL: preview.embeds[0].author?.iconURL // @ts-ignore
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
							});
						} else if (button.values[0] === 'setMessage') {
							button.reply({
								content:
									'Tell me the text you want for message outside the embed',
								ephemeral: true
							});

							let titleclr = button.channel.createMessageCollector({
								fitler,
								time: 30000,
								max: 1
							});

							titleclr.on('collect', async (m: any) => {
								titleclr.stop();
								m.delete().catch(() => {});

								preview
									.edit({ content: m.content, embeds: [preview.embeds[0]] })
									.catch(() => {});
							});
						} else if (button.values[0] === 'setThumbnail') {
							button.reply({
								content:
									'Send me an image for the embed thumbnail (small image at top right)',
								ephemeral: true
							});

							let titleclr = button.channel.createMessageCollector({
								fitler,
								time: 30000,
								max: 1
							});

							titleclr.on('collect', async (m: any) => {
								let isthumb =
									m.content.match(
										/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
									) != null ||
									m.attachments.first().url ||
									'';
								if (!isthumb)
									return button.followUp({
										content:
											'This is not a image url. Please provide a image url or attachment.',
										ephemeral: true
									});

								titleclr.stop();
								m.delete().catch(() => {});

								preview
									.edit({
										content: preview.content,
										embeds: [
											preview.embeds[0].setThumbnail(
												m.content || m.attachments.first().url || ''
											)
										]
									})
									.catch(() => {});
							});
						} else if (button.values[0] === 'setColor') {
							button.reply({
								content: 'Tell me the color you need for embed',
								ephemeral: true
							});

							let titleclr = button.channel.createMessageCollector({
								fitler,
								time: 30000
							});

							titleclr.on('collect', async (m: any) => {
								if (/^#[0-9A-F]{6}$/i.test(m.content)) {
									m.delete().catch(() => {});
									titleclr.stop();
									preview
										.edit({
											content: preview.content,
											embeds: [preview.embeds[0].setColor(m.content)]
										})
										.catch(() => {
											button.followUp({
												content: 'Please provide me a valid hex code',
												ephemeral: true
											});
										});
								} else {
									await button.followUp({
										content: 'Please provide me a valid hex code',
										ephemeral: true
									});
								}
							});
						} else if (button.values[0] === 'setURL') {
							button.reply({
								content:
									'Tell me what URL you want for embed title (hyperlink for embed title)',
								ephemeral: true
							});

							let titleclr = button.channel.createMessageCollector({
								fitler,
								time: 30000,
								max: 1
							});

							titleclr.on('collect', async (m: any) => {
								if (!m.content.startsWith('http')) {
									m.delete().catch(() => {});
									return button.editReply(
										'A URL should start with http protocol. Please give a valid URL.'
									);
								} else {
									m.delete().catch(() => {});
									titleclr.stop();
									preview
										.edit({
											content: preview.content,
											embeds: [preview.embeds[0].setURL(m.content)]
										})
										.catch(() => {});
								}
							});
						} else if (button.values[0] === 'setImage') {
							button.reply({
								content: 'Send me the image you need for embed',
								ephemeral: true
							});

							let titleclr = button.channel.createMessageCollector({
								fitler,
								time: 30000,
								max: 1
							});

							titleclr.on('collect', async (m: any) => {
								let isthumb =
									m.content.match(
										/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
									) != null ||
									m.attachments.first().url ||
									'';
								if (!isthumb)
									return message.reply(
										'That is not a image url/image attachment. Please provide me a image url or attachment.'
									);

								m.delete().catch(() => {});
								titleclr.stop();
								preview
									.edit({
										content: preview.content,
										embeds: [
											preview.embeds[0].setImage(
												m.content || m.attachments.first().url
											)
										]
									})
									.catch(() => {});
							});
						} else if (button.values[0] === 'setTitle') {
							button.reply({
								content: 'Tell me what text you want for embed title',
								ephemeral: true
							});

							let titleclr = button.channel.createMessageCollector({
								fitler,
								time: 30000,
								max: 1
							});

							titleclr.on('collect', async (m: any) => {
								m.delete().catch(() => {});
								titleclr.stop();

								preview
									.edit({
										content: preview.content,
										embeds: [preview.embeds[0].setTitle(m.content)]
									})
									.catch(() => {});
							});
						} else if (button.values[0] === 'setDescription') {
							button.reply({
								content: 'Tell me what text you need for the embed description',
								ephemeral: true
							});

							let titleclr = button.channel.createMessageCollector({
								fitler,
								time: 30000,
								max: 1
							});

							titleclr.on('collect', async (m: any) => {
								m.delete().catch(() => {});
								titleclr.stop();
								preview
									.edit({
										content: preview.content,
										embeds: [preview.embeds[0].setDescription(m.content)]
									})
									.catch(() => {});
							});
						} else if (button.values[0] === 'setFooter') {
							let autsel = new MessageSelectMenu()
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
								components: [new MessageActionRow().addComponents([autsel])]
							});

							let titleclr = button.channel.createMessageComponentCollector({
								btnfilt,
								idle: 60000
							});

							titleclr.on('collect', async (menu: any) => {
								await menu.deferUpdate();
								if (menu.customId !== 'footer-selct') return;

								if (menu.values[0] === 'footer-name') {
									button.editReply({
										content: 'Send me an Footer name',
										ephemeral: true,
										components: []
									});

									let authclr = button.channel.createMessageCollector({
										fitler,
										time: 30000,
										max: 1
									});

									authclr.on('collect', async (m: any) => {
										titleclr.stop();
										m.delete().catch(() => {});

										preview
											.edit({
												content: preview.content,
												embeds: [
													preview.embeds[0].setFooter({
														text: m.content, // @ts-ignore
														iconURL: preview.embeds[0].footer?.iconURL // @ts-ignore
															? preview.embeds[0].footer?.iconURL
															: ''
													})
												]
											})
											.catch(() => {});
									});
								}

								if (menu.values[0] === 'footer-icon') {
									button.editReply({
										content: 'Send me the Footer icon (Attachment/Image URL)',
										ephemeral: true,
										components: []
									});

									let authclr = button.channel.createMessageCollector({
										fitler,
										time: 30000,
										max: 1
									});

									authclr.on('collect', async (m: any) => {
										let isthumb =
											m.content.match(
												/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
											) != null ||
											m.attachments.first().url ||
											'';
										if (!isthumb)
											return button.followUp({
												content:
													'This is not a Image URL/Image Attachment. Please provide a valid image.',
												ephemeral: true
											});

										titleclr.stop();
										m.delete().catch(() => {});

										preview
											.edit({
												content: preview.content,
												embeds: [
													preview.embeds[0].setFooter({
														text: preview.embeds[0].footer?.text || '', // @ts-ignore
														iconURL:
															m.content || m.attachments.first().url || ''
													})
												]
											})
											.catch(() => {});
									});
								}
							});
						}
					});
					collector.on('end', async (collected: any, reason: string) => {
						if (reason === 'time') {
							const content = new MessageButton()
								.setLabel('Timed Out')
								.setStyle('DANGER')
								.setCustomId('timeout|91817623842')
								.setDisabled(true);

							const row = new MessageActionRow().addComponents([content]);

							await msg.edit({ embeds: [msg.embeds[0]], components: [row] });
						}
					});
				});
		} catch (err: any) {
			console.log(
				`${chalk.red('Error Occured.')} | ${chalk.magenta(
					'embedCreate'
				)} | Error: ${err.stack}`
			);
		}
	});
}
