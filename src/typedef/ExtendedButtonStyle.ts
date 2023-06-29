import { ButtonStyle } from 'discord.js';

/**
 * @typedef {ExtendedButtonStyle}
 */

export type ExtendedButtonStyle =
	| ButtonStyle
	| 'PRIMARY'
	| 'SECONDARY'
	| 'SUCCESS'
	| 'DANGER'
	| 'LINK';
