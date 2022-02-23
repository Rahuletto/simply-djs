import {
	Client,
	MessageEmbed,
	MessageEmbedAuthor,
	ColorResolvable,
	TextChannel
} from 'discord.js'

import axios from 'axios'
import SimplyError from './Error/Error'
import chalk from 'chalk'

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

interface CustomEmbed {
	author?: MessageEmbedAuthor
	description?: string
	color?: ColorResolvable
}

export type memeOptions = {
	embed?: CustomEmbed
	channelId: string
	interval?: number
	sub?: string[] | string
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

export async function automeme(
	client: Client,
	options: memeOptions = { channelId: '' }
): Promise<void> {
	try {
		let ch = options.channelId

		if (ch === '') throw new SimplyError('Provide a Channel ID')

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

		if (Array.isArray(options.sub)) {
			options.sub.forEach((subb) => {
				sub.push(subb)
			})
		} else if (!Array.isArray(options.sub)) {
			sub.push(options.sub)
		}

		if (!options.embed) {
			options.embed = {
				color: '#075FFF'
			}
		}

		let random = Math.floor(Math.random() * sub.length)

		let interv
		if (options.interval) {
			if (options.interval <= 60000)
				throw new SimplyError(
					`Interval Time should be above 60000 (1 minute).`,
					'Interval should not be less than 60000'
				)
			interv = options.interval
		} else {
			interv = 240000
		}

		setInterval(async () => {
			let channel = await client.channels.fetch(ch, {
				cache: true
			})

			if (!channel)
				throw new SimplyError(
					"Invalid channel id has been provided (OR) I don't have permissions to View the Channel",
					'Check my permissions (or) Try using other Channel ID'
				)

			let response = await axios
				.get(`https://www.reddit.com/r/${sub[random]}/random/.json`)
				.then((res) => res.data)

			if (!response) return
			if (!response[0].data) return

			if (response[0].data.children[0].data.over_18 === true) return

			let perma = response[0].data.children[0].data.permalink
			let url = `https://reddit.com${perma}`
			let memeImage =
				response[0].data.children[0].data.url ||
				response[0].data.children[0].data.url_overridden_by_dest
			let title = response[0].data.children[0].data.title
			let upp = response[0].data.children[0].data.ups
			let ratio = response[0].data.children[0].data.upvote_ratio

			const embed = new MessageEmbed()
				.setTitle(`${title}`)
				.setURL(`${url}`)
				.setImage(memeImage)
				.setColor(options.embed?.color || '#075FFF')
				.setFooter({ text: `🔺 ${upp} | Upvote Ratio: ${ratio}` })

			if (options.embed.author) {
				embed.setAuthor(options.embed.author)
			}
			if (options.embed.description) {
				embed.setDescription(options.embed.description)
			}

			await (channel as TextChannel).send({ embeds: [embed] })
		}, interv)
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta('automeme')} | Error: ${
				err.stack
			}`
		)
	}
}
