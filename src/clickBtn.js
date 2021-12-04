const Discord = require('discord.js')
const fs = require('fs')

/**
 * @param {Discord.ButtonInteraction} button
 * @param {import('../index').clickBtnOptions} options
 */

/**
 --- options ---
 
credit => Boolean
ticketname => (Options {username} | {id} | {tag} ) String

embed => Embed
logembed => Embed
confirmEmb => Embed

logChannel => (Channel ID) String

closeColor => (ButtonColor) String
openColor => (ButtonColor) String
delColor => (ButtonColor) String
trColor => (ButtonColor) String

cooldownMsg => String
role => (Role ID) String
categoryID => String

embedDesc => String
embedColor => HexColor
embedTitle => String

delEmoji => (Emoji ID) String
closeEmoji => (Emoji ID) String
openEmoji => (Emoji ID) String
trEmoji => (Emoji ID) String

timeout => Boolean
pingRole => (Role ID) String

db => Database
 */

async function clickBtn(button, options = []) {
	if (button.isButton()) {
		try {
			if (options.credit === false) {
				;(foot = button.message.guild.name), button.message.guild.iconURL()
			} else {
				foot = '©️ Simply Develop. npm i simply-djs'
			}

			if (button.customId.startsWith('role-')) {
				button.deferReply({ ephemeral: true })
				let rle = button.customId.replace('role-', '')

				let real = button.guild.roles.cache.find((r) => r.id === rle)
				if (!real) return
				else {
					if (button.member.roles.cache.find((r) => r.id === real.id)) {
						button.followUp({
							content: 'You already have the role. Removing it now',
							ephemeral: true
						})

						button.member.roles
							.remove(real)
							.catch((err) =>
								button.message.channel.send(
									'ERROR: Role is higher than me. MISSING_PERMISSIONS'
								)
							)
					} else {
						button.followUp({
							content: `Gave you the role ${real} | Name: ${real.name} | ID: ${real.id}`,
							ephemeral: true
						})

						button.member.roles
							.add(real)
							.catch((err) =>
								button.message.channel.send(
									'ERROR: Role is higher than me. MISSING_PERMISSIONS'
								)
							)
					}
				}
			}

			let { MessageButton, MessageActionRow } = require('discord.js')

			if (button.customId === 'create_ticket') {
				button.deferUpdate()
				let ticketname = `ticket_${button.user.id}`

				if (options.ticketname) {
					ticketname = options.ticketname
						.replace('{username}', button.user.username)
						.replace('{id}', button.user.id)
						.replace('{tag}', button.user.tag)
				}

				let topic = `Ticket opened by <@${button.user.id}>`
				let antispamo = await button.guild.channels.cache.find(
					(ch) => ch.topic === topic
				)

				if (options.trColor) {
					if (options.trColor === 'grey') {
						options.trColor = 'SECONDARY'
					} else if (options.trColor === 'red') {
						options.trColor = 'DANGER'
					} else if (options.trColor === 'green') {
						options.trColor = 'SUCCESS'
					} else if (options.trColor === 'blurple') {
						options.trColor = 'PRIMARY'
					}
				}

				if (options.closeColor) {
					if (options.closeColor === 'grey') {
						options.closeColor = 'SECONDARY'
					} else if (options.closeColor === 'red') {
						options.closeColor = 'DANGER'
					} else if (options.closeColor === 'green') {
						options.closeColor = 'SUCCESS'
					} else if (options.closeColor === 'blurple') {
						options.closeColor = 'PRIMARY'
					}
				}

				if (options.openColor) {
					if (options.openColor === 'grey') {
						options.openColor = 'SECONDARY'
					} else if (options.openColor === 'red') {
						options.openColor = 'DANGER'
					} else if (options.openColor === 'green') {
						options.openColor = 'SUCCESS'
					} else if (options.openColor === 'blurple') {
						options.openColor = 'PRIMARY'
					}
				}

				if (options.delColor) {
					if (options.delColor === 'grey') {
						options.delColor = 'SECONDARY'
					} else if (options.delColor === 'red') {
						options.delColor = 'DANGER'
					} else if (options.delColor === 'green') {
						options.delColor = 'SUCCESS'
					} else if (options.delColor === 'blurple') {
						options.delColor = 'PRIMARY'
					}
				}

				if (antispamo) {
					button.followUp({
						content:
							options.cooldownMsg ||
							'You already have a ticket opened.. Please delete it before opening another ticket.',
						ephemeral: true
					})
				} else if (!antispamo) {
					chparent = options.categoryID || null
					let categ = button.guild.channels.cache.get(options.categoryID)
					if (!categ) {
						chparent = null
					}

					button.guild.channels
						.create(ticketname, {
							type: 'text',
							topic: topic,
							parent: chparent,
							permissionOverwrites: [
								{
									id: button.message.guild.roles.everyone,
									deny: [
										'VIEW_CHANNEL',
										'SEND_MESSAGES',
										'READ_MESSAGE_HISTORY'
									] //Deny permissions
								},
								{
									id: button.user.id,
									allow: [
										'VIEW_CHANNEL',
										'SEND_MESSAGES',
										'READ_MESSAGE_HISTORY'
									]
								}
							]
						})
						.then((ch) => {
							let lep = []

							if (options.role && Array.isArray(options.role)) {
								options.role.forEach((e) => {
									let rw = button.guild.roles.cache.find((r) => r.id === e)

									if (rw) {
										lep.push(e)
									}
								})
							} else if (options.role && !Array.isArray(options.role)) {
								let rew = button.guild.roles.cache.find(
									(r) => r.id === options.role
								)

								if (rew) {
									lep.push(options.role)
								}
							}

							if (options.pingRole && Array.isArray(options.pingRole)) {
								options.pingRole.forEach((e) => {
									let rw = button.guild.roles.cache.find((r) => r.id === e)

									if (rw) {
										lep.push(e)
									}
								})
							} else if (options.pingRole && !Array.isArray(options.pingRole)) {
								let rww = button.guild.roles.cache.find(
									(r) => r.id === options.pingRole
								)

								if (rww) {
									lep.push(options.pingRole)
								}
							}

							lep.forEach((e) => {
								ch.permissionOverwrites
									.create(e, {
										VIEW_CHANNEL: true,
										SEND_MESSAGES: true,
										READ_MESSAGE_HISTORY: true
									})
									.catch((er) => {
										console.log(`Error | clickBtn | ${er.stack}`)
										ch.send({ content: `Error: \n\`\`\`\n${er.stack}\n\`\`\`` })
									})
							})

							let lele =
								'\nThis channel will be deleted after 10 minutes to reduce the clutter'

							if (options.timeout === false) {
								lele = ''
							}

							let emb = new Discord.MessageEmbed()
								.setTitle('Ticket Created')
								.setDescription(
									options.embedDesc ||
										`Ticket has been raised by ${button.user}. We ask the Admins to summon here\n**User ID**: \`${button.user.id}\` | **User Tag**: \`${button.user.tag}\`\n${lele}`
								)
								.setThumbnail(button.message.guild.iconURL())
								.setTimestamp()
								.setColor(options.embedColor || '#075FFF')
								.setFooter(foot)

							if (options.embed) {
								options.embed.description = options.embed.description
									.replaceAll('{tag}', button.user.tag)
									.replaceAll('{user}', button.user)
									.replaceAll('{id}', button.user.id)
									.replaceAll('{timeout}', lele)
									.replaceAll('{guild}', button.guild.name)
							}

							let close_btn = new MessageButton()
								.setStyle(options.closeColor || 'PRIMARY')
								.setEmoji(options.closeEmoji || '🔒')
								.setLabel('Close')
								.setCustomId('close_ticket')

							let closerow = new MessageActionRow().addComponents([close_btn])
							let pingrole = []

							if (options.pingRole) {
								if (options.pingRole && Array.isArray(options.pingRole)) {
									options.pingRole.forEach((e) => {
										let rollw = button.guild.roles.cache.find((r) => r.id === e)

										if (rollw) {
											pingrole.push(`${rollw}`)
										}
									})
								} else if (
									options.pingRole &&
									!Array.isArray(options.pingRole)
								) {
									let rol = button.guild.roles.cache.find(
										(r) => r.id === options.pingRole
									)

									if (rol) {
										pingrole.push(`${rol}`)
									}
								}
							}

							if (pingrole.length === 0) {
								pingrole = ''
							}

							ch.send({
								content: `${button.user} ${pingrole}`,
								embeds: [options.embed || emb],
								components: [closerow]
							}).then(async (msg) => {
								await msg.pin()
							})

							if (options.timeout === false) return
							else if (options.timeout === true || !options.timeout) {
								setTimeout(() => {
									ch.send({
										content:
											'Timeout.. You have reached 10 minutes. This ticket is getting deleted right now.'
									})

									setTimeout(() => {
										ch.delete()
									}, 10000)
								}, 600000)
							}
						})
				}
			}

			if (button.customId === 'tr_ticket') {
				button.deferUpdate()
				let messagecollection = await button.channel.messages.fetch({
					limit: 100
				})
				let response = []

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

					response.push(`| ${m.author.tag} | => ${m.content}`)
				})

				let kek = await button.followUp({
					embeds: [
						new Discord.MessageEmbed()
							.setColor('#075FFF')
							.setAuthor(
								'Transcripting...',
								'https://cdn.discordapp.com/emojis/757632044632375386.gif?v=1'
							)
					]
				})

				let attach = new Discord.MessageAttachment(
					Buffer.from(response.toString().replaceAll(',', '\n'), 'utf-8'),
					`${button.channel.topic}.txt`
				)

				setTimeout(async () => {
					await kek.edit({ files: [attach], embeds: [] })
				}, 3000)
			}
			if (button.customId === 'close_ticket') {
				button.deferUpdate()

				button.channel.permissionOverwrites
					.edit(button.user.id, {
						SEND_MESSAGES: false,
						VIEW_CHANNEL: true
					})
					.catch((err) => {})

				let X_btn = new MessageButton()
					.setStyle(options.delColor || 'SECONDARY')
					.setEmoji(options.delEmoji || '❌')
					.setLabel('Delete')
					.setCustomId('delete_ticket')

				let open_btn = new MessageButton()
					.setStyle(options.openColor || 'SUCCESS')
					.setEmoji(options.openEmoji || '🔓')
					.setLabel('Reopen')
					.setCustomId('open_ticket')

				let tr_btn = new MessageButton()
					.setStyle(options.trColor || 'PRIMARY')
					.setEmoji(options.trEmoji || '📜')
					.setLabel('Transcript')
					.setCustomId('tr_ticket')

				let row = new MessageActionRow().addComponents([
					open_btn,
					X_btn,
					tr_btn
				])

				button.message.edit({
					content: `${button.user}`,
					components: [row]
				})
			}

			if (button.customId === 'open_ticket') {
				button.deferUpdate()
				button.channel.permissionOverwrites
					.edit(button.user.id, {
						SEND_MESSAGES: true,
						VIEW_CHANNEL: true
					})
					.catch((err) => {})

				let close_btn = new MessageButton()
					.setStyle(options.closeColor || 'PRIMARY')
					.setEmoji(options.closeEmoji || '🔒')
					.setLabel('Close')
					.setCustomId('close_ticket')

				let closerow = new MessageActionRow().addComponents([close_btn])

				button.message.edit({
					content: `${button.user}`,
					components: [closerow]
				})
				button.followUp({ content: 'Reopened the ticket ;)', ephemeral: true })
			}

			if (button.customId === 'delete_ticket') {
				button.deferUpdate()
				let surebtn = new MessageButton()
					.setStyle('DANGER')
					.setLabel('Sure')
					.setCustomId('s_ticket')

				let nobtn = new MessageButton()
					.setStyle('SUCCESS')
					.setLabel('Cancel')
					.setCustomId('no_ticket')

				let row1 = new MessageActionRow().addComponents([surebtn, nobtn])

				let emb = new Discord.MessageEmbed()
					.setTitle('Are you sure ?')
					.setDescription(
						`This will delete the channel and the ticket. You cant undo this action`
					)
					.setTimestamp()
					.setColor('#c90000')
					.setFooter(foot)

				button.followUp({
					embeds: [options.confirmEmb || emb],
					components: [row1]
				})
			}

			if (button.customId === 's_ticket') {
				button.reply({
					content: 'Deleting the ticket and channel.. Please wait.'
				})

				let logch = button.message.guild.channels.cache.get(options.logChannel)

				if (logch) {
					let messagecollection = await button.channel.messages.fetch({
						limit: 100
					})
					let response = []

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

						response.push(`| ${m.author.tag} | => ${m.content}`)
					})

					let attach = new Discord.MessageAttachment(
						Buffer.from(response.toString().replaceAll(',', '\n'), 'utf-8'),
						`${button.channel.topic}.txt`
					)

					let embbb = new Discord.MessageEmbed()
						.setTitle('Ticket Deleted !')
						.setDescription(
							`Ticket just got deleted by *<@${button.user.id}>* | Tag: ***${button.user.tag}***\n\nTicket Name: \`${button.channel.name}\` | Ticket ID: \`${button.channel.id}\`\n${button.channel.topic}`
						)
						.setTimestamp()
						.setColor('#cc0000')
						.setFooter(foot)

					let ek = button.channel.name

					if (options.logembed) {
						options.logembed.description = options.logembed.description
							.replaceAll('{username}', button.user.username)
							.replaceAll('{id}', button.user.id)
							.replaceAll('{tag}', button.user.tag)
							.replaceAll('{chname}', button.channel.name)
							.replaceAll('{chtopic}', button.channel.topic)
							.replaceAll('{chid}', button.channel.id)
					}

					setTimeout(async () => {
						logch
							.send({
								embeds: [options.logembed || embbb],
								components: []
							})
							.then((c) => {
								c.channel.send({
									content: `***Transcript:*** \`#${ek}\``,
									files: [attach]
								})
							})
					}, 3000)
				}

				setTimeout(() => {
					let delch = button.message.guild.channels.cache.get(
						button.message.channel.id
					)
					delch.delete().catch((err) => {
						button.message.channel.send({
							content: 'An Error Occured. ' + err,
							ephemeral: true
						})
					})
				}, 2000)
			}

			if (button.customId === 'no_ticket') {
				button.deferUpdate()

				button.followUp({
					content: 'Ticket Deletion got canceled',
					ephemeral: true
				})

				button.message.delete()
			}
			let db = options.db
			if (button.customId === 'reroll-giveaway') {
				button.deferUpdate()
				if (!button.member.permissions.has('ADMINISTRATOR')) {
					button.followUp({
						content: 'Only Admins can Reroll the giveaway..',
						ephemeral: true
					})
				} else {
					button.followUp({
						content: 'Rerolling the giveaway ⚙️',
						ephemeral: true
					})

					let oldembed = button.message.embeds[0]

					let wino = []

					button.guild.members.cache.forEach(async (mem) => {
						let givWin = await db.get(`giveaway_${button.message.id}_${mem.id}`)

						if (givWin === null || givWin === 'null' || !givWin) return
						else if (givWin === mem.id) {
							wino.push(givWin)
						}
					})
					const embeddd = new Discord.MessageEmbed()
						.setTitle('Processing Data...')
						.setColor(0xcc0000)
						.setDescription(
							`Please wait.. We are Processing the winner with magiks`
						)
						.setFooter('Giveaway Ending.. Wait a moment.')

					setTimeout(() => {
						button.message.edit({ embeds: [embeddd], components: [] })
					}, 1000)

					let winner = []
					let winboiz = []

					let winnerNumber = await db.get(
						`giveaway_winnerCount_${button.message.id}`
					)

					let entero = await db.get(`giveaway_entered_${button.message.id}`)
					if (!entero) {
						button.followUp({
							content: 'An Error Occured. Please try again.',
							ephemeral: true
						})
					}

					for (let i = 0; winnerNumber > i; i++) {
						let winnumber = Math.floor(Math.random() * wino.length)
						if (wino[winnumber] === undefined || wino[winnumber] === 'null') {
							winner.push(`\u200b`)
							winboiz.push('\u200b')
							wino.splice(winnumber, 1)
						} else {
							winner.push(
								`\n***<@${wino[winnumber]}>*** **(ID: ${wino[winnumber]})**`.replace(
									',',
									''
								)
							)

							winboiz.push(`<@${wino[winnumber]}>`)

							wino.splice(winnumber, 1)
							await db.set(
								`giveaway_${button.message.id}_${wino[winnumber]}`,
								'null'
							)
						}
					}

					setTimeout(async () => {
						if (winner.length === 0 || winner === [] || winner[0] === '') {
							const embedod = new Discord.MessageEmbed()
								.setTitle('No one remaining')
								.setColor(0xcc0000)
								.setDescription(
									`**We rerolled and no one is remaining.**\n\n` +
										oldembed.description
											.replace(
												`React with the buttons to interact with giveaway.`,
												' '
											)
											.replace('Ends', 'Ended')
								)
								.addFields(
									{ name: '🏆 Winner(s):', value: `none` },
									{ name: '💝 People Entered', value: `***${entero}***` }
								)
								.setFooter('Giveaway Ended.')

							let msgwonid = await db.get(
								`giveaway_${button.message.id}_yaywon`
							)
							let msgwon = await button.message.channel.messages.fetch(msgwonid)
							msgwon.delete()
							button.message.edit({ embeds: [embedod], components: [] })
						} else {
							const enterr = new Discord.MessageButton()
								.setLabel('Enter')
								.setStyle('SUCCESS')
								.setDisabled(true)
								.setCustomId('enter-giveaway')

							const rerolll = new Discord.MessageButton()
								.setLabel('Reroll')
								.setStyle('PRIMARY')
								.setCustomId('reroll-giveaway')

							const endd = new Discord.MessageButton()
								.setLabel('End')
								.setDisabled(true)
								.setStyle('DANGER')
								.setCustomId('end-giveaway')

							const roww = new Discord.MessageActionRow().addComponents([
								enterr,
								rerolll,
								endd
							])

							let entero = await db.get(`giveaway_entered_${button.message.id}`)
							if (!entero) {
								button.message.send({
									content: 'An Error Occured. Please try again.',
									ephemeral: true
								})
							}

							const embedd = new Discord.MessageEmbed()
								.setTitle('Giveaway Ended')
								.setColor(0x3bb143)
								.setDescription(
									oldembed.description
										.replace(
											`React with the buttons to interact with giveaway.`,
											' '
										)
										.replace('Ends', 'Ended')
								)
								.addFields(
									{ name: '🏆 Winner(s):', value: `${winner}` },
									{ name: '💝 People Entered', value: `***${entero}***` }
								)
								.setFooter('Giveaway Ended.')

							let winmsgreroll = await db.get(
								`giveaway_${button.message.id}_yaywon`
							)
							let winreroll = await button.channel.messages.fetch(winmsgreroll)
							const gothere = new Discord.MessageButton()
								.setLabel('View Giveaway')
								.setStyle('LINK')
								.setURL(button.message.url)

							const ro = new Discord.MessageActionRow().addComponents([gothere])

							const embb = new Discord.MessageEmbed()
								.setColor(0x3bb143)
								.setTitle('You just won the giveaway.')
								.setDescription(`🏆 Winner(s): ***${winnerNumber}***`)
								.setFooter('Dm the host to claim your prize 0_0')
							if (!winreroll) {
								button.channel
									.send({
										content: `Congrats ${winboiz}. You just won the giveaway.`,
										embeds: [embb],
										components: [ro]
									})
									.then(async (m) => {
										await db.set(`giveaway_${button.message.id}_yaywon`, m.id)
									})
							}
							winreroll
								.edit({
									content: `Congrats ${winboiz}. You just won the giveaway.`,
									embeds: [embb],
									components: [ro]
								})
								.then(async (m) => {
									await db.set(`giveaway_${button.message.id}_yaywon`, m.id)
								})

							button.message.edit({ embeds: [embedd], components: [roww] })
						}
					}, 5000)
				}
			}

			if (button.customId === 'end-giveaway') {
				button.deferUpdate()
				if (!button.member.permissions.has('ADMINISTRATOR')) {
					button.followUp({
						content: 'Only Admins can End the giveaway..',
						ephemeral: true
					})
				} else {
					button.followUp({
						content: 'Ending the giveaway ⚙️',
						ephemeral: true
					})

					let wino = []
					let oldembed = button.message.embeds[0]

					button.guild.members.cache.forEach(async (mem) => {
						let givWin = await db.get(`giveaway_${button.message.id}_${mem.id}`)

						if (givWin === null || givWin === 'null' || !givWin) return
						else if (givWin === mem.id) {
							wino.push(givWin)
						}
					})
					const embeddd = new Discord.MessageEmbed()
						.setTitle('Processing Data...')
						.setColor(0xcc0000)
						.setDescription(
							`Please wait.. We are Processing the winner with magiks`
						)
						.setFooter('Giveaway Ending.. Wait a moment.')

					setTimeout(() => {
						button.message.edit({ embeds: [embeddd], components: [] })
					}, 1000)

					setTimeout(async () => {
						let winner = []
						let winboiz = []

						if (wino.length === 0 || wino === []) {
							let ol = oldembed.fields[1].value.replace('**', '')
							let winnnerNumber = ol.replace('**', '')

							const embedod = new Discord.MessageEmbed()
								.setTitle('No one entered')
								.setColor(0xcc0000)
								.setDescription(
									`**No one entered the giveaway ;(.**\n\n` +
										oldembed.description
											.replace(
												`React with the buttons to interact with giveaway.`,
												' '
											)
											.replace('Ends', 'Ended')
								)
								.addFields(
									{ name: '🏆 Winner(s):', value: `none` },
									{ name: '💝 People Entered', value: `***${winnnerNumber}***` }
								)
								.setFooter('Giveaway Ended.')

							button.message.edit({ embeds: [embedod], components: [] })
						} else {
							const enterr = new Discord.MessageButton()
								.setLabel('Enter')
								.setStyle('SUCCESS')
								.setDisabled(true)
								.setCustomId('enter-giveaway')

							const rerolll = new Discord.MessageButton()
								.setLabel('Reroll')
								.setStyle('PRIMARY')
								.setCustomId('reroll-giveaway')

							const endd = new Discord.MessageButton()
								.setLabel('End')
								.setDisabled(true)
								.setStyle('DANGER')
								.setCustomId('end-giveaway')

							const roww = new Discord.MessageActionRow().addComponents([
								enterr,
								rerolll,
								endd
							])

							let wi = oldembed.fields[0].value.replace('**', '')
							let winnerNumber = wi.replace('**', '')
							await db.set(
								`giveaway_winnerCount_${button.message.id}`,
								winnerNumber
							)

							for (let i = 0; winnerNumber > i; i++) {
								let winnumber = Math.floor(Math.random() * wino.length)
								if (wino[winnumber] === undefined) {
									winner.push(`\u200b`)
									winboiz.push('\u200b')
									wino.splice(winnumber, 1)
								} else {
									winner.push(
										`\n***<@${wino[winnumber]}>*** **(ID: ${wino[winnumber]})**`.replace(
											',',
											''
										)
									)

									winboiz.push(`<@${wino[winnumber]}>`)
									wino.splice(winnumber, 1)
									await db.set(
										`giveaway_${button.message.id}_${wino[winnumber]}`,
										'null'
									)
								}
							}

							let entero = await db.get(`giveaway_entered_${button.message.id}`)

							const embedd = new Discord.MessageEmbed()
								.setTitle('Giveaway Ended')
								.setColor(0x3bb143)
								.setDescription(
									oldembed.description
										.replace(
											`React with the buttons to interact with giveaway.`,
											' '
										)
										.replace('Ends', 'Ended')
								)
								.addFields(
									{ name: '🏆 Winner(s):', value: `${winner}` },
									{ name: '💝 People Entered', value: `***${entero}***` }
								)
								.setFooter('Giveaway Ended.')

							const embb = new Discord.MessageEmbed()
								.setColor(0x3bb143)
								.setTitle('You just won the giveaway.')
								.setDescription(`🏆 Winner(s): ***${winnerNumber}***`)
								.setFooter('Dm the host to claim your prize 0_0')

							const gothere = new Discord.MessageButton()
								.setLabel('View Giveaway')
								.setStyle('LINK')
								.setURL(button.message.url)

							const ro = new Discord.MessageActionRow().addComponents([gothere])

							button.channel
								.send({
									content: `Congrats ${winboiz}. You just won the giveaway.`,
									embeds: [embb],
									components: [ro]
								})
								.then(async (m) => {
									await db.set(`giveaway_${button.message.id}_yaywon`, m.id)
								})

							button.message.edit({ embeds: [embedd], components: [roww] })
						}
					}, 5000)
				}
			}
		} catch (err) {
			console.log(`Error Occured. | clickBtn | Error: ${err.stack}`)
		}
	}
}

module.exports = clickBtn
