import mongoose from 'mongoose'

/**
 * @type {mongoose.Schema<{ message: string, author: string, votes: string[] }>}
 */

type votz = { user: number, vote: string }

export type sugData = {
	message: string
	author: string
	votes: Array<votz>
}

const suggest = new mongoose.Schema<sugData>({
	message: { type: String }, // Message ID
	author: { type: String }, // Author of Suggestion
	votes: { type: Array<votz>() } // Array of Objects
})

export default mongoose.model('Suggest-System', suggest)
