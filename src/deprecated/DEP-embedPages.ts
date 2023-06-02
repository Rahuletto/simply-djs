import { EmbedBuilder } from 'discord.js';
import { Deprecated } from '../error';
import { buttonPages, pagesOptions } from '../buttonPages';
import { ExtendedInteraction, ExtendedMessage } from '../typedef';

/**
 * @deprecated Use {@link buttonPages()}
 */

export async function embedPages(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	pages: EmbedBuilder[],
	options: pagesOptions = {}
): Promise<void> {
	Deprecated({ desc: 'embedPages() is now buttonPages()' });
	return await buttonPages(msgOrInt, { embeds: pages, ...options });
}
