// ------------------------------
// -------- E R R O R S ---------
// ------------------------------

import { SimplyError } from './src/Error/Error';

if (+process.version.slice(1, 3) - 0 < 17)
	throw new SimplyError({
		function: 'simply-djs [CORE]',
		title: `NodeJS Version 17 or newer is required, but you are using ${process.version}.`,
		tip: `Install nodejs 17 or higher in https://nodejs.org/`
	});

try {
	require('discord.js');
} catch (e) {
	throw new SimplyError({
		function: 'simply-djs [CORE]',
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
		function: 'simply-djs [CORE]',
		title: `Discord.JS version 14.x.x is required, but you are using ${discordJSVersion}. See https://www.npmjs.com/package/discord.js`,
		tip: 'This package is not optimized for Discord.JS v13 or lower. Please use simply-djs v3.0.2 for Discord.JS v13 support'
	});

// ------------------------------
// ------- E X P O R T S --------
// ------------------------------

export const version: string = '4.0.0';

export { https } from './src/Others/https';
export { toRgb } from './src/Others/toRgb';
export { MessageButtonStyle } from './src/Others/MessageButtonStyle';
export { emitError } from './src/Others/emitError';
export { ms } from './src/Others/ms';

export { meme } from './src/meme';
export { betterBtnRole } from './src/betterBtnRole';
export { btnRole } from './src/btnRole';
export { bumpReminder } from './src/bumpReminder';
export { calculator } from './src/calculator';
export { connect } from './src/connect';
export { chatbot } from './src/chatbot';
export { embedCreator } from './src/embedCreator';
export { buttonPages } from './src/buttonPages';
export { ghostPing } from './src/ghostPing';
export { giveawaySystem } from './src/giveaway';
export { menuPages } from './src/menuPages';
export { nqn } from './src/nqn';
export { rps } from './src/rps';
export { starboard } from './src/starboard';
export { stealEmoji } from './src/DEP-stealEmoji';
export { suggest } from './src/suggest';
export { ticketSetup } from './src/ticketSetup';
export { tictactoe } from './src/tictactoe';

// ------------------------------
// ------- S Y S T E M S --------
// ------------------------------

export { manageBtnRole } from './src/manageBtnRole';
export { manageGiveaway } from './src/manageGiveaway';
export { manageTicket } from './src/manageTicket';
export { manageSuggest } from './src/manageSuggest';

// ------------------------------
// ---- D E P R E C A T E D -----
// ------------------------------

export { bumpSystem } from './src/DEP-bumpSystem';
export { embedPages } from './src/DEP-embedPages';
export { ticketSystem } from './src/DEP-ticketSystem';
export { suggestSystem } from './src/DEP-suggestSystem';
export { embedCreate } from './src/DEP-embedCreate';
