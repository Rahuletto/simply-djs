import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
	APIEmbedField,
	GuildMember,
	GuildMemberRoleManager,
	Message,
	Role,
	PermissionFlagsBits,
	PermissionsBitField
} from 'discord.js';
import model, { Entry } from '../model/giveaway';
import { SimplyError } from '../error';
import { disableButtons, ms, toRgb } from '../misc';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

export type manageGiveawayOptions = {
	strict?: boolean;
};

// ------------------------------
// ------- P R O M I S E --------
// ------------------------------

export type RerollResolve = {
	type?: 'Reroll';
	user?: GuildMember[];
	url?: string;
};

export type EndResolve = {
	type?: 'End';
	user?: GuildMember[];
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
): Promise<RerollResolve | EndResolve> {
	return new Promise(async (resolve) => {
		if (interaction.isButton()) {
			try {
				const member = interaction.member;

				// ------------------------------
				// ------ G I V E A W A Y -------
				// ------------------------------

				if (interaction.customId === 'enter_giveaway') {
					await interaction.deferUpdate();
					const data = await model.findOne({
						message: interaction.message.id
					});

					if (Number(data.endTime) < Date.now())
						return await interaction.followUp({
							content: 'Wait a second, This event has already ended',
							ephemeral: true
						});
					else {
						const entries = data.entry.find(
							(id) => id?.userId === member.user.id
						);

						if (entries) {
							await model.findOneAndUpdate(
								{
									message: interaction.message.id
								},
								{
									$pull: { entry: { userId: member.user.id } }
								}
							);

							data.entered = data.entered - 1;

							await data.save().then(async () => {
								return await interaction.followUp({
									content: "You've left the giveaway.",
									ephemeral: true
								});
							});
						} else if (!entries) {
							if (data?.requirements?.type === 'role') {
								if (
									!(
										interaction.member.roles as GuildMemberRoleManager
									).cache.find((r: Role) => r.id === data?.requirements?.id)
								)
									return await interaction.followUp({
										content:
											"You do not fall under the requirements. (You don't have the required role)",
										ephemeral: true
									});
							}
							if (data?.requirements?.type === 'guild') {
								const guild = interaction.client.guilds.cache.get(
									data?.requirements?.id
								);
								const isMember = await guild.members.fetch(
									interaction.member.user.id
								);

								if (!isMember)
									return await interaction.followUp({
										content:
											'You do not fall under the requirements. (You are not in the required guild)',
										ephemeral: true
									});
							}

							data.entry.push({
								userId: member.user.id,
								guildId: interaction.guild.id,
								messageId: interaction.message.id
							});

							data.entered = data.entered + 1;

							await data.save().then(async () => {
								await interaction.followUp({
									content: "You've entered the giveaway.",
									ephemeral: true
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
					if (
						!(interaction.member.permissions as PermissionsBitField).has(
							PermissionFlagsBits.Administrator
						) ||
						!(interaction.member.permissions as PermissionsBitField).has(
							PermissionFlagsBits.ManageEvents
						)
					)
						return await interaction.reply({
							content:
								'You cannot end/reroll the giveaway. You do not have the required permissions. `Administrator` (or) `Manage Events`',
							ephemeral: true
						});

					await interaction.deferUpdate();

					const msg = interaction.message as Message;

					const components = ActionRowBuilder.from(msg.components[0]);

					const data = await model.findOne({ message: msg.id });

					const oldFields = msg.embeds[0].fields;

					const loadEmbed = new EmbedBuilder()
						.setTitle(
							data?.embeds?.load?.title ||
								(interaction.customId === 'reroll_giveaway'
									? 'Rerolling the giveaway'
									: 'Processing Giveaway...')
						)
						.setColor(data?.embeds?.load?.color || toRgb('#cc0000'))
						.setDescription(
							data?.embeds?.load?.description ||
								`Please wait.. We are shuffling the tickets to pick a winner.`
						)
						.setFooter(
							data?.embeds?.load?.footer || {
								text: 'Ending the Giveaway, Choosing a winner...'
							}
						);

					if (data?.embeds?.load?.fields)
						loadEmbed.setFields(data?.embeds?.load?.fields);
					if (data?.embeds?.load?.author)
						loadEmbed.setAuthor(data?.embeds?.load?.author);
					if (data?.embeds?.load?.image)
						loadEmbed.setImage(data?.embeds?.load?.image);
					if (data?.embeds?.load?.thumbnail)
						loadEmbed.setThumbnail(data?.embeds?.load?.thumbnail);
					if (data?.embeds?.load?.timestamp)
						loadEmbed.setTimestamp(data?.embeds?.load?.timestamp);
					if (data?.embeds?.load?.title)
						loadEmbed.setTitle(data?.embeds?.load?.title);
					if (data?.embeds?.load?.url)
						loadEmbed.setURL(data?.embeds?.load?.url);

					await msg
						.edit({ embeds: [loadEmbed], components: [] })
						.catch(() => {});

					const displayWinner: string[] = [];

					data.endTime = undefined;
					await data.save().catch(() => {});

					const winnerArray: Entry[] = [];

					const winnerCount = data.winCount;

					const entries = data.entry;

					if (data.entered > 0) {
						for (let i = 0; i < winnerCount; i++) {
							const winno = Math.floor(Math.random() * data.entered);

							winnerArray.push(entries[winno]);
						}
					}

					const resultWinner: GuildMember[] = [];

					setTimeout(() => {
						winnerArray.forEach(async (name) => {
							await interaction.guild.members
								.fetch(name.userId)
								.then((member) => {
									resultWinner.push(member);
									displayWinner.push(`<@${member.user.id}>`);

									const dmEmbed: EmbedBuilder = new EmbedBuilder()
										.setTitle('You, Won the Giveaway!')
										.setDescription(
											`You just won \`${data.prize}\` in the Giveaway at \`${member.guild.name}\` Go claim it fast !`
										)
										.setColor('DarkGreen')
										.setFooter({ text: 'GG winner.' });

									const linkButton = new ButtonBuilder()
										.setLabel('View Giveaway')
										.setStyle(ButtonStyle.Link)
										.setURL(msg.url);

									const linkRow =
										new ActionRowBuilder<ButtonBuilder>().addComponents([
											linkButton
										]);

									return member
										.send({ embeds: [dmEmbed], components: [linkRow] })
										.catch(() => {});
								})
								.catch(() => {});
						});
					}, ms('2s'));

					setTimeout(async () => {
						if (!data) return await msg.delete();
						if (data) {
							const embed = EmbedBuilder.from(interaction.message.embeds[0]);

							const time = Number(data.endTime);
							const fields: APIEmbedField[] = [];
							data?.embeds?.result?.fields.forEach((a) => {
								if (a.name === 'Requirements') return;
								a.value = a.value
									.replaceAll('{hosted}', `<@${data.host}>`)
									.replaceAll('{endsAt}', `<t:${time}:f>`)
									.replaceAll('{prize}', data.prize.toString())

									.replaceAll('{winCount}', data.winCount.toString())
									.replaceAll('{entered}', data.entered.toString());

								fields.push(a);
							});

							if (data.entered <= 0 || !winnerArray[0]) {
								embed
									.setTitle('No one entered')

									.setFields(fields || oldFields)
									.setColor(toRgb('#cc0000'))
									.setFooter({
										text: 'Ohh man, Its ok lets get another giveaway goin.'
									});

								return await msg.edit({
									embeds: [embed],
									components: disableButtons([
										components as ActionRowBuilder<ButtonBuilder>
									])
								});
							}

							const b1 = ButtonBuilder.from(
								(components as ActionRowBuilder<ButtonBuilder>).components[0]
							).setDisabled(true);
							const b2 = ButtonBuilder.from(
								(components as ActionRowBuilder<ButtonBuilder>).components[1]
							).setDisabled(false);
							const b3 = ButtonBuilder.from(
								(components as ActionRowBuilder<ButtonBuilder>).components[2]
							).setDisabled(true);

							const buttonRow =
								new ActionRowBuilder<ButtonBuilder>().setComponents([
									b1,
									b2,
									b3
								]);

							const resultEmbed = new EmbedBuilder()
								.setTitle(data?.embeds?.result?.title || 'And the winner is,')
								.setColor(data?.embeds?.result?.color || 'DarkGreen')
								.setDescription(
									data?.embeds?.result?.description.replaceAll(
										'{winners}',
										displayWinner.join(', ')
									) ||
										`${displayWinner.join(
											', '
										)} won the prize!\nGet in touch with the staff members to collect your prize.`
								)
								.setFooter(
									data?.embeds?.result?.footer || { text: 'GG winner.' }
								)
								.setFields(fields || oldFields);

							if (data?.embeds?.result?.author)
								resultEmbed.setAuthor(data?.embeds?.result?.author);
							if (data?.embeds?.result?.image)
								resultEmbed.setImage(data?.embeds?.result?.image);
							if (data?.embeds?.result?.thumbnail)
								resultEmbed.setThumbnail(data?.embeds?.result?.thumbnail);
							if (data?.embeds?.result?.timestamp)
								resultEmbed.setTimestamp(data?.embeds?.result?.timestamp);
							if (data?.embeds?.result?.title)
								resultEmbed.setTitle(data?.embeds?.result?.title);
							if (data?.embeds?.result?.url)
								resultEmbed.setURL(data?.embeds?.result?.url);

							await msg.edit({
								embeds: [resultEmbed],
								components: [buttonRow]
							});

							if (interaction.customId === 'reroll_giveaway') {
								resolve({
									type: 'Reroll',
									url: msg.url,
									user: resultWinner
								});
							} else
								resolve({
									type: 'End',
									url: msg.url,
									user: resultWinner
								});
						}
					}, ms('6s'));
				}
			} catch (err: any) {
				if (options?.strict)
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
