import mongoose from 'mongoose';

interface Count {
	user: string;
	count: number;
}

export type bumpReminderData = {
	channel: string;
	nextBump: any;
	guild: string;
	counts: Count[];
};

const BumpSchema = new mongoose.Schema<bumpReminderData>({
	counts: { type: Array<Count>() }, // Hello
	channel: { type: String }, // Bump Channel (Auto updates)
	nextBump: { type: String }, // Next Bump time
	guild: { type: String } // Guild
});

export default mongoose.model('Bump-Reminder', BumpSchema);
