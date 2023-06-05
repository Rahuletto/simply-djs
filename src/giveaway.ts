import {
	ButtonStyle,
	GuildTextBasedChannel,
	Guild,
	Message,
	PermissionFlagsBits,
	Role,
	TextChannel,
	ButtonBuilder,
	ActionRowBuilder,
	Invite,
	Collection,
	EmbedBuilder,
	GuildMember,
	APIEmbedField
} from 'discord.js';
import {
	ExtendedInteraction,
	ExtendedMessage,
	CustomizableEmbed,
	CustomizableButton
} from './typedef';

import model, { Entry } from './model/giveaway';
import { toButtonStyle, disableButtons, ms, toRgb } from './misc';
import { SimplyError } from './error';
import { EndResolve } from './handler/manageGiveaway';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/systems/giveaway#requirements
 */

export interface Requirements {
	type: 'Role' | 'Guild' | 'None';
	id: string;
}

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/systems/giveaway#giveawaybuttons
 */

export interface GiveawayButtons {
	enter?: CustomizableButton;
	end?: CustomizableButton;
	reroll?: CustomizableButton;
}

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/systems/giveaway#giveawayembeds
 */

export interface GiveawayEmbeds {
	giveaway?: CustomizableEmbed;
	load?: CustomizableEmbed;
	result?: CustomizableEmbed;
}

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/systems/giveaway#giveawayoptions
 */

export type giveawayOptions = {
	prize?: string;
	winners?: number;
	channel?: GuildTextBasedChannel | TextChannel;
	time?: string;

	buttons?: GiveawayButtons;

	manager?: Role | string;

	requirements?: Requirements;
	pingRole?: Role | string;

	embed?: GiveawayEmbeds;

	type?: 'Label' | 'Emoji' | 'Both';
	strict?: boolean;
};

// ------------------------------
// ------ R E S O L V E S -------
// ------------------------------

/**
 * **Documentation Url** of the resolve: https://simplyd.js.org/docs/systems/giveaway#giveawayresolve
 */

export interface GiveawayResolve {
	message: Message;
	winners: number;
	prize: string;
	endsAt: number;
	requirements: { type: 'None' | 'Role' | 'Guild'; value: Guild | Role };
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A **Powerful** yet simple giveaway system | *Required: **manageGiveaway()
 * @param msgOrInt
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/systems/giveway
 * @example simplydjs.giveaway(interaction)
 */

export async function giveaway(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: giveawayOptions = { strict: false }
): Promise<GiveawayResolve | EndResolve> {
	return new Promise(async (resolve) => {
		try {
			const { client } = msgOrInt;

			let interaction: ExtendedInteraction;
			if (msgOrInt.commandId) {
				interaction = msgOrInt as ExtendedInteraction;
				if (!interaction.deferred)
					await interaction.deferReply({ fetchReply: true });
			}
			const extInteraction = msgOrInt as ExtendedInteraction;
			const extMessage = msgOrInt as ExtendedMessage;

			const timeStart: number = Date.now();

			let manager: Role;

			if (options?.manager as Role) manager = options.manager as Role;
			else if (options?.manager as string)
				manager = await msgOrInt.member.roles.cache.find(
					(r: Role) => r.id === (options.manager as string)
				);

			if (
				!(
					manager ||
					msgOrInt?.member?.permissions?.has(
						PermissionFlagsBits.ManageEvents
					) ||
					msgOrInt?.member?.permissions?.has(PermissionFlagsBits.ManageGuild) ||
					msgOrInt?.member?.permissions?.has(PermissionFlagsBits.Administrator)
				)
			) {
				return msgOrInt.channel.send({
					content:
						'You must have • `Administrator` (or) `Manage Guild` (or) `Manage Events` Permission or • Giveaway Manager Role'
				});
			}

			options.winners ??= 1;

			const buttonStyles = {
				enter: {
					style: options.buttons?.enter?.style || ButtonStyle.Success,
					label: options.buttons?.enter?.label || '0',
					emoji: options.buttons?.enter?.emoji || '🎁'
				},
				end: {
					style: options.buttons?.end?.style || ButtonStyle.Danger,
					label: options.buttons?.end?.label || 'End',
					emoji: options.buttons?.end?.emoji || '⛔'
				},
				reroll: {
					style: options.buttons?.end?.style || ButtonStyle.Primary,
					label: options.buttons?.end?.label || 'Reroll',
					emoji: options.buttons?.end?.emoji || '🔁'
				}
			};

			if (!options.embed) {
				options.embed = {
					giveaway: {
						footer: {
							text: '©️ Rahuletto. npm i simply-djs',
							iconURL: 'https://i.imgur.com/XFUIwPh.png'
						},
						color: toRgb('#406DBC'),
						title: 'Giveaway !'
					}
				};
			}

			let channel: TextChannel;
			let time: string;
			let winners: number;
			let prize: string;
			let requirements: {
				type: 'None' | 'Role' | 'Guild';
				value: Role | Guild | null;
			} = { type: 'None', value: null };

			let content = '** **';

			if (options?.pingRole as Role)
				content = (options.pingRole as Role).toString();
			else if (options?.pingRole as string)
				content = (
					await msgOrInt.member.roles.cache.find(
						(r: Role) => r.id === (options.pingRole as string)
					)
				).toString();

			if (options?.requirements?.type === 'Role') {
				const role = await msgOrInt.guild.roles.fetch(
					options.requirements?.id,
					{
						force: true
					}
				);

				requirements = { type: 'Role', value: role };
			} else if (options?.requirements?.type === 'Guild') {
				const guild = await client.guilds.cache.get(options.requirements?.id);

				if (!guild)
					return extMessage.channel.send({
						content:
							'Please add me to that server so I can set the requirement.'
					});

				requirements = { type: 'Guild', value: guild };
			}

			if (interaction) {
				channel =
					(options.channel as TextChannel) ||
					(extInteraction.options.get('channel')?.channel as TextChannel) ||
					(interaction.channel as TextChannel);
				time =
					options.time ||
					extInteraction.options.get('time')?.value.toString() ||
					'1h';
				winners =
					options.winners ||
					Number(extInteraction.options.get('winners')?.value);
				prize =
					options.prize ||
					extInteraction.options.get('prize')?.value?.toString();
			} else if (!interaction) {
				const [...args] = extMessage.content.split(/ +/g);

				if (!Number(args[2]))
					return extMessage.reply({
						content: 'Please provide a number for winners argument'
					});

				channel =
					(options.channel as TextChannel) ||
					(extMessage.mentions?.channels?.first() as TextChannel) ||
					(extMessage.channel as TextChannel);
				time = options.time || args[1] || '1h';
				winners = Number(args[2]) || options.winners;
				prize = options.prize || args.slice(3)?.join(' ');
			}

			if (buttonStyles?.enter?.style as string)
				buttonStyles.enter.style = toButtonStyle(
					buttonStyles?.enter?.style as string
				);

			if (buttonStyles?.end?.style as string)
				buttonStyles.end.style = toButtonStyle(
					buttonStyles?.end?.style as string
				);

			if (buttonStyles?.reroll?.style as string)
				buttonStyles.reroll.style = toButtonStyle(
					buttonStyles?.reroll?.style as string
				);

			const enter = new ButtonBuilder()
				.setCustomId('enter_giveaway')
				.setStyle(
					(buttonStyles?.enter?.style as ButtonStyle) || ButtonStyle.Primary
				);

			if (options?.type === 'Emoji')
				enter.setEmoji(buttonStyles?.enter?.emoji || '🎁');
			else if (options?.type === 'Label')
				enter.setLabel(buttonStyles?.enter?.label || '0');
			else {
				enter
					.setEmoji(buttonStyles?.enter?.emoji || '🎁')
					.setLabel(buttonStyles?.enter?.label || '0');
			}

			const end = new ButtonBuilder()
				.setCustomId('end_giveaway')
				.setStyle(
					(buttonStyles?.end?.style as ButtonStyle) || ButtonStyle.Danger
				);

			if (options?.type === 'Emoji')
				end.setEmoji(buttonStyles?.end?.emoji || '⛔');
			else if (options?.type === 'Label')
				end.setLabel(buttonStyles?.end?.label || 'End');
			else {
				end
					.setEmoji(buttonStyles?.end?.emoji || '⛔')
					.setLabel(buttonStyles?.end?.label || 'End');
			}

			const reroll = new ButtonBuilder()
				.setCustomId('reroll_giveaway')
				.setStyle(
					(buttonStyles?.reroll?.style as ButtonStyle) || ButtonStyle.Success
				)
				.setDisabled(true);

			if (options?.type === 'Emoji')
				reroll.setEmoji(buttonStyles?.reroll?.emoji || '🔁');
			else if (options?.type === 'Label')
				reroll.setLabel(buttonStyles?.reroll?.label || 'Reroll');
			else {
				reroll
					.setEmoji(buttonStyles?.reroll?.emoji || '🔁')
					.setLabel(buttonStyles?.reroll?.label || 'Reroll');
			}

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
				enter,
				reroll,
				end
			]);

			const timeInMS = ms(time);

			const endTime = Number((Date.now() + timeInMS).toString().slice(0, -3));

			options.embed.giveaway.fields = options?.embed?.giveaway?.fields || [
				{
					name: 'Prize',
					value: `{prize}`
				},
				{
					name: 'Hosted By',
					value: `{hosted}`,
					inline: true
				},
				{
					name: 'Ends at',
					value: `{endsAt}`,
					inline: true
				},
				{ name: 'Winner(s)', value: `{winCount}`, inline: true },
				{
					name: 'Requirements',
					value: `{requirements}`
				}
			];

			let guildInvite: string;
			if (requirements.type == 'Guild') {
				await (requirements.value as Guild).invites
					.fetch()
					.then((a: Collection<string, Invite>) => {
						guildInvite = `https://discord.gg/${a.first()}`;
					});
			}

			function replacer(str: string) {
				return str
					.replaceAll('{hosted}', `<@${msgOrInt.member.user.id}>`)
					.replaceAll('{endsAt}', `<t:${endTime}:f>`)
					.replaceAll('{prize}', prize)
					.replaceAll(
						'{requirements}',
						requirements.type === 'None'
							? 'None'
							: requirements.type +
									' | ' +
									(requirements.type === 'Guild'
										? `${guildInvite}`
										: `${requirements.value}`)
					)
					.replaceAll('{winCount}', winners.toString())
					.replaceAll('{entered}', '0');
			}

			options.embed?.giveaway?.fields?.forEach((a) => {
				a.value = replacer(a?.value);
			});

			const embed = new EmbedBuilder()
				.setTitle(replacer(options?.embed?.giveaway?.title || 'Giveaway Time!'))
				.setColor(options?.embed?.giveaway?.color || toRgb('#406DBC'))
				.setTimestamp(Number(Date.now() + timeInMS))
				.setFooter(
					options?.embed?.giveaway?.footer
						? options?.embed?.giveaway?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				)
				.setDescription(
					replacer(
						options?.embed?.giveaway?.description ||
							`Interact with the giveaway using the buttons below.`
					)
				)
				.setFields(options?.embed?.giveaway?.fields);

			if (options?.embed?.giveaway?.author)
				embed.setAuthor(options.embed?.giveaway?.author);
			if (options?.embed?.giveaway?.image)
				embed.setImage(options.embed?.giveaway?.image);
			if (options?.embed?.giveaway?.thumbnail)
				embed.setThumbnail(options.embed?.giveaway?.thumbnail);
			if (options?.embed?.giveaway?.timestamp)
				embed.setTimestamp(options.embed?.giveaway?.timestamp);
			if (options?.embed?.giveaway?.title)
				embed.setTitle(options.embed?.giveaway?.title);
			if (options?.embed?.giveaway?.url)
				embed.setURL(options.embed?.giveaway?.url);

			await channel
				.send({ content: content, embeds: [embed], components: [row] })
				.then(async (msg: Message) => {
					resolve({
						message: msg,
						winners: winners,
						prize: prize,
						endsAt: endTime,
						requirements: requirements
					});

					const link = new ButtonBuilder()
						.setLabel('View Giveaway.')
						.setStyle(ButtonStyle.Link)
						.setURL(msg.url);

					const linkRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
						link
					]);

					if (interaction) {
						await extInteraction.followUp({
							content: 'Giveaway has started.',
							components: [linkRow]
						});
					} else
						await extMessage.channel.send({
							content: 'Giveaway has started.',
							components: [linkRow]
						});

					const end = Number(Date.now() + timeInMS);

					const createDb = new model({
						message: msg.id,
						entered: 0,
						winCount: winners,
						description: options.embed?.giveaway?.description || null,
						embeds: options.embed,
						requirements: {
							type:
								requirements?.type === 'None'
									? 'none'
									: requirements?.type?.toLowerCase(),
							id: requirements?.value?.id
						},
						started: timeStart,
						prize: prize,
						entry: [],
						endTime: end,
						host: msgOrInt.member.user.id
					});

					await createDb.save();

					const timer = setInterval(async () => {
						if (!msg) return;

						const components = ActionRowBuilder.from(msg?.components[0]);

						const data = await model.findOne({ message: msg.id });

						if (data.endTime && Number(data.endTime) < Date.now()) {
							const loadEmbed = new EmbedBuilder()
								.setTitle(data?.embeds?.load?.title || 'Processing Tickets...')
								.setColor(data?.embeds?.load?.color || toRgb('#cc0000'))
								.setDescription(
									data?.embeds?.load?.description ||
										`Please wait.. We are shuffling the members to pick a winner.`
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

							clearInterval(timer);

							await msg
								.edit({ embeds: [loadEmbed], components: [] })
								.catch(() => {});

							const displayWinner: string[] = [];

							const winnerArray: Entry[] = [];

							const winnerCount = data.winCount;

							const entries = data.entry;

							for (let i = 0; i < winnerCount; i++) {
								const win = Math.floor(Math.random() * data.entered);

								if (entries.length != 0) winnerArray.push(entries[win]);
							}
							const oldFields = msg.embeds[0].fields;

							const resultWinner: GuildMember[] = [];

							setTimeout(() => {
								winnerArray.forEach(async (name) => {
									await interaction.guild.members
										.fetch(name?.userId)
										.then((member) => {
											resultWinner.push(member);
											displayWinner.push(`<@${member.user.id}>`);

											const dmEmbed: EmbedBuilder = new EmbedBuilder()
												.setTitle('You, Won the Giveaway!')
												.setDescription(
													`You just won \`${data.prize}\` in the Giveaway at \`${member.guild.name}\` Go claim it fast !`
												)
												.setColor('DarkGreen')
												.setFooter(
													data?.embeds?.result?.footer || { text: 'GG winner.' }
												);

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
									const embed = EmbedBuilder.from(msg.embeds[0]);

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

									if (
										data.entered <= 0 ||
										entries.length == 0 ||
										!winnerArray[0]
									) {
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
										(components as ActionRowBuilder<ButtonBuilder>)
											.components[0]
									).setDisabled(true);
									const b2 = ButtonBuilder.from(
										(components as ActionRowBuilder<ButtonBuilder>)
											.components[1]
									).setDisabled(false);
									const b3 = ButtonBuilder.from(
										(components as ActionRowBuilder<ButtonBuilder>)
											.components[2]
									).setDisabled(true);

									const buttonRow =
										new ActionRowBuilder<ButtonBuilder>().setComponents([
											b1,
											b2,
											b3
										]);

									const resultEmbed = new EmbedBuilder()
										.setTitle(
											data?.embeds?.result?.title || 'And the winner is,'
										)
										.setColor(data?.embeds?.result?.color || 'DarkGreen')
										.setDescription(
											data?.embeds?.result?.description.replaceAll(
												'{winners}',
												displayWinner.join(', ')
											) ||
												`${displayWinner.join(
													', '
												)} won the prize !\nGet in touch with the staff members to collect your prize.`
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

									resolve({
										type: 'End',
										url: msg.url,
										user: resultWinner
									});
								}
							}, ms('6s'));
						}
					}, timeInMS);
				});
		} catch (err: any) {
			if (options?.strict)
				throw new SimplyError({
					function: 'giveaway',
					title: 'An Error occured when running the function ',
					tip: err.stack
				});
			else console.log(`SimplyError - giveaway | Error: ${err.stack}`);
		}
	});
}
