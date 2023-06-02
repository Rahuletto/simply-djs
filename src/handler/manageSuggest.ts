import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	PermissionsBitField,
	Message,
	EmbedBuilder,
	User,
	ComponentType,
	ButtonStyle,
	PermissionFlagsBits,
	Embed,
	TextInputBuilder,
	TextInputStyle,
	ModalBuilder
} from 'discord.js';

import db, { Vote } from '../model/suggest';
import { ms, toRgb } from '../misc';
import { CustomizableEmbed } from '../typedef';
import { SimplyError } from '../error';

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/handler/manageSuggest#suggestionembeds
 */

export interface SuggestionEmbeds {
	accept?: CustomizableEmbed;
	deny?: CustomizableEmbed;
}

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/handler/manageSuggest#managesuggestoptions
 */

export type manageSuggestOptions = {
	embed?: SuggestionEmbeds;
	strict?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A **Suggestion** handler which handles all sugestions from the package
 * @param button
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/handler/manageSuggest
 * @example simplydjs.manageSuggest(interaction)
 */

export async function manageSuggest(
	button: ButtonInteraction,
	options: manageSuggestOptions = {}
): Promise<void> {
	return new Promise(async () => {
		if (button.isButton()) {
			try {
				options.embed = {
					deny: {
						title: options?.embed?.deny?.title || 'Suggestion denied',
						color: options?.embed?.deny?.color || 'Red'
					},
					accept: {
						title: options?.embed?.accept?.title || 'Suggestion accepted',
						color: options?.embed?.accept?.color || 'Green'
					}
				};

				if (button.customId === 'minus-suggestion') {
					let data = await db.findOne({
						message: button.message.id
					});
					if (!data) {
						data = new db({
							message: button.message.id
						});
						await data.save().catch(() => {});
					}

					const oldemb = button.message.embeds[0];

					function getUsers() {
						const users = data.votes;
						return users;
					}
					function getLikes() {
						const array = getUsers().filter((val) => val.vote === 'up');
						return array;
					}
					function getDislikes() {
						const array = getUsers().filter((val) => val.vote === 'down');
						return array;
					}

					const likes: Vote[] = getLikes();
					const dislikes: Vote[] = getDislikes();

					const amtLikes = likes.length;
					const amtDislikes = dislikes.length;

					if (
						(!oldemb.fields[1].value.includes('%') && !isNaN(amtLikes)) ||
						(!oldemb.fields[1].value.includes('%') && !isNaN(amtDislikes))
					) {
						data.votes = likes.concat(dislikes);
						await data.save().catch(() => {});

						await calc(oldemb, button.message);
					}

					if (
						(button.member.permissions as PermissionsBitField).has(
							PermissionFlagsBits.Administrator
						)
					) {
						const surebtn = new ButtonBuilder()
							.setStyle(ButtonStyle.Primary)
							.setLabel('Downvote')
							.setCustomId('downvote-suggestion');

						const nobtn = new ButtonBuilder()
							.setStyle(ButtonStyle.Danger)
							.setLabel('Deny')
							.setCustomId('deny-suggestion');

						const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
							surebtn,
							nobtn
						]);

						const msg: Message = await button.reply({
							content: 'Do you want to Deny the suggestion (or) Vote?',
							components: [row],
							ephemeral: true,
							fetchReply: true
						});

						const filter = (b: ButtonInteraction) =>
							button.user.id === b.user.id;
						const denyCollector = msg.createMessageComponentCollector({
							filter: filter,
							componentType: ComponentType.Button,
							time: ms('30s')
						});
						denyCollector.on('collect', async (btn) => {
							if (btn.customId === 'downvote-suggestion') {
								const myVote = data.votes.find(
									(m) => m.userId.toString() === btn.user.id
								);
								let total: Vote[] =
									data.votes.filter(
										(m) => m.userId.toString() !== btn.user.id
									) || [];

								if (!Array.isArray(total)) {
									total = [total];
								}

								if (!myVote || myVote.vote === null) {
									const vote: Vote = { userId: btn.user.id, vote: 'down' };
									total.push(vote);
									data.votes = total;
									await data.save().catch(() => {});

									await calc(oldemb, button.message);

									await button.editReply({
										content:
											'You **downvoted** the suggestion. | Suggestion ID: ' +
											`\`${button.message.id}\``,
										components: []
									});
								} else if (myVote) {
									if (myVote.vote === 'down') {
										data.votes = total;
										await data.save().catch(() => {});

										await calc(oldemb, button.message);

										await button.editReply({
											content: 'Removing your **downvote**',
											components: []
										});
									} else if (myVote.vote === 'up') {
										const vote: Vote = { userId: btn.user.id, vote: 'down' };
										total.push(vote);
										data.votes = total;
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
							} else if (btn.customId === 'deny-suggestion') {
								if (
									!(button.member.permissions as PermissionsBitField).has(
										PermissionFlagsBits.Administrator
									)
								)
									return;

								const reasoner = new TextInputBuilder()
									.setLabel('Tell a reason | Say "cancel" to cancel.')
									.setCustomId('deny-reason')
									.setStyle(TextInputStyle.Paragraph)
									.setRequired(false)
									.setMaxLength(128);

								const modalRow =
									new ActionRowBuilder<TextInputBuilder>().setComponents([
										reasoner
									]);

								const modal = new ModalBuilder()
									.setCustomId('reason-modal')
									.setTitle('Declining the suggestion')
									.addComponents(modalRow);

								await btn.showModal(modal);

								const submitted = await btn.awaitModalSubmit({
									time: ms('2m'),

									filter: (i) => i.user.id === btn.user.id
								});

								if (submitted) {
									const m = submitted.fields.getTextInputValue('deny-reason');
									if (m.toLowerCase() === 'cancel') {
										await submitted.reply({
											content: `You have cancelled to deny.`,
											ephemeral: true
										});
									} else if (m == '') {
										await submitted.reply({
											content: `You denied the suggestion for reason: \`No Reason\``,
											ephemeral: true
										});
										denySuggestion(
											'No Reason',
											oldemb,
											button.message,
											submitted.user
										);
									} else {
										await submitted.reply({
											content: `You denied the suggestion for reason: \`${m}\``,
											ephemeral: true
										});

										denySuggestion(m, oldemb, button.message, submitted.user);
									}
								} else {
									denySuggestion(
										'No Reason',
										oldemb,
										button.message,
										submitted.user
									);
								}
							}
						});
					} else if (
						!(button.member.permissions as PermissionsBitField).has(
							PermissionFlagsBits.Administrator
						)
					) {
						const myVote = data.votes.find(
							(m) => m.userId.toString() === button.user.id
						);
						let total: Vote[] =
							data.votes.filter(
								(m) => m.userId.toString() !== button.user.id
							) || [];

						if (!Array.isArray(total)) {
							total = [total];
						}

						if (!myVote || myVote.vote === null) {
							const vote: Vote = { userId: button.user.id, vote: 'down' };
							total.push(vote);
							data.votes = total;
							await data.save().catch(() => {});

							await calc(oldemb, button.message);

							await button.reply({
								content:
									'You **downvoted** the suggestion. | Suggestion ID: ' +
									`\`${button.message.id}\``,
								ephemeral: true,
								components: []
							});
						} else if (myVote) {
							if (myVote.vote === 'down') {
								data.votes = total;
								await data.save().catch(() => {});

								await calc(oldemb, button.message);

								await button.reply({
									content: 'Removing your **downvote**',
									ephemeral: true,
									components: []
								});
							} else if (myVote.vote === 'up') {
								const vote: Vote = { userId: button.user.id, vote: 'down' };
								total.push(vote);
								data.votes = total;
								await data.save().catch(() => {});

								await calc(oldemb, button.message);

								await button.reply({
									content:
										'You **downvoted** the suggestion. | Suggestion ID: ' +
										`\`${button.message.id}\``,
									ephemeral: true,
									components: []
								});
							}
						}
					}
				}

				if (button.customId === 'plus-suggestion') {
					let data = await db.findOne({
						message: button.message.id
					});
					if (!data) {
						data = new db({
							message: button.message.id
						});
						await data.save().catch(() => {});
					}

					const oldemb = button.message.embeds[0];

					function getUsers() {
						const users = data.votes;
						return users;
					}
					function getLikes() {
						const array = getUsers().filter((val) => val.vote === 'up');
						return array;
					}
					function getDislikes() {
						const array = getUsers().filter((val) => val.vote === 'down');
						return array;
					}

					const likes: Vote[] = getLikes();
					const dislikes: Vote[] = getDislikes();

					const amtLikes = likes.length;
					const amtDislikes = dislikes.length;

					if (
						(!oldemb.fields[1].value.includes('%') && !isNaN(amtLikes)) ||
						(!oldemb.fields[1].value.includes('%') && !isNaN(amtDislikes))
					) {
						data.votes = likes.concat(dislikes);
						await data.save().catch(() => {});

						await calc(oldemb, button.message);
					}

					if (
						(button.member.permissions as PermissionsBitField).has(
							PermissionFlagsBits.Administrator
						)
					) {
						const surebtn = new ButtonBuilder()
							.setStyle(ButtonStyle.Primary)
							.setLabel('Upvote')
							.setCustomId('upvote-suggestion');

						const nobtn = new ButtonBuilder()
							.setStyle(ButtonStyle.Success)
							.setLabel('Accept')
							.setCustomId('accept-suggestion');

						const acceptRow =
							new ActionRowBuilder<ButtonBuilder>().addComponents([
								surebtn,
								nobtn
							]);

						const msg = await button.reply({
							content: 'Do you want to Accept suggestion (or) Vote?',
							components: [acceptRow],
							ephemeral: true,
							fetchReply: true
						});

						const filter = (b: ButtonInteraction) =>
							button.user.id === b.user.id;
						const acceptCollector = (
							msg as Message
						).createMessageComponentCollector({
							filter: filter,
							componentType: ComponentType.Button,
							time: ms('30s')
						});
						acceptCollector.on('collect', async (btn) => {
							if (btn.customId === 'upvote-suggestion') {
								const myVote = data.votes.find(
									(m) => m.userId.toString() === btn.user.id
								);
								let total: Vote[] =
									data.votes.filter(
										(m) => m.userId.toString() !== btn.user.id
									) || [];

								if (!Array.isArray(total)) {
									total = [total];
								}

								if (!myVote || myVote.vote === null) {
									const vote: Vote = { userId: btn.user.id, vote: 'up' };
									total.push(vote);
									data.votes = total;
									await data.save().catch(() => {});

									await calc(oldemb, button.message);
									await button.editReply({
										content:
											'You **upvoted** the suggestion. | Suggestion ID: ' +
											`\`${button.message.id}\``,
										components: []
									});
								} else if (myVote) {
									if (myVote.vote === 'up') {
										data.votes = total;
										await data.save().catch(() => {});

										await calc(oldemb, button.message);

										await button.editReply({
											content: 'Removing your **upvote**',
											components: []
										});
									} else if (myVote.vote === 'down') {
										const vote: Vote = { userId: btn.user.id, vote: 'up' };
										total.push(vote);
										data.votes = total;
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
							} else if (btn.customId === 'accept-suggestion') {
								if (
									!(button.member.permissions as PermissionsBitField).has(
										PermissionFlagsBits.Administrator
									)
								)
									return;

								const reasoner = new TextInputBuilder()
									.setLabel('Tell a reason | Say "cancel" to cancel.')
									.setCustomId('accept-reason')
									.setStyle(TextInputStyle.Paragraph)
									.setRequired(false)
									.setMaxLength(128);

								const modalRow =
									new ActionRowBuilder<TextInputBuilder>().setComponents([
										reasoner
									]);

								const modal = new ModalBuilder()
									.setCustomId('reason-modal')
									.setTitle('Accepting the suggestion')
									.addComponents(modalRow);

								await btn.showModal(modal);

								const submitted = await btn.awaitModalSubmit({
									time: ms('2m'),

									filter: (i) => i.user.id === btn.user.id
								});

								if (submitted) {
									const m = submitted.fields.getTextInputValue('accept-reason');
									if (m.toLowerCase() === 'cancel') {
										await submitted.reply({
											content: `You have cancelled to accept.`,
											ephemeral: true
										});
									} else if (m == '') {
										await submitted.reply({
											content: `You accepted the suggestion for reason: \`No Reason\``,
											ephemeral: true
										});
										acceptSuggestion(
											'No Reason',
											oldemb,
											button.message,
											submitted.user
										);
									} else {
										await submitted.reply({
											content: `You accepted the suggestion for reason: \`${m}\``,
											ephemeral: true
										});

										acceptSuggestion(m, oldemb, button.message, submitted.user);
									}
								} else {
									acceptSuggestion(
										'No Reason',
										oldemb,
										button.message,
										submitted.user
									);
								}
							}
						});
					} else if (
						!(button.member.permissions as PermissionsBitField).has(
							PermissionFlagsBits.Administrator
						)
					) {
						const myVote = data.votes.find(
							(m) => m.userId.toString() === button.user.id
						);
						let total: Vote[] =
							data.votes.filter(
								(m) => m.userId.toString() !== button.user.id
							) || [];

						if (!Array.isArray(total)) {
							total = [total];
						}

						if (!myVote || myVote.vote === null) {
							const vote: Vote = { userId: button.user.id, vote: 'up' };
							total.push(vote);
							data.votes = total;
							await data.save().catch(() => {});

							await calc(oldemb, button.message);
							await button.reply({
								content:
									'You **upvoted** the suggestion. | Suggestion ID: ' +
									`\`${button.message.id}\``,
								ephemeral: true,
								components: []
							});
						} else if (myVote) {
							if (myVote.vote === 'up') {
								data.votes = total;
								await data.save().catch(() => {});

								await calc(oldemb, button.message);

								await button.reply({
									content: 'Removing your **upvote**',
									ephemeral: true,
									components: []
								});
							} else if (myVote.vote === 'down') {
								const vote: Vote = { userId: button.user.id, vote: 'up' };
								total.push(vote);
								data.votes = total;
								await data.save().catch(() => {});

								await calc(oldemb, button.message);

								await button.reply({
									content:
										'You **upvoted** the suggestion. | Suggestion ID: ' +
										`\`${button.message.id}\``,
									ephemeral: true,
									components: []
								});
							}
						}
					}
				}

				if (button.customId === 'who-voted-suggestion') {
					let data = await db.findOne({
						message: button.message.id
					});
					if (!data) {
						data = new db({
							message: button.message.id
						});
						await data.save().catch(() => {});
					}
					function getUsers() {
						const users = data.votes;
						return users;
					}
					function getLikes() {
						const array = getUsers().filter((val) => val.vote === 'up');
						return array;
					}
					function getDislikes() {
						const array = getUsers().filter((val) => val.vote === 'down');
						return array;
					}
					function mapUsersID(array: Vote[], _type: 'up' | 'down') {
						let myString = '';
						array.forEach((val) => {
							myString += `<@${val.userId}>\n`;
						});
						return myString;
					}
					function mapUsersTag(array: Vote[], _type: 'up' | 'down') {
						let myString = '';
						array.forEach((val) => {
							myString += `${
								button.client.users.cache.get(val.userId.toString()).tag
							}\n`;
						});
						return myString;
					}
					let whoemb = new EmbedBuilder().setColor(toRgb('#406DBC')).addFields(
						{
							name: `Upvoters`,
							value: `${
								mapUsersID(getLikes(), 'up') ||
								'Nobody Has Upvoted This Suggestion'
							}`
						},
						{
							name: `Downvoters`,
							value: `${
								mapUsersID(getDislikes(), 'down') ||
								'Nobody Has Downvoted This Suggestion'
							}`
						}
					);
					let tagbtn = new ButtonBuilder()
						.setLabel('Show User Tags')
						.setEmoji('#️⃣')
						.setStyle(ButtonStyle.Secondary)
						.setCustomId('tag');
					let idbtn = new ButtonBuilder()
						.setLabel('Show User Mentions')
						.setEmoji('🔢')
						.setStyle(ButtonStyle.Secondary)
						.setCustomId('id');
					let actt = new ActionRowBuilder<ButtonBuilder>().addComponents([
						tagbtn
					]);
					let acti = new ActionRowBuilder<ButtonBuilder>().addComponents([
						idbtn
					]);

					const msg: Message = await button.reply({
						embeds: [whoemb],
						components: [actt],
						ephemeral: true,
						fetchReply: true
					});

					const filter = (b: ButtonInteraction) => button.user.id === b.user.id;
					const collector = (msg as Message).createMessageComponentCollector({
						filter: filter,
						componentType: ComponentType.Button,
						idle: ms('30s')
					});
					collector.on('collect', async (i) => {
						i.deferUpdate();
						if (i.customId === 'tag') {
							whoemb = new EmbedBuilder().setColor(toRgb('#406DBC')).addFields(
								{
									name: `Upvoters`,
									value: `${
										mapUsersTag(getLikes(), 'up') ||
										'Nobody Has Upvoted This Suggestion'
									}`
								},
								{
									name: `Downvoters`,
									value: `${
										mapUsersTag(getDislikes(), 'down') ||
										'Nobody Has Downvoted This Suggestion'
									}`
								}
							);
							button.editReply({ embeds: [whoemb], components: [acti] });
						} else if (i.customId === 'id') {
							whoemb = new EmbedBuilder().setColor(toRgb('#406DBC')).addFields(
								{
									name: `Upvoters`,
									value: `${
										mapUsersID(getLikes(), 'up') ||
										'Nobody Has Upvoted This Suggestion'
									}`
								},
								{
									name: `Downvoters`,
									value: `${
										mapUsersID(getDislikes(), 'down') ||
										'Nobody Has Downvoted This Suggestion'
									}`
								}
							);
							button.editReply({ embeds: [whoemb], components: [actt] });
						}
					});
				}

				async function calc(embed: Embed, message: Message) {
					const data = await db.findOne({
						message: button.message.id
					});

					function getUsers() {
						const users = data.votes;
						return users;
					}
					function getLikes() {
						const array = getUsers().filter((val) => val.vote === 'up');
						return array;
					}
					function getDislikes() {
						const array = getUsers().filter((val) => val.vote === 'down');
						return array;
					}

					const likes: Vote[] = getLikes();
					const dislikes: Vote[] = getDislikes();

					let amtLikes = likes.length;
					let amtDislikes = dislikes.length;

					if (amtLikes <= 0) {
						amtLikes = 0;
					}
					if (amtDislikes <= 0) {
						amtDislikes = 0;
					}

					const total = data.votes.length;

					let upPercent = (100 * amtLikes) / total;

					let downPercent = (amtDislikes * 100) / total;

					upPercent = parseInt(upPercent.toPrecision(3)) || 0;
					downPercent = parseInt(downPercent.toPrecision(3)) || 0;

					let progress = (data?.progress?.blank || '⬛').repeat(10);

					if (upPercent / 10 + downPercent / 10 != 0 || total != 0)
						progress =
							(data?.progress?.up || '🟩').repeat(upPercent / 10) +
							(data?.progress?.down || '🟥').repeat(downPercent / 10);
					else if (total == 0 || upPercent.toString() === 'NaN') {
						progress = (data?.progress?.blank || '⬛').repeat(10);
						upPercent = 0;
						downPercent = 0;
					}

					const rowComponent = ActionRowBuilder.from(message.components[0]);
					const likeBtn = ButtonBuilder.from(
						(rowComponent as ActionRowBuilder<ButtonBuilder>).components[0]
					);
					const dislikeBtn = ButtonBuilder.from(
						(rowComponent as ActionRowBuilder<ButtonBuilder>).components[1]
					);
					const whoVoted = ButtonBuilder.from(
						(rowComponent as ActionRowBuilder<ButtonBuilder>).components[2]
					);

					likeBtn.setLabel(amtLikes.toString());

					dislikeBtn.setLabel(amtDislikes.toString());

					embed.fields[1].value = `${progress} [${upPercent || 0}% - ${
						downPercent || 0
					}%]`;

					(rowComponent as ActionRowBuilder<ButtonBuilder>).setComponents([
						likeBtn,
						dislikeBtn,
						whoVoted
					]);

					button.message.edit({
						embeds: [embed],
						components: [rowComponent as ActionRowBuilder<ButtonBuilder>]
					});
				}

				async function denySuggestion(
					reason: string,
					oldemb: Embed,
					msg: Message,
					user: User
				) {
					oldemb.fields[0].value = `Denied\n\n**Reason:** \`\`\`${reason}\`\`\``;
					const embed = EmbedBuilder.from(oldemb)
						.setColor(options?.embed?.deny?.color || `Red`)
						.setFooter(
							options?.embed?.deny?.footer || { text: `Denied by ${user.tag}` }
						)
						.setTitle(
							options.embed?.deny?.title || 'Suggestion denied by admin'
						);

					if (options?.embed?.deny?.author)
						embed.setAuthor(options.embed?.deny?.author);
					if (options?.embed?.deny?.image)
						embed.setImage(options.embed?.deny?.image);
					if (options?.embed?.deny?.thumbnail)
						embed.setThumbnail(options.embed?.deny?.thumbnail);
					if (options?.embed?.deny?.timestamp)
						embed.setTimestamp(options.embed?.deny?.timestamp);
					if (options?.embed?.deny?.title)
						embed.setTitle(options.embed?.deny?.title);
					if (options?.embed?.deny?.url) embed.setURL(options.embed?.deny?.url);
					if (options?.embed?.deny?.description)
						embed.setDescription(options.embed?.deny?.description);

					const rowComponent = ActionRowBuilder.from(msg.components[0]);
					const likeBtn = ButtonBuilder.from(
						(rowComponent as ActionRowBuilder<ButtonBuilder>).components[0]
					);
					const dislikeBtn = ButtonBuilder.from(
						(rowComponent as ActionRowBuilder<ButtonBuilder>).components[1]
					);
					const whoVoted = ButtonBuilder.from(
						(rowComponent as ActionRowBuilder<ButtonBuilder>).components[2]
					);

					likeBtn.setDisabled(true);
					dislikeBtn.setDisabled(true);
					whoVoted.setDisabled(false);

					const sendRow = new ActionRowBuilder<ButtonBuilder>().setComponents([
						likeBtn,
						dislikeBtn,
						whoVoted
					]);

					button.message.edit({
						embeds: [embed],
						components: [sendRow]
					});
				}

				async function acceptSuggestion(
					reason: string,
					oldemb: Embed,
					msg: Message,
					user: User
				) {
					oldemb.fields[0].value = `Accepted\n\n**Reason:** \`\`\`${reason}\`\`\``;
					const embed = EmbedBuilder.from(oldemb)
						.setColor(options?.embed?.accept?.color || `Green`)
						.setFooter(
							options?.embed?.accept?.footer || {
								text: `Accepted by ${user.tag}`
							}
						)
						.setTitle(
							options.embed?.accept?.title || 'Suggestion accepted by admin'
						);

					if (options?.embed?.accept?.author)
						embed.setAuthor(options.embed?.accept?.author);
					if (options?.embed?.accept?.image)
						embed.setImage(options.embed?.accept?.image);
					if (options?.embed?.accept?.thumbnail)
						embed.setThumbnail(options.embed?.accept?.thumbnail);
					if (options?.embed?.accept?.timestamp)
						embed.setTimestamp(options.embed?.accept?.timestamp);
					if (options?.embed?.accept?.title)
						embed.setTitle(options.embed?.accept?.title);
					if (options?.embed?.accept?.url)
						embed.setURL(options.embed?.accept?.url);
					if (options?.embed?.accept?.description)
						embed.setDescription(options.embed?.accept?.description);

					const rowComponent = ActionRowBuilder.from(msg.components[0]);
					const likeBtn = ButtonBuilder.from(
						(rowComponent as ActionRowBuilder<ButtonBuilder>).components[0]
					);
					const dislikeBtn = ButtonBuilder.from(
						(rowComponent as ActionRowBuilder<ButtonBuilder>).components[1]
					);
					const whoVoted = ButtonBuilder.from(
						(rowComponent as ActionRowBuilder<ButtonBuilder>).components[2]
					);

					likeBtn.setDisabled(true);
					dislikeBtn.setDisabled(true);
					whoVoted.setDisabled(false);

					const sendRow = new ActionRowBuilder<ButtonBuilder>().setComponents([
						likeBtn,
						dislikeBtn,
						whoVoted
					]);

					button.message.edit({
						embeds: [embed],
						components: [sendRow]
					});
				}
			} catch (err: any) {
				if (options?.strict)
					throw new SimplyError({
						function: 'manageSuggest',
						title: 'An Error occured when running the function',
						tip: err.stack
					});
				else console.log(`SimplyError - manageSuggest | Error: ${err.stack}`);
			}
		}
	});
}
