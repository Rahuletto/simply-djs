import {
	ButtonStyle,
	GuildTextBasedChannel,
	Guild,
	Message,
	PermissionFlagsBits,
	Role,
	TextChannel,
	ButtonBuilder,
	ActionRowBuilder,
	Invite,
	Collection,
	EmbedBuilder
} from 'discord.js';
import {
	ExtendedInteraction,
	ExtendedMessage,
	CustomizableEmbed,
	buttonTemplate
} from './interfaces';

import model from './model/giveaway';
import { MessageButtonStyle, ms, toRgb } from './misc';
import { SimplyError } from './error';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

interface Requirement {
	type: 'Role' | 'Guild' | 'None';
	id: string;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/Buttons/giveawaybuttons*
 */

interface giveawayButtons {
	enter?: buttonTemplate;
	end?: buttonTemplate;
	reroll?: buttonTemplate;
}

export type giveawayOptions = {
	prize?: string;
	winners?: number;
	channel?: GuildTextBasedChannel | TextChannel;
	time?: string;

	buttons?: giveawayButtons;

	manager?: Role | string;

	requirements?: Requirement;
	pingRole?: Role | string;

	embed?: CustomizableEmbed;

	type?: 'Label' | 'Emoji' | 'Both';
	strict?: boolean;
};

export interface GiveawayResolve {
	message: Message;
	winners: number;
	prize: string;
	endsAt: number;
	requirements: { type: 'None' | 'Role' | 'Guild'; value: Guild | Role };
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A **Powerful** yet simple giveaway system | *Required: **manageGiveaway()***
 * @param msgOrint
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/givewaySystem***
 * @example simplydjs.giveawaySystem(client, message)
 */

export async function giveaway(
	msgOrint: ExtendedMessage | ExtendedInteraction,
	options: giveawayOptions = {}
): Promise<GiveawayResolve> {
	return new Promise(async (resolve) => {
		try {
			const { client } = msgOrint;

			let interaction: ExtendedInteraction;
			if (msgOrint.commandId) {
				interaction = msgOrint as ExtendedInteraction;
			}
			const extInteraction = msgOrint as ExtendedInteraction;
			const extMessage = msgOrint as ExtendedMessage;

			const timeStart: number = Date.now();

			let manager: Role;

			if (options?.manager as Role) manager = options.manager as Role;
			else if (options?.manager as string)
				manager = await msgOrint.member.roles.cache.find(
					(r: Role) => r.id === (options.manager as string)
				);

			if (
				!(
					manager ||
					msgOrint?.member?.permissions?.has(
						PermissionFlagsBits.ManageEvents
					) ||
					msgOrint?.member?.permissions?.has(PermissionFlagsBits.ManageGuild) ||
					msgOrint?.member?.permissions?.has(PermissionFlagsBits.Administrator)
				)
			) {
				return msgOrint.channel.send({
					content:
						'You must have • `Administrator` (or) `Manage Guild` (or) `Manage Events` Permission or • Giveaway Manager Role'
				});
			}

			options.winners ??= 1;

			options.buttons = {
				enter: {
					style: options.buttons?.enter?.style || ButtonStyle.Success,
					label: options.buttons?.enter?.label || '0',
					emoji: options.buttons?.enter?.emoji || '🎁'
				},
				end: {
					style: options.buttons?.end?.style || ButtonStyle.Danger,
					label: options.buttons?.end?.label || 'End',
					emoji: options.buttons?.end?.emoji || '⛔'
				},
				reroll: {
					style: options.buttons?.end?.style || ButtonStyle.Primary,
					label: options.buttons?.end?.label || 'Reroll',
					emoji: options.buttons?.end?.emoji || '🔁'
				}
			};

			if (!options.embed) {
				options.embed = {
					footer: {
						text: '©️ Rahuletto. npm i simply-djs',
						iconURL: 'https://i.imgur.com/XFUIwPh.png'
					},
					color: toRgb('#406DBC'),
					title: 'Giveaway !'
				};
			}

			let channel: TextChannel;
			let time: string;
			let winners: number;
			let prize: string;
			let requirements: {
				type: 'None' | 'Role' | 'Guild';
				value: Role | Guild | null;
			} = { type: 'None', value: null };

			let content = '** **';

			if (options?.pingRole as Role)
				content = (options.pingRole as Role).toString();
			else if (options?.pingRole as string)
				content = (
					await msgOrint.member.roles.cache.find(
						(r: Role) => r.id === (options.pingRole as string)
					)
				).toString();

			if (options?.requirements?.type === 'Role') {
				const role = await msgOrint.guild.roles.fetch(
					options.requirements?.id,
					{
						force: true
					}
				);

				requirements = { type: 'Role', value: role };
			} else if (options?.requirements?.type === 'Guild') {
				const guild = await client.guilds.cache.get(options.requirements?.id);

				if (!guild)
					return extMessage.channel.send({
						content:
							'Please add me to that server so i can set the requirement.'
					});

				requirements = { type: 'Guild', value: guild };
			}

			if (interaction) {
				channel =
					(options.channel as TextChannel) ||
					(extInteraction.options.get('channel').channel as TextChannel) ||
					(interaction.channel as TextChannel);
				time =
					options.time ||
					extInteraction.options.get('time').value.toString() ||
					'1h';
				winners =
					options.winners ||
					Number(extInteraction.options.get('winners').value);
				prize =
					options.prize || extInteraction.options.get('prize').value.toString();
			} else if (!interaction) {
				const [...args] = extMessage.content.split(/ +/g);

				if (!Number(args[2]))
					return extMessage.reply({
						content: 'Please provide a number for winners argument'
					});

				channel =
					(options.channel as TextChannel) ||
					(extMessage.mentions.channels.first() as TextChannel) ||
					(extMessage.channel as TextChannel);
				time = options.time || args[1] || '1h';
				winners = Number(args[2]) || options.winners;
				prize = options.prize || args.slice(3).join(' ');
			}

			if (options?.buttons?.enter?.style as string)
				options.buttons.enter.style = MessageButtonStyle(
					options.buttons?.enter?.style as string
				);

			if (options?.buttons?.end?.style as string)
				options.buttons.end.style = MessageButtonStyle(
					options.buttons?.end?.style as string
				);

			if (options?.buttons?.reroll?.style as string)
				options.buttons.reroll.style = MessageButtonStyle(
					options.buttons?.reroll?.style as string
				);

			const enter = new ButtonBuilder()
				.setCustomId('enter_giveaway')
				.setStyle(
					(options.buttons?.enter?.style as ButtonStyle) || ButtonStyle.Primary
				);

			if (options?.type === 'Emoji')
				enter.setEmoji(options.buttons?.enter?.emoji || '🎁');
			else if (options?.type === 'Label')
				enter.setLabel(options.buttons?.enter?.label || '0');
			else {
				enter
					.setEmoji(options.buttons?.enter?.emoji || '🎁')
					.setLabel(options.buttons?.enter?.label || '0');
			}

			const end = new ButtonBuilder()
				.setCustomId('end_giveaway')
				.setStyle(
					(options.buttons?.end?.style as ButtonStyle) || ButtonStyle.Danger
				);

			if (options?.type === 'Emoji')
				end.setEmoji(options.buttons?.end?.emoji || '⛔');
			else if (options?.type === 'Label')
				end.setLabel(options.buttons?.end?.label || 'End');
			else {
				enter
					.setEmoji(options.buttons?.end?.emoji || '⛔')
					.setLabel(options.buttons?.end?.label || 'End');
			}

			const reroll = new ButtonBuilder()
				.setCustomId('reroll_giveaway')
				.setStyle(
					(options.buttons?.reroll?.style as ButtonStyle) || ButtonStyle.Success
				)
				.setDisabled(true);

			if (options?.type === 'Emoji')
				reroll.setEmoji(options.buttons?.reroll?.emoji || '🔁');
			else if (options?.type === 'Label')
				reroll.setLabel(options.buttons?.reroll?.label || 'Reroll');
			else {
				reroll
					.setEmoji(options.buttons?.reroll?.emoji || '🔁')
					.setLabel(options.buttons?.reroll?.label || 'Reroll');
			}

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
				enter,
				reroll,
				end
			]);

			const timeInMS = ms(time);

			const endTime = Number((Date.now() + timeInMS).toString().slice(0, -3));

			options.embed.fields = options?.embed?.fields || [
				{
					name: 'Prize',
					value: `{prize}`
				},
				{
					name: 'Hosted By',
					value: `{hosted}`,
					inline: true
				},
				{
					name: 'Ends at',
					value: `{endsAt}`,
					inline: true
				},
				{ name: 'Winner(s)', value: `{winCount}`, inline: true },
				{
					name: 'Requirements',
					value: `{requirements}`
				}
			];

			let guildInvite: string;
			if (requirements.type == 'Guild') {
				await (requirements.value as Guild).invites
					.fetch()
					.then((a: Collection<string, Invite>) => {
						guildInvite = `https://discord.gg/${a.first()}`;
					});
			}

			function replacer(str: string) {
				return str
					.replaceAll('{hosted}', `<@${msgOrint.member.user.id}>`)
					.replaceAll('{endsAt}', `<t:${endTime}:f>`)
					.replaceAll('{prize}', prize)
					.replaceAll(
						'{requirements}',
						requirements.type === 'None'
							? 'None'
							: requirements.type +
									' | ' +
									(requirements.type === 'Guild'
										? `${guildInvite}`
										: `${requirements.value}`)
					)
					.replaceAll('{winCount}', winners.toString())
					.replaceAll('{entered}', '0');
			}

			options.embed?.fields?.forEach((a) => {
				a.value = replacer(a?.value);
			});

			const embed = new EmbedBuilder()
				.setTitle(replacer(options?.embed?.title || 'Giveaway Time !'))
				.setColor(options?.embed?.color || toRgb('#406DBC'))
				.setTimestamp(Number(Date.now() + timeInMS))
				.setFooter(
					options?.embed?.footer
						? options?.embed?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				)
				.setDescription(
					replacer(
						options?.embed?.description ||
							`Interact with the giveaway using the buttons below.`
					)
				)
				.setFields(options?.embed?.fields);

			if (options?.embed?.author) embed.setAuthor(options.embed?.author);
			if (options?.embed?.image) embed.setImage(options.embed?.image);
			if (options?.embed?.thumbnail)
				embed.setThumbnail(options.embed?.thumbnail);
			if (options?.embed?.timestamp)
				embed.setTimestamp(options.embed?.timestamp);
			if (options?.embed?.title) embed.setTitle(options.embed?.title);
			if (options?.embed?.url) embed.setURL(options.embed?.url);

			await channel
				.send({ content: content, embeds: [embed], components: [row] })
				.then(async (msg: Message) => {
					resolve({
						message: msg,
						winners: winners,
						prize: prize,
						endsAt: endTime,
						requirements: requirements
					});

					const link = new ButtonBuilder()
						.setLabel('View Giveaway.')
						.setStyle(ButtonStyle.Link)
						.setURL(msg.url);

					const linkRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
						link
					]);

					if (interaction) {
						await extInteraction.followUp({
							content: 'Giveaway has started.',
							components: [linkRow]
						});
					} else
						await extMessage.channel.send({
							content: 'Giveaway has started.',
							components: [linkRow]
						});

					const end = Number(Date.now() + timeInMS);

					const createDb = new model({
						message: msg.id,
						entered: 0,
						winCount: winners,
						desc: options.embed?.description || null,
						requirements: {
							type:
								requirements.type === 'None'
									? 'none'
									: requirements.type.toLowerCase(),
							id: requirements.value.id
						},
						started: timeStart,
						prize: prize,
						entry: [],
						endTime: end,
						host: msgOrint.member.user.id
					});

					await createDb.save();
				});
		} catch (err: any) {
			if (options?.strict)
				throw new SimplyError({
					function: 'giveaway',
					title: 'An Error occured when running the function ',
					tip: err.stack
				});
			else console.log(`SimplyError - giveaway | Error: ${err.stack}`);
		}
	});
}
