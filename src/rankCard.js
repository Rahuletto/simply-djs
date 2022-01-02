let SimplyError = require('./Error/Error.js')

async function rankCard(client, message, options = []) {
	throw new SimplyError(
		'Rank Card has been deprecated.',
		'Use simply-xp for rankCard.'
	)
}

module.exports = rankCard
