import mongoose from 'mongoose';
import { GiveawayEmbeds } from '../giveaway';

export interface Entry {
	userId: string;
	guildId: string;
	messageId: string;
}

export interface Requirement {
	type: 'guild' | 'role' | 'none';
	id?: string;
}

export type giveawayData = {
	message?: string;
	entry?: Entry[];
	entered?: number;
	winCount?: number;
	requirements?: Requirement;
	endTime?: string;
	description?: string;
	started?: number;
	prize?: string;
	host?: string;
	embeds: GiveawayEmbeds;
};

const GiveawaySchema = new mongoose.Schema<giveawayData>({
	message: { type: String }, // Message ID
	prize: { type: String }, // Prize go brr
	started: { type: Number }, // GSys started in ms
	entry: { type: Array<Entry>() }, // Array of Objects
	entered: { type: Number }, // Useless but ok lol
	winCount: { type: Number }, // How many winners
	requirements: { type: Object }, // Requirements ;)
	endTime: { type: String }, // in ms
	host: { type: String },
	description: { type: String }, // Giveaway Embed Desc
	embeds: { type: Object }
});

export default mongoose.model('Giveaway-System', GiveawaySchema);
