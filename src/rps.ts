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
import { ExtendedInteraction, ExtendedMessage } from './interfaces';
import { buttonTemplate } from './interfaces/buttonTemplate';
import { CustomizableEmbed } from './interfaces/CustomizableEmbed';
import { MessageButtonStyle } from './Others/MessageButtonStyle';
import { toRgb } from './Others/toRgb';
import { SimplyError } from './Error/Error';

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/Fun/rps#rpsbuttons*
 */

interface rpsButtons {
	rock?: buttonTemplate;
	paper?: buttonTemplate;
	scissor?: buttonTemplate;
}

interface Embeds {
	request?: CustomizableEmbed;
	win?: CustomizableEmbed;
	draw?: CustomizableEmbed;
	timeout?: CustomizableEmbed;
	decline?: CustomizableEmbed;
}

export type rpsOptions = {
	embed?: Embeds;
	buttons?: rpsButtons;
	opponent?: User;

	strict?: boolean;
};
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A classic RPS game, except this time it's on Discord to play with your pals, how cool is that ?
 *
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Fun/rps***
 * @example simplydjs.rps(message)
 */

export async function rps(
	message: ExtendedMessage | ExtendedInteraction,
	options: rpsOptions = {}
) {
	return new Promise(async (resolve) => {
		const accept = new ButtonBuilder()
			.setLabel('Accept')
			.setStyle(ButtonStyle.Primary)
			.setCustomId('accept');

		const decline = new ButtonBuilder()
			.setLabel('Deny')
			.setStyle(ButtonStyle.Danger)
			.setCustomId('decline');

		const requestComponents =
			new ActionRowBuilder<ButtonBuilder>().addComponents([accept, decline]);

		options.buttons = {
			rock: {
				style: options.buttons?.rock?.style || ButtonStyle.Primary,
				label: options.buttons?.rock?.label || 'Rock',
				emoji: options.buttons?.rock?.emoji || '🪨'
			},
			paper: {
				style: options.buttons?.paper?.style || ButtonStyle.Success,
				label: options.buttons?.paper?.label || 'Paper',
				emoji: options.buttons?.paper?.emoji || '📄'
			},
			scissor: {
				style: options.buttons?.paper?.style || ButtonStyle.Danger,
				label: options.buttons?.paper?.label || 'Scissor',
				emoji: options.buttons?.paper?.emoji || '✂️'
			}
		};

		if (options.buttons.rock.style as string)
			options.buttons.rock.style = MessageButtonStyle(
				options.buttons.rock.style as string
			);

		if (options.buttons.paper.style as string)
			options.buttons.paper.style = MessageButtonStyle(
				options.buttons.paper.style as string
			);
		if (options.buttons.scissor.style as string)
			options.buttons.scissor.style = MessageButtonStyle(
				options.buttons.scissor.style as string
			);

		const rock = new ButtonBuilder()
			.setLabel(options.buttons?.rock?.label)
			.setCustomId('rock')
			.setStyle(
				(options.buttons?.rock?.style as ButtonStyle) || ButtonStyle.Primary
			)
			.setEmoji(options.buttons?.rock?.emoji);

		const paper = new ButtonBuilder()
			.setLabel(options.buttons?.paper?.label)
			.setCustomId('paper')
			.setStyle(
				(options.buttons?.paper?.style as ButtonStyle) || ButtonStyle.Success
			)
			.setEmoji(options.buttons?.paper?.emoji);

		const scissors = new ButtonBuilder()
			.setLabel(options.buttons?.scissor?.label)
			.setCustomId('scissors')
			.setStyle(
				(options.buttons?.scissor?.style as ButtonStyle) || ButtonStyle.Danger
			)
			.setEmoji(options.buttons?.scissor?.emoji);

		const rpsComponents = new ActionRowBuilder<ButtonBuilder>().addComponents([
			rock,
			paper,
			scissors
		]);

		//Embeds
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

		try {
			let opponent: User;

			let interaction: ExtendedInteraction;

			if (message.commandId) {
				interaction = message as ExtendedInteraction;
				opponent = options.opponent || interaction.options.get('user').user;
			} else {
				opponent = (message as Message).mentions.members.first()?.user;
			}

			const extInteraction = message as ExtendedInteraction;
			const extMessage = message as Message;

			if (!interaction) {
				if (!opponent) return extMessage.reply('No opponent mentioned!');
				if (opponent.bot)
					return extMessage.reply('You cannot play against bots');
				if (opponent.id === message.member.user.id)
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
				if (opponent.id === message.member.user.id)
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
						name: (message.member.user as User).tag,
						iconURL: (message.member.user as User).displayAvatarURL({
							forceStatic: false
						})
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

			if (options.embed.request?.fields)
				requestEmbed.setFields(options.embed?.request?.fields);
			if (options.embed.request?.author)
				requestEmbed.setAuthor(options.embed?.request?.author);
			if (options.embed.request?.image)
				requestEmbed.setImage(options.embed?.request?.image);
			if (options.embed.request?.thumbnail)
				requestEmbed.setThumbnail(options.embed?.request?.thumbnail);
			if (options.embed.request?.timestamp)
				requestEmbed.setTimestamp(options.embed?.request?.timestamp);
			if (options.embed?.request?.url)
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

			const filter = (b: ButtonInteraction) => b.user.id === opponent.id;
			const collector = m.createMessageComponentCollector({
				filter: filter,
				componentType: ComponentType.Button,
				time: 30000,
				maxUsers: 1
			});

			collector.on('collect', async (button: ButtonInteraction) => {
				if (button.user.id !== opponent.id) {
					await button.reply({
						content: 'You cannot play the game.',
						ephemeral: true
					});
					return;
				}

				await button.deferUpdate();

				if (button.customId == 'decline') {
					collector.stop('decline');
					return;
				}

				requestEmbed
					.setTitle(`${(message.member.user as User).tag} VS. ${opponent.tag}`)
					.setDescription('Select 🪨, 📄, or ✂️');

				if (interaction) {
					await extInteraction.editReply({
						content: '**Its time.. for RPS.**',
						embeds: [requestEmbed],
						components: [rpsComponents]
					});
				} else if (!interaction) {
					await (m as Message).edit({
						content: '**Its time.. for RPS.**',
						embeds: [requestEmbed],
						components: [rpsComponents]
					});
				}

				collector.stop();
				const ids: Set<string> = new Set();
				ids.add(message.member.user.id);
				ids.add(opponent.id);

				let p1: string, p2: string;

				const btnCollector = m.createMessageComponentCollector({
					componentType: ComponentType.Button,
					time: 30000
				});

				btnCollector.on('collect', async (b: ButtonInteraction) => {
					if (!ids.has(b.user.id)) {
						await button.reply({
							content: 'You cannot play the game.',
							ephemeral: true
						});
						return;
					}

					await b.deferUpdate();

					ids.delete(b.user.id);

					if (b.user.id === opponent.id) p1 = b.customId;
					if (b.user.id === message.member.user.id) p2 = b.customId;

					setTimeout(() => {
						if (ids.size == 0) btnCollector.stop();
					}, 500);
				});

				btnCollector.on('end', async (coll, reason) => {
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
						const winnerMap = {
							rock: 'scissors',
							scissors: 'paper',
							paper: 'rock'
						};
						if (p1 === p2) {
							p1 = p1
								.replace(
									'scissors',
									`${options.buttons?.scissor?.emoji} ${options.buttons?.scissor?.label}`
								)
								.replace(
									'paper',
									`${options.buttons?.paper?.emoji} ${options.buttons?.paper?.label}`
								)
								.replace(
									'rock',
									`${options.buttons?.rock?.emoji} ${options.buttons?.rock?.label}`
								);

							const drawEmbed = new EmbedBuilder()
								.setTitle(options.embed?.draw?.title || 'Draw!')
								.setColor(options.embed?.draw?.color || toRgb(`#406DBC`))
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

							if (options.embed?.draw?.fields)
								drawEmbed.setFields(options.embed?.draw?.fields);
							if (options.embed?.draw?.author)
								drawEmbed.setAuthor(options.embed?.draw?.author);
							if (options.embed?.draw?.image)
								drawEmbed.setImage(options.embed?.draw?.image);
							if (options.embed?.draw?.thumbnail)
								drawEmbed.setThumbnail(options.embed?.draw?.thumbnail);
							if (options.embed?.draw?.timestamp)
								drawEmbed.setTimestamp(options.embed?.draw?.timestamp);
							if (options.embed?.draw?.url)
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
						} else if (winnerMap[p1 as keyof typeof winnerMap] === p2) {
							p1 = p1
								.replace(
									'scissors',
									`${options.buttons?.scissor?.emoji} ${options.buttons?.scissor?.label}`
								)
								.replace(
									'paper',
									`${options.buttons?.paper?.emoji} ${options.buttons?.paper?.label}`
								)
								.replace(
									'rock',
									`${options.buttons?.rock?.emoji} ${options.buttons?.rock?.label}`
								);

							p2 = p2
								.replace(
									'scissors',
									`${options.buttons?.scissor?.emoji} ${options.buttons?.scissor?.label}`
								)
								.replace(
									'paper',
									`${options.buttons?.paper?.emoji} ${options.buttons?.paper?.label}`
								)
								.replace(
									'rock',
									`${options.buttons?.rock?.emoji} ${options.buttons?.rock?.label}`
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

							if (options.embed?.win?.fields)
								winEmbed.setFields(options.embed?.win?.fields);
							if (options.embed?.win?.author)
								winEmbed.setAuthor(options.embed?.win?.author);
							if (options.embed?.win?.image)
								winEmbed.setImage(options.embed?.win?.image);
							if (options.embed?.win?.thumbnail)
								winEmbed.setThumbnail(options.embed?.win?.thumbnail);
							if (options.embed?.win?.timestamp)
								winEmbed.setTimestamp(options.embed?.win?.timestamp);
							if (options.embed?.win?.url)
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
									`${options.buttons?.scissor?.emoji} ${options.buttons?.scissor?.label}`
								)
								.replace(
									'paper',
									`${options.buttons?.paper?.emoji} ${options.buttons?.paper?.label}`
								)
								.replace(
									'rock',
									`${options.buttons?.rock?.emoji} ${options.buttons?.rock?.label}`
								);

							p2 = p2
								.replace(
									'scissors',
									`${options.buttons?.scissor?.emoji} ${options.buttons?.scissor?.label}`
								)
								.replace(
									'paper',
									`${options.buttons?.paper?.emoji} ${options.buttons?.paper?.label}`
								)
								.replace(
									'rock',
									`${options.buttons?.rock?.emoji} ${options.buttons?.rock?.label}`
								);

							const winEmbed = new EmbedBuilder()
								.setTitle(
									options.embed?.win?.title ||
										`${(message.member.user as User).tag} Won !`
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

							if (options.embed?.win?.fields)
								winEmbed.setFields(options.embed?.win?.fields);
							if (options.embed?.win?.author)
								winEmbed.setAuthor(options.embed?.win?.author);
							if (options.embed?.win?.image)
								winEmbed.setImage(options.embed?.win?.image);
							if (options.embed?.win?.thumbnail)
								winEmbed.setThumbnail(options.embed?.win?.thumbnail);
							if (options.embed?.win?.timestamp)
								winEmbed.setTimestamp(options.embed?.win?.timestamp);
							if (options.embed?.win?.url)
								winEmbed.setURL(options.embed?.win?.url);

							//p2 - won
							if (interaction) {
								await interaction.editReply({
									content: '** **',
									embeds: [winEmbed],
									components: []
								});
								resolve(message.member.user);
							} else if (!interaction) {
								await (m as Message).edit({
									content: '** **',
									embeds: [winEmbed],
									components: []
								});
							}

							resolve(message.member.user);
						}
					}
				});
			});

			collector.on('end', async (coll, reason) => {
				if (reason === 'time') {
					await m.edit({
						content: '** **',
						embeds: [timeoutEmbed],
						components: []
					});
				} else if (reason === 'decline') {
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

					await m.edit({
						content: '** **',
						embeds: [declineEmbed],
						components: []
					});
				}
			});
		} catch (err: any) {
			if (options.strict)
				throw new SimplyError({
					function: 'rps',
					title: 'An Error occured when running the function ',
					tip: err.stack
				});
			else console.log(`SimplyError - rps | Error: ${err.stack}`);
		}
	});
}
