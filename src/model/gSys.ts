import mongoose from 'mongoose'

/**
 * @type {mongoose.Schema<{ message: string, entry: string[], entered: number, winCount: number, requirements: object, endTime: string }>}
 */

interface Entri {
	userID: string
	guildID: string
	messageID: string
}

interface req {
	type: 'guild' | 'role'
	id?: string
}

export type gwData = {
	message: string
	entry: Entri[]
	entered: number
	winCount: number
	requirements: req
	endTime: string
	desc: string
	started: number
}

const gw = new mongoose.Schema<gwData>({
	message: { type: String }, // Message ID
	started: { type: Number }, // GSys started MS
	entry: { type: Array<Entri>() }, // Array of Objects
	entered: { type: Number }, // Useless but ok lol
	winCount: { type: Number },
	requirements: { type: Object }, // { type: String, role: 'If type: role', guild: 'If type: guild' }
	endTime: { type: String }, // in ms
	desc: { type: String } // Giveaway Embed Desc
})

export default mongoose.model('Giveaway-System', gw)
