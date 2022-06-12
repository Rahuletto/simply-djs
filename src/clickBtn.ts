import { ButtonInteraction } from 'discord.js';
import { manageBtnOptions, manageBtn } from './manageBtn';
import { Deprecated } from '../src/Error/Deprecate';

/**
 * @deprecated Use {@link manageBtn()}
 */

export async function clickBtn(
	button: ButtonInteraction,
	options: manageBtnOptions
) {
	Deprecated({ desc: 'clickBtn() is now manageBtn()' });
	await manageBtn(button, options);
}
