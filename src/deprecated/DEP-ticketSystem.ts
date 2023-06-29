import { Deprecated } from '../error';
import { ticketSetup, ticketSetupOptions } from '../ticketSetup';
import { ExtendedMessage, ExtendedInteraction } from '../typedef';

/**
 * ## _~ticketSystem~_
 *
 * @deprecated Use {@link ticketSetup()}
 *
 * @param {ExtendedMessage | ExtendedInteraction} msgOrint [`ExtendedMessage`](https://simplyd.js.org/docs/typedef/extendedmessage) | [`ExtendedInteraction`](https://simplyd.js.org/docs/typedef/extendedinteraction)
 * @param {ticketSetupOptions} options [`ticketSetupOptions`](https://simplyd.js.org/docs/systems/ticketsetup#ticketsetupoptions)
 * @returns {Promise<void>} `void`
 */

export async function ticketSystem(
	msgOrint: ExtendedMessage | ExtendedInteraction,
	options: ticketSetupOptions = { strict: false }
): Promise<void> {
	Deprecated({ desc: 'ticketSystem() is now ticketSetup()' });
	return await ticketSetup(msgOrint, options);
}
