import {
	TextChannel,
	Role,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
	Message
} from 'discord.js';

import { ExtendedInteraction } from './typedef';

import { toButtonStyle } from './misc';

import { SimplyError } from './error';
import { CustomizableButton } from './typedef/CustomizableButton';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/systems/betterBtnRole#buttons
 */

export type BetterBtnRoleButtons = {
	role?: Role;
} & CustomizableButton;

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/systems/betterBtnRole#messagecontents
 */

export interface MessageContents {
	invalidMessage?: string;
	otherUserMessage?: string;
	update?: string;
	success?: string;
	overload?: string;
	noButton?: string;
}

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/systems/betterBtnRole#betterbtnoptions
 */

export type betterbtnOptions = {
	strict?: boolean;
	type?: 'Add' | 'Remove';
	channel?: TextChannel;
	button?: BetterBtnRoleButtons;
	messageId?: string;
	contents?: MessageContents;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A **Button Role builder** that lets **admins create** button roles. | *Requires: [**manageBtnRole()**](https://simplyd.js.org/docs/handler/manageBtnRole)*
 * @param interaction
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/systems/betterBtnRole
 * @example simplydjs.betterBtnRole(client, interaction)
 */

export async function betterBtnRole(
	interaction: ExtendedInteraction,
	options: betterbtnOptions = { strict: false }
): Promise<void> {
	return new Promise(async () => {
		const { client } = interaction;

		if (!interaction.deferred)
			await interaction.deferReply({ fetchReply: true });

		// Get all options from CommandInteraction (a.k.a.) slash command.
		const ch =
			options?.channel || interaction.options.get('channel', true)?.channel;
		const msgid: string =
			options?.messageId || String(interaction.options.get('message')?.value);
		const role = options?.button?.role || interaction.options.get('role')?.role;

		// Fetch the message using the provided message id
		const msg: Message = await (ch as TextChannel).messages
			.fetch(msgid)
			.catch(() => {})
			.then();

		// If there is no message throw error (if strict)
		if (!msg) {
			if (options?.strict === true)
				throw new SimplyError({
					title:
						'Cannot find any messages with that message id in the channel you specified',
					tip: 'Please check if the provided channel and messageId is correct',
					function: 'betterBtnRole'
				});
			else
				return interaction.followUp({
					content:
						options?.contents?.invalidMessage ||
						'Cannot find any messages with that message id in the channel you specified',
					ephemeral: true
				});
		}

		// If condition to check if the message is sent by the bot
		if (msg.author.id !== client.user.id) {
			if (options?.strict === true)
				throw new SimplyError({
					title: "Cannot make other user's message a button role",
					tip: 'Provide a message which I sent.',
					function: 'betterBtnRole'
				});
			else
				return interaction.followUp({
					content:
						options?.contents?.otherUserMessage ||
						"Cannot make other user's message a button role ! Provide a message which I sent.",
					ephemeral: true
				});
		}

		// The "Add" type
		if (options?.type === 'Add') {
			try {
				// Get all button properties from CommandInteraction (a.k.a) slash command
				const label =
					options?.button?.label ||
					String(interaction.options.get('label')?.value) ||
					role.name;
				let color =
					options?.button?.style ||
					String(interaction.options.get('style')?.value) ||
					ButtonStyle.Secondary;
				const emoji =
					options?.button?.emoji ||
					(interaction.options.get('emoji')?.value as string);

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

								return interaction.followUp({
									content:
										options?.contents?.update ||
										'Found a button with same role. Updating the existing button role.',
									ephemeral: true
								});
							}
						}
					}
				}

				if (color as string) color = toButtonStyle(color as string);

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

							interaction.followUp({
								content:
									options?.contents?.success ||
									'Done.. Added the button to the message.',
								components: [linkRow],
								ephemeral: true
							});
						})
						.catch((err) => {
							interaction.followUp({ content: `\`${err.stack}\`` });
						});
				} else {
					if (msg.components.length === 5) {
						return interaction.followUp({
							content:
								options?.contents?.overload ||
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
								interaction.followUp({
									content:
										options?.contents?.update ||
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

								return interaction.followUp({
									content:
										options?.contents?.success ||
										'Done.. Added the button to the message',
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
				if (options?.strict)
					throw new SimplyError({
						function: 'betterBtnRole (Add)',
						title: 'An Error occured when running the function ',
						tip: err.stack
					});
				else
					console.log(
						`SimplyError - betterBtnRole (Add) | Error: ${err.stack}`
					);
			}
		} else if (options?.type === 'Remove') {
			try {
				if (
					!msg.components ||
					msg.components.length === 0 ||
					!msg.components[0]
				) {
					return interaction.followUp({
						content:
							options?.contents?.noButton ||
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

											return interaction.followUp({
												content:
													options?.contents?.success ||
													'Done.. Removed the button from the message',
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

											return interaction.followUp({
												content:
													options?.contents?.success ||
													'Done.. Removed the button from the message.',
												components: [linkRow],
												ephemeral: true
											});
										});
								}
							} else if (i === msg.components.length - 1) {
								if (o === msg.components[i].components.length - 1) {
									return interaction.followUp({
										content:
											options?.contents?.noButton ||
											'I cant identify a button role with that role in that message.',
										ephemeral: true
									});
								}
							}
						}
					}
				}
			} catch (err: any) {
				if (options?.strict)
					throw new SimplyError({
						function: 'betterBtnRole (Remove)',
						title: 'An Error occured when running the function ',
						tip: err.stack
					});
				else
					console.log(
						`SimplyError - betterBtnRole (Remove) | Error: ${err.stack}`
					);
			}
		} else {
			if (options?.strict === true)
				throw new SimplyError({
					title: 'Provide a valid type',
					tip: `We recognised that you are not using the correct type option.\nReceived: ${options?.type}. Expected: "Add"/"Remove"`,
					function: 'betterBtnRole'
				});
			else
				return console.log(
					`SimplyError - betterBtnRole (Add) | Error: Provide a valid type\n\nWe recognised that you are not using the correct type option.\nReceived: ${options?.type}. Expected: "Add"/"Remove"`
				);
		}
	});
}
