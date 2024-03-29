import { ButtonStyle } from 'discord.js';

/**
 * ## toButtonStyle
 * ### Converts your old button style string to [ButtonStyle](https://discord-api-types.dev/api/discord-api-types-v10/enum/ButtonStyle)
 *
 * @param {string} style `string`
 * @returns {ButtonStyle} [`ButtonStyle`](https://discord-api-types.dev/api/discord-api-types-v10/enum/ButtonStyle)
 *
 * ---
 *
 * @link [`Documentation`](https://simplyd.js.org/docs/misc/toButtonStyle)
 * @example simplydjs.toButtonStyle("PRIMARY")
 */

export function toButtonStyle(style: string): ButtonStyle {
	// The style options are optional so if its undefined just don't care
	if (style == undefined) return;

	// The combination to find
	const combination = [
		{ key: 'PRIMARY', value: ButtonStyle.Primary },
		{ key: 'SECONDARY', value: ButtonStyle.Secondary },
		{ key: 'SUCCESS', value: ButtonStyle.Success },
		{ key: 'DANGER', value: ButtonStyle.Danger },
		{ key: 'LINK', value: ButtonStyle.Link }
	];

	// Using .find(callback) to get the combination
	const buttonstyle = combination.find((o) => o.key == style);

	// If it doesn't exist just return nothing
	if (Number(style) >= 1 && Number(style) <= 5) return Number(style);
	if (!buttonstyle || buttonstyle == undefined) return;

	return buttonstyle.value;
}
