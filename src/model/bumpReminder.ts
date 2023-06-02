import mongoose from 'mongoose';

export interface Count {
	user: string;
	count: number;
}

export type bumpReminderData = {
	channel: string;
	nextBump: number;
	guild: string;
	counts: Count[];
};

const BumpSchema = new mongoose.Schema<bumpReminderData>({
	counts: { type: Array<Count>() }, // Hello
	channel: { type: String }, // Bump Channel (Auto updates)
	nextBump: { type: Number }, // Next Bump time
	guild: { type: String } // Guild
});

export default mongoose.model('Bump-Reminder', BumpSchema);
