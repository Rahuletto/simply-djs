import mongoose from 'mongoose';

export interface votz {
	user: number | string;
	vote: 'up' | 'down';
}

export type sugData = {
	message: string;
	author: string;
	votes: Array<votz>;
};

const suggest = new mongoose.Schema<sugData>({
	message: { type: String }, // Message ID
	author: { type: String }, // Author of Suggestion to wave
	votes: { type: Array<votz>() } // Array of votes
});

export default mongoose.model('Suggest-System', suggest);
