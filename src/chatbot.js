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

		let regg =
			/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
		//Replacing Emojis
		input = input.replace(/<a?:.+:\d+>/gm, '')
		input = input.replace(regg, '')

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
		params.set('birthplace', 'Simply-Develop')
		params.set('location', message.guild.name)
		params.set('user', message.author.id)

		// Using await instead of .then
		const jsonRes = await fetch(url).then((res) => res.json()) // Parsing the JSON

		const chatbotReply = jsonRes.message
			.replace(/@everyone/g, '`@everyone`') //RegExp with g Flag will replace every @everyone instead of just the first
			.replace(/@here/g, '`@here`')

		if (chatbotReply === '') {
			return message.reply({
				content: 'Uh What ?',
				allowedMentions: { repliedUser: false }
			})
		}
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
