import mongoose from 'mongoose'
import SimplyError from './Error/Error'

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

export default async function connect(db: string, notify: boolean): Promise<boolean> {
	return new Promise(async (resolve, reject) => {
		if (!db)
			throw new SimplyError(
				'Database URL was not provided',
				'This may be because of the new v3 update which requires you to have simplydjs.connect() function'
			)

		mongoose
			.connect(db)
			.then(() => {
				if (notify !== false) {
					console.log('{ S-DJS } Database Connected')
				}
				resolve(true)
			})
			.catch((err) => {
				reject(err.stack)
			})
	})
}
