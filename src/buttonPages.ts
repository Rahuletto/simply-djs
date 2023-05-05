import {
	ButtonStyle,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	Message,
	InteractionResponse,
	ComponentType,
	ButtonInteraction
} from 'discord.js';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';

import { SimplyError } from './Error/Error';
import { off } from 'process';
import { MessageButtonStyle } from './Others/MessageButtonStyle';
import { ms } from './Others/ms';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/btnTemplate*
 */

interface btnTemplate {
	style?: ButtonStyle | 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK';
	label?: string;
	emoji?: string;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/General/embedPages#pagebuttons*
 */

interface Pagebuttons {
	firstBtn?: btnTemplate;
	nextBtn?: btnTemplate;
	backBtn?: btnTemplate;
	lastBtn?: btnTemplate;
	deleteBtn?: btnTemplate;
}

export type pagesOption = {
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
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/buttonPages***
 * @example simplydjs.buttonPages(message, [embed1, embed2] )
 */

export async function buttonPages(
	message: ExtendedMessage | ExtendedInteraction,
	options: pagesOption = {}
): Promise<any> {
	try {
		options.skips ??= true;
		options.delete ??= true;
		options.dynamic ??= false;
		options.count ??= false;
		options.disable ||= 'Label';

		if (!options.embeds) {
			throw new SimplyError({
				function: 'buttonPages',
				title: 'NOT_SPECIFIED | Provide an array for the pages option',
				tip: `Expected an array of MessageEmbed. Received ${
					options.embeds || 'undefined'
				}`
			});
		}

		let comps: ActionRowBuilder<ButtonBuilder>[];

		if (options.rows) {
			if (!Array.isArray(options.rows)) {
				if (options.strict)
					throw new SimplyError({
						function: 'buttonPages',
						title: `Provide an array for the rows`,
						tip: `Expected an array of MessageActionRows. Received ${
							options.rows || 'undefined'
						}`
					});
				else
					console.log(
						`SimplyError - buttonPages | Provide an array for the rows\n\n` +
							`Expected an array of MessageActionRows. Received ${
								options.rows || 'undefined'
							}`
					);
			}

			comps = options.rows;
		} else {
			comps = [];
		}

		options.buttons = {
			firstBtn: {
				style: options.buttons?.firstBtn?.style || ButtonStyle.Primary,
				emoji: options.buttons?.firstBtn?.emoji || '⏪',
				label: options.buttons?.firstBtn?.label || 'First'
			},
			nextBtn: {
				style: options.buttons?.nextBtn?.style || ButtonStyle.Success,
				emoji: options.buttons?.nextBtn?.emoji || '▶️',
				label: options.buttons?.nextBtn?.label || 'Next'
			},
			backBtn: {
				style: options.buttons?.backBtn?.style || ButtonStyle.Success,
				emoji: options.buttons?.backBtn?.emoji || '◀️',
				label: options.buttons?.backBtn?.label || 'Back'
			},
			lastBtn: {
				style: options.buttons?.lastBtn?.style || ButtonStyle.Primary,
				emoji: options.buttons?.lastBtn?.emoji || '⏩',
				label: options.buttons?.lastBtn?.label || 'Last'
			},

			deleteBtn: {
				style: options.buttons?.deleteBtn?.style || ButtonStyle.Danger,
				emoji: options.buttons?.deleteBtn?.emoji || '🗑',
				label: options.buttons?.deleteBtn?.label || 'Delete'
			}
		};

		if (options.buttons?.firstBtn?.style as string)
			options.buttons.firstBtn.style = MessageButtonStyle(
				options.buttons?.firstBtn?.style as string
			);

		if (options.buttons?.nextBtn?.style as string)
			options.buttons.nextBtn.style = MessageButtonStyle(
				options.buttons?.nextBtn?.style as string
			);

		if (options.buttons?.backBtn?.style as string)
			options.buttons.backBtn.style = MessageButtonStyle(
				options.buttons?.backBtn?.style as string
			);

		if (options.buttons?.lastBtn?.style as string)
			options.buttons.lastBtn.style = MessageButtonStyle(
				options.buttons?.lastBtn?.style as string
			);

		if (options.buttons?.deleteBtn?.style as string)
			options.buttons.deleteBtn.style = MessageButtonStyle(
				options.buttons?.deleteBtn?.style as string
			);

		//Defining all buttons
		const firstBtn = new ButtonBuilder()
			.setCustomId('first_embed')

			.setStyle(options.buttons?.firstBtn?.style as ButtonStyle);

		if (options.disable === 'Label' || options.disable === 'None')
			firstBtn.setEmoji(options.buttons?.firstBtn?.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			firstBtn.setLabel(options.buttons?.firstBtn?.label);

		const forwardBtn = new ButtonBuilder()
			.setCustomId('forward_button_embed')
			.setStyle(options.buttons?.nextBtn?.style as ButtonStyle);

		if (options.disable === 'Label' || options.disable === 'None')
			forwardBtn.setEmoji(options.buttons?.nextBtn?.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			forwardBtn.setLabel(options.buttons?.nextBtn?.label);

		const backBtn = new ButtonBuilder()
			.setCustomId('back_button_embed')
			.setStyle(options.buttons?.backBtn?.style as ButtonStyle);

		if (options.disable === 'Label' || options.disable === 'None')
			backBtn.setEmoji(options.buttons?.backBtn?.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			backBtn.setLabel(options.buttons?.backBtn?.label);

		if (options.dynamic) {
			firstBtn.setDisabled(true);
			backBtn.setDisabled(true);
		}

		const lastBtn = new ButtonBuilder()
			.setCustomId('last_embed')
			.setStyle(options.buttons?.lastBtn?.style as ButtonStyle);

		if (options.disable === 'Label' || options.disable === 'None')
			lastBtn.setEmoji(options.buttons?.lastBtn?.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			lastBtn.setLabel(options.buttons?.lastBtn?.label);

		const deleteBtn = new ButtonBuilder()
			.setCustomId('delete_embed')
			.setStyle(options.buttons?.deleteBtn?.style as ButtonStyle);

		if (options.disable === 'Label' || options.disable === 'None')
			deleteBtn.setEmoji(options.buttons?.deleteBtn?.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			deleteBtn.setLabel(options.buttons?.deleteBtn?.label);

		let btnCollection: any[] = [];
		//Creating the MessageActionRow
		let pageMovingButtons = new ActionRowBuilder<ButtonBuilder>();
		if (options.skips == true) {
			if (options.delete) {
				btnCollection = [firstBtn, backBtn, deleteBtn, forwardBtn, lastBtn];
			} else {
				btnCollection = [firstBtn, backBtn, forwardBtn, lastBtn];
			}
		} else {
			if (options.delete) {
				btnCollection = [backBtn, deleteBtn, forwardBtn];
			} else {
				btnCollection = [backBtn, forwardBtn];
			}
		}

		pageMovingButtons.addComponents(btnCollection);

		let currentPage = 0;

		comps.push(pageMovingButtons);

		let interaction;

		if (message.commandId) {
			interaction = message;
		}

		let m: Message | InteractionResponse;
		const pages = options.embeds;

		const extInteraction = message as ExtendedInteraction;
		const extMessage = message as ExtendedMessage;

		if (interaction) {
			if (options.count) {
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
			if (options.count) {
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

		const filter = (m: any) =>
			m.user.id === (message.user ? message.user : message.author).id;

		const collector = m.createMessageComponentCollector({
			time: options.timeout || ms('2m'),
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

			if (options.dynamic) {
				if (currentPage === 0) {
					const btn = comps[0].components[0];
					btn.setDisabled(true);
					if (options.skips) {
						const skip = comps[0].components[1];
						skip.setDisabled(true);
						comps[0].components[1] = skip;
					}

					comps[0].components[0] = btn;
				} else {
					const btn = comps[0].components[0];
					btn.setDisabled(false);
					if (options.skips) {
						const skip = comps[0].components[1];
						skip.setDisabled(false);
						comps[0].components[1] = skip;
					}
					comps[0].components[0] = btn;
				}
				if (currentPage === pages.length - 1) {
					if (options.skips) {
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
					if (options.skips) {
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
				if (options.count) {
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

		collector.on('end', async (collected: any, reason: string) => {
			if (reason === 'del') {
				await m.delete().catch(() => {});
			} else {
				const disab: any[] = [];

				btnCollection.forEach((a) => {
					disab.push(a.setDisabled(true));
				});

				pageMovingButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
					disab
				);

				m.edit({ components: [pageMovingButtons] });
			}
		});
	} catch (err: any) {
		if (options.strict)
			throw new SimplyError({
				function: 'buttonPages',
				title: 'An Error occured when running the function ',
				tip: err.stack
			});
		else console.log(`SimplyError - buttonPages | Error: ${err.stack}`);
	}
}
