import {
	EmbedBuilder,
	Message,
	ActionRowBuilder,
	ButtonBuilder,
	User,
	ButtonStyle,
	ButtonInteraction,
	ComponentType
} from 'discord.js';
import {
	ExtendedInteraction,
	ExtendedMessage,
	CustomizableButton,
	CustomizableEmbed
} from './typedef';
import { toButtonStyle, toRgb, ms } from './misc';
import { SimplyError } from './error/SimplyError';

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/fun/rps#rpsbuttons
 */

export interface RpsButtons {
	rock?: CustomizableButton;
	paper?: CustomizableButton;
	scissor?: CustomizableButton;
}

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/fun/rps#rpsembeds
 */

export interface RpsEmbeds {
	request?: CustomizableEmbed;
	win?: CustomizableEmbed;
	draw?: CustomizableEmbed;
	game?: CustomizableEmbed;
	timeout?: CustomizableEmbed;
	decline?: CustomizableEmbed;
}

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/fun/rps#rpsoptions
 */

export type rpsOptions = {
	embed?: RpsEmbeds;
	buttons?: RpsButtons;
	opponent?: User;

	strict?: boolean;
};
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

const combinations = {
	rock: 'scissors',
	scissors: 'paper',
	paper: 'rock'
};

/**
 * A classic RPS game, except this time it's on Discord to play with your pals, how cool is that ?
 *
 * @param msgOrint
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/Fun/rps
 * @example simplydjs.rps(interaction)
 */

export async function rps(
	msgOrint: ExtendedMessage | ExtendedInteraction,
	options: rpsOptions = { strict: false }
): Promise<User> {
	return new Promise(async (resolve) => {
		const accept = new ButtonBuilder()
			.setLabel('Accept')
			.setStyle(ButtonStyle.Success)
			.setCustomId('accept');

		const decline = new ButtonBuilder()
			.setLabel('Deny')
			.setStyle(ButtonStyle.Danger)
			.setCustomId('decline');

		const requestComponents =
			new ActionRowBuilder<ButtonBuilder>().addComponents([accept, decline]);

		const buttonStyles = {
			rock: {
				style: options?.buttons?.rock?.style || ButtonStyle.Primary,
				label: options?.buttons?.rock?.label || 'Rock',
				emoji: options?.buttons?.rock?.emoji || '🪨'
			},
			paper: {
				style: options?.buttons?.paper?.style || ButtonStyle.Success,
				label: options?.buttons?.paper?.label || 'Paper',
				emoji: options?.buttons?.paper?.emoji || '📄'
			},
			scissor: {
				style: options?.buttons?.paper?.style || ButtonStyle.Danger,
				label: options?.buttons?.paper?.label || 'Scissor',
				emoji: options?.buttons?.paper?.emoji || '✂️'
			}
		};

		if (buttonStyles?.rock?.style as string)
			buttonStyles.rock.style = toButtonStyle(
				buttonStyles?.rock?.style as string
			);

		if (buttonStyles?.paper?.style as string)
			buttonStyles.paper.style = toButtonStyle(
				buttonStyles?.paper?.style as string
			);
		if (buttonStyles?.scissor?.style as string)
			buttonStyles.scissor.style = toButtonStyle(
				buttonStyles?.scissor?.style as string
			);

		const rock = new ButtonBuilder()
			.setLabel(buttonStyles?.rock?.label)
			.setCustomId('rock')
			.setStyle(
				(buttonStyles?.rock?.style as ButtonStyle) || ButtonStyle.Primary
			)
			.setEmoji(buttonStyles?.rock?.emoji);

		const paper = new ButtonBuilder()
			.setLabel(buttonStyles?.paper?.label)
			.setCustomId('paper')
			.setStyle(
				(buttonStyles?.paper?.style as ButtonStyle) || ButtonStyle.Success
			)
			.setEmoji(buttonStyles?.paper?.emoji);

		const scissors = new ButtonBuilder()
			.setLabel(buttonStyles?.scissor?.label)
			.setCustomId('scissors')
			.setStyle(
				(buttonStyles?.scissor?.style as ButtonStyle) || ButtonStyle.Danger
			)
			.setEmoji(buttonStyles?.scissor?.emoji);

		const rpsComponents = new ActionRowBuilder<ButtonBuilder>().addComponents([
			rock,
			paper,
			scissors
		]);

		//Embeds
		const timeoutEmbed = new EmbedBuilder()
			.setTitle(options?.embed?.timeout?.title || 'Game Timed Out!')
			.setColor(options?.embed?.timeout?.color || 'Red')
			.setDescription(
				options?.embed?.timeout?.description ||
					'The opponent didnt respond in time (30s)'
			)
			.setFooter(
				options?.embed?.timeout?.footer
					? options?.embed?.timeout?.footer
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

		try {
			let opponent: User;

			let interaction: ExtendedInteraction;

			if (msgOrint.commandId) {
				interaction = msgOrint as ExtendedInteraction;
				if (interaction.deferred)
					await interaction.deferReply({ fetchReply: true });
				opponent = options.opponent || interaction.options.getUser('user');
			} else {
				opponent = (msgOrint as Message).mentions.members.first()?.user;
			}

			const extInteraction = msgOrint as ExtendedInteraction;
			const extMessage = msgOrint as Message;

			if (!interaction) {
				if (!opponent) return extMessage.reply('No opponent mentioned!');
				if (opponent.bot)
					return extMessage.reply('You cannot play against bots');
				if (opponent.id === msgOrint.member.user.id)
					return extMessage.reply('You cannot play with yourself!');
			} else if (interaction) {
				if (!opponent)
					return await extInteraction.followUp({
						content: 'No opponent mentioned!',
						ephemeral: true
					});
				if (opponent.bot)
					return await extInteraction.followUp({
						content: "You can't play against bots",
						ephemeral: true
					});
				if (opponent.id === msgOrint.member.user.id)
					return await extInteraction.followUp({
						content: 'You cannot play with yourself!',
						ephemeral: true
					});
			}

			const requestEmbed = new EmbedBuilder()
				.setTitle(
					options.embed?.request?.title || `Request for ${opponent.tag} !`
				)
				.setAuthor(
					options.embed?.request?.author || {
						name: (msgOrint.member.user as User).tag,
						iconURL: (msgOrint.member.user as User).displayAvatarURL({
							forceStatic: false
						})
					}
				)
				.setDescription(
					options.embed?.request?.description ||
						'You are invited to play Rock Paper Scissors'
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
			if (options?.embed?.request?.url)
				requestEmbed.setURL(options.embed?.request?.url);

			let m: Message;

			if (interaction) {
				m = await extInteraction.followUp({
					content: `<@${opponent.id}>. You got a Rock Paper Scissor invitation !`,
					embeds: [requestEmbed],
					components: [requestComponents]
				});
			} else if (!interaction) {
				m = await extMessage.reply({
					content: `<@${opponent.id}>. You got a Rock Paper Scissor invitation !`,
					embeds: [requestEmbed],
					components: [requestComponents]
				});
			}

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

				await button.deferUpdate();

				if (button.customId == 'decline') {
					collector.stop('decline');
					return;
				}

				const gameEmbed = new EmbedBuilder()
					.setTitle(
						options.embed?.game?.title ||
							`${(msgOrint.member.user as User).tag} VS. ${opponent.tag}`
					)
					.setAuthor(
						options.embed?.game?.author || {
							name: (msgOrint.member.user as User).tag,
							iconURL: (msgOrint.member.user as User).displayAvatarURL({
								forceStatic: false
							})
						}
					)
					.setDescription(
						options.embed?.game?.description || 'Select 🪨, 📄, or ✂️'
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

				if (interaction) {
					await extInteraction.editReply({
						content: '**Its time.. for RPS.**',
						embeds: [gameEmbed],
						components: [rpsComponents]
					});
				} else if (!interaction) {
					await (m as Message).edit({
						content: '**Its time.. for RPS.**',
						embeds: [gameEmbed],
						components: [rpsComponents]
					});
				}

				collector.stop();
				const ids: Set<string> = new Set();
				ids.add(msgOrint.member.user.id);
				ids.add(opponent.id);

				let p1: string, p2: string;

				const btnCollector = m.createMessageComponentCollector({
					componentType: ComponentType.Button,
					time: ms('30s')
				});

				btnCollector.on('collect', async (b: ButtonInteraction) => {
					await b.deferUpdate();
					if (!ids.has(b.user.id)) {
						await b.followUp({
							content: 'You cannot play the game.',
							ephemeral: true
						});
						return;
					}

					ids.delete(b.user.id);

					if (b.user.id === opponent.id) p1 = b.customId;
					if (b.user.id === msgOrint.member.user.id) p2 = b.customId;

					setTimeout(() => {
						if (ids.size == 0) btnCollector.stop();
					}, 500);
				});

				btnCollector.on('end', async (_collected, reason) => {
					if (reason === 'time') {
						if (interaction) {
							await interaction.editReply({
								content: '** **',
								embeds: [timeoutEmbed],
								components: []
							});
						} else if (!interaction) {
							await m.edit({
								content: '** **',
								embeds: [timeoutEmbed],
								components: []
							});
						}
					} else {
						if (p1 === p2) {
							p1 = p1
								.replace(
									'scissors',
									`${buttonStyles?.scissor?.emoji} ${buttonStyles?.scissor?.label}`
								)
								.replace(
									'paper',
									`${buttonStyles?.paper?.emoji} ${buttonStyles?.paper?.label}`
								)
								.replace(
									'rock',
									`${buttonStyles?.rock?.emoji} ${buttonStyles?.rock?.label}`
								);

							const drawEmbed = new EmbedBuilder()
								.setTitle(options.embed?.draw?.title || 'Draw!')
								.setColor(options.embed?.draw?.color || toRgb('#406DBC'))
								.setDescription(
									options.embed?.draw?.description ||
										`Both players chose **${p1}**`
								)
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

							if (interaction) {
								await interaction.editReply({
									content: '** **',
									embeds: [drawEmbed],
									components: []
								});
							}
							if (!interaction) {
								await (m as Message).edit({
									content: '** **',
									embeds: [drawEmbed],
									components: []
								});
							}
						} else if (combinations[p1 as keyof typeof combinations] === p2) {
							p1 = p1
								.replace(
									'scissors',
									`${buttonStyles?.scissor?.emoji} ${buttonStyles?.scissor?.label}`
								)
								.replace(
									'paper',
									`${buttonStyles?.paper?.emoji} ${buttonStyles?.paper?.label}`
								)
								.replace(
									'rock',
									`${buttonStyles?.rock?.emoji} ${buttonStyles?.rock?.label}`
								);

							p2 = p2
								.replace(
									'scissors',
									`${buttonStyles?.scissor?.emoji} ${buttonStyles?.scissor?.label}`
								)
								.replace(
									'paper',
									`${buttonStyles?.paper?.emoji} ${buttonStyles?.paper?.label}`
								)
								.replace(
									'rock',
									`${buttonStyles?.rock?.emoji} ${buttonStyles?.rock?.label}`
								);

							const winEmbed = new EmbedBuilder()
								.setTitle(options.embed?.win?.title || `${opponent.tag} Won !`)
								.setColor(options.embed?.win?.color || 'Green')
								.setDescription(
									options.embed?.win?.description ||
										`**${p1}** defeats **${p2}**`
								)
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

							//p1 - won
							if (interaction) {
								await interaction.editReply({
									content: '** **',
									embeds: [winEmbed],
									components: []
								});
								resolve(opponent);
							} else if (!interaction) {
								await m.edit({
									content: '** **',
									embeds: [winEmbed],
									components: []
								});
								resolve(opponent);
							}
						} else {
							p1 = p1
								.replace(
									'scissors',
									`${buttonStyles?.scissor?.emoji} ${buttonStyles?.scissor?.label}`
								)
								.replace(
									'paper',
									`${buttonStyles?.paper?.emoji} ${buttonStyles?.paper?.label}`
								)
								.replace(
									'rock',
									`${buttonStyles?.rock?.emoji} ${buttonStyles?.rock?.label}`
								);

							p2 = p2
								.replace(
									'scissors',
									`${buttonStyles?.scissor?.emoji} ${buttonStyles?.scissor?.label}`
								)
								.replace(
									'paper',
									`${buttonStyles?.paper?.emoji} ${buttonStyles?.paper?.label}`
								)
								.replace(
									'rock',
									`${buttonStyles?.rock?.emoji} ${buttonStyles?.rock?.label}`
								);

							const winEmbed = new EmbedBuilder()
								.setTitle(
									options.embed?.win?.title ||
										`${(msgOrint.member.user as User).tag} Won !`
								)
								.setColor(options.embed?.win?.color || 'Green')
								.setDescription(
									options.embed?.win?.description ||
										`**${p2}** defeats **${p1}**`
								)
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

							//p2 - won
							if (interaction) {
								await interaction.editReply({
									content: '** **',
									embeds: [winEmbed],
									components: []
								});
								resolve(msgOrint.member.user);
							} else if (!interaction) {
								await (m as Message).edit({
									content: '** **',
									embeds: [winEmbed],
									components: []
								});
							}

							resolve(msgOrint.member.user);
						}
					}
				});
			});

			collector.on('end', async (_collected, reason) => {
				if (reason === 'time') {
					await m.edit({
						content: '** **',
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

					await m.edit({
						content: '** **',
						embeds: [declineEmbed],
						components: []
					});
				}
			});
		} catch (err: any) {
			if (options?.strict)
				throw new SimplyError({
					function: 'rps',
					title: 'An Error occured when running the function ',
					tip: err.stack
				});
			else console.log(`SimplyError - rps | Error: ${err.stack}`);
		}
	});
}
