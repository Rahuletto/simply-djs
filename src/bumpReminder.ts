import { Client, EmbedBuilder, TextChannel, Message } from 'discord.js';

import db from './model/bumpReminder';
import { toRgb, ms } from './misc';
import { SimplyError } from './error';
import { CustomizableEmbed } from './typedef';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the type: https://simplyd.js.org/docs/systems/bumpReminder#bumpreminderembeds
 */

export interface BumpReminderEmbeds {
	thank?: CustomizableEmbed;
	remind?: CustomizableEmbed;
}

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/systems/bumpReminder#bumpoptions
 */

export type bumpOptions = {
	strict: boolean;
	content?: string;
	embed?: BumpReminderEmbeds;
	toggle?: boolean;
	channelId?: string[];
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A Very cool bump reminder system that reminds when a bump is necessary [Only Disboard].
 *
 * **Requires you to have this in `messageCreate` and `ready` event**
 * @param client
 * @param message
 * @param options
 * @link `Documentation:` https://simplyd.js.org/docs/systems/bumpReminder
 * @example simplydjs.bumpReminder(client, message)
 */

export async function bumpReminder(
	client: Client,
	message: Message | bumpOptions,
	options: bumpOptions = { strict: false }
): Promise<boolean> {
	try {
		const reminder: EmbedBuilder = new EmbedBuilder()
			.setTitle(options.embed?.remind?.title || 'Bump Reminder !')
			.setDescription(
				options.embed?.remind?.description ||
					'Its been 2 hours since last bump. Reminding the server members to bump again.'
			)
			.setTimestamp()
			.setColor(options.embed?.remind?.color || toRgb('#406DBC'))
			.setFooter(
				options.embed?.remind?.footer || {
					text: 'Do /bump to bump the server ;) | ©️ Rahuletto. npm i simply-djs',
					iconURL: 'https://i.imgur.com/XFUIwPh.png'
				}
			);

		if (options?.embed?.remind?.fields)
			reminder.setFields(options.embed?.remind?.fields);
		if (options?.embed?.remind?.author)
			reminder.setAuthor(options.embed?.remind?.author);
		if (options?.embed?.remind?.image)
			reminder.setImage(options.embed?.remind?.image);
		if (options?.embed?.remind?.thumbnail)
			reminder.setThumbnail(options.embed?.remind?.thumbnail);
		if (options?.embed?.remind?.timestamp)
			reminder.setTimestamp(options.embed?.remind?.timestamp);
		if (options?.embed?.remind?.title)
			reminder.setTitle(options.embed?.remind?.title);
		if (options?.embed?.remind?.url)
			reminder.setURL(options.embed?.remind?.url);

		const thankyou: EmbedBuilder = new EmbedBuilder()
			.setTitle(options.embed?.thank?.title || 'Thank you for bump!')
			.setDescription(
				options.embed?.thank?.description ||
					'Thank you for bumping the server. This means a lot. Will notify everyone after 2 hours'
			)
			.setTimestamp()
			.setColor(options.embed?.thank?.color || toRgb('#06bf00'))
			.setFooter(
				options.embed?.thank?.footer || {
					text: 'Next bump after 120 minutes. (2 hours) | ©️ Rahuletto. npm i simply-djs',
					iconURL: 'https://i.imgur.com/XFUIwPh.png'
				}
			);

		if (options?.embed?.thank?.fields)
			thankyou.setFields(options.embed?.thank?.fields);
		if (options?.embed?.thank?.author)
			thankyou.setAuthor(options.embed?.thank?.author);
		if (options?.embed?.thank?.image)
			thankyou.setImage(options.embed?.thank?.image);
		if (options?.embed?.thank?.thumbnail)
			thankyou.setThumbnail(options.embed?.thank?.thumbnail);
		if (options?.embed?.thank?.timestamp)
			thankyou.setTimestamp(options.embed?.thank?.timestamp);
		if (options?.embed?.thank?.title)
			thankyou.setTitle(options.embed?.thank?.title);
		if (options?.embed?.thank?.url) thankyou.setURL(options.embed?.thank?.url);

		if ((!options && (message as bumpOptions)) || (!options && !message)) {
			return new Promise(async (resolve) => {
				setInterval(async () => {
					const data = await db.find({
						counts: []
					});

					data.forEach(async (dt) => {
						if (dt.nextBump && dt.nextBump < Date.now()) {
							dt.nextBump = undefined;
							await dt.save().catch(() => {});

							const cho = await client.channels.fetch(dt.channel, {
								force: true
							});

							await (cho as TextChannel).send({
								content: message.content || '\u200b',
								embeds: [reminder]
							});

							resolve(true);
						} else return;
					});
				}, ms('5s'));
			});
		}

		if (options?.toggle == false) return;

		let chid: string[] = [];

		if (options && (message as Message).channel) {
			return new Promise(async (resolve) => {
				if (Array.isArray(options?.channelId)) {
					chid = options?.channelId;
				} else if (!Array.isArray(options?.channelId)) {
					chid.push(options?.channelId);
				}

				if ((message as Message).author.id === '302050872383242240') {
					for (let i = 0; i < chid.length; i++) {
						if ((message as Message).channel.id === chid[i]) {
							if (
								(message as Message).embeds[0] &&
								(message as Message).embeds[0].description &&
								(message as Message).embeds[0].description.includes('Bump done')
							) {
								const timeout = ms('2h');
								const time = Date.now() + timeout;

								let data = await db.findOne({
									channel: chid[i]
								});
								if (!data) {
									data = new db({
										counts: [],
										guild: (message as Message).guild.id,
										channel: chid[i],
										nextBump: time
									});
									await data.save().catch(() => {});
								}

								data.nextBump = time;
								await data.save().catch(() => {});

								await (message as Message).channel.send({
									content: options?.content || '\u200b',
									embeds: [thankyou]
								});

								resolve(true);
							}
						}
					}
				}
			});
		}
	} catch (err: any) {
		if (options?.strict)
			throw new SimplyError({
				function: 'bumpReminder',
				title: 'An Error occured when running the function ',
				tip: err.stack
			});
		else console.log(`SimplyError - bumpReminder | Error: ${err.stack}`);
	}
}
