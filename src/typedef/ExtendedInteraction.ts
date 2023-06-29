import { CommandInteraction, GuildMember, UserMention } from 'discord.js';

/**
 * This class extends the `CommandInteraction` object from the Discord.js framework.
 * These properties are used to reduce errors and apply best practices when working with Discord.js commands.
 *
 * --------------------
 * These properties are used to provide additional functionality and
 * information to the `CommandInteraction` object in the context of a Discord bot. The `customId` property is
 * used by the `simply-djs` library to get message IDs, while the `author` property is of type
 * `GuildMember` and represents the user who sent the message. The `mentions` property is used by
 * `simply-djs` functions for mention checking. By defining this interface, the code is ensuring that
 * any object that implements `ExtendedInteraction` will have these three properties available.
 * --------------------
 *
 * @param {member} Discord.GuildMember Member type for CommandInteraction due to it missing.
 * @param {author} Discord.GuildMember Member type for CommandInteraction due to it missing.
 * @param {mentions} Discord.UserMention Mention type for CommandInteraction due to it missing.
 * @param {customId} string Option used by the simply-djs's functions for custom-id checking.
 *
 * @interface ExtendedInteraction
 * @typedef {ExtendedInteraction}
 * @extends {CommandInteraction}
 */

export interface ExtendedInteraction extends CommandInteraction {
	mentions: UserMention;
	member: GuildMember;
	customId: string;
	author: GuildMember;
	content: string;
}
