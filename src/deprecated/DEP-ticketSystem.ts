import { Deprecated } from '../error';
import { ticketSetup, ticketSetupOptions } from '../ticketSetup';
import { ExtendedMessage, ExtendedInteraction } from '../typedef';
import { Message } from 'discord.js';

/**
 * @deprecated Use {@link ticketSetup()}
 */

export async function ticketSystem(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: ticketSetupOptions = { strict: false }
): Promise<Message> {
	Deprecated({ desc: 'ticketSystem() is now ticketSetup()' });
	return await ticketSetup(msgOrInt, options);
}
