const Discord = require('discord.js')

/**
 * @param {Discord.Message} message
 */

/**
 --- options ---

 **NONE**

 */

async function nqn(message) {
	let { client } = message
	if (message.author.bot) return
	let msg = message.content

	let emojis = msg.match(/(?<=:)([^:\s]+)(?=:)/g)
	if (!emojis) return

	const hasEmoteRegex = /<a?:.+:\d+>/gm
	const emoteRegex = /<:.+:(\d+)>/gm

	const emoj = message.content.match(hasEmoteRegex)

	emojis.forEach((m) => {
		let emoji =
			message.guild.emojis.cache.find((x) => x.name === m) ||
			client.emojis.cache.find((x) => x.name === m)

		if (!emoji) return

		if ((emo = emoteRegex.exec(emoj))) {
			if (emoji !== undefined && emoji.id !== emo[1]) return
		}

		let temp = emoji.toString()
		if (new RegExp(temp, 'g').test(msg))
			msg = msg.replace(new RegExp(temp, 'g'), emoji.toString())
		else msg = msg.replace(new RegExp(':' + m + ':', 'g'), emoji.toString())
	})

	if (msg === message.content) return

	let webhook = await message.channel.fetchWebhooks()
	webhook = webhook.find((x) => x.name === 'simply-djs | CTK')

	if (!webhook) {
		webhook = await message.channel.createWebhook('simply-djs | CTK', {
			avatar: client.user.displayAvatarURL({ dynamic: true })
		})
	}

	await webhook.edit({
		name: message.member.nickname
			? message.member.nickname
			: message.author.username,
		avatar: message.author.displayAvatarURL({ dynamic: true })
	})

	message.delete().catch((err) => {})
	webhook.send(msg).catch((err) => {})

	await webhook.edit({
		name: 'simply-djs | CTK',
		avatar: client.user.displayAvatarURL({ dynamic: true })
	})
}

module.exports = nqn
