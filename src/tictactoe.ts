import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
	Message,
	User
} from 'discord.js';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';
import { CustomizableEmbed } from './interfaces/CustomizableEmbed';
import { toRgb } from './Others/toRgb';
import { ms } from './Others/ms';
import { MessageButtonStyle } from './Others/MessageButtonStyle';
import { SimplyError } from './Error/Error';

// ------------------------------
// ----- I N T E R F A C E ------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/Fun/tictactoe#tictactoebtntemplate*
 */
interface tictactoeBtnTemplate {
	style?: ButtonStyle | 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK';
	emoji?: string;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/Fun/tictactoe#tictactoebuttons*
 */

interface tictactoeButtons {
	X?: tictactoeBtnTemplate;
	O?: tictactoeBtnTemplate;
	blank?: tictactoeBtnTemplate;
}

interface Embeds {
	request?: CustomizableEmbed;
	win?: CustomizableEmbed;
	draw?: CustomizableEmbed;
	game?: CustomizableEmbed;
	timeout?: CustomizableEmbed;
	decline?: CustomizableEmbed;
}

export type tictactoeOptions = {
	embed?: Embeds;
	user?: User;
	result?: 'Button' | 'Embed';

	buttons?: tictactoeButtons;

	strict?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

const combinations = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

/**
 * One line implementation of a super enjoyable **tictactoe game**.
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Fun/tictactoe***
 * @example simplydjs.tictactoe(interaction)
 */

export async function tictactoe(
	message: ExtendedMessage | ExtendedInteraction,
	options: tictactoeOptions = {}
): Promise<User> {
	return new Promise(async (resolve) => {
		try {
			const { client } = message;

			let interaction: ExtendedInteraction;

			if (message.commandId) {
				interaction = message as ExtendedInteraction;
			}

			let opponent: User;

			const extInteraction = message as ExtendedInteraction;
			const extMessage = message as ExtendedMessage;

			if (interaction) {
				opponent = options.user || extInteraction.options.get('user').user;
				if (!opponent)
					return extInteraction.followUp({
						content: "You didn't mention an opponent.",
						ephemeral: true
					});

				if (opponent.bot)
					return extInteraction.followUp({
						content: 'You cannot play with bots',
						ephemeral: true
					});

				if (opponent.id == (message as ExtendedInteraction).user.id)
					return extInteraction.followUp({
						content: 'You cannot play with yourself!',
						ephemeral: true
					});
			} else if (!interaction) {
				opponent = extMessage.mentions.users.first();
				if (!opponent)
					return extMessage.reply({
						content: "You didn't mention an opponent"
					});

				if (opponent.bot)
					return extMessage.reply({
						content: "You can't play with bots !"
					});

				if (opponent.id === message.member.user.id)
					return extMessage.reply({
						content: 'You cannot play with yourself!'
					});
			}

			const requestEmbed = new EmbedBuilder()
				.setTitle(
					options?.embed?.request?.title || `Tictactoe with ${opponent.tag}`
				)
				.setDescription(
					options?.embed?.request?.description ||
						'Waiting for the opponent to accept/deny'
				)
				.setAuthor(
					options?.embed?.request?.author || {
						name: (message.member.user as User).tag,
						iconURL: (message.member.user as User).displayAvatarURL()
					}
				)
				.setColor(options.embed?.request?.color || toRgb(`#406DBC`))
				.setFooter(
					options.embed?.request?.footer
						? options.embed?.request?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				);

			if (options.embed?.request?.fields)
				requestEmbed.setFields(options.embed.request?.fields);
			if (options.embed?.request?.author)
				requestEmbed.setAuthor(options.embed.request?.author);
			if (options.embed?.request?.image)
				requestEmbed.setImage(options.embed.request?.image);
			if (options.embed?.request?.thumbnail)
				requestEmbed.setThumbnail(options.embed.request?.thumbnail);
			if (options.embed?.request?.timestamp)
				requestEmbed.setTimestamp(options.embed.request?.timestamp);
			if (options.embed?.request?.title)
				requestEmbed.setTitle(options.embed?.request?.title);
			if (options.embed?.request?.url)
				requestEmbed.setURL(options.embed?.request?.url);

			const accept = new ButtonBuilder()
				.setLabel('Accept')
				.setStyle(ButtonStyle.Success)
				.setCustomId('accept-ttt');

			const deny = new ButtonBuilder()
				.setLabel('Deny')
				.setStyle(ButtonStyle.Danger)
				.setCustomId('deny-ttt');

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
				accept,
				deny
			]);

			let m: Message;

			if (interaction) {
				m = await extInteraction.followUp({
					content: `<@${opponent.id}>, You got a tictactoe request from ${
						(message.member.user as User).tag
					}`,
					embeds: [requestEmbed],
					components: [row]
				});
			} else if (!interaction) {
				m = await extMessage.reply({
					content: `<@${opponent.id}>, You got a tictactoe request from ${
						(message.member.user as User).tag
					}`,
					embeds: [requestEmbed],
					components: [row]
				});
			}
			const collector = m.createMessageComponentCollector({
				componentType: ComponentType.Button,
				time: ms('30s')
			});

			collector.on('collect', async (button: ButtonInteraction) => {
				if (button.user.id !== opponent.id)
					await button.reply({
						content: 'You cannot play the game.',
						ephemeral: true
					});

				if (button.customId == 'deny-ttt') {
					await button.deferUpdate();

					collector.stop('decline');
				} else if (button.customId == 'accept-ttt') {
					collector.stop();

					if (interaction) {
						button.message.delete();
					}

					const players = [message.member.user.id, opponent.id].sort(() =>
						Math.random() > 0.5 ? 1 : -1
					);

					const x_emoji = options.buttons?.X?.emoji || '❌';
					const o_emoji = options.buttons?.O?.emoji || '⭕';

					const blank_emoji = options.buttons?.blank?.emoji || '➖';

					if (options.buttons?.blank?.style as string)
						options.buttons.blank.style = MessageButtonStyle(
							options.buttons?.blank?.style as string
						);
					if (options.buttons?.X?.style as string)
						options.buttons.X.style = MessageButtonStyle(
							options.buttons?.X?.style as string
						);
					if (options.buttons?.O?.style as string)
						options.buttons.O.style = MessageButtonStyle(
							options.buttons?.O?.style as string
						);

					const emptyStyle =
						(options.buttons?.blank?.style as ButtonStyle) ||
						ButtonStyle.Secondary;
					const XStyle =
						(options.buttons?.X?.style as ButtonStyle) || ButtonStyle.Danger;
					const OStyle =
						(options.buttons?.O?.style as ButtonStyle) || ButtonStyle.Success;

					const gameEmbed = new EmbedBuilder()
						.setTitle(options.embed?.game?.title || `Lets Play Tictactoe`)
						.setAuthor(
							options.embed?.game?.author || {
								name: (message.member.user as User).tag,
								iconURL: (message.member.user as User).displayAvatarURL({
									forceStatic: false
								})
							}
						)

						.setColor(options.embed?.game?.color || toRgb(`#406DBC`))
						.setFooter(
							options.embed?.game?.footer
								? options.embed?.game?.footer
								: {
										text: '©️ Rahuletto. npm i simply-djs',
										iconURL: 'https://i.imgur.com/XFUIwPh.png'
								  }
						);

					if (options.embed?.game?.fields)
						gameEmbed.setFields(options.embed?.game?.fields);
					if (options.embed?.game?.author)
						gameEmbed.setAuthor(options.embed?.game?.author);
					if (options.embed?.game?.image)
						gameEmbed.setImage(options.embed?.game?.image);
					if (options.embed?.game?.thumbnail)
						gameEmbed.setThumbnail(options.embed?.game?.thumbnail);
					if (options.embed?.game?.timestamp)
						gameEmbed.setTimestamp(options.embed?.game?.timestamp);
					if (options.embed?.game?.url)
						gameEmbed.setURL(options.embed?.game?.url);

					let msg: Message = await button.message.edit({
						embeds: [
							gameEmbed.setDescription(
								`Waiting for Input | <@!${players[0]}>, Your Emoji: ${
									client.emojis.cache.get(o_emoji) || '⭕'
								}`
							)
						]
					});
					const Game = {
						user: 0,
						userid: '',
						board: [
							{
								style: emptyStyle,
								emoji: blank_emoji,
								disabled: false
							},
							{
								style: emptyStyle,
								emoji: blank_emoji,
								disabled: false
							},
							{
								style: emptyStyle,
								emoji: blank_emoji,
								disabled: false
							},
							{
								style: emptyStyle,
								emoji: blank_emoji,
								disabled: false
							},
							{
								style: emptyStyle,
								emoji: blank_emoji,
								disabled: false
							},
							{
								style: emptyStyle,
								emoji: blank_emoji,
								disabled: false
							},
							{
								style: emptyStyle,
								emoji: blank_emoji,
								disabled: false
							},
							{
								style: emptyStyle,
								emoji: blank_emoji,
								disabled: false
							},
							{
								style: emptyStyle,
								emoji: blank_emoji,
								disabled: false
							}
						]
					};

					await tictactoeEngine(msg, {
						blank_emoji: blank_emoji
					});

					async function tictactoeEngine(
						m: Message,
						styles: {
							blank_emoji?: string;
						} = {}
					) {
						const { blank_emoji } = styles;
						Game.userid = players[Game.user];

						const won = {
							O: false,
							X: false
						};

						function checkWin(emoji: string) {
							return combinations.some((combination) => {
								return combination.every((index) => {
									return Game.board[index].emoji == emoji;
								});
							});
						}

						function isDraw() {
							return [...Game.board].every((cell) => {
								return cell.emoji == x_emoji || cell.emoji == o_emoji;
							});
						}

						if (isDraw()) {
							if (options.result === 'Button')
								return m
									.edit({
										content: 'Its a Tie!',
										embeds: [
											gameEmbed.setDescription(
												`You have tied. Play again to see who wins.`
											)
										]
									})
									.then((m: Message) => {
										m.react(blank_emoji);
									});
							else
								return m
									.edit({
										content: 'Its a Tie !',
										embeds: [
											gameEmbed.setDescription(
												`You have tied. Play again to see who wins.\n` +
													`\`\`\`\n${Game.board[0].emoji} | ${Game.board[1].emoji} | ${Game.board[2].emoji}\n${Game.board[3].emoji} | ${Game.board[4].emoji} | ${Game.board[5].emoji}\n${Game.board[6].emoji} | ${Game.board[7].emoji} | ${Game.board[8].emoji}\n\`\`\``
														.replaceAll(blank_emoji, '➖')
														.replaceAll(o_emoji, '⭕')
														.replaceAll(x_emoji, '❌')
											)
										],
										components: []
									})
									.then((m) => {
										m.react(blank_emoji);
									})
									.catch(() => {});
						}

						const a1 = new ButtonBuilder()
							.setStyle(Game.board[0].style)
							.setEmoji(Game.board[0].emoji)
							.setCustomId('0')
							.setDisabled(Game.board[0].disabled);

						const a2 = new ButtonBuilder()
							.setStyle(Game.board[1].style)
							.setEmoji(Game.board[1].emoji)
							.setCustomId('1')
							.setDisabled(Game.board[1].disabled);

						const a3 = new ButtonBuilder()
							.setStyle(Game.board[2].style)
							.setEmoji(Game.board[2].emoji)
							.setCustomId('2')
							.setDisabled(Game.board[2].disabled);

						const b1 = new ButtonBuilder()
							.setStyle(Game.board[3].style)
							.setEmoji(Game.board[3].emoji)
							.setCustomId('3')
							.setDisabled(Game.board[3].disabled);

						const b2 = new ButtonBuilder()
							.setStyle(Game.board[4].style)
							.setEmoji(Game.board[4].emoji)
							.setCustomId('4')
							.setDisabled(Game.board[4].disabled);

						const b3 = new ButtonBuilder()
							.setStyle(Game.board[5].style)
							.setEmoji(Game.board[5].emoji)
							.setCustomId('5')
							.setDisabled(Game.board[5].disabled);

						const c1 = new ButtonBuilder()
							.setStyle(Game.board[6].style)
							.setEmoji(Game.board[6].emoji)
							.setCustomId('6')
							.setDisabled(Game.board[6].disabled);
						const c2 = new ButtonBuilder()
							.setStyle(Game.board[7].style)
							.setEmoji(Game.board[7].emoji)
							.setCustomId('7')
							.setDisabled(Game.board[7].disabled);

						const c3 = new ButtonBuilder()
							.setStyle(Game.board[8].style)
							.setEmoji(Game.board[8].emoji)
							.setCustomId('8')
							.setDisabled(Game.board[8].disabled);

						const a = new ActionRowBuilder<ButtonBuilder>().addComponents([
							a1,
							a2,
							a3
						]);
						const b = new ActionRowBuilder<ButtonBuilder>().addComponents([
							b1,
							b2,
							b3
						]);
						const c = new ActionRowBuilder<ButtonBuilder>().addComponents([
							c1,
							c2,
							c3
						]);
						const buttons = [a, b, c];

						if (checkWin(o_emoji)) won['O'] = true;

						if (checkWin(x_emoji)) won['X'] = true;

						if (won['O'] == true) {
							const winner: User | void = await client.users
								.fetch(players[1])
								.catch(console.error);
							resolve(winner as User);

							if (options.result === 'Button')
								return m
									.edit({
										content: `<@${players[Game.user === 0 ? 1 : 0]}> (${
											client.emojis.cache.get(o_emoji) || '⭕'
										}) won`,
										components: buttons,

										embeds: [
											gameEmbed.setDescription(
												`<@!${players[Game.user === 0 ? 1 : 0]}> (${
													client.emojis.cache.get(o_emoji) || '⭕'
												}) won, That was a nice game.`
											)
										]
									})
									.then((m: Message) => {
										m.react('⭕');
									});
							else if (!options.result || options.result === 'Embed')
								return m
									.edit({
										content: `<@${players[Game.user === 0 ? 1 : 0]}> (${
											client.emojis.cache.get(o_emoji) || '⭕'
										}) won`,

										embeds: [
											gameEmbed.setDescription(
												`<@!${players[Game.user === 0 ? 1 : 0]}> (${
													client.emojis.cache.get(o_emoji) || '⭕'
												}) won.. That was a nice game.\n` +
													`\`\`\`\n${Game.board[0].emoji} | ${Game.board[1].emoji} | ${Game.board[2].emoji}\n${Game.board[3].emoji} | ${Game.board[4].emoji} | ${Game.board[5].emoji}\n${Game.board[6].emoji} | ${Game.board[7].emoji} | ${Game.board[8].emoji}\n\`\`\``
														.replaceAll(blank_emoji, '➖')
														.replaceAll(o_emoji, '⭕')
														.replaceAll(x_emoji, '❌')
											)
										],
										components: []
									})
									.then((m: Message) => {
										m.react('⭕');
									});
						} else if (won['X'] == true) {
							const winner: User | void = await client.users
								.fetch(players[1])
								.catch(console.error);
							resolve(winner as User);

							if (options.result === 'Button')
								return m
									.edit({
										content: `<@${players[Game.user === 0 ? 1 : 0]}> (${
											client.emojis.cache.get(x_emoji) || '❌'
										}) won`,
										components: buttons,

										embeds: [
											gameEmbed.setDescription(
												`<@!${players[Game.user === 0 ? 1 : 0]}> (${
													client.emojis.cache.get(x_emoji) || '❌'
												}) won, That was a nice game.`
											)
										]
									})
									.then((m: Message) => {
										m.react('❌');
									});
							else if (!options.result || options.result === 'Embed')
								return m
									.edit({
										content: `<@${players[Game.user === 0 ? 1 : 0]}> (${
											client.emojis.cache.get(o_emoji) || '❌'
										}) won`,

										embeds: [
											gameEmbed.setDescription(
												`<@!${players[Game.user === 0 ? 1 : 0]}> (${
													client.emojis.cache.get(x_emoji) || '❌'
												}) won.. That was a nice game.\n` +
													`\`\`\`\n${Game.board[0].emoji} | ${Game.board[1].emoji} | ${Game.board[2].emoji}\n${Game.board[3].emoji} | ${Game.board[4].emoji} | ${Game.board[5].emoji}\n${Game.board[6].emoji} | ${Game.board[7].emoji} | ${Game.board[8].emoji}\n\`\`\``
														.replaceAll(blank_emoji, '➖')
														.replaceAll(o_emoji, '⭕')
														.replaceAll(x_emoji, '❌')
											)
										],
										components: []
									})
									.then((m: Message) => {
										m.react('❌');
									});
						}

						m.edit({
							content: `<@${Game.userid}>`,
							embeds: [
								gameEmbed.setDescription(
									`Waiting for Input | <@!${Game.userid}> | Your Emoji: ${
										Game.user == 0
											? `${client.emojis.cache.get(o_emoji) || '⭕'}`
											: `${client.emojis.cache.get(x_emoji) || '❌'}`
									}`
								)
							],
							components: [a, b, c]
						});

						const collector = m.createMessageComponentCollector({
							componentType: ComponentType.Button,
							max: 1,
							time: 30000
						});

						collector.on('collect', async (b: ButtonInteraction) => {
							if (b.user.id !== Game.userid) {
								b.reply({
									content: 'You cannot play now',
									ephemeral: true
								});
							} else {
								await b.deferUpdate();

								if (Game.user == 0) {
									Game.user = 1;
									Game.board[Number(b.customId)] = {
										style: OStyle,
										emoji: o_emoji,
										disabled: true
									};
								} else {
									Game.user = 0;

									Game.board[Number(b.customId)] = {
										style: XStyle,
										emoji: x_emoji,
										disabled: true
									};
								}
							}
							await tictactoeEngine(m, {
								blank_emoji: blank_emoji
							});
						});
						collector.on('end', (collected, reason: string) => {
							const timeoutEmbed = new EmbedBuilder()
								.setTitle(options.embed?.timeout?.title || 'Game Timed Out!')
								.setColor(options.embed?.timeout?.color || 'Red')
								.setDescription(
									options.embed?.timeout?.description ||
										'The opponent didnt respond in time (30s)'
								)
								.setFooter(
									options.embed?.timeout?.footer
										? options.embed?.timeout?.footer
										: {
												text: '©️ Rahuletto. npm i simply-djs',
												iconURL: 'https://i.imgur.com/XFUIwPh.png'
										  }
								);

							if (options.embed?.timeout?.fields)
								timeoutEmbed.setFields(options.embed?.timeout?.fields);
							if (options.embed?.timeout?.author)
								timeoutEmbed.setAuthor(options.embed?.timeout?.author);
							if (options.embed?.timeout?.image)
								timeoutEmbed.setImage(options.embed?.timeout?.image);
							if (options.embed?.timeout?.thumbnail)
								timeoutEmbed.setThumbnail(options.embed?.timeout?.thumbnail);
							if (options.embed?.timeout?.timestamp)
								timeoutEmbed.setTimestamp(options.embed?.timeout?.timestamp);
							if (options.embed?.timeout?.url)
								timeoutEmbed.setURL(options.embed?.timeout?.url);

							if (collected.size === 0 && reason == 'time')
								m.edit({
									content: `<@!${Game.userid}> didn\'t react in time! (30s)`,
									embeds: [timeoutEmbed],
									components: []
								});
						});
					}
				}
			});

			collector.on('end', (collected, reason: string) => {
				if (reason == 'time') {
					const timeoutEmbed = new EmbedBuilder()
						.setTitle(options.embed?.timeout?.title || 'Game Timed Out!')
						.setColor(options.embed?.timeout?.color || 'Red')
						.setDescription(
							options.embed?.timeout?.description ||
								'The opponent didnt respond in time (30s)'
						)
						.setFooter(
							options.embed?.timeout?.footer
								? options.embed?.timeout?.footer
								: {
										text: '©️ Rahuletto. npm i simply-djs',
										iconURL: 'https://i.imgur.com/XFUIwPh.png'
								  }
						);

					if (options.embed?.timeout?.fields)
						timeoutEmbed.setFields(options.embed?.timeout?.fields);
					if (options.embed?.timeout?.author)
						timeoutEmbed.setAuthor(options.embed?.timeout?.author);
					if (options.embed?.timeout?.image)
						timeoutEmbed.setImage(options.embed?.timeout?.image);
					if (options.embed?.timeout?.thumbnail)
						timeoutEmbed.setThumbnail(options.embed?.timeout?.thumbnail);
					if (options.embed?.timeout?.timestamp)
						timeoutEmbed.setTimestamp(options.embed?.timeout?.timestamp);
					if (options.embed?.timeout?.url)
						timeoutEmbed.setURL(options.embed?.timeout?.url);

					(m as Message).edit({
						content: `<@${opponent.id}> did not accept in time !`,
						embeds: [timeoutEmbed],
						components: []
					});
				} else if (reason == 'decline') {
					const declineEmbed = new EmbedBuilder()
						.setColor(options.embed?.decline?.color || 'Red')
						.setFooter(
							options.embed?.decline?.footer
								? options.embed?.decline?.footer
								: {
										text: '©️ Rahuletto. npm i simply-djs',
										iconURL: 'https://i.imgur.com/XFUIwPh.png'
								  }
						)
						.setTitle(options.embed?.decline?.title || 'Game Declined!')
						.setDescription(
							options.embed?.decline?.description ||
								`${opponent.tag} has declined your game request!`
						);

					if (options.embed?.decline?.fields)
						declineEmbed.setFields(options.embed?.decline?.fields);
					if (options.embed?.decline?.author)
						declineEmbed.setAuthor(options.embed?.decline?.author);
					if (options.embed?.decline?.image)
						declineEmbed.setImage(options.embed?.decline?.image);
					if (options.embed?.decline?.thumbnail)
						declineEmbed.setThumbnail(options.embed?.decline?.thumbnail);
					if (options.embed?.decline?.timestamp)
						declineEmbed.setTimestamp(options.embed?.decline?.timestamp);
					if (options.embed?.decline?.url)
						declineEmbed.setURL(options.embed?.decline?.url);

					m.edit({
						embeds: [declineEmbed],
						components: []
					});
				}
			});
		} catch (err: any) {
			if (options.strict)
				throw new SimplyError({
					function: 'tictactoe',
					title: 'An Error occured when running the function ',
					tip: err.stack
				});
			else console.log(`SimplyError - tictactoe | Error: ${err.stack}`);
		}
	});
}
