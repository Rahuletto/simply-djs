const Discord = require('discord.js')

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {import('../index').btnroleOptions} options
 */

/**
 --- options ---
 
embed => Embed

 data => {
   role => (roleID) String
   label => String
   emoji => (emojiID) String
   color => (buttonColor) String
 }
 */

async function btnrole(client, message, options = []) {
	try {
		if (!options.data)
			throw new Error(
				'NO_DATA_PROVIDED. You didnt specify any data to make buttons..'
			)

		let { MessageButton, MessageActionRow } = require('discord.js')

		if (!message.member.permissions.has('ADMINISTRATOR'))
			return message.reply(
				'You need `ADMINISTRATOR` permission to use this slash command'
			)

		let row = []
		let data = options.data

		if (data.length <= 5) {
			button = new Array([])
			btnroleengin(data, button, row)
		} else if (data.length > 5 && data.length <= 10) {
			button = new Array([], [])
			btnroleengin(data, button, row)
		} else if (data.length > 11 && data.length <= 15) {
			button = new Array([], [], [])
			btnroleengin(data, button, row)
		} else if (data.length > 16 && data.length <= 20) {
			button = new Array([], [], [], [])
			btnroleengin(data, button, row)
		} else if (data.length > 21 && data.length <= 25) {
			button = new Array([], [], [], [], [])
			btnroleengin(data, button, row)
		} else if (data.length > 25) {
			throw new Error('Max 25 roles accepted.. Exceeding it will cause errors.')
		}
		async function btnroleengin(data, button, row) {
			let current = 0

			for (let i = 0; i < data.length; i++) {
				if (button[current].length === 5) current++

				let role = message.guild.roles.cache.find((r) => r.id === data[i].role)

				let emoji = data[i].emoji || null
				let clr = data[i].color || 'SECONDARY'

				if (data[i].color === 'grey') {
					data[i].color = 'SECONDARY'
				} else if (data[i].color === 'red') {
					data[i].color = 'DANGER'
				} else if (data[i].color === 'green') {
					data[i].color = 'SUCCESS'
				} else if (data[i].color === 'blurple') {
					data[i].color = 'PRIMARY'
				}

				let label = data[i].label || role.name

				button[current].push(createButton(label, role, clr, emoji))
				if (i === data.length - 1) {
					for (let btn of button) row.push(addRow(btn))
				}
			}

			if (!options.embed)
				throw new Error(
					'NO_EMBED_SPECIFIED. You didnt specify any embed to me to send..'
				)

			let emb = options.embed

			message.channel.send({
				embeds: [emb],
				components: row
			})

			function addRow(btns) {
				let row1 = new MessageActionRow()
				for (let btn of btns) {
					row1.addComponents(btn)
				}
				return row1
			}

			function createButton(label, role, color, emoji) {
				if (!emoji || emoji === null) {
					const btn = new MessageButton()
						.setLabel(label)
						.setStyle(color)
						.setCustomId('role-' + role.id)
					return btn
				} else if (emoji && emoji !== null) {
					const btn = new MessageButton()
						.setLabel(label)
						.setStyle(color)
						.setCustomId('role-' + role.id)
						.setEmoji(emoji)
					return btn
				}
			}
		}
	} catch (err) {
		console.log(`Error Occured. | btnrole | Error: ${err.stack}`)
	}
}
module.exports = btnrole
