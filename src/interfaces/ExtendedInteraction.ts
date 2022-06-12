import { CommandInteraction, GuildMember, UserMention } from "discord.js";

export interface ExtendedInteraction extends CommandInteraction {
	mentions: UserMention;
	member: GuildMember;
	customId: string;
	author: any;
}
