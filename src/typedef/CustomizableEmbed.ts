import {
	EmbedAuthorData,
	EmbedFooterData,
	ColorResolvable,
	APIEmbedField
} from 'discord.js';

/**
 * An Object to customize any embed that is sent from the simply-djs package
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
