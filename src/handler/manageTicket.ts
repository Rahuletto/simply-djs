import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	CategoryChannel,
	ChannelType,
	EmbedBuilder,
	GuildMember,
	Message,
	OverwriteResolvable,
	PermissionFlagsBits,
	Role,
	TextChannel,
	User
} from 'discord.js';
import { buttonTemplate, CustomizableEmbed } from '../typedef';

import { MessageButtonStyle, toRgb, ms } from '../misc';

import { SimplyError } from '../error';

// ------------------------------
// ----- I N T E R F A C E ------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/Handler/manageTicket#ticketbuttons*
 */

interface ticketButtons {
	close: buttonTemplate;
	reopen: buttonTemplate;
	delete: buttonTemplate;
	transcript: buttonTemplate;
}

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

export type manageTicketOptions = {
	ticketname?: string;
	buttons?: ticketButtons;
	pingRoles?: Role[] | string[];
	category?: string;
	embed?: CustomizableEmbed;

	logChannelId?: string;
	strict?: boolean;
};

// ------------------------------
// ------- P R O M I S E --------
// ------------------------------

export type DeleteResolve = {
	type?: 'Delete';
	channelId?: string;
	user?: User;
	data?: AttachmentBuilder;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A Ticket Handler for **simplydjs ticket system.**
 * @param interaction
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Handler/manageTicket***
 * @example simplydjs.manageTicket(interaction)
 */

export async function manageTicket(
	interaction: ButtonInteraction,
	options: manageTicketOptions = {}
): Promise<DeleteResolve> {
	return new Promise(async (resolve) => {
		const { client } = interaction;

		if (interaction.isButton()) {
			try {
				const member = interaction.member as GuildMember;

				// ------------------------------
				// ---- T I C K E T - S Y S -----
				// ------------------------------
				if (interaction.customId === 'create_ticket') {
					await interaction.deferReply({ ephemeral: true });

					let name = options?.ticketname || `ticket_{tag}`;

					name = name
						.replaceAll('{username}', member.user.username)
						.replaceAll('{tag}', (member.user as User).tag)
						.replaceAll('{id}', member.user.id);

					const topic = `Ticket has been opened by <@${member.user.id}>`;

					const existing = interaction.guild.channels.cache.find(
						(ch) => (ch as TextChannel).topic === topic
					);

					if (existing) {
						await interaction.editReply({
							content: `You have an existing ticket opened (${existing.toString()}). Close it before creating a new one.`
						});
					} else if (!existing) {
						let chparent: CategoryChannel | null;

						const category = interaction.guild.channels.cache.get(
							options?.category
						);

						if (!category) {
							chparent = null;
						}

						chparent = category as CategoryChannel;

						const pingRolePermissions: OverwriteResolvable[] = [];
						const roles: (Role | string)[] = [];

						options?.pingRoles?.forEach((r) => {
							roles.push(r);

							pingRolePermissions.push({
								id: r,
								allow: [
									PermissionFlagsBits.ViewChannel,
									PermissionFlagsBits.SendMessages,
									PermissionFlagsBits.ReadMessageHistory
								]
							});
						});

						const channel = await interaction.guild.channels.create({
							name: name,
							type: ChannelType.GuildText,
							topic: topic,
							parent: chparent,
							nsfw: false,
							permissionOverwrites: [
								...pingRolePermissions,
								{
									id: interaction.guild.roles.everyone,
									deny: [
										PermissionFlagsBits.ViewChannel,
										PermissionFlagsBits.SendMessages,
										PermissionFlagsBits.ReadMessageHistory
									] //Deny permissions
								},
								{
									id: client.user.id,
									allow: [
										PermissionFlagsBits.ViewChannel,
										PermissionFlagsBits.SendMessages,
										PermissionFlagsBits.ReadMessageHistory
									]
								},
								{
									id: member,
									allow: [
										PermissionFlagsBits.ViewChannel,
										PermissionFlagsBits.SendMessages,
										PermissionFlagsBits.ReadMessageHistory
									]
								}
							]
						});

						await interaction.editReply({
							content: `🎫 Opened your support ticket in ${channel.toString()}.`
						});

						const embed = new EmbedBuilder()
							.setTitle(options?.embed?.title || 'Ticket Created')
							.setDescription(
								(
									options?.embed?.description ||
									`Ticket has been raised by {user}. The support will reach you shortly.\n\n**User ID**: \`{id}\` | **User Tag**: \`{tag}\``
								)
									.replaceAll('{user}', member.user.toString())
									.replaceAll('{tag}', (member.user as User).tag)
									.replaceAll('{id}', member.user.id)
									.replaceAll('{guild}', interaction.guild.name)
							)
							.setThumbnail(
								options.embed?.thumbnail || interaction.guild.iconURL()
							)
							.setTimestamp()
							.setColor(options?.embed?.color || toRgb('#406DBC'))
							.setFooter(
								options?.embed?.footer
									? options?.embed?.footer
									: {
											text: '©️ Rahuletto. npm i simply-djs',
											iconURL: 'https://i.imgur.com/XFUIwPh.png'
									  }
							);

						if (options?.embed?.fields) embed.setFields(options?.embed?.fields);
						if (options?.embed?.author) embed.setAuthor(options?.embed?.author);
						if (options?.embed?.image) embed.setImage(options?.embed?.image);
						if (options?.embed?.thumbnail)
							embed.setThumbnail(options?.embed?.thumbnail);
						if (options?.embed?.timestamp)
							embed.setTimestamp(options?.embed?.timestamp);
						if (options?.embed?.title) embed.setTitle(options?.embed?.title);
						if (options?.embed?.url) embed.setURL(options?.embed?.url);

						if (options?.buttons?.close?.style as string)
							options.buttons.close.style = MessageButtonStyle(
								options?.buttons?.close?.style as string
							);

						if (options?.buttons?.reopen?.style as string)
							options.buttons.reopen.style = MessageButtonStyle(
								options?.buttons?.reopen?.style as string
							);

						if (options?.buttons?.delete?.style as string)
							options.buttons.delete.style = MessageButtonStyle(
								options?.buttons?.delete?.style as string
							);

						if (options?.buttons?.transcript?.style as string)
							options.buttons.transcript.style = MessageButtonStyle(
								options?.buttons?.transcript?.style as string
							);

						const close = new ButtonBuilder()
							.setStyle(
								(options?.buttons?.close?.style as ButtonStyle) ||
									ButtonStyle.Danger
							)
							.setEmoji(options?.buttons?.close?.emoji || '🔒')
							.setLabel(options?.buttons?.close?.label || 'Close')
							.setCustomId('close_ticket');

						const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
							close
						]);

						channel
							.send({
								content: `Here is your ticket ${member.user.toString()}. | ${roles.join(
									','
								)}`,
								embeds: [embed],
								components: [row]
							})
							.then(async (msg) => {
								await msg.pin();
							});
					}
				} else if (interaction.customId === 'close_ticket') {
					await interaction.reply({
						content: 'Locking the channel.',
						ephemeral: true
					});

					(interaction.channel as TextChannel).permissionOverwrites
						.edit(member, {
							SendMessages: false
						})
						.catch(() => {});

					const deleteBtn = new ButtonBuilder()
						.setStyle(
							(options?.buttons?.delete?.style as ButtonStyle) ||
								ButtonStyle.Danger
						)
						.setEmoji(options?.buttons?.delete?.emoji || '❌')
						.setLabel(options?.buttons?.delete?.label || 'Delete')
						.setCustomId('delete_ticket');

					const reopenBtn = new ButtonBuilder()
						.setStyle(
							(options?.buttons?.reopen?.style as ButtonStyle) ||
								ButtonStyle.Success
						)
						.setEmoji(options?.buttons?.reopen?.emoji || '🔓')
						.setLabel(options?.buttons?.delete?.label || 'Reopen')
						.setCustomId('open_ticket');

					const transcriptBtn = new ButtonBuilder()
						.setStyle(
							(options?.buttons?.transcript?.style as ButtonStyle) ||
								ButtonStyle.Primary
						)
						.setEmoji(options?.buttons?.transcript?.emoji || '📜')
						.setLabel(options?.buttons?.transcript?.label || 'Transcript')
						.setCustomId('tr_ticket');

					const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
						reopenBtn,
						deleteBtn,
						transcriptBtn
					]);

					await interaction.message.edit({
						components: [row]
					});
				} else if (interaction.customId === 'tr_ticket') {
					await interaction.deferReply({ ephemeral: true });

					let messages = await interaction.channel.messages.fetch({
						limit: 100
					});

					messages = messages.sort(
						(a: Message, b: Message) => a.createdTimestamp - b.createdTimestamp
					);

					const response: string[] = [];

					messages.forEach((m: Message) => {
						if (m.author.bot) return;

						const attachment = m.attachments.first();
						const url = attachment ? attachment.url : null;
						if (url !== null) {
							m.content = url;
						}

						response.push(
							`${m.author.username} (ID: ${m.author.id}) => ${m.content}`
						);
					});

					await interaction.editReply({
						content: 'Collecting messages to create logs'
					});

					let user: GuildMember | string = (
						interaction.channel as TextChannel
					).topic
						.replace(`Ticket has been opened by <@`, '')
						.replace('>', '');

					user = await interaction.guild.members.fetch(user);

					const attach = new AttachmentBuilder(
						Buffer.from(response.join(`\n`), 'utf-8'),
						{
							name: `${(user.user as User).tag}.txt`
						}
					);

					setTimeout(async () => {
						await interaction.followUp({
							content: 'Done. Generated the logs',
							files: [attach],
							embeds: [],
							ephemeral: false
						});
					}, ms('3s'));
				} else if (interaction.customId === 'delete_ticket') {
					await interaction.deferReply({ ephemeral: false });

					const del = new ButtonBuilder()
						.setCustomId('yes_delete')
						.setLabel('Delete')
						.setStyle(ButtonStyle.Danger);

					const cancel = new ButtonBuilder()
						.setCustomId('cancel')
						.setLabel('Cancel')
						.setStyle(ButtonStyle.Success);

					const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
						del,
						cancel
					]);

					interaction.editReply({
						content: 'Are you sure ?? This process is not reversible !',
						components: [row]
					});
				} else if (interaction.customId === 'yes_delete') {
					await interaction.message.edit({
						content: 'Deleting the channel..',
						embeds: [],
						components: []
					});

					let messages = await interaction.channel.messages.fetch({
						limit: 100
					});
					const response: string[] = [];

					messages = messages.sort(
						(a: Message, b: Message) => a.createdTimestamp - b.createdTimestamp
					);

					messages.forEach((m: Message) => {
						if (m.author.bot) return;

						const attachment = m.attachments.first();
						const url = attachment ? attachment.url : null;
						if (url !== null) {
							m.content = url;
						}

						response.push(
							`${m.author.username} (ID: ${m.author.id}) => ${m.content}`
						);
					});

					let user: GuildMember | string = (
						interaction.channel as TextChannel
					).topic
						.replace(`Ticket has been opened by <@`, '')
						.replace('>', '');

					user = await interaction.guild.members.fetch(user);

					const attach = new AttachmentBuilder(
						Buffer.from(response.join(`\n`), 'utf-8'),
						{
							name: `${(user.user as User).tag}.txt`
						}
					);

					resolve({
						type: 'Delete',
						channelId: interaction.channel.id,
						user: user.user,
						data: attach
					});

					if (options?.logChannelId) {
						let ch = await client.channels.cache.get(options?.logChannelId);

						if (ch) {
							const log = new EmbedBuilder()
								.setTitle('Ticket deleted')
								.setDescription(
									`Ticket with the name: \`${interaction.channel.name}\` got deleted. Opened by: ${user.user}.`
								)
								.setTimestamp()
								.setColor('Red');

							await (ch as TextChannel).send({
								embeds: [log],
								files: [attach]
							});
						} else return;
					}

					setTimeout(async () => {
						await interaction.channel.delete();
					}, ms('5s'));
				} else if (interaction.customId === 'cancel') {
					await interaction.deferUpdate();

					interaction.message.edit({
						content: 'You cancelled to delete',
						components: []
					});
				} else if (interaction.customId === 'open_ticket') {
					await interaction.reply({
						content: 'Unlocking the channel.',
						ephemeral: true
					});

					(interaction.channel as TextChannel).permissionOverwrites
						.edit(member, {
							SendMessages: true
						})
						.catch(() => {});

					const close = new ButtonBuilder()
						.setStyle(
							(options?.buttons?.close?.style as ButtonStyle) ||
								ButtonStyle.Danger
						)
						.setEmoji(options?.buttons?.close?.emoji || '🔒')
						.setLabel(options?.buttons?.close?.label || 'Close')
						.setCustomId('close_ticket');

					const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
						close
					]);

					(interaction.message as Message).edit({ components: [row] });
				}
			} catch (err: any) {
				if (options?.strict)
					throw new SimplyError({
						function: 'manageTicket',
						title: 'An Error occured when running the function ',
						tip: err.stack
					});
				else console.log(`SimplyError - manageTicket | Error: ${err.stack}`);
			}
		} else return;
	});
}
