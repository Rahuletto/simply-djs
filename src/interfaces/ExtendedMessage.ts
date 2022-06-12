import { GuildMember, Message } from "discord.js";

export interface ExtendedMessage extends Message {
	user: GuildMember;
	commandId: any;
	customId: any;
}
