const Discord = require('discord.js')

/**
 * @param {Discord.Client} client
 * @param {Discord.MessageReaction} reaction
 * @param {import('../index').starboardOptions} options
 */

/**
 --- options ---
 
  min => Number
  emoji => (Emoji ID) String
  chid => (Channel ID) String
  embedColor => HexColor
 */

async function starboard(client, reaction, options = []) {
	try {
		let minno = options.min || 2
		let min = Number(minno)
		if (!min || min === NaN)
			throw new Error(
				'MIN_IS_NAN | Minimum stars number is Not A Number. Try again.'
			)
		if (min === 0)
			throw new Error('MIN_IS_ZERO | Minimum stars number should not be 0..')

		let event = options.event

		if (event === 'messageReactionAdd') {
			await reaction.fetch()
			if (!options)
				throw new Error(
					'Sorry but starboard got a update which changed everything. Please check out the examples now. | Event: messageReactionAdd'
				)
			if (
				reaction.emoji.id === options.emoji ||
				reaction.emoji.name === '⭐' ||
				reaction.emoji.name === '🌟'
			) {
				let minmax = reaction && reaction.count
				if (minmax < min) return

				const starboard = client.channels.cache.get(options.chid)

				const fetchMsg = await reaction.message.fetch()
				if (!starboard) throw new Error('INVALID_CHANNEL_ID')

				const attachment = fetchMsg.attachments.first()
				const url = attachment ? attachment.url : null

				if (fetchMsg.embeds.length !== 0) return

				const embed = new Discord.MessageEmbed()
					.setAuthor(fetchMsg.author.tag, fetchMsg.author.displayAvatarURL())
					.setColor(options.embedColor || '#FFC83D')
					.setDescription(fetchMsg.content)
					.setTitle(`Jump to message`)
					.setURL(fetchMsg.url)
					.setImage(url)
					.setFooter('⭐ | ID: ' + fetchMsg.id)

				const msgs = await starboard.messages.fetch({ limit: 100 })

				let eemoji = client.emojis.cache.get(options.emoji) || '⭐'

				const existingMsg = msgs.find(async (msg) => {
					if (msg.embeds.length === 1) {
						if (msg.embeds[0] === null || msg.embeds[0] === [])
							return starboard.send({
								content: `**${eemoji} 1**`,
								embeds: [embed]
							})

						if (
							msg.embeds[0] &&
							msg.embeds[0].footer &&
							msg.embeds[0].footer.text === '⭐ | ID: ' + fetchMsg.id
						) {
							let reacts = reaction && reaction.count ? reaction.count : 1

							msg.edit({ content: `**${eemoji} ${reacts}**`, embeds: [embed] })
						} else {
							let reacts = reaction && reaction.count ? reaction.count : 1

							starboard.send({
								content: `**${eemoji} ${reacts}** `,
								embeds: [embed]
							})
						}
					} else {
						let reacts = reaction && reaction.count ? reaction.count : 1
						starboard.send({
							content: `**${eemoji} ${reacts}**`,
							embeds: [embed]
						})
					}
				})
			}
		} else if (event === 'messageReactionRemove') {
			await reaction.fetch()
			if (!options)
				throw new Error(
					'Sorry but starboard got a update which changed everything. Please check out the examples now. | Event: messageReactionRemove'
				)

			if (
				reaction.emoji.id === options.emoji ||
				reaction.emoji.name === '⭐' ||
				reaction.emoji.name === '🌟'
			) {
				const starboard = client.channels.cache.get(options.chid)

				const fetchMsg = await reaction.message.fetch()
				if (!starboard) throw new Error('INVALID_CHANNEL_ID')

				const attachment = fetchMsg.attachments.first()
				const url = attachment ? attachment.url : null

				const embed = new Discord.MessageEmbed()
					.setAuthor(fetchMsg.author.tag, fetchMsg.author.displayAvatarURL())
					.setColor(options.embedColor || '#FFC83D')
					.setDescription(fetchMsg.content)
					.setTitle(`Jump to message`)
					.setURL(fetchMsg.url)
					.setImage(url)
					.setFooter('⭐ | ID: ' + fetchMsg.id)

				const msgs = await starboard.messages.fetch({ limit: 100 })

				let eemoji = client.emojis.cache.get(options.emoji) || '⭐'

				const existingMsg = msgs.find(async (msg) => {
					if (msg.embeds.length === 1) {
						if (
							msg.embeds[0] &&
							msg.embeds[0].footer &&
							msg.embeds[0].footer.text === '⭐ | ID: ' + fetchMsg.id
						) {
							let reacts = reaction && reaction.count

							if (reacts < min) return msg.delete()

							if (reacts === 0) {
								msg.delete()
							} else {
								msg.edit({ content: `**${eemoji} ${reacts}**` })
							}
						}
					}
				})
			}
		} else if (event === 'messageDelete') {
			const starboard = client.channels.cache.get(options.chid)
			if (!options)
				throw new Error(
					'Sorry but starboard got a update which changed everything. Please check out the examples now. | Event: messageDelete'
				)
			if (!starboard) throw new Error('INVALID_CHANNEL_ID')

			const msgs = await starboard.messages.fetch({ limit: 100 })

			const existingMsg = msgs.find(async (msg) => {
				if (
					msg.embeds[0] &&
					msg.embeds[0].footer &&
					msg.embeds[0].footer.text === '⭐ | ID: ' + reaction.id
				) {
					msg.delete()
				}
			})
		} else
			throw new Error(
				'There are only 3 Events available in starboard function. Please read the examples for more information.'
			)
	} catch (err) {
		console.log(`Error Occured. | starboard | Error: ${err.stack}`)
	}
}

module.exports = starboard
