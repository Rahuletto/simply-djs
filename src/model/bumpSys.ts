import mongoose from 'mongoose'

/**
 * @type {mongoose.Schema<{ channel: string, nxtBump: string }>}
 */


 export type bumpSysData = {
		channel: string
		nxtBump: any
 }

const bump = new mongoose.Schema<bumpSysData>({
	channel: { type: String }, // Bump Channel
	nxtBump: { type: String } // Next Bump time
})

export default mongoose.model('Bump-System', bump)
