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
export const version: string = '3.0.0'
export { SimplyError } from './src/Error/Error'

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
export { clickBtn } from './src/clickBtn'
export { giveawaySystem } from './src/giveaway'
export { bumpSystem } from './src/bumpSys'

// ------------------------------
// ----------- F U N ------------
// ------------------------------

export { tictactoe } from './src/tictactoe'
export { calculator } from './src/calc'
export { embedCreate } from './src/embed'
