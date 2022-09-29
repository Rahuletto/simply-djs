import {
	Client,
	ButtonStyle,
	TextChannel,
	Role,
	ButtonBuilder,
	ActionRowBuilder,
	Message
} from 'discord.js';

import chalk from 'chalk';
import { ExtendedInteraction } from './interfaces';

import { LegacyStyles, styleObj } from './interfaces';
import { convStyle } from './Others/convStyle';

/*
Error Codes

- NO_BTN
- NO_MSG
- OVERLOAD
- NOT_FOUND
- OTHER_MSG
*/

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

export type betterbtnOptions = {
	custom: true | false;

	type?: 'add' | 'remove';

	channel?: TextChannel;

	label?: string;
	messageId?: string;
	role?: Role;
	style?: ButtonStyle;
	emoji?: string;
};

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

export async function betterBtnRole(
	client: Client,
	interaction: ExtendedInteraction,
	options: betterbtnOptions = { custom: false }
): Promise<string> {
	return new Promise(async (resolve, reject) => {
		const ch = options.channel || interaction.options.get('channel', true);
		const msgid = options.messageId || interaction.options.get('message', true);
		let role = options.role || interaction.options.get('role', true);

		role = role as Role;

		const msg: Message = await (ch as TextChannel).messages
			.fetch({ message: msgid as string })
			.catch((e) => {})
			.then();

		if (!msg) {
			if (options.custom === true) reject('NO_MSG');
			else
				return interaction.followUp({
					content:
						'Cannot find any messages with that message id in the channel you specified',
					ephemeral: true
				});
		}

		if (msg.author.id !== client.user.id) {
			if (options.custom === true) reject('OTHER_MSG');
			else
				return interaction.followUp({
					content:
						"Cannot make other user's message a button role ! Provide a message which I sent.",
					ephemeral: true
				});
		}

		if (options.type === 'add') {
			try {
				const label =
					options.label || interaction.options.get('label') || role.name;
				const color = (options.style ||
					interaction.options.get('style') ||
					'SECONDARY') as LegacyStyles | ButtonStyle;
				const emoji = options.emoji || interaction.options.get('emoji');

				let st = convStyle(color);

				if (msg.components) {
					for (let i = 0; msg.components.length > i; i++) {
						for (let o = 0; msg.components[i].components.length > o; o++) {
							if (
								msg.components[i].components[o].customId ===
								'role-' + role.id
							) {
								msg.components[i].components.splice(o, 1);
								msg.edit({
									content: msg.content || '\u200b',
									embeds: msg.embeds,
									components: msg.components
								});

								if (options.custom === true) return resolve('DONE');
								else
									return interaction.followUp({
										content:
											'The message has the button with the same role already.. Re-adding it now..',
										ephemeral: true
									});
							}
						}
					}
				}

				if (
					!msg.components ||
					msg.components.length === 0 ||
					msg.components === []
				) {
					if (!emoji || emoji === null) {
						const btn = new ButtonBuilder()
							.setLabel(label as string)
							.setStyle(st)
							.setCustomId('role-' + role.id);

						const rowe = new ActionRowBuilder<ButtonBuilder>().addComponents([
							btn
						]);

						await msg
							.edit({
								content: msg.content || '\u200b',
								embeds: msg.embeds,
								components: [rowe]
							})
							.then(async (m) => {
								const link = new ButtonBuilder()
									.setLabel('View Message')
									.setStyle(styleObj['LINK'])
									.setURL(m.url);

								const rowew =
									new ActionRowBuilder<ButtonBuilder>().addComponents([link]);

								if (options.custom === true) return resolve('DONE');
								else
									await interaction.followUp({
										content: 'Done.. Editing the message with the button...',
										components: [rowew],
										ephemeral: true
									});
							})
							.catch((err) => {
								interaction.followUp({ content: `\`${err.stack}\`` });
							});
					} else if (emoji && emoji !== null) {
						const btn = new ButtonBuilder()
							.setLabel(label as string)
							.setStyle(color as ButtonStyle)
							.setCustomId('role-' + role.id)
							.setEmoji(emoji);

						const rowe = new ActionRowBuilder<ButtonBuilder>().addComponents([
							btn
						]);

						await msg
							.edit({
								content: msg.content || '\u200b',
								embeds: msg.embeds,
								components: [rowe]
							})
							.then((m) => {
								const link = new ButtonBuilder()
									.setLabel('View Message')
									.setStyle(styleObj['LINK'])
									.setURL(m.url);

								const rowew =
									new ActionRowBuilder<ButtonBuilder>().addComponents([link]);

								if (options.custom === true) return resolve('DONE');
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
				} else {
					if (msg.components.length === 5) {
						if (options.custom === true) return reject('OVERLOAD');
						else
							return interaction.followUp({
								content:
									'Sorry.. I have no space to send buttons in that message..'
							});
					}

					const rowgap = msg.components[msg.components.length - 1];

					const rowy = ActionRowBuilder.from(rowgap);

					if (rowgap.components.length < 5) {
						if (!emoji || emoji === null) {
							const btn = new ButtonBuilder()
								.setLabel(label as string)
								.setStyle(color as ButtonStyle)
								.setCustomId('role-' + role.id);

							rowy.addComponents([btn]);

							await msg
								.edit({
									content: msg.content || '\u200b',
									embeds: msg.embeds,
									components: [rowy as ActionRowBuilder<ButtonBuilder>]
								})
								.then(async (m) => {
									const link = new ButtonBuilder()
										.setLabel('View Message')
										.setStyle(styleObj['LINK'])
										.setURL(m.url);

									const rowew =
										new ActionRowBuilder<ButtonBuilder>().addComponents([link]);

									if (options.custom === true) return resolve('DONE');
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
						} else if (emoji && emoji !== null) {
							const btn = new ButtonBuilder()
								.setLabel(label as string)
								.setStyle(color as ButtonStyle)
								.setCustomId('role-' + role.id)
								.setEmoji(emoji);

							rowy.addComponents([btn]);

							await msg
								.edit({
									content: msg.content || '\u200b',
									embeds: msg.embeds,
									components: [rowy as ActionRowBuilder<ButtonBuilder>]
								})
								.then(async (m) => {
									const link = new ButtonBuilder()
										.setLabel('View Message')
										.setStyle(styleObj['LINK'])
										.setURL(m.url);

									const rowew =
										new ActionRowBuilder<ButtonBuilder>().addComponents([link]);

									if (options.custom === true) return resolve('DONE');
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
					} else if (rowy.components.length === 5) {
						if (!emoji || emoji === null) {
							const btn = new ButtonBuilder()
								.setLabel(label as string)
								.setStyle(color as ButtonStyle)
								.setCustomId('role-' + role.id);

							const rowe = new ActionRowBuilder<ButtonBuilder>().addComponents([
								btn
							]);

							await msg
								.edit({
									content: msg.content || '\u200b',
									embeds: msg.embeds,
									components: [...msg.components, rowe]
								})
								.then(async (m) => {
									const link = new ButtonBuilder()
										.setLabel('View Message')
										.setStyle(styleObj['LINK'])
										.setURL(m.url);

									const rowew =
										new ActionRowBuilder<ButtonBuilder>().addComponents([link]);

									if (options.custom === true) return resolve('DONE');
									else
										return interaction.followUp({
											content: 'Done.. Editing the message with the button...',
											components: [rowew],
											ephemeral: true
										});
								})
								.catch((err) => {
									interaction.followUp({ content: `\`${err.stack}\`` });
								});
						} else if (emoji && emoji !== null) {
							const btn = new ButtonBuilder()
								.setLabel(label as string)
								.setStyle(color as ButtonStyle)
								.setCustomId('role-' + role.id)
								.setEmoji(emoji);

							const rowe = new ActionRowBuilder<ButtonBuilder>().addComponents([
								btn
							]);

							msg
								.edit({
									content: msg.content || '\u200b',
									embeds: msg.embeds,
									components: [...msg.components, rowe]
								})
								.then(async (m) => {
									const link = new ButtonBuilder()
										.setLabel('View Message')
										.setStyle(styleObj['LINK'])
										.setURL(m.url);

									const rowew =
										new ActionRowBuilder<ButtonBuilder>().addComponents([link]);

									if (options.custom === true) return resolve('DONE');
									else
										return interaction.followUp({
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
				}
			} catch (err: any) {
				console.log(
					`${chalk.red('Error Occured.')} | ${chalk.magenta(
						'betterBtnRole'
					)} (type: add) | Error: ${err.stack}`
				);
			}
		} else if (options.type === 'remove') {
			try {
				if (
					!msg.components ||
					msg.components.length === 0 ||
					msg.components === []
				) {
					if (options.custom === true) return reject('NO_BTN');
					else
						return interaction.followUp({
							content:
								'There is no button roles in that message.. Try using correct message ID that has button roles',
							ephemeral: true
						});
				} else if (msg.components) {
					for (let i = 0; msg.components.length > i; i++) {
						for (let o = 0; msg.components[i].components.length > o; o++) {
							if (
								msg.components[i].components[o].customId ===
								'role-' + role.id
							) {
								msg.components[i].components.splice(o, 1);

								if (
									!msg.components[0].components ||
									msg.components[0].components.length === 0 ||
									msg.components[0].components === []
								) {
									await msg
										.edit({
											content: msg.content || '\u200b',
											embeds: msg.embeds,
											components: []
										})
										.then(async (m) => {
											const link = new ButtonBuilder()
												.setLabel('View Message')
												.setStyle(styleObj['LINK'])
												.setURL(m.url);

											const rowew =
												new ActionRowBuilder<ButtonBuilder>().addComponents([
													link
												]);

											if (options.custom === true) return resolve('DONE');
											else
												return interaction.followUp({
													content:
														'Done.. Editing the message without the button...',
													components: [rowew],
													ephemeral: true
												});
										});
								} else {
									await msg
										.edit({
											content: msg.content || '\u200b',
											embeds: msg.embeds,
											components: msg.components
										})
										.then(async (m) => {
											const link = new ButtonBuilder()
												.setLabel('View Message')
												.setStyle(styleObj['LINK'])
												.setURL(m.url);

											const rowew =
												new ActionRowBuilder<ButtonBuilder>().addComponents([
													link
												]);

											if (options.custom === true) return resolve('DONE');
											else
												return interaction.followUp({
													content:
														'Done.. Editing the message without the button...',
													components: [rowew],
													ephemeral: true
												});
										});
								}
							} else if (i === msg.components.length - 1) {
								if (o === msg.components[i].components.length - 1) {
									if (options.custom === true) return reject('NOT_FOUND');
									else
										return interaction.followUp({
											content:
												'I cant identify a button role with that role in that message.',
											ephemeral: true
										});
								}
							}
						}
					}
				}
			} catch (err: any) {
				console.log(
					`${chalk.red('Error Occured.')} | ${chalk.magenta(
						'betterBtnRole'
					)} (type: remove) | Error: ${err.stack}`
				);
			}
		}
	});
}
