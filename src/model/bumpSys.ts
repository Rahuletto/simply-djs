import mongoose from 'mongoose';

interface cts {
	user: string;
	count: number;
}

export type bumpSysData = {
	channel: string;
	nxtBump: any;
	guild: string;
	counts: cts[];
};

const bump = new mongoose.Schema<bumpSysData>({
	counts: { type: Array<cts>() }, // Hello
	channel: { type: String }, // Bump Channel (Auto updates)
	nxtBump: { type: String }, // Next Bump time
	guild: { type: String } // Guild
});

export default mongoose.model('Bump-System', bump);
