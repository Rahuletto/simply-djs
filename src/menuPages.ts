import { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } from 'discord.js';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';

import chalk from 'chalk';
import { SimplyError } from './Error/Error';

// ------------------------------
// ----- I N T E R F A C E ------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/General/menuPages#deleteopt*
 */

interface deleteOpt {
	enable?: boolean;
	label?: string;
	description?: string;
	emoji?: string;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/General/menuPages#dataobj*
 */

interface dataObj {
	label?: string;
	description?: string;
	embed?: EmbedBuilder;
	emoji?: string;
}

export type menuEmbOptions = {
	type?: 1 | 2;
	rows?: ActionRowBuilder[];
	embed?: EmbedBuilder;

	delete?: deleteOpt;

	data?: dataObj[];

	placeHolder?: string;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * An Embed paginator using Select Menus
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/menuPages***
 * @example simplydjs.menuPages(interaction, { data: {...} })
 */

export async function menuPages(
	message: ExtendedMessage | ExtendedInteraction,
	options: menuEmbOptions = {}
) {
	try {
		let type: number = options.type || 1;
		type = Number(type);
		if (type > 2)
			throw new SimplyError({
				name: 'There are only two types. You provided a type which doesnt exist',
				tip: 'TYPE 1: SEND EPHEMERAL MSG | TYPE 2: EDIT MSG'
			});

		const data = options.data;
		const rowz = options.rows;
		const menuOptions = [];

		for (let i = 0; i < data.length; i++) {
			if (data[i].emoji) {
				const dataopt = {
					label: data[i].label,
					description: data[i].description,
					value: data[i].label,
					emoji: data[i].emoji
				};

				menuOptions.push(dataopt);
			} else if (!data[i].emoji) {
				const dataopt = {
					label: data[i].label,
					description: data[i].description,
					value: data[i].label
				};

				menuOptions.push(dataopt);
			}
		}
		let delopt;

		if (
			options.delete?.enable === undefined ||
			(options.delete?.enable !== false && options.delete?.enable === true)
		) {
			delopt = {
				label: options.delete?.label || 'Delete',
				description:
					options.delete?.description || 'Delete the Select Menu Embed',
				value: 'delete_menuemb',
				emoji: options.delete?.emoji || '❌'
			};

			menuOptions.push(delopt);
		}

		const slct = new SelectMenuBuilder()
			.setMaxValues(1)
			.setCustomId('menuPages')
			.setPlaceholder(options.placeHolder || 'Dropdown Pages')
			.addOptions(menuOptions);

		const row = new ActionRowBuilder().addComponents(slct);

		const rows = [];

		rows.push(row);

		if (rowz) {
			for (let i = 0; i < rowz.length; i++) {
				rows.push(rowz[i]);
			}
		}

		let interaction;
		if (message.commandId) {
			interaction = message;
		}

		const int = message as ExtendedInteraction;
		const mes = message as ExtendedMessage;

		let m: any;

		if (interaction) {
			m = await int.followUp({
				embeds: [options.embed],
				components: rows,
				fetchReply: true
			});
		} else if (!interaction) {
			m = await mes.reply({ embeds: [options.embed], components: rows });
		}

		const collector = (m as ExtendedMessage).createMessageComponentCollector({
			componentType: 'SELECT_MENU',
			idle: 600000
		});
		collector.on('collect', async (menu: any) => {
			const selected = menu.values[0];

			if (type === 2) {
				await menu.deferUpdate();
				if (message.member.user.id !== menu.user.id)
					return menu.followUp({
						content: "You cannot access other's pagination."
					});
			} else await menu.deferReply({ ephemeral: true });

			if (selected === 'delete_menuemb') {
				if (message.member.user.id !== menu.user.id)
					return menu.editReply({
						content: "You cannot access other's pagination."
					});
				else collector.stop('delete');
			}

			for (let i = 0; i < data.length; i++) {
				if (selected === data[i].label) {
					if (type === 1) {
						menu.editReply({ embeds: [data[i].embed], ephemeral: true });
					} else if (type === 2) {
						menu.message.edit({ embeds: [data[i].embed] });
					}
				}
			}
		});
		collector.on('end', async (collected: any, reason: string) => {
			if (reason === 'delete') return await m.delete();
			if (collected.size === 0) {
				m.edit({ embeds: [options.embed], components: [] });
			}
		});
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta(
				'menuPages'
			)} | Error: ${err.stack}`
		);
	}
}
