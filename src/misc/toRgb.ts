import { ColorResolvable } from 'discord.js';

/**
 * ## toRgb
 * ### Transforms Hex code into RGB Array (or) RGB String. This makes it easy to convert from discord.js v13 to v14.
 *
 * @export
 * @param {string} hex `string`
 * @returns {ColorResolvable} [`ColorResolvable`](https://discord.js.org/#/docs/discord.js/stable/typedef/ColorResolvable)
 *
 * ---
 *
 * @link [`Documentation`](https://simplyd.js.org/docs/misc/toRgb)
 * @example simplydjs.toRgb('#406DBC')
 *
 */

export function toRgb(hex: string): ColorResolvable {
	// splits it and parses integers
	const red = parseInt(hex.slice(1, 3), 16);
	const green = parseInt(hex.slice(3, 5), 16);
	const blue = parseInt(hex.slice(5, 7), 16);

	return [red, green, blue];
}
