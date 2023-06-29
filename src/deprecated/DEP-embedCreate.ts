import { APIEmbed } from 'discord.js';
import { Deprecated } from '../error';
import { ExtendedInteraction, ExtendedMessage } from '../typedef';
import { embedCreator, embedCreatorOptions } from '../embedCreator';

/**
 * ## _~embedCreate~_
 * @deprecated Use {@link embedCreator()}
 *
 * @async
 * @param {ExtendedMessage | ExtendedInteraction} msgOrint [`ExtendedMessage`](https://simplyd.js.org/docs/typedef/extendedmessage) | [`ExtendedInteraction`](https://simplyd.js.org/docs/typedef/extendedinteraction)
 * @param {embedCreatorOptions} options [`embedCreatorOptions`](https://simplyd.js.org/docs/general/embedCreator#embedcreatoroptions)
 * @returns {Promise<APIEmbed>} [`APIEmbed`](https://discord-api-types.dev/api/discord-api-types-v10/interface/APIEmbed)
 *
 */

export async function embedCreate(
	msgOrint: ExtendedMessage | ExtendedInteraction,
	options: embedCreatorOptions = {}
): Promise<APIEmbed> {
	Deprecated({ desc: 'embedCreate() is now embedCreator()' });
	return await embedCreator(msgOrint, options);
}
