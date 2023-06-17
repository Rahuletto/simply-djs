import { ExtendedButtonStyle } from './ExtendedButtonStyle';

/**
 * This interface can be used to customize buttons in a specific function.
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
