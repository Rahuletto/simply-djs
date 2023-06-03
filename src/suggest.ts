import {
	EmbedBuilder,
	TextChannel,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Message,
	User,
	InteractionResponse,
	ComponentType,
	ButtonInteraction,
	GuildMember
} from 'discord.js';

import { SimplyError } from './error/SimplyError';

import db from './model/suggest';

import {
	ExtendedInteraction,
	ExtendedMessage,
	CustomizableEmbed,
	CustomizableButton
} from './typedef';
import { toButtonStyle, ms, toRgb } from './misc';

import { Document as Doc } from 'mongoose';

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/systems/suggest#suggestbuttons
 */

export interface SuggestButtons {
	votedInfo?: CustomizableButton;
	upvote?: CustomizableButton;
	downvote?: CustomizableButton;
}

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/systems/suggest#progress
 */

export interface Progress {
	up: string;
	down: string;
	blank: string;
}

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/systems/suggest#suggestoptions
 */

export type suggestOptions = {
	embed?: CustomizableEmbed;
	channelId?: string | TextChannel;
	suggestion?: string;
	buttons?: SuggestButtons;
	progress?: Progress;
	strict: boolean;
};

export type SuggestResolve = {
	suggestion: string; // the suggestion provided
	channel: TextChannel; // the channel to send the suggestion
	user: GuildMember; // the user who suggested
};
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * An **Beautiful** suggestion system with buttons ;D | *Requires: [**manageSug()**](https://simplyd.js.org/docs/handler/manageSug)*
 * @param msgOrint
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/systems/suggestSystem
 * @example simplydjs.suggestSystem(interaction, { channelId: '1234567890123' })
 */

export async function suggest(
	msgOrint: ExtendedMessage | ExtendedInteraction,
	options: suggestOptions = { strict: false }
): Promise<SuggestResolve> {
	return new Promise(async (resolve) => {
		try {
			const { client } = msgOrint;
			let url: string;
			let suggestion: string;

			let interaction: ExtendedInteraction;
			if (msgOrint.commandId || !msgOrint.content) {
				interaction = msgOrint as ExtendedInteraction;

				suggestion =
					options.suggestion ||
					String(interaction.options.get('suggestion').value);

				if (!suggestion)
					return interaction.followUp({
						content: 'Provide a suggestion to post.',
						ephemeral: true
					});
			} else if (!msgOrint.commandId && msgOrint.content) {
				const attachment = (msgOrint as Message).attachments?.first();

				url = attachment ? attachment.url : '';

				if (options?.suggestion) suggestion = options?.suggestion;

				if (url) suggestion = suggestion + ' ' + url;

				if (!options.suggestion && (msgOrint as Message)) {
					const [...args] = (msgOrint as Message).content?.split(/ +/g);
					suggestion = args.slice(1).join(' ');
				}

				if (suggestion === '' || !suggestion)
					return msgOrint.reply({ content: 'Provide a suggestion to post.' });
			}

			if (!options.embed) {
				options.embed = {
					footer: {
						text: '©️ Rahuletto. npm i simply-djs',
						iconURL: 'https://i.imgur.com/XFUIwPh.png'
					},
					color: toRgb('#406DBC'),
					title: 'New Suggestion'
				};
			}

			options.buttons = {
				upvote: {
					style: options.buttons?.upvote?.style || ButtonStyle.Primary,
					emoji: options.buttons?.upvote?.emoji || '☑️'
				},
				downvote: {
					style: options.buttons?.downvote?.style || ButtonStyle.Danger,
					emoji: options.buttons?.downvote?.emoji || '🇽'
				},
				votedInfo: {
					style: options.buttons?.votedInfo?.style || ButtonStyle.Success,
					emoji: options.buttons?.votedInfo?.emoji || '❓'
				}
			};

			if (options?.buttons?.upvote.style as string)
				options.buttons.upvote.style = toButtonStyle(
					options?.buttons?.upvote.style as string
				);
			if (options?.buttons?.downvote.style as string)
				options.buttons.downvote.style = toButtonStyle(
					options?.buttons?.downvote.style as string
				);
			if (options?.buttons?.votedInfo.style as string)
				options.buttons.votedInfo.style = toButtonStyle(
					options?.buttons?.votedInfo.style as string
				);

			const ch =
				client.channels.cache.get(options?.channelId as string) ||
				(options?.channelId as TextChannel);
			if (!ch) {
				if (options?.strict)
					throw new SimplyError({
						function: 'suggest',
						title: `Invalid Channel (or) No VIEW_CHANNEL permission`,
						tip: `Check the permissions (or) Try using another Channel ID.\nReceived ${
							options.channelId || 'undefined'
						}`
					});
				else
					console.log(
						`SimplyError - suggest | Invalid Channel (or) No VIEW_CHANNEL permission\n\nCheck the permissions (or) Try using another Channel ID.\n Received ${
							options.channelId || 'undefined'
						}`
					);
			}

			const surebtn = new ButtonBuilder()
				.setStyle(ButtonStyle.Success)
				.setLabel('Suggest')
				.setCustomId('send-suggestion');

			const nobtn = new ButtonBuilder()
				.setStyle(ButtonStyle.Danger)
				.setLabel('Cancel')
				.setCustomId('cancel-suggestion');

			const sendRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
				surebtn,
				nobtn
			]);

			const embed = new EmbedBuilder()
				.setTitle(options.embed?.title || 'Are you sure?')
				.setDescription(
					options.embed?.description ||
						`Is this your suggestion ? \`\`\`${suggestion}\`\`\``
				)
				.setTimestamp()
				.setColor(options.embed?.color || toRgb('#406DBC'))
				.setFooter(
					options.embed?.footer
						? options.embed?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				);

			if (options?.embed?.fields) embed.setFields(options.embed?.fields);
			if (options?.embed?.author) embed.setAuthor(options.embed?.author);
			if (options?.embed?.image) embed.setImage(options.embed?.image);
			if (options?.embed?.thumbnail)
				embed.setThumbnail(options.embed?.thumbnail);
			if (options?.embed?.timestamp)
				embed.setTimestamp(options.embed?.timestamp);
			if (options?.embed?.title) embed.setTitle(options.embed?.title);
			if (options?.embed?.url) embed.setURL(options.embed?.url);

			let m: Message | InteractionResponse;

			if (interaction) {
				m = await interaction.followUp({
					embeds: [embed],
					components: [sendRow],
					ephemeral: true
				});
			} else if (!interaction) {
				m = await msgOrint.reply({
					embeds: [embed],
					components: [sendRow]
				});
			}

			const filter = (m: ButtonInteraction) => {
				if (m.user.id === (msgOrint.member.user as User).id) return true;
				m.reply({
					content: `Only <@!${
						(msgOrint.member.user as User).id
					}> can use these buttons!`,
					ephemeral: true
				});
				return false;
			};
			const collector = (m as Message).createMessageComponentCollector({
				filter: filter,
				max: 1,
				componentType: ComponentType.Button,
				time: ms('15s') // 15 Seconds
			});

			collector.on('collect', async (b) => {
				if (b.customId === 'send-suggestion') {
					await b.reply({ content: 'Ok, Posted. :+1:', ephemeral: true });
					await (b.message as Message).delete();

					const suggestEmb = new EmbedBuilder()
						.setDescription(suggestion)
						.setAuthor({
							name: (msgOrint.member.user as User).tag,
							iconURL: (msgOrint.member.user as User).displayAvatarURL({
								forceStatic: false
							})
						})
						.setColor(options.embed?.color || toRgb('#406DBC'))
						.setFooter(
							options.embed?.footer
								? options.embed?.footer
								: {
										text: '©️ Rahuletto. npm i simply-djs',
										iconURL: 'https://i.imgur.com/XFUIwPh.png'
								  }
						)
						.addFields(
							{
								name: 'Status',
								value: `\`\`\`\nWaiting for the response..\n\`\`\``
							},
							{
								name: 'Percentage',
								value: `${(options?.progress?.blank || '⬛').repeat(
									10
								)} [0% - 0%]`
							}
						);

					const approve = new ButtonBuilder()
						.setEmoji(options.buttons?.upvote?.emoji)
						.setLabel('0')
						.setStyle(
							(options.buttons?.upvote?.style as ButtonStyle) ||
								ButtonStyle.Primary
						)
						.setCustomId('plus-suggestion');

					const no = new ButtonBuilder()
						.setEmoji(options.buttons?.downvote?.emoji)
						.setLabel('0')
						.setStyle(
							(options.buttons?.downvote?.style as ButtonStyle) ||
								ButtonStyle.Danger
						)
						.setCustomId('minus-suggestion');

					const whoVoted = new ButtonBuilder()
						.setEmoji(options.buttons?.votedInfo?.emoji)
						.setLabel('Who Voted?')
						.setStyle(
							(options.buttons?.votedInfo?.style as ButtonStyle) ||
								ButtonStyle.Success
						)
						.setCustomId('who-voted-suggestion');

					const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
						approve,
						no,
						whoVoted
					]);

					await (ch as TextChannel)
						.send({ embeds: [suggestEmb], components: [row] })
						.then(async (ms) => {
							const database: Doc = new db({
								message: ms.id,
								author: msgOrint.member.user.id,
								progress: options?.progress
									? options?.progress
									: { blank: '⬛', up: '🟩', down: '🟥' }
							});

							await database.save();

							resolve({
								user: msgOrint.member,
								suggestion: suggestion,
								channel: ch as TextChannel
							});
						});
				} else if (b.customId === 'cancel-suggestion') {
					(b.message as Message).delete();
				}
			});

			collector.on('end', async (collected) => {
				if (collected.size == 0) {
					(m as Message).edit({
						content: "Timeout.. Didn't post the suggestion.",
						embeds: [],
						components: []
					});
				}
			});
		} catch (err: any) {
			if (options?.strict)
				throw new SimplyError({
					function: 'suggest',
					title: 'An Error occured when running the function',
					tip: err.stack
				});
			else console.log(`SimplyError - suggest | Error: ${err.stack}`);
		}
	});
}
