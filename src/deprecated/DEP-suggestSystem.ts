import { Deprecated } from '../error';
import { ExtendedMessage, ExtendedInteraction } from '../typedef';
import { SuggestResolve, suggest, suggestOptions } from '../suggest';

/**
 * ## _~suggestSystem~_
 *
 * @deprecated Use {@link suggest()}
 *
 * @param {ExtendedMessage | ExtendedInteraction} msgOrint [`ExtendedMessage`](https://simplyd.js.org/docs/typedef/extendedmessage) | [`ExtendedInteraction`](https://simplyd.js.org/docs/typedef/extendedinteraction)
 * @param {suggestOptions} options [`suggestOptions`](https://simplyd.js.org/docs/systems/suggest#suggestoptions)
 * @returns {Promise<SuggestResolve>} [`SuggestResolve`](https://simplyd.js.org/docs/systems/suggest#suggestresolve)
 *
 */

export async function suggestSystem(
	msgOrint: ExtendedMessage | ExtendedInteraction,
	options: suggestOptions = { strict: false }
): Promise<SuggestResolve> {
	Deprecated({ desc: 'suggestSystem() is now suggest()' });
	return await suggest(msgOrint, options);
}
