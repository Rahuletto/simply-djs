import {
	ButtonStyle,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	Message,
	InteractionResponse,
	ComponentType,
	ButtonInteraction,
	CommandInteraction
} from 'discord.js';
import {
	ExtendedInteraction,
	ExtendedMessage,
	CustomizableButton
} from './typedef';

import { SimplyError } from './error';
import { toButtonStyle, ms } from './misc';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/general/buttonPages#pagebuttons
 */

export interface Pagebuttons {
	first?: CustomizableButton;
	next?: CustomizableButton;
	back?: CustomizableButton;
	last?: CustomizableButton;
	delete?: CustomizableButton;
}

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/general/buttonPages#pagesoptions
 */

export type pagesOptions = {
	buttons?: Pagebuttons;

	skips?: boolean;
	delete?: boolean;
	dynamic?: boolean;
	count?: boolean;

	rows?: ActionRowBuilder<ButtonBuilder>[];
	embeds?: EmbedBuilder[];
	timeout?: number;

	disable?: 'Label' | 'Emoji' | 'None';
	strict?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * An *powerful yet customizable* **Embed Paginator**
 *
 * @param msgOrInt
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/general/buttonPages
 * @example simplydjs.buttonPages(interaction, [embed1, embed2] )
 */

export async function buttonPages(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: pagesOptions = { strict: false }
): Promise<void> {
	return new Promise(async () => {
		try {
			options.skips ??= true;
			options.delete ??= true;
			options.dynamic ??= false;
			options.count ??= false;
			options.disable ||= 'Label';

			if (!options.embeds)
				if (options.strict)
					throw new SimplyError({
						function: 'buttonPages',
						title: 'Provide an array for the pages option',
						tip: `Expected an array of MessageEmbed. Received ${
							options.embeds || 'undefined'
						}`
					});
				else
					console.log(
						`SimplyError - buttonPages | Error:  Provide an array for the pages option. Expected an array of MessageEmbed. Received ${
							options.embeds || 'undefined'
						}`
					);

			let comps: ActionRowBuilder<ButtonBuilder>[];

			if (options?.rows) {
				if (!Array.isArray(options.rows)) {
					if (options?.strict)
						throw new SimplyError({
							function: 'buttonPages',
							title: `Provide an array for the rows`,
							tip: `Expected an array of MessageActionRows. Received ${
								options?.rows || 'undefined'
							}`
						});
					else
						console.log(
							`SimplyError - buttonPages | Provide an array for the rows\n\n` +
								`Expected an array of MessageActionRows. Received ${
									options?.rows || 'undefined'
								}`
						);
				}

				comps = options?.rows;
			} else {
				comps = [];
			}

			options.buttons = {
				first: {
					style: options?.buttons?.first?.style || ButtonStyle.Primary,
					emoji: options?.buttons?.first?.emoji || '⏪',
					label: options?.buttons?.first?.label || 'First'
				},
				next: {
					style: options?.buttons?.next?.style || ButtonStyle.Success,
					emoji: options?.buttons?.next?.emoji || '▶️',
					label: options?.buttons?.next?.label || 'Next'
				},
				back: {
					style: options?.buttons?.back?.style || ButtonStyle.Success,
					emoji: options?.buttons?.back?.emoji || '◀️',
					label: options?.buttons?.back?.label || 'Back'
				},
				last: {
					style: options?.buttons?.last?.style || ButtonStyle.Primary,
					emoji: options?.buttons?.last?.emoji || '⏩',
					label: options?.buttons?.last?.label || 'Last'
				},

				delete: {
					style: options?.buttons?.delete?.style || ButtonStyle.Danger,
					emoji: options?.buttons?.delete?.emoji || '🗑',
					label: options?.buttons?.delete?.label || 'Delete'
				}
			};

			if (options?.buttons?.first?.style as string)
				options.buttons.first.style = toButtonStyle(
					options?.buttons?.first?.style as string
				);

			if (options?.buttons?.next?.style as string)
				options.buttons.next.style = toButtonStyle(
					options.buttons?.next?.style as string
				);

			if (options?.buttons?.back?.style as string)
				options.buttons.back.style = toButtonStyle(
					options?.buttons?.back?.style as string
				);

			if (options?.buttons?.last?.style as string)
				options.buttons.last.style = toButtonStyle(
					options?.buttons?.last?.style as string
				);

			if (options?.buttons?.delete?.style as string)
				options.buttons.delete.style = toButtonStyle(
					options?.buttons?.delete?.style as string
				);

			//Defining all buttons
			const first = new ButtonBuilder()
				.setCustomId('first_embed')

				.setStyle(options?.buttons?.first?.style as ButtonStyle);

			if (options?.disable === 'Label' || options?.disable === 'None')
				first.setEmoji(options?.buttons?.first?.emoji);
			else if (options?.disable === 'Emoji' || options?.disable === 'None')
				first.setLabel(options?.buttons?.first?.label);

			const forward = new ButtonBuilder()
				.setCustomId('forward_button_embed')
				.setStyle(options?.buttons?.next?.style as ButtonStyle);

			if (options?.disable === 'Label' || options?.disable === 'None')
				forward.setEmoji(options.buttons?.next?.emoji);
			else if (options?.disable === 'Emoji' || options?.disable === 'None')
				forward.setLabel(options.buttons?.next?.label);

			const back = new ButtonBuilder()
				.setCustomId('back_button_embed')
				.setStyle(options.buttons?.back?.style as ButtonStyle);

			if (options?.disable === 'Label' || options?.disable === 'None')
				back.setEmoji(options.buttons?.back?.emoji);
			else if (options?.disable === 'Emoji' || options?.disable === 'None')
				back.setLabel(options.buttons?.back?.label);

			if (options?.dynamic) {
				first.setDisabled(true);
				back.setDisabled(true);
			}

			const last = new ButtonBuilder()
				.setCustomId('last_embed')
				.setStyle(options?.buttons?.last?.style as ButtonStyle);

			if (options?.disable === 'Label' || options?.disable === 'None')
				last.setEmoji(options?.buttons?.last?.emoji);
			else if (options?.disable === 'Emoji' || options?.disable === 'None')
				last.setLabel(options?.buttons?.last?.label);

			const deleteButton = new ButtonBuilder()
				.setCustomId('delete_embed')
				.setStyle(options.buttons?.delete?.style as ButtonStyle);

			if (options?.disable === 'Label' || options?.disable === 'None')
				deleteButton.setEmoji(options.buttons?.delete?.emoji);
			else if (options?.disable === 'Emoji' || options?.disable === 'None')
				deleteButton.setLabel(options.buttons?.delete?.label);

			let btnCollection: ButtonBuilder[] = [];
			//Creating the MessageActionRow
			let pageMovingButtons = new ActionRowBuilder<ButtonBuilder>();
			if (options?.skips == true) {
				if (options?.delete) {
					btnCollection = [first, back, deleteButton, forward, last];
				} else {
					btnCollection = [first, back, forward, last];
				}
			} else {
				if (options?.delete) {
					btnCollection = [back, deleteButton, forward];
				} else {
					btnCollection = [back, forward];
				}
			}

			pageMovingButtons.addComponents(btnCollection);

			let currentPage = 0;

			comps.push(pageMovingButtons);

			let interaction: CommandInteraction;

			if (msgOrInt.commandId) {
				interaction = msgOrInt as CommandInteraction;
			}

			let m: Message | InteractionResponse;
			const pages = options?.embeds;

			const extInteraction = msgOrInt as ExtendedInteraction;
			const extMessage = msgOrInt as ExtendedMessage;

			if (interaction) {
				if (options?.count) {
					await extInteraction.followUp({
						embeds: [pages[0].setFooter({ text: `Page 1/${pages.length}` })],
						components: comps,
						allowedMentions: { repliedUser: false },
						fetchReply: true
					});
				} else {
					await extInteraction.followUp({
						embeds: [pages[0]],
						components: comps,
						allowedMentions: { repliedUser: false },
						fetchReply: true
					});
				}
				m = await extInteraction.fetchReply();
			} else if (!interaction) {
				if (options?.count) {
					m = await extMessage.reply({
						embeds: [pages[0].setFooter({ text: `Page 1/${pages.length}` })],
						components: comps,
						allowedMentions: { repliedUser: false }
					});
				} else {
					m = await extMessage.reply({
						embeds: [pages[0]],
						components: comps,
						allowedMentions: { repliedUser: false }
					});
				}
			}

			const filter = (m: ButtonInteraction) =>
				m.user.id === (msgOrInt.user ? msgOrInt.user : msgOrInt.author).id;

			const collector = m.createMessageComponentCollector({
				time: options?.timeout || ms('2m'),
				filter: filter,
				componentType: ComponentType.Button
			});

			collector.on('collect', async (b: ButtonInteraction) => {
				if (!b.isButton()) return;
				if (b.message.id !== m.id) return;

				await b.deferUpdate();

				if (b.customId == 'back_button_embed') {
					if (currentPage - 1 < 0) currentPage = pages.length - 1;
					else currentPage -= 1;
				} else if (b.customId == 'forward_button_embed') {
					if (currentPage + 1 == pages.length) currentPage = 0;
					else currentPage += 1;
				} else if (b.customId == 'last_embed') {
					currentPage = pages.length - 1;
				} else if (b.customId == 'first_embed') {
					currentPage = 0;
				}

				if (options?.dynamic) {
					if (currentPage === 0) {
						const btn = comps[0].components[0];
						btn.setDisabled(true);
						if (options?.skips) {
							const skip = comps[0].components[1];
							skip.setDisabled(true);
							comps[0].components[1] = skip;
						}

						comps[0].components[0] = btn;
					} else {
						const btn = comps[0].components[0];
						btn.setDisabled(false);
						if (options?.skips) {
							const skip = comps[0].components[1];
							skip.setDisabled(false);
							comps[0].components[1] = skip;
						}
						comps[0].components[0] = btn;
					}
					if (currentPage === pages.length - 1) {
						if (options?.skips) {
							const bt = comps[0].components[3];
							const inde = comps[0].components[4];

							inde.setDisabled(true);
							bt.setDisabled(true);

							comps[0].components[3] = bt;
							comps[0].components[4] = inde;
						} else {
							const bt = comps[0].components[2];

							bt.setDisabled(true);

							comps[0].components[2] = bt;
						}
					} else {
						if (options?.skips) {
							const bt = comps[0].components[3];
							const inde = comps[0].components[4];

							inde.setDisabled(false);
							bt.setDisabled(false);

							comps[0].components[3] = bt;
							comps[0].components[4] = inde;
						} else {
							const bt = comps[0].components[2];

							bt.setDisabled(false);

							comps[0].components[2] = bt;
						}
					}
				}

				if (b.customId !== 'delete_embed') {
					if (options?.count) {
						m.edit({
							embeds: [
								pages[currentPage].setFooter({
									text: `Page: ${currentPage + 1}/${pages.length}`
								})
							],
							components: comps,
							allowedMentions: { repliedUser: false }
						});
					} else {
						m.edit({
							embeds: [pages[currentPage]],
							components: comps,
							allowedMentions: { repliedUser: false }
						});
					}
				} else if (b.customId === 'delete_embed') {
					collector.stop('del');
				}
			});

			collector.on('end', async (_collected, reason: string) => {
				if (reason === 'del') {
					await m.delete().catch(() => {});
				} else {
					const disable: ButtonBuilder[] = [];

					btnCollection.forEach((a) => {
						disable.push(a.setDisabled(true));
					});

					pageMovingButtons =
						new ActionRowBuilder<ButtonBuilder>().addComponents(disable);

					m.edit({ components: [pageMovingButtons] });
				}
			});
		} catch (err: any) {
			if (options?.strict)
				throw new SimplyError({
					function: 'buttonPages',
					title: 'An Error occured when running the function ',
					tip: err.stack
				});
			else console.log(`SimplyError - buttonPages | Error: ${err.stack}`);
		}
	});
}
