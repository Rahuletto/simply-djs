import chalk from 'chalk';
import {
	Client,
	ColorResolvable,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageEmbedAuthor,
	MessageReaction,
	TextChannel
} from 'discord.js';
import { SimplyError } from './Error/Error';

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/Systems/starboard#starboardembed*
 */

interface StarboardEmbed {
	author?: MessageEmbedAuthor;
	title?: string;
	description?: string;
	color?: ColorResolvable;
}

export type starboardOption = {
	embed?: StarboardEmbed;
	channelId?: string;
	min?: number | string;
	emoji?: string;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * Efficient yet Simplest starboard system ever existed !
 *
 * `NOTE:` **Only Use it in `messageReactionAdd`, `messageReactionRemove` and `messageDelete` events.**
 * @param client
 * @param reaction
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/starboard***
 * @example simplydjs.starboard(client, reaction, { channelId: '1234567890123' })
 */

export async function starboard(
	client: Client,
	reaction: MessageReaction | Message,
	options: starboardOption = {}
) {
	let min = options.min || 2;
	let m: Message = reaction as Message;
	let r: MessageReaction = reaction as MessageReaction;

	// @ts-ignore
	if (reaction.id) m = reaction;
	else r = reaction as MessageReaction;

	if (!min || min == NaN || min == 0)
		throw new SimplyError({
			name: 'MIN_IS_NAN | Minimum number of stars [min] option is Not A Number.',
			tip: `Expected an Integer/Number. Received ${min || 'undefined'}.`
		});

	if (!options.channelId)
		throw new SimplyError({
			name: 'Provide an Channel ID to set the starboard channel'
		});

	try {
		if (m || (reaction as Message).id) {
			let starboard = await client.channels.fetch(options.channelId, {
				cache: true
			});

			if (!m.guild) return;

			if (!starboard)
				throw new SimplyError({
					name: `INVALID_CHID - ${options.channelId} | The channel id you specified is not valid (or) The bot has no VIEW_CHANNEL permission.`,
					tip: 'Check the permissions (or) Try using another Channel ID'
				});

			starboard = await m.guild.channels.fetch(options.channelId, {
				cache: true
			});

			if (!starboard) return;

			let msz = await (starboard as TextChannel)?.messages.fetch({
				limit: 100
			});

			let exist = msz.find(
				(msg) => msg.embeds[0]?.footer?.text == '⭐ | ID: ' + m.id
			);

			if (exist) {
				await exist.delete();
			}
		} else if (r) {
			if (
				r.emoji.id == options.emoji ||
				r.emoji.name == '⭐' ||
				r.emoji.name == '🌟'
			) {
				let minmax = r.count;
				if (minmax < min) return;

				let starboard = await client.channels.fetch(options.channelId, {
					cache: true
				});

				if (!r.message.guild) return;

				if (!starboard)
					throw new SimplyError({
						name: `INVALID_CHID - ${options.channelId} | The channel id you specified is not valid (or) The bot has no VIEW_CHANNEL permission.`,
						tip: 'Check the permissions (or) Try using another Channel ID'
					});

				starboard = await r.message?.guild.channels?.fetch(options.channelId, {
					cache: true
				});

				if (!starboard) return;

				if (r.count == 0 || !r.count) {
					let msz = await (starboard as TextChannel)?.messages.fetch({
						limit: 100
					});

					let exist = msz.find(
						(msg) => msg.embeds[0]?.footer?.text == '⭐ | ID: ' + m.id
					);

					if (exist) {
						await exist.delete();
					}
				}

				let fetch = await r.message.fetch();

				const attachment = fetch.attachments.first();
				const url = attachment ? attachment.url : null;

				if (fetch.embeds.length !== 0) return;

				let embed = new MessageEmbed()
					.setAuthor(
						options.embed?.author || {
							name: fetch.author.tag,
							iconURL: fetch.author.displayAvatarURL()
						}
					)
					.setColor(options.embed?.color || '#FFC83D')
					.setDescription(options.embed?.description || fetch.content)
					.setTitle(options.embed?.title || `Jump to message`)
					.setURL(fetch.url)
					.setFooter({ text: '⭐ | ID: ' + fetch.id });

				if (url) {
					embed.setImage(url);
				}

				let msz = await (starboard as TextChannel)?.messages.fetch({
					limit: 100
				});

				let emo = options.emoji
					? client.emojis.cache.get(options?.emoji) || '⭐'
					: '⭐';

				let btn = new MessageButton()
					.setLabel((r.count ? r.count : 1).toString())
					.setEmoji(emo)
					.setCustomId('starboard')
					.setDisabled(true)
					.setStyle('PRIMARY');

				let btn2 = new MessageButton()
					.setLabel(`Jump to message`)
					.setStyle('LINK')
					.setURL(fetch.url);

				let row = new MessageActionRow().addComponents([btn, btn2]);

				let exist = msz.find(
					(msg) => msg.embeds[0]?.footer?.text == '⭐ | ID: ' + fetch.id
				);

				if (exist) {
					if (r.count < min) return await exist.delete();
					else
						await exist.edit({
							content: `**${emo} ${r.count}**`,
							embeds: [embed],
							components: [row]
						});
				} else {
					await (starboard as TextChannel).send({
						content: `**${emo} ${r.count}**`,
						embeds: [embed],
						components: [row]
					});
				}
			}
		}
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta(
				'starboard'
			)} | Error: ${err.stack}`
		);
	}
}
