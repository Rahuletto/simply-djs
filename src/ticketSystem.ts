import {
	MessageEmbed,
	Message,
	CommandInteraction,
	MessageButton,
	MessageActionRow,
	ColorResolvable,
	MessageEmbedAuthor,
	MessageEmbedFooter,
	MessageButtonStyle,
	TextChannel,
	PermissionFlags,
	Permissions
} from 'discord.js';
import { SimplyError } from './Error/Error';
import chalk from 'chalk';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/CustomizableEmbed*
 */

interface CustomizableEmbed {
	author?: MessageEmbedAuthor;
	title?: string;
	footer?: MessageEmbedFooter;
	description?: string;
	color?: ColorResolvable;

	credit?: boolean;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/btnTemplate*
 */

interface btnTemplate {
	style?: MessageButtonStyle;
	label?: string;
	emoji?: string;
}

export type tSysOptions = {
	embed?: CustomizableEmbed;
	button?: btnTemplate;
	channelId?: string;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A **Faster** yet Powerful ticketSystem | *Requires: [**manageBtn()**](https://simplyd.js.org/docs/handler/manageBtn)*
 *
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/ticketSystem***
 * @example simplydjs.ticketSystem(interaction, { channelId: '0123456789012' })
 */

export async function ticketSystem(
	message: Message | CommandInteraction,
	options: tSysOptions = {}
) {
	try {
		let ch = options.channelId;

		if (!ch || ch == '')
			throw new SimplyError({
				name: 'NOT_SPECIFIED | Provide an channel id to send memes.',
				tip: `Expected channelId as string in options.. | Received ${
					ch || 'undefined'
				}`
			});

		let channel = await message.client.channels.fetch(ch, {
			cache: true
		});

		channel = channel as TextChannel;

		if (!channel)
			throw new SimplyError({
				name: `INVALID_CHID - ${options.channelId} | The channel id you specified is not valid (or) The bot has no VIEW_CHANNEL permission.`,
				tip: 'Check the permissions (or) Try using another Channel ID'
			});

		let interaction;
		// @ts-ignore
		if (message.commandId) {
			interaction = message;
		}
		let int = message as CommandInteraction;
		let mes = message as Message;

		if (
			// @ts-ignore
			!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
		) {
			if (interaction) {
				return await int.followUp({
					content: 'You are not an admin to create a Ticket Panel',
					ephemeral: true
				});
			} else if (!interaction) {
				return await mes.reply({
					content: 'You are not an admin to create a Ticket Panel'
				});
			}
		}

		let ticketbtn = new MessageButton()
			.setStyle(options?.button?.style || 'PRIMARY')
			.setEmoji(options?.button?.emoji || '🎫')
			.setLabel(options?.button?.label || 'Open a Ticket')
			.setCustomId('create_ticket');

		if (!options.embed) {
			options.embed = {
				footer: {
					text: '©️ Simply Develop. npm i simply-djs',
					iconURL: 'https://i.imgur.com/u8VlLom.png'
				},
				color: '#075FFF',
				title: 'Create an Ticket',
				credit: true
			};
		}

		let a = new MessageActionRow().addComponents([ticketbtn]);

		let embed = new MessageEmbed()
			.setTitle(options.embed?.title || 'Giveaways')
			.setColor(options.embed?.color || '#075FFF')
			.setDescription(
				options.embed?.description ||
					'🎫 Create an ticket by interacting with the button 🎫'
			)
			.setThumbnail(message.guild.iconURL())
			.setTimestamp()
			.setFooter(
				options.embed?.credit
					? options.embed?.footer
					: {
							text: '©️ Simply Develop. npm i simply-djs',
							iconURL: 'https://i.imgur.com/u8VlLom.png'
					  }
			);

		if (interaction) {
			int.followUp('Done. Setting Ticket to that channel');
			channel.send({ embeds: [embed], components: [a] });
		} else if (!interaction) {
			channel.send({ embeds: [embed], components: [a] });
		}
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta(
				'ticketSystem'
			)} | Error: ${err.stack}`
		);
	}
}
