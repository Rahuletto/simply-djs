import { ButtonInteraction, GuildMemberRoleManager, Role } from 'discord.js';
import { SimplyError } from '../error';

// ------------------------------
// ----- I N T E R F A C E ------
// ------------------------------

/**
 * **Documentation Url** of the type: *https://simplyd.js.org/docs/handler/manageBtnRole#btnrolereplies*
 */

export interface BtnRoleReplies {
	add: string;
	remove: string;
}
// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/handler/manageBtnRole#managebtnroleoptions
 */

export type manageBtnRoleOptions = {
	reply?: BtnRoleReplies;
	strict?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A Button Role Handler for **simplydjs button role system.**
 * @param button
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/hhandler/manageBtnRole
 * @example simplydjs.manageBtnRole(interaction)
 */

export async function manageBtnRole(
	button: ButtonInteraction,
	options: manageBtnRoleOptions = {}
): Promise<boolean> {
	return new Promise(async (resolve) => {
		if (button.isButton()) {
			try {
				const member = button.member;

				if (button.customId.startsWith('role-')) {
					const roleId = button.customId.replace('role-', '');

					const role = await button.guild.roles.fetch(roleId, {
						force: true
					});
					if (!role) return;
					else {
						await button.deferReply({ ephemeral: true });
						if (
							!(member.roles as GuildMemberRoleManager).cache.find(
								(r: Role) => r.id === role.id
							)
						) {
							(member.roles as GuildMemberRoleManager)
								.add(role)
								.catch((err: any) => {
									resolve(false);
									if (options?.strict)
										throw new SimplyError({
											function: 'manageBtnRole',
											title: 'Role is higher than the bot. Missing Permissions',
											tip: err.stack
										});
									else
										button.channel.send({
											content:
												'ERROR: Role is higher than me. `Missing Permissions`'
										});
								});

							await button.editReply({
								content:
									options?.reply?.add ||
									`✅ Added the ${role.toString()} role to you.`
							});

							resolve(true);
						} else if (
							(member.roles as GuildMemberRoleManager).cache.find(
								(r: Role) => r.id === role.id
							)
						) {
							(member.roles as GuildMemberRoleManager)
								.remove(role)
								.catch((err: any) => {
									resolve(false);
									if (options?.strict)
										throw new SimplyError({
											function: 'manageBtnRole',
											title: 'Role is higher than the bot. Missing Permissions',
											tip: err.stack
										});
									else
										button.channel.send({
											content:
												'ERROR: Role is higher than me. `Missing Permissions`'
										});
								});

							await button.editReply({
								content:
									options?.reply?.remove ||
									`❌ Removed the ${role.toString()} role from you.`
							});
							resolve(true);
						}
					}
				}
			} catch (err: any) {
				if (options?.strict)
					throw new SimplyError({
						function: 'manageBtnRole',
						title: 'An Error occured when running the function ',
						tip: err.stack
					});
				else console.log(`SimplyError - manageBtnRole | Error: ${err.stack}`);
			}
		} else return;
	});
}
