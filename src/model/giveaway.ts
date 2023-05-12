import mongoose from 'mongoose';

interface Entry {
	userID: string;
	guildID: string;
	messageID: string;
}

interface Requirement {
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
	desc?: string;
	started?: number;
	prize?: string;
	host?: string;
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
	desc: { type: String } // Giveaway Embed Desc
});

export default mongoose.model('Giveaway-System', GiveawaySchema);
