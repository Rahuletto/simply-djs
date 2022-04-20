import {
	ColorResolvable,
	MessageActionRow,
	MessageButton,
	ButtonInteraction,
	Permissions,
	Message,
	MessageEmbed,
	User
} from 'discord.js';

import db from './model/suggestion';
import { APIMessage, APIEmbed } from 'discord-api-types';
import { votz } from './model/suggestion';
import chalk from 'chalk';

export type manageSugOptions = {
	deny?: { color: ColorResolvable };
	accept?: { color: ColorResolvable };
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * An **Suggestion** handler which handles all sugestions from the package
 * @param interaction
 * @param options
 * @example simplydjs.manageSug(interaction)
 */

export async function manageSug(
	interaction: ButtonInteraction,
	options: manageSugOptions = {}
) {
	let button = interaction;
	if (button.isButton()) {
		try {
			options.deny = {
				color: options?.deny?.color || 'RED'
			};

			options.accept = {
				color: options?.accept?.color || 'GREEN'
			};

			if (button.customId === 'no-sug') {
				let data = await db.findOne({
					message: button.message.id
				});
				if (!data) {
					data = new db({
						message: button.message.id
					});
					await data.save().catch(() => {});
				}

				let oldemb = button.message.embeds[0];

				if (
					// @ts-ignore
					button.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
				) {
					let surebtn = new MessageButton()
						.setStyle('DANGER')
						.setLabel('Downvote Suggestion')
						.setCustomId('no-vote');

					let nobtn = new MessageButton()
						.setStyle('PRIMARY')
						.setLabel('Deny Suggestion')
						.setCustomId('deny-sug');

					let row1 = new MessageActionRow().addComponents([surebtn, nobtn]);

					let msg: Message | APIMessage = await button.reply({
						content: 'Do you want to Deny suggestion (or) Vote ?',
						components: [row1],
						ephemeral: true,
						fetchReply: true
					});

					let ftter = (m: any) => button.user.id === m.user.id;
					let coll = (msg as Message).createMessageComponentCollector({
						filter: ftter,
						componentType: 'BUTTON',
						time: 30000
					});
					coll.on('collect', async (btn) => {
						if (btn.customId === 'no-vote') {
							let vt = data.votes.find(
								(m) => m.user.toString() === btn.user.id
							);
							let ot: any[] | votz =
								data.votes.find((m) => m.user.toString() !== btn.user.id) || [];

							if (!Array.isArray(ot)) {
								ot = [ot];
							}

							if (!vt || vt.vote === null) {
								let vot = { user: btn.user.id, vote: 'down' };
								ot.push(vot);
								data.votes = ot;
								await data.save().catch(() => {});

								await calc(oldemb, button.message);

								await button.editReply({
									content:
										'You **downvoted** the suggestion. | Suggestion ID: ' +
										`\`${button.message.id}\``,
									components: []
								});
							} else if (vt) {
								if (vt.vote === 'down') {
									data.votes = ot;
									await data.save().catch(() => {});

									await calc(oldemb, button.message);

									await button.editReply({
										content: 'Removing your **downvote**',
										components: []
									});
								} else if (vt.vote === 'up') {
									let vot = { user: btn.user.id, vote: 'down' };
									ot.push(vot);
									data.votes = ot;
									await data.save().catch(() => {});

									await calc(oldemb, button.message);

									await button.editReply({
										content:
											'You **downvoted** the suggestion. | Suggestion ID: ' +
											`\`${button.message.id}\``,
										components: []
									});
								}
							}
						} else if (btn.customId === 'deny-sug') {
							if (
								// @ts-ignore
								!btn.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
							)
								return;
							let filter = (m: any) => button.user.id === m.author.id;

							await button.editReply({
								content:
									'Tell me a reason to deny the suggestion. Say `cancel` to cancel. | Time: 2 minutes',
								components: []
							});

							let msgCl = btn.channel.createMessageCollector({
								filter,

								time: 120000
							});

							msgCl.on('collect', (m) => {
								if (m.content.toLowerCase() === 'cancel') {
									m.delete();
									button.editReply('Cancelled your denial');
									msgCl.stop();
								} else {
									m.delete();
									dec(m.content, oldemb, button.message, button.user);
									msgCl.stop();
								}
							});

							msgCl.on('end', (collected) => {
								if (collected.size === 0) {
									dec('No Reason', oldemb, button.message, button.user);
								}
							});
						}
					});
				} else if (
					// @ts-ignore
					!button.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
				) {
					let vt = data.votes.find((m) => m.user.toString() === button.user.id);
					let ot: any[] | votz =
						data.votes.find((m) => m.user.toString() !== button.user.id) || [];

					if (!Array.isArray(ot)) {
						ot = [ot];
					}

					if (!vt || vt.vote === null) {
						let vot = { user: button.user.id, vote: 'down' };
						ot.push(vot);
						data.votes = ot;
						await data.save().catch(() => {});

						await calc(oldemb, button.message);

						await button.editReply({
							content:
								'You **downvoted** the suggestion. | Suggestion ID: ' +
								`\`${button.message.id}\``,
							components: []
						});
					} else if (vt) {
						if (vt.vote === 'down') {
							data.votes = ot;
							await data.save().catch(() => {});

							await calc(oldemb, button.message);

							await button.editReply({
								content: 'Removing your **downvote**',
								components: []
							});
						} else if (vt.vote === 'up') {
							let vot = { user: button.user.id, vote: 'down' };
							ot.push(vot);
							data.votes = ot;
							await data.save().catch(() => {});

							await calc(oldemb, button.message);

							await button.editReply({
								content:
									'You **downvoted** the suggestion. | Suggestion ID: ' +
									`\`${button.message.id}\``,
								components: []
							});
						}
					}
				}
			}

			if (button.customId === 'agree-sug') {
				let data = await db.findOne({
					message: button.message.id
				});
				if (!data) {
					data = new db({
						message: button.message.id
					});
					await data.save().catch(() => {});
				}

				let oldemb = button.message.embeds[0];

				if (
					// @ts-ignore
					button.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
				) {
					let surebtn = new MessageButton()
						.setStyle('SUCCESS')
						.setLabel('Upvote Suggestion')
						.setCustomId('yes-vote');

					let nobtn = new MessageButton()
						.setStyle('PRIMARY')
						.setLabel('Accept Suggestion')
						.setCustomId('accept-sug');

					let row1 = new MessageActionRow().addComponents([surebtn, nobtn]);

					let msg = await button.reply({
						content: 'Do you want to Accept suggestion (or) Vote ?',
						components: [row1],
						ephemeral: true,
						fetchReply: true
					});

					let ftter = (m: any) => button.user.id === m.user.id;
					let coll = (msg as Message).createMessageComponentCollector({
						filter: ftter,
						componentType: 'BUTTON',
						time: 30000
					});
					coll.on('collect', async (btn) => {
						if (btn.customId === 'yes-vote') {
							let vt = data.votes.find(
								(m) => m.user.toString() === btn.user.id
							);
							let ot: any[] | votz =
								data.votes.find((m) => m.user.toString() !== btn.user.id) || [];

							if (!Array.isArray(ot)) {
								ot = [ot];
							}

							if (!vt || vt.vote === null) {
								let vot = { user: btn.user.id, vote: 'up' };
								ot.push(vot);
								data.votes = ot;
								await data.save().catch(() => {});

								await calc(oldemb, button.message);
								await button.editReply({
									content:
										'You **upvoted** the suggestion. | Suggestion ID: ' +
										`\`${button.message.id}\``,
									components: []
								});
							} else if (vt) {
								if (vt.vote === 'up') {
									data.votes = ot;
									await data.save().catch(() => {});

									await calc(oldemb, button.message);

									await button.editReply({
										content: 'Removing your **upvote**',
										components: []
									});
								} else if (vt.vote === 'down') {
									let vot = { user: btn.user.id, vote: 'up' };
									ot.push(vot);
									data.votes = ot;
									await data.save().catch(() => {});

									await calc(oldemb, button.message);

									await button.editReply({
										content:
											'You **upvoted** the suggestion. | Suggestion ID: ' +
											`\`${button.message.id}\``,
										components: []
									});
								}
							}
						} else if (btn.customId === 'accept-sug') {
							if (
								// @ts-ignore
								!button.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
							)
								return;
							let filter = (m: any) => button.user.id === m.author.id;

							await button.editReply({
								content:
									'Tell me a reason to accept the suggestion. Say `cancel` to cancel. | Time: 2 minutes',
								components: []
							});

							let msgCl = btn.channel.createMessageCollector({
								filter,
								time: 120000
							});

							msgCl.on('collect', (m) => {
								if (m.content.toLowerCase() === 'cancel') {
									m.delete();
									button.editReply('Cancelled to accept');
									msgCl.stop();
								} else {
									m.delete();
									aprov(m.content, oldemb, button.message, button.user);
									msgCl.stop();
								}
							});

							msgCl.on('end', (collected) => {
								if (collected.size === 0) {
									aprov('No Reason', oldemb, button.message, button.user);
								}
							});
						}
					});
				} else if (
					// @ts-ignore
					!button.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
				) {
					let vt = data.votes.find((m) => m.user.toString() === button.user.id);
					let ot: any[] | votz =
						data.votes.find((m) => m.user.toString() !== button.user.id) || [];

					if (!Array.isArray(ot)) {
						ot = [ot];
					}

					if (!vt || vt.vote === null) {
						let vot = { user: button.user.id, vote: 'up' };
						ot.push(vot);
						data.votes = ot;
						await data.save().catch(() => {});

						await calc(oldemb, button.message);
						await button.editReply({
							content:
								'You **upvoted** the suggestion. | Suggestion ID: ' +
								`\`${button.message.id}\``,
							components: []
						});
					} else if (vt) {
						if (vt.vote === 'up') {
							data.votes = ot;
							await data.save().catch(() => {});

							await calc(oldemb, button.message);

							await button.editReply({
								content: 'Removing your **upvote**',
								components: []
							});
						} else if (vt.vote === 'down') {
							let vot = { user: button.user.id, vote: 'up' };
							ot.push(vot);
							data.votes = ot;
							await data.save().catch(() => {});

							await calc(oldemb, button.message);

							await button.editReply({
								content:
									'You **upvoted** the suggestion. | Suggestion ID: ' +
									`\`${button.message.id}\``,
								components: []
							});
						}
					}
				}
			}

			async function calc(
				oldemb: MessageEmbed | APIEmbed,
				msg: Message | APIMessage
			) {
				let data = await db.findOne({
					message: button.message.id
				});

				let l: any[] = [];
				let d: any[] = [];

				if (data.votes === [] || !data.votes) {
					l.length = 0;
					d.length = 0;
				} else {
					data.votes.forEach((v) => {
						if (v.vote === 'up') {
							l.push(v);
						} else if (v.vote === 'down') {
							d.push(v);
						}
					});
				}

				let dislik = d.length;
				let lik = l.length;

				if (lik <= 0) {
					lik = 0;
				}
				if (dislik <= 0) {
					dislik = 0;
				}

				let total = data.votes.length;

				let uPercent = (100 * lik) / total;

				let dPercent = (dislik * 100) / total;

				let st = '⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛';

				if (uPercent / 10 + dPercent / 10 != 0 || total != 0)
					st = '🟩'.repeat(uPercent / 10) + '🟥'.repeat(dPercent / 10);

				(msg.components[0].components[0] as MessageButton).label =
					lik.toString();

				(msg.components[0].components[1] as MessageButton).label =
					dislik.toString();

				oldemb.fields[1].value = `${st} [${uPercent}% - ${dPercent}%]`;

				(button.message as Message).edit({
					embeds: [oldemb],
					components: msg.components as MessageActionRow[]
				});
			}

			async function dec(
				reason: string,
				oldemb: MessageEmbed | APIEmbed,
				msg: Message | APIMessage,
				user: User
			) {
				oldemb = oldemb as MessageEmbed;

				oldemb.fields[0].value = `Declined\n\n**Reason:** \`${reason}\``;
				oldemb.setColor(options?.deny?.color || 'RED');
				oldemb.setFooter({ text: `Declined by ${user.tag}` });

				msg.components[0].components[0].disabled = true;
				msg.components[0].components[1].disabled = true;

				(button.message as Message).edit({
					embeds: [oldemb],
					components: msg.components as MessageActionRow[]
				});
			}

			async function aprov(
				reason: string,
				oldemb: MessageEmbed | APIEmbed,
				msg: Message | APIMessage,
				user: User
			) {
				oldemb = oldemb as MessageEmbed;

				oldemb.fields[0].value = `Accepted\n\n**Reason:** \`${reason}\``;
				oldemb.setColor(options?.accept?.color || 'GREEN');
				oldemb.setFooter({ text: `Accepted by ${user.tag}` });

				msg.components[0].components[0].disabled = true;
				msg.components[0].components[1].disabled = true;

				(button.message as Message).edit({
					embeds: [oldemb],
					components: msg.components as MessageActionRow[]
				});
			}
		} catch (err: any) {
			console.log(
				`${chalk.red('Error Occured.')} | ${chalk.magenta(
					'manageSug'
				)} | Error: ${err.stack}`
			);
		}
	}
}
