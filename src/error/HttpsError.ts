export type errOptions = {
	function?: string;
	error?: string;
};

export class HttpsError extends Error {
	/**
	 * Emit errors and provide sufficient details to help users debug easily
	 * @param {String} function
	 * @param {String} error
	 */

	constructor(options: errOptions = {}) {
		const msg = `HttpsError | An Error Occured:\n\n${options.error}`;
		super(msg);
	}
}

Object.defineProperty(HttpsError.prototype, 'name', {
	value: 'HttpsError'
});
