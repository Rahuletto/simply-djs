import {
	EmbedBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	Message,
	ComponentType,
	StringSelectMenuInteraction
} from 'discord.js';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';

import { SimplyError } from './error/SimplyError';
import { ms } from './misc';

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
	type?: 'Send' | 'Edit';
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
		const type: string = options.type || 'Send';

		if (type !== 'Send' && type !== 'Receive') {
			if (options.strict)
				throw new SimplyError({
					function: 'menuPages',
					title:
						'There are only two types. You have provided a type which doesnt exist',
					tip: 'There are only "Send" and "Edit" where "Send" sends a ephemeral message but "Edit" edits the original message'
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
				value: 'delete_menuPages',
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

			await menu.deferUpdate();

			if (type === 'Edit') {
				if (message.member.user.id !== menu.user.id)
					menu.followUp({
						content: "You cannot access other's pagination."
					});
			}

			if (selected === 'delete_menuPages') {
				if (message.member.user.id !== menu.user.id)
					menu.editReply({
						content: "You cannot access other's pagination."
					});
				else collector.stop('delete');
			}

			for (let i = 0; i < data.length; i++) {
				if (selected === data[i].label) {
					if (type === 'Send') {
						menu.followUp({ embeds: [data[i].embed], ephemeral: true });
					} else if (type === 'Edit') {
						menu.message.edit({ embeds: [data[i].embed] });
					}
				}
			}
		});

		collector.on('end', async (collected, reason: string) => {
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
