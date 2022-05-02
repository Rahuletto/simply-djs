/**
 * Transforms Hex code into RGB Array (or) RGB String. This makes it easy to convert from discord.js v13 to v14.
 * @param hex
 * @param type
 * @link `Documentation:` ***https://simplyd.js.org/docs/Others/toRgb***
 * @example simplydjs.toRgb('#075FFF')
 */

export function toRgb(
	hex: string,
	type: 'Array' | 'String' = 'Array'
): number[] | string {
	let red = parseInt(hex.slice(1, 3), 16);
	let green = parseInt(hex.slice(3, 4), 16);
	let blue = parseInt(hex.slice(5, 7), 16);
	if (type === 'Array') return [red, green, blue];
	else if (type === 'String') return `rgb(${red}, ${green}, ${blue})`;
}
