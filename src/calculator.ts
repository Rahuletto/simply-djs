import {
	ButtonStyle,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonInteraction,
	Message,
	ComponentType
} from 'discord.js';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';
import { CustomizableEmbed } from './interfaces/CustomizableEmbed';
import { MessageButtonStyle } from './Others/MessageButtonStyle';
import { toRgb } from './Others/toRgb';
import { ms } from './Others/ms';
import { SimplyError } from './Error/Error';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/General/calculator#calcbuttons*
 */

interface calcButtons {
	numbers?:
		| ButtonStyle
		| 'PRIMARY'
		| 'SECONDARY'
		| 'SUCCESS'
		| 'DANGER'
		| 'LINK';
	symbols?:
		| ButtonStyle
		| 'PRIMARY'
		| 'SECONDARY'
		| 'SUCCESS'
		| 'DANGER'
		| 'LINK';
	delete?:
		| ButtonStyle
		| 'PRIMARY'
		| 'SECONDARY'
		| 'SUCCESS'
		| 'DANGER'
		| 'LINK';
}

export type calcOptions = {
	embed?: CustomizableEmbed;
	buttons?: calcButtons;
	strict?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * An Unique **calculator** which can be *used inside Discord*
 * @param interaction
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/calculator***
 * @example simplydjs.calculator(interaction)
 */

export async function calculator(
	interaction: ExtendedMessage | ExtendedInteraction,
	options: calcOptions = {
		buttons: {
			numbers: ButtonStyle.Secondary,
			symbols: ButtonStyle.Primary,
			delete: ButtonStyle.Danger
		}
	}
): Promise<void> {
	try {
		const button: any[][] = [[], [], [], [], []];
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

		options.buttons = {
			numbers: options.buttons?.numbers || ButtonStyle.Secondary,
			symbols: options.buttons?.symbols || ButtonStyle.Primary,
			delete: options.buttons?.delete || ButtonStyle.Danger
		};
		if (options.buttons.delete as string)
			options.buttons.delete = MessageButtonStyle(
				options.buttons.delete as string
			);

		if (options.buttons.numbers as string)
			options.buttons.numbers = MessageButtonStyle(
				options.buttons.numbers as string
			);

		if (options.buttons.symbols as string)
			options.buttons.symbols = MessageButtonStyle(
				options.buttons.symbols as string
			);

		let message: ExtendedMessage;

		if (!interaction.commandId) {
			message = interaction as ExtendedMessage;
		}

		for (let i = 0; i < text.length; i++) {
			if (button[current].length === 5) current++;
			button[current].push(createButton(text[i]));
			if (i === text.length - 1) {
				for (const btn of button) row.push(addRow(btn));
			}
		}

		const embed = new EmbedBuilder()
			.setColor(options.embed?.color || toRgb('#406DBC'))
			.setFooter(
				options.embed?.footer
					? options.embed?.footer
					: {
							text: '©️ Rahuletto. npm i simply-djs',
							iconURL: 'https://i.imgur.com/XFUIwPh.png'
					  }
			)
			.setDescription(
				'```js\n0\n// Result: 0\n```' +
					(options.embed?.description ? `\n${options.embed?.description}` : '')
			);

		if (options.embed.author) embed.setAuthor(options.embed.author);
		if (options.embed.image) embed.setImage(options.embed.image);
		if (options.embed.thumbnail) embed.setThumbnail(options.embed.thumbnail);
		if (options.embed.timestamp) embed.setTimestamp(options.embed.timestamp);
		if (options.embed?.title) embed.setTitle(options.embed?.title);
		if (options.embed?.url) embed.setURL(options.embed?.url);

		let msg: Message;

		const extInteraction = interaction as ExtendedInteraction;
		const extMessage = interaction as ExtendedMessage;

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

		const time = ms('5m'); // 5 minutes

		let elem = '0';

		const filter = (button: ButtonInteraction) =>
			button.user?.id ===
				(interaction.user ? interaction.user : interaction.author).id &&
			button.customId.startsWith('cal-');

		const collector = msg.createMessageComponentCollector({
			filter: filter,
			componentType: ComponentType.Button,
			time: time
		});

		collector.on('end', (collected) =>
			console.log(`Collected ${collected.size} items`)
		);

		collector.on('collect', async (button: ButtonInteraction) => {
			await button.deferUpdate();

			const name: string | number = button.customId.replace('cal-', '');

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
			}

			embed.setDescription(
				`\`\`\`js\n${elem
					.replaceAll('+', ' + ')
					.replaceAll('*', ' * ')}\n// Result: ${mathEval(elem)
					.replaceAll('^', '**')
					.replaceAll('%', '/100')
					.replace(' ', '')}\n\`\`\`` +
					(options.embed?.description ? `\n${options.embed?.description}` : '')
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
					embed.setColor(toRgb(`#c90000`));
					await msg.edit({ embeds: [embed], components: [] }).catch(() => {});
				}
			}
		}, time);

		function addRow(btns: ButtonBuilder[]) {
			const row1 = new ActionRowBuilder<ButtonBuilder>();
			for (const btn of btns) {
				row1.addComponents(btn);
			}
			return row1;
		}

		function createButton(
			label: string | number,
			style:
				| ButtonStyle
				| 'PRIMARY'
				| 'SECONDARY'
				| 'SUCCESS'
				| 'DANGER'
				| 'LINK' = options.buttons?.numbers
		) {
			if (label === 'Clear') style = options.buttons?.delete;
			else if (label === 'Delete') style = options.buttons?.delete;
			else if (label === 'Back') style = options.buttons?.delete;
			else if (label === 'π') style = options.buttons?.numbers;
			else if (label === '%') style = options.buttons?.numbers;
			else if (label === '^') style = options.buttons?.numbers;
			else if (label === '.') style = options.buttons?.symbols;
			else if (label === '=') style = 'SUCCESS';
			else if (isNaN(Number(label))) style = options.buttons?.symbols;

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
		if (options.strict)
			throw new SimplyError({
				function: 'calculator',
				title: 'An Error occured when running the function ',
				tip: err.stack
			});
		else console.log(`SimplyError - calculator | Error: ${err.stack}`);
	}
}
