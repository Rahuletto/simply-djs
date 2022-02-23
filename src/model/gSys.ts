import mongoose from 'mongoose'

/**
 * @type {mongoose.Schema<{ message: string, entry: string[], entered: number, winCount: number, requirements: object, endTime: string }>}
 */

type Entri = {
	userID: string
	guildID: string
	messageID: string
}

type req = {
	type: 'guild' | 'role'
	gid?: string
	role?: string
}

export type gwData = {
	message: string
	entry: Array<Entri>
	entered: number
	winCount: number
	requirements: req
	endTime: string
}

const gw = new mongoose.Schema<gwData>({
	message: { type: String }, // Message ID
	entry: { type: Array<Entri>() }, // Array of Objects
	entered: { type: Number }, // Useless but ok lol
	winCount: { type: Number },
	requirements: { type: Object }, // { type: String, role: 'If type: role', guild: 'If type: guild' }
	endTime: { type: String } // in ms
})

export default mongoose.model('Giveaway-System', gw)
