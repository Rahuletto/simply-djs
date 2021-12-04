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
  slash => Boolean

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
	//Default values
	options.credit ??= true
	options.slash ??= !!msgOrInter.commandId

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
		if (options.slash) {
			/** @type {Discord.CommandInteraction} */
			const interaction = msgOrInter
			const opponent = interaction.options.getUser(options.userSlash || 'user')

			await interaction.deferReply().catch(() => {})

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

			const acceptEmbed = new Discord.MessageEmbed()
				.setTitle(`Waiting for ${opponent.tag} to accept!`)
				.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
				.setColor(options.embedColor)
				.setFooter(foot)

			/** @type {Discord.Message} */
			let m = await interaction.followUp({
				content: `Hey <@${opponent.id}>. You got a RPS invite`,
				embeds: [acceptEmbed],
				components: [acceptComponents]
			})

			const acceptCollector = m.createMessageComponentCollector({
				type: 'BUTTON',
				time: 30000
			})

			acceptCollector.on('collect', async (button) => {
				if (button.user.id !== opponent.id)
					return await button.reply({
						content: 'You cant play the game as they didnt call u to play.',
						ephemeral: true
					})

				if (button.customId == 'decline') {
					await button.deferUpdate()
					return acceptCollector.stop('decline')
				}

				await button.deferUpdate()
				const selectEmbed = new Discord.MessageEmbed()
					.setTitle(`${interaction.user.tag} VS. ${opponent.tag}`)
					.setColor(options.embedColor)
					.setFooter(foot)
					.setDescription('Select 🪨, 📄, or ✂️')

				await interaction.editReply({
					content: '**Lets play..**',
					embeds: [selectEmbed],
					components: [rpsComponents]
				})

				acceptCollector.stop()
				let ids = new Set()
				ids.add(interaction.user.id)
				ids.add(opponent.id)
				let op, auth

				const btnCollector = m.createMessageComponentCollector({
					type: 'BUTTON',
					time: 30000
				})
				btnCollector.on('collect', async (b) => {
					if (!ids.has(b.user.id))
						return await button.reply({
							content: 'You cant play the game as they didnt call u to play.',
							ephemeral: true
						})
					ids.delete(b.user.id)

					await b.deferUpdate()

					if (b.user.id === opponent.id) op = b.customId
					if (b.user.id === interaction.user.id) auth = b.customId
					setTimeout(() => {
						if (ids.size == 0) btnCollector.stop()
					}, 500)
				})

				btnCollector.on('end', async (coll, reason) => {
					if (reason === 'time') {
						await interaction.editReply({
							content: '** **',
							embeds: [timeoutEmbed],
							components: []
						})
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
							await interaction.editReply({
								content: '** **',
								embeds: [
									new Discord.MessageEmbed()
										.setTitle(`${interaction.user.tag} Wins!`)
										.setColor(options.winEmbedColor)
										.setDescription(`**${auth}** defeats **${op}**`)
										.setFooter(foot)
								],
								components: []
							})
						}
					}
				})
			})

			acceptCollector.on('end', async (coll, reason) => {
				if (reason === 'time') {
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
				} else if (reason === 'decline') {
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
				}
			})
		} else {
			/** @type {Discord.Message} */
			const message = msgOrInter

			const opponent = message.mentions.members.first()?.user
			if (!opponent) return message.channel.send('No opponent mentioned!')
			if (opponent.bot)
				return message.channel.send('You cannot play against bots')
			if (opponent.id === message.author.id)
				return message.channel.send('You cannot play by yourself!')

			const acceptEmbed = new Discord.MessageEmbed()
				.setTitle(`Waiting for ${opponent.tag} to accept!`)
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.setColor(options.embedColor)
				.setFooter(foot)

			const { channel } = message

			/** @type {Discord.Message} */
			let m = await channel.send({
				content: `Hey ${opponent.toString()}. You got a RPS invite`,
				embeds: [acceptEmbed],
				components: [acceptComponents]
			})

			const acceptCollector = m.createMessageComponentCollector({
				type: 'BUTTON',
				time: 30000
			})

			acceptCollector.on('collect', async (button) => {
				if (button.user.id !== opponent.id)
					return await button.reply({
						content: 'You cant play the game as they didnt call u to play.',
						ephemeral: true
					})

				if (button.customId == 'decline') {
					await button.deferUpdate()
					return acceptCollector.stop('decline')
				}

				await button.deferUpdate()
				let selectEmbed = new Discord.MessageEmbed()
					.setTitle(`${message.author.tag} VS. ${opponent.tag}`)
					.setColor(options.embedColor)
					.setFooter(foot)
					.setDescription('Select 🪨, 📄, or ✂️')

				await m.edit({
					content: '**Lets play..**',
					embeds: [selectEmbed],
					components: [rpsComponents]
				})

				acceptCollector.stop()
				let ids = new Set()
				ids.add(message.author.id)
				ids.add(opponent.id)

				let op, auth

				const btnCollector = m.createMessageComponentCollector({
					type: 'BUTTON',
					time: 30000
				})
				btnCollector.on('collect', async (b) => {
					if (!ids.has(b.user.id))
						return await button.reply({
							content: 'You cant play the game as they didnt call u to play.',
							ephemeral: true
						})
					ids.delete(b.user.id)

					await b.deferUpdate()
					if (b.user.id === opponent.id) op = b.customId
					if (b.user.id === message.author.id) auth = b.customId

					if (ids.size == 0) btnCollector.stop()
				})

				btnCollector.on('end', async (coll, reason) => {
					if (reason === 'time') {
						await m.edit({
							content: '** **',
							embeds: [timeoutEmbed],
							components: []
						})
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
							await m.edit({
								content: '** **',
								embeds: [
									new Discord.MessageEmbed()
										.setTitle(`${message.author.tag} Wins!`)
										.setColor(options.winEmbedColor)
										.setDescription(`**${auth}** defeats **${op}**`)
										.setFooter(foot)
								],
								components: []
							})
						}
					}
				})
			})

			acceptCollector.on('end', async (coll, reason) => {
				if (reason === 'time') {
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
				} else if (reason === 'decline') {
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
								.setDescription(
									`${opponent.toString()} has declined your game!`
								)
						],
						components: []
					})
				}
			})
		}
	} catch (err) {
		console.log(`Error Occured. | rps | Error: ${err.stack}`)
	}
}

module.exports = rps
