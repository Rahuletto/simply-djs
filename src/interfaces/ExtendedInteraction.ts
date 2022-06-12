import { CommandInteraction, GuildMember } from "discord.js";

export interface ExtendedInteraction extends CommandInteraction {
	author: any;
	member: GuildMember;
}
