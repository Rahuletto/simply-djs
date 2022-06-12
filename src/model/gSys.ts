import mongoose from 'mongoose';

interface Entri {
	userID: string;
	guildID: string;
	messageID: string;
}

interface req {
	type: 'guild' | 'role' | 'none';
	id?: string;
}

export type gwData = {
	message?: string;
	entry?: Entri[];
	entered?: number;
	winCount?: number;
	requirements?: req;
	endTime?: string;
	desc?: string;
	started?: number;
	prize?: string;
	host?: string;
};

const gw = new mongoose.Schema<gwData>({
	message: { type: String }, // Message ID
	prize: { type: String }, // Prize go brr
	started: { type: Number }, // GSys started in ms
	entry: { type: Array<Entri>() }, // Array of Objects
	entered: { type: Number }, // Useless but ok lol
	winCount: { type: Number }, // How many winners
	requirements: { type: Object }, // Requirements ;)
	endTime: { type: String }, // in ms
	host: { type: String },
	desc: { type: String } // Giveaway Embed Desc
});

export default mongoose.model('Giveaway-System', gw);
