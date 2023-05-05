import {
	EmbedAuthorData,
	EmbedFooterData,
	ColorResolvable,
	EmbedField
} from 'discord.js';

/**
 * An Object to customize any embed that is sent from the simply-djs package
 *
 * **URL** of the Type: *https://simplyd.js.org/docs/types/CustomizableEmbed*
 * @returns {CustomizableEmbed}
 *
 * @example
 * simplydjs.someFunction(client, {
 *  title: "Example embed",
 *  description: "This is the embed that will be sent by simplydjs",
 *  color: simplydjs.toRgb('#87A8E2')
 * })
 *
 *
 */

export interface CustomizableEmbed {
	author?: EmbedAuthorData;
	title?: string;
	url?: string;

	thumbnail?: string;

	color?: ColorResolvable;
	description?: string;
	fields?: EmbedField[];

	image?: string;

	footer?: EmbedFooterData;
	timestamp?: Date | number | null;
	// Removed the credit option

	/** credit?: boolean; */
}
