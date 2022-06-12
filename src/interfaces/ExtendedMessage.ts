import { Message } from "discord.js";

export interface ExtendedMessage extends Message {
	commandId: any;
}
