import {
	APIMessageComponentEmoji,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
	Message,
	User
} from 'discord.js';
import {
	CustomizableEmbed,
	ExtendedInteraction,
	ExtendedMessage,
	CustomizableButton
} from './typedef';
import { toButtonStyle, disableButtons, ms, toRgb } from './misc';
import { SimplyError } from './error';

const limiter: { guild: string; limit: number }[] = [];

// ------------------------------
// ----- I N T E R F A C E ------
// ------------------------------

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/fun/tictactoe#tictactoebuttons
 */

export interface TictactoeButtons {
	X?: CustomizableButton;
	O?: CustomizableButton;
	blank?: CustomizableButton;
}

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/fun/tictactoe#tictactoeembeds
 */

export interface TictactoeEmbeds {
	request?: CustomizableEmbed;
	win?: CustomizableEmbed;
	draw?: CustomizableEmbed;
	game?: CustomizableEmbed;
	timeout?: CustomizableEmbed;
	decline?: CustomizableEmbed;
}

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/fun/tictactoe#tictactoeoptions
 */

export type tictactoeOptions = {
	embed?: TictactoeEmbeds;
	user?: User;
	type?: 'Button' | 'Embed';
	max: number;

	buttons?: TictactoeButtons;

	strict?: boolean;
	hard?: boolean;
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
 * @link `Documentation:` https://simplyd.js.org/docs/Fun/tictactoe
 * @example simplydjs.tictactoe(interaction)
 */

export async function tictactoe(
	message: ExtendedMessage | ExtendedInteraction,
	options: tictactoeOptions = { max: 6, strict: false }
): Promise<User> {
	return new Promise(async (resolve) => {
		try {
			const { client } = message;

			let interaction: ExtendedInteraction;

			if ((message as ExtendedInteraction).commandId) {
				interaction = message as ExtendedInteraction;
				if (!interaction.deferred)
					await interaction.deferReply({ fetchReply: true });
			}

			let opponent: User;

			const extInteraction = message as ExtendedInteraction;
			const extMessage = message as ExtendedMessage;

			let id = limiter.findIndex((a) => a.guild == message.guild.id);
			if (!limiter[id] || !limiter[id].guild) {
				limiter.push({
					guild: message.guild.id,
					limit: 0
				});

				id = limiter.findIndex(
					(a: { guild: string; limit: number }) => a.guild == message.guild.id
				);
			}

			if (limiter[id].limit >= (options?.max || 6)) {
				if (interaction)
					return extInteraction.followUp({
						content:
							'Sorry, There is a game happening right now. Please try later.'
					});
				else if (!interaction)
					return extMessage.reply({
						content:
							'Sorry, There is a game happening right now. Please try later.'
					});
			}

			const x_emoji =
				(options.buttons?.X?.emoji as APIMessageComponentEmoji)?.id ||
				options.buttons?.X?.emoji ||
				'❌';
			const o_emoji =
				(options.buttons?.O?.emoji as APIMessageComponentEmoji)?.id ||
				options.buttons?.O?.emoji ||
				'⭕';

			const blank_emoji = options.buttons?.blank?.emoji || '➖';

			if (options?.buttons?.blank?.style as string)
				options.buttons.blank.style = toButtonStyle(
					options?.buttons?.blank?.style as string
				);

			if (options?.buttons?.X?.style as string)
				options.buttons.X.style = toButtonStyle(
					options?.buttons?.X?.style as string
				);

			if (options?.buttons?.O?.style as string)
				options.buttons.O.style = toButtonStyle(
					options?.buttons?.O?.style as string
				);

			const emptyStyle =
				(options.buttons?.blank?.style as ButtonStyle) || ButtonStyle.Secondary;
			const XStyle =
				(options.buttons?.X?.style as ButtonStyle) || ButtonStyle.Danger;
			const OStyle =
				(options.buttons?.O?.style as ButtonStyle) || ButtonStyle.Success;

			if (interaction) {
				opponent = options.user || extInteraction.options.getUser('user');

				if (!opponent)
					return ai(message, {
						max: options?.max || 6,
						blank_emoji: blank_emoji,
						x_emoji: x_emoji,
						o_emoji: o_emoji,
						x_style: XStyle,
						o_style: OStyle,
						emptyStyle: emptyStyle,
						embed: options.embed,
						buttons: options.buttons,
						type: options.type,
						hard: options.hard || false
					});

				if (opponent.bot)
					return extInteraction.followUp({
						content: 'You cannot play with bots!',
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
					return ai(message, {
						max: options?.max || 6,
						blank_emoji,
						x_emoji,
						o_emoji,
						x_style: XStyle,
						o_style: OStyle,
						emptyStyle,
						embed: options.embed,
						buttons: options.buttons,
						type: options.type
					});

				if (opponent.bot)
					return extMessage.reply({
						content: "You can't play with bots!"
					});

				if (opponent.id === message.member.user.id)
					return extMessage.reply({
						content: 'You cannot play with yourself!'
					});
			}

			const requestEmbed = new EmbedBuilder()
				.setTitle(
					options?.embed?.request?.title ||
						`Tictactoe with ${opponent.username}`
				)
				.setDescription(
					options?.embed?.request?.description ||
						'Waiting for the opponent to accept/deny'
				)
				.setAuthor(
					options?.embed?.request?.author || {
						name: (message.member.user as User).username,
						iconURL: (message.member.user as User).displayAvatarURL({
							forceStatic: false
						})
					}
				)
				.setColor(options.embed?.request?.color || toRgb('#406DBC'))
				.setFooter(
					options.embed?.request?.footer
						? options.embed?.request?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				);

			if (options?.embed?.request?.fields)
				requestEmbed.setFields(options.embed?.request?.fields);
			if (options?.embed?.request?.author)
				requestEmbed.setAuthor(options.embed?.request?.author);
			if (options?.embed?.request?.image)
				requestEmbed.setImage(options.embed?.request?.image);
			if (options?.embed?.request?.thumbnail)
				requestEmbed.setThumbnail(options.embed?.request?.thumbnail);
			if (options?.embed?.request?.timestamp)
				requestEmbed.setTimestamp(options.embed?.request?.timestamp);
			if (options?.embed?.request?.title)
				requestEmbed.setTitle(options.embed?.request?.title);
			if (options?.embed?.request?.url)
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
						(message.member.user as User).username
					}`,
					embeds: [requestEmbed],
					components: [row]
				});
			} else if (!interaction) {
				m = await extMessage.reply({
					content: `<@${opponent.id}>, You got a tictactoe request from ${
						(message.member.user as User).username
					}`,
					embeds: [requestEmbed],
					components: [row]
				});
			}

			limiter[id].limit += 1;

			const collector = m.createMessageComponentCollector({
				componentType: ComponentType.Button,
				time: ms('30s')
			});

			collector.on('collect', async (button: ButtonInteraction) => {
				if (button.user.id !== opponent.id) {
					await button.reply({
						content: `Only <@!${opponent.id}> can use these buttons!`,
						ephemeral: true
					});
					return;
				}

				if (button.customId == 'deny-ttt') {
					await button.deferUpdate();

					collector.stop('decline');
				} else if (button.customId == 'accept-ttt') {
					await button.deferUpdate();
					collector.stop();

					const players = [message.member.user.id, opponent.id].sort(() =>
						Math.random() > 0.5 ? 1 : -1
					);

					const gameEmbed = new EmbedBuilder()
						.setTitle(
							options.embed?.game?.title ||
								`${message.member.user.username} VS ${opponent.username}`
						)
						.setAuthor(
							options.embed?.game?.author || {
								name: (message.member.user as User).username,
								iconURL: (message.member.user as User).displayAvatarURL({
									forceStatic: false
								})
							}
						)
						.setColor(options.embed?.game?.color || toRgb('#406DBC'))
						.setFooter(
							options.embed?.game?.footer
								? options.embed?.game?.footer
								: {
										text: '©️ Rahuletto. npm i simply-djs',
										iconURL: 'https://i.imgur.com/XFUIwPh.png'
								  }
						);

					if (options?.embed?.game?.fields)
						gameEmbed.setFields(options.embed?.game?.fields);
					if (options?.embed?.game?.author)
						gameEmbed.setAuthor(options.embed?.game?.author);
					if (options?.embed?.game?.image)
						gameEmbed.setImage(options.embed?.game?.image);
					if (options?.embed?.game?.thumbnail)
						gameEmbed.setThumbnail(options.embed?.game?.thumbnail);
					if (options?.embed?.game?.timestamp)
						gameEmbed.setTimestamp(options.embed?.game?.timestamp);
					if (options?.embed?.game?.url)
						gameEmbed.setURL(options.embed?.game?.url);

					const msg: Message = await button.message.edit({
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
						board: Array(9).fill({
							style: emptyStyle,
							emoji: blank_emoji,
							disabled: false
						}) as {
							style: ButtonStyle;
							emoji: string;
							disabled: boolean;
						}[]
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

						const winEmbed = new EmbedBuilder()
							.setTitle(
								options.embed?.win?.title ||
									`${message.member.user.username} VS ${opponent.username}`
							)

							.setColor(options.embed?.win?.color || `DarkGreen`)
							.setFooter(
								options.embed?.win?.footer
									? options.embed?.win?.footer
									: {
											text: '©️ Rahuletto. npm i simply-djs',
											iconURL: 'https://i.imgur.com/XFUIwPh.png'
									  }
							);

						if (options?.embed?.win?.fields)
							winEmbed.setFields(options.embed?.win?.fields);
						if (options?.embed?.win?.author)
							winEmbed.setAuthor(options.embed?.win?.author);
						if (options?.embed?.win?.image)
							winEmbed.setImage(options.embed?.win?.image);
						if (options?.embed?.win?.thumbnail)
							winEmbed.setThumbnail(options.embed?.win?.thumbnail);
						if (options?.embed?.win?.timestamp)
							winEmbed.setTimestamp(options.embed?.win?.timestamp);
						if (options?.embed?.win?.url)
							winEmbed.setURL(options.embed?.win?.url);

						if (checkWin(o_emoji)) won['O'] = true;

						if (checkWin(x_emoji)) won['X'] = true;

						if (won['O'] == true) {
							limiter[id].limit -= 1;

							if (limiter[id].limit < 0) limiter[id].limit = 0;
							const winner: User | void = await client.users
								.fetch(players[Game.user === 0 ? 1 : 0])
								.catch(console.error);
							resolve(winner as User);

							if (!options.type || options.type === 'Button')
								return m
									.edit({
										content: `<@${players[Game.user === 0 ? 1 : 0]}> (${
											client.emojis.cache.get(o_emoji) || '⭕'
										}) won`,
										components: disableButtons(buttons),

										embeds: [
											winEmbed
												.setAuthor(
													options.embed?.win?.author || {
														name: (winner as User).username,
														iconURL: (winner as User).displayAvatarURL({
															forceStatic: false
														})
													}
												)
												.setDescription(
													`<@!${players[Game.user === 0 ? 1 : 0]}> (${
														client.emojis.cache.get(o_emoji) || '⭕'
													}) won, That was a nice game.`
												)
										]
									})
									.then((m: Message) => {
										m.react(client.emojis.cache.get(o_emoji) || '⭕');
									});
							else if (options?.type === 'Embed')
								return m
									.edit({
										content: `<@${players[Game.user === 0 ? 1 : 0]}> (${
											client.emojis.cache.get(o_emoji) || '⭕'
										}) won`,

										embeds: [
											winEmbed
												.setAuthor(
													options.embed?.win?.author || {
														name: (winner as User).username,
														iconURL: (winner as User).displayAvatarURL({
															forceStatic: false
														})
													}
												)
												.setDescription(
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
										m.react(client.emojis.cache.get(o_emoji) || '⭕');
									});
						} else if (won['X'] == true) {
							limiter[id].limit -= 1;

							if (limiter[id].limit < 0) limiter[id].limit = 0;

							const winner: User | void = await client.users
								.fetch(players[Game.user === 0 ? 1 : 0])
								.catch(console.error);
							resolve(winner as User);

							if (!options.type || options.type === 'Button')
								return m
									.edit({
										content: `<@${players[Game.user === 0 ? 1 : 0]}> (${
											client.emojis.cache.get(x_emoji) || '❌'
										}) won`,
										components: disableButtons(buttons),

										embeds: [
											winEmbed
												.setAuthor(
													options.embed?.win?.author || {
														name: (winner as User).username,
														iconURL: (winner as User).displayAvatarURL({
															forceStatic: false
														})
													}
												)
												.setDescription(
													`<@!${players[Game.user === 0 ? 1 : 0]}> (${
														client.emojis.cache.get(x_emoji) || '❌'
													}) won, That was a nice game.`
												)
										]
									})
									.then((m: Message) => {
										m.react(client.emojis.cache.get(x_emoji) || '❌');
									});
							else if (options?.type === 'Embed')
								return m
									.edit({
										content: `<@${players[Game.user === 0 ? 1 : 0]}> (${
											client.emojis.cache.get(o_emoji) || '❌'
										}) won`,

										embeds: [
											winEmbed
												.setAuthor(
													options.embed?.win?.author || {
														name: (winner as User).username,
														iconURL: (winner as User).displayAvatarURL({
															forceStatic: false
														})
													}
												)
												.setDescription(
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
										m.react(client.emojis.cache.get(x_emoji) || '❌');
									});
						}
						if (isDraw()) {
							limiter[id].limit -= 1;

							if (limiter[id].limit < 0) limiter[id].limit = 0;
							const drawEmbed = new EmbedBuilder()
								.setTitle(
									options.embed?.draw?.title ||
										`${message.member.user.username} VS ${opponent.username}`
								)

								.setColor(options.embed?.draw?.color || 'Grey')
								.setFooter(
									options.embed?.draw?.footer
										? options.embed?.draw?.footer
										: {
												text: '©️ Rahuletto. npm i simply-djs',
												iconURL: 'https://i.imgur.com/XFUIwPh.png'
										  }
								);

							if (options?.embed?.draw?.fields)
								drawEmbed.setFields(options.embed?.draw?.fields);
							if (options?.embed?.draw?.author)
								drawEmbed.setAuthor(options.embed?.draw?.author);
							if (options?.embed?.draw?.image)
								drawEmbed.setImage(options.embed?.draw?.image);
							if (options?.embed?.draw?.thumbnail)
								drawEmbed.setThumbnail(options.embed?.draw?.thumbnail);
							if (options?.embed?.draw?.timestamp)
								drawEmbed.setTimestamp(options.embed?.draw?.timestamp);
							if (options?.embed?.draw?.url)
								drawEmbed.setURL(options.embed?.draw?.url);

							if (!options.type || options.type === 'Button')
								return m
									.edit({
										content: 'Its a Tie!',
										embeds: [
											drawEmbed.setDescription(
												`You have tied. Play again to see who wins.`
											)
										],
										components: buttons
									})
									.then((m: Message) => {
										m.react(blank_emoji);
									});
							else
								return m
									.edit({
										content: 'Its a Tie !',
										embeds: [
											drawEmbed.setDescription(
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

						const play = await client.users.fetch(players[Game.user]);

						m.edit({
							content: `<@${Game.userid}>`,
							embeds: [
								gameEmbed
									.setAuthor(
										options.embed?.game?.author || {
											name: play.username,
											iconURL: play.displayAvatarURL({
												forceStatic: false
											})
										}
									)
									.setDescription(
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
							time: ms('30s')
						});

						collector.on('collect', async (b: ButtonInteraction) => {
							if (
								b.user.id !== Game.userid &&
								b.user.id === (message.member.user as User).id
							) {
								b.reply({
									content: `It's <@!${opponent.id}>'s' turn!`,
									ephemeral: true
								});
							} else if (
								b.user.id !== Game.userid &&
								b.user.id === opponent.id
							) {
								b.reply({
									content: `It's <@!${
										(message.member.user as User).id
									}>'s' turn!`,
									ephemeral: true
								});
							} else if (
								b.user.id !== Game.userid &&
								b.user.id !== opponent.id &&
								b.user.id !== (message.member.user as User).id
							) {
								b.reply({
									content: `You cannot play this game!`,
									ephemeral: true
								});
							} else if (
								b.user.id === Game.userid &&
								(b.user.id === opponent.id ||
									b.user.id === message.member.user.id) &&
								Game.board[Number(b.customId)].emoji === x_emoji
							) {
								b.reply({
									content: `That position is pre-occupied by ${
										client.emojis.cache.get(x_emoji) || '❌'
									}!`,
									ephemeral: true
								});
							} else if (
								b.user.id === Game.userid &&
								(b.user.id === opponent.id ||
									b.user.id === message.member.user.id) &&
								Game.board[Number(b.customId)].emoji === o_emoji
							) {
								b.reply({
									content: `That position is pre-occupied by ${
										client.emojis.cache.get(o_emoji) || '⭕'
									}!`,
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
							limiter[id].limit -= 1;

							if (limiter[id].limit < 0) limiter[id].limit = 0;
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

							if (options?.embed?.timeout?.fields)
								timeoutEmbed.setFields(options.embed?.timeout?.fields);
							if (options?.embed?.timeout?.author)
								timeoutEmbed.setAuthor(options.embed?.timeout?.author);
							if (options?.embed?.timeout?.image)
								timeoutEmbed.setImage(options.embed?.timeout?.image);
							if (options?.embed?.timeout?.thumbnail)
								timeoutEmbed.setThumbnail(options.embed?.timeout?.thumbnail);
							if (options?.embed?.timeout?.timestamp)
								timeoutEmbed.setTimestamp(options.embed?.timeout?.timestamp);
							if (options?.embed?.timeout?.url)
								timeoutEmbed.setURL(options.embed?.timeout?.url);

							if (collected.size === 0 && reason == 'idle')
								if (!options.type || options.type === 'Button')
									m.edit({
										content: `<@!${Game.userid}> didn't react in time! (30s)`,
										embeds: [timeoutEmbed],

										components: disableButtons(buttons)
									});
								else
									m.edit({
										content: `The opponent didnt respond in time (30s)`,
										embeds: [
											timeoutEmbed.setDescription(
												`<@!${Game.userid}> didn't react in time! (30s)\n` +
													`\`\`\`\n${Game.board[0].emoji} | ${Game.board[1].emoji} | ${Game.board[2].emoji}\n${Game.board[3].emoji} | ${Game.board[4].emoji} | ${Game.board[5].emoji}\n${Game.board[6].emoji} | ${Game.board[7].emoji} | ${Game.board[8].emoji}\n\`\`\``
														.replaceAll(blank_emoji, '➖')
														.replaceAll(o_emoji, '⭕')
														.replaceAll(x_emoji, '❌')
											)
										],

										components: []
									});
						});
					}
				}
			});

			collector.on('end', (_collected, reason: string) => {
				limiter[id].limit -= 1;

				if (limiter[id].limit < 0) limiter[id].limit = 0;
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

					if (options?.embed?.timeout?.fields)
						timeoutEmbed.setFields(options.embed?.timeout?.fields);
					if (options?.embed?.timeout?.author)
						timeoutEmbed.setAuthor(options.embed?.timeout?.author);
					if (options?.embed?.timeout?.image)
						timeoutEmbed.setImage(options.embed?.timeout?.image);
					if (options?.embed?.timeout?.thumbnail)
						timeoutEmbed.setThumbnail(options.embed?.timeout?.thumbnail);
					if (options?.embed?.timeout?.timestamp)
						timeoutEmbed.setTimestamp(options.embed?.timeout?.timestamp);
					if (options?.embed?.timeout?.url)
						timeoutEmbed.setURL(options.embed?.timeout?.url);

					(m as Message).edit({
						content: `<@${opponent.id}> did not accept in time!`,
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
								`${opponent.username} has declined your game request!`
						);

					if (options?.embed?.decline?.fields)
						declineEmbed.setFields(options.embed?.decline?.fields);
					if (options?.embed?.decline?.author)
						declineEmbed.setAuthor(options.embed?.decline?.author);
					if (options?.embed?.decline?.image)
						declineEmbed.setImage(options.embed?.decline?.image);
					if (options?.embed?.decline?.thumbnail)
						declineEmbed.setThumbnail(options.embed?.decline?.thumbnail);
					if (options?.embed?.decline?.timestamp)
						declineEmbed.setTimestamp(options.embed?.decline?.timestamp);
					if (options?.embed?.decline?.url)
						declineEmbed.setURL(options.embed?.decline?.url);

					m.edit({
						embeds: [declineEmbed],
						components: []
					});
				}
			});
		} catch (err: any) {
			{
				if (options?.strict)
					throw new SimplyError({
						function: 'tictactoe',
						title: 'An Error occured when running the function ',
						tip: err.stack
					});
				else console.log(`SimplyError - tictactoe | Error: ${err.stack}`);
			}
		}
	});
}

// for ai (not useful for user)
type aiOptions = {
	max: number;
	blank_emoji?: string;
	x_emoji?: string;
	o_emoji?: string;
	x_style?: ButtonStyle;
	o_style?: ButtonStyle;
	emptyStyle?: ButtonStyle;
	embed?: TictactoeEmbeds;
	buttons?: TictactoeButtons;
	type?: 'Button' | 'Embed';
	hard?: boolean;
};

async function ai(
	msgOrint: ExtendedMessage | ExtendedInteraction,
	options: aiOptions = { max: 5 }
) {
	const { client } = msgOrint;
	let board = ['', '', '', '', '', '', '', '', ''];

	let message: Message<boolean>;

	let interaction: ExtendedInteraction;

	if ((msgOrint as ExtendedInteraction).commandId) {
		interaction = msgOrint as ExtendedInteraction;
	}

	const extInteraction = msgOrint as ExtendedInteraction;
	const extMessage = msgOrint as ExtendedMessage;

	let id = limiter.findIndex(
		(a: { guild: string; limit: number }) => a.guild == msgOrint.guild.id
	);

	if (!limiter[id] || !limiter[id].guild) {
		limiter.push({
			guild: msgOrint.guild.id,
			limit: 0
		});

		id = limiter.findIndex((a) => a.guild == msgOrint.guild.id);
	}

	if (limiter[id].limit >= (options?.max || 6)) {
		if (interaction)
			return extInteraction.followUp({
				content: 'Sorry, There is a game happening right now. Please try later.'
			});
		else if (!interaction)
			return extMessage.reply({
				content: 'Sorry, There is a game happening right now. Please try later.'
			});
	}

	const Game = {
		board: Array(9).fill({
			style: options.emptyStyle,
			emoji: options.blank_emoji,
			disabled: false
		}) as {
			style: ButtonStyle;
			emoji: string;
			disabled: boolean;
		}[]
	};

	const opponent = msgOrint.client.user;

	const gameEmbed = new EmbedBuilder()
		.setTitle(
			options.embed?.game?.title ||
				`${msgOrint.member.user.username} VS ${opponent.username}`
		)
		.setAuthor(
			options.embed?.game?.author || {
				name: (msgOrint.member.user as User).username,
				iconURL: (msgOrint.member.user as User).displayAvatarURL({
					forceStatic: false
				})
			}
		)
		.setDescription(
			`Waiting for Input | <@!${msgOrint.member.user.id}> | Your Emoji: ${
				client.emojis.cache.get(options.x_emoji) || '❌'
			}`
		)
		.setColor(options.embed?.game?.color || toRgb('#406DBC'))
		.setFooter(
			options.embed?.game?.footer
				? options.embed?.game?.footer
				: {
						text: '©️ Rahuletto. npm i simply-djs',
						iconURL: 'https://i.imgur.com/XFUIwPh.png'
				  }
		);

	if (options?.embed?.game?.fields)
		gameEmbed.setFields(options.embed?.game?.fields);
	if (options?.embed?.game?.author)
		gameEmbed.setAuthor(options.embed?.game?.author);
	if (options?.embed?.game?.image)
		gameEmbed.setImage(options.embed?.game?.image);
	if (options?.embed?.game?.thumbnail)
		gameEmbed.setThumbnail(options.embed?.game?.thumbnail);
	if (options?.embed?.game?.timestamp)
		gameEmbed.setTimestamp(options.embed?.game?.timestamp);
	if (options?.embed?.game?.url) gameEmbed.setURL(options.embed?.game?.url);

	const buttons = update();

	if (interaction) {
		message = await extInteraction.followUp({
			embeds: [gameEmbed],
			components: buttons
		});
	} else if (!interaction) {
		message = await extMessage.reply({
			embeds: [gameEmbed],
			components: buttons
		});
	}
	limiter[id].limit += 1;

	function checkWin(emoji: string) {
		return combinations.some((combination) => {
			return combination.every((index) => {
				return Game.board[index].emoji == emoji;
			});
		});
	}

	function isDraw() {
		return [...Game.board].every((cell) => {
			return cell.emoji == options.x_emoji || cell.emoji == options.o_emoji;
		});
	}

	function update() {
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

		const a = new ActionRowBuilder<ButtonBuilder>().addComponents([a1, a2, a3]);
		const b = new ActionRowBuilder<ButtonBuilder>().addComponents([b1, b2, b3]);
		const c = new ActionRowBuilder<ButtonBuilder>().addComponents([c1, c2, c3]);
		return [a, b, c];
	}

	const filter = (interaction: ButtonInteraction) => {
		if (interaction.user.id === msgOrint.member.user.id) return true;
		interaction.reply({
			content: `You cannot play this game!`,
			ephemeral: true
		});
		return;
	};
	const aiCollector = message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		idle: 30000,
		filter: filter
	});
	let aiTurn = false;
	aiCollector.on('collect', async (button: ButtonInteraction) => {
		if (isDraw() || checkWin(options.x_emoji) || checkWin(options.o_emoji))
			aiCollector.stop();
		if (!button.deferred) await button.deferUpdate();
		if (aiTurn) {
			await button.followUp({
				content: `It's <@!${opponent.id}>'s turn!`,
				ephemeral: true
			});
			return;
		} else if (Game.board[Number(button.customId)].emoji === options.x_emoji) {
			await button.followUp({
				content: `That position is pre-occupied by ${
					client.emojis.cache.get(options.x_emoji) || '❌'
				}!`,
				ephemeral: true
			});
			return;
		} else if (Game.board[Number(button.customId)].emoji === options.o_emoji) {
			await button.followUp({
				content: `That position is pre-occupied by ${
					client.emojis.cache.get(options.o_emoji) || '⭕'
				}!`,
				ephemeral: true
			});
			return;
		}
		aiTurn = true;
		board[Number(button.customId)] = 'x';

		const buttonInitial = update();
		await message.edit({
			components: buttonInitial
		});

		for (let i = 0; i < board.length; i++) {
			const elem = board[i];
			if (elem == 'x') {
				Game.board[i] = {
					style: options.x_style,
					emoji: options.x_emoji,
					disabled: true
				};
			}
		}

		const buttonUpdateX = update();

		if (!isDraw() && !checkWin(options.x_emoji) && !checkWin(options.o_emoji))
			message.edit({
				embeds: [
					gameEmbed
						.setDescription(
							`AI is Thinking.. | <@!${opponent.id}> | Your Emoji: ${
								client.emojis.cache.get(options.o_emoji) || '⭕'
							}`
						)
						.setColor(`DarkerGrey`)
				],
				components: buttonUpdateX
			});

		if (!isDraw() && !checkWin(options.x_emoji) && !checkWin(options.o_emoji)) {
			aiCollector.resetTimer();
			board = await aiEngine(board, options.hard || false);
		}

		for (let i = 0; i < board.length; i++) {
			const elem = board[i];
			if (elem == 'o') {
				Game.board[i] = {
					style: options.o_style,
					emoji: options.o_emoji,
					disabled: true
				};
			}
		}

		aiTurn = false;

		const buttonUpdateY = update();
		if (!isDraw() && !checkWin(options.x_emoji) && !checkWin(options.o_emoji)) {
			message.edit({
				embeds: [
					gameEmbed
						.setDescription(
							`Waiting for Input | <@!${
								msgOrint.member.user.id
							}> | Your Emoji: ${
								client.emojis.cache.get(options.x_emoji) || '❌'
							}`
						)
						.setColor(toRgb('#406DBC'))
				],
				components: buttonUpdateY
			});
		}

		if (checkWin(options.x_emoji)) {
			aiCollector.stop();
			limiter[id].limit -= 1;

			if (limiter[id].limit < 0) limiter[id].limit = 0;
			const winEmbed = new EmbedBuilder()
				.setTitle(
					options.embed?.win?.title ||
						`${msgOrint.member.user.username} VS ${opponent.username}`
				)

				.setColor(options.embed?.win?.color || `DarkGreen`)
				.setFooter(
					options.embed?.win?.footer
						? options.embed?.win?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				);

			if (options?.embed?.win?.fields)
				winEmbed.setFields(options.embed?.win?.fields);
			if (options?.embed?.win?.author)
				winEmbed.setAuthor(options.embed?.win?.author);
			if (options?.embed?.win?.image)
				winEmbed.setImage(options.embed?.win?.image);
			if (options?.embed?.win?.thumbnail)
				winEmbed.setThumbnail(options.embed?.win?.thumbnail);
			if (options?.embed?.win?.timestamp)
				winEmbed.setTimestamp(options.embed?.win?.timestamp);
			if (options?.embed?.win?.url) winEmbed.setURL(options.embed?.win?.url);

			const buttonsResult = update();

			if (!options.type || options.type === 'Button')
				return message
					.edit({
						components: disableButtons(buttonsResult),

						embeds: [
							winEmbed.setDescription(
								`<@!${msgOrint.member.user.id}> (${
									client.emojis.cache.get(options.x_emoji) || '❌'
								}) won, That was a nice game. GG`
							)
						]
					})
					.then((m: Message) => {
						m.react(options.x_emoji);
					});
			else if (options?.type === 'Embed')
				return message
					.edit({
						embeds: [
							winEmbed.setDescription(
								`<@!${msgOrint.member.user.id}> (${
									client.emojis.cache.get(options.o_emoji) || '❌'
								}) won, That was a nice game. GG\n` +
									`\`\`\`\n${Game.board[0].emoji} | ${Game.board[1].emoji} | ${Game.board[2].emoji}\n${Game.board[3].emoji} | ${Game.board[4].emoji} | ${Game.board[5].emoji}\n${Game.board[6].emoji} | ${Game.board[7].emoji} | ${Game.board[8].emoji}\n\`\`\``
										.replaceAll(options.blank_emoji, '➖')
										.replaceAll(options.o_emoji, '⭕')
										.replaceAll(options.x_emoji, '❌')
							)
						],
						components: []
					})
					.then((m: Message) => {
						m.react(options.x_emoji);
					});
		} else if (checkWin(options.o_emoji)) {
			aiCollector.stop();
			limiter[id].limit -= 1;

			if (limiter[id].limit < 0) limiter[id].limit = 0;
			const winEmbed = new EmbedBuilder()
				.setTitle(
					options.embed?.win?.title ||
						`${msgOrint.member.user.username} VS ${opponent.username}`
				)

				.setColor(options.embed?.win?.color || `DarkGreen`)
				.setFooter(
					options.embed?.win?.footer
						? options.embed?.win?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				);

			if (options?.embed?.win?.fields)
				winEmbed.setFields(options.embed?.win?.fields);
			if (options?.embed?.win?.author)
				winEmbed.setAuthor(options.embed?.win?.author);
			if (options?.embed?.win?.image)
				winEmbed.setImage(options.embed?.win?.image);
			if (options?.embed?.win?.thumbnail)
				winEmbed.setThumbnail(options.embed?.win?.thumbnail);
			if (options?.embed?.win?.timestamp)
				winEmbed.setTimestamp(options.embed?.win?.timestamp);
			if (options?.embed?.win?.url) winEmbed.setURL(options.embed?.win?.url);

			const buttonsResult = update();

			if (!options.type || options.type === 'Button')
				return message
					.edit({
						components: disableButtons(buttonsResult),

						embeds: [
							winEmbed.setDescription(
								`<@!${opponent.id}> (${
									client.emojis.cache.get(options.o_emoji) || '⭕'
								}) won, That was a nice game. GG`
							)
						]
					})
					.then((m: Message) => {
						m.react(options.o_emoji);
					});
			else if (options?.type === 'Embed')
				return message
					.edit({
						embeds: [
							winEmbed.setDescription(
								`<@!${opponent.id}> (${
									client.emojis.cache.get(options.o_emoji) || '⭕'
								}) won, That was a nice game. GG\n` +
									`\`\`\`\n${Game.board[0].emoji} | ${Game.board[1].emoji} | ${Game.board[2].emoji}\n${Game.board[3].emoji} | ${Game.board[4].emoji} | ${Game.board[5].emoji}\n${Game.board[6].emoji} | ${Game.board[7].emoji} | ${Game.board[8].emoji}\n\`\`\``
										.replaceAll(options.blank_emoji, '➖')
										.replaceAll(options.o_emoji, '⭕')
										.replaceAll(options.x_emoji, '❌')
							)
						],
						components: []
					})
					.then((m: Message) => {
						m.react(options.o_emoji);
					});
		} else if (isDraw()) {
			aiCollector.stop();
			limiter[id].limit -= 1;

			if (limiter[id].limit < 0) limiter[id].limit = 0;
			const drawEmbed = new EmbedBuilder()
				.setTitle(
					options.embed?.draw?.title ||
						`${msgOrint.member.user.username} VS ${opponent.username}`
				)
				.setDescription(
					options.embed?.draw?.description || 'Thats a draw. Try again'
				)

				.setColor(options.embed?.draw?.color || 'Grey')
				.setFooter(
					options.embed?.draw?.footer
						? options.embed?.draw?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				);

			if (options?.embed?.draw?.fields)
				drawEmbed.setFields(options.embed?.draw?.fields);
			if (options?.embed?.draw?.author)
				drawEmbed.setAuthor(options.embed?.draw?.author);
			if (options?.embed?.draw?.image)
				drawEmbed.setImage(options.embed?.draw?.image);
			if (options?.embed?.draw?.thumbnail)
				drawEmbed.setThumbnail(options.embed?.draw?.thumbnail);
			if (options?.embed?.draw?.timestamp)
				drawEmbed.setTimestamp(options.embed?.draw?.timestamp);
			if (options?.embed?.draw?.url) drawEmbed.setURL(options.embed?.draw?.url);

			const buttonsResult = update();

			if (!options.type || options.type === 'Button')
				return message
					.edit({
						content: 'Its a Tie!',
						embeds: [
							drawEmbed.setDescription(
								`You have tied. Play again to see who wins.`
							)
						],
						components: buttonsResult
					})
					.then((m: Message) => {
						m.react(options.blank_emoji);
					});
			else
				return message
					.edit({
						content: 'Its a Tie!',
						embeds: [
							drawEmbed.setDescription(
								`You have tied. Play again to see who wins.\n` +
									`\`\`\`\n${Game.board[0].emoji} | ${Game.board[1].emoji} | ${Game.board[2].emoji}\n${Game.board[3].emoji} | ${Game.board[4].emoji} | ${Game.board[5].emoji}\n${Game.board[6].emoji} | ${Game.board[7].emoji} | ${Game.board[8].emoji}\n\`\`\``
										.replaceAll(options.blank_emoji, '➖')
										.replaceAll(options.o_emoji, '⭕')
										.replaceAll(options.x_emoji, '❌')
							)
						],
						components: []
					})
					.then((m: Message) => {
						m.react(options.blank_emoji);
					})
					.catch(() => {});
		}
	});
	aiCollector.on('end', async (_collected, reason) => {
		limiter[id].limit -= 1;
		if (limiter[id].limit < 0) limiter[id].limit = 0;

		if (reason === 'idle') {
			const buttonsResult = update();
			const timeoutEmbed = new EmbedBuilder()
				.setTitle(options.embed?.timeout?.title || 'Game Timed Out!')
				.setColor(options.embed?.timeout?.color || 'Red')
				.setDescription(
					options.embed?.timeout?.description ||
						"The opponent didn't respond in time (30s)"
				)
				.setFooter(
					options.embed?.timeout?.footer
						? options.embed?.timeout?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				);
			if (options?.embed?.timeout?.fields)
				timeoutEmbed.setFields(options.embed?.timeout?.fields);
			if (options?.embed?.timeout?.author)
				timeoutEmbed.setAuthor(options.embed?.timeout?.author);
			if (options?.embed?.timeout?.image)
				timeoutEmbed.setImage(options.embed?.timeout?.image);
			if (options?.embed?.timeout?.thumbnail)
				timeoutEmbed.setThumbnail(options.embed?.timeout?.thumbnail);
			if (options?.embed?.timeout?.timestamp)
				timeoutEmbed.setTimestamp(options.embed?.timeout?.timestamp);
			if (options?.embed?.timeout?.url)
				timeoutEmbed.setURL(options.embed?.timeout?.url);
			if (aiTurn != true)
				if (!options.type || options.type === 'Button')
					message.edit({
						content: `<@${msgOrint.member.user.id}> did not respond in time!`,
						embeds: [timeoutEmbed],
						components: disableButtons(buttonsResult)
					});
				else
					message.edit({
						content: `<@${msgOrint.member.user.id}> did not respond in time!`,
						embeds: [
							timeoutEmbed.setDescription(
								`The opponent didnt respond in time (30s)\n` +
									`\`\`\`\n${Game.board[0].emoji} | ${Game.board[1].emoji} | ${Game.board[2].emoji}\n${Game.board[3].emoji} | ${Game.board[4].emoji} | ${Game.board[5].emoji}\n${Game.board[6].emoji} | ${Game.board[7].emoji} | ${Game.board[8].emoji}\n\`\`\``
										.replaceAll(options.blank_emoji, '➖')
										.replaceAll(options.o_emoji, '⭕')
										.replaceAll(options.x_emoji, '❌')
							)
						],
						components: []
					});
			else if (!options.type || options.type === 'Button')
				message.edit({
					content: `<@${opponent.id}> did not respond in time!`,
					embeds: [timeoutEmbed],
					components: disableButtons(buttonsResult)
				});
			else
				message.edit({
					content: `<@${opponent.id}> did not respond in time!`,
					embeds: [
						timeoutEmbed.setDescription(
							`The opponent didnt respond in time (30s)\n` +
								`\`\`\`\n${Game.board[0].emoji} | ${Game.board[1].emoji} | ${Game.board[2].emoji}\n${Game.board[3].emoji} | ${Game.board[4].emoji} | ${Game.board[5].emoji}\n${Game.board[6].emoji} | ${Game.board[7].emoji} | ${Game.board[8].emoji}\n\`\`\``
									.replaceAll(options.blank_emoji, '➖')
									.replaceAll(options.o_emoji, '⭕')
									.replaceAll(options.x_emoji, '❌')
						)
					],
					components: []
				});
		}
	});
}

// The AI Engine code is from this article https://medium.com/@alialaa/tic-tac-toe-with-javascript-es2015-ai-player-with-minimax-algorithm-59f069f46efa
// Modified for discord.js usage
async function aiEngine(
	boardArray: string[],
	hard: boolean = false
): Promise<string[]> {
	const board = new Board(boardArray);

	const plr = new Player();

	const best = plr.getBestMove(board, false);
	const available = board.getAvailableMoves();

	let moved = [];

	boardArray.forEach((a) => {
		moved.push(a);
	});

	if (hard) moved[Number(best)] = 'o';
	else
		moved[
			Number(
				available[Math.floor(Math.random() * Math.floor(available.length))]
			)
		] = 'o';

	return moved;
}

// ------------------------------
// ------- A I - C O R E --------
// ------------------------------

type Terminal = {
	winner?: string;
	direction?: string;
};

class Board {
	state: string[];
	constructor(state = ['', '', '', '', '', '', '', '', '']) {
		this.state = state;
	}

	isEmpty() {
		return this.state.every((cell) => !cell);
	}
	isFull() {
		return this.state.every((cell) => cell);
	}
	insert(symbol: 'x' | 'o', position: number) {
		if (![0, 1, 2, 3, 4, 5, 6, 7, 8].includes(position)) {
			throw new Error('Cell index does not exist!');
		}
		if (!['x', 'o'].includes(symbol)) {
			throw new Error('The symbol can only be x or o!');
		}
		if (this.state[position]) {
			return false;
		}
		this.state[position] = symbol;
		return true;
	}
	isTerminal(): boolean | Terminal {
		//Return False if board in empty
		if (this.isEmpty()) return false;
		//Checking Horizontal Wins
		if (
			this.state[0] === this.state[1] &&
			this.state[0] === this.state[2] &&
			this.state[0]
		) {
			return { winner: this.state[0], direction: 'H' };
		}
		if (
			this.state[3] === this.state[4] &&
			this.state[3] === this.state[5] &&
			this.state[3]
		) {
			return { winner: this.state[3], direction: 'H' };
		}
		if (
			this.state[6] === this.state[7] &&
			this.state[6] === this.state[8] &&
			this.state[6]
		) {
			return { winner: this.state[6], direction: 'H' };
		}

		//Checking Vertical Wins
		if (
			this.state[0] === this.state[3] &&
			this.state[0] === this.state[6] &&
			this.state[0]
		) {
			return { winner: this.state[0], direction: 'V' };
		}
		if (
			this.state[1] === this.state[4] &&
			this.state[1] === this.state[7] &&
			this.state[1]
		) {
			return { winner: this.state[1], direction: 'V' };
		}
		if (
			this.state[2] === this.state[5] &&
			this.state[2] === this.state[8] &&
			this.state[2]
		) {
			return { winner: this.state[2], direction: 'V' };
		}

		//Checking Diagonal Wins
		if (
			this.state[0] === this.state[4] &&
			this.state[0] === this.state[8] &&
			this.state[0]
		) {
			return { winner: this.state[0], direction: 'D' };
		}
		if (
			this.state[2] === this.state[4] &&
			this.state[2] === this.state[6] &&
			this.state[2]
		) {
			return { winner: this.state[2], direction: 'D' };
		}

		//If no winner but the board is full, then it's a draw
		if (this.isFull()) {
			return { winner: 'draw' };
		}

		//return false otherwise
		return false;
	}

	getAvailableMoves() {
		const moves: number[] = [];
		this.state.forEach((cell, index) => {
			if (!cell) moves.push(index);
		});
		return moves;
	}
}

class Player {
	nodesMap: Map<any, any>;
	maxDepth: number;
	constructor(maxDepth = -1) {
		this.maxDepth = maxDepth;
		this.nodesMap = new Map();
	}
	getBestMove(board: Board, maximizing = true, depth = 0) {
		if (depth == 0) this.nodesMap.clear();

		if (board.isTerminal() || depth === this.maxDepth) {
			if ((board.isTerminal() as Terminal).winner === 'x') {
				return 100 - depth;
			} else if ((board.isTerminal() as Terminal).winner === 'o') {
				return -100 + depth;
			}
			return 0;
		}
		if (maximizing) {
			//Initialize best to the lowest possible value
			let best = -100;
			//Loop through all empty cells
			board.getAvailableMoves().forEach((index) => {
				//Initialize a new board with a copy of our current state
				const child = new Board([...board.state]);
				//Create a child node by inserting the maximizing symbol x into the current empty cell
				child.insert('x', index);
				//Recursively calling getBestMove this time with the new board and minimizing turn and incrementing the depth
				const nodeValue = this.getBestMove(child, false, depth + 1);
				//Updating best value
				best = Math.max(best, nodeValue);

				//If it's the main function call, not a recursive one, map each heuristic value with it's moves indices
				if (depth == 0) {
					//Comma separated indices if multiple moves have the same heuristic value
					const moves = this.nodesMap.has(nodeValue)
						? `${this.nodesMap.get(nodeValue)},${index}`
						: index;
					this.nodesMap.set(nodeValue, moves);
				}
			});
			//If it's the main call, return the index of the best move or a random index if multiple indices have the same value
			if (depth == 0) {
				let returnValue;
				if (typeof this.nodesMap.get(best) == 'string') {
					const arr = this.nodesMap.get(best).split(',');
					const rand = Math.floor(Math.random() * arr.length);
					returnValue = arr[rand];
				} else {
					returnValue = this.nodesMap.get(best);
				}
				return returnValue;
			}
			//If not main call (recursive) return the heuristic value for next calculation
			return best;
		}

		if (!maximizing) {
			//Initialize best to the highest possible value
			let best = 100;
			//Loop through all empty cells
			board.getAvailableMoves().forEach((index) => {
				//Initialize a new board with a copy of our current state
				const child = new Board([...board.state]);

				//Create a child node by inserting the minimizing symbol o into the current empty cell
				child.insert('o', index);

				//Recursively calling getBestMove this time with the new board and maximizing turn and incrementing the depth
				let nodeValue = this.getBestMove(child, true, depth + 1);
				//Updating best value
				best = Math.min(best, nodeValue);

				//If it's the main function call, not a recursive one, map each heuristic value with it's moves indices
				if (depth == 0) {
					//Comma separated indices if multiple moves have the same heuristic value
					const moves = this.nodesMap.has(nodeValue)
						? this.nodesMap.get(nodeValue) + ',' + index
						: index;
					this.nodesMap.set(nodeValue, moves);
				}
			});
			//If it's the main call, return the index of the best move or a random index if multiple indices have the same value
			if (depth == 0) {
				let returnValue;
				if (typeof this.nodesMap.get(best) == 'string') {
					const arr = this.nodesMap.get(best).split(',');
					const rand = Math.floor(Math.random() * arr.length);
					returnValue = arr[rand];
				} else {
					returnValue = this.nodesMap.get(best);
				}

				return returnValue;
			}
			//If not main call (recursive) return the heuristic value for next calculation
			return best;
		}
	}
}
