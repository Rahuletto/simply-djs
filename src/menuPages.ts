import {
	EmbedBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	Message,
	ComponentType,
	StringSelectMenuInteraction
} from 'discord.js';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';

import { SimplyError } from './Error/Error';
import { ms } from './Others/ms';

// ------------------------------
// ----- I N T E R F A C E ------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/General/menuPages#deleteoption*
 */

interface deleteOption {
	enable?: boolean;
	label?: string;
	description?: string;
	emoji?: string;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/General/menuPages#dataobject*
 */

interface dataObject {
	label?: string;
	description?: string;
	embed?: EmbedBuilder;
	emoji?: string;
}

export type menuEmbOptions = {
	type?: 1 | 2;
	rows?: ActionRowBuilder<StringSelectMenuBuilder>[];
	embed?: EmbedBuilder;

	delete?: deleteOption;

	data?: dataObject[];

	placeHolder?: string;
	strict?: boolean;
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
		const type: number = Number(options.type) || 1;

		if (type !== 1 && type !== 2) {
			if (options.strict)
				throw new SimplyError({
					function: 'menuPages',
					title:
						'There are only two types. You have provided a type which doesnt exist',
					tip: 'Type 1: SEND EPHEMERAL MSG | Type 2: EDIT MSG'
				});
		}

		const data = options.data;
		const rowOption = options.rows;
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

		if (
			options.delete?.enable === undefined ||
			options.delete?.enable === true
		) {
			const delopt = {
				label: options.delete?.label || 'Delete',
				description:
					options.delete?.description || 'Delete the Select Menu Embed',
				value: 'delete_menuemb',
				emoji: options.delete?.emoji || '❌'
			};

			menuOptions.push(delopt);
		}

		const slct = new StringSelectMenuBuilder()
			.setMaxValues(1)
			.setCustomId('menuPages')
			.setPlaceholder(options.placeHolder || 'Dropdown Pages')
			.addOptions(menuOptions);

		const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			slct
		);

		const rows = [];

		rows.push(row);

		if (rowOption) {
			for (let i = 0; i < rowOption.length; i++) {
				rows.push(rowOption[i]);
			}
		}

		let interaction: ExtendedInteraction;
		if (message.commandId) {
			interaction = message as ExtendedInteraction;
		}

		const extInteraction = message as ExtendedInteraction;
		const extMessage = message as ExtendedMessage;

		let m: Message;

		if (interaction) {
			m = await extInteraction.followUp({
				embeds: [options.embed],
				components: rows,
				fetchReply: true
			});
		} else if (!interaction) {
			m = await extMessage.reply({ embeds: [options.embed], components: rows });
		}

		const collector = m.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			idle: ms('10m')
		});
		collector.on('collect', async (menu: StringSelectMenuInteraction) => {
			const selected = menu.values[0];

			if (type === 2) {
				await menu.deferUpdate();
				if (message.member.user.id !== menu.user.id)
					menu.followUp({
						content: "You cannot access other's pagination."
					});
			} else await menu.deferReply({ ephemeral: true });

			if (selected === 'delete_menuemb') {
				if (message.member.user.id !== menu.user.id)
					menu.editReply({
						content: "You cannot access other's pagination."
					});
				else collector.stop('delete');
			}

			for (let i = 0; i < data.length; i++) {
				if (selected === data[i].label) {
					if (type === 1) {
						menu.editReply({ embeds: [data[i].embed] });
					} else if (type === 2) {
						menu.message.edit({ embeds: [data[i].embed] });
					}
				}
			}
		});

		collector.on('end', async (collected: any, reason: string) => {
			if (reason === 'delete') await m.delete();
			if (collected.size === 0) {
				m.edit({ embeds: [options.embed], components: [] });
			}
		});
	} catch (err: any) {
		if (options.strict)
			throw new SimplyError({
				function: 'menuPages',
				title: 'An Error occured when running the function ',
				tip: err.stack
			});
		else console.log(`SimplyError - menuPages | Error: ${err.stack}`);
	}
}
