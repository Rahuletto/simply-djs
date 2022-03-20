import {
	MessageEmbed,
	Message,
	MessageEmbedFooter,
	MessageEmbedAuthor,
	ColorResolvable,
	MessageActionRow,
	MessageButton,
	ButtonInteraction,
	MessageButtonStyle,
	User,
	MessageAttachment,
	GuildMember,
	TextChannel,
	Role
} from 'discord.js'
import chalk from 'chalk'
import gsys from './model/gSys'

// ------------------------------
// ----- I N T E R F A C E ------
// ------------------------------

interface btnTemplate {
	style?: MessageButtonStyle
	label?: string
	emoji?: string
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/Buttons/manageBtn#ticketSystem*
 */

interface ticketBtn {
	close: btnTemplate
	reopen: btnTemplate
	delete: btnTemplate
	transcript: btnTemplate
}

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

interface ticketSys {
	ticketname?: string
	buttons?: ticketBtn
	pingRole?: string | string[]
	category?: string
	timed?: boolean
	embed?: CustomizableEmbed
}

interface btnRole {
	addedMsg: string
	removedMsg: string
}
// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

export type manageBtnOptions = {
	ticketSys?: ticketSys
	btnRole?: btnRole
}

// ------------------------------
// ------- P R O M I S E --------
// ------------------------------

type ticketDelete = {
	type?: 'Delete'
	channelId?: string
	user?: User
	data?: MessageAttachment
}

type rerolly = {
	type?: 'Reroll'
	user?: GuildMember | GuildMember[]
	msgURL?: string
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * An Button Handler for **simplydjs package functions.**
 * @param interaction
 * @param options
 * @example simplydjs.manageBtn(interaction)
 */

export async function manageBtn(
	interaction: ButtonInteraction,
	options: manageBtnOptions = { ticketSys: { timed: true } }
): Promise<ticketDelete | rerolly> {
	return new Promise(async (resolve, reject) => {
		if (interaction.isButton()) {
			try {
				let member = interaction.member

				// ------------------------------
				// ------ B T N - R O L E -------
				// ------------------------------

				if (interaction.customId.startsWith('role-')) {
					let roleId = interaction.customId.replace('role-', '')

					let role = await interaction.guild.roles.fetch(roleId, {
						force: true
					})
					if (!role) return
					else {
						await interaction.deferReply({ ephemeral: true })
						// @ts-ignore
						if (!member.roles.cache.find((r) => r.id === role.id)) {
							member.roles // @ts-ignore
								.add(role)
								.catch((err: any) =>
									interaction.channel.send({
										content:
											'ERROR: Role is higher than me. `MISSING_PERMISSIONS`'
									})
								)

							await interaction.editReply({
								content:
									options?.btnRole?.addedMsg ||
									`✅ Added the ${role.toString()} role to you.`
							})
							// @ts-ignore
						} else if (member.roles.cache.find((r) => r.id === role.id)) {
							member.roles // @ts-ignore
								.remove(role)
								.catch((err: any) =>
									interaction.channel.send({
										content:
											'ERROR: Role is higher than me. `MISSING_PERMISSIONS`'
									})
								)

							await interaction.editReply({
								content:
									options?.btnRole?.removedMsg ||
									`❌ Removed the ${role.toString()} role from you.`
							})
						}
					}
				}

				// ------------------------------
				// ---- T I C K E T - S Y S -----
				// ------------------------------
				else if (interaction.customId === 'create_ticket') {
					await interaction.deferReply({ ephemeral: true })

					let name = options.ticketSys?.ticketname || `ticket_{tag}`
					name = name
						.replaceAll('{username}', member.user.username)
						.replaceAll('{tag}', (member.user as User).tag)
						.replaceAll('{id}', member.user.id)

					let topic = `Ticket has been opened by <@${member.user.id}>`

					let check = await interaction.guild.channels.cache.find(
						(ch) => (ch as TextChannel).topic === topic
					)

					if (check) {
						await interaction.editReply({
							content: `You have an pre-existing ticket opened (${check.toString()}). Close it before creating a new one.`
						})
					} else if (!check) {
						let chparent = options.ticketSys?.category || null
						let category = interaction.guild.channels.cache.get(
							options.ticketSys?.category
						)
						if (!category) {
							chparent = null
						}

						let ch = await interaction.guild.channels.create(name, {
							type: 'GUILD_TEXT',
							topic: topic,
							parent: chparent,
							permissionOverwrites: [
								{
									id: interaction.guild.roles.everyone,
									deny: [
										'VIEW_CHANNEL',
										'SEND_MESSAGES',
										'READ_MESSAGE_HISTORY'
									] //Deny permissions
								},
								{
									id: member.user.id,
									allow: [
										'VIEW_CHANNEL',
										'SEND_MESSAGES',
										'READ_MESSAGE_HISTORY'
									]
								}
							]
						})
						let rlz: Role[] = []

						if (options.ticketSys?.pingRole) {
							if (Array.isArray(options.ticketSys?.pingRole)) {
								options.ticketSys?.pingRole.forEach(async (e) => {
									let roler = await interaction.guild.roles.fetch(e, {
										force: true
									})

									if (roler) {
										rlz.push(roler)
									}
								})
							} else if (!Array.isArray(options.ticketSys?.pingRole)) {
								let roler = await interaction.guild.roles.fetch(
									options.ticketSys?.pingRole,
									{
										force: true
									}
								)

								if (roler) {
									rlz.push(roler)
								}
							}

							rlz.forEach((e) => {
								ch.permissionOverwrites
									.create(e, {
										VIEW_CHANNEL: true,
										SEND_MESSAGES: true,
										READ_MESSAGE_HISTORY: true
									})
									.catch((e) => {})
							})
						}

						let str =
							'\n\nThis channel will be deleted after 30 minutes to prevent spams.'

						if (options.ticketSys.timed == false) {
							str = ''
						}

						let emb = new MessageEmbed()
							.setTitle('Ticket Created')
							.setDescription(
								options.ticketSys.embed?.description
									.replaceAll('{user}', member.user.toString())
									.replaceAll('{tag}', (member.user as User).tag)
									.replaceAll('{id}', member.user.id)
									.replaceAll('{guild}', interaction.guild.name) ||
									`Ticket has been raised by ${
										member.user
									}. The support will reach you shortly.\n\n**User ID**: \`${
										member.user.id
									}\` | **User Tag**: \`${(member.user as User).tag}\`${str}`
							)
							.setThumbnail(interaction.guild.iconURL())
							.setTimestamp()
							.setColor(options.ticketSys.embed?.color || '#075FFF')
							.setFooter(
								options.ticketSys.embed?.credit
									? options.ticketSys.embed?.footer
									: {
											text: '©️ Simply Develop. npm i simply-djs',
											iconURL: 'https://i.imgur.com/u8VlLom.png'
									  }
							)

						let close = new MessageButton()
							.setStyle(options.ticketSys?.buttons?.close?.style || 'DANGER')
							.setEmoji(options.ticketSys?.buttons?.close?.emoji || '🔒')
							.setLabel(options.ticketSys?.buttons?.close?.label || 'Close')
							.setCustomId('close_ticket')

						let closerow = new MessageActionRow().addComponents([close])

						ch.send({
							content: `Here is your ticket ${member.user.toString()}. | ${rlz.join(
								','
							)}`,
							embeds: [emb],
							components: [closerow]
						}).then(async (msg) => {
							await msg.pin()
						})

						setTimeout(async () => {
							await ch.delete().catch(() => {})
						}, 1000 * 60 * 30)
					}
				} else if (interaction.customId === 'close_ticket') {
					await interaction.deferReply({ ephemeral: true })

					interaction.editReply({ content: 'Locking the channel.' })
					;(interaction.channel as TextChannel).permissionOverwrites
						.edit(interaction.guild.roles.everyone, {
							SEND_MESSAGES: false
						})
						.catch((err) => {})

					let X_btn = new MessageButton()
						.setStyle(options.ticketSys?.buttons?.delete?.style || 'DANGER')
						.setEmoji(options.ticketSys?.buttons?.delete?.emoji || '❌')
						.setLabel(options.ticketSys?.buttons?.delete?.label || 'Delete')
						.setCustomId('delete_ticket')

					let open_btn = new MessageButton()
						.setStyle(options.ticketSys?.buttons?.reopen?.style || 'SUCCESS')
						.setEmoji(options.ticketSys?.buttons?.reopen?.emoji || '🔓')
						.setLabel(options.ticketSys?.buttons?.delete?.label || 'Reopen')
						.setCustomId('open_ticket')

					let tr_btn = new MessageButton()
						.setStyle(
							options.ticketSys?.buttons?.transcript?.style || 'PRIMARY'
						)
						.setEmoji(options.ticketSys?.buttons?.transcript?.emoji || '📜')
						.setLabel(
							options.ticketSys?.buttons?.transcript?.style || 'Transcript'
						)
						.setCustomId('tr_ticket')

					let row = new MessageActionRow().addComponents([
						open_btn,
						X_btn,
						tr_btn
					])

					await (interaction.message as Message).edit({
						components: [row]
					})
				} else if (interaction.customId === 'tr_ticket') {
					await interaction.deferReply({ ephemeral: true })

					let messagecollection = await interaction.channel.messages.fetch({
						limit: 100
					})
					let response: string[] = []

					messagecollection = messagecollection.sort(
						(a, b) => a.createdTimestamp - b.createdTimestamp
					)

					messagecollection.forEach((m) => {
						if (m.author.bot) return
						const attachment = m.attachments.first()
						const url = attachment ? attachment.url : null
						if (url !== null) {
							m.content = url
						}

						response.push(
							`[${m.author.tag} | ${m.author.id}] => \`${m.content}\``
						)
					})

					let tr = await interaction.editReply({
						content: 'Collecting messages to create logs'
					})

					let use: GuildMember | string = (
						interaction.channel as TextChannel
					).topic
						.replace(`Ticket has been opened by <@`, '')
						.replace('>', '')

					use = await interaction.guild.members.fetch(use)

					let attach = new MessageAttachment(
						Buffer.from(response.join(`\n`), 'utf-8'),
						`${(use.user as User).tag}.md`
					)

					setTimeout(async () => {
						await interaction.editReply({
							content: 'Done. Generated the logs',
							files: [attach],
							embeds: []
						})
					}, 2300)
				} else if (interaction.customId === 'delete_ticket') {
					await interaction.deferReply({ ephemeral: true })

					let yes = new MessageButton()
						.setCustomId('yea_del')
						.setLabel('Delete')
						.setStyle('DANGER')

					let no = new MessageButton()
						.setCustomId('dont_del')
						.setLabel('Cancel')
						.setStyle('SUCCESS')

					let row = new MessageActionRow().addComponents([yes, no])

					interaction.editReply({
						content: 'Are you sure ?? This process is not reversible !',
						components: [row]
					})
				} else if (interaction.customId === 'yea_del') {
					await interaction.deferUpdate()

					let messagecollection = await interaction.channel.messages.fetch({
						limit: 100
					})
					let response: string[] = []

					messagecollection = messagecollection.sort(
						(a, b) => a.createdTimestamp - b.createdTimestamp
					)

					messagecollection.forEach((m) => {
						if (m.author.bot) return
						const attachment = m.attachments.first()
						const url = attachment ? attachment.url : null
						if (url !== null) {
							m.content = url
						}

						response.push(
							`[${m.author.tag} | ${m.author.id}] => \`${m.content}\``
						)
					})

					let attach = new MessageAttachment(
						Buffer.from(response.join(`\n`), 'utf-8'),
						`${(interaction.channel as TextChannel).topic}.md`
					)

					let use: GuildMember | string = (
						interaction.channel as TextChannel
					).topic
						.replace(`Ticket has been opened by <@`, '')
						.replace('>', '')

					use = await interaction.guild.members.fetch(use)

					resolve({
						type: 'Delete',
						channelId: interaction.channel.id,
						user: use.user,
						data: attach
					})

					setTimeout(async () => {
						await interaction.channel.delete()
					}, 2000)
				} else if (interaction.customId === 'dont_del') {
					await interaction.deferUpdate()
					;(interaction.message as Message).edit({
						content: 'You cancelled the deletion',
						components: []
					})
				} else if (interaction.customId === 'open_ticket') {
					await interaction.deferReply({ ephemeral: true })

					interaction.editReply({ content: 'Unlocking the channel.' })
					;(interaction.channel as TextChannel).permissionOverwrites
						.edit(interaction.guild.roles.everyone, {
							SEND_MESSAGES: true
						})
						.catch((err) => {})

					let close = new MessageButton()
						.setStyle(options.ticketSys?.buttons?.close?.style || 'DANGER')
						.setEmoji(options.ticketSys?.buttons?.close?.emoji || '🔒')
						.setLabel(options.ticketSys?.buttons?.close?.label || 'Close')
						.setCustomId('close_ticket')

					let closerow: MessageActionRow = new MessageActionRow().addComponents(
						[close]
					)

					;(interaction.message as Message).edit({ components: [closerow] })
				}
				// ------------------------------
				// ------ G I V E A W A Y -------
				// ------------------------------
				else if (interaction.customId === 'enter_giveaway') {
					let data = await gsys.findOne({
						message: interaction.message.id
					})

					if (Number(data.endTime) < Date.now()) return
					else {
						if (data.requirements.type === 'role') {
							if (
								// @ts-ignore
								!interaction.member.roles.cache.find(
									(r: any) => r.id === data.requirements.id
								)
							)
								return interaction.followUp({
									content:
										'You do not fall under the requirements. | You dont have the role',
									ephemeral: true
								})
						}
						if (data.requirements.type === 'guild') {
							let g = interaction.client.guilds.cache.get(data.requirements.id)
							let mem = await g.members.fetch(interaction.member.user.id)

							if (!mem)
								return interaction.followUp({
									content:
										'You do not fall under the requirements. | Join the server.',
									ephemeral: true
								})
						}

						let entris = data.entry.find((id) => id.userID === member.user.id)

						if (entris) {
							await gsys.findOneAndUpdate(
								{
									message: interaction.message.id
								},
								{
									$pull: { entry: { userID: member.user.id } }
								}
							)

							await interaction.followUp({
								content: 'Left the giveaway ;(',
								ephemeral: true
							})
						} else if (!entris) {
							data.entry.push({
								userID: member.user.id,
								guildID: interaction.guild.id,
								messageID: interaction.message.id
							})

							data.entered = data.entered + 1

							await data.save().then(async (a) => {
								await interaction.followUp({
									content: 'Entered the giveaway !',
									ephemeral: true
								})
							})
						}

						let eem = interaction.message.embeds[0]

						eem.fields[2].value = `***${data.entered.toString()}***`

						let mes = interaction.message as Message
						mes.edit({ embeds: [eem] })
					}
				}

				if (
					interaction.customId === 'end_giveaway' ||
					interaction.customId === 'reroll_giveaway'
				) {
					let allComp = await interaction.message.components[0]
					let ftr = await interaction.message.embeds[0].footer

					const embeded = new MessageEmbed()
						.setTitle('Processing Data...')
						.setColor(0xcc0000)
						.setDescription(
							`Please wait.. We are Processing the winner with some magiks`
						)
						.setFooter({
							text: 'Ending the Giveaway, Scraping the ticket..'
						})

					let msg = interaction.message as Message

					await msg.edit({ embeds: [embeded], components: [] }).catch(() => {})

					let dispWin: string[] = []

					let dt = await gsys.findOne({ message: msg.id })

					dt.endTime = undefined
					await dt.save().catch(() => {})

					let winArr: any[] = []

					let winCt = dt.winCount

					let entries = dt.entry

					for (let i = 0; i < winCt; i++) {
						let winno = Math.floor(Math.random() * dt.entered)

						winArr.push(entries[winno])
					}

					setTimeout(() => {
						winArr.forEach(async (name) => {
							await interaction.guild.members
								.fetch(name.userID)
								.then((user) => {
									dispWin.push(`<@${user.user.id}>`)

									let embod = new MessageEmbed()
										.setTitle('You.. Won the Giveaway !')
										.setDescription(
											`You just won \`${dt.prize}\` in the Giveaway at \`${user.guild.name}\` Go claim it fast !`
										)
										.setColor(0x075fff)
										.setFooter(ftr)

									let gothe = new MessageButton()
										.setLabel('View Giveaway')
										.setStyle('LINK')
										.setURL(msg.url)

									let entrow = new MessageActionRow().addComponents([gothe])

									return user
										.send({ embeds: [embod], components: [entrow] })
										.catch(() => {})
								})
								.catch(() => {})
						})
					}, 2000)

					setTimeout(async () => {
						if (!dt) return await msg.delete()
						if (dt) {
							let tim = Number(dt.endTime.slice(0, -3))

							if (dt.entered <= 0 || !winArr[0]) {
								let emed = new MessageEmbed()
									.setTitle('No one entered')
									.setDescription(
										`Oops.. No one entered the giveaway.\n\n` +
											(dt.desc
												? dt.desc
														.replaceAll('{prize}', dt.prize)
														.replaceAll('{endsAt}', `<t:${tim}:R>`)
														.replaceAll(
															'{requirements}',
															dt.requirements.type === 'none'
																? 'None'
																: dt.requirements.type +
																		' | ' +
																		(dt.requirements.type === 'role'
																			? `${dt.requirements.id}`
																			: dt.requirements.id)
														)
														.replaceAll('{winCount}', dt.winCount.toString())
														.replaceAll('{entered}', '0')
												: `**🎁 Prize**: *${dt.prize}*\n\n**⏰ Ends:** <t:${tim}:R>\n`)
									)
									.addFields(
										{ name: '🏆 Winner(s):', value: `\`${dt.winCount}\`` },
										{ name: '🎫 Entered', value: `***${dt.entered}***` }
									)
									.setColor('RED')
									.setFooter({
										text: 'No one entered..'
									})

								allComp.components[0].disabled = true
								allComp.components[1].disabled = true
								allComp.components[2].disabled = true

								return await msg.edit({
									embeds: [emed], //@ts-ignore
									components: [allComp]
								})
							}

							let resWin: GuildMember[] = []

							allComp.components[0].disabled = true
							allComp.components[1].disabled = false
							allComp.components[2].disabled = true

							let em = new MessageEmbed()
								.setTitle('We got the winner !')
								.setDescription(
									`${dispWin.join(', ')} won the prize !\n` +
										(dt.desc
											? dt.desc
											: `Reroll the giveaway using the interaction.\n\n**🎁 Prize**: *${dt.prize}*\n\n**⏰ Ends:** <t:${tim}:R>\n`)
								)
								.addFields(
									{ name: '🏆 Winner(s):', value: `\`${dt.winCount}\`` },
									{ name: '🎫 Entered', value: `***${dt.entered}***` }
								)
								.setColor(0x3bb143)
								.setFooter(ftr)
							//@ts-ignore
							await msg.edit({ embeds: [em], components: [allComp] })

							if (interaction.customId === 'reroll_giveaway') {
								resolve({
									type: 'Reroll',
									msgURL: msg.url,
									user: resWin
								})
							}
						}
					}, 5200)
				}
			} catch (err: any) {
				console.log(
					`${chalk.red('Error Occured.')} | ${chalk.magenta(
						'manageBtn'
					)} | Error: ${err.stack}`
				)
			}
		} else return
	})
}
