export type Erroptions = {
	name?: string;
	tip?: string;
};

export class SimplyError extends Error {
	/**
	 * Emit errors
	 * @param {String} name
	 * @param {String} tip
	 */

	constructor(
		options: Erroptions = {
			tip: 'Get ya help here -> [https://discord.gg/3JzDV9T5Fn]'
		}
	) {
		const msg = '"' + options.name + '"' + '\n' + 'Tip: ' + options.tip + '\n';
		super(msg);
	}
}

Object.defineProperty(SimplyError.prototype, 'name', {
	value: 'SimplyError'
});
