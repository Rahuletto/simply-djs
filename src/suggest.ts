import {
	EmbedBuilder,
	EmbedBuilderAuthor,
	ColorResolvable,
	TextChannel,
	EmbedBuilderFooter,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Message,
	ComponentType
	User
} from 'discord.js';

import { SimplyError } from './Error/Error';
import chalk from 'chalk';
import db from './model/suggestion';
import { APIMessage } from 'discord-api-types/v10';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/CustomizableEmbed*
 */

interface CustomizableEmbed {
	author?: EmbedBuilderAuthor;
	title?: string;
	footer?: EmbedBuilderFooter;
	description?: string;
	color?: ColorResolvable;

	credit?: boolean;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/btnTemplate*
 */

interface btnTemplate {
	style?: ButtonStyle;
	emoji?: string;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/Systems/suggestSystem#suggestbuttons*
 */

interface suggestButtons {
	upvote?: btnTemplate;
	downvote?: btnTemplate;
}

export type suggestOption = {
	embed?: CustomizableEmbed;
	channelId?: string | TextChannel;
	suggestion?: string;
	buttons?: suggestButtons;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * An **Beautiful** suggestion system with buttons ;D | *Requires: [**manageSug()**](https://simplyd.js.org/docs/handler/manageSug)*
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/suggestSystem***
 * @example simplydjs.suggestSystem(interaction, { channelId: '1234567890123' })
 */

export async function suggestSystem(
	message: ExtendedMessage | ExtendedInteraction,
	options: suggestOption = {}
) {
	try {
		const { client } = message;
		let url;
		let suggestion: string;

		let interaction;
		if (message.commandId) {
			interaction = message as ExtendedInteraction;

			suggestion =
				options.suggestion || interaction.options.getString('suggestion');

			if (!suggestion)
				return interaction.followUp('Give me a suggestion to post.');
		} else if (!message.commandId) {
			const attachment = (message as Message).attachments?.first();

			url = attachment ? attachment.url : null;

			suggestion = options?.suggestion;

			if (url) {
				suggestion = suggestion + ' ' + url;
			}

			if (!options.suggestion) {
				const [...args] = (message as Message).content.split(/ +/g);
				suggestion = args.slice(1).join(' ');
			}

			if (suggestion === '' || !suggestion)
				return message.reply('Give me a suggestion to post.');
		}

		const channel = options?.channelId;

		if (!options.embed) {
			options.embed = {
				footer: {
					text: '©️ Simply Develop. npm i simply-djs',
					iconURL: 'https://i.imgur.com/u8VlLom.png'
				},
				color: '#075FFF',
				title: 'Giveaways',
				credit: true
			};
		}

		options.buttons = {
			upvote: {
				style: options.buttons?.upvote?.style || 'PRIMARY',
				emoji: options.buttons?.upvote?.emoji || '☑️'
			},
			downvote: {
				style: options.buttons?.downvote?.style || 'DANGER',
				emoji: options.buttons?.downvote?.emoji || '🇽'
			}
		};

		const ch =
			client.channels.cache.get(channel as string) || (channel as TextChannel);
		if (!ch)
			throw new SimplyError({
				name: `INVALID_CHID - ${channel} | The channel id you specified is not valid (or) The bot has no VIEW_CHANNEL permission.`,
				tip: 'Check the permissions (or) Try using another Channel ID'
			});

		const surebtn = new ButtonBuilder()
			.setStyle(ButtonStyle.Success)
			.setLabel('Yes')
			.setCustomId('send-sug');

		const nobtn = new ButtonBuilder()
			.setStyle(ButtonStyle.Danger)
			.setLabel('No')
			.setCustomId('nope-sug');

		const row1 = new ActionRowBuilder().addComponents([surebtn, nobtn]);

		const embedo = new EmbedBuilder()
			.setTitle('Are you sure ?')
			.setDescription(`Is this your suggestion ? \`${suggestion}\``)
			.setTimestamp()
			.setColor(options.embed.color || '#075FFF')
			.setFooter(
				options.embed?.credit
					? options.embed?.footer
					: {
							text: '©️ Simply Develop. npm i simply-djs',
							iconURL: 'https://i.imgur.com/u8VlLom.png'
					  }
			);

		let m: Message | APIMessage | void;

		if (interaction) {
			m = await interaction.followUp({
				embeds: [embedo],
				components: [row1],
				ephemeral: true
			});
		} else if (!interaction) {
			m = await message.reply({
				embeds: [embedo],
				components: [row1],
				ephemeral: true
			});
		}

		const filter = (m: any) =>
			m.user.id === (message.user ? message.user : message.author).id;
		const collect = (m as Message).createMessageComponentCollector({
			filter,
			max: 1,
			componentType: ComponentType.Button,
			time: 1000 * 15
		});

		collect.on('collect', async (b) => {
			if (b.customId === 'send-sug') {
				await b.reply({ content: 'Ok Suggested.', ephemeral: true });
				await (b.message as Message).delete();

				const emb = new EmbedBuilder()
					.setDescription(suggestion)
					.setAuthor({
						name: (message.member.user as User).tag,
						iconURL: (message.member.user as User).displayAvatarURL({
							dynamic: true
						})
					})
					.setColor(options.embed.color || '#075FFF')
					.setFooter(
						options.embed?.credit
							? options.embed?.footer
							: {
									text: '©️ Simply Develop. npm i simply-djs',
									iconURL: 'https://i.imgur.com/u8VlLom.png'
							  }
					)
					.addFields(
						{
							name: 'Status',
							value: `\`\`\`\nWaiting for the response..\n\`\`\``
						},
						{
							name: 'Percentage',
							value: `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛ [0% - 0%]`
						}
					);

				const approve = new ButtonBuilder()
					.setEmoji(options.buttons.upvote.emoji)
					.setLabel('0')
					.setStyle(options.buttons.upvote.style)
					.setCustomId('agree-sug');

				const no = new ButtonBuilder()
					.setEmoji(options.buttons.downvote.emoji)
					.setLabel('0')
					.setStyle(options.buttons.downvote.style)
					.setCustomId('no-sug');

				const row = new ActionRowBuilder().addComponents([approve, no]);

				await (ch as TextChannel)
					.send({ embeds: [emb], components: [row] })
					.then(async (ms) => {
						const cr = new db({
							message: ms.id,
							author: message.member.user.id
						});

						await cr.save();
					});
			} else if (b.customId === 'nope-sug') {
				(b.message as Message).delete();
			}
		});

		collect.on('end', async (b) => {
			if (b.size == 0) {
				(m as Message).edit({
					content: 'Timeout.. Cancelled the suggestion',
					embeds: [],
					components: []
				});
			}
		});
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta(
				'suggestSystem'
			)} | Error: ${err.stack}`
		);
	}
}
