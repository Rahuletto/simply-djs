import { Client, Message } from 'discord.js'

import axios from 'axios'
import SimplyError from './Error/Error'
import chalk from 'chalk'

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

export type chatbotOptions = {
	channelId?: string | string[]
	toggle?: boolean
	name: string
	developer: string
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

export async function chatbot(
	client: Client,
	message: Message,
	options: chatbotOptions = { name: 'Simply-DJS', developer: 'Rahuletto' }
): Promise<Message> {
	if (message.author.bot) return
	if (options && options.toggle === false) return

	let channels = []
	if (Array.isArray(options.channelId)) channels = options.channelId
	else channels.push(options.channelId)

	try {
		for (let chan of channels) {
			const ch = await client.channels.fetch(chan, {
				cache: true
			})
			if (!ch)
				throw new SimplyError(
					`INVALID_CHANNEL_ID: ${chan}. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission.`,
					'Check my permissions (or) Try using another Channel ID'
				)
		}

		//Return if the channel of the message is not a chatbot channel
		if (!channels.includes(message.channel.id)) return

		const ranges = [
			'\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
			'\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
			'\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
		]

		let input = message.cleanContent.replace(
			new RegExp(ranges.join('|'), 'g'),
			'.'
		)

		let regg =
			/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
		//Replacing Emojis
		input = input.replace(/<a?:.+:\d+>/gm, '')
		input = input.replace(regg, '')

		options.name ??= 'Simply-DJS'
		options.developer ??= 'Rahuletto'

		await message.channel.sendTyping()

		const url = new URL('https://simplyapi.js.org/chatbot'),
			params = url.searchParams,
			age = new Date().getFullYear() - client.user.createdAt.getFullYear()

		params.set('message', input)
		params.set('developer', options.developer)
		params.set('name', options.name ?? client.user.username)
		params.set('age', age.toString()) //@ts-ignore
		params.set('year', client.user.createdAt.getFullYear())
		params.set('bday', client.user.createdAt.toLocaleDateString())
		params.set('birthplace', 'Simply-Develop')
		params.set('uid', message.author.id)

		// Using await instead of .then
		const jsonRes = await axios.get(url.toString()).then((res: any) => res.data) // Parsing the data

		const chatbotReply = jsonRes.message
			.replace(/@everyone/g, '`@everyone`')
			.replace(/@here/g, '`@here`')

		if (chatbotReply === '') {
			return message.reply({
				content: 'Wait What ?',
				allowedMentions: { repliedUser: false }
			})
		}
		await message.reply({
			content: chatbotReply,
			allowedMentions: { repliedUser: false }
		})
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta('chatbot')} | Error: ${
				err.stack
			}`
		)
	}
}
