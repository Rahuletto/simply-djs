import {
	Client,
	EmbedBuilder,
	EmbedAuthorData,
	ColorResolvable,
	TextChannel,
	EmbedFooterData,
	Channel
} from 'discord.js';

import https from './Others/https';
import { SimplyError } from './Error/Error';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/CustomizableEmbed*
 */

interface CustomizableEmbed {
	author?: EmbedAuthorData;
	title?: string;
	footer?: EmbedFooterData;
	color?: ColorResolvable;
	description?: string;

	credit?: boolean;
}

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
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/meme***
 * @example simplydjs.meme(client, { channelId: '1234567890123' })
 * @example simplydjs.meme(channel, { sub: ["coding", "memes"] })
 */

export async function meme(
	clientOrChannel: Client | Channel,
	options: memeOptions = {}
): Promise<void> {
	try {
		// Get a channel from option or its Id
		const ch = options.channelId;

		if (!ch) {
			// If user is strict, throw an error or just console log.
			if (options.strict)
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

		if (options.interval) {
			if (options.interval < 60000) {
				if (options.strict)
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
			interval = 600000; // 600k ms (10 minutes)
		}

		setInterval(async () => {
			// Getting the channel from Discord
			var channel: Channel;
			if (clientOrChannel as Channel) channel = clientOrChannel as Channel;
			else if (clientOrChannel as Client)
				channel = await (clientOrChannel as Client).channels.fetch(ch, {
					cache: true
				});

			// If its unavailable, throw an error.
			if (!channel) {
				if (options.strict)
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
				`/www.reddit.com`,
				`/r/${sub[random]}/random.json`
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
				.setColor(options.embed?.color || '#075FFF')
				.setFooter({ text: `🔺 ${upp} | Upvote Ratio: ${ratio}` });

			if (options.embed?.author) {
				embed.setAuthor(options.embed.author);
			}
			if (options.embed?.description) {
				embed.setDescription(options.embed.description);
			}

			await (channel as TextChannel).send({ embeds: [embed] });
		}, interval);
	} catch (err: any) {
		if (options.strict)
			throw new SimplyError({
				function: 'meme',
				title: 'Error: ',
				tip: err.stack
			});
		else console.log(`SimplyError - meme | Error: ${err.stack}`);
	}
}
