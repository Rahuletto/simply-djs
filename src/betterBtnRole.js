const Discord = require('discord.js')

/**
 * @param {Discord.Client} client
 * @param {Discord.CommandInteraction} interaction
 * @param {import('../index').betterBtnRoleOptions} options
 */

/**
 --- options ---

 chSlash => String
 idSlash => String
 roleSlash => String
 labelSlash => String
 styleSlash => String
 
 type => (add/remove) String
 */

async function betterBtnRole(client, interaction, options = []) {
	let { MessageButton, MessageActionRow } = require('discord.js')

	let ch = interaction.options.getChannel(options.chSlash || 'channel')
	let msgid = interaction.options.getString(options.idSlash || 'message')
	let role = interaction.options.getRole(options.roleSlash || 'role')

	let msg = await ch.messages.fetch(msgid).catch((e) => {})

	if (!msg)
		return interaction.followUp({
			content:
				'Cannot find any messages with that message id in the channel you specified',
			ephemeral: true
		})

	if (msg.author.id !== client.user.id)
		return interaction.followUp({
			content:
				"I cannot make anyone's message as button roles. I can only make button-roles for the message i send",
			ephemeral: true
		})
	if (options.type === 'add') {
		try {
			let label =
				interaction.options.getString(options.labelSlash || 'label') ||
				role.name
			let color =
				interaction.options.getString(options.styleSlash || 'style') ||
				'SECONDARY'
			let emoji = interaction.options.getString(options.emojiSlash || 'emoji')

			if (msg.components) {
				for (let i = 0; msg.components.length > i; i++) {
					for (let o = 0; msg.components[i].components.length > o; o++) {
						if (
							msg.components[i].components[o].customId ===
							'role-' + role.id
						) {
							msg.components[i].components.splice(o, 1)
							msg.edit({
								content: msg.content || '\u200b',
								embeds: msg.embeds,
								components: msg.components
							})
							interaction.followUp({
								content:
									'Error.. the message has the button with the same role already.. Re-adding it now..',
								ephemeral: true
							})
						}
					}
				}
			}

			if (
				!msg.components ||
				msg.components.length === 0 ||
				msg.components === []
			) {
				if (!emoji || emoji === null) {
					const btn = new MessageButton()
						.setLabel(label)
						.setStyle(color)
						.setCustomId('role-' + role.id)

					let rowe = new MessageActionRow().addComponents([btn])

					msg
						.edit({
							content: msg.content || '\u200b',
							embeds: msg.embeds,
							components: [rowe]
						})
						.then((m) => {
							const link = new MessageButton()
								.setLabel('View Message')
								.setStyle('LINK')
								.setURL(m.url)

							let rowew = new MessageActionRow().addComponents([link])

							interaction.followUp({
								content: 'Done.. Editing the message with the button...',
								components: [rowew],
								ephemeral: true
							})
						})
						.catch((err) => {
							interaction.followUp({ content: `\`${err.stack}\`` })
						})
				} else if (emoji && emoji !== null) {
					const btn = new MessageButton()
						.setLabel(label)
						.setStyle(color)
						.setCustomId('role-' + role.id)
						.setEmoji(emoji)

					let rowe = new MessageActionRow().addComponents([btn])

					msg
						.edit({
							content: msg.content || '\u200b',
							embeds: msg.embeds,
							components: [rowe]
						})
						.then((m) => {
							const link = new MessageButton()
								.setLabel('View Message')
								.setStyle('LINK')
								.setURL(m.url)

							let rowew = new MessageActionRow().addComponents([link])

							interaction.followUp({
								content: 'Done.. Editing the message with the button...',
								components: [rowew],
								ephemeral: true
							})
						})
						.catch((err) => {
							interaction.followUp({ content: `\`${err.stack}\`` })
						})
				}
			} else {
				if (msg.components.length === 5)
					return interaction.followUp({
						content: 'Sorry.. I have no space to send buttons in that message..'
					})

				let rowgap = msg.components[msg.components.length - 1].components
				if (rowgap.length < 5) {
					if (!emoji || emoji === null) {
						const btn = new MessageButton()
							.setLabel(label)
							.setStyle(color)
							.setCustomId('role-' + role.id)

						rowgap.push(btn)

						msg
							.edit({
								content: msg.content || '\u200b',
								embeds: msg.embeds,
								components: msg.components
							})
							.then((m) => {
								const link = new MessageButton()
									.setLabel('View Message')
									.setStyle('LINK')
									.setURL(m.url)

								let rowew = new MessageActionRow().addComponents([link])

								interaction.followUp({
									content: 'Done.. Editing the message with the button...',
									components: [rowew],
									ephemeral: true
								})
							})
							.catch((err) => {
								interaction.followUp({ content: `\`${err.stack}\`` })
							})
					} else if (emoji && emoji !== null) {
						const btn = new MessageButton()
							.setLabel(label)
							.setStyle(color)
							.setCustomId('role-' + role.id)
							.setEmoji(emoji)

						rowgap.push(btn)

						msg
							.edit({
								content: msg.content || '\u200b',
								embeds: msg.embeds,
								components: msg.components
							})
							.then((m) => {
								const link = new MessageButton()
									.setLabel('View Message')
									.setStyle('LINK')
									.setURL(m.url)

								let rowew = new MessageActionRow().addComponents([link])

								interaction.followUp({
									content: 'Done.. Editing the message with the button...',
									components: [rowew],
									ephemeral: true
								})
							})
							.catch((err) => {
								interaction.followUp({ content: `\`${err.stack}\`` })
							})
					}
				} else if (rowgap.length === 5) {
					if (!emoji || emoji === null) {
						const btn = new MessageButton()
							.setLabel(label)
							.setStyle(color)
							.setCustomId('role-' + role.id)

						let rowe = new MessageActionRow().addComponents([btn])

						msg.components.push(rowe)

						msg
							.edit({
								content: msg.content || '\u200b',
								embeds: msg.embeds,
								components: msg.components
							})
							.then((m) => {
								const link = new MessageButton()
									.setLabel('View Message')
									.setStyle('LINK')
									.setURL(m.url)

								let rowew = new MessageActionRow().addComponents([link])

								interaction.followUp({
									content: 'Done.. Editing the message with the button...',
									components: [rowew],
									ephemeral: true
								})
							})
							.catch((err) => {
								interaction.followUp({ content: `\`${err.stack}\`` })
							})
					} else if (emoji && emoji !== null) {
						const btn = new MessageButton()
							.setLabel(label)
							.setStyle(color)
							.setCustomId('role-' + role.id)
							.setEmoji(emoji)

						let rowe = new MessageActionRow().addComponents([btn])

						msg.components.push(rowe)

						msg
							.edit({
								content: msg.content || '\u200b',
								embeds: msg.embeds,
								components: msg.components
							})
							.then((m) => {
								const link = new MessageButton()
									.setLabel('View Message')
									.setStyle('LINK')
									.setURL(m.url)

								let rowew = new MessageActionRow().addComponents([link])

								interaction.followUp({
									content: 'Done.. Editing the message with the button...',
									components: [rowew],
									ephemeral: true
								})
							})
							.catch((err) => {
								interaction.followUp({ content: `\`${err.stack}\`` })
							})
					}
				}
			}
		} catch (err) {
			console.log(`Error Occured. | betterBtnRole (type: add) | ${err.stack}`)
		}
	} else if (options.type === 'remove') {
		try {
			if (
				!msg.components ||
				msg.components.length === 0 ||
				msg.components === []
			) {
				interaction.followUp({
					content:
						'There is no button roles in that message.. Try using correct message ID that has button roles',
					ephemeral: true
				})
			} else if (msg.components) {
				for (let i = 0; msg.components.length > i; i++) {
					for (let o = 0; msg.components[i].components.length > o; o++) {
						if (
							msg.components[i].components[o].customId ===
							'role-' + role.id
						) {
							msg.components[i].components.splice(o, 1)

							if (
								!msg.components[0].components ||
								msg.components[0].components.length === 0 ||
								msg.components[0].components === []
							) {
								msg
									.edit({
										content: msg.content || '\u200b',
										embeds: msg.embeds,
										components: []
									})
									.then((m) => {
										const link = new MessageButton()
											.setLabel('View Message')
											.setStyle('LINK')
											.setURL(m.url)

										let rowew = new MessageActionRow().addComponents([link])

										interaction.followUp({
											content:
												'Done.. Editing the message without the button...',
											components: [rowew],
											ephemeral: true
										})
									})
							} else {
								msg
									.edit({
										content: msg.content || '\u200b',
										embeds: msg.embeds,
										components: msg.components
									})
									.then((m) => {
										const link = new MessageButton()
											.setLabel('View Message')
											.setStyle('LINK')
											.setURL(m.url)

										let rowew = new MessageActionRow().addComponents([link])

										return interaction.followUp({
											content:
												'Done.. Editing the message without the button...',
											components: [rowew],
											ephemeral: true
										})
									})
							}
						} else if (i === msg.components.length - 1) {
							if (o === msg.components[i].components.length - 1) {
								interaction.followUp({
									content:
										'I cant identify a button role with that role in that message.',
									ephemeral: true
								})
							}
						}
					}
				}
			}
		} catch (err) {
			console.log(
				`Error Occured. | betterBtnRole (type: remove) | ${err.stack}`
			)
		}
	}
}

module.exports = betterBtnRole
