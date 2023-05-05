import { Deprecated } from './Error/Deprecate';
import { ticketSetup, ticketSetupOptions } from './ticketSetup';
import { ExtendedMessage, ExtendedInteraction } from './interfaces';
import { Message } from 'discord.js';

/**
 * @deprecated Use {@link ticketSetup()}
 */

export async function ticketSystem(
	message: ExtendedMessage | ExtendedInteraction,
	options: ticketSetupOptions = { strict: false }
): Promise<Message> {
	Deprecated({ desc: 'ticketSystem() is now ticketSetup()' });
	return await ticketSetup(message, options);
}
