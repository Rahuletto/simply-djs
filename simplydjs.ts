// ------------------------------
// -------- E R R O R S ---------
// ------------------------------

import { resolve } from 'path'
import { Erroptions, SimplyError } from './src/Error/Error'

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

/**
 * Emit Errors like Simply DJS does
 * @example simplydjs.emitError({ name: "Test", tip: "This is just to test" })
 */

export async function emitError(
	options: Erroptions = {
		tip: 'Join the Support Server [https://discord.gg/3JzDV9T5Fn]'
	}
) {
	throw new SimplyError(options)
}

/**
 * Convert **Hex string** to **RGB** Value. `(Used for Discord.js v14)`
 * @example simplydjs.toRgb('#075FFF')
 */
export function toRgb(
	hex: string,
	type: 'Array' | 'String' = 'Array'
): number[] | string {
	let red = parseInt(hex.slice(1, 3), 16)
	let green = parseInt(hex.slice(3, 4), 16)
	let blue = parseInt(hex.slice(5, 7), 16)
	if (type === 'Array') return [red, green, blue]
	else if (type === 'String') return `rgb(${red}, ${green}, ${blue})`
}
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
export { ticketSystem } from './src/ticketSystem'

// ------------------------------
// ----------- F U N ------------
// ------------------------------

export { tictactoe } from './src/tictactoe'
export { calculator } from './src/calc'
export { embedCreate } from './src/embed'
