import mongoose from 'mongoose'

export type bumpSysData = {
	channel: string
	nxtBump: any
	guild: string
	checkId: number
}

const bump = new mongoose.Schema<bumpSysData>({
	checkId: { type: Number }, // Hello
	channel: { type: String }, // Bump Channel (Auto updates)
	nxtBump: { type: String }, // Next Bump time
	guild: { type: String } // Guild
})

export default mongoose.model('Bump-System', bump)
