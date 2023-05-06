import {
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
	TextChannel,
	PermissionFlagsBits
} from 'discord.js';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';

import { SimplyError } from './Error/Error';
import { CustomizableEmbed } from './interfaces/CustomizableEmbed';
import { MessageButtonStyle } from './Others/MessageButtonStyle';
import { toRgb } from './Others/toRgb';
// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/buttonTemplate*
 */

interface buttonTemplate {
	style?: ButtonStyle | 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK';
	label?: string;
	emoji?: string;
}

export type ticketSetupOptions = {
	embed?: CustomizableEmbed;
	button?: buttonTemplate;
	channelId?: string;
	strict: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A Flexible yet Powerful Ticket System | *Requires: [**manageBtn()**](https://simplyd.js.org/docs/handler/manageBtn)*
 *
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/ticketSetup***
 * @example simplydjs.ticketSetup(interaction, { channelId: '0123456789012' })
 */

export async function ticketSetup(
	message: ExtendedMessage | ExtendedInteraction,
	options: ticketSetupOptions = { strict: false }
) {
	try {
		const ch = options.channelId;

		if (!ch || ch == '') {
			if (options.strict)
				throw new SimplyError({
					function: 'ticketSetup',
					title: 'Provide an channel id to send the system panel.',
					tip: `Expected channelId as string in options.. | Received ${
						ch || 'undefined'
					}`
				});
			else
				console.log(
					`SimplyError - ticketSetup | Provide an channel id to send the system panel.\n\n` +
						`Expected channelId as string in options.. | Received ${
							ch || 'undefined'
						}`
				);
		}

		let channel = await message.client.channels.fetch(ch, {
			cache: true
		});

		channel = channel as TextChannel;

		if (!channel) {
			if (options.strict)
				throw new SimplyError({
					function: 'ticketSetup',
					title: `Invalid Channel (or) No VIEW_CHANNEL permission`,
					tip: `Check the permissions (or) Try using another Channel ID.\nReceived ${
						options.channelId || 'undefined'
					}`
				});
			else
				console.log(
					`SimplyError - ticketSetup | Invalid Channel (or) No VIEW_CHANNEL permission\n\nCheck the permissions (or) Try using another Channel ID.\n Received ${
						options.channelId || 'undefined'
					}`
				);
		}

		let interaction: ExtendedInteraction;
		if (message.commandId) {
			interaction = message as ExtendedInteraction;
		}
		const extInteraction = message as ExtendedInteraction;
		const extMessage = message as ExtendedMessage;

		if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
			if (interaction) {
				return await extInteraction.followUp({
					content: 'You are not an admin to create a Ticket Panel',
					ephemeral: true
				});
			} else if (!interaction) {
				return await extMessage.reply({
					content: 'You are not an admin to create a Ticket Panel'
				});
			}
		}

		if (options?.button?.style as string)
			options.button.style = MessageButtonStyle(
				options?.button?.style as string
			);

		const ticketbtn = new ButtonBuilder()
			.setStyle((options?.button?.style as ButtonStyle) || ButtonStyle.Primary)
			.setEmoji(options?.button?.emoji || '🎫')
			.setLabel(options?.button?.label || 'Open a Ticket')
			.setCustomId('create_ticket');

		if (!options.embed) {
			options.embed = {
				footer: {
					text: '©️ Rahuletto. npm i simply-djs',
					iconURL: 'https://i.imgur.com/u8VlLom.png'
				},
				color: toRgb('#406DBC'),
				title: 'Ticket Support'
			};
		}

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
			ticketbtn
		]);

		const embed = new EmbedBuilder()
			.setTitle(options.embed?.title || 'Ticket Support')
			.setColor(options.embed?.color || toRgb('#406DBC'))
			.setDescription(
				options.embed?.description ||
					'🎫 Open a ticket by interacting with the button 🎫'
			)
			.setThumbnail(message.guild.iconURL())
			.setTimestamp()
			.setFooter(
				options.embed?.footer
					? options.embed?.footer
					: {
							text: '©️ Rahuletto. npm i simply-djs',
							iconURL: 'https://i.imgur.com/u8VlLom.png'
					  }
			);

		if (options.embed.author) embed.setAuthor(options.embed.author);
		if (options.embed.fields) embed.setFields(options.embed.fields);
		if (options.embed.image) embed.setImage(options.embed.image);
		if (options.embed.url) embed.setURL(options.embed.url);

		if (interaction) {
			extInteraction.followUp({
				content: 'Done. Setting Ticket to that channel'
			});
			channel.send({ embeds: [embed], components: [row] });
		} else if (!interaction) {
			extMessage.reply({ content: 'Done. Setting Ticket to that channel' });
			channel.send({ embeds: [embed], components: [row] });
		}
	} catch (err: any) {
		if (options.strict)
			throw new SimplyError({
				function: 'ticketSetup',
				title: 'An Error occured when running the function',
				tip: err.stack
			});
		else console.log(`SimplyError - ticketSetup | Error: ${err.stack}`);
	}
}
