import { Deprecated } from '../error';
import { ExtendedMessage, ExtendedInteraction } from '../typedef';
import { InteractionResponse, Message } from 'discord.js';
import { suggest, suggestOptions } from '../suggest';

/**
 * @deprecated Use {@link suggest()}
 */

export async function suggestSystem(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: suggestOptions = { strict: false }
): Promise<Message | InteractionResponse> {
	Deprecated({ desc: 'suggestSystem() is now suggest()' });
	return await suggest(msgOrInt, options);
}
