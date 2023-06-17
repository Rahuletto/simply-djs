import { Client, Message } from 'discord.js';
import { Deprecated } from '../error';
import { bumpOptions, bumpReminder } from '../bumpReminder';

/**
 * @deprecated Use {@link bumpReminder()}
 */

export async function bumpSystem(
	client: Client,
	message: Message | bumpOptions,
	options: bumpOptions
): Promise<boolean> {
	Deprecated({ desc: 'bumpSystem() is now bumpReminder()' });
	return await bumpReminder(client, message, options);
}
