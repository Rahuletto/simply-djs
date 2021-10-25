const Discord = require('discord.js')

/**
 * @param {Discord.Client} client
 * @param {import('../index').DB} db
 * @param {import('../index').bumpSystemOptions} options
 */

/**
 --- options ---
 
event => (ready/messageCreate) String
message => Message
chid => (Channel ID) String
content => String
thanksEmbed => Embed
bumpEmbed => Embed
 */

async function bumpSys(client, db, options = []) {
	try {
		if (options.event === 'messageCreate') {
			let message = options.message
			if (message.author.id === '302050872383242240') {
				for (let i = 0; i < options.chid.length; i++) {
					if (message.channel.id === options.chid[i]) {
						if (
							message.embeds[0] &&
							message.embeds[0].description &&
							message.embeds[0].description.includes('Bump done')
						) {
							let timeout = 7200000
							let time = Date.now() + timeout

							let setTime = db.set('bumper-' + message.channel.id, time)

							const bumpoo = new Discord.MessageEmbed()
								.setTitle('Thank you')
								.setDescription(
									'Thank you for bumping the server. Your support means a lot. Will notify you after 2 hours'
								)
								.setTimestamp()
								.setColor('#06bf00')
								.setFooter('Now its time to wait for 120 minutes. (2 hours)')

							message.channel.send({
								content: options.content || '\u200b',
								embeds: [options.thanksEmbed || bumpoo]
							})
						}
					}
				}
			}
		} else if (options.event === 'ready') {
			setInterval(async () => {
				for (let i = 0; i < options.chid.length; i++) {
					let time = await db.fetch('bumper-' + options.chid[i])

					if (time && time !== 'hi' && Date.now() > time) {
						db.set('bumper-' + options.chid[i], 'hi')

						let cho = client.channels.cache.get(options.chid[i])

						const bumpo = new Discord.MessageEmbed()
							.setTitle('Its Bump Time !')
							.setDescription(
								'Its been 2 hours since last bump. Could someone please bump the server again ?'
							)
							.setTimestamp()
							.setColor('#075FFF')
							.setFooter('Do !d bump to bump the server')

						cho.send({
							content: options.content || '\u200b',
							embeds: [options.bumpEmbed || bumpo]
						})
					} else return
				}
			}, 5000)
		} else throw new Error('Unknown Event.. Please provide me a valid event..')
	} catch (err) {
		console.log(`Error Occured. | bumpSystem | Error: ${err.stack}`)
	}
}

module.exports = bumpSys
