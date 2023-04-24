import { errOptions, SimplyError } from '../Error/Error';

/**
 * Produce error messages just like Simply DJS
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Others/emitError***
 * @example simplydjs.emitError({ function: "messageCreate", tip: "Error in message event" })
 */

export async function emitError(
	options: errOptions = {
		tip: 'Get ya help here -> [https://discord.gg/3JzDV9T5Fn]'
	}
) {
	throw new SimplyError(options);
}
