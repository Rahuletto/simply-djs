import { Channel, Client } from 'discord.js';
import { Deprecated } from '../error';
import { meme, memeOptions } from '../meme';

/**
 * @deprecated Use {@link meme()}
 */

export async function automeme(
	clientOrChannel: Client<boolean> | Channel,
	options?: memeOptions
): Promise<void> {
	Deprecated({ desc: 'automeme() is now meme()' });
	return await meme(clientOrChannel, options);
}
