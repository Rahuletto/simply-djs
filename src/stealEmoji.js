const Discord = require('discord.js')

/**
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {import('../index').stealEmojiOptions} options
 */

/**
 --- options ---
 
  credit => Boolean

  embedFoot => String
  embedTitle => String
  embedColor => HexColor

  failedMsg => String
 */

async function stealEmoji(message, args, options = []) {
	try {
		if (!message.member.permissions.has('MANAGE_EMOJIS_AND_STICKERS'))
			return message.channel.send(
				'❌ You Must Have • Server Moderator or ・ Admin Role To Use This Command ❌'
			)

		const attachment = message.attachments.first()
		const uri = attachment
		if (!uri) {
			if (args[0].startsWith('https://cdn.discordapp.com/emojis')) {
				let url = args[0]

				if (args[1]) {
					name = args[1]
				} else {
					name = 'emojiURL'
				}
				message.guild.emojis
					.create(url, name)
					.then((emoji) => {
						if (options.credit === false) {
							foot = options.embedFoot || 'Stealing is illegal'
						} else {
							foot = '©️ Simply Develop. npm i simply-djs'
						}

						const mentionav = new Discord.MessageEmbed()
							.setTitle(
								options.embedTitle ||
									`Emoji Added ;)\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``
							)
							.setThumbnail(url)
							.setColor(options.embedColor || 0x075fff)
							.setFooter(foot)

						message.channel.send({ embeds: [mentionav] })
					})
					.catch((err) =>
						message.channel.send({ content: 'Error Occured. ' + err })
					)
			} else {
				const hasEmoteRegex = /<a?:.+:\d+>/gm
				const emoteRegex = /<:.+:(\d+)>/gm
				const animatedEmoteRegex = /<a:.+:(\d+)>/gm

				const emoj = message.content.match(hasEmoteRegex)

				if ((emoji = emoteRegex.exec(emoj))) {
					const url =
						'https://cdn.discordapp.com/emojis/' + emoji[1] + '.png?v=1'

					if (args[1]) {
						name = args[1]
					} else {
						name = emoji[1]
					}

					message.guild.emojis
						.create(url, name)
						.then((emoji) => {
							if (options.credit === false) {
								foot = options.embedFoot || 'Stealing is illegal'
							} else {
								foot = '©️ Simply Develop. npm i simply-djs'
							}

							const mentionav = new Discord.MessageEmbed()
								.setTitle(
									options.embedTitle ||
										`Emoji Added ;)\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``
								)
								.setThumbnail(url)
								.setColor(options.embedColor || 0x075fff)
								.setFooter(foot)

							message.channel.send({ embeds: [mentionav] })
						})
						.catch((err) =>
							message.channel.send({ content: 'Error Occured. ' + err })
						)
				} else if ((emoji = animatedEmoteRegex.exec(emoj))) {
					const url =
						'https://cdn.discordapp.com/emojis/' + emoji[1] + '.gif?v=1'

					if (args[1]) {
						name = args[1]
					} else {
						name = emoji[1]
					}
					message.guild.emojis
						.create(url, name)
						.then((emoji) => {
							if (options.credit === false) {
								foot = options.embedFoot || 'Stealing is illegal'
							} else {
								foot = '©️ Simply Develop. npm i simply-djs'
							}

							const mentionav = new Discord.MessageEmbed()
								.setTitle(
									options.embedTitle ||
										`Emoji Added ;)\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``
								)
								.setThumbnail(url)
								.setColor(options.embedColor || 0x075fff)
								.setFooter(foot)

							message.channel.send({ embeds: [mentionav] })
						})
						.catch((err) =>
							message.channel.send({ content: 'Error Occured. ' + err })
						)
				} else {
					message.channel.send({
						content: options.failedMsg || "Couldn't find an emoji from it"
					})
				}
			}
		} else if (uri) {
			if (uri.size > 256000) {
				const mentionav = new Discord.MessageEmbed()
					.setTitle(`Oh no.. Its too big`)
					.setDescription(
						'The image/gif you trying to add as emoji is too big in size\nDiscord only allows files which is below than `256kb` Try again after compressing.'
					)
					.setThumbnail(uri)
					.setColor(0xc90000)
					.setFooter(foot)

				message.channel.send({ embeds: [mentionav] })
			} else {
				if (args[0]) {
					name = args[0]
				} else {
					name = 'image'
				}
				const url = attachment.url
				message.guild.emojis
					.create(url, name)
					.then((emoji) => {
						if (options.credit === false) {
							foot = options.embedFoot || 'Stealing is illegal'
						} else {
							foot = '©️ Simply Develop. npm i simply-djs'
						}

						const mentionav = new Discord.MessageEmbed()
							.setTitle(
								options.embedTitle ||
									`Emoji Added ;)\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``
							)
							.setThumbnail(url)
							.setColor(options.embedColor || 0x075fff)
							.setFooter(foot)

						message.channel.send({ embeds: [mentionav] })
					})
					.catch((err) =>
						message.channel.send({ content: 'Error Occured. ' + err })
					)
			}
		}
	} catch (err) {
		console.log(`Error Occured. | stealEmoji | Error: ${err.stack}`)
	}
}
module.exports = stealEmoji
