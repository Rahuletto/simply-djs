const Discord = require('discord.js')

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {import('../index').modmailOptions} options
 */

/**
 --- options ---
 
  credit => Boolean
  dmToggle => Boolean
  blacklistUser => Array (User ID)
  blacklistGuild => Array (Guild ID)
  categoryID => String

  mailname => String
  
  delColor => (ButtonColor) String
  delEmoji => (Emoji ID) String

  trColor => (ButtonColor) String
  trEmoji => (Emoji ID) String

  embedColor => HexColor
  content => String

  role => Array (Role ID)
  pingRole => Array (Role ID)
 */

async function modmail(client, message, options = []) {
	let { MessageButton, MessageActionRow } = require('discord.js')
	try {
		if (options.credit === false) {
			foot = 'Modmail'
		} else {
			foot = '©️ Simply Develop. npm i simply-djs'
		}

		if (message.channel.type === 'DM') {
			if (!options.dmToggle || options.dmToggle === true) {
				let guildcol = []

				if (options.blacklistUser) {
					for (let i = 0; i < options.blacklistUser.length; i++) {
						if (options.blacklistUser[i] === message.author.id)
							return message.reply(
								'You are blacklisted from creating mod-mails'
							)
					}
				}

				await client.guilds.cache.forEach(async (gu) => {
					try {
						let isit = await gu.members.fetch(message.author.id)
						if (isit) {
							if (isit.user.id === message.author.id) {
								let yikes = {
									label: gu.name,
									value: gu.id,
									description: 'Guild you are in.'
								}

								guildcol.push(yikes)
							}
						} else return
					} catch {}
				})
				const { MessageActionRow, MessageSelectMenu } = require('discord.js')
				let slct = new MessageSelectMenu()
					.setMaxValues(1)
					.setCustomId('guildselect')
					.setPlaceholder('What Guild ?')
					.addOptions([guildcol])

				const row = new MessageActionRow().addComponents([slct])

				let embed = new Discord.MessageEmbed()
					.setTitle('What Guild ?')
					.setDescription(
						`As this command is used in dms.. We dont know what guild you are trying to open the modmail. Please select the guild in the select menu`
					)
					.setFooter(foot)
					.setColor('#075FFF')

				message.channel
					.send({ embeds: [embed], components: [row] })
					.then(async (slct) => {
						let dmTr = slct.createMessageComponentCollector({
							type: 'SELECT_MENU',
							time: 600000
						})

						dmTr.on('collect', async (menu) => {
							let val = menu.values[0]

							menu.deferUpdate()

							let mailname = `modmail_${message.author.id}`

							if (options.mailname) {
								mailname = options.mailname
									.replace('{username}', message.author.username)
									.replace('{id}', message.author.id)
									.replace('{tag}', message.author.tag)
							}

							let topic = `Modmail opened by <@${message.author.id}>`

							if (options.blacklistGuild) {
								for (let i = 0; i < options.blacklistGuild.length; i++) {
									if (options.blacklistGuild[i] === val)
										return message.reply(
											'Modmail in that server is currently disabled...'
										)
								}
							}

							let guild = client.guilds.cache.get(val)
							if (!guild)
								return message.reply(
									"Uhh i think something's wrong.. I cannot fetch the guild"
								)
							let antispamo = await guild.channels.cache.find(
								(ch) => ch.topic === topic
							)

							if (antispamo)
								return message.reply({
									content:
										'You already have opened a modmail.. Please close it to continue.'
								})
							let categg = []

							if (options.categoryID) {
								for (let i = 0; i < options.categoryID.length; i++) {
									let categ = guild.channels.cache.get(options.categoryID[i])
									if (categ) {
										categg.push(categ)
									}
								}
							}

							guild.channels
								.create(mailname, {
									type: 'text',
									topic: topic,
									parent: categg[0] || null,
									permissionOverwrites: [
										{
											id: guild.roles.everyone,
											deny: [
												'VIEW_CHANNEL',
												'SEND_MESSAGES',
												'READ_MESSAGE_HISTORY'
											] //Deny permissions
										}
									]
								})
								.then((ch) => {
									let lep = []

									if (options.role && Array.isArray(options.role)) {
										options.role.forEach((e) => {
											let rw = guild.roles.cache.find((r) => r.id === e)

											if (rw) {
												lep.push(e)
											}
										})
									} else if (options.role && !Array.isArray(options.role)) {
										let rew = guild.roles.cache.find(
											(r) => r.id === options.role
										)

										if (rew) {
											lep.push(options.role)
										}
									}

									if (options.pingRole && Array.isArray(options.pingRole)) {
										options.pingRole.forEach((e) => {
											let rw = guild.roles.cache.find((r) => r.id === e)

											if (rw) {
												lep.push(e)
											}
										})
									} else if (
										options.pingRole &&
										!Array.isArray(options.pingRole)
									) {
										let rww = guild.roles.cache.find(
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
												console.log(`Error | modmail | ${er.stack}`)
												ch.send({
													content: `Error: \n\`\`\`\n${er.stack}\n\`\`\``
												})
											})

										let X_btn = new MessageButton()
											.setStyle(options.delColor || 'DANGER')
											.setEmoji(options.delEmoji || '❌')
											.setLabel('Delete')
											.setCustomId('delete_mail')

										let X_btnn = new MessageButton()
											.setStyle(options.delColor || 'DANGER')
											.setEmoji(options.delEmoji || '❌')
											.setLabel('Delete')
											.setCustomId('delete_dm_mail')

										let tr_btn = new MessageButton()
											.setStyle(options.trColor || 'PRIMARY')
											.setEmoji(options.trEmoji || '📜')
											.setLabel('Transcript')
											.setCustomId('tr_mail')

										let closerow = new MessageActionRow().addComponents([
											X_btn,
											tr_btn
										])

										let wee = new MessageActionRow().addComponents([X_btnn])

										let embedi = new Discord.MessageEmbed()
											.setTitle('Hello 👋')
											.setDescription(
												`***You have opened a modmail.***\nPlease wait for the *support team* to contact with you.\n***I will react to your message if it is delivered***`
											)
											.setFooter(foot)
											.setColor('#075FFF')

										message.author
											.send({ embeds: [embedi], components: [wee] })
											.then(async (mo) => {
												let cltor = mo.createMessageComponentCollector({
													time: 600000
												})

												cltor.on('collect', async (button) => {
													if (button.customId === 'delete_dm_mail') {
														let surebtn = new MessageButton()
															.setStyle('DANGER')
															.setLabel('Sure')
															.setCustomId('ss_mail')

														let nobtn = new MessageButton()
															.setStyle('SUCCESS')
															.setLabel('Cancel')
															.setCustomId('noo_mail')

														let row1 = new MessageActionRow().addComponents([
															surebtn,
															nobtn
														])

														let emb = new Discord.MessageEmbed()
															.setTitle('Are you sure ?')
															.setDescription(
																`This will delete the modmail. You cant undo this action`
															)
															.setTimestamp()
															.setColor('#c90000')
															.setFooter(foot)

														button
															.reply({
																embeds: [emb],
																components: [row1],
																fetchReply: true
															})
															.then((me) => {
																let cltor = me.createMessageComponentCollector({
																	time: 600000
																})

																cltor.on('collect', async (button) => {
																	if (button.customId === 'ss_mail') {
																		button.reply({
																			content:
																				'Deleting the modmail.. Please wait.'
																		})

																		let embaaa = new Discord.MessageEmbed()
																			.setTitle('Modmail deleted')
																			.setDescription(
																				`The modmail has been deleted by a mod in the server ;( `
																			)
																			.setTimestamp()
																			.setColor('#c90000')
																			.setFooter(foot)

																		setTimeout(() => {
																			message.author.send({ embeds: [embaaa] })
																			ch.delete().catch((err) => {
																				button.message.channel.send({
																					content: 'An Error Occured. ' + err
																				})
																			})
																		}, 2000)
																	}

																	if (button.customId === 'noo_mail') {
																		button.message.delete()
																		button.reply({
																			content: 'Mod mail Deletion got canceled',
																			ephemeral: true
																		})
																	}
																})
															})
													}
												})

												let filter = (m) => m.author.id === message.author.id

												const collector = mo.channel.createMessageCollector({
													filter,
													time: 600000
												})

												collector.on('collect', async (msg) => {
													let tosupport = msg.content || `‎`

													let ch = await guild.channels.cache.find(
														(ch) => ch.topic === topic
													)

													if (!ch) return collector.stop()

													let webhook = await ch.fetchWebhooks()
													webhook = webhook.find(
														(x) => x.name === message.author.tag
													)

													if (!webhook) {
														webhook = await ch.createWebhook(
															message.author.tag,
															{
																avatar: message.author.displayAvatarURL({
																	dynamic: true
																})
															}
														)
													}

													if (msg.attachments) {
														webhook
															.send({
																content: tosupport,
																files: msg.attachments
															})
															.catch((err) => {
																console.log(err)
																msg.react('❌')
																mo.channel.send({
																	content: 'An Error Occured. ' + err
																})
															})
													} else {
														webhook
															.send({ content: tosupport })
															.catch((err) => {
																console.log(err)
																msg.react('❌')
																mo.channel.send({
																	content: 'An Error Occured. ' + err
																})
															})
													}
													msg.react('✅')
												})
											})
										let emb = new Discord.MessageEmbed()
											.setAuthor(
												message.author.tag,
												message.author.displayAvatarURL()
											)
											.setDescription(
												`Mod mail has been opened by the user ${message.author} \`ID: ${message.author.id}\``
											)
											.setThumbnail(guild.iconURL())
											.setTimestamp()
											.setColor(options.embedColor || '#075FFF')
											.setFooter(foot)

										let pingrole = []
										if (options.pingRole) {
											if (options.pingRole && Array.isArray(options.pingRole)) {
												options.pingRole.forEach((e) => {
													let rollw = button.guild.roles.cache.find(
														(r) => r.id === e
													)

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
											content:
												options.content ||
												`${pingrole}` ||
												'***Support Team***',
											embeds: [emb],
											components: [closerow]
										}).then((m) => {
											let cltor = m.createMessageComponentCollector({
												time: 600000
											})

											cltor.on('collect', async (button) => {
												if (button.customId === 'tr_mail') {
													button.deferUpdate()
													let messagecollection =
														await button.channel.messages.fetch({
															limit: 100
														})
													let response = []

													messagecollection = messagecollection.sort(
														(a, b) => a.createdTimestamp - b.createdTimestamp
													)

													messagecollection.forEach((m) => {
														let u = ''

														if (m.author.bot) {
															if (m.content === '') return
															const attachment = m.attachments.first()
															const url = attachment ? attachment.url : null
															if (url !== null) {
																u = '| Image:' + url
															}

															response.push(
																`| ${m.author.username} | => ${m.content} ${u}`
															)
														} else {
															const attachment = m.attachments.first()
															const url = attachment ? attachment.url : null
															if (url !== null) {
																u = '| Image:' + url
															}

															response.push(
																`| ${m.author.tag} | => ${m.content} ${u}`
															)
														}
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
														Buffer.from(
															response.toString().replaceAll(',', '\n'),
															'utf-8'
														),
														`${button.channel.topic}.txt`
													)

													setTimeout(async () => {
														await kek.edit({ files: [attach], embeds: [] })
													}, 3000)
												}
												if (button.customId === 'delete_mail') {
													let surebtn = new MessageButton()
														.setStyle('DANGER')
														.setLabel('Sure')
														.setCustomId('ss_mail')

													let nobtn = new MessageButton()
														.setStyle('SUCCESS')
														.setLabel('Cancel')
														.setCustomId('noo_mail')

													let row1 = new MessageActionRow().addComponents([
														surebtn,
														nobtn
													])

													let emb = new Discord.MessageEmbed()
														.setTitle('Are you sure ?')
														.setDescription(
															`This will delete the modmail. You cant undo this action`
														)
														.setTimestamp()
														.setColor('#c90000')
														.setFooter(foot)

													button
														.reply({
															embeds: [emb],
															components: [row1],
															fetchReply: true
														})
														.then((me) => {
															let cltor = me.createMessageComponentCollector({
																time: 600000
															})

															cltor.on('collect', async (button) => {
																if (button.customId === 'ss_mail') {
																	button.reply({
																		content:
																			'Deleting the modmail.. Please wait.'
																	})

																	let embaaa = new Discord.MessageEmbed()
																		.setTitle('Modmail deleted')
																		.setDescription(
																			`The modmail has been deleted by a mod in the server ;( `
																		)
																		.setTimestamp()
																		.setColor('#c90000')
																		.setFooter(foot)

																	setTimeout(() => {
																		message.author.send({ embeds: [embaaa] })
																		let delch = button.channel
																		delch.delete().catch((err) => {
																			button.message.channel.send({
																				content: 'An Error Occured. ' + err
																			})
																		})
																	}, 2000)
																}

																if (button.customId === 'noo_mail') {
																	button.message.delete()
																	button.reply({
																		content: 'Mod mail Deletion got canceled',
																		ephemeral: true
																	})
																}
															})
														})
												}
											})

											cltor.on('end', async (collected) => {
												if (collected.size === 0) {
													let ch = guild.channels.cache.find(
														(ch) => ch.name === mailname.toLowerCase()
													)
													ch.delete().catch((err) => {
														ch.send({ content: 'An Error Occured. ' + err })
													})
												}
											})
										})

										let cho = guild.channels.cache.find(
											(ch) => ch.name === mailname.toLowerCase()
										)

										let fl = (m) => m.author.id !== client.user.id
										const ctr = cho.createMessageCollector({ fl, time: 600000 })

										ctr.on('collect', async (msg) => {
											if (msg.author.bot) return

											let tosupport = new Discord.MessageEmbed()
												.setAuthor(
													msg.author.tag,
													msg.author.displayAvatarURL()
												)
												.setDescription(msg.content)
												.setFooter(foot)
												.setImage(
													msg.attachments.first()
														? msg.attachments.first().url
														: ''
												)
												.setColor('#00a105')

											message.author
												.send({ embeds: [tosupport] })
												.catch((err) => {
													console.log(err)
													msg.react('❌')
													msg.channel.send({
														content: 'An Error Occured. ' + err
													})
												})
											msg.react('✅')
										})
									})
								})
						})
					})
			} else return message.reply("Sorry you cannot use the command in DM's")
		} else {
			let embed = new Discord.MessageEmbed()
				.setTitle('Hello 👋')
				.setDescription(
					`***You have opened a modmail.***\nPlease wait for the *support team* to contact with you.\n***I will react to your message if it is delivered***`
				)
				.setFooter(foot)
				.setColor('#075FFF')

			let nopeembed = new Discord.MessageEmbed()
				.setTitle(`Your DM's are closed.`)
				.setDescription(
					`Sorry but your ***dms are closed.*** You should **open your dms** to contact with the support team.`
				)
				.setFooter(foot)
				.setColor('#cc0000')

			if (options.blacklistUser) {
				for (let i = 0; i < options.blacklistUser.length; i++) {
					if (options.blacklistUser[i] === message.author.id)
						return message.reply('You are blacklisted from creating mod-mails')
				}
			}

			if (options.blacklistGuild) {
				for (let i = 0; i < options.blacklistGuild.length; i++) {
					if (options.blacklistGuild[i] === message.guild.id)
						return message.reply(
							'Modmail in this server is currently disabled...'
						)
				}
			}

			let permz = {
				id: options.role || message.guild.ownerId,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
			}

			chparent = options.categoryID || null
			let categ = message.guild.channels.cache.get(options.categoryID)
			if (!categ) {
				chparent = null
			}

			let mailname = `modmail_${message.author.id}`
			let antispamo = await message.guild.channels.cache.find(
				(ch) => ch.name === mailname.toLowerCase()
			)

			if (antispamo)
				return message.reply({
					content:
						'You already have opened a modmail.. Please close it to continue.'
				})
			message.delete()

			message.guild.channels
				.create(`modmail_${message.author.id}`, {
					type: 'text',
					parent: chparent,
					permissionOverwrites: [
						{
							id: message.guild.roles.everyone,
							deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
						},
						permz
					]
				})
				.then(async (ch) => {
					let X_btn = new MessageButton()
						.setStyle(options.delColor || 'DANGER')
						.setEmoji(options.delEmoji || '❌')
						.setLabel('Delete')
						.setCustomId('delete_mail')

					let closerow = new MessageActionRow().addComponents([X_btn])

					message.author
						.send({ embeds: [embed] })
						.then(async (mo) => {
							let filter = (m) => m.author.id === message.author.id

							const collector = mo.channel.createMessageCollector({
								filter,
								time: 600000
							})

							collector.on('collect', async (msg) => {
								let tosupport = new Discord.MessageEmbed()
									.setAuthor(
										message.author.tag,
										message.author.displayAvatarURL()
									)
									.setDescription(msg.content)
									.setFooter(foot)
									.setImage(
										msg.attachments.first() ? msg.attachments.first().url : ''
									)
									.setColor('#c90000')

								let ch = message.guild.channels.cache.find(
									(ch) => ch.name === mailname.toLowerCase()
								)

								if (!ch) return collector.stop()
								ch.send({ embeds: [tosupport] }).catch((err) => {
									console.log(err)
									msg.react('❌')
									mo.channel.send({ content: 'An Error Occured. ' + err })
								})
								msg.react('✅')
							})
						})
						.catch((err) => {
							message.channel.send({ embeds: [nopeembed] })
						})
					let emb = new Discord.MessageEmbed()
						.setAuthor(message.author.tag, message.author.displayAvatarURL())
						.setDescription(
							`Mod mail has been opened by the user ${message.author} \`ID: ${message.author.id}\``
						)
						.setThumbnail(message.guild.iconURL())
						.setTimestamp()
						.setColor(options.embedColor || '#075FFF')
						.setFooter(foot)

					let supportRole =
						message.guild.roles.cache.get(options.role) || '***Support Team***'

					ch.send({
						content:
							options.content || supportRole.toString() || '***Support Team***',
						embeds: [emb],
						components: [closerow]
					}).then((m) => {
						let cltor = m.createMessageComponentCollector({ time: 600000 })

						cltor.on('collect', async (button) => {
							if (button.customId === 'delete_mail') {
								let surebtn = new MessageButton()
									.setStyle('DANGER')
									.setLabel('Sure')
									.setCustomId('ss_mail')

								let nobtn = new MessageButton()
									.setStyle('SUCCESS')
									.setLabel('Cancel')
									.setCustomId('noo_mail')

								let row1 = new MessageActionRow().addComponents([
									surebtn,
									nobtn
								])

								let emb = new Discord.MessageEmbed()
									.setTitle('Are you sure ?')
									.setDescription(
										`This will delete the modmail. You cant undo this action`
									)
									.setTimestamp()
									.setColor('#c90000')
									.setFooter(foot)

								button
									.reply({
										embeds: [emb],
										components: [row1],
										fetchReply: true
									})
									.then((me) => {
										let cltor = me.createMessageComponentCollector({
											time: 600000
										})

										cltor.on('collect', async (button) => {
											if (button.customId === 'ss_mail') {
												button.reply({
													content: 'Deleting the modmail.. Please wait.'
												})

												let embaaa = new Discord.MessageEmbed()
													.setTitle('Modmail deleted')
													.setDescription(
														`The modmail has been deleted by a mod in the server ;( `
													)
													.setTimestamp()
													.setColor('#c90000')
													.setFooter(foot)

												setTimeout(() => {
													message.author.send({ embeds: [embaaa] })
													let delch = button.channel
													delch.delete().catch((err) => {
														button.message.channel.send({
															content: 'An Error Occured. ' + err
														})
													})
												}, 2000)
											}

											if (button.customId === 'noo_mail') {
												button.message.delete()
												button.reply({
													content: 'ModMail Deletion got canceled',
													ephemeral: true
												})
											}
										})
									})
							}
						})

						cltor.on('end', async (collected) => {
							if (collected.size === 0) {
								let ch = message.guild.channels.cache.find(
									(ch) => ch.name === mailname.toLowerCase()
								)
								ch.delete().catch((err) => {
									ch.send({ content: 'An Error Occured. ' + err })
								})
							}
						})
					})

					let cho = message.guild.channels.cache.find(
						(ch) => ch.name === mailname.toLowerCase()
					)

					let fl = (m) => m.author.id !== client.user.id
					const ctr = cho.createMessageCollector({ fl, time: 600000 })

					ctr.on('collect', async (msg) => {
						if (msg.author.bot) return

						let tosupport = new Discord.MessageEmbed()
							.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
							.setDescription(msg.content)
							.setFooter(foot)
							.setImage(
								msg.attachments.first() ? msg.attachments.first().url : ''
							)
							.setColor('#00a105')

						message.author.send({ embeds: [tosupport] }).catch((err) => {
							console.log(err)
							msg.react('❌')
							msg.channel.send({ content: 'An Error Occured. ' + err })
						})
						msg.react('✅')
					})
				})
		}
	} catch (err) {
		console.log(`Error Occured. | modmail | Error: ${err.stack}`)
	}
}

module.exports = modmail
