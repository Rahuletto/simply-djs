import { Client, Message } from 'discord.js';
import { Deprecated } from '../error';
import { bumpOptions, bumpReminder } from '../bumpReminder';

/**
 * ## _~bumpSystem~_
 * @deprecated Use {@link bumpReminder()}
 *
 * @async
 * @param {Client} client
 * @param {Message|bumpOptions} message `Message` | [`bumpOptions`](https://simplyd.js.org/docs/systems/bumpreminder#bumpoptions)
 * @param {bumpOptions} options [`bumpOptions`](https://simplyd.js.org/docs/systems/bumpreminder#bumpoptions)
 * @returns {Promise<boolean>} `boolean`
 *
 */

export async function bumpSystem(
	client: Client,
	message: Message | bumpOptions,
	options: bumpOptions
): Promise<boolean> {
	Deprecated({ desc: 'bumpSystem() is now bumpReminder()' });
	return await bumpReminder(client, message, options);
}
