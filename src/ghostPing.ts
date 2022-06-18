import {
	MessageEmbed,
	Message,
	MessageEmbedFooter,
	MessageEmbedAuthor,
	ColorResolvable
} from 'discord.js';
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
	description?: string;
	color?: ColorResolvable;

	credit?: boolean;
}

export type ghostOptions = {
	embed?: CustomizableEmbed;
	custom?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A Great system to see **who ghost pinged**
 *
 * **Important!**: Use it in `messageDelete` event
 *
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/ghostPing***
 * @example simplydjs.ghostPing(message)
 */

export async function ghostPing(
	message: Message,
	options: ghostOptions = {}
): Promise<boolean> {
	return new Promise(async (resolve) => {
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
					if (!options.custom) {
						if (!options.embed) {
							options.embed = {
								footer: {
									text: '©️ Simply Develop. npm i simply-djs',
									iconURL: 'https://i.imgur.com/u8VlLom.png'
								},
								color: '#075FFF',
								credit: true
							};
						}

						const chembed: MessageEmbed = new MessageEmbed()
							.setAuthor(
								options.embed?.author || {
									name: message.author.tag,
									iconURL: message.author.displayAvatarURL({ format: 'gif' })
								}
							)
							.setTitle(options.embed?.title || 'Ghost Ping Detected')
							.setDescription(
								options.embed?.description ||
									`${message.author} **(${
										message.author.tag
									})** just ghost pinged ${message.mentions.members.first()} **(${
										message.mentions.users.first().tag
									})**\n\nContent: **${message.content}**`
							)
							.setColor(options.embed?.color || '#075FFF')
							.setFooter(
								options.embed?.credit === false
									? options.embed?.footer
									: {
											text: '©️ Simply Develop. npm i simply-djs',
											iconURL: 'https://i.imgur.com/u8VlLom.png'
									  }
							)
							.setTimestamp();

						message.channel
							.send({ embeds: [chembed] })
							.then(async (msg: Message) => {
								setTimeout(() => {
									msg.delete();
								}, 10000);
							});
					}

					resolve(true);
				} else resolve(false);
			} catch (err: any) {
				console.log(
					`${chalk.red('Error Occured.')} | ${chalk.magenta(
						'ghostPing'
					)} | Error: ${err.stack}`
				);
			}
		}
	});
}
