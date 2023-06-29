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

export const version: string = '4.1.0';

export {
	https,
	ms,
	disableButtons,
	emitError,
	toButtonStyle,
	toRgb
} from './src/misc';
export {
	CustomizableButton,
	CustomizableEmbed,
	ExtendedButtonStyle,
	ExtendedInteraction,
	ExtendedMessage
} from './src/typedef';

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
export { giveaway } from './src/giveaway';
export { menuPages } from './src/menuPages';
export { rps } from './src/rps';
export { starboard } from './src/starboard';
export { suggest } from './src/suggest';
export { ticketSetup } from './src/ticketSetup';
export { tictactoe } from './src/tictactoe';

// ------------------------------
// ------ H A N D L E R S -------
// ------------------------------

export { manageBtnRole } from './src/handler/manageBtnRole';
export { manageGiveaway } from './src/handler/manageGiveaway';
export { manageTicket } from './src/handler/manageTicket';
export { manageSuggest } from './src/handler/manageSuggest';

// ------------------------------
// ---- D E P R E C A T E D -----
// ------------------------------

export { automeme } from './src/deprecated/DEP-automeme';
export { bumpSystem } from './src/deprecated/DEP-bumpSystem';
export { embedCreate } from './src/deprecated/DEP-embedCreate';
export { embedPages } from './src/deprecated/DEP-embedPages';
export { giveawaySystem } from './src/deprecated/DEP-giveawaySystem';
export { manageBtn } from './src/deprecated/DEP-manageBtn';
export { manageSug } from './src/deprecated/DEP-manageSug';
export { nqn } from './src/deprecated/DEP-nqn';
export { stealEmoji } from './src/deprecated/DEP-stealEmoji';
export { suggestSystem } from './src/deprecated/DEP-suggestSystem';
export { ticketSystem } from './src/deprecated/DEP-ticketSystem';
