import { ActionRowBuilder, ButtonBuilder } from 'discord.js';

/**
 * Disable all buttons in a row
 * @param components
 * @link `Documentation:` ***https://simplyd.js.org/docs/Others/disableButtons***
 * @example simplydjs.disableButtons(row)
 */

export function disableButtons(components: ActionRowBuilder<ButtonBuilder>[]) {
	for (let x = 0; x < components.length; x++) {
		for (let y = 0; y < components[x].components.length; y++) {
			components[x].components[y] = ButtonBuilder.from(
				components[x].components[y]
			);

			components[x].components[y].setDisabled(true);
		}
	}

	return components;
}
