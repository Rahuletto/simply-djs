import { Client, MessageEmbed, TextChannel, Message } from 'discord.js'

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
	content?: string
	embed?: TypeEmbed
	toggle?: boolean
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * An reliable bump remainder for **Disboard**
 * @param client
 * @param message
 * @param options
 * @example simplydjs.bumpSystem(client, message)
 */

export async function bumpSystem(
	client: Client,
	message: Message | bumpOptions,
	options: bumpOptions = {}
): Promise<boolean> {
	try {
		if (!options.toggle) return
		let bumpo = new MessageEmbed()
			.setTitle('Its time to Bump !')
			.setDescription(
				'Its been 2 hours since last bump. Could someone please bump the server again ?'
			)
			.setTimestamp()
			.setColor('#075FFF')
			.setFooter({ text: 'Do /bump to bump the server ;)' })

		let bumpoo = new MessageEmbed()

		if (options && (message as Message).channel) {
			return new Promise(async (resolve, reject) => {
				if ((message as Message).author.id === '302050872383242240') {
					let chid = (message as Message).channel.id
					let guild = (message as Message).guild.id

					options.embed = {
						bumpEmb: options.embed?.bumpEmb || bumpo,
						thankEmb: options.embed?.thankEmb || bumpoo
					}

					if (
						(message as Message).embeds[0] &&
						(message as Message).embeds[0].description &&
						(message as Message).embeds[0].description.includes('Bump done')
					) {
						let usew: string[] | string = (
							message as Message
						).embeds[0].description.split(/ +/g)

						usew = usew[0]
						usew = usew.replace('<@', '').replace('>', '')

						let timeout = 7200000
						let time = Date.now() + timeout

						let data = await db.findOne({
							guild: guild
						})

						if (!data) {
							data = new db({
								counts: [],
								guild: guild,
								channel: chid,
								nxtBump: undefined
							})
							await data.save().catch(() => {})
						}

						let rl = data.counts.find((a) => a.user === usew)

						data.nxtBump = time
						data.channel = chid
						await data.save().catch(() => {})

						await (message as Message).channel.send({
							content: options.content || '\u200b',
							embeds: [options.embed?.thankEmb || bumpoo]
						})

						resolve(true)
					}
				}
			})
		} else if (
			(!options && (message as bumpOptions)) ||
			(!options && !message)
		) {
			return new Promise(async (resolve, reject) => {
				setInterval(async () => {
					let data = await db.find({
						nxtBump: Date.now()
					})

					data.forEach(async (dt) => {
						if (dt.nxtBump && dt.nxtBump < Date.now()) {
							dt.nxtBump = undefined
							await dt.save().catch(() => {})

							let cho = await client.channels.fetch(dt.channel, {
								force: true
							})

							await (cho as TextChannel).send({
								content: message.content || '\u200b',
								embeds: [(message as bumpOptions).embed?.bumpEmb || bumpo]
							})

							resolve(true)
						} else return
					})
				}, 10000)
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
