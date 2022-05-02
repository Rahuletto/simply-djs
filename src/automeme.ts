import {
	Client,
	MessageEmbed,
	MessageEmbedAuthor,
	ColorResolvable,
	TextChannel,
	MessageEmbedFooter
} from 'discord.js';

import axios from 'axios';
import { SimplyError } from './Error/Error';
import chalk from 'chalk';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/CustomizableEmbed*
 */

interface CustomizableEmbed {
	author?: MessageEmbedAuthor;
	title?: string;
	footer?: MessageEmbedFooter;
	color?: ColorResolvable;
	description?: string;

	credit?: boolean;
}

export type memeOptions = {
	embed?: CustomizableEmbed;
	channelId: string;
	interval?: number;
	sub?: string[] | string;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * The memes are sent automatically, so others will able to laugh at the jokes without having to do anything !
 * @param client
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/automeme***
 * @example simplydjs.automeme(client, { channelId: '1234567890123' })
 */

export async function automeme(
	client: Client,
	options: memeOptions = { channelId: '' }
): Promise<void> {
	try {
		let ch = options.channelId;

		if (!ch || ch == '')
			throw new SimplyError({
				name: 'NOT_SPECIFIED | Provide an channel id to send memes.',
				tip: `Expected channelId as string in options.. | Received ${
					ch || 'undefined'
				}`
			});

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
			options.sub.forEach((subb) => {
				sub.push(subb);
			});
		} else if (!Array.isArray(options.sub)) {
			sub.push(options.sub);
		}

		if (!options.embed) {
			options.embed = {
				color: '#075FFF'
			};
		}

		let random = Math.floor(Math.random() * sub.length);

		let interv;
		if (options.interval) {
			if (options.interval < 60000)
				throw new SimplyError({
					name: 'Provide an interval time above 60000ms',
					tip: `Expected Interval time above 60000ms (1 minute) | Received ${
						options.interval || 'undefined'
					}`
				});
			interv = options.interval;
		} else {
			interv = 240000;
		}

		setInterval(async () => {
			let channel = await client.channels.fetch(ch, {
				cache: true
			});

			if (!channel)
				throw new SimplyError({
					name: `INVALID_CHID - ${options.channelId} | The channel id you specified is not valid (or) The bot has no VIEW_CHANNEL permission.`,
					tip: 'Check the permissions (or) Try using another Channel ID'
				});

			let response = await axios
				.get(`https://www.reddit.com/r/${sub[random]}/random/.json`)
				.then((res) => res.data)
				.catch(() => {});

			if (!response) return;
			if (!response[0].data) return;

			if (response[0].data.children[0].data.over_18 === true) return;

			let perma = response[0].data.children[0].data.permalink;
			let url = `https://reddit.com${perma}`;
			let memeImage =
				response[0].data.children[0].data.url ||
				response[0].data.children[0].data.url_overridden_by_dest;
			let title = response[0].data.children[0].data.title;
			let upp = response[0].data.children[0].data.ups;
			let ratio = response[0].data.children[0].data.upvote_ratio;

			const embed = new MessageEmbed()
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
		}, interv);
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta('automeme')} | Error: ${
				err.stack
			}`
		);
	}
}
