import { GuildMember, Message } from "discord.js";

export interface ExtendedMessage extends Message {
	user: GuildMember;
	commandId: string;
	customId: string;
}
