import mongoose from 'mongoose'
import SimplyError from './Error/Error'
import axios from 'axios'
import chalk from 'chalk'

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

export async function connect(db: string, notify?: boolean): Promise<boolean> {
	return new Promise(async (resolve, reject) => {
		if (!db)
			throw new SimplyError(
				'Database URL was not provided',
				'This may be because of the new v3 update which requires you to have simplydjs.connect() function'
			)

		mongoose
			.connect(db)
			.then(async () => {
				if (notify !== false) {
					let version = '3.0.0'

					let json = await axios
						.get('https://api.npms.io/v2/search?q=simply-djs')
						.then((res) => res.data)
					let v = json.results[0].package.version

					if (v !== version) {
						console.log(
							`\n\t\tUpdate available | ${chalk.grey(version)} ${chalk.magenta(
								'→'
							)} ${chalk.green(v)}\n\t\tRun [${chalk.blue(
								'npm i simply-djs@latest'
							)}] to update\n`
						)
					}

					console.log('{ S-DJS } Database Connected')
				}
				resolve(true)
			})
			.catch((err) => {
				reject(err.stack)
			})
	})
}
