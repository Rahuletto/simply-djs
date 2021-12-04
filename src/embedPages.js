const Discord = require('discord.js')
const { MessageButton, MessageActionRow } = Discord

/**
 * @param {Discord.CommandInteraction | Message} message
 * @param {Discord.MessageEmbed[]} pages
 * @param {import('../index').embedPagesOptions} style
 */

/**
 --- options ---
 
  firstEmoji => (Emoji ID) String
  forwardEmoji => (Emoji ID) String
  backEmoji => (Emoji ID) String
  lastEmoji => (Emoji ID) String
  delEmoji => (Emoji ID) String

  btncolor => (ButtonColor) String
  delcolor => (ButtonColor) String
  skipcolor => (ButtonColor) String

  skipBtn => Boolean
  delBtn => Boolean

  pgCount => Boolean
  slash => Boolean

  timeout => Number
  rows = Array (ActionRows)
 */

async function embedPages(client, message, pages, style = {}) {
	//Setting all default values
	style.firstEmoji ||= '⏪'
	style.forwardEmoji ||= '▶️'
	style.backEmoji ||= '◀️'
	style.lastEmoji ||= '⏩'
	style.btncolor ||= 'SUCCESS'
	style.delEmoji ||= '🗑'
	style.delcolor ||= 'DANGER'
	style.skipcolor ||= 'PRIMARY'
	style.pgCount ??= false
	style.skipBtn ??= true
	style.delBtn ??= true

	try {
		if (!pages)
			throw new Error('PAGES_NOT_FOUND. You didnt specify any pages to me.')

		let comps

		if (style.rows) {
			if (!Array.isArray(style.rows))
				throw new Error(
					'ARR_NOT_FOUND. The custom rows (style.rows) you specified is not a Array.'
				)
			comps = rows
		} else {
			comps = []
		}
		//Defining all buttons
		let firstBtn = new MessageButton()
			.setCustomId('first_embed')
			.setEmoji(style.firstEmoji)
			.setStyle(style.skipcolor)

		let forwardBtn = new MessageButton()
			.setCustomId('forward_button_embed')
			.setEmoji(style.forwardEmoji)
			.setStyle(style.btncolor)

		let backBtn = new MessageButton()
			.setCustomId('back_button_embed')
			.setEmoji(style.backEmoji)
			.setStyle(style.btncolor)

		let lastBtn = new MessageButton()
			.setCustomId('last_embed')
			.setEmoji(style.lastEmoji)
			.setStyle(style.skipcolor)

		let deleteBtn = new MessageButton()
			.setCustomId('delete_embed')
			.setEmoji(style.delEmoji)
			.setStyle(style.delcolor)

		//Creating the MessageActionRow
		let pageMovingButtons = new MessageActionRow()
		if (style.skipBtn == true) {
			if (style.delBtn) {
				pageMovingButtons.addComponents([
					firstBtn,
					backBtn,
					deleteBtn,
					forwardBtn,
					lastBtn
				])
			} else {
				pageMovingButtons.addComponents([
					firstBtn,
					backBtn,
					forwardBtn,
					lastBtn
				])
			}
		} else {
			if (style.delBtn) {
				pageMovingButtons.addComponents([backBtn, deleteBtn, forwardBtn])
			} else {
				pageMovingButtons.addComponents([backBtn, forwardBtn])
			}
		}

		var currentPage = 0

		comps.push(pageMovingButtons)

		/** @type {Discord.Message} */
		var m

		if (style.slash === true) {
			if (style.pgCount) {
				await message.followUp({
					content: `***Page: 1/${pages.length}***`,
					embeds: [pages[0]],
					components: comps,
					allowedMentions: { repliedUser: false }
				})
			} else {
				await message.followUp({
					embeds: [pages[0]],
					components: comps,
					allowedMentions: { repliedUser: false }
				})
			}
			m = await message.fetchReply()
		} else {
			if (style.pgCount) {
				m = await message.reply({
					content: `***Page: 1/${pages.length}***`,
					embeds: [pages[0]],
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

		let collector = m.createMessageComponentCollector({
			time: style.timeout || 120000
		})

		collector.on('collect', async (b) => {
			if (!b.isButton()) return
			if (b.message.id !== m.id) return

			b.deferUpdate()

			if (style.slash === true) {
				if (b.user.id !== message.user.id) {
					return
				}
			} else {
				if (b.user.id !== message.author.id) {
					return
				}
			}

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

			if (b.customId !== 'delete_embed') {
				if (style.pgCount) {
					m.edit({
						content: `***Page: ${currentPage + 1}/${pages.length}***`,
						embeds: [pages[currentPage]],
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
			} else {
				try {
					b.message.delete()
				} catch {}
			}
		})

		collector.on('end', async (collected) => {
			firstBtn = new MessageButton()
				.setCustomId('first_embed')
				.setEmoji(style.firstEmoji)
				.setStyle(style.skipcolor)
				.setDisabled(true)

			forwardBtn = new MessageButton()
				.setCustomId('forward_button_embed')
				.setEmoji(style.forwardEmoji)
				.setStyle(style.btncolor)
				.setDisabled(true)

			backBtn = new MessageButton()
				.setCustomId('back_button_embed')
				.setEmoji(style.backEmoji)
				.setStyle(style.btncolor)
				.setDisabled(true)

			lastBtn = new MessageButton()
				.setCustomId('last_embed')
				.setEmoji(style.lastEmoji)
				.setStyle(style.skipcolor)
				.setDisabled(true)

			deleteBtn = new MessageButton()
				.setCustomId('delete_embed')
				.setEmoji(style.delEmoji)
				.setStyle(style.delcolor)
				.setDisabled(true)

			//Creating the MessageActionRow
			pageMovingButtons = new MessageActionRow()
			if (style.skipBtn == true) {
				if (style.delBtn) {
					pageMovingButtons.addComponents([
						firstBtn,
						backBtn,
						deleteBtn,
						forwardBtn,
						lastBtn
					])
				} else {
					pageMovingButtons.addComponents([
						firstBtn,
						backBtn,
						forwardBtn,
						lastBtn
					])
				}
			} else {
				if (style.delBtn) {
					pageMovingButtons.addComponents([backBtn, deleteBtn, forwardBtn])
				} else {
					pageMovingButtons.addComponents([backBtn, forwardBtn])
				}
			}

			m.edit({ components: [pageMovingButtons] })
		})
	} catch (err) {
		console.log(`Error Occured. | embedPages | Error: ${err.stack}`)
	}
}

module.exports = embedPages
