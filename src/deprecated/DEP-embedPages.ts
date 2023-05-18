import { EmbedBuilder } from 'discord.js';
import { Deprecated } from '../error';
import { buttonPages, pagesOption } from '../buttonPages';
import { ExtendedInteraction, ExtendedMessage } from '../interfaces';

/**
 * @deprecated Use {@link buttonPages()}
 */

export async function embedPages(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	pages: EmbedBuilder[],
	options: pagesOption = {}
): Promise<void> {
	Deprecated({ desc: 'embedPages() is now buttonPages()' });
	return await buttonPages(msgOrInt, { embeds: pages, ...options });
}
