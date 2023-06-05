import {
	ButtonStyle,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonInteraction,
	Message,
	ComponentType
} from 'discord.js';

import {
	ExtendedInteraction,
	ExtendedMessage,
	CustomizableEmbed,
	ExtendedButtonStyle
} from './typedef';

import { toButtonStyle, toRgb, ms } from './misc';

import { SimplyError } from './error';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/general/calculator#calculatorbuttons
 */

export interface CalculatorButtons {
	numbers?: ExtendedButtonStyle;
	symbols?: ExtendedButtonStyle;
	delete?: ExtendedButtonStyle;
}

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/general/calculator#calculatoroptions
 */

export type calculatorOptions = {
	embed?: CustomizableEmbed;
	buttons?: CalculatorButtons;
	strict?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * An Unique **calculator** which can be *used inside Discord*
 * @param msgOrInt
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/general/calculator
 * @example simplydjs.calculator(interaction)
 */

export async function calculator(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: calculatorOptions = {
		strict: false,
		buttons: {
			numbers: ButtonStyle.Secondary,
			symbols: ButtonStyle.Primary,
			delete: ButtonStyle.Danger
		}
	}
): Promise<void> {
	return new Promise(async () => {
		try {
			const buttons: ButtonBuilder[][] = [[], [], [], [], []];
			const row: ActionRowBuilder<ButtonBuilder>[] = [];
			const text: string[] = [
				'Clear',
				'(',
				')',
				'/',
				'Back',
				'7',
				'8',
				'9',
				'*',
				'%',
				'4',
				'5',
				'6',
				'-',
				'^',
				'1',
				'2',
				'3',
				'+',
				'π',
				'.',
				'0',
				'00',
				'=',
				'Delete'
			];
			let current = 0;

			if (!options.embed) {
				options.embed = {
					footer: {
						text: '©️ Rahuletto. npm i simply-djs',
						iconURL: 'https://i.imgur.com/XFUIwPh.png'
					},
					color: toRgb('#406DBC')
				};
			}

			const buttonStyles = {
				numbers: options?.buttons?.numbers || ButtonStyle.Secondary,
				symbols: options?.buttons?.symbols || ButtonStyle.Primary,
				delete: options?.buttons?.delete || ButtonStyle.Danger
			};
			if (buttonStyles.delete as string)
				buttonStyles.delete = toButtonStyle(buttonStyles.delete as string);

			if (buttonStyles.numbers as string)
				buttonStyles.numbers = toButtonStyle(buttonStyles.numbers as string);

			if (buttonStyles.symbols as string)
				buttonStyles.symbols = toButtonStyle(buttonStyles.symbols as string);

			let message: ExtendedMessage;

			if (!msgOrInt.commandId) {
				message = msgOrInt as ExtendedMessage;
			}
			if (msgOrInt.commandId && !(msgOrInt as ExtendedInteraction).deferred)
				await (msgOrInt as ExtendedInteraction).deferReply({
					fetchReply: true
				});

			for (let i = 0; i < text.length; i++) {
				if (buttons[current].length === 5) current++;
				buttons[current].push(createButton(text[i]));
				if (i === text.length - 1) {
					for (const btn of buttons) row.push(addRow(btn));
				}
			}

			const embed = new EmbedBuilder()
				.setColor(options?.embed?.color || toRgb('#406DBC'))
				.setFooter(
					options?.embed?.footer
						? options?.embed?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				)
				.setDescription(
					'```js\n0\n// Result: 0\n```' +
						(options?.embed?.description
							? `\n${options?.embed?.description}`
							: '')
				);

			if (options?.embed?.fields) embed.setFields(options.embed?.fields);
			if (options?.embed?.author) embed.setAuthor(options.embed?.author);
			if (options?.embed?.image) embed.setImage(options.embed?.image);
			if (options?.embed?.thumbnail)
				embed.setThumbnail(options.embed?.thumbnail);
			if (options?.embed?.timestamp)
				embed.setTimestamp(options.embed?.timestamp);
			if (options?.embed?.title) embed.setTitle(options.embed?.title);
			if (options?.embed?.url) embed.setURL(options.embed?.url);

			let msg: Message;

			const extInteraction = msgOrInt as ExtendedInteraction;
			const extMessage = msgOrInt as ExtendedMessage;

			if (!message) {
				await extInteraction.reply({
					embeds: [embed],
					components: row
				});

				msg = await extInteraction.fetchReply();
			} else if (message) {
				msg = await extMessage.reply({
					embeds: [embed],
					components: row
				});
			}

			let elem = '0';

			const filter = (buttons: ButtonInteraction) =>
				buttons.user?.id === msgOrInt.member.user.id &&
				buttons.customId.startsWith('cal-');

			const collector = msg.createMessageComponentCollector({
				filter: filter,
				componentType: ComponentType.Button,
				time: ms('5m')
			});

			collector.on('end', (collected) =>
				console.log(`Collected ${collected.size} items`)
			);

			collector.on('collect', async (buttons: ButtonInteraction) => {
				await buttons.deferUpdate();

				const name: string | number = buttons.customId.replace('cal-', '');

				if (elem === '0') elem = '';

				if (name === '=') {
					elem = mathEval(elem, true);

					embed.setDescription(
						`\`\`\`js\n${elem}\n\`\`\`` +
							(options.embed?.description
								? `\n${options.embed?.description}`
								: '')
					);

					elem = '0';

					await msg
						.edit({
							embeds: [embed],
							components: row
						})
						.catch(() => {});

					return;
				}

				elem = elem + name.toString();

				if (name === 'Delete') await msg.delete().catch(() => {});
				else if (name === 'Clear') elem = '0';
				if (name === 'Back') elem = elem.slice(0, -2);

				if (isNaN(Number(name)) && name !== 'Back') {
					embed.setDescription(
						`\`\`\`js\n${elem
							.replaceAll('+', ' + ')
							.replaceAll('*', ' * ')}\n\t\n\`\`\`` +
							(options?.embed?.description
								? `\n${options?.embed?.description}`
								: '')
					);
					await msg
						.edit({
							embeds: [embed],
							components: row
						})
						.catch(() => {});

					return;
				}

				embed.setDescription(
					`\`\`\`js\n${elem
						.replaceAll('+', ' + ')
						.replaceAll('*', ' * ')}\n// Result: ${mathEval(elem)
						.replaceAll('^', '**')
						.replaceAll('%', '/100')
						.replace(' ', '')}\n\`\`\`` +
						(options.embed?.description
							? `\n${options.embed?.description}`
							: '')
				);
				await msg
					.edit({
						embeds: [embed],
						components: row
					})
					.catch(() => {});

				return;
			});

			setTimeout(async () => {
				if (!msg) return;
				if (!msg.editable) return;

				if (msg) {
					if (msg.editable) {
						embed.setDescription(
							'Your Time for using the calculator ran out (5 minutes)'
						);
						embed.setColor(toRgb('#c90000'));
						await msg.edit({ embeds: [embed], components: [] }).catch(() => {});
					}
				}
			}, ms('5m'));

			function addRow(btns: ButtonBuilder[]) {
				const row1 = new ActionRowBuilder<ButtonBuilder>();
				for (const btn of btns) {
					row1.addComponents(btn);
				}
				return row1;
			}

			function createButton(
				label: string | number,
				style: ExtendedButtonStyle = buttonStyles.numbers
			) {
				if (label === 'Clear') style = buttonStyles.delete;
				else if (label === 'Delete') style = buttonStyles.delete;
				else if (label === 'Back') style = buttonStyles.delete;
				else if (label === 'π') style = buttonStyles.numbers;
				else if (label === '%') style = buttonStyles.numbers;
				else if (label === '^') style = buttonStyles.numbers;
				else if (label === '.') style = buttonStyles.symbols;
				else if (label === '=') style = ButtonStyle.Success;
				else if (isNaN(Number(label))) style = buttonStyles.symbols;

				const btn = new ButtonBuilder()
					.setLabel(label.toString())
					.setStyle(style as ButtonStyle)
					.setCustomId('cal-' + label);
				return btn;
			}

			// Regex for calculation to avoid any malicious code injection at eval()
			const evalRegex = /^[0-9π\+\%\^\-*\/\.\(\)]*$/;
			function mathEval(input: string, result = false) {
				try {
					const matched = evalRegex.exec(input);
					if (!matched) return 'Invalid Expression';

					if (result === false) {
						// Evaluates the expressions (Security Risk | Prevented by regex testing)
						return `${Function(
							`"use strict";let π=Math.PI;return (${input})`
						)()}`;
					} else
						return `${input
							.replaceAll('**', '^') // Evaluates the expressions (Security Risk | Prevented by regex testing)
							.replaceAll('/100', '%')} = ${Function(
							`"use strict";let π=Math.PI;return (${input})`
						)()}`;
				} catch {
					return 'Wrong Input';
				}
			}
		} catch (err: any) {
			if (options?.strict)
				throw new SimplyError({
					function: 'calculator',
					title: 'An Error occured when running the function ',
					tip: err.stack
				});
			else console.log(`SimplyError - calculator | Error: ${err.stack}`);
		}
	});
}
