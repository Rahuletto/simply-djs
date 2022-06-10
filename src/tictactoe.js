const Discord = require('discord.js')

/**
 * @param {Discord.CommandInteraction} message
 * @param {import('../index').tictactoeOptions} options
 */

/**
 --- options ---
 
  credit => Boolean
  slash => Boolean
  
  userSlash => String

  resultBtn => Boolean

  embedFoot => String
  embedColor => HexColor
  timeoutEmbedColor => HexColor
  
  xEmoji => (Emoji ID) String
  oEmoji => (Emoji ID) String
  idleEmoji => (Emoji ID) String
 */

async function tictactoe(message, options = []) {
	return new Promise(async (resolve) => {
		try {
			const { client } = message
			let opponent

			if (message.commandId) {
				opponent = message.options.getUser(options.userSlash || 'user')

				if (!opponent)
					return message.followUp({
						content: 'No opponent mentioned!',
						ephemeral: true
					})

				if (opponent.bot)
					return message.followUp({
						content: "You can't play with bots !",
						ephemeral: true
					})

				if (opponent.id == (message.user ? message.user : message.author).id)
					return message.followUp({
						content: 'You cannot play by yourself!',
						ephemeral: true
					})
			} else if (!message.commandId) {
				opponent = message.mentions.members.first()?.user

				if (!opponent)
					return message.channel.send({
						content: 'Please provide the user to challenge!'
					})

				if (opponent.bot)
					return message.followUp({
						content: "You can't play with bots !",
						ephemeral: true
					})

				if (opponent.id === message.member.id)
					return message.channel.send({
						content:
							'You cant play for 2 Players. Please provide the user to challenge!'
					})
			}

			if (options.credit === false) {
				foot = options.embedFoot || 'Make sure to win ;)'
			} else {
				foot = '©️ Simply Develop. npm i simply-djs'
			}

			let acceptEmbed = new Discord.MessageEmbed()
				.setTitle(`Waiting for ${opponent.tag} to accept!`)
				.setAuthor(
					(message.user ? message.user : message.author).tag,
					(message.user ? message.user : message.author).displayAvatarURL()
				)
				.setColor(options.embedColor || 0x075fff)
				.setFooter({ text: foot })

			let accept = new Discord.MessageButton()
				.setLabel('Accept')
				.setStyle('SUCCESS')
				.setCustomId('acceptttt')

			let decline = new Discord.MessageButton()
				.setLabel('Decline')
				.setStyle('DANGER')
				.setCustomId('declinettt')

			let accep = new Discord.MessageActionRow().addComponents([
				accept,
				decline
			])

			let m

			if (message.commandId) {
				m = await message.followUp({
					content: 'Hey <@' + opponent.id + '>. You got a tictactoe request',
					embeds: [acceptEmbed],
					components: [accep]
				})
			} else if (!message.commandId) {
				m = await message.reply({
					content: 'Hey <@' + opponent.id + '>. You got a tictactoe request',
					embeds: [acceptEmbed],
					components: [accep]
				})
			}
			const collector = m.createMessageComponentCollector({
				type: 'BUTTON',
				time: 30000
			})
			collector.on('collect', async (button) => {
				if (button.user.id !== opponent.id)
					return button.reply({
						content: 'You cant play the game as they didnt call u to play.',
						ephemeral: true
					})

				if (button.customId == 'declinettt') {
					button.deferUpdate()
					return collector.stop('decline')
				} else if (button.customId == 'acceptttt') {
					collector.stop()
					if (message.commandId) {
						button.message.delete()
					}

					let fighters = [
						(message.user ? message.user : message.author).id,
						opponent.id
					].sort(() => (Math.random() > 0.5 ? 1 : -1))

					let x_emoji = options.xEmoji || '❌'
					let o_emoji = options.oEmoji || '⭕'

					let dashmoji = options.idleEmoji || '➖'

					let Args = {
						user: 0,
						a1: {
							style: 'SECONDARY',
							emoji: dashmoji,
							disabled: false
						},
						a2: {
							style: 'SECONDARY',
							emoji: dashmoji,
							disabled: false
						},
						a3: {
							style: 'SECONDARY',
							emoji: dashmoji,
							disabled: false
						},
						b1: {
							style: 'SECONDARY',
							emoji: dashmoji,
							disabled: false
						},
						b2: {
							style: 'SECONDARY',
							emoji: dashmoji,
							disabled: false
						},
						b3: {
							style: 'SECONDARY',
							emoji: dashmoji,
							disabled: false
						},
						c1: {
							style: 'SECONDARY',
							emoji: dashmoji,
							disabled: false
						},
						c2: {
							style: 'SECONDARY',
							emoji: dashmoji,
							disabled: false
						},
						c3: {
							style: 'SECONDARY',
							emoji: dashmoji,
							disabled: false
						}
					}
					const { MessageActionRow, MessageButton } = require('discord.js')

					let epm = new Discord.MessageEmbed()
						.setTitle('TicTacToe..')
						.setColor(options.embedColor || 0x075fff)
						.setFooter({ text: foot })
						.setTimestamp()

					let msg
					if (message.commandId) {
						msg = await message.followUp({
							embeds: [
								epm.setDescription(
									`Waiting for Input | <@!${Args.userid}>, Your Emoji: ${
										client.emojis.cache.get(o_emoji) || '⭕'
									}`
								)
							]
						})
					} else if (!message.commandId) {
						msg = await button.message.edit({
							embeds: [
								epm.setDescription(
									`Waiting for Input | <@!${Args.userid}>, Your Emoji: ${
										client.emojis.cache.get(o_emoji) || '⭕'
									}`
								)
							]
						})
					}

					await ttt(msg)

					async function ttt(m) {
						Args.userid = fighters[Args.user]
						let won = {
							'<:O_:863314110560993340>': false,
							'<:X_:863314044781723668>': false
						}

						let a1 = new MessageButton()
							.setStyle(Args.a1.style)
							.setEmoji(Args.a1.emoji)
							.setCustomId('a1')
							.setDisabled(Args.a1.disabled)
						let a2 = new MessageButton()
							.setStyle(Args.a2.style)
							.setEmoji(Args.a2.emoji)
							.setCustomId('a2')
							.setDisabled(Args.a2.disabled)
						let a3 = new MessageButton()
							.setStyle(Args.a3.style)
							.setEmoji(Args.a3.emoji)
							.setCustomId('a3')
							.setDisabled(Args.a3.disabled)
						let b1 = new MessageButton()
							.setStyle(Args.b1.style)
							.setEmoji(Args.b1.emoji)
							.setCustomId('b1')
							.setDisabled(Args.b1.disabled)
						let b2 = new MessageButton()
							.setStyle(Args.b2.style)
							.setEmoji(Args.b2.emoji)
							.setCustomId('b2')
							.setDisabled(Args.b2.disabled)
						let b3 = new MessageButton()
							.setStyle(Args.b3.style)
							.setEmoji(Args.b3.emoji)
							.setCustomId('b3')
							.setDisabled(Args.b3.disabled)
						let c1 = new MessageButton()
							.setStyle(Args.c1.style)
							.setEmoji(Args.c1.emoji)
							.setCustomId('c1')
							.setDisabled(Args.c1.disabled)
						let c2 = new MessageButton()
							.setStyle(Args.c2.style)
							.setEmoji(Args.c2.emoji)
							.setCustomId('c2')
							.setDisabled(Args.c2.disabled)
						let c3 = new MessageButton()
							.setStyle(Args.c3.style)
							.setEmoji(Args.c3.emoji)
							.setCustomId('c3')
							.setDisabled(Args.c3.disabled)
						let a = new MessageActionRow().addComponents([a1, a2, a3])
						let b = new MessageActionRow().addComponents([b1, b2, b3])
						let c = new MessageActionRow().addComponents([c1, c2, c3])
						let buttons = [a, b, c]

						if (
							Args.a1.emoji == o_emoji &&
							Args.b1.emoji == o_emoji &&
							Args.c1.emoji == o_emoji
						)
							won['<:O_:863314110560993340>'] = true
						if (
							Args.a2.emoji == o_emoji &&
							Args.b2.emoji == o_emoji &&
							Args.c2.emoji == o_emoji
						)
							won['<:O_:863314110560993340>'] = true
						if (
							Args.a3.emoji == o_emoji &&
							Args.b3.emoji == o_emoji &&
							Args.c3.emoji == o_emoji
						)
							won['<:O_:863314110560993340>'] = true
						if (
							Args.a1.emoji == o_emoji &&
							Args.b2.emoji == o_emoji &&
							Args.c3.emoji == o_emoji
						)
							won['<:O_:863314110560993340>'] = true
						if (
							Args.a3.emoji == o_emoji &&
							Args.b2.emoji == o_emoji &&
							Args.c1.emoji == o_emoji
						)
							won['<:O_:863314110560993340>'] = true
						if (
							Args.a1.emoji == o_emoji &&
							Args.a2.emoji == o_emoji &&
							Args.a3.emoji == o_emoji
						)
							won['<:O_:863314110560993340>'] = true
						if (
							Args.b1.emoji == o_emoji &&
							Args.b2.emoji == o_emoji &&
							Args.b3.emoji == o_emoji
						)
							won['<:O_:863314110560993340>'] = true
						if (
							Args.c1.emoji == o_emoji &&
							Args.c2.emoji == o_emoji &&
							Args.c3.emoji == o_emoji
						)
							won['<:O_:863314110560993340>'] = true
						if (won['<:O_:863314110560993340>'] != false) {
							if (Args.user == 0) {
								let wonner = await client.users
									.fetch(fighters[1])
									.catch(console.error)
								resolve(wonner)

								if (options.resultBtn === true)
									return m
										.edit({
											content: `<@${fighters[1]}> (${
												client.emojis.cache.get(o_emoji) || '⭕'
											}) won`,
											components: buttons,

											embeds: [
												epm.setDescription(
													`<@!${fighters[1]}> (${
														client.emojis.cache.get(o_emoji) || '⭕'
													}) won.. That was a nice game.`
												)
											]
										})
										.then((m) => {
											m.react('⭕')
										})
								else if (!options.resultBtn || options.resultBtn === false)
									return m
										.edit({
											content: `<@${fighters[1]}> (${
												client.emojis.cache.get(o_emoji) || '⭕'
											}) won`,

											embeds: [
												epm.setDescription(
													`<@!${fighters[1]}> (${
														client.emojis.cache.get(o_emoji) || '⭕'
													}) won.. That was a nice game.\n\`\`\`\n${Args.a1.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.a2.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.a3.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')}\n${Args.b1.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.b2.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.b3.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')}\n${Args.c1.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.c2.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.c3.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')}\n\`\`\``.replaceAll(
														dashmoji,
														'➖'
													)
												)
											],
											components: []
										})
										.then((m) => {
											m.react('⭕')
										})
							} else if (Args.user == 1) {
								let wonner = await client.users
									.fetch(fighters[0])
									.catch(console.error)
								resolve(wonner)

								if (options.resultBtn === true)
									return m
										.edit({
											content: `<@${fighters[0]}> (${
												client.emojis.cache.get(o_emoji) || '⭕'
											}) won`,
											components: buttons,
											embeds: [
												epm.setDescription(
													`<@!${fighters[0]}> (${
														client.emojis.cache.get(o_emoji) || '⭕'
													}) won.. That was a nice game.`
												)
											]
										})
										.then((m) => {
											m.react('⭕')
										})
								else if (!options.resultBtn || options.resultBtn === false)
									return m
										.edit({
											content: `<@${fighters[0]}> (${
												client.emojis.cache.get(o_emoji) || '⭕'
											}) won`,

											embeds: [
												epm.setDescription(
													`<@!${fighters[0]}> (${
														client.emojis.cache.get(o_emoji) || '⭕'
													}) won.. That was a nice game.\n\`\`\`\n${Args.a1.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.a2.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.a3.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')}\n${Args.b1.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.b2.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.b3.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')}\n${Args.c1.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.c2.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.c3.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')}\n\`\`\``.replaceAll(
														dashmoji,
														'➖'
													)
												)
											],
											components: []
										})
										.then((m) => {
											m.react('⭕')
										})
							}
						}
						if (
							Args.a1.emoji == x_emoji &&
							Args.b1.emoji == x_emoji &&
							Args.c1.emoji == x_emoji
						)
							won['<:X_:863314044781723668>'] = true
						if (
							Args.a2.emoji == x_emoji &&
							Args.b2.emoji == x_emoji &&
							Args.c2.emoji == x_emoji
						)
							won['<:X_:863314044781723668>'] = true
						if (
							Args.a3.emoji == x_emoji &&
							Args.b3.emoji == x_emoji &&
							Args.c3.emoji == x_emoji
						)
							won['<:X_:863314044781723668>'] = true
						if (
							Args.a1.emoji == x_emoji &&
							Args.b2.emoji == x_emoji &&
							Args.c3.emoji == x_emoji
						)
							won['<:X_:863314044781723668>'] = true
						if (
							Args.a3.emoji == x_emoji &&
							Args.b2.emoji == x_emoji &&
							Args.c1.emoji == x_emoji
						)
							won['<:X_:863314044781723668>'] = true
						if (
							Args.a1.emoji == x_emoji &&
							Args.a2.emoji == x_emoji &&
							Args.a3.emoji == x_emoji
						)
							won['<:X_:863314044781723668>'] = true
						if (
							Args.b1.emoji == x_emoji &&
							Args.b2.emoji == x_emoji &&
							Args.b3.emoji == x_emoji
						)
							won['<:X_:863314044781723668>'] = true
						if (
							Args.c1.emoji == x_emoji &&
							Args.c2.emoji == x_emoji &&
							Args.c3.emoji == x_emoji
						)
							won['<:X_:863314044781723668>'] = true
						if (won['<:X_:863314044781723668>'] != false) {
							if (Args.user == 0) {
								let wonner = await client.users
									.fetch(fighters[1])
									.catch(console.error)
								resolve(wonner)

								if (options.resultBtn === true)
									return m
										.edit({
											content: `<@${fighters[1]}> (${
												client.emojis.cache.get(x_emoji) || '❌'
											}) won`,
											components: buttons,
											embeds: [
												epm.setDescription(
													`<@!${fighters[1]}> (${
														client.emojis.cache.get(x_emoji) || '❌'
													}) won.. That was a nice game.`
												)
											]
										})
										.then((m) => {
											m.react('❌')
										})
								else if (!options.resultBtn || options.resultBtn === false)
									return m
										.edit({
											content: `<@${fighters[1]}> (${
												client.emojis.cache.get(x_emoji) || '❌'
											}) won`,
											embeds: [
												epm.setDescription(
													`<@!${fighters[1]}> (${
														client.emojis.cache.get(x_emoji) || '❌'
													}) won.. That was a nice game.\n\`\`\`\n${Args.a1.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.a2.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.a3.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')}\n${Args.b1.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.b2.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.b3.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')}\n${Args.c1.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.c2.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.c3.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')}\n\`\`\``.replaceAll(
														dashmoji,
														'➖'
													)
												)
											],
											components: []
										})
										.then((m) => {
											m.react('❌')
										})
							} else if (Args.user == 1) {
								let wonner = await client.users
									.fetch(fighters[0])
									.catch(console.error)
								resolve(wonner)

								if (options.resultBtn === true)
									return m
										.edit({
											content: `<@${fighters[0]}> (${
												client.emojis.cache.get(x_emoji) || '❌'
											}) won`,
											components: buttons,
											embeds: [
												epm.setDescription(
													`<@!${fighters[0]}> (${
														client.emojis.cache.get(x_emoji) || '❌'
													}) won.. That was a nice game.`
												)
											]
										})
										.then((m) => {
											m.react('❌')
										})
								else
									return m
										.edit({
											content: `<@${fighters[0]}> (${
												client.emojis.cache.get(x_emoji) || '❌'
											}) won`,
											embeds: [
												epm.setDescription(
													`<@!${fighters[0]}> (${
														client.emojis.cache.get(x_emoji) || '❌'
													}) won.. That was a nice game.\n\`\`\`\n${Args.a1.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.a2.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.a3.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')}\n${Args.b1.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.b2.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.b3.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')}\n${Args.c1.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.c2.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')} | ${Args.c3.emoji
														.replace(o_emoji, '⭕')
														.replace(x_emoji, '❌')}\n\`\`\``.replaceAll(
														dashmoji,
														'➖'
													)
												)
											],
											components: []
										})
										.then((m) => {
											m.react('❌')
										})
							}
						}

						m.edit({
							content: `<@${Args.userid}>`,
							embeds: [
								epm.setDescription(
									`Waiting for Input | <@!${Args.userid}> | Your Emoji: ${
										Args.user == 0
											? `${client.emojis.cache.get(o_emoji) || '⭕'}`
											: `${client.emojis.cache.get(x_emoji) || '❌'}`
									}`
								)
							],
							components: [a, b, c]
						})

						const collector = m.createMessageComponentCollector({
							componentType: 'BUTTON',
							max: 1,
							time: 30000
						})

						collector.on('collect', (b) => {
							if (b.user.id !== Args.userid) {
								b.reply({
									content: 'You cant play now',
									ephemeral: true
								})

								ttt(m)
							} else {
								if (Args.user == 0) {
									Args.user = 1
									Args[b.customId] = {
										style: 'SUCCESS',
										emoji: o_emoji,
										disabled: true
									}
								} else {
									Args.user = 0
									Args[b.customId] = {
										style: 'DANGER',
										emoji: x_emoji,
										disabled: true
									}
								}
								b.deferUpdate()
								const map = (obj, fun) =>
									Object.entries(obj).reduce(
										(prev, [key, value]) => ({
											...prev,
											[key]: fun(key, value)
										}),
										{}
									)
								const objectFilter = (obj, predicate) =>
									Object.keys(obj)
										.filter((key) => predicate(obj[key]))
										.reduce((res, key) => ((res[key] = obj[key]), res), {})
								let Brgs = objectFilter(
									map(Args, (_, fruit) => fruit.emoji == dashmoji),
									(num) => num == true
								)

								if (Object.keys(Brgs).length == 0) {
									if (
										Args.a1.emoji == o_emoji &&
										Args.b1.emoji == o_emoji &&
										Args.c1.emoji == o_emoji
									)
										won['<:O_:863314110560993340>'] = true
									if (
										Args.a2.emoji == o_emoji &&
										Args.b2.emoji == o_emoji &&
										Args.c2.emoji == o_emoji
									)
										won['<:O_:863314110560993340>'] = true
									if (
										Args.a3.emoji == o_emoji &&
										Args.b3.emoji == o_emoji &&
										Args.c3.emoji == o_emoji
									)
										won['<:O_:863314110560993340>'] = true
									if (
										Args.a1.emoji == o_emoji &&
										Args.b2.emoji == o_emoji &&
										Args.c3.emoji == o_emoji
									)
										won['<:O_:863314110560993340>'] = true
									if (
										Args.a3.emoji == o_emoji &&
										Args.b2.emoji == o_emoji &&
										Args.c1.emoji == o_emoji
									)
										won['<:O_:863314110560993340>'] = true
									if (
										Args.a1.emoji == o_emoji &&
										Args.a2.emoji == o_emoji &&
										Args.a3.emoji == o_emoji
									)
										won['<:O_:863314110560993340>'] = true
									if (
										Args.b1.emoji == o_emoji &&
										Args.b2.emoji == o_emoji &&
										Args.b3.emoji == o_emoji
									)
										won['<:O_:863314110560993340>'] = true
									if (
										Args.c1.emoji == o_emoji &&
										Args.c2.emoji == o_emoji &&
										Args.c3.emoji == o_emoji
									)
										won['<:O_:863314110560993340>'] = true

									if (won['<:O_:863314110560993340>'] == true) return ttt(m)
									else if (won['<:X_:863314044781723668>'] == true) return
									else {
										ttt(m)

										if (options.resultBtn === true)
											return m
												.edit({
													content: 'Tie',
													embeds: [epm.setDescription(`It's a tie!`)]
												})
												.then((m) => {
													m.react(dashmoji)
												})
										else
											return m
												.edit({
													content: 'Tie',
													embeds: [
														epm.setDescription(
															`It's a tie!\n\`\`\`\n${Args.a1.emoji
																.replace(o_emoji, '⭕')
																.replace(x_emoji, '❌')} | ${Args.a2.emoji
																.replace(o_emoji, '⭕')
																.replace(x_emoji, '❌')} | ${Args.a3.emoji
																.replace(o_emoji, '⭕')
																.replace(x_emoji, '❌')}\n${Args.b1.emoji
																.replace(o_emoji, '⭕')
																.replace(x_emoji, '❌')} | ${Args.b2.emoji
																.replace(o_emoji, '⭕')
																.replace(x_emoji, '❌')} | ${Args.b3.emoji
																.replace(o_emoji, '⭕')
																.replace(x_emoji, '❌')}\n${Args.c1.emoji
																.replace(o_emoji, '⭕')
																.replace(x_emoji, '❌')} | ${Args.c2.emoji
																.replace(o_emoji, '⭕')
																.replace(x_emoji, '❌')} | ${Args.c3.emoji
																.replace(o_emoji, '⭕')
																.replace(x_emoji, '❌')}\n\`\`\``.replaceAll(
																dashmoji,
																'➖'
															)
														)
													],
													components: []
												})
												.then((m) => {
													m.react(dashmoji)
												})
												.catch(() => {})
									}
								}

								ttt(m)
							}
						})
						collector.on('end', (collected, reason) => {
							if (collected.size === 0 && reason == 'time')
								m.edit({
									content: `<@!${Args.userid}> didn\'t react in time! (30s)`,
									components: []
								})
						})
					}
				}
			})

			collector.on('end', (collected, reason) => {
				if (reason == 'time') {
					let embed = new Discord.MessageEmbed()
						.setTitle('Challenge Not Accepted in Time')
						.setAuthor(
							(message.user ? message.user : message.author).tag,
							(message.user ? message.user : message.author).displayAvatarURL()
						)
						.setColor(options.timeoutEmbedColor || 0xc90000)
						.setFooter({ text: foot })
						.setDescription('Ran out of time!\nTime limit: 30s')
					m.edit({
						content: '<@' + opponent.id + '>. Didnt accept in time',
						embeds: [embed],
						components: []
					})
				}
				if (reason == 'decline') {
					let embed = new Discord.MessageEmbed()
						.setTitle('Game Declined!')
						.setAuthor(
							(message.user ? message.user : message.author).tag,
							(message.user ? message.user : message.author).displayAvatarURL()
						)
						.setColor(options.timeoutEmbedColor || 0xc90000)
						.setFooter({ text: foot })
						.setDescription(`${opponent.user.tag} has declined your game!`)
					m.edit({
						embeds: [embed],
						components: []
					})
				}
			})
		} catch (err) {
			console.log(`Error Occured. | tictactoe | Error: ${err.stack}`)
		}
	})
}

module.exports = tictactoe
