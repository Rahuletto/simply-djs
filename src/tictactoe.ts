import {
	MessageEmbed,
	Message,
	MessageEmbedFooter,
	MessageEmbedAuthor,
	ColorResolvable,
	CommandInteraction,
	MessageActionRow,
	MessageButton,
	Client,
	MessageButtonStyle,
	User
} from 'discord.js'
import chalk from 'chalk'
import { APIMessage } from 'discord-api-types'

// ------------------------------
// ----- I N T E R F A C E ------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/CustomizableEmbed*
 */
interface CustomizableEmbed {
	author?: MessageEmbedAuthor
	title?: string
	footer?: MessageEmbedFooter
	description?: string
	color?: ColorResolvable

	credit?: boolean
}

interface tttBtnTemplate {
	style?: MessageButtonStyle
	emoji?: string
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/Buttons/tictactoe*
 */
interface tttButtons {
	X?: tttBtnTemplate
	O?: tttBtnTemplate
	idle?: tttBtnTemplate
}

export type tttOptions = {
	embed?: CustomizableEmbed
	user?: User
	result?: 'Button' | 'Embed'

	buttons?: tttButtons
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A Super fun **tictactoe game** that can be implemented by one line.
 * @param message
 * @param options
 * @example simplydjs.tictactoe(interaction)
 */

export async function tictactoe(
	message: Message | CommandInteraction,
	options: tttOptions = {}
): Promise<User> {
	return new Promise(async (resolve) => {
		try {
			const client: Client = message.client

			let interaction: any

			//@ts-ignore
			if (message.commandId) {
				interaction = message
			}

			let opponent: User

			let int = message as CommandInteraction
			let ms = message as Message

			if (interaction) {
				opponent = options.user || int.options.getUser('user')

				if (!opponent)
					return int.followUp({
						content: 'You didnt mention an opponent.',
						ephemeral: true
					})

				if (opponent.bot)
					return int.followUp({
						content: 'You cannot play with bots',
						ephemeral: true
					})

				if (opponent.id == (message as CommandInteraction).user.id)
					return int.followUp({
						content: 'You cannot play with yourself!',
						ephemeral: true
					})
			} else if (!interaction) {
				opponent = (message as Message).mentions.members.first()?.user

				if (!opponent)
					return ms.reply({
						content: 'You didnt mention an opponent'
					})

				if (opponent.bot)
					return ms.reply({
						content: "You can't play with bots !"
					})

				if (opponent.id === message.member.user.id)
					return ms.reply({
						content: 'You cannot play with yourself!'
					})
			}

			let acceptEmbed = new MessageEmbed()
				.setTitle(`Tictactoe with ${opponent.tag}`)
				.setDescription('Waiting for the opponent to accept/deny')
				.setAuthor({
					name: (message.member.user as User).tag,
					iconURL: (message.member.user as User).displayAvatarURL()
				})
				.setColor(options.embed?.color || `#075fff`)
				.setFooter(
					options.embed?.credit
						? options.embed?.footer
						: {
								text: '©️ Simply Develop. npm i simply-djs',
								iconURL: 'https://i.imgur.com/u8VlLom.png'
						  }
				)

			let accept = new MessageButton()
				.setLabel('Accept')
				.setStyle('SUCCESS')
				.setCustomId('accept-ttt')

			let decline = new MessageButton()
				.setLabel('Deny')
				.setStyle('DANGER')
				.setCustomId('deny-ttt')

			let accep = new MessageActionRow().addComponents([accept, decline])

			let m: Message | APIMessage

			if (interaction) {
				m = await int.followUp({
					content: `<@${opponent.id}>, You got a tictactoe request from ${
						(message.member.user as User).tag
					}`,
					embeds: [acceptEmbed],
					components: [accep]
				})
			} else if (!interaction) {
				m = await ms.reply({
					content: `<@${opponent.id}>, You got a tictactoe request from ${
						(message.member.user as User).tag
					}`,
					embeds: [acceptEmbed],
					components: [accep]
				})
			}
			const collector = (m as Message).createMessageComponentCollector({
				componentType: 'BUTTON',
				time: 30000
			})

			collector.on('collect', async (button) => {
				if (button.user.id !== opponent.id)
					return button.reply({
						content: 'You cannot play the game.',
						ephemeral: true
					})

				if (button.customId == 'deny-ttt') {
					await button.deferUpdate()
					return collector.stop('decline')
				} else if (button.customId == 'accept-ttt') {
					collector.stop()
					if (interaction) {
						;(button.message as Message).delete()
					}

					let players = [message.member.user.id, opponent.id].sort(() =>
						Math.random() > 0.5 ? 1 : -1
					)

					let x_emoji = options.buttons?.X?.emoji || '❌'
					let o_emoji = options.buttons?.O?.emoji || '⭕'

					let dashmoji = options.buttons?.idle?.emoji || '➖'

					let idleClr = options.buttons?.idle?.style || 'SECONDARY'
					let XClr = options.buttons?.X?.style || 'DANGER'
					let OClr = options.buttons?.O?.style || 'PRIMARY'

					let Plrs = {
						user: 0,
						userid: '1234567890123',
						a1: {
							style: idleClr,
							emoji: dashmoji,
							disabled: false
						},
						a2: {
							style: idleClr,
							emoji: dashmoji,
							disabled: false
						},
						a3: {
							style: idleClr,
							emoji: dashmoji,
							disabled: false
						},
						b1: {
							style: idleClr,
							emoji: dashmoji,
							disabled: false
						},
						b2: {
							style: idleClr,
							emoji: dashmoji,
							disabled: false
						},
						b3: {
							style: idleClr,
							emoji: dashmoji,
							disabled: false
						},
						c1: {
							style: idleClr,
							emoji: dashmoji,
							disabled: false
						},
						c2: {
							style: idleClr,
							emoji: dashmoji,
							disabled: false
						},
						c3: {
							style: idleClr,
							emoji: dashmoji,
							disabled: false
						}
					}

					let epm = new MessageEmbed()
						.setTitle('Lets play TicTacToe.')
						.setColor(options.embed?.color || '#075fff')
						.setFooter(
							options.embed?.credit
								? options.embed?.footer
								: {
										text: '©️ Simply Develop. npm i simply-djs',
										iconURL: 'https://i.imgur.com/u8VlLom.png'
								  }
						)
						.setTimestamp()

					let msg: any
					if (interaction) {
						msg = await int.followUp({
							embeds: [
								epm.setDescription(
									`Waiting for Input | <@!${players}>, Your Emoji: ${
										client.emojis.cache.get(o_emoji) || '⭕'
									}`
								)
							]
						})
					} else if (!interaction) {
						msg = await (button.message as Message).edit({
							embeds: [
								epm.setDescription(
									`Waiting for Input | <@!${players}>, Your Emoji: ${
										client.emojis.cache.get(o_emoji) || '⭕'
									}`
								)
							]
						})
					}

					await ttt(msg)

					async function ttt(m: Message) {
						Plrs.userid = players[Plrs.user]
						let won = {
							'O-Player': false,
							'X-Player': false
						}

						let a1 = new MessageButton()
							.setStyle(Plrs.a1.style)
							.setEmoji(Plrs.a1.emoji)
							.setCustomId('a1')
							.setDisabled(Plrs.a1.disabled)
						let a2 = new MessageButton()
							.setStyle(Plrs.a2.style)
							.setEmoji(Plrs.a2.emoji)
							.setCustomId('a2')
							.setDisabled(Plrs.a2.disabled)
						let a3 = new MessageButton()
							.setStyle(Plrs.a3.style)
							.setEmoji(Plrs.a3.emoji)
							.setCustomId('a3')
							.setDisabled(Plrs.a3.disabled)
						let b1 = new MessageButton()
							.setStyle(Plrs.b1.style)
							.setEmoji(Plrs.b1.emoji)
							.setCustomId('b1')
							.setDisabled(Plrs.b1.disabled)
						let b2 = new MessageButton()
							.setStyle(Plrs.b2.style)
							.setEmoji(Plrs.b2.emoji)
							.setCustomId('b2')
							.setDisabled(Plrs.b2.disabled)
						let b3 = new MessageButton()
							.setStyle(Plrs.b3.style)
							.setEmoji(Plrs.b3.emoji)
							.setCustomId('b3')
							.setDisabled(Plrs.b3.disabled)
						let c1 = new MessageButton()
							.setStyle(Plrs.c1.style)
							.setEmoji(Plrs.c1.emoji)
							.setCustomId('c1')
							.setDisabled(Plrs.c1.disabled)
						let c2 = new MessageButton()
							.setStyle(Plrs.c2.style)
							.setEmoji(Plrs.c2.emoji)
							.setCustomId('c2')
							.setDisabled(Plrs.c2.disabled)
						let c3 = new MessageButton()
							.setStyle(Plrs.c3.style)
							.setEmoji(Plrs.c3.emoji)
							.setCustomId('c3')
							.setDisabled(Plrs.c3.disabled)
						let a = new MessageActionRow().addComponents([a1, a2, a3])
						let b = new MessageActionRow().addComponents([b1, b2, b3])
						let c = new MessageActionRow().addComponents([c1, c2, c3])
						let buttons = [a, b, c]

						if (
							Plrs.a1.emoji == o_emoji &&
							Plrs.b1.emoji == o_emoji &&
							Plrs.c1.emoji == o_emoji
						)
							won['O-Player'] = true
						if (
							Plrs.a2.emoji == o_emoji &&
							Plrs.b2.emoji == o_emoji &&
							Plrs.c2.emoji == o_emoji
						)
							won['O-Player'] = true
						if (
							Plrs.a3.emoji == o_emoji &&
							Plrs.b3.emoji == o_emoji &&
							Plrs.c3.emoji == o_emoji
						)
							won['O-Player'] = true
						if (
							Plrs.a1.emoji == o_emoji &&
							Plrs.b2.emoji == o_emoji &&
							Plrs.c3.emoji == o_emoji
						)
							won['O-Player'] = true
						if (
							Plrs.a3.emoji == o_emoji &&
							Plrs.b2.emoji == o_emoji &&
							Plrs.c1.emoji == o_emoji
						)
							won['O-Player'] = true
						if (
							Plrs.a1.emoji == o_emoji &&
							Plrs.a2.emoji == o_emoji &&
							Plrs.a3.emoji == o_emoji
						)
							won['O-Player'] = true
						if (
							Plrs.b1.emoji == o_emoji &&
							Plrs.b2.emoji == o_emoji &&
							Plrs.b3.emoji == o_emoji
						)
							won['O-Player'] = true
						if (
							Plrs.c1.emoji == o_emoji &&
							Plrs.c2.emoji == o_emoji &&
							Plrs.c3.emoji == o_emoji
						)
							won['O-Player'] = true
						if (won['O-Player'] != false) {
							let wonner: User | void = await client.users
								.fetch(players[1])
								.catch(console.error)
							resolve(wonner as User)

							if (options.result === 'Button')
								return m
									.edit({
										content: `<@${players[Plrs.user === 0 ? 1 : 0]}> (${
											client.emojis.cache.get(o_emoji) || '⭕'
										}) won`,
										components: buttons,

										embeds: [
											epm.setDescription(
												`<@!${players[Plrs.user === 0 ? 1 : 0]}> (${
													client.emojis.cache.get(o_emoji) || '⭕'
												}) won, That was a nice game.`
											)
										]
									})
									.then((m: Message) => {
										m.react('⭕')
									})
							else if (!options.result || options.result === 'Embed')
								return m
									.edit({
										content: `<@${players[Plrs.user === 0 ? 1 : 0]}> (${
											client.emojis.cache.get(o_emoji) || '⭕'
										}) won`,

										embeds: [
											epm.setDescription(
												`<@!${players[Plrs.user === 0 ? 1 : 0]}> (${
													client.emojis.cache.get(o_emoji) || '⭕'
												}) won.. That was a nice game.\n` +
													`\`\`\`\n${Plrs.a1.emoji} | ${Plrs.a2.emoji} | ${Plrs.a3.emoji}\n${Plrs.b1.emoji} | ${Plrs.b2.emoji} | ${Plrs.b3.emoji}\n${Plrs.c1.emoji} | ${Plrs.c2.emoji} | ${Plrs.c3.emoji}\n\`\`\``
														.replaceAll(dashmoji, '➖')
														.replaceAll(o_emoji, '⭕')
														.replaceAll(x_emoji, '❌')
											)
										],
										components: []
									})
									.then((m: Message) => {
										m.react('⭕')
									})
						}
						if (
							Plrs.a1.emoji == x_emoji &&
							Plrs.b1.emoji == x_emoji &&
							Plrs.c1.emoji == x_emoji
						)
							won['X-Player'] = true
						if (
							Plrs.a2.emoji == x_emoji &&
							Plrs.b2.emoji == x_emoji &&
							Plrs.c2.emoji == x_emoji
						)
							won['X-Player'] = true
						if (
							Plrs.a3.emoji == x_emoji &&
							Plrs.b3.emoji == x_emoji &&
							Plrs.c3.emoji == x_emoji
						)
							won['X-Player'] = true
						if (
							Plrs.a1.emoji == x_emoji &&
							Plrs.b2.emoji == x_emoji &&
							Plrs.c3.emoji == x_emoji
						)
							won['X-Player'] = true
						if (
							Plrs.a3.emoji == x_emoji &&
							Plrs.b2.emoji == x_emoji &&
							Plrs.c1.emoji == x_emoji
						)
							won['X-Player'] = true
						if (
							Plrs.a1.emoji == x_emoji &&
							Plrs.a2.emoji == x_emoji &&
							Plrs.a3.emoji == x_emoji
						)
							won['X-Player'] = true
						if (
							Plrs.b1.emoji == x_emoji &&
							Plrs.b2.emoji == x_emoji &&
							Plrs.b3.emoji == x_emoji
						)
							won['X-Player'] = true
						if (
							Plrs.c1.emoji == x_emoji &&
							Plrs.c2.emoji == x_emoji &&
							Plrs.c3.emoji == x_emoji
						)
							won['X-Player'] = true
						if (won['X-Player'] != false) {
							let wonner: User | void = await client.users
								.fetch(players[1])
								.catch(console.error)
							resolve(wonner as User)

							if (options.result === 'Button')
								return m
									.edit({
										content: `<@${players[Plrs.user === 0 ? 1 : 0]}> (${
											client.emojis.cache.get(x_emoji) || '❌'
										}) won`,
										components: buttons,

										embeds: [
											epm.setDescription(
												`<@!${players[Plrs.user === 0 ? 1 : 0]}> (${
													client.emojis.cache.get(x_emoji) || '❌'
												}) won, That was a nice game.`
											)
										]
									})
									.then((m: Message) => {
										m.react('❌')
									})
							else if (!options.result || options.result === 'Embed')
								return m
									.edit({
										content: `<@${players[Plrs.user === 0 ? 1 : 0]}> (${
											client.emojis.cache.get(o_emoji) || '❌'
										}) won`,

										embeds: [
											epm.setDescription(
												`<@!${players[Plrs.user === 0 ? 1 : 0]}> (${
													client.emojis.cache.get(x_emoji) || '❌'
												}) won.. That was a nice game.\n` +
													`\`\`\`\n${Plrs.a1.emoji} | ${Plrs.a2.emoji} | ${Plrs.a3.emoji}\n${Plrs.b1.emoji} | ${Plrs.b2.emoji} | ${Plrs.b3.emoji}\n${Plrs.c1.emoji} | ${Plrs.c2.emoji} | ${Plrs.c3.emoji}\n\`\`\``
														.replaceAll(dashmoji, '➖')
														.replaceAll(o_emoji, '⭕')
														.replaceAll(x_emoji, '❌')
											)
										],
										components: []
									})
									.then((m: Message) => {
										m.react('❌')
									})
						}

						m.edit({
							content: `<@${Plrs.userid}>`,
							embeds: [
								epm.setDescription(
									`Waiting for Input | <@!${Plrs.userid}> | Your Emoji: ${
										Plrs.user == 0
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

						collector.on('collect', async (b: any) => {
							if (b.user.id !== Plrs.userid) {
								b.reply({
									content: 'You cannot play now',
									ephemeral: true
								})

								await ttt(m)
							} else {
								await b.deferUpdate()

								if (Plrs.user == 0) {
									Plrs.user = 1
									// @ts-ignore
									Plrs[b.customId] = {
										style: OClr,
										emoji: o_emoji,
										disabled: true
									}
								} else {
									Plrs.user = 0
									// @ts-ignore
									Plrs[b.customId] = {
										style: XClr,
										emoji: x_emoji,
										disabled: true
									}
								}

								const map = (obj: any, func: Function) =>
									Object.entries(obj).reduce(
										(prev, [key, value]) => ({
											...prev,
											[key]: func(key, value)
										}),
										{}
									)
								const objectFilter = (obj: any, predicate: any) =>
									Object.keys(obj)
										.filter((key) => predicate(obj[key])) // @ts-ignore
										.reduce((res, key) => ((res[key] = obj[key]), res), {})
								let Filer = objectFilter(
									map(
										Plrs,
										(_: any, elem: { emoji: string }) => elem.emoji == dashmoji
									),
									(num: boolean) => num == true
								)

								if (Object.keys(Filer).length == 0) {
									if (!won['X-Player'] && !won['O-Player']) {
										await ttt(m)

										if (options.result === 'Button')
											return m
												.edit({
													content: 'Its a Tie!',
													embeds: [
														epm.setDescription(
															`You have tied. Play again to see who wins.`
														)
													]
												})
												.then((m: Message) => {
													m.react(dashmoji)
												})
										else
											return m
												.edit({
													content: 'Its a Tie !',
													embeds: [
														epm.setDescription(
															`You have tied. Play again to see who wins.\n` +
																`\`\`\`\n${Plrs.a1.emoji} | ${Plrs.a2.emoji} | ${Plrs.a3.emoji}\n${Plrs.b1.emoji} | ${Plrs.b2.emoji} | ${Plrs.b3.emoji}\n${Plrs.c1.emoji} | ${Plrs.c2.emoji} | ${Plrs.c3.emoji}\n\`\`\``
																	.replaceAll(dashmoji, '➖')
																	.replaceAll(o_emoji, '⭕')
																	.replaceAll(x_emoji, '❌')
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

								await ttt(m)
							}
						})
						collector.on('end', (collected: any, reason: string) => {
							if (collected.size === 0 && reason == 'time')
								m.edit({
									content: `<@!${Plrs.userid}> didn\'t react in time! (30s)`,
									components: []
								})
						})
					}
				}
			})

			collector.on('end', (collected: any, reason: string) => {
				let embed: MessageEmbed
				if (reason == 'time') {
					embed = new MessageEmbed()
						.setTitle(`Challenge not accepted in time`)
						.setAuthor({
							name: (message.member.user as User).tag,
							iconURL: (message.member.user as User).displayAvatarURL()
						})
						.setColor(`#c90000`)
						.setFooter(
							options.embed?.credit
								? options.embed?.footer
								: {
										text: '©️ Simply Develop. npm i simply-djs',
										iconURL: 'https://i.imgur.com/u8VlLom.png'
								  }
						)
						.setDescription('Ran out of time!\nTime limit: `30s`')
					;(m as Message).edit({
						content: `<@${opponent.id}> did not accept in time !`,
						embeds: [embed],
						components: []
					})
				} else if (reason == 'decline') {
					embed = new MessageEmbed()
						.setTitle(`Game Denied !`)
						.setAuthor({
							name: (message.member.user as User).tag,
							iconURL: (message.member.user as User).displayAvatarURL()
						})
						.setColor(`#c90000`)
						.setFooter(
							options.embed?.credit
								? options.embed?.footer
								: {
										text: '©️ Simply Develop. npm i simply-djs',
										iconURL: 'https://i.imgur.com/u8VlLom.png'
								  }
						)
						.setDescription('The Opponent decided not to play.')
					;(m as Message).edit({
						embeds: [embed],
						components: []
					})
				}
			})
		} catch (err: any) {
			console.log(
				`${chalk.red('Error Occured.')} | ${chalk.magenta(
					'tictactoe'
				)} | Error: ${err.stack}`
			)
		}
	})
}
