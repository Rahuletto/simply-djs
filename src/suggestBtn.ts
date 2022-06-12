import { ButtonInteraction } from 'discord.js';
import { manageSugOptions, manageSug } from './manageSug';
import { Deprecated } from '../src/Error/Deprecate';

/**
 * @deprecated Use {@link manageSug()}
 */

export async function suggestBtn(
	button: ButtonInteraction,
	options: manageSugOptions
) {
	Deprecated({ desc: 'suggestBtn() is now manageSug()' });
	await manageSug(button, options);
}
