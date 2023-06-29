import { Deprecated } from '../error';
import { ExtendedInteraction, ExtendedMessage } from '../typedef';
import { GiveawayResolve, giveaway, giveawayOptions } from '../giveaway';
import { EndResolve } from '../handler/manageGiveaway';

/**
 * ## _~giveawaySystem~_
 * @deprecated Use {@link giveaway()}
 *
 * @async
 * @param {ExtendedMessage | ExtendedInteraction} msgOrint  [`ExtendedMessage`](https://simplyd.js.org/docs/typedef/extendedmessage) | [`ExtendedInteraction`](https://simplyd.js.org/docs/typedef/extendedinteraction)
 * @param {giveawayOptions} options [`giveawayOptions`](https://simplyd.js.org/docs/systems/giveway#giveawayoptions)
 * @returns {Promise<GiveawayResolve | EndResolve>} [`GiveawayResolve`](https://simplyd.js.org/docs/systems/giveaway#giveawayresolve)`|`[`EndResolve`](https://simplyd.js.org/docs/systems/giveaway#endresolve)
 *
 */

export async function giveawaySystem(
	msgOrint: ExtendedMessage | ExtendedInteraction,
	options: giveawayOptions = {}
): Promise<GiveawayResolve | EndResolve> {
	Deprecated({ desc: 'giveawaySystem() is now giveaway()' });
	return await giveaway(msgOrint, options);
}
