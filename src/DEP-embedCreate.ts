import { APIEmbed } from 'discord.js';
import { Deprecated } from './Error/Deprecate';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';
import { embedCreator, embedOptions } from './embedCreator';

/**
 * @deprecated Use {@link embedCreator()}
 */

export async function embedCreate(
	message: ExtendedMessage | ExtendedInteraction,
	options: embedOptions = {}
): Promise<APIEmbed> {
	Deprecated({ desc: 'embedCreate() is now embedCreator()' });
	return await embedCreator(message, options);
}
