const Discord = require('discord.js')
const LINK = 'https://i.pinimg.com/originals/78/3d/4f/783d4f34998ae3b3b576e400db0d81df.gif'

async function rr(message) {
  if (message.author.bot) return

  message.channel.send(LINK)
}

module.exports = rickroll
