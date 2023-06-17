import mongoose from 'mongoose';
import { Progress } from '../suggest';

export interface Vote {
	userId: number | string;
	vote: 'up' | 'down';
}

export type suggestionData = {
	message: string;
	author: string;
	votes: Array<Vote>;
	progress: Progress;
};

const SuggestionSchema = new mongoose.Schema<suggestionData>({
	message: { type: String }, // Message ID
	author: { type: String }, // Author of Suggestion
	votes: { type: Array<Vote>() }, // Array of votes
	progress: { type: Object }
});

export default mongoose.model('Suggest-System', SuggestionSchema);
