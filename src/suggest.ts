import {
	EmbedBuilder,
	TextChannel,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Message,
	User,
	InteractionResponse,
	ComponentType
} from 'discord.js';

import { SimplyError } from './Error/Error';

import db from './model/suggestion';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';
import { CustomizableEmbed } from './interfaces/CustomizableEmbed';
import { MessageButtonStyle } from './Others/MessageButtonStyle';
import { ms } from './Others/ms';
import { toRgb } from './Others/toRgb';
import { Document as Doc } from 'mongoose';
/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/buttonTemplate*
 */

interface buttonTemplate {
	style?: ButtonStyle | 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK';
	emoji?: string;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/Systems/suggest#suggestbuttons*
 */

interface suggestButtons {
	upvote?: buttonTemplate;
	downvote?: buttonTemplate;
}

export type suggestOption = {
	embed?: CustomizableEmbed;
	channelId?: string | TextChannel;
	suggestion?: string;
	buttons?: suggestButtons;
	strict: boolean;
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

export async function suggest(
	message: ExtendedMessage | ExtendedInteraction,
	options: suggestOption = { strict: false }
) {
	try {
		const { client } = message;
		let url: string;
		let suggestion: string;

		let interaction: ExtendedInteraction;
		if (message.commandId || !message.content) {
			interaction = message as ExtendedInteraction;

			suggestion =
				options.suggestion ||
				String(interaction.options.get('suggestion').value);

			if (!suggestion)
				return interaction.followUp({
					content: 'Provide a suggestion to post.',
					ephemeral: true
				});
		} else if (!message.commandId && message.content) {
			const attachment = (message as Message).attachments?.first();

			url = attachment ? attachment.url : '';

			if (options.suggestion) suggestion = options?.suggestion;

			if (url) suggestion = suggestion + ' ' + url;

			if (!options.suggestion && (message as Message)) {
				const [...args] = (message as Message).content?.split(/ +/g);
				suggestion = args.slice(1).join(' ');
			}

			if (suggestion === '' || !suggestion)
				return message.reply({ content: 'Provide a suggestion to post.' });
		}

		if (!options.embed) {
			options.embed = {
				footer: {
					text: '©️ Rahuletto. npm i simply-djs',
					iconURL: 'https://i.imgur.com/XFUIwPh.png'
				},
				color: toRgb('#406DBC'),
				title: 'New Suggestion'
			};
		}

		options.buttons = {
			upvote: {
				style: options.buttons?.upvote?.style || ButtonStyle.Primary,
				emoji: options.buttons?.upvote?.emoji || '☑️'
			},
			downvote: {
				style: options.buttons?.downvote?.style || ButtonStyle.Danger,
				emoji: options.buttons?.downvote?.emoji || '🇽'
			}
		};

		if (options?.buttons?.upvote.style as string)
			options.buttons.upvote.style = MessageButtonStyle(
				options?.buttons?.upvote.style as string
			);
		if (options?.buttons?.downvote.style as string)
			options.buttons.downvote.style = MessageButtonStyle(
				options?.buttons?.downvote.style as string
			);

		const ch =
			client.channels.cache.get(options?.channelId as string) ||
			(options?.channelId as TextChannel);
		if (!ch) {
			if (options.strict)
				throw new SimplyError({
					function: 'suggest',
					title: `Invalid Channel (or) No VIEW_CHANNEL permission`,
					tip: `Check the permissions (or) Try using another Channel ID.\nReceived ${
						options.channelId || 'undefined'
					}`
				});
			else
				console.log(
					`SimplyError - suggest | Invalid Channel (or) No VIEW_CHANNEL permission\n\nCheck the permissions (or) Try using another Channel ID.\n Received ${
						options.channelId || 'undefined'
					}`
				);
		}

		const surebtn = new ButtonBuilder()
			.setStyle(ButtonStyle.Success)
			.setLabel('Suggest')
			.setCustomId('send-sug');

		const nobtn = new ButtonBuilder()
			.setStyle(ButtonStyle.Danger)
			.setLabel('Cancel')
			.setCustomId('nope-sug');

		const sendRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
			surebtn,
			nobtn
		]);

		const embed = new EmbedBuilder()
			.setTitle(options.embed.title || 'Are you sure ?')
			.setDescription(
				options.embed.description ||
					`Is this your suggestion ? \`${suggestion}\``
			)
			.setTimestamp()
			.setColor(options.embed?.color || toRgb('#406DBC'))
			.setFooter(
				options.embed?.footer
					? options.embed?.footer
					: {
							text: '©️ Rahuletto. npm i simply-djs',
							iconURL: 'https://i.imgur.com/XFUIwPh.png'
					  }
			);

		if (options.embed.fields) embed.setFields(options.embed.fields);
		if (options.embed.author) embed.setAuthor(options.embed.author);
		if (options.embed.image) embed.setImage(options.embed.image);
		if (options.embed.thumbnail) embed.setThumbnail(options.embed.thumbnail);
		if (options.embed.timestamp) embed.setTimestamp(options.embed.timestamp);
		if (options.embed?.title) embed.setTitle(options.embed?.title);
		if (options.embed?.url) embed.setURL(options.embed?.url);

		let m: Message | InteractionResponse;

		if (interaction) {
			m = await interaction.followUp({
				embeds: [embed],
				components: [sendRow],
				ephemeral: true
			});
		} else if (!interaction) {
			m = await message.reply({
				embeds: [embed],
				components: [sendRow]
			});
		}

		const filter = (m: any) =>
			m.user.id === (message.user ? message.user : message.author).id;
		const collector = (m as Message).createMessageComponentCollector({
			filter: filter,
			max: 1,
			componentType: ComponentType.Button,
			time: ms('15s') // 15 Seconds
		});

		collector.on('collect', async (b) => {
			if (b.customId === 'send-sug') {
				await b.reply({ content: 'Ok, Posted. :+1:', ephemeral: true });
				await (b.message as Message).delete();

				const suggestEmb = new EmbedBuilder()
					.setDescription(suggestion)
					.setAuthor({
						name: (message.member.user as User).tag,
						iconURL: (message.member.user as User).displayAvatarURL({
							forceStatic: false
						})
					})
					.setColor(options.embed?.color || toRgb('#406DBC'))
					.setFooter(
						options.embed?.footer
							? options.embed?.footer
							: {
									text: '©️ Rahuletto. npm i simply-djs',
									iconURL: 'https://i.imgur.com/XFUIwPh.png'
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
					.setEmoji(options.buttons?.upvote?.emoji)
					.setLabel('0')
					.setStyle(
						(options.buttons?.upvote?.style as ButtonStyle) ||
							ButtonStyle.Primary
					)
					.setCustomId('agree-sug');

				const no = new ButtonBuilder()
					.setEmoji(options.buttons?.downvote?.emoji)
					.setLabel('0')
					.setStyle(
						(options.buttons?.downvote?.style as ButtonStyle) ||
							ButtonStyle.Danger
					)
					.setCustomId('no-sug');

				const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
					approve,
					no
				]);

				await (ch as TextChannel)
					.send({ embeds: [suggestEmb], components: [row] })
					.then(async (ms) => {
						const database: Doc = new db({
							message: ms.id,
							author: message.member.user.id
						});

						await database.save();
					});
			} else if (b.customId === 'nope-sug') {
				(b.message as Message).delete();
			}
		});

		collector.on('end', async (b) => {
			if (b.size == 0) {
				(m as Message).edit({
					content: "Timeout.. Didn't post the suggestion.",
					embeds: [],
					components: []
				});
			}
		});
	} catch (err: any) {
		if (options.strict)
			throw new SimplyError({
				function: 'suggest',
				title: 'An Error occured when running the function',
				tip: err.stack
			});
		else console.log(`SimplyError - suggest | Error: ${err.stack}`);
	}
}
