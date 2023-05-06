import { EmbedBuilder } from 'discord.js';
import { Deprecated } from './Error/Deprecate';
import { buttonPages, pagesOption } from './buttonPages';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';

/**
 * @deprecated Use {@link buttonPages()}
 */

export async function embedPages(
	message: ExtendedMessage | ExtendedInteraction,
	pages: EmbedBuilder[],
	options: pagesOption = {}
): Promise<boolean> {
	Deprecated({ desc: 'embedPages() is now buttonPages()' });
	return await buttonPages(message, { embeds: pages, ...options });
}