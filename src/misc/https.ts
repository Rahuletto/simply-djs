import { OutgoingHttpHeaders } from 'http2';
import { request } from 'https';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

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
};

/**
 * Inbuilt https function to replace your good ol' node-fetch and axios.
 * @param host
 * @param endpoint
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Others/https***
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
		request(
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

				let data = '';

				response.on('error', reject);
				response.on('data', (chunk) => (data += chunk));
				response.on('end', async () => {
					try {
						resolve(JSON.parse(data));
					} catch (e) {
						reject(`HttpsError | An Error Occured\n\n${e}`);
					}
				});
			}
		)
			.on('error', reject)
			.end();
	});
}
