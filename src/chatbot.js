const Discord = require('discord.js')
const fetch = require('node-fetch')

/**
 --- options ---
 
toggle => Boolean
chid => (Channel ID) String
name => String
developer => String
 */

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {import('../index').chatbotOptions} options
 */

async function chatbot(client, message, options = {}) {
	if (message.author.bot) return
	if (options && options.toggle === false) return

	// make sure channel is always a array
	/** @type {string[]} */
	let channels = []
	if (Array.isArray(options.chid)) channels = options.chid
	else channels.push(options.chid)

	try {
		//Check that every ID is a valid channelID
		for (let channelID of channels) {
			const ch = client.channels.cache.get(channelID)
			if (!ch)
				throw new Error(
					`INVALID_CHANNEL_ID: ${channelID}. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission. Go to https://discord.com/invite/3JzDV9T5Fn to get support`
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

		//Replacing Emojis
		input = input.replace(/<a?:.+:\d+>/gm, '')

		await message.channel.sendTyping()

		const url = new URL('https://api.affiliateplus.xyz/api/chatbot'),
			params = url.searchParams,
			age = new Date().getFullYear() - client.user.createdAt.getFullYear()

		params.set('message', input)
		params.set('ownername', options.developer ?? 'Rahuletto#0243')
		params.set('botname', options.name ?? client.user.username)
		params.set('age', age)
		params.set('birthyear', client.user.createdAt.getFullYear())
		params.set('birthdate', client.user.createdAt.toLocaleDateString())
		params.set('birthplace', 'Simply-DJS')
		params.set('location', message.guild.name)
		params.set('company', 'Simply-DJS')
		params.set('user', message.author.id)

		// Using await instead of .then
		const jsonRes = await fetch(url).then((res) => res.json()) // Parsing the JSON

		const chatbotReply = jsonRes.message
			.replace(/@everyone/g, '`@everyone`') //RegExp with g Flag will replace every @everyone instead of just the first
			.replace(/@here/g, '`@here`')

		await message.reply({
			content: chatbotReply,
			allowedMentions: { repliedUser: false }
		})
	} catch (err) {
		if (err instanceof fetch.FetchError) {
			if (err.type === 'invalid-json') {
				message.reply({ content: '**Error:**\n```API offline```' }) //Catch errors that happen while fetching
				console.log(`Error Occured. | chatbot | Error: API offline`)
			}
		} else console.log(`Error Occured. | chatbot | Error: ${err.stack}`)
	}
}

module.exports = chatbot
