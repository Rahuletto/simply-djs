import mongoose from 'mongoose'

interface votz {
	user: number
	vote: string
}

export type sugData = {
	message: string
	author: string
	votes: Array<votz>
}

const suggest = new mongoose.Schema<sugData>({
	message: { type: String }, // Message ID
	author: { type: String }, // Author of Suggestion to wave
	votes: { type: Array<votz>() } // Array of votes
})

export default mongoose.model('Suggest-System', suggest)
