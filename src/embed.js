const Discord = require('discord.js')

/**
 * @param {Discord.Message} message
 * @param {import('../index').embedCreateOptions} options
 */

/**
 --- options ---
 
embedTitle => String
embedColor => String 

embed => Embed

embedFoot => String
credit => Boolean
 */

async function embed(message, options = []) {
	return new Promise(async (resolve) => {
		let interaction

		if (message.commandId) {
			interaction = message
		}
		try {
			const {
				MessageEmbed,
				MessageActionRow,
				MessageSelectMenu,
				MessageButton
			} = require('discord.js')

			const done = new MessageButton()
				.setLabel('Done')
				.setStyle('SUCCESS')
				.setCustomId('setDone')

			const reject = new MessageButton()
				.setLabel('Cancel/Delete')
				.setStyle('DANGER')
				.setCustomId('setDelete')

			let name = [
				'Message',
				'Author',
				'Title',
				'Description',
				'Color',
				'URL',
				'Image',
				'Thumbnail',
				'Footer',
				'Timestamp'
			]
			let desc = [
				'Message outside of the embed',
				'Set a author name in the embed',
				'Title of the embed',
				'Description of the embed',
				'Color of the embed',
				'URL in the title in the embed (hyperlink for title)',
				'Image in the embed',
				'Thumbnail in the embed',
				'Footer of the embed',
				'Have a timestamp. Its cool.'
			]
			let value = [
				'setContent',
				'setAuthor',
				'setTitle',
				'setDescription',
				'setColor',
				'setURL',
				'setImage',
				'setThumbnail',
				'setFooter',
				'setTimestamp'
			]

			let menuOptions = []

			let foot = options.embedFoot
			if (options.credit === false) foot ??= 'Create Embed with ease'
			else foot ??= 'Embed creator using Simply-DJS'

			for (let i = 0; i < name.length; i++) {
				let dataopt = {
					label: name[i],
					description: desc[i],
					value: value[i]
				}

				menuOptions.push(dataopt)
			}

			let slct = new MessageSelectMenu()
				.setMaxValues(1)
				.setCustomId('embed-creator')
				.setPlaceholder('Embed Creation Options')
				.addOptions([menuOptions])

			const row = new MessageActionRow().addComponents([done, reject])

			const row2 = new MessageActionRow().addComponents([slct])

			const embed = new MessageEmbed()
				.setTitle(options.embedTitle || 'Embed Creator')
				.setDescription(
					'Select any ***option*** from the Select Menu in this message and i will **collect all informations and create a embed** for you using that data.\n\nThis is a completed embed.'
				)
				.setImage(
					'https://user-images.githubusercontent.com/71836991/145395922-311bb29a-a45b-476a-b55e-73cd4717f401.png'
				)
				.setColor(options.embedColor || '#075FFF')
				.setFooter(foot)

			let e
			if (message.commandId) {
				interaction.followUp({
					embeds: [options.embed || embed],
					components: [row2, row]
				})
			} else if (!message.commandId) {
				e = await message.reply({
					embeds: [options.embed || embed],
					components: [row2, row]
				})
			}

			const emb = new MessageEmbed().setFooter(foot).setColor('#2F3136')

			message.channel
				.send({ content: '** **', embeds: [emb] })
				.then(async (a) => {
					let lel
					let membed

					if (message.commandId) {
						lel = await message.fetchReply()
						e = await message.fetchReply()
						membed = await message.channel.messages.fetch(a.id)
					} else if (!message.commandId) {
						membed = await message.channel.messages.fetch(a.id)
						lel = await message.channel.messages.fetch(e.id)
					}

					let filter = (m) =>
						m.user.id === (interaction ? interaction.user : message.author).id
					let collector = e.createMessageComponentCollector({
						filter,
						type: 'SELECT_MENU',
						idle: 600000
					})

					collector.on('collect', async (button) => {
						if (button.customId && button.customId === 'setDelete') {
							button.reply({ content: 'Deleting...', ephemeral: true })

							membed.delete().catch(() => {})
							e.delete().catch(() => {})
						} else if (button.customId && button.customId === 'setDone') {
							if (
								(interaction ? interaction : message).member.permissions.has(
									'ADMINISTRATOR'
								)
							) {
								button.reply({
									content: 'Tell me the channel to send the embed.',
									ephemeral: true
								})

								let filter = (m) =>
									(interaction ? interaction.user : message.author).id ===
									m.author.id
								let titleclr = button.channel.createMessageCollector({
									filter,
									time: 30000,
									max: 1
								})

								titleclr.on('collect', async (m) => {
									if (m.mentions.channels.first()) {
										let ch = m.mentions.channels.first()
										button.editReply({ content: 'Done 👍', ephemeral: true })

										ch.send({
											content: membed.content,
											embeds: [membed.embeds[0]]
										})
										membed.delete().catch(() => {})
										e.delete().catch(() => {})
										m.delete().catch(() => {})

										resolve(membed.embeds[0].toJSON())
									}
								})
							} else if (
								!(interaction ? interaction : message).member.permissions.has(
									'ADMINISTRATOR'
								)
							) {
								button.reply({ content: 'Done 👍', ephemeral: true })

								message.channel.send({
									content: membed.content,
									embeds: [membed.embeds[0]]
								})
								membed.delete().catch(() => {})
								e.delete().catch(() => {})

								resolve(membed.embeds[0].toJSON())
							}
						} else if (button.values[0] === 'setTimestamp') {
							let btn = new Discord.MessageButton()
								.setLabel('Yes')
								.setCustomId('timestamp-yes')
								.setStyle('SUCCESS')

							let btn2 = new Discord.MessageButton()
								.setLabel('No')
								.setCustomId('timestamp-no')
								.setStyle('DANGER')

							button.reply({
								content: 'Do you want a Timestamp in the embed ?',
								ephemeral: true,
								components: [new MessageActionRow().addComponents([btn, btn2])]
							})

							let filter = (m) =>
								(interaction ? interaction.user : message.author).id ===
								(m.user ? m.user : m.author).id
							let titleclr = button.channel.createMessageComponentCollector({
								filter,
								idle: 60000
							})

							titleclr.on('collect', async (btn) => {
								if (btn.customId === 'timestamp-yes') {
									const url = membed.embeds[0].image
										? membed.embeds[0].image.url
										: ''

									let msg = new MessageEmbed()
										.setTitle(membed.embeds[0].title || '')
										.setDescription(membed.embeds[0].description || '')
										.setColor(membed.embeds[0].color || '#36393F')
										.setFooter(membed.embeds[0].footer.text || '')
										.setImage(url)
										.setURL(membed.embeds[0].url || '')
										.setThumbnail(
											membed.embeds[0].thumbnail
												? membed.embeds[0].thumbnail.url
												: ''
										)
										.setAuthor(
											membed.embeds[0].author?.name
												? membed.embeds[0].author?.name
												: '',
											membed.embeds[0].author?.icon_url
												? membed.embeds[0].author?.icon_url
												: '',
											membed.embeds[0].author?.url
												? membed.embeds[0].author?.url
												: ''
										)
										.setTimestamp(new Date())

									button.editReply({
										components: [],
										content: 'Enabled Timestamp on the embed'
									})

									membed
										.edit({ content: membed.content, embeds: [msg] })
										.catch(() => {})
								}

								if (btn.customId === 'timestamp-no') {
									const url = membed.embeds[0].image
										? membed.embeds[0].image.url
										: ''

									let msg = new MessageEmbed()
										.setTitle(membed.embeds[0].title || '')
										.setDescription(membed.embeds[0].description || '')
										.setColor(membed.embeds[0].color || '#36393F')
										.setFooter(membed.embeds[0].footer.text || '')
										.setImage(url)
										.setURL(membed.embeds[0].url || '')
										.setThumbnail(
											membed.embeds[0].thumbnail
												? membed.embeds[0].thumbnail.url
												: ''
										)
										.setAuthor(
											membed.embeds[0].author?.name
												? membed.embeds[0].author?.name
												: '',
											membed.embeds[0].author?.icon_url
												? membed.embeds[0].author?.icon_url
												: '',
											membed.embeds[0].author?.url
												? membed.embeds[0].author?.url
												: ''
										)
										.setTimestamp(false)

									button.editReply({
										components: [],
										content: 'Disabled Timestamp on the embed'
									})

									membed
										.edit({ content: membed.content, embeds: [msg] })
										.catch(() => {})
								}
							})
						} else if (button.values[0] === 'setAuthor') {
							let autsel = new MessageSelectMenu()
								.setMaxValues(1)
								.setCustomId('author-selct')
								.setPlaceholder('Author Options')
								.addOptions([
									{
										label: 'Author name',
										description: 'Set the author name',
										value: 'author-name'
									},
									{
										label: 'Author icon',
										description: 'Set the author icon',
										value: 'author-icon'
									},
									{
										label: 'Author URL',
										description: 'Set the author url',
										value: 'author-url'
									}
								])

							button.reply({
								content: 'Select one from these "Author" options',
								ephemeral: true,
								components: [new MessageActionRow().addComponents([autsel])]
							})

							let filter = (m) =>
								(interaction ? interaction.user : message.author).id ===
								(m.user ? m.user : m.author).id
							let titleclr = button.channel.createMessageComponentCollector({
								filter,
								idle: 60000
							})

							titleclr.on('collect', async (menu) => {
								menu.deferUpdate()
								if (menu.customId !== 'author-selct') return

								if (menu.values[0] === 'author-name') {
									button.editReply({
										content: 'Send me the Author name',
										ephemeral: true,
										components: []
									})

									let authclr = button.channel.createMessageCollector({
										filter,
										time: 30000,
										max: 1
									})

									authclr.on('collect', async (m) => {
										const url = membed.embeds[0].image
											? membed.embeds[0].image.url
											: ''

										let msg = new MessageEmbed()
											.setTitle(membed.embeds[0].title || '')
											.setDescription(membed.embeds[0].description || '')
											.setColor(membed.embeds[0].color || '#36393F')
											.setFooter(membed.embeds[0].footer.text || '')
											.setImage(url)
											.setURL(membed.embeds[0].url || '')
											.setThumbnail(
												membed.embeds[0].thumbnail
													? membed.embeds[0].thumbnail.url
													: ''
											)
											.setAuthor(
												m.content,
												membed.embeds[0].author?.icon_url
													? membed.embeds[0].author?.icon_url
													: '',
												membed.embeds[0].author?.url
													? membed.embeds[0].author?.url
													: ''
											)
											.setTimestamp(
												membed.embeds[0].timestamp ? new Date() : false
											)

										titleclr.stop()
										m.delete().catch(() => {})

										membed
											.edit({ content: membed.content, embeds: [msg] })
											.catch(() => {})
									})
								}

								if (menu.values[0] === 'author-icon') {
									button.editReply({
										content: 'Send me the Author icon (Attachment/Image URL)',
										ephemeral: true,
										components: []
									})

									let authclr = button.channel.createMessageCollector({
										filter,
										time: 30000,
										max: 1
									})

									authclr.on('collect', async (m) => {
										const url = membed.embeds[0].image
											? membed.embeds[0].image.url
											: ''

										let isthumb =
											m.content.match(
												/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
											) != null ||
											m.attachments.first().url ||
											''
										if (!isthumb)
											return button.editReply({
												content:
													'This is not a image url. Please provide a image url or attachment.',
												ephemeral: true
											})

										let msg = new MessageEmbed()
											.setTitle(membed.embeds[0].title || '')
											.setDescription(membed.embeds[0].description || '')
											.setColor(membed.embeds[0].color || '#36393F')
											.setFooter(membed.embeds[0].footer.text || '')
											.setImage(url)
											.setURL(membed.embeds[0].url || '')
											.setThumbnail(
												membed.embeds[0].thumbnail
													? membed.embeds[0].thumbnail.url
													: ''
											)
											.setTimestamp(
												membed.embeds[0].timestamp ? new Date() : false
											)
											.setAuthor(
												membed.embeds[0].author?.name
													? membed.embeds[0].author?.name
													: '',
												m.content || m.attachments.first().url || '',
												membed.embeds[0].author?.url
													? membed.embeds[0].author?.url
													: ''
											)

										titleclr.stop()
										m.delete().catch(() => {})

										membed
											.edit({ content: membed.content, embeds: [msg] })
											.catch(() => {})
									})
								}

								if (menu.values[0] === 'author-url') {
									button.editReply({
										content: 'Send me the Author Hyperlink',
										ephemeral: true,
										components: []
									})

									let authclr = button.channel.createMessageCollector({
										filter,
										time: 30000,
										max: 1
									})

									authclr.on('collect', async (m) => {
										const url = membed.embeds[0].image
											? membed.embeds[0].image.url
											: ''

										if (!m.content.startsWith('http')) {
											m.delete().catch(() => {})
											return button.editReply(
												'A URL should start with http protocol. Please give a valid URL.'
											)
										} else {
											let msg = new MessageEmbed()
												.setTitle(membed.embeds[0].title || '')
												.setDescription(membed.embeds[0].description || '')
												.setColor(membed.embeds[0].color || '#36393F')
												.setFooter(membed.embeds[0].footer.text || '')
												.setImage(url)
												.setURL(membed.embeds[0].url || '')
												.setThumbnail(
													membed.embeds[0].thumbnail
														? membed.embeds[0].thumbnail.url
														: ''
												)
												.setAuthor(
													membed.embeds[0].author?.name
														? membed.embeds[0].author?.name
														: '',
													membed.embeds[0].author?.icon_url
														? membed.embeds[0].author?.icon_url
														: '',
													m.content || ''
												)
												.setTimestamp(
													membed.embeds[0].timestamp ? new Date() : false
												)

											titleclr.stop()
											m.delete().catch(() => {})

											membed
												.edit({ content: membed.content, embeds: [msg] })
												.catch(() => {})
										}
									})
								}
							})
						} else if (button.values[0] === 'setContent') {
							button.reply({
								content:
									'Tell me what text you want for message outside of embed',
								ephemeral: true
							})
							let filter = (m) =>
								(interaction ? interaction.user : message.author).id ===
								m.author.id
							let titleclr = button.channel.createMessageCollector({
								filter,
								time: 30000,
								max: 1
							})

							titleclr.on('collect', async (m) => {
								const url = membed.embeds[0].image
									? membed.embeds[0].image.url
									: ''

								let msg = new MessageEmbed()
									.setTitle(membed.embeds[0].title || '')
									.setDescription(membed.embeds[0].description || '')
									.setColor(membed.embeds[0].color || '#36393F')
									.setFooter(membed.embeds[0].footer.text || '')
									.setImage(url)
									.setURL(membed.embeds[0].url || '')
									.setThumbnail(
										membed.embeds[0].thumbnail
											? membed.embeds[0].thumbnail.url
											: ''
									)
									.setTimestamp(membed.embeds[0].timestamp ? new Date() : false)
									.setAuthor(
										membed.embeds[0].author?.name
											? membed.embeds[0].author?.name
											: '',
										membed.embeds[0].author?.icon_url
											? membed.embeds[0].author?.icon_url
											: '',
										membed.embeds[0].author?.url
											? membed.embeds[0].author?.url
											: ''
									)

								titleclr.stop()
								m.delete().catch(() => {})

								membed
									.edit({ content: m.content, embeds: [msg] })
									.catch(() => {})
							})
						} else if (button.values[0] === 'setThumbnail') {
							button.reply({
								content:
									'Tell me what image you want for embed thumbnail (small image at top right)',
								ephemeral: true
							})
							let filter = (m) =>
								(interaction ? interaction.user : message.author).id ===
								m.author.id
							let titleclr = button.channel.createMessageCollector({
								filter,
								time: 30000,
								max: 1
							})

							titleclr.on('collect', async (m) => {
								const url = membed.embeds[0].image
									? membed.embeds[0].image.url
									: ''

								let isthumb =
									m.content.match(
										/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
									) != null ||
									m.attachments.first().url ||
									''
								if (!isthumb)
									return message.followUp({
										content:
											'This is not a image url. Please provide a image url or attachment.',
										ephemeral: true
									})

								let msg = new MessageEmbed()
									.setTitle(membed.embeds[0].title || '')
									.setDescription(membed.embeds[0].description || '')
									.setColor(membed.embeds[0].color || '#2F3136')
									.setURL(membed.embeds[0].url || '')
									.setFooter(membed.embeds[0].footer.text || '')
									.setImage(url)
									.setThumbnail(m.content || m.attachments.first().url || '')
									.setAuthor(
										membed.embeds[0].author?.name
											? membed.embeds[0].author?.name
											: '',
										membed.embeds[0].author?.icon_url
											? membed.embeds[0].author?.icon_url
											: '',
										membed.embeds[0].author?.url
											? membed.embeds[0].author?.url
											: ''
									)
									.setTimestamp(membed.embeds[0].timestamp ? new Date() : false)

								titleclr.stop()
								m.delete().catch(() => {})

								membed
									.edit({ content: membed.content, embeds: [msg] })
									.catch(() => {})
							})
						} else if (button.values[0] === 'setColor') {
							button.reply({
								content: 'Tell me what color you want for embed',
								ephemeral: true
							})
							let filter = (m) =>
								(interaction ? interaction.user : message.author).id ===
								m.author.id
							let titleclr = button.channel.createMessageCollector({
								filter,
								time: 30000
							})

							titleclr.on('collect', async (m) => {
								if (/^#[0-9A-F]{6}$/i.test(m.content)) {
									const url = membed.embeds[0].image
										? membed.embeds[0].image.url
										: ''

									let msg = new MessageEmbed()
										.setTitle(membed.embeds[0].title || '')
										.setDescription(membed.embeds[0].description || '')
										.setColor(`${m.content}`)
										.setURL(membed.embeds[0].url || '')
										.setFooter(membed.embeds[0].footer.text || '')
										.setImage(url)
										.setAuthor(
											membed.embeds[0].author?.name
												? membed.embeds[0].author?.name
												: '',
											membed.embeds[0].author?.icon_url
												? membed.embeds[0].author?.icon_url
												: '',
											membed.embeds[0].author?.url
												? membed.embeds[0].author?.url
												: ''
										)
										.setTimestamp(
											membed.embeds[0].timestamp ? new Date() : false
										)
										.setThumbnail(
											membed.embeds[0].thumbnail
												? membed.embeds[0].thumbnail.url
												: ''
										)

									m.delete().catch(() => {})
									titleclr.stop()
									membed
										.edit({ content: membed.content, embeds: [msg] })
										.catch(() => {})
								} else {
									message.reply('Please give me a valid hex code')
								}
							})
						} else if (button.values[0] === 'setURL') {
							button.reply({
								content:
									'Tell me what URL you want for embed title (hyperlink for embed title)',
								ephemeral: true
							})
							let filter = (m) =>
								(interaction ? interaction.user : message.author).id ===
								m.author.id
							let titleclr = button.channel.createMessageCollector({
								filter,
								time: 30000,
								max: 1
							})

							titleclr.on('collect', async (m) => {
								if (!m.content.startsWith('http')) {
									m.delete().catch(() => {})
									return button.editReply(
										'A URL should start with http protocol. Please give a valid URL.'
									)
								} else {
									const url = membed.embeds[0].image
										? membed.embeds[0].image.url
										: ''
									let msg = new MessageEmbed()
										.setTitle(membed.embeds[0].title || '')
										.setAuthor(
											membed.embeds[0].author?.name
												? membed.embeds[0].author?.name
												: '',
											membed.embeds[0].author?.icon_url
												? membed.embeds[0].author?.icon_url
												: '',
											membed.embeds[0].author?.url
												? membed.embeds[0].author?.url
												: ''
										)
										.setTimestamp(
											membed.embeds[0].timestamp ? new Date() : false
										)
										.setURL(m.content)
										.setDescription(membed.embeds[0].description || '')
										.setColor(membed.embeds[0].color || '#2F3136')
										.setImage(url || '')
										.setFooter(membed.embeds[0].footer.text || '')
										.setThumbnail(
											membed.embeds[0].thumbnail
												? membed.embeds[0].thumbnail.url
												: ''
										)

									m.delete().catch(() => {})
									titleclr.stop()
									membed
										.edit({ content: membed.content, embeds: [msg] })
										.catch(() => {})
								}
							})
						} else if (button.values[0] === 'setImage') {
							button.reply({
								content: 'Tell me what image you want for embed',
								ephemeral: true
							})
							let filter = (m) =>
								(interaction ? interaction.user : message.author).id ===
								m.author.id
							let titleclr = button.channel.createMessageCollector({
								filter,
								time: 30000,
								max: 1
							})

							titleclr.on('collect', async (m) => {
								let isthumb =
									m.content.match(
										/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
									) != null ||
									m.attachments.first().url ||
									''
								if (!isthumb)
									return message.reply(
										'This is not a image url. Please provide a image url or attachment.'
									)

								let msg = new MessageEmbed()
									.setTitle(membed.embeds[0].title || '')
									.setDescription(membed.embeds[0].description || '')
									.setColor(membed.embeds[0].color || '#2F3136')
									.setFooter(membed.embeds[0].footer.text || '')
									.setAuthor(
										membed.embeds[0].author?.name
											? membed.embeds[0].author?.name
											: '',
										membed.embeds[0].author?.icon_url
											? membed.embeds[0].author?.icon_url
											: '',
										membed.embeds[0].author?.url
											? membed.embeds[0].author?.url
											: ''
									)
									.setImage(m.content || m.attachments.first().url)
									.setURL(membed.embeds[0].url)
									.setThumbnail(
										membed.embeds[0].thumbnail
											? membed.embeds[0].thumbnail.url
											: ''
									)
									.setTimestamp(membed.embeds[0].timestamp ? new Date() : false)

								m.delete().catch(() => {})
								titleclr.stop()
								membed
									.edit({ content: membed.content, embeds: [msg] })
									.catch(() => {})
							})
						} else if (button.values[0] === 'setTitle') {
							button.reply({
								content: 'Tell me what text you want for embed title',
								ephemeral: true
							})
							let filter = (m) =>
								(interaction ? interaction.user : message.author).id ===
								m.author.id
							let titleclr = button.channel.createMessageCollector({
								filter,
								time: 30000,
								max: 1
							})

							titleclr.on('collect', async (m) => {
								const url = membed.embeds[0].image
									? membed.embeds[0].image.url
									: ''
								let msg = new MessageEmbed()
									.setTitle(m.content)
									.setURL(membed.embeds[0].url || '')
									.setDescription(membed.embeds[0].description || '')
									.setAuthor(
										membed.embeds[0].author?.name
											? membed.embeds[0].author?.name
											: '',
										membed.embeds[0].author?.icon_url
											? membed.embeds[0].author?.icon_url
											: '',
										membed.embeds[0].author?.url
											? membed.embeds[0].author?.url
											: ''
									)
									.setColor(membed.embeds[0].color || '#2F3136')
									.setThumbnail(
										membed.embeds[0].thumbnail
											? membed.embeds[0].thumbnail.url
											: ''
									)
									.setTimestamp(membed.embeds[0].timestamp ? new Date() : false)
									.setImage(url || '')
									.setFooter(membed.embeds[0].footer.text || '')
								m.delete().catch(() => {})
								titleclr.stop()

								membed
									.edit({ content: membed.content, embeds: [msg] })
									.catch(() => {})
							})
						} else if (button.values[0] === 'setDescription') {
							button.reply({
								content: 'Tell me what text you want for embed description',
								ephemeral: true
							})
							let filter = (m) =>
								(interaction ? interaction.user : message.author).id ===
								m.author.id
							let titleclr = button.channel.createMessageCollector({
								filter,
								time: 30000,
								max: 1
							})

							titleclr.on('collect', async (m) => {
								const url = membed.embeds[0].image
									? membed.embeds[0].image.url
									: ''

								let msg = new MessageEmbed()
									.setTitle(membed.embeds[0].title || '')
									.setURL(membed.embeds[0].url || '')
									.setDescription(m.content)
									.setTimestamp(membed.embeds[0].timestamp ? new Date() : false)
									.setAuthor(
										membed.embeds[0].author?.name
											? membed.embeds[0].author?.name
											: '',
										membed.embeds[0].author?.icon_url
											? membed.embeds[0].author?.icon_url
											: '',
										membed.embeds[0].author?.url
											? membed.embeds[0].author?.url
											: ''
									)
									.setThumbnail(
										membed.embeds[0].thumbnail
											? membed.embeds[0].thumbnail.url
											: ''
									)
									.setColor(membed.embeds[0].color || '#2F3136')
									.setImage(url || '')
									.setFooter(membed.embeds[0].footer.text || '')
								m.delete().catch(() => {})
								titleclr.stop()
								membed
									.edit({ content: membed.content, embeds: [msg] })
									.catch(() => {})
							})
						} else if (button.values[0] === 'setFooter') {
							button.reply({
								content: 'Tell me what text you want for embed footer',
								ephemeral: true
							})
							let filter = (m) =>
								(interaction ? interaction.user : message.author).id ===
								m.author.id
							let titleclr = button.channel.createMessageCollector({
								filter,
								time: 30000,
								max: 1
							})

							titleclr.on('collect', async (m) => {
								const url = membed.embeds[0].image
									? membed.embeds[0].image.url
									: ''

								let msg = new MessageEmbed()
									.setTitle(membed.embeds[0].title || '')
									.setURL(membed.embeds[0].url || '')
									.setTimestamp(membed.embeds[0].timestamp ? new Date() : false)
									.setThumbnail(
										membed.embeds[0].thumbnail
											? membed.embeds[0].thumbnail.url
											: ''
									)
									.setDescription(membed.embeds[0].description || '')
									.setColor(membed.embeds[0].color || '#2F3136')
									.setFooter(m.content || '')
									.setImage(url || '')
									.setAuthor(
										membed.embeds[0].author?.name
											? membed.embeds[0].author?.name
											: '',
										membed.embeds[0].author?.icon_url
											? membed.embeds[0].author?.icon_url
											: '',
										membed.embeds[0].author?.url
											? membed.embeds[0].author?.url
											: ''
									)

								m.delete().catch(() => {})

								titleclr.stop()

								membed
									.edit({ content: membed.content, embeds: [msg] })
									.catch(() => {})
							})
						}
					})
					collector.on('end', async (collected, reason) => {
						if (reason === 'time') {
							const content = new MessageButton()
								.setLabel('Timeout')
								.setStyle('DANGER')
								.setCustomId('timeout|91817623842')
								.setDisabled()

							const row = new MessageActionRow().addComponents([content])

							e.edit({ embeds: [lel.embeds[0]], components: [row] })
						}
					})
				})
		} catch (err) {
			console.log(`Error Occured. | embedCreate | Error: ${err.stack}`)
		}
	})
}

module.exports = embed
