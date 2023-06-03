import { CommandInteraction, GuildMember, UserMention } from 'discord.js';

/**
 * This class extends the `CommandInteraction` object from the Discord.js framework.
 * These properties are used to reduce errors and apply best practices when working with Discord.js commands.
 * @param {member} Discord.GuildMember Member type for CommandInteraction due to it missing.
 * @param {author} Discord.GuildMember Member type for CommandInteraction due to it missing.
 * @param {mentions} Discord.UserMention Mention type for CommandInteraction due to it missing.
 * @param {customId} string Option used by the simply-djs's functions for custom-id checking.
 * @returns {ExtendedInteraction}
 */

export interface ExtendedInteraction extends CommandInteraction {
	mentions: UserMention;
	member: GuildMember;
	customId: string;
	author: GuildMember;
	content: string;
}
