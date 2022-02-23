import {
	CommandInteraction,
	MessageButtonStyle,
	Message,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
	MessageEmbedAuthor,
	MessageEmbedFooter,
	ColorResolvable,
	ButtonInteraction
} from 'discord.js'

import chalk from 'chalk'

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

interface CustomEmbed {
	author?: MessageEmbedAuthor
	title?: string
	footer?: MessageEmbedFooter
	color?: ColorResolvable

	credit?: boolean
}

export type calcOptions = {
	embed?: CustomEmbed
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

export async function calculator(
	interaction: Message | CommandInteraction,
	options: calcOptions = {}
): Promise<void> {
	try {
		let button = new Array([], [], [], [], [])
		let row: any[] = []
		let text: string[] = [
			'Clear',
			'(',
			')',
			'/',
			'⌫',
			'7',
			'8',
			'9',
			'*',
			'%',
			'4',
			'5',
			'6',
			'-',
			'^',
			'1',
			'2',
			'3',
			'+',
			'π',
			'.',
			'0',
			'00',
			'=',
			'Delete'
		]
		let current = 0

		if (!options.embed) {
			options.embed = {
				footer: {
					text: '©️ Simply Develop. npm i simply-djs',
					iconURL:
						'https://i.imgur.com/kGAUCNo_d.webp?maxwidth=128&fidelity=grand'
				},
				color: '#075FFF',
				credit: true
			}
		}

		for (let i = 0; i < text.length; i++) {
			if (button[current].length === 5) current++
			button[current].push(createButton(text[i]))
			if (i === text.length - 1) {
				for (let btn of button) row.push(addRow(btn))
			}
		}

		const emb1 = new MessageEmbed()
			.setColor(options.embed?.color || '#075FFF')
			.setFooter(
				options.embed?.credit
					? options.embed?.footer
					: {
							text: '©️ Simply Develop. npm i simply-djs',
							iconURL:
								'https://i.imgur.com/kGAUCNo_d.webp?maxwidth=128&fidelity=grand'
					  }
			)
			.setDescription('```0```')

		if (options.embed.author) {
			emb1.setAuthor(options.embed.author)
		}
		if (options.embed.title) {
			emb1.setTitle(options.embed.title)
		}

		let msg: any

		let int = interaction as CommandInteraction
		let ms = interaction as Message

		//@ts-ignore
		if (interaction.commandId) {
			await int.followUp({
				embeds: [emb1],
				components: row
			})

			msg = await int.fetchReply()
			//@ts-ignore
		} else if (!interaction.commandId) {
			msg = await ms.reply({
				embeds: [emb1],
				components: row
			})
		}

		let isWrong = false
		let time = 300000
		let value = ''

		function createCollector(val: string, result: any = false) {
			const filter = (button: ButtonInteraction) =>
				button.user.id === //@ts-ignore
					(interaction.user ? interaction.user : interaction.author).id &&
				button.customId === 'cal' + val

			let collect = msg.createMessageComponentCollector({
				filter,
				componentType: 'BUTTON',
				time: time
			})

			collect.on('collect', async (x: ButtonInteraction) => {
				if (
					x.user.id !== //@ts-ignore
					(interaction.user ? interaction.user : interaction.author).id
				)
					return

				await x.deferUpdate()

				if (result === 'new') value = '0'
				else if (isWrong) {
					value = val
					isWrong = false
				} else if (value === '0') value = val
				else if (result) {
					isWrong = true
					value = mathEval(
						value.replaceAll('^', '**').replaceAll('%', '/100').replace(' ', '')
					)
				} else value += val
				if (value.includes('⌫')) {
					value = value.slice(0, -2)
					if (value === '') value = ' '
					emb1.setDescription('```' + value + '```')
					await msg
						.edit({
							embeds: [emb1],
							components: row
						})
						.catch(() => {})
				} else if (value.includes('Delete')) return msg.delete().catch(() => {})
				else if (value.includes('Clear')) return (value = '0')
				emb1.setDescription('```' + value + '```')
				await msg
					.edit({
						embeds: [emb1],
						components: row
					})
					.catch(() => {})
			})
		}

		for (let txt of text) {
			let result

			if (txt === 'Clear') result = 'new'
			else if (txt === '=') result = true
			else result = false
			createCollector(txt, result)
		}
		setTimeout(async () => {
			if (!msg) return
			if (!msg.editable) return

			if (msg) {
				if (msg.editable) {
					emb1.setDescription(
						'Your Time for using the calculator ran out (5 minutes)'
					)
					emb1.setColor(0xc90000)
					await msg.edit({ embeds: [emb1], components: [] }).catch(() => {})
				}
			}
		}, time)

		function addRow(btns: MessageButton[]) {
			let row1 = new MessageActionRow()
			for (let btn of btns) {
				row1.addComponents(btn)
			}
			return row1
		}

		function createButton(label: any, style: MessageButtonStyle = 'SECONDARY') {
			if (label === 'Clear') style = 'DANGER'
			else if (label === 'Delete') style = 'DANGER'
			else if (label === '⌫') style = 'DANGER'
			else if (label === 'π') style = 'SECONDARY'
			else if (label === '%') style = 'SECONDARY'
			else if (label === '^') style = 'SECONDARY'
			else if (label === '.') style = 'PRIMARY'
			else if (label === '=') style = 'SUCCESS'
			else if (isNaN(label)) style = 'PRIMARY'
			const btn = new MessageButton()
				.setLabel(label)
				.setStyle(style)
				.setCustomId('cal' + label)
			return btn
		}

		const evalRegex = /^[0-9π\+\%\^\-*\/\.\(\)]*$/
		function mathEval(input: any) {
			try {
				const matched = evalRegex.exec(input)
				if (!matched) return 'Wrong Input'

				return `${input
					.replaceAll('**', '^')
					.replaceAll('/100', '%')} = ${Function(
					`"use strict";let π=Math.PI;return (${input})`
				)()}`
			} catch {
				return 'Wrong Input'
			}
		}
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta(
				'calculator'
			)} | Error: ${err.stack}`
		)
	}
}
