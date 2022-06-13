import { Client, MessageEmbed, TextChannel, Message } from 'discord.js';

import chalk from 'chalk';
import db from './model/bumpSys';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

interface TypeEmbed {
	thankEmb?: MessageEmbed;
	bumpEmb?: MessageEmbed;
}

export type bumpOptions = {
	content?: string;
	embed?: TypeEmbed;
	toggle?: boolean;
	auto?: boolean;
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
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/bumpSystem***
 * @example simplydjs.bumpSystem(client, message)
 */

export async function bumpSystem(
	client: Client,
	message: Message | bumpOptions,
	options: bumpOptions
): Promise<boolean> {
	try {
		const bumpo: MessageEmbed = new MessageEmbed()
			.setTitle('Its Bump Time !')
			.setDescription(
				'Its been 2 hours since last bump. Could someone please bump the server again ?'
			)
			.setTimestamp()
			.setColor('#075FFF')
			.setFooter({ text: 'Do !d bump to bump the server ;)' });

		const bumpoo: MessageEmbed = new MessageEmbed()
			.setTitle('Thank you')
			.setDescription(
				'Thank you for bumping the server. Your support means a lot. Will notify you after 2 hours'
			)
			.setTimestamp()
			.setColor('#06bf00')
			.setFooter({ text: 'Now its time to wait for 120 minutes. (2 hours)' });

		if ((!options && (message as bumpOptions)) || (!options && !message)) {
			return new Promise(async (resolve, reject) => {
				setInterval(async () => {
					const data = await db.find({
						counts: []
					});

					data.forEach(async (dt) => {
						if (dt.nxtBump && dt.nxtBump < Date.now()) {
							dt.nxtBump = undefined;
							await dt.save().catch(() => {});

							const cho = await client.channels.fetch(dt.channel, {
								force: true
							});

							await (cho as TextChannel).send({
								content: message.content || '\u200b',
								embeds: [(message as bumpOptions).embed?.bumpEmb || bumpo]
							});

							resolve(true);
						} else return;
					});
				}, 5000);
			});
		}

		if (options?.auto == false) {
			if (options?.toggle == false) return;

			let chid: string[] = [];

			if (options && (message as Message).channel) {
				return new Promise(async (resolve, reject) => {
					if (Array.isArray(options.channelId)) {
						chid = options.channelId;
					} else if (!Array.isArray(options.channelId)) {
						chid.push(options.channelId);
					}

					options.embed = {
						bumpEmb: options.embed?.bumpEmb || bumpo,
						thankEmb: options.embed?.thankEmb || bumpoo
					};

					if ((message as Message).author.id === '302050872383242240') {
						for (let i = 0; i < chid.length; i++) {
							if ((message as Message).channel.id === chid[i]) {
								if (
									(message as Message).embeds[0] &&
									(message as Message).embeds[0].description &&
									(message as Message).embeds[0].description.includes(
										'Bump done'
									)
								) {
									const timeout = 7200000;
									const time = Date.now() + timeout;

									let data = await db.findOne({
										channel: chid[i]
									});
									if (!data) {
										data = new db({
											counts: [],
											guild: (message as Message).guild.id,
											channel: chid[i],
											nxtBump: time
										});
										await data.save().catch(() => {});
									}

									data.nxtBump = time;
									await data.save().catch(() => {});

									await (message as Message).channel.send({
										content: options.content || '\u200b',
										embeds: [options.embed?.thankEmb || bumpoo]
									});

									resolve(true);
								}
							}
						}
					}
				});
			}
		} else if (message.content || options?.auto == true) {
			if (options?.toggle == false) return;

			if ((message as Message)?.channel) {
				return new Promise(async (resolve, reject) => {
					if ((message as Message).author.id === '302050872383242240') {
						const chid = (message as Message).channel.id;
						const guild = (message as Message).guild.id;

						options.embed = {
							bumpEmb: options?.embed?.bumpEmb || bumpo,
							thankEmb: options?.embed?.thankEmb || bumpoo
						};

						if (
							(message as Message).embeds[0] &&
							(message as Message).embeds[0].description &&
							(message as Message).embeds[0].description.includes('Bump done')
						) {
							const timeout = 7200000;
							const time = Date.now() + timeout;

							let data = await db.findOne({
								guild: guild
							});

							if (!data) {
								data = new db({
									counts: [],
									guild: guild,
									channel: chid,
									nxtBump: time
								});
								await data.save().catch(() => {});
							}

							data.nxtBump = time;
							data.channel = chid;
							await data.save().catch(() => {});

							await (message as Message).channel.send({
								content: options.content || '\u200b',
								embeds: [options.embed?.thankEmb || bumpoo]
							});

							resolve(true);
						}
					}
				});
			}
		}
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta(
				'bumpSystem'
			)} | Error: ${err.stack}`
		);
	}
}
