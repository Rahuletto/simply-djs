// ------------------------------
// -------- E R R O R S ---------
// ------------------------------

if (+process.version.slice(1, 3) - 0 < 16)
	throw new Error(
		`NodeJS Version 16 or newer is required, but you are using ${process.version}. See https://nodejs.org/`
	)

try {
	require('discord.js')
} catch (e) {
	throw new Error('Discord.JS is required for this package to run')
}

const { version: discordJSVersion } = require(require('path').join(
	require.resolve('discord.js'),
	'..',
	'..',
	'package.json'
))

if (discordJSVersion.slice(0, 2) !== '13')
	throw new Error(
		`Discord.JS version 13 is required, but you are using ${discordJSVersion}. See https://www.npmjs.com/package/discord.js`
	)

// ------------------------------
// ------- E X P O R T S --------
// ------------------------------
export let version = '3.0.0'

// ------------------------------
// ------- G E N E R A L --------
// ------------------------------

export { connect } from './src/connect'
export { ghostPing } from './src/ghostPing'
export { embedPages } from './src/embedPages'
export { chatbot } from './src/chatbot'
export { automeme } from './src/automeme'

// ------------------------------
// ------- S Y S T E M S --------
// ------------------------------

export { betterBtnRole } from './src/betterBtnRole'
export { btnRole } from './src/btnrole'
export { manageBtn } from './src/manageBtn'
export { giveawaySystem } from './src/giveaway'
export { bumpSystem } from './src/bumpSys'

// ------------------------------
// ----------- F U N ------------
// ------------------------------

export { calculator } from './src/calc'
export { embedCreate } from './src/embed'

/*
module.exports.embedPages = require('./src/embedPages')

module.exports.calculator = require('./src/calc')

module.exports.rankCard = require('./src/rankCard')

module.exports.automeme = require('./src/automeme')

module.exports.stealEmoji = require('./src/stealEmoji')

module.exports.stealSticker = require('./src/stealSticker')

module.exports.menuPages = require('./src/menuEmbed')

module.exports.dropdownPages = require('./src/menuEmbed')

module.exports.nqn = require('./src/nqn')

// Games (Fun)
module.exports.tictactoe = require('./src/tictactoe')

module.exports.rps = require('./src/rps')

module.exports.chatbot = require('./src/chatbot')
// Systems
module.exports.ticketSystem = require('./src/ticketSystem')
module.exports.clickBtn = require('./src/clickBtn')

module.exports.embedCreate = require('./src/embed')

module.exports.modmail = require('./src/modmail')

module.exports.suggestSystem = require('./src/suggestSystem')
module.exports.suggestBtn = require('./src/suggestBtn')

module.exports.btnrole = require('./src/btnrole')

module.exports.betterBtnRole = require('./src/betterBtnRole')

module.exports.starboard = require('./src/starboard')

module.exports.bumpSystem = require('./src/bumpSys')

module.exports.giveawaySystem = require('./src/giveaway')
*/
