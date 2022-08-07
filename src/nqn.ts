import { Message, TextChannel } from 'discord.js';
import chalk from 'chalk';

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * NQN bot feature. But you have the power to do it.
 * @param message
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/nqn***
 * @example simplydjs.nqn(message)
 */

export async function nqn(message: Message) {
	try {
	const { client } = message;
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
	webhook = webhook.find((x) => x.name === 'simply-djs NQN')

	if (!webhook) {
		webhook = await message.channel.createWebhook({
            name: 'simply-djs NQN',
			avatar: client.user.displayAvatarURL({ dynamic: true })
		})
	}

	await webhook.edit({
		name: message.member.nickname
			? message.member.nickname
			: message.author.username,
		avatar: message.author.displayAvatarURL({ dynamic: true })
	})

	message.delete().catch((err) => {console.log(err)})
	webhook.send(msg).catch((err) => {console.log(err)})

	await webhook.edit({
		name: 'simply-djs NQN',
		avatar: client.user.displayAvatarURL({ dynamic: true })
	});
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta('nqn')} | Error: ${
				err.stack
			}`
		);
	}
}
