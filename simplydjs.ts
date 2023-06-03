// ------------------------------
// -------- E R R O R S ---------
// ------------------------------

import { SimplyError } from './src/error';

// Get the node version
if (+process.version.slice(1, 3) - 0 < 16)
	throw new SimplyError({
		function: 'simply-djs [CORE]',
		title: `NodeJS Version 16 or newer is required, but you are using ${process.version}.`,
		tip: `Install nodejs 16 or higher in https://nodejs.org/`
	});

try {
	require('discord.js');
} catch (e) {
	// Emit a warning if there is no discord.js
	process.emitWarning(
		new SimplyError({
			function: 'simply-djs [CORE]',
			title: 'Discord.JS is required for this package to run',
			tip: 'This package is optimized to run with discord.js'
		})
	);
}

const { version: discordJSVersion } = require(require('path').join(
	require.resolve('discord.js'),
	'..',
	'..',
	'package.json'
));

// Get Discord.JS version using their package.json

if (Number(discordJSVersion.slice(0, 2)) < 14)
	throw new SimplyError({
		function: 'simply-djs [CORE]',
		title: `Discord.JS version 14.x.x is required, but you are using ${discordJSVersion}. See https://www.npmjs.com/package/discord.js`,
		tip: 'This package is not optimized for Discord.JS v13 or lower. Please use simply-djs v3.0.2 for Discord.JS v13 support'
	});

// ------------------------------
// ------- E X P O R T S --------
// ------------------------------

export const version: string = '4.0.0-beta-3';

export * from './src/misc';
export * from './src/typedef';

export * from './src/meme';
export * from './src/betterBtnRole';
export * from './src/btnRole';
export * from './src/bumpReminder';
export * from './src/calculator';
export * from './src/connect';
export * from './src/chatbot';
export * from './src/embedCreator';
export * from './src/buttonPages';
export * from './src/ghostPing';
export * from './src/giveaway';
export * from './src/menuPages';
export * from './src/rps';
export * from './src/starboard';
export * from './src/suggest';
export * from './src/ticketSetup';
export * from './src/tictactoe';

// ------------------------------
// ------ H A N D L E R S -------
// ------------------------------

export * from './src/handler/manageBtnRole';
export * from './src/handler/manageGiveaway';
export * from './src/handler/manageTicket';
export * from './src/handler/manageSuggest';

// ------------------------------
// ---- D E P R E C A T E D -----
// ------------------------------

export * from './src/deprecated/DEP-stealEmoji';
export * from './src/deprecated/DEP-bumpSystem';
export * from './src/deprecated/DEP-embedPages';
export * from './src/deprecated/DEP-ticketSystem';
export * from './src/deprecated/DEP-suggestSystem';
export * from './src/deprecated/DEP-embedCreate';
export * from './src/deprecated/DEP-giveawaySystem';
export * from './src/deprecated/DEP-manageBtn';
export * from './src/deprecated/DEP-manageSug';
export * from './src/deprecated/DEP-nqn';
