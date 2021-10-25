const Discord = require('discord.js')

/**
 * @param {Discord.CommandInteraction} message
 * @param {import('../index').dropdownPagesOptions} options
 */

/**
 --- options ---
 
  type => (1/2) Number
  data => {
    label => String
    desc => String
    emoji => (Emoji ID) String
    embed => Embed
    }
  rows => Array (ActionRows)

  placeHolder => String
  embed => Embed
  
  delOption => Boolean
  delLabel => String
  delDesc => String
  delEmoji => (Emoji ID) String

 */

async function dropdownPages(message, options = []) {
	let { MessageActionRow, MessageSelectMenu } = require('discord.js')
	let typ = options.type || 1
	let type = Number(typ)
	if (type > 2)
		throw new Error(
			'There is no Type more than 2.. TYPE 1: SEND EPHEMERAL MSG | TYPE 2: EDIT MSG'
		)

	let data = options.data
	let rowz = options.rows
	let menuOptions = []

	for (let i = 0; i < data.length; i++) {
		if (data[i].emoji) {
			let dataopt = {
				label: data[i].label,
				description: data[i].desc,
				value: data[i].label,
				emoji: data[i].emoji
			}

			menuOptions.push(dataopt)
		} else if (!data[i].emoji) {
			let dataopt = {
				label: data[i].label,
				description: data[i].desc,
				value: data[i].label
			}

			menuOptions.push(dataopt)
		}
	}
	let delopt

	if (
		options.delOption === undefined ||
		(options.delOption !== false && options.delOption === true)
	) {
		delopt = {
			label: options.delLabel || 'Delete',
			description: options.delDesc || 'Delete the Select Menu Embed',
			value: 'delete_menuemb',
			emoji: options.delEmoji || '❌'
		}

		menuOptions.push(delopt)
	}

	let slct = new MessageSelectMenu()
		.setMaxValues(1)
		.setCustomId('help')
		.setPlaceholder(options.placeHolder || 'Dropdown Pages')
		.addOptions([menuOptions])

	let row = new MessageActionRow().addComponents(slct)

	let rows = []

	rows.push(row)

	if (rowz) {
		for (let i = 0; i < rowz.length; i++) {
			rows.push(rowz[i])
		}
	}

	if (message.commandId) {
		message.followUp({ embeds: [options.embed], components: rows })
		let m = await message.fetchReply()

		const collector = m.createMessageComponentCollector({
			type: 'SELECT_MENU',
			idle: 600000
		})
		collector.on('collect', async (menu) => {
			let selet = menu.values[0]

			if (selet === 'delete_menuemb') {
				if (message.user.id !== menu.user.id)
					return menu.reply({
						content:
							'You Cant delete the message as you didnt use that command',
						ephemeral: true
					})
				else if (message.user.id === menu.user.id) return menu.message.delete()
			}
			menu.deferUpdate()

			for (let i = 0; i < data.length; i++) {
				if (selet === data[i].label) {
					if (type === 1) {
						menu.followUp({ embeds: [data[i].embed], ephemeral: true })
					} else if (type === 2) {
						menu.message.edit({ embeds: [data[i].embed] })
					}
				}
			}
		})
		collector.on('end', async (collected) => {
			if (collected.size === 0) {
				m.edit({ embeds: [options.embed], components: [] })
			}
		})
	} else if (!message.commandId) {
		message
			.reply({ embeds: [options.embed], components: rows })
			.then(async (m) => {
				const collector = m.createMessageComponentCollector({
					type: 'SELECT_MENU',
					idle: 600000
				})
				collector.on('collect', async (menu) => {
					let selet = menu.values[0]

					if (selet === 'delete_menuemb') {
						if (message.author.id !== menu.user.id)
							return menu.reply({
								content:
									'You Cant delete the message as you didnt use that command',
								ephemeral: true
							})
						else if (message.author.id === menu.user.id)
							return menu.message.delete()
					}

					menu.deferUpdate()

					for (let i = 0; i < data.length; i++) {
						if (selet === data[i].label) {
							if (type === 1) {
								menu.followUp({ embeds: [data[i].embed], ephemeral: true })
							} else if (type === 2) {
								menu.message.edit({ embeds: [data[i].embed] })
							}
						}
					}
				})
				collector.on('end', async (collected) => {
					if (collected.size === 0) {
						m.edit({ embeds: [options.embed], components: [] })
					}
				})
			})
	}
}

module.exports = dropdownPages
