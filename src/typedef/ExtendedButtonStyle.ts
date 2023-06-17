import { ButtonStyle } from 'discord.js';

/**
 * @returns {ExtendedButtonStyle}
 */

export type ExtendedButtonStyle =
	| ButtonStyle
	| 'PRIMARY'
	| 'SECONDARY'
	| 'SUCCESS'
	| 'DANGER'
	| 'LINK';
