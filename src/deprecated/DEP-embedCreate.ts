import { APIEmbed } from 'discord.js';
import { Deprecated } from '../error';
import { ExtendedInteraction, ExtendedMessage } from '../typedef';
import { embedCreator, embedOptions } from '../embedCreator';

/**
 * @deprecated Use {@link embedCreator()}
 */

export async function embedCreate(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: embedOptions = {}
): Promise<APIEmbed> {
	Deprecated({ desc: 'embedCreate() is now embedCreator()' });
	return await embedCreator(msgOrInt, options);
}
