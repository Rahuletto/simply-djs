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
} from 'discord.js'
import chalk from 'chalk'

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/CustomizableEmbed*
 */

interface CustomizableEmbed {
	author?: MessageEmbedAuthor
	title?: string
	footer?: MessageEmbedFooter
	description?: string
	color?: ColorResolvable

	credit?: boolean
}

interface btnTemplate {
	style?: MessageButtonStyle
	label?: string
	emoji?: string
}

export type tSysOptions = {
	embed?: CustomizableEmbed
	button?: btnTemplate
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A **Faster** yet Powerful ticketSystem | *Required: **manageBtn()***
 *
 * @param message
 * @param channel
 * @param options
 *
 * @example simplydjs.ticketSystem(message, message.channel)
 */

export async function ticketSystem(
	message: Message | CommandInteraction,
	channel: TextChannel,
	options: tSysOptions = {}
) {
	try {
		let interaction
		// @ts-ignore
		if (message.commandId) {
			interaction = message
		}
		let int = message as CommandInteraction
		let mes = message as Message

		if (
			// @ts-ignore
			!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
		) {
			if (interaction) {
				return await int.followUp({
					content: 'You are not an admin to create a Ticket Panel',
					ephemeral: true
				})
			} else if (!interaction) {
				return await mes.reply({
					content: 'You are not an admin to create a Ticket Panel'
				})
			}
		}

		let ticketbtn = new MessageButton()
			.setStyle(options?.button?.style || 'PRIMARY')
			.setEmoji(options?.button?.emoji || '🎫')
			.setLabel(options?.button?.label || 'Open a Ticket')
			.setCustomId('create_ticket')

		if (!options.embed) {
			options.embed = {
				footer: {
					text: '©️ Simply Develop. npm i simply-djs',
					iconURL: 'https://i.imgur.com/u8VlLom.png'
				},
				color: '#075FFF',
				title: 'Create an Ticket',
				credit: true
			}
		}

		let a = new MessageActionRow().addComponents([ticketbtn])

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
			)

		if (interaction) {
			int.followUp('Done. Setting Ticket to that channel')
			channel.send({ embeds: [embed], components: [a] })
		} else if (!interaction) {
			channel.send({ embeds: [embed], components: [a] })
		}
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta(
				'ticketSystem'
			)} | Error: ${err.stack}`
		)
	}
}
