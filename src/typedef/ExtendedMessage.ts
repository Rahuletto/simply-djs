import { GuildMember, Message } from 'discord.js';

/**
 * This class extends the `Message` object from the Discord.js framework.
 * These properties are used to reduce errors and apply best practices when working with Discord.js
 *
 * --------------------
 * These properties are used to provide additional functionality and
 * information to the `Message` object in the context of a Discord bot. The `commandId` property is
 * used by the `simply-djs` library to get command IDs, while the `user` property is of type
 * `GuildMember` and represents the user who sent the message. The `customId` property is used by
 * `simply-djs` functions for custom ID checking. By defining this interface, the code is ensuring that
 * any object that implements `ExtendedMessage` will have these three properties available.
 * --------------------
 *
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
