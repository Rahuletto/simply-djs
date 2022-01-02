const Discord = require('discord.js')

const colorMap = {
	grey: 'SECONDARY',
	red: 'DANGER',
	green: 'SUCCESS',
	blurple: 'PRIMARY'
}

/**
 * @param {(Discord.CommandInteraction | Discord.Message)} message
 * @param {import('../index').rpsOptions} options
 */

/**
 --- options ---
 
  credit => Boolean

  embedColor => HexColor
  timeoutEmbedColor => HexColor
  drawEmbedColor => HexColor
  winEmbedColor => HexCOlor

  rockColor => (ButtonColor) String
  paperColor => (ButtonColor) String
  scissorsColor => (ButtonColor) String

  embedFoot => String

  userSlash => String
 */

async function rps(msgOrInter, options = {}) {
	return new Promise(async (resolve) => {
		//Default values
		options.credit ??= true

		options.embedColor ??= '#075FFF'
		options.timeoutEmbedColor ??= '#cc0000'
		options.drawEmbedColor ??= '#075FFF'
		options.winEmbedColor ??= '#06bd00'
		/**
		 * This looks kinda weird but,
		 * (colorMap[options.rockColor] || options.rockColor) =
		 * if rockColor is in the colorMap then its the mapped color (e. g. grey -> SECONDARY)
		 * if its undefined/null it's SECONDARY
		 * if its a normal string its the string
		 */
		options.rockColor =
			colorMap[options.rockColor] || options.rockColor || 'SECONDARY'
		options.paperColor =
			colorMap[options.paperColor] || options.paperColor || 'SECONDARY'
		options.scissorsColor =
			colorMap[options.scissorsColor] || options.scissorsColor || 'SECONDARY'

		let foot = options.embedFoot
		if (options.credit === false) foot ??= 'Rock Paper Scissors'
		else foot ??= '©️ Simply Develop. | By- ImpassiveMoon + Rahuletto'

		//Accept decline buttons
		const accept = new Discord.MessageButton()
			.setLabel('Accept')
			.setStyle('SUCCESS')
			.setCustomId('accept')

		const decline = new Discord.MessageButton()
			.setLabel('Decline')
			.setStyle('DANGER')
			.setCustomId('decline')

		const acceptComponents = new Discord.MessageActionRow().addComponents([
			accept,
			decline
		])

		//RPS Buttons
		const rock = new Discord.MessageButton()
			.setLabel('ROCK')
			.setCustomId('rock')
			.setStyle(options.rockColor)
			.setEmoji('🪨')

		const paper = new Discord.MessageButton()
			.setLabel('PAPER')
			.setCustomId('paper')
			.setStyle(options.paperColor)
			.setEmoji('📄')

		const scissors = new Discord.MessageButton()
			.setLabel('SCISSORS')
			.setCustomId('scissors')
			.setStyle(options.scissorsColor)
			.setEmoji('✂️')

		const rpsComponents = new Discord.MessageActionRow().addComponents([
			rock,
			paper,
			scissors
		])

		//Embeds
		const timeoutEmbed = new Discord.MessageEmbed()
			.setTitle('Game Timed Out!')
			.setColor(options.timeoutEmbedColor)
			.setDescription('One or more players did not make a move in time(30s)')
			.setFooter(foot)

		try {
			let opponent
			let interaction
			let message

			if (msgOrInter.commandId) {
				interaction = msgOrInter
				opponent = interaction.options.getUser(options.userSlash || 'user')
			} else if (!msgOrInter.commandId) {
				message = msgOrInter
				opponent = message.mentions.members.first()?.user
			}

			if (!msgOrInter.commandId) {
				if (!opponent) return message.reply('No opponent mentioned!')
				if (opponent.bot) return message.reply('You cannot play against bots')
				if (opponent.id === message.author.id)
					return message.reply('You cannot play by yourself!')
			} else if (msgOrInter.commandId) {
				if (!opponent)
					return await interaction.followUp({
						content: 'No opponent mentioned!',
						ephemeral: true
					})
				if (opponent.bot)
					return await interaction.followUp({
						content: "You can't play against bots",
						ephemeral: true
					})
				if (opponent.id === interaction.user.id)
					return await interaction.followUp({
						content: 'You cannot play by yourself!',
						ephemeral: true
					})
			}

			const acceptEmbed = new Discord.MessageEmbed()
				.setTitle(`Waiting for ${opponent.tag} to accept!`)
				.setAuthor(
					(interaction ? interaction.user : message.author).tag,
					(interaction ? interaction.user : message.author).displayAvatarURL()
				)
				.setColor(options.embedColor)
				.setFooter(foot)

			/** @type {Discord.Message} */
			let m

			if (msgOrInter.commandId) {
				m = await interaction.followUp({
					content: `Hey <@${opponent.id}>. You got a RPS invite`,
					embeds: [acceptEmbed],
					components: [acceptComponents]
				})
			} else if (!msgOrInter.commandId) {
				m = await message.reply({
					content: `Hey <@${opponent.id}>. You got a RPS invite`,
					embeds: [acceptEmbed],
					components: [acceptComponents]
				})
			}

			const acceptCollector = m.createMessageComponentCollector({
				type: 'BUTTON',
				time: 30000
			})

			acceptCollector.on('collect', async (button) => {
				if (button.user.id !== opponent.id)
					return await button.reply({
						content: 'You cannot play the game.',
						ephemeral: true
					})

				await button.deferUpdate()

				if (button.customId == 'decline') {
					return acceptCollector.stop('decline')
				}

				const selectEmbed = new Discord.MessageEmbed()
					.setTitle(
						`${(interaction ? interaction.user : message.author).tag} VS. ${
							opponent.tag
						}`
					)
					.setColor(options.embedColor)
					.setFooter(foot)
					.setDescription('Select 🪨, 📄, or ✂️')

				if (msgOrInter.commandId) {
					await interaction.editReply({
						content: '**Lets play..**',
						embeds: [selectEmbed],
						components: [rpsComponents]
					})
				} else if (!msgOrInter.commandId) {
					await m.edit({
						content: '**Lets play..**',
						embeds: [selectEmbed],
						components: [rpsComponents]
					})
				}

				acceptCollector.stop()
				let ids = new Set()
				ids.add((interaction ? interaction.user : message.author).id)
				ids.add(opponent.id)
				let op, auth

				const btnCollector = m.createMessageComponentCollector({
					type: 'BUTTON',
					time: 30000
				})
				btnCollector.on('collect', async (b) => {
					await b.deferUpdate()

					if (!ids.has(b.user.id))
						return await button.followUp({
							content: 'You cant play the game.',
							ephemeral: true
						})

					ids.delete(b.user.id)

					if (b.user.id === opponent.id) op = b.customId
					if (
						b.user.id === (interaction ? interaction.user : message.author).id
					)
						auth = b.customId
					setTimeout(() => {
						if (ids.size == 0) btnCollector.stop()
					}, 500)
				})

				btnCollector.on('end', async (coll, reason) => {
					if (reason === 'time') {
						if (msgOrInter.commandId) {
							await interaction.editReply({
								content: '** **',
								embeds: [timeoutEmbed],
								components: []
							})
						} else if (!msgOrInter.commandId) {
							await m.edit({
								content: '** **',
								embeds: [timeoutEmbed],
								components: []
							})
						}
					} else {
						const winnerMap = {
							rock: 'scissors',
							scissors: 'paper',
							paper: 'rock'
						}
						if (op === auth) {
							op = op
								.replace('scissors', '✂️ Scissors')
								.replace('paper', '📄 Paper')
								.replace('rock', '🪨 Rock')

							if (msgOrInter.commandId) {
								await interaction.editReply({
									content: '** **',
									embeds: [
										new Discord.MessageEmbed()
											.setTitle('Draw!')
											.setColor(options.drawEmbedColor)
											.setDescription(`Both players chose **${op}**`)
											.setFooter(foot)
									],
									components: []
								})
							}
							if (msgOrInter.commandId) {
								await m.edit({
									content: '** **',
									embeds: [
										new Discord.MessageEmbed()
											.setTitle('Draw!')
											.setColor(options.drawEmbedColor)
											.setDescription(`Both players chose **${op}**`)
											.setFooter(foot)
									],
									components: []
								})
							}
						} else if (winnerMap[op] === auth) {
							op = op
								.replace('scissors', '✂️ Scissors')
								.replace('paper', '📄 Paper')
								.replace('rock', '🪨 Rock')
							auth = auth
								.replace('scissors', '✂️ Scissors')
								.replace('paper', '📄 Paper')
								.replace('rock', '🪨 Rock')
							//op - won
							if (msgOrInter.commandId) {
								await interaction.editReply({
									content: '** **',
									embeds: [
										new Discord.MessageEmbed()
											.setTitle(`${opponent.tag} Wins!`)
											.setColor(options.winEmbedColor)
											.setDescription(`**${op}** defeats **${auth}**`)
											.setFooter(foot)
									],
									components: []
								})
								resolve(opponent)
							} else if (!msgOrInter.commandId) {
								resolve(opponent)

								await m.edit({
									content: '** **',
									embeds: [
										new Discord.MessageEmbed()
											.setTitle(`${opponent.tag} Wins!`)
											.setColor(options.winEmbedColor)
											.setDescription(`**${op}** defeats **${auth}**`)
											.setFooter(foot)
									],
									components: []
								})
							}
						} else {
							op = op
								.replace('scissors', '✂️ Scissors')
								.replace('paper', '📄 Paper')
								.replace('rock', '🪨 Rock')
							auth = auth
								.replace('scissors', '✂️ Scissors')
								.replace('paper', '📄 Paper')
								.replace('rock', '🪨 Rock')
							//auth - won
							if (msgOrInter.commandId) {
								await interaction.editReply({
									content: '** **',
									embeds: [
										new Discord.MessageEmbed()
											.setTitle(
												`${
													(interaction ? interaction.user : message.author).tag
												} Wins!`
											)
											.setColor(options.winEmbedColor)
											.setDescription(`**${auth}** defeats **${op}**`)
											.setFooter(foot)
									],
									components: []
								})
							} else if (!msgOrInter.commandId) {
								await m.edit({
									content: '** **',
									embeds: [
										new Discord.MessageEmbed()
											.setTitle(
												`${
													(interaction ? interaction.user : message.author).tag
												} Wins!`
											)
											.setColor(options.winEmbedColor)
											.setDescription(`**${auth}** defeats **${op}**`)
											.setFooter(foot)
									],
									components: []
								})
							}

							resolve(interaction ? interaction.user : message.author)
						}
					}
				})
			})

			acceptCollector.on('end', async (coll, reason) => {
				if (reason === 'time') {
					if (msgOrInter.commandId) {
						await interaction.editReply({
							content: '** **',
							embeds: [
								new Discord.MessageEmbed()
									.setTitle('Challenge Not Accepted in Time')
									.setAuthor(
										interaction.user.tag,
										interaction.user.displayAvatarURL()
									)
									.setColor(options.timeoutEmbedColor)
									.setFooter(foot)
									.setDescription('Ran out of time!\nTime limit: 30s')
							],
							components: []
						})
					} else if (!msgOrInter.commandId) {
						await m.edit({
							content: '** **',
							embeds: [
								new Discord.MessageEmbed()
									.setTitle('Challenge Not Accepted in Time')
									.setAuthor(
										message.author.tag,
										message.author.displayAvatarURL()
									)
									.setColor(options.timeoutEmbedColor)
									.setFooter(foot)
									.setDescription('Ran out of time!\nTime limit: 30s')
							],
							components: []
						})
					}
				} else if (reason === 'decline') {
					if (msgOrInter.commandId) {
						await interaction.editReply({
							content: '** **',
							embeds: [
								new Discord.MessageEmbed()
									.setTitle('Game Declined!')
									.setAuthor(
										interaction.user.tag,
										interaction.user.displayAvatarURL()
									)
									.setColor(options.timeoutEmbedColor || 0xc90000)
									.setFooter(foot)
									.setDescription(`${opponent.tag} has declined your game!`)
							],
							components: []
						})
					} else if (!msgOrInter.commandId) {
						await m.edit({
							content: '** **',
							embeds: [
								new Discord.MessageEmbed()
									.setTitle('Game Declined!')
									.setAuthor(
										message.author.tag,
										message.author.displayAvatarURL()
									)
									.setColor(options.timeoutEmbedColor || 0xc90000)
									.setFooter(foot)
									.setDescription(`${opponent.tag} has declined your game!`)
							],
							components: []
						})
					}
				}
			})
		} catch (err) {
			console.log(`Error Occured. | rps | Error: ${err.stack}`)
		}
	})
}

module.exports = rps
