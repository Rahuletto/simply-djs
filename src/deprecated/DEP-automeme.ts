import { Client } from 'discord.js';
import { Deprecated } from '../error';
import { meme, memeOptions } from '../meme';

/**
 * ## _~automeme~_
 * @deprecated Use {@link meme()}
 *
 * @async
 * @param {Client} client
 * @param {memeOptions} options [`memeOptions`](https://simplyd.js.org/docs/systems/meme#memeoptions)
 * @returns {Promise<void>} `void`
 *
 */

export async function automeme(
	client: Client,
	options: memeOptions = { strict: true }
): Promise<void> {
	Deprecated({ desc: 'automeme() is now meme()' });
	return await meme(client, options);
}
