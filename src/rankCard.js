const Discord = require('discord.js')
const { join } = require('path')

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {import('../index').rankCardOptions} options
 */

/**
 --- options ---
 
  member => GuildMember
  background => (Image URL) String
  color => HexColor
  rank => Number
  currentXP => Number
  level => Number
  neededXP => Number

  slash => Boolean
 */

async function rankCard(client, message, options = []) {
	try {
		const Canvas = require('canvas')
		const { registerFont } = require('canvas')
		registerFont(join(__dirname, 'Fonts', 'Poppins-SemiBold.ttf'), {
			family: 'Poppins-Regular'
		})
		registerFont(join(__dirname, 'Fonts', 'Poppins-SemiBold.ttf'), {
			family: 'Poppins-Bold'
		})

		function shortener(count) {
			const COUNT_ABBRS = ['', 'k', 'M', 'T']

			const i =
				0 === count ? count : Math.floor(Math.log(count) / Math.log(1000))
			let result = parseFloat((count / Math.pow(1000, i)).toFixed(2))
			result += `${COUNT_ABBRS[i]}`
			return result
		}

		const member =
			options.member || message.mentions.members.first()?.user || message.author
		const canvas = Canvas.createCanvas(1080, 400),
			ctx = canvas.getContext('2d')

		const name = member.tag
		const noSymbols = (string) => string.replace(/[\u007f-\uffff]/g, '')

		let BackgroundRadius = '20',
			BackGroundImg =
				options.background ||
				'https://media.discordapp.net/attachments/868506665102762034/876750913866461185/photo-1579546929518-9e396f3cc809.png?width=640&height=427',
			AttachmentName = 'rank.png',
			Username = noSymbols(name),
			AvatarRoundRadius = '50',
			DrawLayerColor = '#000000',
			DrawLayerOpacity = '0.4',
			BoxColor = options.color || '#096DD1',
			LevelBarFill = '#ffffff',
			LevelBarBackground = '#ffffff',
			Rank = options.rank,
			TextEXP = shortener(options.currentXP) + ' xp',
			LvlText = `Level ${shortener(options.level)}`,
			BarRadius = '20',
			TextXpNeded = '{current}/{needed}',
			CurrentXP = options.currentXP,
			NeededXP = options.neededXP

		ctx.beginPath()
		ctx.moveTo(0 + Number(BackgroundRadius), 0)
		ctx.lineTo(0 + 1080 - Number(BackgroundRadius), 0)
		ctx.quadraticCurveTo(0 + 1080, 0, 0 + 1080, 0 + Number(BackgroundRadius))
		ctx.lineTo(0 + 1080, 0 + 400 - Number(BackgroundRadius))
		ctx.quadraticCurveTo(
			0 + 1080,
			0 + 400,
			0 + 1080 - Number(BackgroundRadius),
			0 + 400
		)

		ctx.lineTo(0 + Number(BackgroundRadius), 0 + 400)
		ctx.quadraticCurveTo(0, 0 + 400, 0, 0 + 400 - Number(BackgroundRadius))
		ctx.lineTo(0, 0 + Number(BackgroundRadius))
		ctx.quadraticCurveTo(0, 0, 0 + Number(BackgroundRadius), 0)
		ctx.closePath()
		ctx.clip()
		ctx.fillStyle = '#000000'
		ctx.fillRect(0, 0, 1080, 400)
		let background = await Canvas.loadImage(BackGroundImg)
		ctx.globalAlpha = 0.7
		ctx.drawImage(background, 0, 0, 1080, 400)
		ctx.restore()

		ctx.fillStyle = DrawLayerColor
		ctx.globalAlpha = DrawLayerOpacity
		ctx.fillRect(40, 0, 240, canvas.height)
		ctx.globalAlpha = 1

		function RoundedBox(ctx, x, y, width, height, radius) {
			ctx.beginPath()
			ctx.moveTo(x + radius, y)
			ctx.lineTo(x + width - radius, y)
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
			ctx.lineTo(x + width, y + height - radius)
			ctx.quadraticCurveTo(
				x + width,
				y + height,
				x + width - radius,
				y + height
			)
			ctx.lineTo(x + radius, y + height)
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
			ctx.lineTo(x, y + radius)
			ctx.quadraticCurveTo(x, y, x + radius, y)
			ctx.closePath()
		}

		let avatar = await Canvas.loadImage(
			member.displayAvatarURL({ dynamic: true, format: 'png' })
		)
		ctx.save()
		RoundedBox(ctx, 40 + 30, 30, 180, 180, Number(AvatarRoundRadius))
		ctx.strokeStyle = BoxColor
		ctx.lineWidth = '10'
		ctx.stroke()
		ctx.clip()
		ctx.drawImage(avatar, 40 + 30, 30, 180, 180)
		ctx.restore()

		ctx.save()
		RoundedBox(ctx, 40 + 30, 30 + 180 + 30 + 50 + 30, 180, 50, 20)
		ctx.strokeStyle = '#BFC85A22'
		ctx.stroke()
		ctx.clip()
		ctx.fillStyle = BoxColor
		ctx.globalAlpha = '1'
		ctx.fillRect(40 + 30, 30 + 180 + 30 + 50 + 30, 180, 50)
		ctx.globalAlpha = 1
		ctx.fillStyle = '#ffffff'
		ctx.font = '32px "Poppins-Bold"'
		ctx.textAlign = 'center'
		ctx.fillText(TextEXP, 40 + 30 + 180 / 2, 30 + 180 + 30 + 30 + 50 + 38)
		ctx.restore()

		ctx.save()
		RoundedBox(ctx, 40 + 30, 30 + 180 + 30, 180, 50, 20)
		ctx.strokeStyle = '#BFC85A22'
		ctx.stroke()
		ctx.clip()
		ctx.fillStyle = BoxColor
		ctx.globalAlpha = '1'
		ctx.fillRect(40 + 30, 30 + 180 + 30, 180, 50, 50)
		ctx.globalAlpha = 1
		ctx.fillStyle = '#ffffff'
		ctx.font = '32px "Poppins-Bold"'
		ctx.textAlign = 'center'
		ctx.fillText(LvlText, 40 + 30 + 180 / 2, 30 + 180 + 30 + 38)
		ctx.restore()

		ctx.save()
		ctx.textAlign = 'left'
		ctx.fillStyle = '#ffffff'
		ctx.shadowColor = '#000000'
		ctx.shadowBlur = 15
		ctx.shadowOffsetX = 1
		ctx.shadowOffsetY = 1
		ctx.font = '39px "Poppins-Bold"'
		ctx.fillText(Username, 390, 80)
		ctx.restore()

		ctx.save()
		ctx.textAlign = 'right'
		ctx.fillStyle = '#ffffff'
		ctx.shadowColor = '#000000'
		ctx.shadowBlur = 15
		ctx.shadowOffsetX = 1
		ctx.shadowOffsetY = 1
		ctx.font = '55px "Poppins-Bold"'
		ctx.fillText('#' + Rank, canvas.width - 50 - 5, 80)
		ctx.restore()

		ctx.save()
		RoundedBox(ctx, 390, 305, 660, 70, Number(20))
		ctx.strokeStyle = '#BFC85A22'
		ctx.stroke()
		ctx.clip()
		ctx.fillStyle = '#ffffff'
		ctx.font = '45px "Poppins-Bold"'
		ctx.fillText(message.guild.name, 75 + 450, 355)
		ctx.globalAlpha = '0.2'
		ctx.fillRect(390, 305, 660, 70)
		ctx.restore()

		ctx.save()
		RoundedBox(ctx, 390, 145, 660, 50, Number(BarRadius))
		ctx.strokeStyle = '#BFC85A22'
		ctx.stroke()
		ctx.clip()
		ctx.fillStyle = LevelBarBackground
		ctx.globalAlpha = '0.2'
		ctx.fillRect(390, 145, 660, 50, 50)
		ctx.restore()

		const percent = (100 * CurrentXP) / NeededXP
		const progress = (percent * 660) / 100

		ctx.save()
		RoundedBox(ctx, 390, 145, progress, 50, Number(BarRadius))
		ctx.strokeStyle = '#BFC85A22'
		ctx.stroke()
		ctx.clip()
		ctx.fillStyle = LevelBarFill
		ctx.globalAlpha = '0.5'
		ctx.fillRect(390, 145, progress, 50, 50)
		ctx.restore()

		ctx.save()
		ctx.textAlign = 'left'
		ctx.fillStyle = '#ffffff'
		ctx.globalAlpha = '0.8'
		ctx.font = '30px "Poppins-Bold"'
		ctx.fillText('Next Level: ' + shortener(NeededXP) + ' xp', 390, 230)
		ctx.restore()

		const latestXP = Number(CurrentXP) - Number(NeededXP)
		const textXPEdited = TextXpNeded.replace(/{needed}/g, shortener(NeededXP))
			.replace(/{current}/g, shortener(CurrentXP))
			.replace(/{latest}/g, latestXP)
		ctx.textAlign = 'center'
		ctx.fillStyle = '#474747'
		ctx.globalAlpha = 1
		ctx.font = '30px "Poppins-Bold"'
		ctx.fillText(textXPEdited, 730, 180)

		if (options.slash === true) {
			const attachment = new Discord.MessageAttachment(
				canvas.toBuffer(),
				AttachmentName
			)

			message.followUp({ files: [attachment], ephemeral: true })
		} else if (!options.slash || options.slash === false) {
			const attachment = new Discord.MessageAttachment(
				canvas.toBuffer(),
				AttachmentName
			)

			message.channel.send({ files: [attachment] })
		}
	} catch (err) {
		console.log(`Error Occured. | rankCard | Error: ${err.stack}`)
	}
}

module.exports = rankCard
