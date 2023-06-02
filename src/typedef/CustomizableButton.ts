import { ExtendedButtonStyle } from './ExtendedButtonStyle';

/**
 * An Object to customize buttons in specific function
 *
 * **Documentation Url** of the type: *https://simplyd.js.org/docs/typedef/CustomizableButton*
 * @returns {CustomizableButton}
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

export interface CustomizableButton {
	style?: ExtendedButtonStyle;
	label?: string;
	emoji?: string;
}
