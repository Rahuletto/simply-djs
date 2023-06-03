import {
	Attachment,
	EmbedBuilder,
	Message,
	PermissionFlagsBits
} from 'discord.js';
import {
	ExtendedInteraction,
	ExtendedMessage,
	CustomizableEmbed
} from '../typedef';
import { ms } from '../misc';
import { Deprecated, SimplyError } from '../error';

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/deprecated/stealEmoji#stealoptions
 */

export type stealOptions = {
	embed?: CustomizableEmbed;
	emoji?: string;
	name?: string;
	strict?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * @deprecated Removed from the package
 *
 *
 * How cool is **stealing an emoji** from another server ? Feel the power with this function
 * @param msgOrInt
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/deprecated/stealEmoji
 * @example simplydjs.stealEmoji(interaction)
 */

export async function stealEmoji(
	msgOrInt: ExtendedMessage | ExtendedInteraction,
	options: stealOptions = { strict: false }
) {
	Deprecated({
		desc: 'Removed stealEmoji() from the package. Please use other package or our code in github.'
	});
	return new Promise(async () => {
		try {
			let interaction: ExtendedInteraction;
			if (msgOrInt.commandId) {
				interaction = msgOrInt as ExtendedInteraction;

				if (
					!interaction.member.permissions.has(
						PermissionFlagsBits.ManageGuildExpressions
					)
				)
					return interaction.followUp({
						content:
							'You Must Have • Manage Guild Expressions (Manage Emojis and Stickers) Permission',
						ephemeral: true
					});
			} else if (
				!msgOrInt.member.permissions.has(
					PermissionFlagsBits.ManageGuildExpressions
				)
			)
				return msgOrInt.channel.send({
					content:
						'You Must Have • Manage Guild Expressions (Manage Emojis and Stickers) Permission'
				});

			const extInteraction = msgOrInt as ExtendedInteraction;
			const extMessage = msgOrInt as ExtendedMessage;

			let attachment: Attachment;
			let emoji: string;
			let name: string;

			if (interaction) {
				name =
					options?.name ||
					String(extInteraction.options.get('name').value) ||
					'emojiURL';
				emoji =
					options?.emoji || String(extInteraction.options.get('emoji').value);

				if (!emoji) {
					extInteraction.followUp({
						content:
							'Send an Image URL/Attachment (Image file)/Emoji to steal [Collecting]'
					});
					const filter = (msg: Message) =>
						msg.author.id === extInteraction.member.user.id;

					const messageCollect = interaction.channel.createMessageCollector({
						filter: filter,
						max: 1,
						time: ms('20s')
					});

					messageCollect.on('collect', async (m: Message) => {
						if (m.attachments.size != 0) {
							attachment = m.attachments.first();
							emoji = m.attachments.first().url;
						} else if (m.content.match(/https/gi)) emoji = m.content;
						else if (
							m.content
								.replace('<:', '')
								.replace('<a:', '')
								.match(/(:)([^:\s]+)(:)/gi)
						)
							emoji = m.content
								.replace('<:', '')
								.replace('<a:', '')
								.match(/(:)([^:\s]+)(:)/gi)[1];

						emojiCalc(emoji);
					});
				} else emojiCalc(emoji);
			} else if (!interaction) {
				const [...args] = extMessage.content.split(/ +/g);

				attachment = extMessage.attachments?.first();

				name = options?.name || args[2] || 'emojiURL';
				emoji = options?.emoji || attachment?.url || args[1];

				if (!emoji || emoji == undefined) {
					extMessage.reply({
						content:
							'Send an Image URL/Attachment (Image file)/Emoji to steal [Collecting]'
					});
					const filter = (msg: Message) =>
						msg.author.id === extMessage.author.id;

					const messageCollect = msgOrInt.channel.createMessageCollector({
						filter: filter,
						max: 1,
						time: ms('20s')
					});

					messageCollect.on('collect', async (m: Message) => {
						if (m.attachments.size != 0) {
							attachment = m.attachments.first();
							emoji = m.attachments.first().url;
						} else if (m.content.match(/https/gi)) emoji = m.content;
						else if (
							m.content
								.replace('<:', '')
								.replace('<a:', '')
								.match(/(:)([^:\s]+)(:)/gi)
						)
							emoji = m.content
								.replace('<:', '')
								.replace('<a:', '')
								.match(/(:)([^:\s]+)(:)/gi)[1];

						emojiCalc(emoji);
					});
				} else emojiCalc(emoji);
			}

			async function emojiCalc(msg: string) {
				if (msg.startsWith('http')) {
					msgOrInt.guild.emojis
						.create({
							reason: 'Stole an emoji using a bot.',
							attachment: emoji,
							name: name
						})

						.then(async (emoji) => {
							const embed = new EmbedBuilder()
								.setTitle(
									(
										options.embed?.title ||
										`Successfully added the emoji.\n\nEmoji Name: \`{name}\`\nEmoji ID: \`{id}\``
									)
										.replaceAll('{name}', emoji.name)
										.replaceAll('{id}', emoji.id)
										.replaceAll('{url}', emoji.url)
								)
								.setThumbnail(emoji.url)
								.setColor(options.embed?.color || 0x075fff)
								.setFooter(
									options.embed?.footer
										? options.embed?.footer
										: {
												text: '©️ Rahuletto. npm i simply-djs',
												iconURL: 'https://i.imgur.com/XFUIwPh.png'
										  }
								);

							if (options?.embed?.fields)
								embed.setFields(options.embed?.fields);
							if (options?.embed?.author)
								embed.setAuthor(options.embed?.author);
							if (options?.embed?.image) embed.setImage(options.embed?.image);
							if (options?.embed?.thumbnail)
								embed.setThumbnail(options.embed?.thumbnail);
							if (options?.embed?.timestamp)
								embed.setTimestamp(options.embed?.timestamp);
							if (options?.embed?.title) embed.setTitle(options.embed?.title);
							if (options?.embed?.url) embed.setURL(options.embed?.url);

							if (interaction) {
								await extInteraction.followUp({
									content: 'Added the emoji :+1:',
									embeds: [embed],
									ephemeral: true
								});
							} else if (!interaction) {
								await extMessage.reply({
									content: 'Added the emoji :+1:',
									embeds: [embed]
								});
							}
						})
						.catch((err) => {
							if (options?.strict)
								throw new SimplyError({
									function: 'stealEmoji',
									title: 'An Error occured when running the function ',
									tip: err.stack
								});
							else
								console.log(`SimplyError - stealEmoji | Error: ${err.stack}`);
						});
				} else {
					const hasEmoteRegex = /<a?:.+:\d+>/gm;
					const emoteRegex = /<:.+:(\d+)>/gm;
					const animatedEmoteRegex = /<a:.+:(\d+)>/gm;

					const regex = msg.match(hasEmoteRegex);

					const emoji: RegExpExecArray = emoteRegex.exec(regex.toString());

					const animated: RegExpExecArray = animatedEmoteRegex.exec(
						regex.toString()
					);

					const url: string =
						'https://cdn.discordapp.com/emojis/' +
						emoji[1] +
						(emoji && !animated ? '.png?v=1' : '.gif?v=1');

					msgOrInt.guild.emojis
						.create({
							reason: 'Stole an emoji using a bot.',
							attachment: url,
							name: name
						})
						.then(async (emoji) => {
							const embed = new EmbedBuilder()
								.setTitle(
									(
										options.embed?.title ||
										`Successfully added the emoji.\n\nEmoji Name: \`{name}\`\nEmoji ID: \`{id}\``
									)
										.replaceAll('{name}', emoji.name)
										.replaceAll('{id}', emoji.id)
										.replaceAll('{url}', emoji.url)
								)
								.setThumbnail(emoji.url)
								.setColor(options.embed?.color || 0x075fff)
								.setFooter(
									options.embed?.footer
										? options.embed?.footer
										: {
												text: '©️ Rahuletto. npm i simply-djs',
												iconURL: 'https://i.imgur.com/XFUIwPh.png'
										  }
								);

							if (options?.embed?.author)
								embed.setAuthor(options.embed?.author);
							if (options?.embed?.image) embed.setImage(options.embed?.image);
							if (options?.embed?.thumbnail)
								embed.setThumbnail(options.embed?.thumbnail);
							if (options?.embed?.timestamp)
								embed.setTimestamp(options.embed?.timestamp);
							if (options?.embed?.title) embed.setTitle(options.embed?.title);
							if (options?.embed?.url) embed.setURL(options.embed?.url);
							if (options?.embed?.fields)
								embed.setFields(options.embed?.fields);

							if (interaction) {
								await extInteraction.followUp({
									content: 'Added the emoji :+1:',
									embeds: [embed],
									ephemeral: true
								});
							} else if (!interaction) {
								await extMessage.reply({
									content: 'Added the emoji :+1:',
									embeds: [embed]
								});
							}
						})
						.catch((err) => {
							if (options?.strict)
								throw new SimplyError({
									function: 'stealEmoji',
									title: 'An Error occured when running the function ',
									tip: err.stack
								});
							else
								console.log(`SimplyError - stealEmoji | Error: ${err.stack}`);
						});
				}
			}
		} catch (err: any) {
			if (options?.strict)
				throw new SimplyError({
					function: 'stealEmoji',
					title: 'An Error occured when running the function ',
					tip: err.stack
				});
			else console.log(`SimplyError - stealEmoji | Error: ${err.stack}`);
		}
	});
}
