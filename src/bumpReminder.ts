import { Client, EmbedBuilder, TextChannel, Message } from 'discord.js';

import db from './model/bumpReminder';
import { toRgb, ms } from './misc';
import { SimplyError } from './error';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

interface TypeEmbed {
	thank?: EmbedBuilder;
	remind?: EmbedBuilder;
}

export type bumpOptions = {
	strict: boolean;
	content?: string;
	embed?: TypeEmbed;
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
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/bumpReminder***
 * @example simplydjs.bumpReminder(client, message)
 */

export async function bumpReminder(
	client: Client,
	message: Message | bumpOptions,
	options: bumpOptions
): Promise<boolean> {
	try {
		const reminder: EmbedBuilder = new EmbedBuilder()
			.setTitle('Bump Reminder !')
			.setDescription(
				'Its been 2 hours since last bump. Reminding the server members to bump again.'
			)
			.setTimestamp()
			.setColor(toRgb('#406DBC'))
			.setFooter({ text: 'Do /bump to bump the server ;)' });

		const thankyou: EmbedBuilder = new EmbedBuilder()
			.setTitle('Thank you')
			.setDescription(
				'Thank you for bumping the server. This means a lot. Will notify everyone after 2 hours'
			)
			.setTimestamp()
			.setColor(toRgb('#06bf00'))
			.setFooter({ text: 'Next bump after 120 minutes. (2 hours)' });

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
								embeds: [(message as bumpOptions).embed?.remind || reminder]
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
				if (Array.isArray(options.channelId)) {
					chid = options.channelId;
				} else if (!Array.isArray(options.channelId)) {
					chid.push(options.channelId);
				}

				options.embed = {
					remind: options.embed?.remind || reminder,
					thank: options.embed?.thank || thankyou
				};

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
									content: options.content || '\u200b',
									embeds: [options.embed?.thank || thankyou]
								});

								resolve(true);
							}
						}
					}
				}
			});
		}
	} catch (err: any) {
		if (options.strict)
			throw new SimplyError({
				function: 'bumpReminder',
				title: 'An Error occured when running the function ',
				tip: err.stack
			});
		else console.log(`SimplyError - bumpReminder | Error: ${err.stack}`);
	}
}
