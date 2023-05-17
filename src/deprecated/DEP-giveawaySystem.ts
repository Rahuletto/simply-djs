import { Deprecated } from '../error';
import { ExtendedInteraction, ExtendedMessage } from '../interfaces';
import { GiveawayResolve, giveaway, giveawayOptions } from '../giveaway';

/**
 * @deprecated Use {@link giveaway()}
 */

export async function giveawaySystem(
	msgOrint: ExtendedMessage | ExtendedInteraction,
	options: giveawayOptions = {}
): Promise<GiveawayResolve> {
	Deprecated({ desc: 'embedCreate() is now embedCreator()' });
	return await giveaway(msgOrint, options);
}
