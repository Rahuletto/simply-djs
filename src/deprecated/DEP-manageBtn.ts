import { ButtonInteraction } from 'discord.js';
import { Deprecated } from '../error';
import { manageBtnRole, manageBtnRoleOptions } from '../handler/manageBtnRole';
import {
	DeleteResolve,
	manageTicket,
	manageTicketOptions
} from '../handler/manageTicket';
import {
	EndResolve,
	RerollResolve,
	manageGiveaway,
	manageGiveawayOptions
} from '../handler/manageGiveaway';

/**
 * manageBtn() handles btnRole(), betterBtnRole(), giveaway() and ticketSetup() combined. As users don't use everything from the package. Using this combined handler was a mess. So we separated it into three handlers.
 *
 * @deprecated Use {@link manageBtnRole()} to handle btnRole() and betterBtnRole()
 * @deprecated Use {@link manageGiveaway()} to handle giveaway()
 * @deprecated Use {@link manageTicket()} to handle ticketSetup()
 */

export async function manageBtn(
	interaction: ButtonInteraction,
	options:
		| manageBtnRoleOptions
		| manageGiveawayOptions
		| manageTicketOptions = {}
): Promise<boolean | RerollResolve | DeleteResolve> {
	Deprecated({
		desc: 'manageBtn() is separated to three handlers. manageBtnRole() | manageTicket() | manageGiveaway()'
	});
	let resolve: boolean | RerollResolve | DeleteResolve | EndResolve;
	resolve = await manageBtnRole(interaction, options as manageBtnRoleOptions);
	resolve = await manageGiveaway(interaction, options as manageGiveawayOptions);
	resolve = await manageTicket(interaction, options as manageTicketOptions);
	return resolve;
}
