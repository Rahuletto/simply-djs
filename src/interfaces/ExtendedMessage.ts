import { GuildMember, Message } from 'discord.js';

/**
 * A class extension of the Message object of the disocrd.js framework
 * which aims to reduce errors and apply the best developer practices.
 * @param {user} Discord.GuildMember Member type for Message object due to it missing.
 * @param {commandId} string Parameter used by simply-djs to get command-id's.
 * @param {customId} string Option used by the simply-djs's functions for custom-id checking.
 * @returns {ExtendedMessage}
 */

export interface ExtendedMessage extends Message {
	commandId: string;
	user: GuildMember;
	customId: string;
}
