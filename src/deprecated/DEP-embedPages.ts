import { EmbedBuilder } from 'discord.js';
import { Deprecated } from '../error';
import { buttonPages, pagesOptions } from '../buttonPages';
import { ExtendedInteraction, ExtendedMessage } from '../typedef';

/**
 * ## _~embedPages~_
 * @deprecated Use {@link buttonPages()}
 *
 * @async
 * @param {ExtendedMessage|ExtendedInteraction} msgOrint [`ExtendedMessage`](https://simplyd.js.org/docs/typedef/extendedmessage) | [`ExtendedInteraction`](https://simplyd.js.org/docs/typedef/extendedinteraction)
 * @param {pagesOptions} options [`pagesOptions`](https://simplyd.js.org/docs/general/buttonpages#pagesoptions)
 * @returns {Promise<void>} `void`
 *
 */

export async function embedPages(
	msgOrint: ExtendedMessage | ExtendedInteraction,
	pages: EmbedBuilder[],
	options: pagesOptions = {}
): Promise<void> {
	Deprecated({ desc: 'embedPages() is now buttonPages()' });
	return await buttonPages(msgOrint, { embeds: pages, ...options });
}
