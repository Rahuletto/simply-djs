import {
	CommandInteraction,
	MessageButtonStyle,
	Message,
	MessageEmbed,
	MessageButton,
	MessageActionRow
} from 'discord.js';

import chalk from 'chalk';
import { SimplyError } from './Error/Error';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/btnTemplate*
 */

interface btnTemplate {
	style?: MessageButtonStyle;
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

	rows?: MessageActionRow[];
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
	message: Message | CommandInteraction,
	pages: MessageEmbed[],
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
				tip: `Expected an array of MessageEmbed. Received ${
					pages || 'undefined'
				}`
			});

		let comps: MessageActionRow[];

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
		let firstBtn = new MessageButton()
			.setCustomId('first_embed')

			.setStyle(options.buttons.firstBtn.style);

		if (options.disable === 'Label' || options.disable === 'None')
			firstBtn.setEmoji(options.buttons.firstBtn.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			firstBtn.setLabel(options.buttons?.firstBtn?.label);

		let forwardBtn = new MessageButton()
			.setCustomId('forward_button_embed')
			.setStyle(options.buttons.nextBtn.style);

		if (options.disable === 'Label' || options.disable === 'None')
			forwardBtn.setEmoji(options.buttons.nextBtn.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			forwardBtn.setLabel(options.buttons?.nextBtn?.label);

		let backBtn = new MessageButton()
			.setCustomId('back_button_embed')
			.setStyle(options.buttons.backBtn.style);

		if (options.disable === 'Label' || options.disable === 'None')
			backBtn.setEmoji(options.buttons.backBtn.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			backBtn.setLabel(options.buttons?.backBtn?.label);

		if (options.dynamic) {
			firstBtn.setDisabled(true);
			backBtn.setDisabled(true);
		}

		let lastBtn = new MessageButton()
			.setCustomId('last_embed')
			.setStyle(options.buttons.lastBtn.style);

		if (options.disable === 'Label' || options.disable === 'None')
			lastBtn.setEmoji(options.buttons.lastBtn.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			lastBtn.setLabel(options.buttons?.lastBtn?.label);

		let deleteBtn = new MessageButton()
			.setCustomId('delete_embed')
			.setStyle(options.buttons.deleteBtn.style);

		if (options.disable === 'Label' || options.disable === 'None')
			deleteBtn.setEmoji(options.buttons.deleteBtn.emoji);
		else if (options.disable === 'Emoji' || options.disable === 'None')
			deleteBtn.setLabel(options.buttons?.deleteBtn?.label);

		let btnCollection: any[] = [];
		//Creating the MessageActionRow
		let pageMovingButtons = new MessageActionRow();
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

		var currentPage = 0;

		comps.push(pageMovingButtons);

		let interaction;

		//@ts-ignore
		if (message.commandId) {
			interaction = message;
		}

		var m: any;

		let int = message as CommandInteraction;
		let ms = message as Message;

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
				m = await message.reply({
					embeds: [pages[0]],
					components: comps,
					allowedMentions: { repliedUser: false }
				});
			}
		}

		let filter = (
			m: any //@ts-ignore
		) => m.user.id === (message.user ? message.user : message.author).id;

		let collector = m.createMessageComponentCollector({
			time: options.timeout || 120000,
			filter,
			componentType: 'BUTTON'
		});

		collector.on('collect', async (b: any) => {
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
					let bt = comps[0].components[0];
					bt.disabled = true;
					if (options.skips) {
						let inde = comps[0].components[1];
						inde.disabled = true;
						comps[0].components[1] = inde;
					}

					comps[0].components[0] = bt;
				} else {
					let bt = comps[0].components[0];
					bt.disabled = false;
					if (options.skips) {
						let inde = comps[0].components[1];
						inde.disabled = false;
						comps[0].components[1] = inde;
					}
					comps[0].components[0] = bt;
				}
				if (currentPage === pages.length - 1) {
					if (options.skips) {
						let bt = comps[0].components[3];
						let inde = comps[0].components[4];

						inde.disabled = true;
						bt.disabled = true;

						comps[0].components[3] = bt;
						comps[0].components[4] = inde;
					} else {
						let bt = comps[0].components[2];

						bt.disabled = true;

						comps[0].components[2] = bt;
					}
				} else {
					if (options.skips) {
						let bt = comps[0].components[3];
						let inde = comps[0].components[4];

						inde.disabled = false;
						bt.disabled = false;

						comps[0].components[3] = bt;
						comps[0].components[4] = inde;
					} else {
						let bt = comps[0].components[2];

						bt.disabled = false;

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

		collector.on('end', async (coll: any, reason: string) => {
			if (reason === 'del') {
				await m.delete().catch(() => {});
			} else {
				let disab: any[] = [];

				btnCollection.forEach((a) => {
					disab.push(a.setDisabled(true));
				});

				pageMovingButtons = new MessageActionRow().addComponents(disab);

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
