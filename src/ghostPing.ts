import { EmbedBuilder, Message, User } from 'discord.js';
import { CustomizableEmbed } from './typedef';
import { SimplyError } from './error';
import { toRgb, ms } from './misc';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/general/ghostPing#ghostoptions
 */

export type ghostOptions = {
	strict: boolean;
	embed?: CustomizableEmbed;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * ## ghostPing
 * ### A Great system to see **who ghost pinged**
 *
 * **Important!**: Use it in `messageDelete` event
 *
 * @async
 * @param {Message} message `Message`
 * @param {ghostOptions} options [`ghostOptions`](https://simplyd.js.org/docs/general/ghostPing#ghostoptions)
 * @returns {Promise<User>} [`User`](https://discord.js.org/#/docs/discord.js/stable/class/User)
 *
 * ---
 *
 * @link [`Documentation`](https://simplyd.js.org/docs/general/ghostPing)
 * @example simplydjs.ghostPing(message)
 */

export async function ghostPing(
	message: Message,
	options: ghostOptions = { strict: false }
): Promise<User> {
	return new Promise(async (resolve) => {
		message
			.fetch(true)
			.then((m) => {
				if (m) {
					if (options.strict)
						throw new SimplyError({
							function: 'ghostPing',
							title: 'Use this function in messageDelete event',
							tip: 'We recognised that you are not using this function in messageDelete event.'
						});
					else
						console.log(
							`SimplyError - ghostPing | Error: Use this function in messageDelete event\n\nWe recognised that you are not using this function in messageDelete event.`
						);
				}
			})
			.catch(() => {
				return true;
			});

		if (message.mentions.users.first()) {
			try {
				if (message.author.bot) return;

				if (
					message.content.includes(
						`<@${message.mentions.members.first()?.user.id}>`
					) ||
					message.content.includes(
						`<@!${message.mentions.members.first()?.user.id}>`
					)
				) {
					if (!options.embed) {
						options.embed = {
							footer: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
							},
							color: toRgb('#406DBC')
						};
					}

					const embed: EmbedBuilder = new EmbedBuilder()
						.setAuthor(
							options.embed?.author || {
								name: message.author.username,
								iconURL: message.author.displayAvatarURL({
									forceStatic: false
								})
							}
						)
						.setTitle(options.embed?.title || 'Ghost Ping')
						.setDescription(
							options.embed?.description ||
								`${message.author} **(${
									message.author.username
								})** just ghost pinged ${message.mentions.members.first()} **(${
									message.mentions.users.first().username
								})**\n\nContent: **${message.content}**`
						)
						.setColor(options.embed?.color || toRgb('#406DBC'))
						.setFooter(
							options.embed?.footer
								? options.embed?.footer
								: {
										text: '©️ Rahuletto. npm i simply-djs',
										iconURL: 'https://i.imgur.com/XFUIwPh.png'
								  }
						)
						.setTimestamp();

					if (options?.embed?.fields) embed.setFields(options.embed?.fields);
					if (options?.embed?.author) embed.setAuthor(options.embed?.author);
					if (options?.embed?.image) embed.setImage(options.embed?.image);
					if (options?.embed?.thumbnail)
						embed.setThumbnail(options.embed?.thumbnail);
					if (options?.embed?.timestamp)
						embed.setTimestamp(options.embed?.timestamp);
					if (options?.embed?.title) embed.setTitle(options.embed?.title);
					if (options?.embed?.url) embed.setURL(options.embed?.url);

					message.channel
						.send({ embeds: [embed] })
						.then(async (msg: Message) => {
							setTimeout(() => {
								msg.delete();
							}, ms('20s'));

							resolve(message.mentions.users.first());
						});
				}
			} catch (err: any) {
				if (options?.strict)
					throw new SimplyError({
						function: 'ghostPing',
						title: 'An Error occured when running the function ',
						tip: err.stack
					});
				else console.log(`SimplyError - ghostPing | Error: ${err.stack}`);
			}
		}
	});
}
