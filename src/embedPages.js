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
	style.slash ??= true

	try {
		if (!pages)
			throw new Error(
				'PAGES_NOT_FOUND. You didnt specify any pages to me. See Examples to clarify your doubts. https://github.com/Rahuletto/simply-djs/blob/main/Examples/embedPages.md'
			)

		//Defining all buttons
		const firstBtn = new MessageButton()
			.setCustomId('first_embed')
			.setEmoji(style.firstEmoji)
			.setStyle(style.skipcolor)

		const forwardBtn = new MessageButton()
			.setCustomId('forward_button_embed')
			.setEmoji(style.forwardEmoji)
			.setStyle(style.btncolor)

		const backBtn = new MessageButton()
			.setCustomId('back_button_embed')
			.setEmoji(style.backEmoji)
			.setStyle(style.btncolor)

		const lastBtn = new MessageButton()
			.setCustomId('last_embed')
			.setEmoji(style.lastEmoji)
			.setStyle(style.skipcolor)

		const deleteBtn = new MessageButton()
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
		/** @type {Discord.Message} */
		var m

		if (message instanceof Discord.Interaction && !style.slash) {
			throw new Error(
				'You provided a Interaction but set the slash option to false'
			)
		} else if (message instanceof Discord.Message && style.slash) {
			throw new Error('You provided a Message but set the slash option to true')
		}

		if (style.slash) {
			if (style.pgCount) {
				await message.followUp({
					content: `***Page: 1/${pages.length}***`,
					embeds: [pages[0]],
					components: [pageMovingButtons]
				})
			} else {
				await message.followUp({
					embeds: [pages[0]],
					components: [pageMovingButtons]
				})
			}
			m = await message.fetchReply()
		} else {
			if (style.pgCount) {
				m = await message.reply({
					content: `***Page: 1/${pages.length}***`,
					embeds: [pages[0]],
					components: [pageMovingButtons]
				})
			} else {
				m = await message.reply({
					embeds: [pages[0]],
					components: [pageMovingButtons]
				})
			}
		}

		client.on('interactionCreate', async (b) => {
			if (!b.isButton()) return
			if (b.message.id !== m.id) return

			b.deferUpdate()

			if (style.slash) {
				if (b.user.id !== message.user.id) {
					return b.followUp({
						content: 'You cant change the pages of that embed...',
						ephemeral: true
					})
				}
			} else {
				if (b.user.id !== message.author.id) {
					return b.followUp({
						content: 'You cant change the pages of that embed...',
						ephemeral: true
					})
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
						components: [pageMovingButtons]
					})
				} else {
					m.edit({
						embeds: [pages[currentPage]],
						components: [pageMovingButtons]
					})
				}
			} else {
				b.message.delete()
				b.followUp({ content: 'Message Deleted', ephemeral: true })
			}
		})
	} catch (err) {
		console.log(`Error Occured. | embedPages | Error: ${err.stack}`)
	}
}
module.exports = embedPages
