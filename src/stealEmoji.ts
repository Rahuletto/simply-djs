import chalk from 'chalk';
import {
	MessageEmbedAuthor,
	ColorResolvable,
	MessageEmbedFooter,
	Message,
	MessageEmbed,
	Permissions,
	CommandInteraction,
	CacheType
} from 'discord.js';

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

export type stealOptions = {
	embed?: CustomizableEmbed;
	emoji?: string;
	name?: string;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * How cool is **stealing an emoji** from another server ? Feel the power with this function.
 * @param message
 * @param options
 * @example simplydjs.stealEmoji(interaction)
 */

export async function stealEmoji(
	message: Message | CommandInteraction,
	options: stealOptions = {}
) {
	try {
		let interaction: CommandInteraction<CacheType>;
		// @ts-ignore
		if (message.commandId) {
			interaction = message as CommandInteraction;

			if (
				// @ts-ignore
				!interaction.member.permissions.has(
					Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS
				)
			)
				return interaction.followUp({
					content: 'You Must Have • Manage Emojis and Stickers Permission',
					ephemeral: true
				});
		} else {
			if (
				// @ts-ignore
				!message.member.permissions.has(
					Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS
				)
			)
				return message.channel.send({
					content: 'You Must Have • Manage Emojis and Stickers Permission'
				});
		}

		let int = interaction as CommandInteraction;
		let ms = message as Message;

		let attachment;
		let em: string;
		let n: string;

		if (interaction) {
			n = options?.name || int.options.getString('name') || 'emojiURL';
			em = options?.emoji || int.options.getString('emoji');

			if (!em) {
				int.followUp({
					content:
						'Send an Image URL/Attachment (Image file)/Emoji to steal [Collecting]'
				});
				let filter = (msg: any) => msg.author.id === int.member.user.id;

				let msgCl = interaction.channel.createMessageCollector({
					filter,
					max: 1,
					time: 20 * 1000
				});

				msgCl.on('collect', async (m) => {
					if (m.attachments.size != 0) {
						attachment = m.attachments.first();
						em = m.attachments.first().url;
					} else if (m.content.match(/https/gi)) em = m.content;
					else if (
						m.content
							.replace('<:', '')
							.replace('<a:', '')
							.match(/(:)([^:\s]+)(:)/gi)
					)
						em = m.content
							.replace('<:', '')
							.replace('<a:', '')
							.match(/(:)([^:\s]+)(:)/gi)[1];

					emojiCalc(em);
				});
			} else emojiCalc(em);
		} else if (!interaction) {
			const [...args] = (message as Message).content.split(/ +/g);

			attachment = (message as Message).attachments?.first();

			n = options?.name || args[2] || 'emojiURL';
			em = options?.emoji || attachment?.url || args[1];

			console.log(em, n);

			if (!em || em == undefined) {
				ms.reply({
					content:
						'Send an Image URL/Attachment (Image file)/Emoji to steal [Collecting]'
				});
				let filter = (msg: any) => msg.author.id === ms.author.id;

				let msgCl = message.channel.createMessageCollector({
					filter,
					max: 1,
					time: 20 * 1000
				});

				msgCl.on('collect', async (m) => {
					if (m.attachments.size != 0) {
						attachment = m.attachments.first();
						em = m.attachments.first().url;
					} else if (m.content.match(/https/gi)) em = m.content;
					else if (
						m.content
							.replace('<:', '')
							.replace('<a:', '')
							.match(/(:)([^:\s]+)(:)/gi)
					)
						em = m.content
							.replace('<:', '')
							.replace('<a:', '')
							.match(/(:)([^:\s]+)(:)/gi)[1];

					emojiCalc(em);
				});
			} else emojiCalc(em);
		}

		async function emojiCalc(msg: string) {
			if (msg.startsWith('http')) {
				message.guild.emojis
					.create(msg, n, {
						reason: 'Stole an emoji using a bot.'
					})
					.then(async (emoji) => {
						const embed = new MessageEmbed()
							.setTitle(
								options.embed?.title
									.replaceAll('{name}', emoji.name)
									.replaceAll('{id}', emoji.id)
									.replaceAll('{url}', emoji.url) ||
									`Successfully added the emoji.\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``
							)
							.setThumbnail(emoji.url)
							.setColor(options.embed?.color || 0x075fff)
							.setFooter(
								options.embed?.credit
									? options.embed?.footer
									: {
											text: '©️ Simply Develop. npm i simply-djs',
											iconURL: 'https://i.imgur.com/u8VlLom.png'
									  }
							);

						if (interaction) {
							await int.followUp({
								content: 'Added the emoji :+1:',
								embeds: [embed],
								ephemeral: true
							});
						} else if (!interaction) {
							await ms.reply({
								content: 'Added the emoji :+1:',
								embeds: [embed]
							});
						}
					})
					.catch((err) =>
						message.channel.send({
							content: `Error occured: \`\`\`\n${err}\n\`\`\``
						})
					);
			} else {
				const hasEmoteRegex = /<a?:.+:\d+>/gm;
				const emoteRegex = /<:.+:(\d+)>/gm;
				const animatedEmoteRegex = /<a:.+:(\d+)>/gm;

				const emo = msg.match(hasEmoteRegex);

				let emoji: RegExpExecArray = emoteRegex.exec(emo?.toString());

				let anim: RegExpExecArray = animatedEmoteRegex.exec(emo?.toString());

				let url;
				if (emoji && !anim) {
					url = 'https://cdn.discordapp.com/emojis/' + emoji[1] + '.png?v=1';
				} else if (anim) {
					url = 'https://cdn.discordapp.com/emojis/' + emoji[1] + '.gif?v=1';
				}

				message.guild.emojis
					.create(url, n, {
						reason: 'Stole an emoji using a bot.'
					})
					.then(async (emoji) => {
						const embed = new MessageEmbed()
							.setTitle(
								options.embed?.title
									.replaceAll('{name}', emoji.name)
									.replaceAll('{id}', emoji.id)
									.replaceAll('{url}', emoji.url) ||
									`Successfully added the emoji.\n\nEmoji Name: \`${emoji.name}\`\nEmoji ID: \`${emoji.id}\``
							)
							.setThumbnail(emoji.url)
							.setColor(options.embed?.color || 0x075fff)
							.setFooter(
								options.embed?.credit
									? options.embed?.footer
									: {
											text: '©️ Simply Develop. npm i simply-djs',
											iconURL: 'https://i.imgur.com/u8VlLom.png'
									  }
							);

						if (interaction) {
							await int.followUp({
								content: 'Added the emoji :+1:',
								embeds: [embed],
								ephemeral: true
							});
						} else if (!interaction) {
							await ms.reply({
								content: 'Added the emoji :+1:',
								embeds: [embed]
							});
						}
					})
					.catch((err) =>
						message.channel.send({
							content: `Error occured: \`\`\`\n${err}\n\`\`\``
						})
					);
			}
		}
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta(
				'stealEmoji'
			)} | Error: ${err.stack}`
		);
	}
}
