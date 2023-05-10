import { CommandInteraction, GuildMember, UserMention } from 'discord.js';

/**
 * A class extension of the CommandInteraction object of the disocrd.js framework
 * which aims to reduce errors and apply the best developer practices.
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
