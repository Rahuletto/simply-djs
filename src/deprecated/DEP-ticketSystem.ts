import { Deprecated } from '../error';
import { ticketSetup, ticketSetupOptions } from '../ticketSetup';
import { ExtendedMessage, ExtendedInteraction } from '../typedef';

/**
 * @deprecated Use {@link ticketSetup()}
 */

export async function ticketSystem(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: ticketSetupOptions = { strict: false }
): Promise<void> {
	Deprecated({ desc: 'ticketSystem() is now ticketSetup()' });
	return await ticketSetup(msgOrInt, options);
}
