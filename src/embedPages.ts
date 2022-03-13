import {
	CommandInteraction,
	MessageButtonStyle,
	Message,
	MessageEmbed,
	MessageButton,
	MessageActionRow
} from 'discord.js'

import chalk from 'chalk'
import SimplyError from './Error/Error'

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

interface btnTemp {
	style?: MessageButtonStyle
	emoji?: string
}

interface btnz {
	firstBtn?: btnTemp
	nextBtn?: btnTemp
	backBtn?: btnTemp
	lastBtn?: btnTemp
	deleteBtn?: btnTemp
}

export type pagesOption = {
	buttons?: btnz

	skips?: boolean
	delete?: boolean
	dynamic?: boolean
	count?: boolean

	rows?: MessageActionRow[]
	timeout?: number
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

export async function embedPages(
	message: Message | CommandInteraction,
	pages: MessageEmbed[],
	options: pagesOption = {}
): Promise<any> {
	try {
		options.skips ??= true
		options.delete ??= true
		options.dynamic ??= false
		options.count ??= false

		if (!pages)
			throw new SimplyError(
				'PAGES_NOT_FOUND. You didnt specify any pages to me.',
				'pages option should be Array of MessageEmbeds.'
			)

		let comps: MessageActionRow[]

		if (options.rows) {
			if (!Array.isArray(options.rows))
				throw new SimplyError(
					'ARR_NOT_FOUND. The custom rows (options.rows) you specified is not a Array.',
					'Please specify a Array of custom rows. like [row1, row2]'
				)
			comps = options.rows
		} else {
			comps = []
		}

		options.buttons = {
			firstBtn: {
				style: options.buttons?.firstBtn?.style || 'PRIMARY',
				emoji: options.buttons?.firstBtn?.emoji || '⏪'
			},
			nextBtn: {
				style: options.buttons?.nextBtn?.style || 'SUCCESS',
				emoji: options.buttons?.nextBtn?.emoji || '▶️'
			},
			backBtn: {
				style: options.buttons?.backBtn?.style || 'SUCCESS',
				emoji: options.buttons?.backBtn?.emoji || '◀️'
			},
			lastBtn: {
				style: options.buttons?.lastBtn?.style || 'PRIMARY',
				emoji: options.buttons?.lastBtn?.emoji || '⏩'
			},

			deleteBtn: {
				style: options.buttons?.deleteBtn?.style || 'DANGER',
				emoji: options.buttons?.deleteBtn?.emoji || '🗑'
			}
		}

		//Defining all buttons
		let firstBtn = new MessageButton()
			.setCustomId('first_embed')
			.setEmoji(options.buttons.firstBtn.emoji)
			.setStyle(options.buttons.firstBtn.style)

		let forwardBtn = new MessageButton()
			.setCustomId('forward_button_embed')
			.setEmoji(options.buttons.nextBtn.emoji)
			.setStyle(options.buttons.nextBtn.style)

		if (options.dynamic) {
			firstBtn.setDisabled(true)
			forwardBtn.setDisabled(true)
		}

		let backBtn = new MessageButton()
			.setCustomId('back_button_embed')
			.setEmoji(options.buttons.backBtn.emoji)
			.setStyle(options.buttons.backBtn.style)

		let lastBtn = new MessageButton()
			.setCustomId('last_embed')
			.setEmoji(options.buttons.lastBtn.emoji)
			.setStyle(options.buttons.lastBtn.style)

		let deleteBtn = new MessageButton()
			.setCustomId('delete_embed')
			.setEmoji(options.buttons.deleteBtn.emoji)
			.setStyle(options.buttons.deleteBtn.style)

		let btnCollection: any[] = []
		//Creating the MessageActionRow
		let pageMovingButtons = new MessageActionRow()
		if (options.skips == true) {
			if (options.delete) {
				btnCollection = [firstBtn, backBtn, deleteBtn, forwardBtn, lastBtn]
			} else {
				btnCollection = [firstBtn, backBtn, forwardBtn, lastBtn]
			}
		} else {
			if (options.delete) {
				btnCollection = [backBtn, deleteBtn, forwardBtn]
			} else {
				btnCollection = [backBtn, forwardBtn]
			}
		}

		pageMovingButtons.addComponents(btnCollection)

		var currentPage = 0

		comps.push(pageMovingButtons)

		let interaction

		//@ts-ignore
		if (message.commandId) {
			interaction = message
		}

		var m: any

		let int = message as CommandInteraction
		let ms = message as Message

		if (interaction) {
			if (options.count) {
				await int.followUp({
					embeds: [pages[0].setFooter({ text: `Page 1/${pages.length}` })],
					components: comps,
					allowedMentions: { repliedUser: false }
				})
			} else {
				await int.followUp({
					embeds: [pages[0]],
					components: comps,
					allowedMentions: { repliedUser: false }
				})
			}
			m = await int.fetchReply()
		} else if (!interaction) {
			if (options.count) {
				m = await ms.reply({
					embeds: [pages[0].setFooter({ text: `Page 1/${pages.length}` })],
					components: comps,
					allowedMentions: { repliedUser: false }
				})
			} else {
				m = await message.reply({
					embeds: [pages[0]],
					components: comps,
					allowedMentions: { repliedUser: false }
				})
			}
		}

		let filter = (
			m: any //@ts-ignore
		) => m.user.id === (message.user ? message.user : message.author).id

		let collector = m.createMessageComponentCollector({
			time: options.timeout || 120000,
			filter,
			componentType: 'BUTTON'
		})

		collector.on('collect', async (b: any) => {
			if (!b.isButton()) return
			if (b.message.id !== m.id) return

			await b.deferUpdate()

			if (b.customId == 'back_button_embed') {
				if (currentPage - 1 < 0) currentPage = pages.length - 1
				else currentPage -= 1
			} else if (b.customId == 'forward_button_embed') {
				if (currentPage + 1 == pages.length) currentPage = 0
				else currentPage += 1
			} else if (b.customId == 'last_embed') {
				currentPage = pages.length - 1
			} else if (b.customId == 'first_embed') {
				currentPage = 0
			}

			if (options.dynamic) {
				if (currentPage === 0) {
					let bt = comps[0].components[0]
					bt.disabled = true
					if (options.skips) {
						let inde = comps[0].components[1]
						inde.disabled = true
						comps[0].components[1] = inde
					}

					comps[0].components[0] = bt
				} else {
					let bt = comps[0].components[0]
					bt.disabled = false
					if (options.skips) {
						let inde = comps[0].components[1]
						inde.disabled = false
						comps[0].components[1] = inde
					}
					comps[0].components[0] = bt
				}
				if (currentPage === pages.length - 1) {
					if (options.skips) {
						let bt = comps[0].components[3]
						let inde = comps[0].components[4]

						inde.disabled = true
						bt.disabled = true

						comps[0].components[3] = bt
						comps[0].components[4] = inde
					} else {
						let bt = comps[0].components[2]

						bt.disabled = true

						comps[0].components[2] = bt
					}
				} else {
					if (options.skips) {
						let bt = comps[0].components[3]
						let inde = comps[0].components[4]

						inde.disabled = false
						bt.disabled = false

						comps[0].components[3] = bt
						comps[0].components[4] = inde
					} else {
						let bt = comps[0].components[2]

						bt.disabled = false

						comps[0].components[2] = bt
					}
				}
			}

			if (b.customId !== 'delete_embed') {
				if (options.count) {
					m.edit({
						embeds: [
							pages[currentPage].setFooter({
								text: `***Page: ${currentPage + 1}/${pages.length}***`
							})
						],
						components: comps,
						allowedMentions: { repliedUser: false }
					})
				} else {
					m.edit({
						embeds: [pages[currentPage]],
						components: comps,
						allowedMentions: { repliedUser: false }
					})
				}
			} else if (b.customId === 'delete_embed') {
				collector.stop('del')
			}
		})

		collector.on('end', async (coll: any, reason: string) => {
			if (reason === 'del') {
				await m.delete().catch(() => {})
			} else {
				let disab: any[] = []

				btnCollection.forEach((a) => {
					disab.push(a.setDisabled(true))
				})

				pageMovingButtons = new MessageActionRow().addComponents(disab)

				m.edit({ components: [pageMovingButtons] })
			}
		})
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta(
				'embedPages'
			)} | Error: ${err.stack}`
		)
	}
}
