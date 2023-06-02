import { errOptions, SimplyError } from '../error/SimplyError';

/**
 * Produce error messages just like Simply DJS
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/misc/emitError
 * @example simplydjs.emitError({ function: "messageCreate", tip: "Error in message event" })
 */

export async function emitError(
	options: errOptions = {
		tip: 'Get ya help here -> [https://discord.gg/3JzDV9T5Fn]'
	}
) {
	// Just throws the SimplyError
	throw new SimplyError(options);
}
