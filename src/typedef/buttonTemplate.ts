import { ExtendedButtonStyle } from './ExtendedButtonStyle';

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
	style?: ExtendedButtonStyle;
	label?: string;
	emoji?: string;
}
