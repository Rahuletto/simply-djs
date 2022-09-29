import {
	ButtonStyle,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	Message,
	InteractionResponse,
	ComponentType,
	APIButtonComponent,
	Utils,
	ButtonInteraction,
	ActionRow
} from 'discord.js';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';

import chalk from 'chalk';
import { SimplyError } from './Error/Error';
import { LegacyStyles, styleObj } from './interfaces/LegacyStyles';
import { convStyle } from './Others/convStyle';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/btnTemplate*
 */

interface btnTemplate {
	style?: ButtonStyle | LegacyStyles;
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

	rows?: ActionRowBuilder[];
	timeout?: number;

	disable?: 'Label' | 'Emoji' | 'None';
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * An *powerful yet customizable* **Embed Paginator**
 *
 * @param message
 * @param pages
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/embedPages***
 * @example simplydjs.embedPages(message, [embed1, embed2] )
 */

export async function embedPages(
	message: ExtendedMessage | ExtendedInteraction,
	pages: EmbedBuilder[],
	options: pagesOption = {}
): Promise<any> {
	try {
		options.skips ??= true;
		options.delete ??= true;
		options.dynamic ??= false;
		options.count ??= false;
		options.disable ||= 'Label';

		if (!pages)
			throw new SimplyError({
				name: 'NOT_SPECIFIED | Provide an array for the pages option',
				tip: `Expected an array of EmbedBuilder. Received ${
					pages || 'undefined'
				}`
			});

		let comps: any[] = [];

		if (options.rows) {
			if (!Array.isArray(options.rows))
				throw new SimplyError({
					name: `NOT_SPECIFIED | Provide an array for the rows`,
					tip: `Expected an array of MessageActionRows. Received ${
						options.rows || 'undefined'
					}`
				});
			comps = options.rows;
		} else {
			comps = [];
		}

		options.buttons = {
			firstBtn: {
				style: options.buttons?.firstBtn?.style || 'PRIMARY',
				emoji: options.buttons?.firstBtn?.emoji || '⏪',
				label: options.buttons?.firstBtn?.label || 'First'
			},
			nextBtn: {
				style: options.buttons?.nextBtn?.style || 'SUCCESS',
				emoji: options.buttons?.nextBtn?.emoji || '▶️',
				label: options.buttons?.nextBtn?.label || 'Next'
			},
			backBtn: {
				style: options.buttons?.backBtn?.style || 'SUCCESS',
				emoji: options.buttons?.backBtn?.emoji || '◀️',
				label: options.buttons?.backBtn?.label || 'Back'
			},
			lastBtn: {
				style: options.buttons?.lastBtn?.style || 'PRIMARY',
				emoji: options.buttons?.lastBtn?.emoji || '⏩',
				label: options.buttons?.lastBtn?.label || 'Last'
			},

			deleteBtn: {
				style: options.buttons?.deleteBtn?.style || 'DANGER',
				emoji: options.buttons?.deleteBtn?.emoji || '🗑',
				label: options.buttons?.deleteBtn?.label || 'Delete'
			}
		};

		//Defining all buttons
		const firstBtn = new ButtonBuilder()
			.setCustomId('first_embed')

			.setStyle(convStyle(options.buttons.firstBtn.style));

		if (options.disable === 'Label' || options.disable === 'None')
			firstBtn.setEmoji(options.buttons.firstBtn.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			firstBtn.setLabel(options.buttons?.firstBtn?.label);

		const forwardBtn = new ButtonBuilder()
			.setCustomId('forward_button_embed')
			.setStyle(convStyle(options.buttons.nextBtn.style));

		if (options.disable === 'Label' || options.disable === 'None')
			forwardBtn.setEmoji(options.buttons.nextBtn.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			forwardBtn.setLabel(options.buttons?.nextBtn?.label);

		const backBtn = new ButtonBuilder()
			.setCustomId('back_button_embed')
			.setStyle(convStyle(options.buttons.backBtn.style));

		if (options.disable === 'Label' || options.disable === 'None')
			backBtn.setEmoji(options.buttons.backBtn.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			backBtn.setLabel(options.buttons?.backBtn?.label);

		if (options.dynamic) {
			firstBtn.setDisabled(true);
			backBtn.setDisabled(true);
		}

		const lastBtn = new ButtonBuilder()
			.setCustomId('last_embed')
			.setStyle(convStyle(options.buttons.lastBtn.style));

		if (options.disable === 'Label' || options.disable === 'None')
			lastBtn.setEmoji(options.buttons.lastBtn.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			lastBtn.setLabel(options.buttons?.lastBtn?.label);

		const deleteBtn = new ButtonBuilder()
			.setCustomId('delete_embed')
			.setStyle(convStyle(options.buttons.deleteBtn.style));

		if (options.disable === 'Label' || options.disable === 'None')
			deleteBtn.setEmoji(options.buttons.deleteBtn.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			deleteBtn.setLabel(options.buttons?.deleteBtn?.label);

		let btnCollection: any[] = [];
		//Creating the ActionRowBuilder
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

		let m: Message;

		const int = message as ExtendedInteraction;
		const ms = message as ExtendedMessage;

		if (interaction) {
			if (options.count) {
				await int.followUp({
					embeds: [pages[0].setFooter({ text: `Page 1/${pages.length}` })],
					components: comps,
					allowedMentions: { repliedUser: false }
				});
			} else {
				await int.followUp({
					embeds: [pages[0]],
					components: comps,
					allowedMentions: { repliedUser: false }
				});
			}
			m = await int.fetchReply();
		} else if (!interaction) {
			if (options.count) {
				m = await ms.reply({
					embeds: [pages[0].setFooter({ text: `Page 1/${pages.length}` })],
					components: comps,
					allowedMentions: { repliedUser: false }
				});
			} else {
				m = await ms.reply({
					embeds: [pages[0]],
					components: comps,
					allowedMentions: { repliedUser: false }
				});
			}
		}

		const filter = (m: any) =>
			m.user.id === (message.user ? message.user : message.author).id;

		const collector = m.createMessageComponentCollector({
			time: options.timeout || 120000,
			filter,
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

			let components = ActionRowBuilder.from(m.components[0]).toJSON();

			if (options.dynamic) {
				if (currentPage === 0) {
					const bt = components.components[0] as APIButtonComponent;
					ButtonBuilder.from(bt).setDisabled(true);
					if (options.skips) {
						const inde = components.components[1] as APIButtonComponent;
						ButtonBuilder.from(inde).setDisabled(true);
						components.components[1] = inde;
					}

					components.components[0] = bt;
				} else {
					const bt = components.components[0] as APIButtonComponent;
					ButtonBuilder.from(bt).setDisabled(false);
					if (options.skips) {
						const inde = components.components[1] as APIButtonComponent;
						ButtonBuilder.from(inde).setDisabled(false);
						components.components[1] = inde;
					}
					components.components[0] = bt;
				}
				if (currentPage === pages.length - 1) {
					if (options.skips) {
						const bt = components.components[3] as APIButtonComponent;
						const inde = components.components[4] as APIButtonComponent;

						ButtonBuilder.from(inde).setDisabled(true);
						ButtonBuilder.from(bt).setDisabled(true);

						components.components[3] = bt;
						components.components[4] = inde;
					} else {
						const bt = components.components[2] as APIButtonComponent;

						ButtonBuilder.from(bt).setDisabled(true);

						components.components[2] = bt;
					}
				} else {
					if (options.skips) {
						const bt = components.components[3] as APIButtonComponent;
						const inde = components.components[4] as APIButtonComponent;

						ButtonBuilder.from(inde).setDisabled(false);
						ButtonBuilder.from(bt).setDisabled(true);

						components.components[3] = bt;
						components.components[4] = inde;
					} else {
						const bt = components.components[2] as APIButtonComponent;

						ButtonBuilder.from(bt).setDisabled(false);

						components.components[2] = bt;
					}
				}
			}

			let cm = ActionRowBuilder.from(components);

			if (b.customId !== 'delete_embed') {
				if (options.count) {
					m.edit({
						embeds: [
							pages[currentPage].setFooter({
								text: `Page: ${currentPage + 1}/${pages.length}`
							})
						],
						components: [cm as ActionRowBuilder<ButtonBuilder>],
						allowedMentions: { repliedUser: false }
					});
				} else {
					m.edit({
						embeds: [pages[currentPage]],
						components: [cm as ActionRowBuilder<ButtonBuilder>],
						allowedMentions: { repliedUser: false }
					});
				}
			} else if (b.customId === 'delete_embed') {
				collector.stop('del');
			}
		});

		collector.on('end', async (coll: any, reason: string) => {
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
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta(
				'embedPages'
			)} | Error: ${err.stack}`
		);
	}
}
