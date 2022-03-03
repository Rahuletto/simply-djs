import ms from 'ms'
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
	MessageButtonStyle
} from 'discord.js'
import chalk from 'chalk'
import model from './model/gSys'

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

interface CustomEmbed {
	author?: MessageEmbedAuthor
	title?: string
	footer?: MessageEmbedFooter
	description?: string
	color?: ColorResolvable

	credit?: boolean
}

interface requirement {
	type?: 'Role' | 'Guild'
	value?: string
}

interface btnTemplate {
	style?: MessageButtonStyle
	text?: string
	emoji?: string
}

interface btn {
	enter?: btnTemplate
	end?: btnTemplate
	reroll?: btnTemplate
}

export type giveawayOptions = {
	prize?: string
	winners: string | number
	channel?: MessageChannel
	time?: string

	buttons?: btn

	req?: requirement
	ping?: string

	embed?: CustomEmbed
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

export async function giveawaySystem(
	client: Client,
	message: Message | CommandInteraction,
	options: giveawayOptions = {
		winners: 1,
		buttons: {
			enter: { style: 'SUCCESS', text: 'Enter', emoji: '🎁' },
			end: { style: 'DANGER', text: 'End', emoji: '⛔' },
			reroll: { style: 'PRIMARY', text: 'Reroll', emoji: '🔁' }
		}
	}
): Promise<null> {
	return new Promise(async (resolve) => {
		try {
			let interaction
			// @ts-ignore
			if (message.commandId) {
				interaction = message
			}
			let timeStart: number = Date.now()
			let int = message as CommandInteraction
			let mes = message as Message

			// @ts-ignore
			if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
				if (interaction) {
					return await int.followUp({
						content: 'You are not a admin to start a giveaway',
						ephemeral: true
					})
				} else if (!interaction) {
					return await message.reply({
						content: 'You are not a admin to start a giveaway'
					})
				}
			}

			if (!options.embed) {
				options.embed = {
					footer: {
						text: '©️ Simply Develop. npm i simply-djs',
						iconURL: 'https://i.imgur.com/u8VlLom.png'
					},
					color: '#075FFF',
					title: 'Giveaways',
					credit: true
				}
			}

			let ch
			let time: any
			let winners: any
			let prize: any
			let req = 'None'

			let content = '** **'

			if (options.ping) {
				content = message.guild.roles.cache
					.find((r: any) => r.id === options.ping)
					.toString()
			}
			let val: any

			if (options.req?.type === 'Role') {
				val = await message.guild.roles.fetch(options.req?.value, {
					force: true
				})
				req = 'Role'
			} else if (options.req?.type === 'Guild') {
				val = client.guilds.cache.get(options.req?.value)
				await val.invites.fetch().then((a: any) => {
					val = a.first()
				})
				req = 'Guild'
			}

			if (interaction) {
				ch =
					int.options.getChannel('channel') ||
					options.channel ||
					interaction.channel
				time = int.options.getString('time') || options.time || '1h'
				winners = int.options.getInteger('winners') || options.winners
				prize = int.options.getString('prize') || options.prize
			} else if (!interaction) {
				const [...args] = mes.content.split(/ +/g)
				// @ts-ignore
				ch = options.channel || message.mentions.channels.first()
				time = options.time || args[1]
				winners = args[2] || options.winners
				prize = options.prize || args.slice(3).join(' ')
			}

			let enter = new MessageButton()
				.setLabel(options.buttons.enter.text)
				.setEmoji(options.buttons.enter.emoji)
				.setCustomId('enter_giveaway')
				.setStyle(options.buttons.enter.style)

			let end = new MessageButton()
				.setLabel('End')
				.setEmoji('⛔')
				.setCustomId('end_giveaway')
				.setStyle('DANGER')

			let reroll = new MessageButton()
				.setLabel('Reroll')
				.setEmoji('🔁')
				.setCustomId('reroll_giveaway')
				.setStyle('PRIMARY')
				.setDisabled(true)

			let row = new MessageActionRow().addComponents([enter, reroll, end])

			let endtime = Number((Date.now() + ms(time)).toString().slice(0, -3))

			let embed = new MessageEmbed()
				.setTitle(options.embed?.title || 'Giveaways')
				.setColor(options.embed?.color || '#075FFF')
				.setTimestamp(Number(Date.now() + ms(time)))
				.setFooter(
					options.embed?.credit
						? options.embed?.footer
						: {
								text: '©️ Simply Develop. npm i simply-djs',
								iconURL: 'https://i.imgur.com/u8VlLom.png'
						  }
				)
				.setDescription(
					options.embed?.description
						.replaceAll('{prize}', prize)
						.replaceAll('{endsAt}', endtime.toString())
						.replaceAll(
							'{requirements}',
							req === 'None' ? 'None' : req + ' | ' + val
						)
						.replaceAll('{winCount}', winners)
						.replaceAll('{entered}', '0') ||
						`Interact with the giveaway using the buttons. \n\n**🎁 Prize**: *${prize}*\n**⏰ Ends:** ${endtime}`
				)
				.addFields(
					{
						name: '🤔 Requirements:',
						value: `${req === 'None' ? 'None' : req + ' | ' + val}`
					},
					{ name: '🏆 Winner(s):', value: `\`${winners}\`` },
					{ name: '🎫 Entered', value: `***0***` }
				)

			ch.send({ content: content, embeds: [embed], components: [row] }).then(
				async (msg: any) => {
					const link = new MessageButton()
						.setLabel('View Giveaway.')
						.setStyle('LINK')
						.setURL(msg.url)

					let rowew = new MessageActionRow().addComponents([link])

					await message.channel.send({
						content: 'Giveaway has started.',
						components: [rowew]
					})

					let tim = Number(Date.now() + ms(time))

					let crete = new model({
						message: msg.id,
						entered: 0,
						winCount: winners,
						desc: options.embed?.description || '',
						requirements: {},
						started: timeStart,
						endTime: Number(Date.now() + ms(time))
					})

					await crete.save()

					let timer = setInterval(async () => {
						if (!msg) return

						if (tim < Date.now()) {
							const embeded = new MessageEmbed()
								.setTitle('Processing Data...')
								.setColor(0xcc0000)
								.setDescription(
									`Please wait.. We are Processing the winner with some magiks`
								)
								.setFooter({
									text: 'Ending the Giveaway, Scraping the ticket..'
								})

							await msg
								.edit({ embeds: [embeded], components: [] })
								.catch(() => {})

							setTimeout(async () => {
								clearInterval(timer)

								let dt = await model.findOne({ message: msg.id })

								if (!dt) return await msg.delete()
								if (dt) {
									let winCt = dt.winCount

									let entries = dt.entry

									let winArr = []

									for (let i = 0; i < winCt; i++) {
										let winno = Math.floor(Math.random() * dt.entered)

										winArr.push(entries[winno])
									}

									let dispWin: string[] = []

									winArr.forEach(async (name) => {
										await message.guild.members
											.fetch(name.userID)
											.then((user) => {
												let embod = new MessageEmbed()
													.setTitle('You.. Won the Giveaway !')
													.setDescription(
														`You just won \`${prize}\` in the Giveaway at \`${user.guild.name}\` Go claim it fast !`
													)
													.setColor(0x075fff)
													.setFooter(
														options.embed?.credit
															? options.embed?.footer
															: {
																	text: '©️ Simply Develop. npm i simply-djs',
																	iconURL: 'https://i.imgur.com/u8VlLom.png'
															  }
													)

												let gothe = new MessageButton()
													.setLabel('View Giveaway')
													.setStyle('LINK')
													.setURL(msg.url)

												let entrow = new MessageActionRow().addComponents([
													gothe
												])

												user
													.send({ embeds: [embod], components: [entrow] })
													.catch(() => {})
											})

										dispWin.push(`<@${name.userID}>`)
									})

									let em = new MessageEmbed()
										.setTitle('We got the winner !')
										.setDescription(
											`${dispWin.join(', ')} won all the prize !\n\n` +
												options.embed?.description
													.replaceAll('{prize}', prize)
													.replaceAll('{endsAt}', endtime.toString())
													.replaceAll(
														'{requirements}',
														req === 'None' ? 'None' : req + ' | ' + val
													)
													.replaceAll('{winCount}', winners)
													.replaceAll('{entered}', '0') ||
												`Reroll the giveaway using the button. \n\n**🎁 Prize**: *${prize}*\n**⏰ Ends:** ${endtime}`
										)
										.addFields(
											{
												name: '🤔 Requirements:',
												value: `${req === 'None' ? 'None' : req + ' | ' + val}`
											},
											{ name: '🏆 Winner(s):', value: `\`${winners}\`` },
											{ name: '🎫 Entered', value: `***0***` }
										)
										.setColor(0x3bb143)
										.setFooter(
											options.embed?.credit
												? options.embed?.footer
												: {
														text: '©️ Simply Develop. npm i simply-djs',
														iconURL: 'https://i.imgur.com/u8VlLom.png'
												  }
										)

									let entere = new MessageButton()
										.setLabel('Enter')
										.setEmoji('🎁')
										.setCustomId('enter_giveaway')
										.setStyle('SUCCESS')
										.setDisabled(true)

									let ende = new MessageButton()
										.setLabel('End')
										.setEmoji('⛔')
										.setCustomId('end_giveaway')
										.setStyle('DANGER')
										.setDisabled(true)

									let rerolle = new MessageButton()
										.setLabel('Reroll')
										.setEmoji('🔁')
										.setCustomId('reroll_giveaway')
										.setStyle('PRIMARY')
										.setDisabled(false)

									let rowwe = new MessageActionRow().addComponents([
										entere,
										rerolle,
										ende
									])

									msg.edit({ embeds: [em], components: [rowwe] })
								}
							}, 5200)
						}
					}, 5000)
				}
			)
		} catch (err: any) {
			console.log(
				`${chalk.red('Error Occured.')} | ${chalk.magenta(
					'giveaway'
				)} | Error: ${err.stack}`
			)
		}
	})
}
