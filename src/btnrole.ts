import {
	ButtonStyle,
	Role,
	Message,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	PermissionFlagsBits
} from 'discord.js';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';

import { SimplyError } from './Error/Error';
import { MessageButtonStyle } from './Others/MessageButtonStyle';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

interface dataObject {
	role?: string | Role;
	label?: string;
	emoji?: string;
	style?: ButtonStyle | 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK';
	url?: `https://${string}`;
}

export type btnOptions = {
	embed?: EmbedBuilder;
	content?: string;
	data?: dataObject[];
	strict?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A **Button Role System** that lets you create button roles with your own message. | *Requires: [**manageBtn()**](https://simplyd.js.org/docs/handler/manageBtn)*
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/btnrole***
 * @example simplydjs.btnRole(message, { data: {...} })
 */

export async function btnRole(
	message: ExtendedMessage | ExtendedInteraction,
	options: btnOptions = {}
): Promise<Message> {
	try {
		if (!options.data) {
			if (options.strict)
				throw new SimplyError({
					function: 'btnRole',
					title: 'Expected data object in options',
					tip: `Received ${options.data || 'undefined'}`
				});
			else
				console.log(
					`SimplyError - btnRole | Error:  Expected data object in options.. Received ${
						options.data || 'undefined'
					}`
				);
		}

		const msg = message as ExtendedMessage;
		const int = message as ExtendedInteraction;

		if (message.commandId) {
			if (!int.member.permissions.has(PermissionFlagsBits.Administrator))
				int.followUp({
					content: 'You need `ADMINISTRATOR` permission to use this command'
				});
			return;
		} else if (!message.customId) {
			if (!msg.member.permissions.has(PermissionFlagsBits.Administrator))
				return await msg.reply({
					content: 'You need `ADMINISTRATOR` permission to use this command'
				});
		}

		const row: any[] = [];
		const data = options.data;

		if (data.length <= 5) {
			const button: any[][] = [[]];
			GenButton(data, button, row);
		} else if (data.length > 5 && data.length <= 10) {
			const button: any[][] = [[], []];
			GenButton(data, button, row);
		} else if (data.length > 11 && data.length <= 15) {
			const button: any[][] = [[], [], []];
			GenButton(data, button, row);
		} else if (data.length > 16 && data.length <= 20) {
			const button: any[][] = [[], [], [], []];
			GenButton(data, button, row);
		} else if (data.length > 21 && data.length <= 25) {
			const button: any[][] = [[], [], [], [], []];
			GenButton(data, button, row);
		} else if (data.length > 25) {
			if (options.strict)
				throw new SimplyError({
					function: 'btnRole',
					title: 'Reached the limit of 25 buttons..',
					tip: 'Discord allows only 25 buttons in a message. Send a new message with more buttons.'
				});
		}

		// Generates buttons from the data provided
		async function GenButton(data: dataObject[], button: any[][], row: any[]) {
			let current = 0;

			for (let i = 0; i < data.length; i++) {
				if (button[current].length === 5) current++;

				const emoji = data[i].emoji || null;
				const color = data[i].style || ButtonStyle.Secondary;
				let url = '';
				const role: Role | null = message.guild.roles.cache.find(
					(r) => r.id === data[i].role
				);
				const label = data[i].label || role?.name;

				if (!role && color === 'LINK') {
					url = data[i].url;
					button[current].push(createLink(label, url, emoji));
				} else {
					button[current].push(createButton(label, role, color, emoji));
				}

				// push the row into array (So you can add more than a row of buttons)
				if (i === data.length - 1) {
					const newRow = addRow(button[current]);
					row.push(newRow);
				}
			}

			if (!options.embed && !options.content)
				throw new SimplyError({
					function: 'btnRole',
					title: 'Provide an embed (or) content in the options.',
					tip: `Expected embed (or) content options to send. Received ${
						options.embed || options.content || 'undefined'
					}`
				});

			// Embed from the options
			let emb = options.embed;

			if ((message as ExtendedInteraction).commandId) {
				if (!options.embed) {
					(message as ExtendedInteraction).followUp({
						content: options.content || '** **',
						components: row
					});
				} else
					(message as ExtendedInteraction).followUp({
						content: options.content || '** **',
						embeds: [emb],
						components: row
					});
			} else if (!(message as ExtendedInteraction).commandId) {
				if (!options.embed) {
					message.channel.send({
						content: options.content || '** **',
						components: row
					});
				} else
					message.channel.send({
						content: options.content || '** **',
						embeds: [emb],
						components: row
					});
			}

			function addRow(btns: any[]): ActionRowBuilder<ButtonBuilder> {
				const row1 = new ActionRowBuilder<ButtonBuilder>();

				row1.addComponents(btns);

				return row1;
			}

			function createLink(
				label: string,
				url: string,
				emoji: string
			): ButtonBuilder {
				const btn = new ButtonBuilder();
				if (!emoji || emoji === null) {
					btn.setLabel(label).setStyle(ButtonStyle.Link).setURL(url);
				} else if (emoji && emoji !== null) {
					btn
						.setLabel(label)
						.setStyle(ButtonStyle.Link)
						.setURL(url)
						.setEmoji(emoji);
				}
				return btn;
			}

			function createButton(
				label: string,
				role: Role,
				color:
					| ButtonStyle
					| 'PRIMARY'
					| 'SECONDARY'
					| 'SUCCESS'
					| 'DANGER'
					| 'LINK',
				emoji: string
			): ButtonBuilder {
				if (color as string) color = MessageButtonStyle(color as string);

				const btn = new ButtonBuilder();
				btn
					.setLabel(label)
					.setStyle((color as ButtonStyle) || ButtonStyle.Secondary)
					.setCustomId('role-' + role.id);

				if (emoji && emoji !== null) {
					btn.setEmoji(emoji);
				}
				return btn;
			}
		}
	} catch (err: any) {
		if (options.strict)
			throw new SimplyError({
				function: 'btnRole',
				title: 'An Error occured when running the function ',
				tip: err.stack
			});
		else console.log(`SimplyError - btnRole | Error: ${err.stack}`);
	}
}
