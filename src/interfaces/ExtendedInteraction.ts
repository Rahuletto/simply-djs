import { CommandInteraction, GuildMember, UserMention } from 'discord.js';

/**
 * A class extension of the CommandInteraction object of the disocrd.js framework
 * which aims to reduce errors and apply the best developer practices.
 * @param {member} Discord.GuildMember Member type for CommandInteraction due to it missing.
 * @param {author} Discord.GuildMember Member type for CommandInteraction due to it missing.
 * @param {mentions} Discord.UserMention Mention type for CommandInteraction due to it missing.
 * @param {customId} string Option used by the simply-djs's functions for custom-id checking.
 * @returns {Eimport {
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
 *  color: simplydjs.toRgb('#406DBC')
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
xtendedInteraction}
 */

export interface ExtendedInteraction extends CommandInteraction {
	mentions: UserMention;
	member: GuildMember;
	customId: string;
	author: GuildMember;
	content: string;
}
