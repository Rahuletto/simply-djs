import { ButtonStyle } from 'discord.js';

/**
 * An Object to customize buttons in specific function
 *
 * **URL** of the Type: *https://simplyd.js.org/docs/types/buttonTemplate*
 * @returns {buttonTemplate}
 *
 * @example
 * simplydjs.someFunction(client, {
 *  buttons: {
 *      some: {
 *          style: ButtonStyle.Primary,
 *          label: "Example",
 *          emoji: "🤗"
 *      }
 *  }
 * })
 *
 *
 */

export interface buttonTemplate {
	style?: ButtonStyle | 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK';
	label?: string;
	emoji?: string;
}
