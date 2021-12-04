const Discord = require('discord.js')

/**
 *
 * @param {Discord.ButtonInteraction} button
 * @param {import('../index').DB} users
 * @param {import('../index').suggestBtnOptions} options
 */

/**
 --- options ---
 
  yesEmoji => (Emoji ID) String
  yesColor => (ButtonColor) String
  noEmoji => (Emoji ID) String
  noColor => (ButtonColor) String

  denyEmbColor => HexColor
  agreeEmbColor => HexColor
 */

async function suggestBtn(button, users, options = []) {
	if (button.isButton()) {
		try {
			let { MessageButton, MessageActionRow } = require('discord.js')

			if (button.member.permissions.has('ADMINISTRATOR')) {
				if (button.customId === 'no-sug') {
					let target = await button.message.channel.messages.fetch(
						button.message.id
					)
					let oldemb = target.embeds[0] || button.message.embeds[0]

					let surebtn = new MessageButton()
						.setStyle('SUCCESS')
						.setLabel('Dislike Suggestion')
						.setCustomId('no-vote')

					let nobtn = new MessageButton()
						.setStyle('DANGER')
						.setLabel('Deny Suggestion')
						.setCustomId('deny-sug')

					let row1 = new MessageActionRow().addComponents([surebtn, nobtn])

					button.reply({
						content: 'Do you want to Deny suggestion (or) Vote ?',
						components: [row1],
						ephemeral: true
					})
					let msg = button.channel
					let ftter = (m) => button.user.id === m.user.id
					let coll = msg.createMessageComponentCollector({
						ftter,
						time: 30000
					})
					coll.on('collect', async (btn) => {
						if (btn.customId === 'deny-sug') {
							if (btn.member.permissions.has('ADMINISTRATOR')) {
								button.editReply({
									content:
										'Reason ?? if not, Ill give it as `No Reason` Timeout: 15 Seconds..',
									ephemeral: true,
									components: []
								})

								let filter = (m) => button.user.id === m.author.id

								const collector = button.channel.createMessageCollector({
									filter,
									time: 120000
								})

								collector.on('collect', (m) => {
									if (m.content.toLowerCase() === 'cancel') {
										m.delete()
										button.editReply('Refusal Cancelled')
										collector.stop()
									} else {
										m.delete()
										dec(m.content, oldemb, button.user)
										collector.stop()
									}
								})

								collector.on('end', (collected) => {
									if (collected.size === 0) {
										dec('No Reason', oldemb, button.user)
									}
								})
							}
						}
						if (btn.customId === 'no-vote') {
							let isit = await users.get(
								`${button.message.id}-${button.user.id}-dislike`
							)

							if (isit === button.user.id) {
								button.editReply({
									content: 'You cannot react again.',
									components: [],
									ephemeral: true
								})
							} else {
								let isit2 = await users.get(
									`${button.message.id}-${button.user.id}-like`
								)

								if (isit2 === button.user.id) {
									users.delete(`${button.message.id}-${button.user.id}-like`)

									users.set(
										`${button.message.id}-${button.user.id}-dislike`,
										button.user.id
									)

									button.editReply({
										content: 'You disliked the suggestion.',
										components: [],
										ephemeral: true
									})

									removelike(oldemb)
								} else {
									button.editReply({
										content: 'You disliked the suggestion.',
										components: [],
										ephemeral: true
									})

									users.set(
										`${button.message.id}-${button.user.id}-dislike`,
										button.user.id
									)

									dislike(oldemb)
								}
							}
						}
					})
				}
				if (button.customId === 'agree-sug') {
					let target = await button.message.channel.messages.fetch(
						button.message.id
					)
					let oldemb = target.embeds[0] || button.message.embeds[0]

					let surebtn = new MessageButton()
						.setStyle('SUCCESS')
						.setLabel('Like Suggestion')
						.setCustomId('agree-vote')

					let nobtn = new MessageButton()
						.setStyle('DANGER')
						.setLabel('Accept Suggestion')
						.setCustomId('accept-sug')

					let row1 = new MessageActionRow().addComponents([surebtn, nobtn])

					button.reply({
						content: 'Do you want to Accept suggestion (or) Vote ?',
						components: [row1],
						ephemeral: true
					})
					let msg = button.channel

					let fttter = (m) => button.user.id === m.user.id
					let coll = msg.createMessageComponentCollector({
						fttter,
						time: 30000
					})
					coll.on('collect', async (btn) => {
						if (btn.customId === 'agree-vote') {
							let isit3 = await users.get(
								`${button.message.id}-${button.user.id}-like`
							)

							if (isit3 === button.user.id) {
								button.editReply({
									content: 'You cannot react again.',
									components: [],
									ephemeral: true
								})
							} else {
								let isit4 = await users.get(
									`${button.message.id}-${button.user.id}-dislike`
								)
								if (isit4 === button.user.id) {
									users.delete(`${button.message.id}-${button.user.id}-dislike`)

									users.set(
										`${button.message.id}-${button.user.id}-like`,
										button.user.id
									)

									button.editReply({
										content: 'You liked the suggestion.',
										components: [],
										ephemeral: true
									})
									removedislike(oldemb)
								} else {
									users.set(
										`${button.message.id}-${button.user.id}-like`,
										button.user.id
									)

									button.editReply({
										content: 'You liked the suggestion.',
										components: [],
										ephemeral: true
									})

									like(oldemb)
								}
							}
						}

						if (btn.customId === 'accept-sug') {
							if (btn.member.permissions.has('ADMINISTRATOR')) {
								button.editReply({
									content:
										'Tell me the reason.. if not, Ill give it as `No Reason` Timeout: 15 Seconds..',
									ephemeral: true,
									components: []
								})

								let filter = (m) => button.user.id === m.author.id

								const collector = button.channel.createMessageCollector({
									filter,
									time: 120000
								})

								collector.on('collect', (m) => {
									if (m.content.toLowerCase() === 'cancel') {
										m.delete()
										button.editReply('Approval Cancelled')
										collector.stop()
									} else {
										m.delete()
										aprov(m.content, oldemb, button.user)
										collector.stop()
									}
								})

								collector.on('end', (collected) => {
									if (collected.size === 0) {
										aprov('No Reason', oldemb, button.user)
									}
								})
							}
						}
					})
				}
			} else if (!button.member.permissions.has('ADMINISTRATOR')) {
				if (button.customId === 'no-sug') {
					let target = await button.message.channel.messages.fetch(
						button.message.id
					)
					let oldemb = target.embeds[0] || button.message.embeds[0]

					let isit = await users.get(
						`${button.message.id}-${button.user.id}-dislike`
					)

					if (isit === button.user.id) {
						button.reply({
							content: 'You cannot react again.',
							ephemeral: true
						})
					} else {
						let isit2 = await users.get(
							`${button.message.id}-${button.user.id}-like`
						)
						if (isit2 === button.user.id) {
							users.delete(
								`${button.message.id}-${button.user.id}-like`,
								button.user.id
							)

							users.set(
								`${button.message.id}-${button.user.id}-dislike`,
								button.user.id
							)

							removelike(oldemb)
						} else {
							let isit2 = await users.get(
								`${button.message.id}-${button.user.id}-dislike`
							)

							button.deferUpdate()
							users.set(
								`${button.message.id}-${button.user.id}-dislike`,
								button.user.id
							)

							dislike(oldemb)
						}
					}
				}
				if (button.customId === 'agree-sug') {
					let target = await button.message.channel.messages.fetch(
						button.message.id
					)
					let oldemb = target.embeds[0] || button.message.embeds[0]

					let isit3 = await users.get(
						`${button.message.id}-${button.user.id}-like`
					)

					if (isit3 === button.user.id) {
						button.reply({
							content: 'You cannot react again.',
							ephemeral: true
						})
					} else {
						let isit4 = await users.get(
							`${button.message.id}-${button.user.id}-dislike`
						)

						if (isit4 === button.user.id) {
							users.delete(
								`${button.message.id}-${button.user.id}-dislike`,
								button.user.id
							)

							users.set(
								`${button.message.id}-${button.user.id}-like`,
								button.user.id
							)

							removedislike(oldemb)
						} else {
							button.deferUpdate()
							users.set(
								`${button.message.id}-${button.user.id}-like`,
								button.user.id
							)

							like(oldemb)
						}
					}
				}
			}

			async function removelike(oldemb) {
				let approve = new MessageButton()
					.setEmoji(options.yesEmoji || '☑️')
					.setStyle(options.yesColor || 'SUCCESS')
					.setCustomId('agree-sug')

				let no = new MessageButton()
					.setEmoji(options.noEmoji || '🇽')
					.setStyle(options.noColor || 'DANGER')
					.setCustomId('no-sug')

				let row = new MessageActionRow().addComponents([approve, no])

				let likesnd = oldemb.fields[1].value.split(/\s+/)

				let likes = likesnd[1].replace('`', '')
				let dislikes = likesnd[3].replace('`', '')

				let dislik = parseInt(dislikes) + 1

				let lik = parseInt(likes) - 1

				const newemb = new Discord.MessageEmbed()
					.setDescription(oldemb.description)
					.setColor(oldemb.color)
					.setAuthor(oldemb.author.name, oldemb.author.iconURL)
					.setFooter(oldemb.footer.text)
					.setImage(oldemb.image)
					.addFields(
						{ name: oldemb.fields[0].name, value: oldemb.fields[0].value },
						{
							name: 'Reactions',
							value: `*Likes:* \`${lik}\` \n*Dislikes:* \`${dislik}\``
						}
					)

				button.message.edit({ embeds: [newemb], components: [row] })
			}

			async function dislike(oldemb) {
				let approve = new MessageButton()
					.setEmoji(options.yesEmoji || '☑️')
					.setStyle(options.yesColor || 'SUCCESS')
					.setCustomId('agree-sug')

				let no = new MessageButton()
					.setEmoji(options.noEmoji || '🇽')
					.setStyle(options.noColor || 'DANGER')
					.setCustomId('no-sug')

				let row = new MessageActionRow().addComponents([approve, no])

				let likesnd = oldemb.fields[1].value.split(/\s+/)

				let lik = likesnd[1]
				let dislikes = likesnd[3].replace('`', '')

				let dislik = parseInt(dislikes) + 1

				const newemb = new Discord.MessageEmbed()
					.setDescription(oldemb.description)
					.setColor(oldemb.color)
					.setAuthor(oldemb.author.name, oldemb.author.iconURL)
					.setImage(oldemb.image)
					.setFooter(oldemb.footer.text)
					.addFields(
						{ name: oldemb.fields[0].name, value: oldemb.fields[0].value },
						{
							name: 'Reactions',
							value: `*Likes:* ${lik} \n*Dislikes:* \`${dislik}\``
						}
					)

				button.message.edit({ embeds: [newemb], components: [row] })
			}

			async function dec(reason, oldemb, user) {
				let approve = new MessageButton()
					.setEmoji(options.yesEmoji || '☑️')
					.setStyle(options.yesColor || 'SUCCESS')
					.setCustomId('agree-sug')
					.setDisabled(true)

				let no = new MessageButton()
					.setEmoji(options.noEmoji || '🇽')
					.setStyle(options.noColor || 'DANGER')
					.setCustomId('no-sug')
					.setDisabled(true)

				let row = new MessageActionRow().addComponents([approve, no])

				let likesnd = oldemb.fields[1].value.split(/\s+/)

				let lik = likesnd[1]
				let dislik = likesnd[3]

				const newemb = new Discord.MessageEmbed()
					.setDescription(oldemb.description)
					.setColor(options.denyEmbColor || 'RED')
					.setAuthor(oldemb.author.name, oldemb.author.iconURL)
					.setImage(oldemb.image)
					.setFooter(`Rejected by ${user.tag}`)
					.addFields(
						{ name: 'Status:', value: `\`\`\`Rejected !\`\`\`` },
						{ name: 'Reason:', value: `\`\`\`${reason}\`\`\`` },
						{
							name: 'Reactions',
							value: `*Likes:* ${lik} \n*Dislikes:* ${dislik}`
						}
					)

				button.message.edit({ embeds: [newemb], components: [row] })
			}

			async function removedislike(oldemb) {
				let approve = new MessageButton()
					.setEmoji(options.yesEmoji || '☑️')
					.setStyle(options.yesColor || 'SUCCESS')
					.setCustomId('agree-sug')

				let no = new MessageButton()
					.setEmoji(options.noEmoji || '🇽')
					.setStyle(options.noColor || 'DANGER')
					.setCustomId('no-sug')

				let row = new MessageActionRow().addComponents([approve, no])

				let likesnd = oldemb.fields[1].value.split(/\s+/)

				let likes = likesnd[1].replace('`', '')

				let lik = parseInt(likes) + 1

				let dislike = likesnd[3].replace('`', '')

				let dislik = parseInt(dislike) - 1

				const newemb = new Discord.MessageEmbed()
					.setDescription(oldemb.description)
					.setColor(oldemb.color)
					.setAuthor(oldemb.author.name, oldemb.author.iconURL)
					.setImage(oldemb.image)
					.setFooter(oldemb.footer.text)
					.addFields(
						{ name: oldemb.fields[0].name, value: oldemb.fields[0].value },
						{
							name: 'Reactions',
							value: `*Likes:* \`${lik}\` \n*Dislikes:* \`${dislik}\``
						}
					)

				button.message.edit({ embeds: [newemb], components: [row] })
			}

			async function like(oldemb) {
				let approve = new MessageButton()
					.setEmoji(options.yesEmoji || '☑️')
					.setStyle(options.yesColor || 'SUCCESS')
					.setCustomId('agree-sug')

				let no = new MessageButton()
					.setEmoji(options.noEmoji || '🇽')
					.setStyle(options.noColor || 'DANGER')
					.setCustomId('no-sug')

				let row = new MessageActionRow().addComponents([approve, no])

				let likesnd = oldemb.fields[1].value.split(/\s+/)

				let likes = likesnd[1].replace('`', '')
				let dislik = likesnd[3]

				let lik = parseInt(likes) + 1

				const newemb = new Discord.MessageEmbed()
					.setDescription(oldemb.description)
					.setColor(oldemb.color)
					.setAuthor(oldemb.author.name, oldemb.author.iconURL)
					.setImage(oldemb.image)
					.setFooter(oldemb.footer.text)
					.addFields(
						{ name: oldemb.fields[0].name, value: oldemb.fields[0].value },
						{
							name: 'Reactions',
							value: `*Likes:* \`${lik}\` \n*Dislikes:* ${dislik}`
						}
					)

				button.message.edit({ embeds: [newemb], components: [row] })
			}

			async function aprov(reason, oldemb, user) {
				let approve = new MessageButton()
					.setEmoji(options.yesEmoji || '☑️')
					.setStyle(options.yesColor || 'SUCCESS')
					.setCustomId('agree-sug')
					.setDisabled(true)

				let no = new MessageButton()
					.setEmoji(options.noEmoji || '🇽')
					.setStyle(options.noColor || 'DANGER')
					.setCustomId('no-sug')
					.setDisabled(true)

				let row = new MessageActionRow().addComponents([approve, no])

				let likesnd = oldemb.fields[1].value.split(/\s+/)

				let lik = likesnd[1]
				let dislik = likesnd[3]

				const newemb = new Discord.MessageEmbed()
					.setDescription(oldemb.description)
					.setColor(options.agreeEmbColor || 'GREEN')
					.setAuthor(oldemb.author.name, oldemb.author.iconURL)
					.setImage(oldemb.image)
					.setFooter(`Accepted by ${user.tag}`)
					.addFields(
						{ name: 'Status:', value: `\`\`\`Accepted !\`\`\`` },
						{ name: 'Reason:', value: `\`\`\`${reason}\`\`\`` },
						{
							name: 'Reactions',
							value: `*Likes:* ${lik} \n*Dislikes:* ${dislik}`
						}
					)

				button.message.edit({ embeds: [newemb], components: [row] })
			}
		} catch (err) {
			console.log(`Error Occured. | suggestBtn | Error: ${err.stack}`)
		}
	}
}

module.exports = suggestBtn
