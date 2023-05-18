import { Deprecated } from '../error';
import { ExtendedMessage, ExtendedInteraction } from '../interfaces';
import { InteractionResponse, Message } from 'discord.js';
import { suggest, suggestOption } from '../suggest';

/**
 * @deprecated Use {@link suggest()}
 */

export async function suggestSystem(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: suggestOption = { strict: false }
): Promise<Message | InteractionResponse> {
	Deprecated({ desc: 'suggestSystem() is now suggest()' });
	return await suggest(msgOrInt, options);
}
