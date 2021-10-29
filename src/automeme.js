const Discord = require('discord.js')
const fetch = require('node-fetch')

/**
 * @param {Discord.Client} client
 * @param {import('../index').automemeOptions} options
 */

/**
 --- options ---
 
  chid => (Channel ID) String
  subReddits => Array (Custom SubReddit)
  interval => Number
  embedColor => HexColor
 */

async function automeme(client, options = []) {
	let ch = options.chid

	let sub = [
		'meme',
		'me_irl',
		'memes',
		'dankmeme',
		'dankmemes',
		'ComedyCemetery',
		'terriblefacebookmemes',
		'funny'
	]

	if (Array.isArray(options.subReddits)) {
		options.subReddits.forEach((subb) => {
			sub.push(subb)
		})
	} else if (!Array.isArray(options.subReddits)) {
		sub.push(options.subReddits)
	} else if (options.subReddits === undefined || !options.subReddits) {
	}

	const random = Math.floor(Math.random() * sub.length)

	let interv
	if (options.interval) {
		if (options.interval <= 60000)
			throw new Error(`Interval Time should be above 60000 (1 minute).`)
		interv = options.interval
	} else {
		interv = 120000
	}

	setInterval(() => {
		const channel = client.channels.cache.get(ch)
		if (!channel)
			throw new Error(
				"Invalid channel id has been provided (OR) I don't have permissions to View the Channel"
			)

		fetch(`https://www.reddit.com/r/${sub[random]}/random/.json`)
			.then((res) => res.json())
			.then((response) => {

				if(!response) return;
				if(!response[0].data) return;
				
				let perma = response[0].data.children[0].data.permalink
				let url = `https://reddit.com${perma}`
				let memeImage =
					response[0].data.children[0].data.url ||
					response[0].data.children[0].data.url_overridden_by_dest
				let title = response[0].data.children[0].data.title
				let upp = response[0].data.children[0].data.ups
				let ratio = response[0].data.children[0].data.upvote_ratio

				const embed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setURL(`${url}`)
					.setImage(memeImage)
					.setColor(options.embedColor || '#075FFF')
					.setFooter(`🔺 ${upp} | Upvote Ratio: ${ratio}`)
				channel.send({ embeds: [embed] })
			})
	}, interv)
}

module.exports = automeme
