import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	MessageReaction,
	TextChannel
} from 'discord.js';
import { SimplyError } from './error/SimplyError';
import { ExtendedMessage, CustomizableEmbed } from './typedef';

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/systems/starboard#starboardoptions
 */

export type starboardOptions = {
	embed?: CustomizableEmbed;
	channelId?: string;
	min?: number;
	emoji?: string;

	strict?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * Efficient yet Simplest starboard system ever existed !
 *
 * `NOTE:` **Only Use it in `messageReactionAdd`, `messageReactionRemove` and `messageDelete` events.**
 * @param reaction
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/systems/starboard
 * @example simplydjs.starboard(reaction, { channelId: '1234567890123' })
 */

export async function starboard(
	reactionOrMessage: MessageReaction | ExtendedMessage,
	options: starboardOptions = { strict: false }
): Promise<void> {
	return new Promise(async () => {
		const { client } = reactionOrMessage;
		const minimumRequired = options.min || 2;
		let extMessage: ExtendedMessage = reactionOrMessage as ExtendedMessage;
		let react: MessageReaction = reactionOrMessage as MessageReaction;
		if ((reactionOrMessage as ExtendedMessage).id)
			extMessage = reactionOrMessage as ExtendedMessage;
		else react = reactionOrMessage as MessageReaction;

		if (
			!minimumRequired ||
			Number.isNaN(minimumRequired) ||
			minimumRequired == 0
		) {
			if (options?.strict)
				throw new SimplyError({
					function: 'starboard',
					title: `Minimum number of stars [min] option is not a number.`,
					tip: `Expected an Integer/Number. Received ${
						minimumRequired || 'undefined'
					}.`
				});
			else
				console.log(
					`SimplyError - starboard | Minimum number of stars [min] option is not a number.\n\nExpected an Integer/Number. Received ${
						minimumRequired || 'undefined'
					}.`
				);
		}

		if (!options.channelId) {
			if (options?.strict)
				throw new SimplyError({
					function: 'starboard',
					title: `Provide an Channel ID to set the starboard channel`
				});
			else
				console.log(
					`SimplyError - starboard | Provide an Channel ID to set the starboard channel`
				);
		}
		try {
			if (extMessage || !(reactionOrMessage as MessageReaction).message) {
				let starboard = await client.channels.cache.get(options.channelId);

				if (!extMessage.guild) return;

				if (!starboard) {
					if (options?.strict)
						throw new SimplyError({
							function: 'starboard',
							title: `Invalid Channel (or) No VIEW_CHANNEL permission`,
							tip: `Check the permissions (or) Try using another Channel ID.\nReceived ${
								options.channelId || 'undefined'
							}`
						});
					else
						console.log(
							`SimplyError - starboard | Invalid Channel (or) No VIEW_CHANNEL permission\n\nCheck the permissions (or) Try using another Channel ID.\n Received ${
								options.channelId || 'undefined'
							}`
						);
				}

				const messages = await (starboard as TextChannel)?.messages.fetch({
					limit: 100
				});

				const existing = messages.find(
					(msg) => msg.embeds[0]?.footer?.text == '⭐ | ID: ' + extMessage.id
				);

				if (existing) {
					await existing.delete();
				}
			} else if (react) {
				if (
					react.emoji.id == options.emoji ||
					react.emoji.name == '⭐' ||
					react.emoji.name == '🌟'
				) {
					const minmax = react.count;
					if (minmax < minimumRequired) return;

					let starboard = await client.channels.fetch(options.channelId, {
						force: true,
						cache: true
					});

					if (!react.message.guild) return;

					if (!starboard) {
						if (options?.strict)
							throw new SimplyError({
								function: 'starboard',
								title: `Invalid Channel (or) No VIEW_CHANNEL permission`,
								tip: `Check the permissions (or) Try using another Channel ID.\nReceived ${
									options.channelId || 'undefined'
								}`
							});
						else
							console.log(
								`SimplyError - starboard | Invalid Channel (or) No VIEW_CHANNEL permission\n\nCheck the permissions (or) Try using another Channel ID.\n Received ${
									options.channelId || 'undefined'
								}`
							);
					}

					if (react.count == 0 || !react.count) {
						const messages = await (starboard as TextChannel)?.messages.fetch({
							limit: 100
						});

						const existing = messages.find(
							(msg) =>
								msg.embeds[0]?.footer?.text == '⭐ | ID: ' + extMessage.id
						);

						if (existing) {
							await existing.delete();
						}
					}

					const fetch = await react.message.fetch(true);

					const attachment = fetch.attachments.first();
					const url = attachment ? attachment.url : null;

					if (fetch.embeds.length !== 0) return;

					const embed = new EmbedBuilder()
						.setAuthor(
							options?.embed?.author || {
								name: fetch.author.tag,
								iconURL: fetch.author.displayAvatarURL()
							}
						)
						.setColor(options.embed?.color || '#FFC83D')
						.setDescription(options.embed?.description || fetch.content)
						.setTitle(options.embed?.title || `Jump to message`)
						.setURL(fetch.url)
						.setFooter({ text: '⭐ | ID: ' + fetch.id });

					if (options?.embed?.fields) embed.setFields(options.embed?.fields);
					if (options?.embed?.thumbnail)
						embed.setThumbnail(options.embed?.thumbnail);
					if (options?.embed?.timestamp)
						embed.setTimestamp(options.embed?.timestamp);

					if (url) {
						embed.setImage(url);
					}

					const messages = await (starboard as TextChannel)?.messages.fetch({
						limit: 100
					});

					const starEmoji = options.emoji
						? client.emojis.cache.get(options?.emoji) || '⭐'
						: '⭐';

					const btn = new ButtonBuilder()
						.setLabel((react.count ? react.count : 1).toString())
						.setEmoji(starEmoji)
						.setCustomId('starboard')
						.setDisabled(true)
						.setStyle(ButtonStyle.Primary);

					const link = new ButtonBuilder()
						.setLabel(`Jump to message`)
						.setStyle(ButtonStyle.Link)
						.setURL(fetch.url);

					const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
						btn,
						link
					]);

					const existing = messages.find(
						(msg) => msg.embeds[0]?.footer?.text == '⭐ | ID: ' + fetch.id
					);

					if (existing) {
						if (react.count < minimumRequired) return await existing.delete();
						else
							await existing.edit({
								content: `**${starEmoji} ${react.count}**`,
								embeds: [embed],
								components: [row]
							});
					} else {
						await (starboard as TextChannel).send({
							content: `**${starEmoji} ${react.count}**`,
							embeds: [embed],
							components: [row]
						});
					}
				}
			}
		} catch (err: any) {
			if (options?.strict)
				throw new SimplyError({
					function: 'starboard',
					title: 'An Error occured when running the function ',
					tip: err.stack
				});
			else console.log(`SimplyError - starboard | Error: ${err.stack}`);
		}
	});
}
