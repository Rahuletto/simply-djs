import { Erroptions, SimplyError } from '../Error/Error';

/**
 * Produce error messages just like Simply DJS
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Others/emitError***
 * @example simplydjs.emitError({ name: "Test", tip: "This is just to test" })
 */

export async function emitError(
	options: Erroptions = {
		tip: 'Get ya help here -> [https://discord.gg/3JzDV9T5Fn]'
	}
) {
	throw new SimplyError(options);
}
