import { ButtonStyle } from 'discord.js';

/**
 * An object to convert legacy button styles (string) to ButtonStyle counterparts for v14
 */

export const styleObj = {
	PRIMARY: ButtonStyle.Primary,
	SECONDARY: ButtonStyle.Secondary,
	SUCCESS: ButtonStyle.Success,
	DANGER: ButtonStyle.Danger,
	LINK: ButtonStyle.Link
};

/**
 * Type for Legacy button styles used in discord.js v13
 */

export type LegacyStyles =
	| 'LINK'
	| 'PRIMARY'
	| 'SECONDARY'
	| 'SUCCESS'
	| 'DANGER';
