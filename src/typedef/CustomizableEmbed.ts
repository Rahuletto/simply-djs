import {
	EmbedAuthorData,
	EmbedFooterData,
	ColorResolvable,
	APIEmbedField
} from 'discord.js';

/**
 * This interface can be used to customize embeds in a specific function.
 *
 * **Documentation Url** of the type: *https://simplyd.js.org/docs/typedef/CustomizableEmbed*
 * @returns {CustomizableEmbed}
 *
 * @example
 * simplydjs.someFunction(interaction, {
 * 	embed: {
 * 		title: "Example Embed",
 * 		description: "This is the embed that will be sent by simplydjs",
 * 		color: simplydjs.toRgb('#406DBC')
 * 	}
 * })
 *
 */

export type CustomizableEmbed = {
	author?: EmbedAuthorData;
	title?: string;
	url?: string;

	color?: ColorResolvable;
	description?: string;
	fields?: APIEmbedField[];

	thumbnail?: string;
	image?: string;

	footer?: EmbedFooterData;
	timestamp?: Date | number | null;
	// Removed the credit option

	/** credit?: boolean; */
};
