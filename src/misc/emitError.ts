import { errOptions, SimplyError } from '../error/SimplyError';

/**
 * ## emitError
 * ### Produce error messages just like Simply DJS
 *
 * @async
 * @param {errOptions} options [`errOptions`](https://simplyd.js.org/docs/misc/emiterror#erroptions)
 * @returns {Promise<void>} `void`
 *
 * ---
 *
 * @link [`Documentation`](https://simplyd.js.org/docs/misc/emitError)
 * @example simplydjs.emitError({ function: "messageCreate", tip: "Error in message event" })
 */

export async function emitError(
	options: errOptions = {
		tip: 'Get ya help here -> [https://discord.gg/3JzDV9T5Fn]'
	}
): Promise<void> {
	// Just throws the SimplyError
	throw new SimplyError(options);
}
