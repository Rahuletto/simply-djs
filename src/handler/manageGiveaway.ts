// @ts-nocheck

import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	EmbedBuilder,
	GuildMember,
	GuildMemberRoleManager,
	Message,
	Role
} from 'discord.js';
import model from '../model/giveaway';
import { SimplyError } from '../error';
import { toRgb } from '../misc';
import { CustomizableEmbed } from '../interfaces';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

interface Embeds {
	load?: CustomizableEmbed;
	result?: CustomizableEmbed;
}

export type manageGiveawayOptions = {
	embed?: Embeds;
	strict?: boolean;
};

// ------------------------------
// ------- P R O M I S E --------
// ------------------------------

type RerollResolve = {
	type?: 'Reroll';
	user?: GuildMember | GuildMember[];
	url?: string;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A Giveaway Handler for **simplydjs giveaway system.**
 * @param interaction
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Handler/manageGiveaway***
 * @example simplydjs.manageGiveaway(interaction)
 */

export async function manageGiveaway(
	interaction: ButtonInteraction,
	options: manageGiveawayOptions = {}
): Promise<RerollResolve> {
	return new Promise(async (resolve) => {
		if (interaction.isButton()) {
			try {
				const member = interaction.member;

				// ------------------------------
				// ------ G I V E A W A Y -------
				// ------------------------------

				if (interaction.customId === 'enter_giveaway') {
					await interaction.deferReply({ ephemeral: true });
					const data = await model.findOne({
						message: interaction.message.id
					});

					if (Number(data.endTime) < Date.now()) return;
					else {
						if (data.requirements.type === 'role') {
							if (
								!(
									interaction.member.roles as GuildMemberRoleManager
								).cache.find((r: Role) => r.id === data.requirements.id)
							)
								return interaction.editReply({
									content:
										"You do not fall under the requirements. (You don't have the required role)"
								});
						}
						if (data.requirements.type === 'guild') {
							const guild = interaction.client.guilds.cache.get(
								data.requirements.id
							);
							const isMember = await guild.members.fetch(
								interaction.member.user.id
							);

							if (!isMember)
								return interaction.editReply({
									content:
										'You do not fall under the requirements. (You are not in the required guild)'
								});
						}

						const entries = data.entry.find(
							(id) => id.userID === member.user.id
						);

						if (entries) {
							await model.findOneAndUpdate(
								{
									message: interaction.message.id
								},
								{
									$pull: { entry: { userID: member.user.id } }
								}
							);

							data.entered = data.entered - 1;

							await data.save().then(async () => {
								await interaction.editReply({
									content: "You've left the giveaway."
								});
							});
						} else if (!entries) {
							data.entry.push({
								userID: member.user.id,
								guildID: interaction.guild.id,
								messageID: interaction.message.id
							});

							data.entered = data.entered + 1;

							await data.save().then(async () => {
								await interaction.editReply({
									content: "You've entered the giveaway."
								});
							});
						}

						const embeds = interaction.message.embeds[0];

						const row = ActionRowBuilder.from(
							interaction.message.components[0]
						);

						(row.components[0] as ButtonBuilder).setLabel(
							data.entered.toString()
						);

						const message = interaction.message as Message;
						message.edit({
							embeds: [embeds],
							components: [row as ActionRowBuilder<ButtonBuilder>]
						});
					}
				}

				if (
					interaction.customId === 'end_giveaway' ||
					interaction.customId === 'reroll_giveaway'
				) {
					const components = ActionRowBuilder.from(
						interaction.message.components[0]
					);

					const footer = interaction.message.embeds[0].footer;

					const loadEmbed = new EmbedBuilder()
						.setTitle(options?.embed?.load?.title || 'Processing Data...')
						.setColor(options?.embed?.load?.color || toRgb('#cc0000'))
						.setDescription(
							options?.embed?.load?.description ||
								`Please wait.. We are shuffling the members to pick a winner.`
						)
						.setFooter(
							options?.embed?.load?.footer || {
								text: 'Ending the Giveaway, Scraping the ticket..'
							}
						);

					if (options?.embed?.load?.fields)
						loadEmbed.setFields(options?.embed?.load?.fields);
					if (options?.embed?.load?.author)
						loadEmbed.setAuthor(options?.embed?.load?.author);
					if (options?.embed?.load?.image)
						loadEmbed.setImage(options?.embed?.load?.image);
					if (options?.embed?.load?.thumbnail)
						loadEmbed.setThumbnail(options?.embed?.load?.thumbnail);
					if (options?.embed?.load?.timestamp)
						loadEmbed.setTimestamp(options?.embed?.load?.timestamp);
					if (options?.embed?.load?.title)
						loadEmbed.setTitle(options?.embed?.load?.title);
					if (options?.embed?.load?.url)
						loadEmbed.setURL(options?.embed?.load?.url);

					const msg = interaction.message as Message;

					await msg
						.edit({ embeds: [loadEmbed], components: [] })
						.catch(() => {});

					const displayWinner: string[] = [];

					const dt = await model.findOne({ message: msg.id });

					dt.endTime = undefined;
					await dt.save().catch(() => {});

					const winArr: any[] = [];

					const winCt = dt.winCount;

					const entries = dt.entry;

					if (dt.entered > 0) {
						for (let i = 0; i < winCt; i++) {
							const winno = Math.floor(Math.random() * dt.entered);

							winArr.push(entries[winno]);
						}
					}

					setTimeout(() => {
						winArr.forEach(async (name) => {
							await interaction.guild.members
								.fetch(name.userID)
								.then((user) => {
									dispWin.push(`<@${user.user.id}>`);

									const embod = new MessageEmbed()
										.setTitle('You.. Won the Giveaway !')
										.setDescription(
											`You just won \`${dt.prize}\` in the Giveaway at \`${user.guild.name}\` Go claim it fast !`
										)
										.setColor(0x075fff)
										.setFooter(ftr);

									const gothe = new MessageButton()
										.setLabel('View Giveaway')
										.setStyle('LINK')
										.setURL(msg.url);

									const entrow = new MessageActionRow().addComponents([gothe]);

									return user
										.send({ embeds: [embod], components: [entrow] })
										.catch(() => {});
								})
								.catch(() => {});
						});
					}, ms('2s'));

					setTimeout(async () => {
						if (!dt) return await msg.delete();
						if (dt) {
							const embed = interaction.message.embeds[0];

							const tim = Number(dt.endTime);
							const f: EmbedFieldData[] = [];
							embed.fields.forEach((a) => {
								if (a.name === 'Requirements') return;
								a.value = a.value
									.replaceAll('{hosted}', `<@${dt.host}>`)
									.replaceAll('{endsAt}', `<t:${tim}:f>`)
									.replaceAll('{prize}', dt.prize.toString())

									.replaceAll('{winCount}', dt.winCount.toString())
									.replaceAll('{entered}', dt.entered.toString());

								f.push(a);
							});

							if (dt.entered <= 0 || !winArr[0]) {
								(embed as MessageEmbed)
									.setTitle('No one entered')

									.setFields(f)
									.setColor('RED')
									.setFooter(ftr);

								return await msg.edit({
									embeds: [embed],
									components: []
								});
							}

							const resWin: GuildMember[] = [];

							allComp.components[0].disabled = true;
							allComp.components[1].disabled = false;
							allComp.components[2].disabled = true;

							(embed as MessageEmbed)
								.setTitle('We got the winner !')
								.setDescription(`${dispWin.join(', ')} won the prize !\n`)
								.setFields(f)
								.setColor(0x3bb143)
								.setFooter(ftr);
							//@ts-ignore
							await msg.edit({ embeds: [embed], components: [allComp] });

							if (interaction.customId === 'reroll_giveaway') {
								resolve({
									type: 'Reroll',
									msgURL: msg.url,
									user: resWin
								});
							}
						}
					}, 5200);
				}

				// 		const timer = setInterval(async () => {
				// 	if (!msg) return;

				// 	const components = await ActionRowBuilder.from(msg?.components[0]);

				// 	const data = await model.findOne({ message: msg.id });

				// 	if (data.endTime && Number(data.endTime) < Date.now()) {
				// 		const processEmbed = new EmbedBuilder()
				// 			.setTitle('Processing Data...')
				// 			.setColor(toRgb('#cc0000'))
				// 			.setDescription(
				// 				`Please wait.. We are shuffling the members to pick a winner.`
				// 			)
				// 			.setFooter({
				// 				text: 'Ending the Giveaway, Scraping the ticket..'
				// 			});

				// 		clearInterval(timer);

				// 		await msg
				// 			.edit({ embeds: [processEmbed], components: [] })
				// 			.catch(() => {});

				// 		const displayWinner: string[] = [];

				// 		const winArray: Entry[] = [];

				// 		const count = data.winCount;

				// 		const entries = data.entry;

				// 		for (let i = 0; i < count; i++) {
				// 			const win = Math.floor(Math.random() * data.entered);

				// 			winArray.push(entries[win]);
				// 		}

				// 		setTimeout(() => {
				// 			winArray.forEach(async (name) => {
				// 				displayWinner.push(`<@${name?.userID}>`)

				// 						const winnerEmbed	 = new EmbedBuilder()
				// 							.setTitle('You.. Won the Giveaway !')
				// 							.setDescription(
				// 								`You just won \`${dt.prize}\` in the Giveaway at \`${user.guild.name}\` Go claim it fast !`
				// 							)
				// 							.setColor(0x075fff)
				// 							.setFooter(
				// 								options.embed?.credit === false
				// 									? options.embed?.footer
				// 									: {
				// 											text: '©️ Rahuletto. npm i simply-djs',
				// 											iconURL: 'https://i.imgur.com/XFUIwPh.png'
				// 									  }
				// 							);

				// 						const gothe = new MessageButton()
				// 							.setLabel('View Giveaway')
				// 							.setStyle('LINK')
				// 							.setURL(msg.url);

				// 						const entrow = new MessageActionRow().addComponents([
				// 							gothe
				// 						]);

				// 						return user
				// 							.send({ embeds: [embod], components: [entrow] })
				// 							.catch(() => {});
				// 					})
				// 					.catch(() => {});
				// 			});
				// 		}, ms('2s'));

				// 		setTimeout(async () => {
				// 			if (!dt) return await msg.delete();
				// 			if (dt) {
				// 				const tim = Number(dt.endTime.slice(0, -3));
				// 				const f: EmbedFieldData[] = [];
				// 				if (options.fields) {
				// 					options.fields.forEach((a) => {
				// 						a.value = a.value
				// 							.replaceAll('{hosted}', `<@${dt.host}>`)
				// 							.replaceAll('{endsAt}', `<t:${tim}:f>`)
				// 							.replaceAll('{prize}', dt.prize.toString())
				// 							.replaceAll(
				// 								'{requirements}',
				// 								req === 'None'
				// 									? 'None'
				// 									: req + ' | ' + (req === 'Role' ? `${val}` : val)
				// 							)
				// 							.replaceAll('{winCount}', dt.winCount.toString())
				// 							.replaceAll('{entered}', dt.entered.toString());

				// 						f.push(a);
				// 					});
				// 				}

				// 				if (dt.entered <= 0 || !winArr[0]) {
				// 					embed
				// 						.setTitle('No one entered')

				// 						.setFields(f)
				// 						.setColor('RED')
				// 						.setFooter(
				// 							options.embed?.credit === false
				// 								? options.embed?.footer
				// 								: {
				// 										text: '©️ Rahuletto. npm i simply-djs',
				// 										iconURL: 'https://i.imgur.com/XFUIwPh.png'
				// 								  }
				// 						);

				// 					return await msg.edit({
				// 						embeds: [embed],
				// 						components: []
				// 					});
				// 				}

				// 				embed
				// 					.setTitle('We got the winner !')
				// 					.setDescription(
				// 						`${dispWin.join(', ')} got the prize !\n\n` +
				// 							(
				// 								options.embed?.description ||
				// 								`Interact with the giveaway using the buttons.`
				// 							)
				// 								.replaceAll('{hosted}', `<@${dt.host}>`)
				// 								.replaceAll('{prize}', dt.prize)
				// 								.replaceAll('{endsAt}', `<t:${dt.endTime}:R>`)
				// 								.replaceAll(
				// 									'{requirements}',
				// 									req === 'None'
				// 										? 'None'
				// 										: req + ' | ' + (req === 'Role' ? `${val}` : val)
				// 								)
				// 								.replaceAll('{winCount}', dt.winCount.toString())
				// 								.replaceAll('{entered}', dt.entered.toString())
				// 					)
				// 					.setFields(options.fields)
				// 					.setColor(0x3bb143)
				// 					.setFooter(
				// 						options.embed?.credit === false
				// 							? options.embed?.footer
				// 							: {
				// 									text: '©️ Rahuletto. npm i simply-djs',
				// 									iconURL: 'https://i.imgur.com/XFUIwPh.png'
				// 							  }
				// 					);

				// 				allComp.components[0].disabled = true;
				// 				allComp.components[1].disabled = false;
				// 				allComp.components[2].disabled = true;

				// 				await msg.edit({
				// 					embeds: [embed],
				// 					components: [allComp]
				// 				});
				// 			}
				// 		}, ms('6s'));
				// 	}
				// }, ms('5s'));
			} catch (err: any) {
				if (options.strict)
					throw new SimplyError({
						function: 'manageGiveaway',
						title: 'An Error occured when running the function ',
						tip: err.stack
					});
				else console.log(`SimplyError - manageGiveaway | Error: ${err.stack}`);
			}
		} else return;
	});
}
