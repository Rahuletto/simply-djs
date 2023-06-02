import {
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
	TextChannel,
	PermissionFlagsBits,
	MessageMentions
} from 'discord.js';
import {
	ExtendedInteraction,
	ExtendedMessage,
	CustomizableEmbed,
	CustomizableButton
} from './typedef';

import { SimplyError } from './error/SimplyError';
import { toButtonStyle, toRgb } from './misc';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/systems/ticketSetup#ticketsetupoptions
 */

export type ticketSetupOptions = {
	embed?: CustomizableEmbed;
	button?: CustomizableButton;
	channelId?: string;
	strict: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A Flexible yet Powerful Ticket System | *Requires: [**manageBtn()**](https://simplyd.js.org/docs/handler/manageBtn)*
 *
 * @param msgOrint
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/systems/ticketSetup
 * @example simplydjs.ticketSetup(interaction, { channelId: '0123456789012' })
 */

export async function ticketSetup(
	msgOrint: ExtendedMessage | ExtendedInteraction,
	options: ticketSetupOptions = { strict: false }
) {
	try {
		const { client } = msgOrint;
		let channel;
		let interaction: ExtendedInteraction;
		if (msgOrint.commandId) {
			interaction = msgOrint as ExtendedInteraction;

			channel =
				client.channels.cache.get(options?.channelId as string) ||
				interaction.options.get('channel').channel;
		} else if (!msgOrint.commandId && msgOrint.content) {
			channel =
				client.channels.cache.get(options?.channelId as string) ||
				(msgOrint.mentions as MessageMentions).channels.first();
		}
		const extInteraction = msgOrint as ExtendedInteraction;
		const extMessage = msgOrint as ExtendedMessage;

		if (!channel || !channel.id) {
			if (options?.strict)
				throw new SimplyError({
					function: 'ticketSetup',
					title: 'Provide an channel id to send the system panel.',
					tip: `Expected channelId as string in options.. | Received ${
						options.channelId || 'undefined'
					}`
				});
			else
				console.log(
					`SimplyError - ticketSetup | Provide an channel id to send the system panel.\n\n` +
						`Expected channelId as string in options.. | Received ${
							options.channelId || 'undefined'
						}`
				);
		}

		channel = channel as TextChannel;

		if (!channel) {
			if (options?.strict)
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

		if (!msgOrint.member.permissions.has(PermissionFlagsBits.Administrator)) {
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
			options.button.style = toButtonStyle(options?.button?.style as string);

		const ticketbtn = new ButtonBuilder()
			.setStyle((options?.button?.style as ButtonStyle) || ButtonStyle.Primary)
			.setEmoji(options?.button?.emoji || '🎫')
			.setLabel(options?.button?.label || 'Open a Ticket')
			.setCustomId('create_ticket');

		if (!options.embed) {
			options.embed = {
				footer: {
					text: '©️ Rahuletto. npm i simply-djs',
					iconURL: 'https://i.imgur.com/XFUIwPh.png'
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
			.setThumbnail(msgOrint.guild.iconURL())
			.setTimestamp()
			.setFooter(
				options.embed?.footer
					? options.embed?.footer
					: {
							text: '©️ Rahuletto. npm i simply-djs',
							iconURL: 'https://i.imgur.com/XFUIwPh.png'
					  }
			);

		if (options?.embed?.fields) embed.setFields(options.embed?.fields);
		if (options?.embed?.author) embed.setAuthor(options.embed?.author);
		if (options?.embed?.image) embed.setImage(options.embed?.image);
		if (options?.embed?.thumbnail) embed.setThumbnail(options.embed?.thumbnail);
		if (options?.embed?.timestamp) embed.setTimestamp(options.embed?.timestamp);
		if (options?.embed?.title) embed.setTitle(options.embed?.title);
		if (options?.embed?.url) embed.setURL(options.embed?.url);

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
		if (options?.strict)
			throw new SimplyError({
				function: 'ticketSetup',
				title: 'An Error occured when running the function',
				tip: err.stack
			});
		else console.log(`SimplyError - ticketSetup | Error: ${err.stack}`);
	}
}
