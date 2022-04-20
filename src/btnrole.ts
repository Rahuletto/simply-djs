import {
	CommandInteraction,
	MessageButtonStyle,
	Role,
	Message,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
	GuildMember
} from 'discord.js';

import { SimplyError } from './Error/Error';
import chalk from 'chalk';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

interface dataObj {
	role?: string;
	label?: string;
	emoji?: string;
	style?: MessageButtonStyle;
	url?: `https://${string}`;
}

export type btnOptions = {
	embed?: MessageEmbed;
	content?: string;
	data?: dataObj[];
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A faster **button role system** | *Requires: **manageBtn()***
 * @param message
 * @param options
 * @example simplydjs.btnRole(message, { data: {...} })
 */

export async function btnRole(
	message: Message | CommandInteraction,
	options: btnOptions = {}
): Promise<Message> {
	try {
		if (!options.data)
			throw new SimplyError({
				name: 'NOT_SPECIFIED | Provide an data option to make buttons.',
				tip: `Expected data object in options.. Received ${
					options.data || 'undefined'
				}`
			});

		let msg = message as Message;
		let int = message as CommandInteraction;

		//@ts-ignore
		if (message.commandId) {
			//@ts-ignore
			const member = interaction.member as GuildMember;
			if (!member.permissions.has('ADMINISTRATOR'))
				int.followUp({
					content: 'You need `ADMINISTRATOR` permission to use this command'
				});
			return; //@ts-ignore
		} else if (!message.customId) {
			if (!msg.member.permissions.has('ADMINISTRATOR'))
				return await msg.reply({
					content: 'You need `ADMINISTRATOR` permission to use this command'
				});
		}

		let row: any[] = [];
		let data = options.data;

		if (data.length <= 5) {
			let button: any[][] = [[]];
			btnEngine(data, button, row);
		} else if (data.length > 5 && data.length <= 10) {
			let button: any[][] = [[], []];
			btnEngine(data, button, row);
		} else if (data.length > 11 && data.length <= 15) {
			let button: any[][] = [[], [], []];
			btnEngine(data, button, row);
		} else if (data.length > 16 && data.length <= 20) {
			let button: any[][] = [[], [], [], []];
			btnEngine(data, button, row);
		} else if (data.length > 21 && data.length <= 25) {
			let button: any[][] = [[], [], [], [], []];
			btnEngine(data, button, row);
		} else if (data.length > 25) {
			throw new SimplyError({
				name: 'Reached the limit of 25 buttons..',
				tip: 'Discord allows only 25 buttons in a message. Send a new message with more buttons.'
			});
		}
		async function btnEngine(data: dataObj[], button: any[][], row: any[]) {
			let current = 0;

			for (let i = 0; i < data.length; i++) {
				if (button[current].length === 5) current++;

				let emoji = data[i].emoji || null;
				let clr = data[i].style || 'SECONDARY';
				let url = '';
				let role: Role | null = message.guild.roles.cache.find(
					(r) => r.id === data[i].role
				);
				let label = data[i].label || role?.name;

				if (!role && clr === 'LINK') {
					url = data[i].url;
					button[current].push(createLink(label, url, emoji));
				} else {
					button[current].push(createButton(label, role, clr, emoji));
				}

				if (i === data.length - 1) {
					let rero = addRow(button[current]);
					row.push(rero);
				}
			}

			if (!options.embed && !options.content)
				throw new SimplyError({
					name: 'NOT_SPECIFIED | Provide an embed (or) content in the options.',
					tip: `Expected embed (or) content options to send. Received ${
						options.embed || options.content || 'undefined'
					}`
				});

			let emb = options.embed;

			if ((message as CommandInteraction).commandId) {
				if (!options.embed) {
					(message as CommandInteraction).followUp({
						content: options.content || '** **',
						components: row
					});
				} else
					(message as CommandInteraction).followUp({
						content: options.content || '** **',
						embeds: [emb],
						components: row
					});
			} else if (!(message as CommandInteraction).commandId) {
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

			function addRow(btns: any[]): MessageActionRow {
				let row1 = new MessageActionRow();

				row1.addComponents(btns);

				return row1;
			}

			function createLink(
				label: string,
				url: string,
				emoji: string
			): MessageButton {
				let btn = new MessageButton();
				if (!emoji || emoji === null) {
					btn.setLabel(label).setStyle('LINK').setURL(url);
				} else if (emoji && emoji !== null) {
					btn.setLabel(label).setStyle('LINK').setURL(url).setEmoji(emoji);
				}
				return btn;
			}

			function createButton(
				label: string,
				role: Role,
				color: MessageButtonStyle,
				emoji: string
			): MessageButton {
				let btn = new MessageButton();
				if (!emoji || emoji === null) {
					btn
						.setLabel(label)
						.setStyle(color)
						.setCustomId('role-' + role.id);
				} else if (emoji && emoji !== null) {
					btn
						.setLabel(label)
						.setStyle(color)
						.setCustomId('role-' + role.id)
						.setEmoji(emoji);
				}
				return btn;
			}
		}
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta('btnRole')} | Error: ${
				err.stack
			}`
		);
	}
}
