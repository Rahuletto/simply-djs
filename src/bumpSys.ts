import {
	Client,
	MessageEmbed,
	ColorResolvable,
	TextChannel,
	Message,
	CommandInteraction
} from 'discord.js'

import chalk from 'chalk'
import db from './model/bumpSys'

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

interface TypeEmbed {
	thankEmb?: MessageEmbed
	bumpEmb?: MessageEmbed
}

export type bumpOptions = {
	channelId?: string[] | string
	content?: string
	embed?: TypeEmbed
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

export async function bumpSys(
	client: Client,
	message: Message | bumpOptions,
	options: bumpOptions = {}
): Promise<boolean> {
	try {
		const bumpo = new MessageEmbed()
			.setTitle('Its Bump Time !')
			.setDescription(
				'Its been 2 hours since last bump. Could someone please bump the server again ?'
			)
			.setTimestamp()
			.setColor('#075FFF')
			.setFooter({ text: 'Do !d bump to bump the server ;)' })

		const bumpoo = new MessageEmbed()
			.setTitle('Thank you')
			.setDescription(
				'Thank you for bumping the server. Your support means a lot. Will notify you after 2 hours'
			)
			.setTimestamp()
			.setColor('#06bf00')
			.setFooter({ text: 'Now its time to wait for 120 minutes. (2 hours)' })

		let chid: string[] = []

		if (options && (message as Message).channel) {
			return new Promise(async (resolve, reject) => {
				if (Array.isArray(options.channelId)) {
					chid = options.channelId
				} else if (!Array.isArray(options.channelId)) {
					chid.push(options.channelId)
				}

				if (!options.embed) {
					options.embed = {
						bumpEmb: bumpo,
						thankEmb: bumpoo
					}
				}

				if ((message as Message).author.id === '302050872383242240') {
					for (let i = 0; i < chid.length; i++) {
						if ((message as Message).channel.id === chid[i]) {
							if (
								(message as Message).embeds[0] &&
								(message as Message).embeds[0].description &&
								(message as Message).embeds[0].description.includes('Bump done')
							) {
								let timeout = 7200000
								let time = Date.now() + timeout

								let data = await db.findOne({
									channel: options.channelId[i]
								})
								if (!data) {
									data = new db({
										channel: options.channelId[i],
										nxtBump: undefined
									})
									await data.save().catch(() => {})
								}

								data.nxtBump = time
								await data.save().catch(() => {})

								await (message as Message).channel.send({
									content: options.content || '\u200b',
									embeds: [options.embed?.thankEmb || bumpoo]
								})

								resolve(true)
							}
						}
					}
				}
			})
		} else if (!options && message.channelId) {
			return new Promise(async (resolve, reject) => {
				if (Array.isArray(message.channelId)) {
					chid = message.channelId
				} else if (!Array.isArray(message.channelId)) {
					chid.push(message.channelId)
				}
				setInterval(async () => {
					for (let i = 0; i < chid.length; i++) {
						let data = await db.findOne({
							channel: chid[i]
						})
						if (!data) {
							data = new db({
								channel: chid[i],
								nxtBump: undefined
							})
							await data.save().catch(() => {})
						}

						let time = data.nxtBump

						if (time && time !== undefined && Date.now() > time) {
							data.nxtBump = undefined

							await data.save().catch(() => {})

							let cho = await client.channels.fetch(chid[i], {
								cache: true
							})

							await (cho as TextChannel).send({
								content: message.content || '\u200b',
								embeds: [(message as bumpOptions).embed?.bumpEmb || bumpo]
							})

							resolve(true)
						} else return
					}
				}, 5000)
			})
		}
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta(
				'bumpSystem'
			)} | Error: ${err.stack}`
		)
	}
}

module.exports = bumpSys
