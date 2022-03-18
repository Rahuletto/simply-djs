import {
	Client,
	CommandInteraction,
	MessageButtonStyle,
	TextChannel,
	Role,
	Message,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
	GuildMember
} from 'discord.js'

import { SimplyError } from './Error/Error'
import chalk from 'chalk'

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

interface dataObj {
	role?: string
	label?: string
	emoji?: string
	style?: MessageButtonStyle
	url?: `https://${string}`
}

export type btnOptions = {
	embed?: MessageEmbed
	content?: string
	data?: dataObj[]
}

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
				name: 'Expected data object in options.. Received [undefined]',
				tip: 'Provide an Data option to make buttons'
			})

		let msg = message as Message
		let int = message as CommandInteraction

		//@ts-ignore
		if (message.commandId) {
			//@ts-ignore
			const member = interaction.member as GuildMember
			if (!member.permissions.has('ADMINISTRATOR'))
				int.followUp({
					content: 'You need `ADMINISTRATOR` permission to use this command'
				})
			return //@ts-ignore
		} else if (!message.customId) {
			if (!msg.member.permissions.has('ADMINISTRATOR'))
				return await msg.reply({
					content: 'You need `ADMINISTRATOR` permission to use this command'
				})
		}

		let row: any[] = []
		let data = options.data

		if (data.length <= 5) {
			let button = new Array([])
			btnEngine(data, button, row)
		} else if (data.length > 5 && data.length <= 10) {
			let button = new Array([], [])
			btnEngine(data, button, row)
		} else if (data.length > 11 && data.length <= 15) {
			let button = new Array([], [], [])
			btnEngine(data, button, row)
		} else if (data.length > 16 && data.length <= 20) {
			let button = new Array([], [], [], [])
			btnEngine(data, button, row)
		} else if (data.length > 21 && data.length <= 25) {
			let button = new Array([], [], [], [], [])
			btnEngine(data, button, row)
		} else if (data.length > 25) {
			throw new SimplyError({
				name: 'Reached the limit of 25 buttons..',
				tip: 'Discord allows only 25 buttons in a message. Send a new message with more buttons.'
			})
		}
		async function btnEngine(data: dataObj[], button: any[], row: any[]) {
			let current = 0

			for (let i = 0; i < data.length; i++) {
				if (button[current].length === 5) current++

				let emoji = data[i].emoji || null
				let clr = data[i].style || 'SECONDARY'
				let url = ''
				let role: Role | null = message.guild.roles.cache.find(
					(r) => r.id === data[i].role
				)
				let label = data[i].label || role?.name

				if (!role && clr === 'LINK') {
					url = data[i].url
					button[current].push(createLink(label, url, clr, emoji))
				} else {
					button[current].push(createButton(label, role, clr, emoji))
				}
				if (i === data.length - 1) {
					for (let btn of button) row.push(addRow(btn))
				}
			}

			if (!options.embed && !options.content)
				throw new SimplyError({
					name: 'Expected embed (or) content options to send. Received [undefined]',
					tip: 'Provide an embed (or) content in the options.'
				})

			let emb = options.embed

			if ((message as CommandInteraction).commandId) {
				;(message as CommandInteraction).followUp({
					embeds: [emb],
					components: row
				})
			} else if (!(message as CommandInteraction).commandId) {
				message.channel.send({
					embeds: [emb],
					components: row
				})
			}

			function addRow(btns: any) {
				let row1 = new MessageActionRow()
				for (let btn of btns) {
					row1.addComponents(btn)
				}
				return row1
			}

			async function createLink(
				label: string,
				url: string,
				color: string,
				emoji: string
			) {
				if (!emoji || emoji === null) {
					const btn = new MessageButton()
						.setLabel(label)
						.setStyle('LINK')
						.setURL(url)
					return btn
				} else if (emoji && emoji !== null) {
					const btn = new MessageButton()
						.setLabel(label)
						.setStyle('LINK')
						.setURL(url)
						.setEmoji(emoji)
					return btn
				}
			}

			async function createButton(
				label: string,
				role: Role,
				color: MessageButtonStyle,
				emoji: string
			) {
				if (!emoji || emoji === null) {
					const btn = new MessageButton()
						.setLabel(label)
						.setStyle(color)
						.setCustomId('role-' + role.id)
					return btn
				} else if (emoji && emoji !== null) {
					const btn = new MessageButton()
						.setLabel(label)
						.setStyle(color)
						.setCustomId('role-' + role.id)
						.setEmoji(emoji)
					return btn
				}
			}
		}
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta('btnRole')} | Error: ${
				err.stack
			}`
		)
	}
}
