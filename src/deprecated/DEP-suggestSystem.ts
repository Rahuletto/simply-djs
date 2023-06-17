import { Deprecated } from '../error';
import { ExtendedMessage, ExtendedInteraction } from '../typedef';
import { SuggestResolve, suggest, suggestOptions } from '../suggest';

/**
 * @deprecated Use {@link suggest()}
 */

export async function suggestSystem(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: suggestOptions = { strict: false }
): Promise<SuggestResolve> {
	Deprecated({ desc: 'suggestSystem() is now suggest()' });
	return await suggest(msgOrInt, options);
}
