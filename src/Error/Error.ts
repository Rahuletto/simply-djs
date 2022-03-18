export type options = {
	name?: string
	tip?: string
}

/**
 * Emit Errors like Simply DJS does
 * @example simplydjs.error({ name: "Test", tip: "This is just to test" })
 */

export class SimplyError extends Error {
	/**
	 * Emit errors
	 * @param {String} name
	 * @param {String} tip
	 */

	constructor(
		options: options = {
			tip: 'Join the Support Server [https://discord.gg/3JzDV9T5Fn]'
		}
	) {
		const msg = '"' + options.name + '"' + '\n' + 'Tip: ' + options.tip + '\n'
		super(msg)
	}
}

Object.defineProperty(SimplyError.prototype, 'name', {
	value: 'SimplyError'
})
