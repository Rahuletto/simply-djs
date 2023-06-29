import { ActionRowBuilder, ButtonBuilder } from 'discord.js';

/**
 * ## disableButtons
 * ### Disable all buttons in a row
 *
 * @param {ActionRowBuilder<ButtonBuilder>[]} components [`ActionRowBuilder`](https://old.discordjs.dev/#/docs/discord.js/main/class/ActionRowBuilder)
 * @returns {ActionRowBuilder<ButtonBuilder>[]}
 *
 * ---
 *
 * @link [`Documentation`](https://simplyd.js.org/docs/misc/disableButtons)
 * @example simplydjs.disableButtons(row)
 */

export function disableButtons(
	components: ActionRowBuilder<ButtonBuilder>[]
): ActionRowBuilder<ButtonBuilder>[] {
	// Take all components in for loop
	for (let x = 0; x < components.length; x++) {
		for (let y = 0; y < components[x].components.length; y++) {
			// Make then into ButtonBuilder
			components[x].components[y] = ButtonBuilder.from(
				components[x].components[y]
			);
			// Disable the button
			components[x].components[y].setDisabled(true);
		}
	}

	return components;
}
