import { ButtonInteraction, GuildMember } from 'discord.js';
import gsys from '../model/giveaway';
import { SimplyError } from '../error';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

export type manageGiveawayOptions = {
	strict?: boolean;
};

// ------------------------------
// ------- P R O M I S E --------
// ------------------------------

type RerollResolve = {
	type?: 'Reroll';
	user?: GuildMember | GuildMember[];
	msgURL?: string;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A Giveaway Handler for **simplydjs giveaway system.**
 * @param interaction
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Handler/manageBtn***
 * @example simplydjs.manageBtn(interaction)
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
					const data = await gsys.findOne({
						message: interaction.message.id
					});

					if (Number(data.endTime) < Date.now()) return;
					else {
						if (data.requirements.type === 'role') {
							if (
								!(
									interaction.member.roles as unknown as GuildMemberManager
								).cache.find((r: any) => r.id === data.requirements.id)
							)
								return interaction.editReply({
									content:
										'You do not fall under the requirements. | You dont have the role'
								});
						}
						if (data.requirements.type === 'guild') {
							const g = interaction.client.guilds.cache.get(
								data.requirements.id
							);
							const mem = await g.members.fetch(interaction.member.user.id);

							if (!mem)
								return interaction.editReply({
									content:
										'You do not fall under the requirements. | Join the server.'
								});
						}

						const entris = data.entry.find(
							(id) => id.userID === member.user.id
						);

						if (entris) {
							await gsys.findOneAndUpdate(
								{
									message: interaction.message.id
								},
								{
									$pull: { entry: { userID: member.user.id } }
								}
							);

							data.entered = data.entered - 1;

							await data.save().then(async (a) => {
								await interaction.editReply({
									content: 'Left the giveaway ;('
								});
							});
						} else if (!entris) {
							data.entry.push({
								userID: member.user.id,
								guildID: interaction.guild.id,
								messageID: interaction.message.id
							});

							data.entered = data.entered + 1;

							await data.save().then(async (a) => {
								await interaction.editReply({
									content: 'Entered the giveaway !'
								});
							});
						}

						const eem = interaction.message.embeds[0];

						(
							interaction.message.components[0].components[0] as MessageButton
						).label = data.entered.toString();

						const mes = interaction.message as Message;
						mes.edit({
							embeds: [eem],
							components: interaction.message.components as MessageActionRow[]
						});
					}
				}

				if (
					interaction.customId === 'end_giveaway' ||
					interaction.customId === 'reroll_giveaway'
				) {
					const allComp = await interaction.message.components[0];
					const ftr = await interaction.message.embeds[0].footer;

					const embeded = new MessageEmbed()
						.setTitle('Processing Data...')
						.setColor(0xcc0000)
						.setDescription(
							`Please wait.. We are Processing the winner with some magiks`
						)
						.setFooter({
							text: 'Ending the Giveaway, Scraping the ticket..'
						});

					const msg = interaction.message as Message;

					await msg.edit({ embeds: [embeded], components: [] }).catch(() => {});

					const dispWin: string[] = [];

					const dt = await gsys.findOne({ message: msg.id });

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
