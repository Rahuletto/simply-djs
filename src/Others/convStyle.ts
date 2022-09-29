import { ButtonStyle } from 'discord.js';
import { LegacyStyles, styleObj } from '../interfaces';

import { Erroptions, SimplyError } from '../Error/Error';

/**
 * Convert Legacy button styles to new ButtonStyle
 * @param color
 * @link `Documentation:` ***https://simplyd.js.org/docs/Others/convStyle***
 * @example simplydjs.convStyle("SECONDARY")
 */

export function convStyle(color: ButtonStyle | LegacyStyles): ButtonStyle {
	if (color as ButtonStyle) return color as ButtonStyle;
	else if (color as LegacyStyles) return styleObj[color as LegacyStyles];
}
