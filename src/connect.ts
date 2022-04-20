import mongoose from 'mongoose';
import { SimplyError } from './Error/Error';
import axios from 'axios';
import chalk from 'chalk';
import { version } from '../simplydjs';
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * An **mongoose connector** which is used in many functions
 * @param db mongoDbUri
 * @param notify
 * @example simplydjs.connect('mongoURI', true)
 */

export async function connect(db: string, notify?: boolean): Promise<boolean> {
	return new Promise(async (resolve, reject) => {
		if (!db)
			throw new SimplyError({
				name: 'NOT_SPECIFIED | Provide an valid mongodb uri string.',
				tip: `Expected an MongoDB URI. Received ${db || 'undefined'}`
			});

		mongoose
			.connect(db)
			.then(async () => {
				if (notify !== false) {
					let json = await axios
						.get('https://api.npms.io/v2/search?q=simply-djs')
						.then((res) => res.data);
					let v = json.results[0].package.version;

					if (v !== version) {
						console.log(
							`\n\t\tUpdate available | ${chalk.grey(version)} ${chalk.magenta(
								'→'
							)} ${chalk.green(v)}\n\t\tRun [${chalk.blue(
								'npm i simply-djs@latest'
							)}] to update\n`
						);
					}

					console.log('{ S-DJS } Database Connected');
				}
				resolve(true);
			})
			.catch((err) => {
				reject(err.stack);
			});
	});
}
