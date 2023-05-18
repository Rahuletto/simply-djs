import { Deprecated } from '../error';
import { ExtendedInteraction, ExtendedMessage } from '../interfaces';
import { GiveawayResolve, giveaway, giveawayOptions } from '../giveaway';

/**
 * @deprecated Use {@link giveaway()}
 */

export async function giveawaySystem(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: giveawayOptions = {}
): Promise<GiveawayResolve> {
	Deprecated({ desc: 'giveawaySystem() is now giveaway()' });
	return await giveaway(msgOrInt, options);
}
