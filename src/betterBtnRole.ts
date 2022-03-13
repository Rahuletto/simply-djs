import {
	Client,
	CommandInteraction,
	MessageButtonStyle,
	TextChannel,
	Role,
	Message,
	MessageButton,
	MessageActionRow
} from 'discord.js'

import chalk from 'chalk'

/*
Error Codes

- NO_BTN
- NO_MSG
- OVERLOAD
- NOT_FOUND
- OTHER_MSG
*/

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

export type betterbtnOptions = {
	custom: true | false

	type?: 'add' | 'remove'

	channel?: TextChannel

	label?: string
	messageId?: string
	role?: Role
	style?: MessageButtonStyle
	emoji?: string
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

export async function betterBtnRole(
	client: Client,
	interaction: CommandInteraction,
	options: betterbtnOptions = { custom: false }
): Promise<string> {
	return new Promise(async (resolve, reject) => {
		let ch = options.channel || interaction.options.getChannel('channel')
		let msgid = options.messageId || interaction.options.getString('message')
		let role = options.role || interaction.options.getRole('role')

		//@ts-ignore
		let msg: Message = await (ch as TextChannel).messages
			.fetch(msgid)
			.catch((e) => {})

		if (!msg) {
			if (options.custom === true) reject('NO_MSG')
			else
				return interaction.followUp({
					content:
						'Cannot find any messages with that message id in the channel you specified',
					ephemeral: true
				})
		}

		if (msg.author.id !== client.user.id) {
			if (options.custom === true) reject('OTHER_MSG')
			else
				return interaction.followUp({
					content:
						"I cannot make anyone's message as button roles. I can only make button-roles for the message i send",
					ephemeral: true
				})
		}

		if (options.type === 'add') {
			try {
				let label =
					options.label || interaction.options.getString('label') || role.name
				let color =
					options.style || interaction.options.getString('style') || 'SECONDARY'
				let emoji = options.emoji || interaction.options.getString('emoji')

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

								if (options.custom === true) return resolve('DONE')
								else
									return interaction.followUp({
										content:
											'The message has the button with the same role already.. Re-adding it now..',
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
							.setStyle(color as MessageButtonStyle)
							.setCustomId('role-' + role.id)

						let rowe = new MessageActionRow().addComponents([btn])

						await msg
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

								if (options.custom === true) return resolve('DONE')
								else
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
							.setStyle(color as MessageButtonStyle)
							.setCustomId('role-' + role.id)
							.setEmoji(emoji)

						let rowe = new MessageActionRow().addComponents([btn])

						await msg
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

								if (options.custom === true) return resolve('DONE')
								else
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
					if (msg.components.length === 5) {
						if (options.custom === true) return reject('OVERLOAD')
						else
							return interaction.followUp({
								content:
									'Sorry.. I have no space to send buttons in that message..'
							})
					}

					let rowgap = msg.components[msg.components.length - 1].components
					if (rowgap.length < 5) {
						if (!emoji || emoji === null) {
							const btn = new MessageButton()
								.setLabel(label)
								.setStyle(color as MessageButtonStyle)
								.setCustomId('role-' + role.id)

							rowgap.push(btn)

							await msg
								.edit({
									content: msg.content || '\u200b',
									embeds: msg.embeds,
									components: msg.components
								})
								.then(async (m) => {
									const link = new MessageButton()
										.setLabel('View Message')
										.setStyle('LINK')
										.setURL(m.url)

									let rowew = new MessageActionRow().addComponents([link])

									if (options.custom === true) return resolve('DONE')
									else
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
								.setStyle(color as MessageButtonStyle)
								.setCustomId('role-' + role.id)
								.setEmoji(emoji)

							rowgap.push(btn)

							await msg
								.edit({
									content: msg.content || '\u200b',
									embeds: msg.embeds,
									components: msg.components
								})
								.then(async (m) => {
									const link = new MessageButton()
										.setLabel('View Message')
										.setStyle('LINK')
										.setURL(m.url)

									let rowew = new MessageActionRow().addComponents([link])

									if (options.custom === true) return resolve('DONE')
									else
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
								.setStyle(color as MessageButtonStyle)
								.setCustomId('role-' + role.id)

							let rowe = new MessageActionRow().addComponents([btn])

							msg.components.push(rowe)

							await msg
								.edit({
									content: msg.content || '\u200b',
									embeds: msg.embeds,
									components: msg.components
								})
								.then(async (m) => {
									const link = new MessageButton()
										.setLabel('View Message')
										.setStyle('LINK')
										.setURL(m.url)

									let rowew = new MessageActionRow().addComponents([link])

									if (options.custom === true) return resolve('DONE')
									else
										return interaction.followUp({
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
								.setStyle(color as MessageButtonStyle)
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
								.then(async (m) => {
									const link = new MessageButton()
										.setLabel('View Message')
										.setStyle('LINK')
										.setURL(m.url)

									let rowew = new MessageActionRow().addComponents([link])

									if (options.custom === true) return resolve('DONE')
									else
										return interaction.followUp({
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
			} catch (err: any) {
				console.log(
					`${chalk.red('Error Occured.')} | ${chalk.magenta(
						'betterBtnRole'
					)} (type: add) | Error: ${err.stack}`
				)
			}
		} else if (options.type === 'remove') {
			try {
				if (
					!msg.components ||
					msg.components.length === 0 ||
					msg.components === []
				) {
					if (options.custom === true) return reject('NO_BTN')
					else
						return interaction.followUp({
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
									await msg
										.edit({
											content: msg.content || '\u200b',
											embeds: msg.embeds,
											components: []
										})
										.then(async (m) => {
											const link = new MessageButton()
												.setLabel('View Message')
												.setStyle('LINK')
												.setURL(m.url)

											let rowew = new MessageActionRow().addComponents([link])

											if (options.custom === true) return resolve('DONE')
											else
												return interaction.followUp({
													content:
														'Done.. Editing the message without the button...',
													components: [rowew],
													ephemeral: true
												})
										})
								} else {
									await msg
										.edit({
											content: msg.content || '\u200b',
											embeds: msg.embeds,
											components: msg.components
										})
										.then(async (m) => {
											const link = new MessageButton()
												.setLabel('View Message')
												.setStyle('LINK')
												.setURL(m.url)

											let rowew = new MessageActionRow().addComponents([link])

											if (options.custom === true) return resolve('DONE')
											else
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
									if (options.custom === true) return reject('NOT_FOUND')
									else
										return interaction.followUp({
											content:
												'I cant identify a button role with that role in that message.',
											ephemeral: true
										})
								}
							}
						}
					}
				}
			} catch (err: any) {
				console.log(
					`${chalk.red('Error Occured.')} | ${chalk.magenta(
						'betterBtnRole'
					)} (type: remove) | Error: ${err.stack}`
				)
			}
		}
	})
}
