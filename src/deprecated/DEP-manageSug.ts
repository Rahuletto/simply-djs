import { Deprecated } from '../error';
import { manageSuggest, manageSuggestOptions } from '../handler/manageSuggest';
import { ButtonInteraction } from 'discord.js';

/**
 * @deprecated Use {@link manageSuggest()}
 */

export async function manageSug(
	interaction: ButtonInteraction,
	options: manageSuggestOptions = {}
): Promise<void> {
	Deprecated({ desc: 'manageSug() is now manageSuggest()' });
	return await manageSuggest(interaction, options);
}
