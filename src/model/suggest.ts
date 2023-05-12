import mongoose from 'mongoose';

export interface Vote {
	user: number | string;
	vote: 'up' | 'down';
}

export type suggestionData = {
	message: string;
	author: string;
	votes: Array<Vote>;
};

const SuggestionSchema = new mongoose.Schema<suggestionData>({
	message: { type: String }, // Message ID
	author: { type: String }, // Author of Suggestion to wave
	votes: { type: Array<Vote>() } // Array of votes
});

export default mongoose.model('Suggest-System', SuggestionSchema);
