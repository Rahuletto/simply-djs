export type errOptions = {
	function?: string;
	title?: string;
	tip?: string;
};

export class SimplyError extends Error {
	/**
	 * Emit errors and provide sufficient details to help users debug easily
	 * @param {String} function
	 * @param {String} title
	 * @param {String} tip
	 */

	constructor(
		options: errOptions = {
			tip: 'Get ya help here -> [https://discord.gg/3JzDV9T5Fn]'
		}
	) {
		const msg = `SimplyError - ${options.function} | ${options.title}\n\n${options.tip}`;
		super(msg);
	}
}

Object.defineProperty(SimplyError.prototype, 'name', {
	value: 'SimplyError'
});
