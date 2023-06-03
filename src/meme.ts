import { Client, EmbedBuilder, TextChannel, Channel } from 'discord.js';

import { https, toRgb, ms } from './misc';
import { SimplyError } from './error/SimplyError';
import { CustomizableEmbed } from './typedef';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/systems/meme#memeoptions
 */

export type memeOptions = {
	embed?: CustomizableEmbed;
	channelId?: string;
	interval?: number;
	sub?: string[] | string;

	strict?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * The memes are sent automatically, so others will able to laugh at the jokes without having to do anything !
 * @param clientOrChannel
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/systems/meme
 * @example simplydjs.meme(client, { channelId: '1234567890123' })
 * @example simplydjs.meme(channel, { sub: ["coding", "memes"] })
 */

export async function meme(
	clientOrChannel: Client | Channel,
	options: memeOptions = { strict: false }
): Promise<void> {
	return new Promise(async () => {
		try {
			// Get a channel from option or its Id
			const ch = options.channelId;

			if (!ch) {
				// If user is strict, throw an error or just console log.
				if (options?.strict)
					throw new SimplyError({
						function: 'meme',
						title: 'Channel/channelId is not specified',
						tip: `Expected channelId as string in options.. | Received ${
							ch + ` (${typeof ch})` || 'undefined'
						}`
					});
				else
					console.log(
						`SimplyError - meme | Channel/channelId is not specified\n\n
					Expected channelId as string in options.. | Received ${
						ch + ` (${typeof ch})` || 'undefined'
					}`
					);
			}

			// Default subreddits. Can override by array of strings in sub option

			let sub = [
				'meme',
				'me_irl',
				'memes',
				'dankmeme',
				'dankmemes',
				'ComedyCemetery',
				'terriblefacebookmemes',
				'funny'
			];

			if (Array.isArray(options.sub)) {
				sub = options.sub;
			} else if (!Array.isArray(options.sub)) {
				sub.push(options.sub);
			}

			// Getting random subreddit
			const random = Math.floor(Math.random() * sub.length);

			let interval;

			if (options?.interval) {
				if (options?.interval < 60000) {
					if (options?.strict)
						throw new SimplyError({
							function: 'meme',
							title: 'Provide an interval time above 60000ms',
							tip: `Expected Interval time above 60000ms (1 minute) | Received ${
								options.interval || 'undefined'
							}`
						});
					else
						console.log(
							`SimplyError - meme | Provide an interval time above 60000ms\n\nExpected Interval time above 60000ms (1 minute) | Received ${
								options.interval || 'undefined'
							}`
						);
				}
				interval = options.interval;
			} else {
				interval = ms('10m'); // 600k ms (10 minutes)
			}

			setInterval(async () => {
				// Getting the channel from Discord
				var channel: Channel;
				if (clientOrChannel as Channel) channel = clientOrChannel as Channel;
				else if (clientOrChannel as Client)
					channel = await (clientOrChannel as Client).channels.cache.get(ch);

				// If its unavailable, throw an error.
				if (!channel) {
					if (options?.strict)
						throw new SimplyError({
							function: 'meme',
							title: `Invalid Channel (or) No VIEW_CHANNEL permission`,
							tip: `Check the permissions (or) Try using another Channel ID.\nReceived ${
								options.channelId || 'undefined'
							}`
						});
					else
						console.log(
							`SimplyError - meme | Invalid Channel (or) No VIEW_CHANNEL permission\n\nCheck the permissions (or) Try using another Channel ID.\nReceived ${
								options.channelId || 'undefined'
							}`
						);
				}

				// Get a random reddit post from the subreddit
				const response = await https(
					`www.reddit.com/r/${sub[random]}/random.json`
				);

				if (!response) return;

				const data =
					response[0].children[0].data.over_18 === false
						? response[0].children[0]
						: response[1].children[0].data.over_18 === false
						? response[1].children[0]
						: undefined;

				if (data == undefined) return;

				// Get all the data from its API
				const perma = data.data.permalink;
				const url = `https://www.reddit.com${perma}`;
				const memeImage = data.data.url || data.data.url_overridden_by_dest;
				const title = data.data.title;
				const upp = data.data.ups;
				const ratio = data.data.upvote_ratio;

				// Building an Embed to send it.
				const embed = new EmbedBuilder()
					.setTitle(options.embed?.title || `${title}`)
					.setURL(`${url}`)
					.setImage(memeImage)
					.setColor(options.embed?.color || toRgb('#406DBC'))
					.setFooter({ text: `🔺 ${upp} | Upvote Ratio: ${ratio}` });

				if (options?.embed?.fields) embed.setFields(options.embed?.fields);
				if (options?.embed?.author) embed.setAuthor(options.embed?.author);
				if (options?.embed?.image) embed.setImage(options.embed?.image);
				if (options?.embed?.thumbnail)
					embed.setThumbnail(options.embed?.thumbnail);
				if (options?.embed?.timestamp)
					embed.setTimestamp(options.embed?.timestamp);
				if (options?.embed?.title) embed.setTitle(options.embed?.title);
				if (options?.embed?.url) embed.setURL(options.embed?.url);

				await (channel as TextChannel).send({ embeds: [embed] });
			}, interval);
		} catch (err: any) {
			if (options?.strict)
				throw new SimplyError({
					function: 'meme',
					title: 'An Error occured when running the function ',
					tip: err.stack
				});
			else console.log(`SimplyError - meme | Error: ${err.stack}`);
		}
	});
}
