import mongoose from 'mongoose';
import { SimplyError } from './error';

import { https } from './misc';
import { version } from '../simplydjs';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

export type connectOptions = {
	strict?: boolean;
	notify?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * Connect to a mongo database to access some of the simply-djs functions ! *Requires* ***[mongodb uri](https://mongodb.com/)***
 * @param db mongoDbUri
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/connect***
 * @example simplydjs.connect('mongoURI')
 */

export async function connect(
	db: string,
	options: connectOptions = {}
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
					const json = await https('registry.npmjs.org', '/simply-djs');
					const v = json['dist-tags'].latest;

					if (v.toString() != version) {
						console.log(
							`\n\t\tUpdate available | ${version} >>> ${v}\n\t\tRun 'npm i simply-djs@latest' to update\n`
						);
					}

					console.log('{ SDJS } Database connected successfully');
				}
				resolve(true);
			})
			.catch((err) => {
				reject(err.stack);
			});
	});
}
