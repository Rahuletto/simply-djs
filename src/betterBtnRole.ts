import {
	Client,
	TextChannel,
	Role,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle
} from 'discord.js';

import { ExtendedInteraction, ExtendedMessage } from './interfaces';
import { MessageButtonStyle } from './Others/MessageButtonStyle';
import { SimplyError } from './Error/Error';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

type button = {
	label?: string;
	role?: Role;
	style?: ButtonStyle | 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK';
	emoji?: string;
};
export type betterbtnOptions = {
	custom?: boolean;
	strict?: boolean;
	type?: 'add' | 'remove';
	channel?: TextChannel;
	button?: button;
	messageId?: string;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A **Button Role builder** that lets **admins create** button roles. | *Requires: [**manageBtn()**](https://simplyd.js.org/docs/handler/manageBtn)*
 * @param interaction
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/betterBtnRole***
 * @example simplydjs.betterBtnRole(client, interaction)
 */

export async function betterBtnRole(
	interaction: ExtendedInteraction,
	options: betterbtnOptions = {}
): Promise<string> {
	return new Promise(async (resolve, reject) => {
		const { client } = interaction;

		const ch =
			options.channel || interaction.options.get('channel', true).channel;
		const msgid: string =
			options.messageId || String(interaction.options.get('message').value);
		const role = options.button.role || interaction.options.get('role').role;

		const msg: ExtendedMessage = await (ch as TextChannel).messages
			.fetch(msgid)
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
					options.button.label ||
					String(interaction.options.get('label').value) ||
					role.name;
				let color =
					options.button.style ||
					String(interaction.options.get('style').value) ||
					'SECONDARY';
				const emoji =
					options.button.emoji ||
					String(interaction.options.get('emoji').value);

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

				if (color as string) color = MessageButtonStyle(color as string);

				const btn = new ButtonBuilder()
					.setLabel(label)
					.setStyle((color as ButtonStyle) || ButtonStyle.Secondary)
					.setCustomId('role-' + role.id);

				if (
					!msg.components ||
					msg.components.length === 0 ||
					!msg.components[0]
				) {
					if (emoji) btn.setEmoji(emoji);

					const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
						btn
					]);

					await msg
						.edit({
							content: msg.content || '\u200b',
							embeds: msg.embeds,
							components: [row]
						})
						.then((m) => {
							const link = new ButtonBuilder()
								.setLabel('View Message')
								.setStyle(ButtonStyle.Link)
								.setURL(m.url);

							const linkRow =
								new ActionRowBuilder<ButtonBuilder>().addComponents([link]);

							if (options.custom === true) return resolve('DONE');
							else
								interaction.followUp({
									content: 'Done.. Added the button to the message.',
									components: [linkRow],
									ephemeral: true
								});
						})
						.catch((err) => {
							interaction.followUp({ content: `\`${err.stack}\`` });
						});
				} else {
					if (msg.components.length === 5) {
						if (options.custom === true) return reject('OVERLOAD');
						else
							return interaction.followUp({
								content:
									'Sorry.. I have no space to send buttons in that message..'
							});
					}

					// Get the available space in the message
					const avSpace = ActionRowBuilder.from(
						msg.components[msg.components.length - 1]
					);
					if (avSpace.components.length < 5) {
						if (emoji) btn.setEmoji(emoji);

						avSpace.addComponents(btn);

						await msg
							.edit({
								content: msg.content || '\u200b',
								embeds: msg.embeds,
								components: [avSpace as ActionRowBuilder<ButtonBuilder>]
							})
							.then(async (m) => {
								const link = new ButtonBuilder()
									.setLabel('View Message')
									.setStyle(ButtonStyle.Link)
									.setURL(m.url);

								const linkRow =
									new ActionRowBuilder<ButtonBuilder>().addComponents([link]);

								if (options.custom === true) return resolve('DONE');
								else
									interaction.followUp({
										content:
											'Found a button with same role. Updating the existing button role.',
										components: [linkRow],
										ephemeral: true
									});
							})
							.catch((err) => {
								interaction.followUp({ content: `\`${err.stack}\`` });
							});
					} else if (avSpace.components.length === 5) {
						const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
							btn
						]);

						await msg
							.edit({
								content: msg.content || '\u200b',
								embeds: msg.embeds,
								components: [avSpace as ActionRowBuilder<ButtonBuilder>, row]
							})
							.then(async (m) => {
								const link = new ButtonBuilder()
									.setLabel('View Message')
									.setStyle(ButtonStyle.Link)
									.setURL(m.url);

								const linkRow =
									new ActionRowBuilder<ButtonBuilder>().addComponents([link]);

								if (options.custom === true) return resolve('DONE');
								else
									return interaction.followUp({
										content: 'Done.. Added the button to the message',
										components: [linkRow],
										ephemeral: true
									});
							})
							.catch((err) => {
								interaction.followUp({ content: `\`${err.stack}\`` });
							});
					}
				}
			} catch (err: any) {
				if (options.strict)
					throw new SimplyError({
						function: 'betterBtnRole (add)',
						title: 'An Error occured when running the function ',
						tip: err.stack
					});
				else
					console.log(
						`SimplyError - betterBtnRole (add) | Error: ${err.stack}`
					);
			}
		} else if (options.type === 'remove') {
			try {
				if (
					!msg.components ||
					msg.components.length === 0 ||
					!msg.components[0]
				) {
					if (options.custom === true) return reject('NO_BTN');
					else
						return interaction.followUp({
							content:
								'There is no button role in that message.. Try using correct message ID that has button roles',
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
									!msg.components[0].components[0]
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
												.setStyle(ButtonStyle.Link)
												.setURL(m.url);

											const linkRow =
												new ActionRowBuilder<ButtonBuilder>().addComponents([
													link
												]);

											if (options.custom === true) return resolve('DONE');
											else
												return interaction.followUp({
													content: 'Done.. Removed the button from the message',
													components: [linkRow],
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
												.setStyle(ButtonStyle.Link)
												.setURL(m.url);

											const linkRow =
												new ActionRowBuilder<ButtonBuilder>().addComponents([
													link
												]);

											if (options.custom === true) return resolve('DONE');
											else
												return interaction.followUp({
													content:
														'Done.. Removed the button from the message.',
													components: [linkRow],
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
				if (options.strict)
					throw new SimplyError({
						function: 'betterBtnRole (remove)',
						title: 'An Error occured when running the function ',
						tip: err.stack
					});
				else
					console.log(
						`SimplyError - betterBtnRole (remove) | Error: ${err.stack}`
					);
			}
		}
	});
}
