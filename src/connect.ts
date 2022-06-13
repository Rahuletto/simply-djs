import mongoose from 'mongoose';
import { SimplyError } from './Error/Error';
import axios from 'axios';
import chalk from 'chalk';
import { version } from '../simplydjs';
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * Connect to a mongo database to access some functions ! *Requires* ***[mongodb uri](https://mongodb.com/)***
 * @param db mongoDbUri
 * @param notify
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/connect***
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
					const json = await axios
						.get('https://registry.npmjs.org/simply-djs')
						.then((res) => res.data);
					const v = json['dist-tags'].latest;

					if (v.toString() != version) {
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
