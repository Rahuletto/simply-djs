const Discord = require('discord.js')

/**
 * @param {Discord.Message} message
 * @param {import('../index').ghostPingOptions} options
 */

/**
 --- options ---
 
  credit => Boolean
  embedFoot => String
  embedDesc => String
  embedColor => HexColor
  embed => Embed
  logChannel => (Channel ID) String
 */

async function ghostPing(message, options = []) {
	if (message.mentions.users.first()) {
		if (options.credit === false) {
			foot = options.embedFoot || 'Ghost Ping. Oop.'
		} else {
			foot = '©️ Simply Develop. npm i simply-djs'
		}
		try {
			if (message.author.bot) return

			if (message.content.includes(`<@${message.mentions.users.first().id}>`)) {
				const chembed = new Discord.MessageEmbed()
					.setTitle('Ghost Ping Detected')
					.setDescription(
						options.embedDesc ||
							`I Found that ${message.author} **(${
								message.author.tag
							})** just ghost pinged ${message.mentions.members.first()} **(${
								message.mentions.users.first().tag
							})**\n\nContent: **${message.content}**`
					)
					.setColor(options.embedColor || 0x075fff)
					.setFooter(foot)
					.setTimestamp()

				message.channel
					.send({ embeds: [options.embed || chembed] })
					.then(async (msg) => {
						if (options.logChannel) {
							let ch = message.guild.channels.cache
								.get(options.logChannel)
								.catch(() => {})

							ch.send({ embeds: [options.embed || chembed] })
						}
						setTimeout(() => {
							msg.delete()
						}, 10000)
					})
			}
		} catch (err) {
			console.log(`Error Occured. | ghostPing | Error: ${err.stack}`)
		}
	}
}
module.exports = ghostPing
