const Discord = require('discord.js')
const mongoose = require('mongoose')

const { join } = require('path')
const db = require(join(__dirname, 'model', 'suggestion.js'))

/**
 *
 * @param {Discord.ButtonInteraction} button
 * @param {import('../index').suggestBtnOptions} options
 */

/**
 --- options ---

  embed: {
	  denyemb: { color: Hex }
	  acceptemb: { color: Hex }
  }

 */

async function suggestBtn(button, options = []) {
	let { MessageButton, MessageActionRow } = require('discord.js')
	if (button.isButton()) {
		try {
			if (!options.embed) {
				options.embed = {
					denyemb: { color: options.denyEmbColor || 'RED' },
					acceptemb: { color: options.agreeEmbColor || 'GREEN' }
				}
			}
			// no-sug and agree-sug

			let data = await db.findOne({
				message: button.message.id
			})
			if (!data) {
				data = new db({
					message: button.message.id
				})
				await data.save().catch(() => { })
			}

			if (button.customId === 'no-sug') {
				let oldemb = button.message.embeds[0]

				if (button.member.permissions.has('ADMINISTRATOR')) {
					let surebtn = new MessageButton()
						.setStyle('DANGER')
						.setLabel('Dislike Suggestion')
						.setCustomId('no-vote')

					let nobtn = new MessageButton()
						.setStyle('PRIMARY')
						.setLabel('Deny Suggestion')
						.setCustomId('deny-sug')

					let row1 = new MessageActionRow().addComponents([surebtn, nobtn])

					let msg = await button.reply({
						content: 'Do you want to Deny suggestion (or) Vote ?',
						components: [row1],
						ephemeral: true,
						fetchReply: true
					})

					let ftter = (m) => button.user.id === m.user.id
					let coll = msg.createMessageComponentCollector({
						ftter,
						time: 30000
					})
					coll.on('collect', async (btn) => {
						btn.deferUpdate({ ephemeral: true })

						if (btn.customId === 'no-vote') {
							let vt = data.votes.find((m) => m.user === btn.user.id)
							let ot = data.votes.find((m) => m.user !== btn.user.id) || []

							if (!Array.isArray(ot)) {
								ot = [ot]
							}
							console.log(vt)

							if (!vt || vt.vote === null) {
								let vot = { user: btn.user.id, vote: 'dislike' }
								ot.push(vot)
								data.votes = ot
								await data.save().catch(() => { })

								await calc(oldemb, 'dislike')

								await button.editReply({
									content:
										'You **disliked** the suggestion. | Suggestion ID: ' +
										`\`${button.message.id}\``,
									components: []
								})
							} else if (vt) {
								if (vt.vote === 'dislike') {
									data.votes = ot
									await data.save().catch(() => { })

									await calc(oldemb, 'removedis')

									await button.editReply({
										content:
											'You have **already disliked** the suggestion. Removing your **dislike**',
										components: []
									})
								} else if (vt.vote === 'like') {
									let vot = { user: btn.user.id, vote: 'dislike' }
									ot.push(vot)
									data.votes = ot
									await data.save().catch(() => { })

									await calc(oldemb, 'LtoD')

									await button.editReply({
										content:
											'You **disliked** the suggestion. | Suggestion ID: ' +
											`\`${button.message.id}\``,
										components: []
									})
								}
							}
						} else if (btn.customId === 'deny-sug') {
							if (!btn.member.permissions.has('ADMINISTRATOR')) return
							let filter = (m) => button.user.id === m.author.id

							await button.editReply({
								content:
									'Tell me a reason to deny the suggestion. Say `cancel` to cancel. | Time: 2 minutes',
								components: []
							})

							let msgCl = btn.channel.createMessageCollector({
								filter,
								time: 120000
							})

							msgCl.on('collect', (m) => {
								if (m.content.toLowerCase() === 'cancel') {
									m.delete()
									button.editReply('Cancelled your denial')
									msgCl.stop()
								} else {
									m.delete()
									dec(m.content, oldemb, button.user)
									msgCl.stop()
								}
							})

							msgCl.on('end', (collected) => {
								if (collected.size === 0) {
									dec('No Reason', oldemb, button.user)
								}
							})
						}
					})
				} else if (!button.member.permissions.has('ADMINISTRATOR')) {
					let vt = data.votes.find((m) => m.user === button.user.id)
					let ot = data.votes.find((m) => m.user !== button.user.id) || []

					if (!Array.isArray(ot)) {
						ot = [ot]
					}
					if (!vt || vt.vote === null) {
						let vot = { user: button.user.id, vote: 'dislike' }
						ot.push(vot)
						data.votes = ot
						await data.save().catch(() => { })

						await calc(oldemb, 'dislike')
						await button.reply({
							content:
								'You **disliked** the suggestion. | Suggestion ID: ' +
								`\`${button.message.id}\``,
							components: [],
							ephemeral: true
						})
					} else if (vt) {
						if (vt.vote === 'dislike') {
							data.votes = ot
							await data.save().catch(() => { })
							await calc(oldemb, 'removedis')

							await button.reply({
								content:
									'You have **already disliked** the suggestion. Removing your **dislike**',
								components: [],
								ephemeral: true
							})
						} else if (vt.vote === 'like') {
							let vot = { user: button.user.id, vote: 'dislike' }
							ot.push(vot)
							data.votes = ot
							await data.save().catch(() => { })

							await calc(oldemb, 'LtoD')

							await button.reply({
								content:
									'You **disliked** the suggestion. | Suggestion ID: ' +
									`\`${button.message.id}\``,
								components: [],
								ephemeral: true
							})
						}
					}
				}
			}

			if (button.customId === 'agree-sug') {
				let oldemb = button.message.embeds[0]

				if (button.member.permissions.has('ADMINISTRATOR')) {
					let surebtn = new MessageButton()
						.setStyle('SUCCESS')
						.setLabel('Like Suggestion')
						.setCustomId('yes-vote')

					let nobtn = new MessageButton()
						.setStyle('PRIMARY')
						.setLabel('Accept Suggestion')
						.setCustomId('accept-sug')

					let row1 = new MessageActionRow().addComponents([surebtn, nobtn])

					let msg = await button.reply({
						content: 'Do you want to Accept suggestion (or) Vote ?',
						components: [row1],
						ephemeral: true,
						fetchReply: true
					})

					let ftter = (m) => button.user.id === m.user.id
					let coll = msg.createMessageComponentCollector({
						ftter,
						time: 30000
					})
					coll.on('collect', async (btn) => {
						btn.deferUpdate({ ephemeral: true })

						if (btn.customId === 'yes-vote') {
							let vt = data.votes.find((m) => m.user === btn.user.id)
							let ot = data.votes.find((m) => m.user !== btn.user.id) || []
							console.log(vt)
							if (!Array.isArray(ot)) {
								ot = [ot]
							}

							if (!vt || vt.vote === null) {
								let vot = { user: btn.user.id, vote: 'like' }
								ot.push(vot)
								data.votes = ot
								await data.save().catch(() => { })

								await calc(oldemb, 'like')
								await button.editReply({
									content:
										'You **liked** the suggestion. | Suggestion ID: ' +
										`\`${button.message.id}\``,
									components: []
								})
							} else if (vt) {
								if (vt.vote === 'like') {
									data.votes = ot
									await data.save().catch(() => { })

									await calc(oldemb, 'removelike')

									await button.editReply({
										content:
											'You have **already liked** the suggestion. Removing your **like**',
										components: []
									})
								} else if (vt.vote === 'dislike') {
									let vot = { user: btn.user.id, vote: 'like' }
									ot.push(vot)
									data.votes = ot
									await data.save().catch(() => { })

									await calc(oldemb, 'DtoL')

									await button.editReply({
										content:
											'You **liked** the suggestion. | Suggestion ID: ' +
											`\`${button.message.id}\``,
										components: []
									})
								}
							}
							console.log(vt)
						} else if (btn.customId === 'accept-sug') {
							if (!btn.member.permissions.has('ADMINISTRATOR')) return
							let filter = (m) => button.user.id === m.author.id

							await button.editReply({
								content:
									'Tell me a reason to accept the suggestion. Say `cancel` to cancel. | Time: 2 minutes',
								components: []
							})

							let msgCl = btn.channel.createMessageCollector({
								filter,
								time: 120000
							})

							msgCl.on('collect', (m) => {
								if (m.content.toLowerCase() === 'cancel') {
									m.delete()
									button.editReply('Cancelled to accept')
									msgCl.stop()
								} else {
									m.delete()
									aprov(m.content, oldemb, button.user)
									msgCl.stop()
								}
							})

							msgCl.on('end', (collected) => {
								if (collected.size === 0) {
									aprov('No Reason', oldemb, button.user)
								}
							})
						}
					})
				} else if (!button.member.permissions.has('ADMINISTRATOR')) {
					let vt = data.votes.find((m) => m.user === button.user.id)
					let ot = data.votes.find((m) => m.user !== button.user.id) || []

					if (!Array.isArray(ot)) {
						ot = [ot]
					}
					if (!vt || vt.vote === null) {
						let vot = { user: button.user.id, vote: 'like' }
						ot.push(vot)
						data.votes = ot
						await data.save().catch(() => { })

						await calc(oldemb, 'like')
						await button.reply({
							content:
								'You **liked** the suggestion. | Suggestion ID: ' +
								`\`${button.message.id}\``,
							components: [],
							ephemeral: true
						})
					} else if (vt) {
						if (vt.vote === 'like') {
							data.votes = ot
							await data.save().catch(() => { })

							await calc(oldemb, 'removelike')

							await button.reply({
								content:
									'You have **already liked** the suggestion. Removing your **like**',
								components: [],
								ephemeral: true
							})
						} else if (vt.vote === 'dislike') {
							let vot = { user: button.user.id, vote: 'like' }
							ot.push(vot)
							data.votes = ot
							await data.save().catch(() => { })

							await calc(oldemb, 'DtoL')

							await button.reply({
								content:
									'You **liked** the suggestion. | Suggestion ID: ' +
									`\`${button.message.id}\``,
								components: [],
								ephemeral: true
							})
						}
					}
				}
			}

			async function calc(oldemb, type) {
				let l = []
				let d = []

				data.votes.forEach((v) => {
					if (v.vote === 'like') {
						l.push(v)
					} else if (v.vote === 'dislike') {
						d.push(v)
					}
				})
				console.log(l, d)

				let dislik = d.length
				let lik = l.length
				if (lik < 0) {
					lik = 0
				}
				if (dislik < 0) {
					dislik = 0
				}
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

				button.message.edit({ embeds: [newemb] })
			}

			async function dec(reason, oldemb, user) {
				let approve = new MessageButton()
					.setEmoji(button.message.components[0].components[0].emoji)
					.setStyle(button.message.components[0].components[0].style)
					.setCustomId('agree-sug')
					.setDisabled(true)

				let no = new MessageButton()
					.setEmoji(button.message.components[0].components[1].emoji)
					.setStyle(button.message.components[0].components[1].style)
					.setCustomId('no-sug')
					.setDisabled(true)

				let row = new MessageActionRow().addComponents([approve, no])

				let likesnd = oldemb.fields[1].value.split(/\s+/)

				let lik = likesnd[1]
				let dislik = likesnd[3]

				const newemb = new Discord.MessageEmbed()
					.setDescription(oldemb.description)
					.setColor(options.embed?.denyemb?.color || 'RED')
					.setAuthor(oldemb.author.name, oldemb.author.iconURL)
					.setImage(oldemb.image)
					.setFooter(`Rejected by ${user.tag}`)
					.addFields(
						{ name: 'Status:', value: `\`\`\`\nRejected !\n\`\`\`` },
						{ name: 'Reason:', value: `\`\`\`\n${reason}\n\`\`\`` },
						{
							name: 'Reactions',
							value: `*Likes:* ${lik} \n*Dislikes:* ${dislik}`
						}
					)

				button.message.edit({ embeds: [newemb], components: [row] })
			}

			async function aprov(reason, oldemb, user) {
				let approve = new MessageButton()
					.setEmoji(button.message.components[0].components[0].emoji)
					.setStyle(button.message.components[0].components[0].style)
					.setCustomId('agree-sug')
					.setDisabled(true)

				let no = new MessageButton()
					.setEmoji(button.message.components[0].components[1].emoji)
					.setStyle(button.message.components[0].components[1].style)
					.setCustomId('no-sug')
					.setDisabled(true)

				let row = new MessageActionRow().addComponents([approve, no])

				let likesnd = oldemb.fields[1].value.split(/\s+/)

				let lik = likesnd[1]
				let dislik = likesnd[3]

				const newemb = new Discord.MessageEmbed()
					.setDescription(oldemb.description)
					.setColor(options.embed?.acceptemb?.color || 'GREEN')
					.setAuthor(oldemb.author.name, oldemb.author.iconURL)
					.setImage(oldemb.image)
					.setFooter(`Accepted by ${user.tag}`)
					.addFields(
						{ name: 'Status:', value: `\`\`\`\nAccepted !\n\`\`\`` },
						{ name: 'Reason:', value: `\`\`\`\n${reason}\n\`\`\`` },
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
