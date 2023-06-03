import mongoose from 'mongoose';
import { SimplyError } from './error';

import { https } from './misc';
import { version } from '../simplydjs';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/general/connect#connectoptions
 */

export type connectOptions = {
	strict?: boolean;
	notify?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * Connect to a mongo database to access some of the simply-djs functions ! *Requires* [MongoDB](https://mongodb.com/)
 *
 * @param db - The MongoDB URI string that is used to connect to the database.
 * @param options
 *
 * @returns A Promise that resolves to a boolean value indicating whether the database connection was
 * successful or not.
 *
 * @link `Documentation:` https://simplyd.js.org/docs/general/connect
 * @example simplydjs.connect('mongoURI')
 */

export async function connect(
	db: string,
	options: connectOptions = { strict: false }
): Promise<boolean> {
	return new Promise(async (resolve, reject) => {
		if (!db) {
			if (options?.strict)
				throw new SimplyError({
					function: 'connect',
					title: 'Provide an valid mongodb uri string.',
					tip: `Expected an MongoDB URI. Received ${db || 'undefined'}`
				});
			else
				console.log(
					`SimplyError - connect | Provide an valid mongodb uri string.\n\n` +
						`Expected an MongoDB URI. Received ${db || 'undefined'}`
				);
		}

		mongoose
			.connect(db)
			.then(async () => {
				if (options?.notify !== false) {
					const json = await https('registry.npmjs.org/simply-djs');
					const v = json['dist-tags'].latest;

					if (v.toString() != version) {
						console.log(
							`\n\t\tUpdate available | ${version} >>> ${v}\n\t\tRun 'npm i simply-djs@latest' to update\n`
						);
					}

					console.log('[Simply-DJS] Database connected ✨');
				}
				resolve(true);
			})
			.catch((err) => {
				reject(err.stack);
			});
	});
}
