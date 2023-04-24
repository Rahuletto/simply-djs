// ------------------------------
// -------- E R R O R S ---------
// ------------------------------

import { SimplyError } from './src/Error/Error';

if (+process.version.slice(1, 3) - 0 < 16)
	throw new SimplyError({
		function: 'simply-djs',
		title: `NodeJS Version 16 or newer is required, but you are using ${process.version}.`,
		tip: `Install nodejs 16 or higher in https://nodejs.org/`
	});

try {
	require('discord.js');
} catch (e) {
	throw new SimplyError({
		function: 'simply-djs',
		title: 'Discord.JS is required for this package to run',
		tip: 'This package is optimized to run with discord.js'
	});
}

const { version: discordJSVersion } = require(require('path').join(
	require.resolve('discord.js'),
	'..',
	'..',
	'package.json'
));

if (Number(discordJSVersion.slice(0, 2)) < 14)
	throw new SimplyError({
		function: 'simply-djs',
		title: `Discord.JS version 14.x.x is required, but you are using ${discordJSVersion}. See https://www.npmjs.com/package/discord.js`,
		tip: 'This package is not optimized for Discord.JS v13 or lower. Please use simply-djs v3.0.2 for Discord.JS v13 support'
	});

// ------------------------------
// ------- E X P O R T S --------
// ------------------------------

export const version: string = '3.1.0';

export { toRgb } from './src/Others/toRgb';
export { emitError } from './src/Others/emitError';
export { ms } from './src/Others/ms';

export { meme } from './src/meme';
export { betterBtnRole } from './src/betterBtnRole';
export { btnRole } from './src/btnrole';
export { bumpSystem } from './src/bumpSys';
export { calculator } from './src/calc';
export { connect } from './src/connect';
export { clickBtn } from './src/clickBtn';
export { chatbot } from './src/chatbot';
export { embedCreate } from './src/embed';
export { embedPages } from './src/embedPages';
export { ghostPing } from './src/ghostPing';
export { giveawaySystem } from './src/giveaway';
export { manageBtn } from './src/manageBtn';
export { manageSug } from './src/manageSug';
export { menuPages } from './src/menuPages';
export { nqn } from './src/nqn';
export { rps } from './src/rps';
export { starboard } from './src/starboard';
export { stealEmoji } from './src/stealEmoji';
export { suggestSystem } from './src/suggest';
export { suggestBtn } from './src/suggestBtn';
export { ticketSystem } from './src/ticketSystem';
export { tictactoe } from './src/tictactoe';
