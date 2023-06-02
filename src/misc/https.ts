import { OutgoingHttpHeaders } from 'http2';
import { request } from 'https';
import { HttpsError } from '../error';
// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/misc/https#httpsoptions
 */

export type httpsOptions = {
	method:
		| 'GET'
		| 'POST'
		| 'PUT'
		| 'PATCH'
		| 'DELETE'
		| 'HEAD'
		| 'CONNECT'
		| 'OPTIONS'
		| 'TRACE';
	headers: OutgoingHttpHeaders;
	body?: Object;
};

/**
 * Inbuilt https function to replace your good ol' node-fetch and axios.
 * @param host
 * @param endpoint
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/misc/https
 * @example simplydjs.https("postman-echo.com", "/get") // An Echo endpoint
 */

export function https(
	host: string,
	endpoint: string,
	options: httpsOptions = {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	}
): Promise<any> {
	return new Promise((resolve, reject) => {
		// Using node:https request function
		var req = request(
			{
				hostname: host,
				path: endpoint,
				method: options.method,
				headers: options.headers
			},
			async (response) => {
				// Handle any redirects
				if (response.headers.location && response.statusCode != 200)
					return resolve(
						await https(host, response.headers.location.replace(host, ''))
					);

				// Data stream

				let data = '';

				response.on('error', reject);
				response.on('data', (chunk) => (data += chunk));
				response.on('end', async () => {
					try {
						// Resolve any objects
						resolve(JSON.parse(data));
					} catch (e: any) {
						// Some API sends html file as error. So this throws error if there is some
						throw new HttpsError({
							error: e.stack
						});
					}
				});
			}
		);

		// Write body into the request if its other than GET method
		if (options?.body) req.write(JSON.stringify(options.body));

		// closes the request
		req.end();
	});
}
