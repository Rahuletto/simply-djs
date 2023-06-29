import { Deprecated } from '../error';
import { manageSuggest, manageSuggestOptions } from '../handler/manageSuggest';
import { ButtonInteraction } from 'discord.js';

/**
 * ## _~manageSug~_
 * @deprecated Use {@link manageSuggest()}
 *
 * @param {ButtonInteraction} button [`ButtonInteraction`](https://old.discordjs.dev/#/docs/discord.js/main/class/ButtonInteraction)
 * @param {manageSuggestOptions} options [`manageSuggestOptions`](https://simplyd.js.org/docs/handler/managesuggest#managesuggestoptions)
 * @returns {Promise<void>} `void`
 */

export async function manageSug(
	interaction: ButtonInteraction,
	options: manageSuggestOptions = {}
): Promise<void> {
	Deprecated({ desc: 'manageSug() is now manageSuggest()' });
	return await manageSuggest(interaction, options);
}
