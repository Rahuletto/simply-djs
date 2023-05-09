import {
	MessageEmbed,
	Message,
	MessageEmbedFooter,
	MessageEmbedAuthor,
	ColorResolvable,
	MessageActionRow,
	MessageButton,
	Client,
	MessageButtonStyle,
	Role,
	Permissions,
	EmbedFieldData
} from 'discord.js';
import { ExtendedInteraction, ExtendedMessage } from './interfaces';

import model from './model/gSys';
import { toRgb } from './Others/toRgb';

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

interface requirement {
	type: 'Role' | 'Guild' | 'None';
	id: string;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/btnTemplate*
 */

interface btnTemplate {
	style?: MessageButtonStyle;
	label?: string;
	emoji?: string;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/Buttons/giveawaySystem*
 */

interface gSysButtons {
	enter?: btnTemplate;
	end?: btnTemplate;
	reroll?: btnTemplate;
}

export type giveawayOptions = {
	prize?: string;
	winners?: string | number;
	channel?: MessageChannel;
	time?: string;

	buttons?: gSysButtons;

	manager?: Role | string;

	req?: requirement;
	ping?: string;

	embed?: CustomizableEmbed;
	fields?: EmbedFieldData[];

	disable?: 'Label' | 'Emoji';
};

interface returns {
	message: string;
	winners: number;
	prize: string;
	endsAt: number;
	req: string;
}

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A **Powerful** yet simple giveawaySystem | *Required: **manageBtn()***
 * @param client
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/givewaySystem***
 * @example simplydjs.giveawaySystem(client, message)
 */

export async function giveawaySystem(
	client: Client,
	message: ExtendedMessage | ExtendedInteraction,
	options: giveawayOptions = {}
): Promise<returns> {
	return new Promise(async (resolve) => {
		try {
			let interaction: any;
			if (message.commandId) {
				interaction = message;
			}
			const timeStart: number = Date.now();
			const int = message as ExtendedInteraction;
			const mes = message as Message;

			let roly;

			if (options.manager as Role)
				roly = await message.member.roles.cache.find(
					(r: Role) => r.id === (options.manager as Role).id
				);
			else if (options.manager as string)
				roly = await message.member.roles.cache.find(
					(r: Role) => r.id === (options.manager as string)
				);

			if (
				!(
					roly ||
					message?.member?.permissions?.has(Permissions.FLAGS.ADMINISTRATOR)
				)
			) {
				return message.channel.send({
					content:
						'You Must Have • Administrator Permission (or) • Giveaway Manager Role'
				});
			}

			options.winners ??= 1;

			options.buttons = {
				enter: {
					style: options.buttons?.enter?.style || 'SUCCESS',
					label: options.buttons?.enter?.label || '0',
					emoji: options.buttons?.enter?.emoji || '🎁'
				},
				end: {
					style: options.buttons?.end?.style || 'DANGER',
					label: options.buttons?.end?.label || 'End',
					emoji: options.buttons?.end?.emoji || '⛔'
				},
				reroll: {
					style: options.buttons?.end?.style || 'PRIMARY',
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
					title: 'Giveaways'
				};
			}

			let ch;
			let time: any;
			let winners: any;
			let prize: any;
			let req = 'None';
			let gid: string;

			let content = '** **';

			if (options.ping) {
				content = message.guild.roles
					.fetch(options.ping, { force: true })
					.toString();
			}
			let val: any;

			if (options.req?.type === 'Role') {
				val = await message.guild.roles.fetch(options.req?.id, {
					force: true
				});

				req = 'Role';
			} else if (options.req?.type === 'Guild') {
				val = client.guilds.cache.get(options.req?.id);

				if (!val)
					return message.channel.send({
						content:
							'Please add me to that server so i can set the requirement.'
					});
				gid = val.id;

				await val.invites.fetch().then((a: any) => {
					val = `[${val.name}](https://discord.gg/${a.first()})`;
				});
				req = 'Guild';
			}

			if (interaction) {
				ch =
					options.channel ||
					int.options.getChannel('channel') ||
					interaction.channel;
				time = options.time || int.options.getString('time') || '1h';
				winners = options.winners || int.options.getNumber('winners');
				prize = options.prize || int.options.getString('prize');
			} else if (!interaction) {
				const [...args] = mes.content.split(/ +/g);

				ch =
					options.channel ||
					// @ts-ignore
					message.mentions.channels.first() ||
					message.channel;
				time = options.time || args[1] || '1h';
				winners = args[2] || options.winners;
				prize = options.prize || args.slice(3).join(' ');
			}

			const enter = new MessageButton()
				.setCustomId('enter_giveaway')
				.setStyle(options.buttons?.enter?.style || 'SUCCESS');

			if (options.disable === 'Label')
				enter.setEmoji(options.buttons?.enter?.emoji || '🎁');
			else if (options.disable === 'Emoji')
				enter.setLabel(options.buttons?.enter?.label || '0');
			else {
				enter
					.setEmoji(options.buttons?.enter?.emoji || '🎁')
					.setLabel(options.buttons?.enter?.label || '0');
			}

			const end = new MessageButton()
				.setCustomId('end_giveaway')
				.setStyle(options.buttons?.end?.style || 'DANGER');

			if (options.disable === 'Label')
				end.setEmoji(options.buttons?.end?.emoji || '⛔');
			else if (options.disable === 'Emoji')
				end.setLabel(options.buttons?.end?.label || 'End');
			else {
				end
					.setEmoji(options.buttons?.end?.emoji || '⛔')
					.setLabel(options.buttons?.end?.label || 'End');
			}

			const reroll = new MessageButton()
				.setCustomId('reroll_giveaway')
				.setStyle(options.buttons?.reroll?.style || 'SUCCESS')
				.setDisabled(true);

			if (options.disable === 'Label')
				reroll.setEmoji(options.buttons?.reroll?.emoji || '🔁');
			else if (options.disable === 'Emoji')
				reroll.setLabel(options.buttons?.reroll?.label || 'Reroll');
			else {
				reroll
					.setEmoji(options.buttons?.reroll?.emoji || '🔁')
					.setLabel(options.buttons?.reroll?.label || 'Reroll');
			}

			const row = new MessageActionRow().addComponents([enter, reroll, end]);

			time = ms(time);

			const endtime = Number((Date.now() + time).toString().slice(0, -3));

			options.fields = options.fields || [
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

			options.fields?.forEach((a) => {
				a.value = a?.value
					.replaceAll('{hosted}', `<@${message.member.user.id}>`)
					.replaceAll('{endsAt}', `<t:${endtime}:f>`)
					.replaceAll('{prize}', prize)
					.replaceAll(
						'{requirements}',
						req === 'None'
							? 'None'
							: req + ' | ' + (req === 'Role' ? `${val}` : val)
					)
					.replaceAll('{winCount}', winners)
					.replaceAll('{entered}', '0');
			});

			const embed = new MessageEmbed()
				.setTitle(
					(options.embed?.title || 'Giveaway')
						.replaceAll('{hosted}', `<@${message.member.user.id}>`)
						.replaceAll('{prize}', prize)
						.replaceAll('{endsAt}', `<t:${endtime}:R>`)
						.replaceAll(
							'{requirements}',
							req === 'None'
								? 'None'
								: req + ' | ' + (req === 'Role' ? `${val}` : val)
						)
						.replaceAll('{winCount}', winners)
						.replaceAll('{entered}', '0') || prize
				)
				.setColor(options.embed?.color || toRgb('#406DBC'))
				.setTimestamp(Number(Date.now() + time))
				.setFooter(
					options.embed?.credit === false
						? options.embed?.footer
						: {
								text: '©️ Rahuletto. npm i simply-djs',
								iconURL: 'https://i.imgur.com/XFUIwPh.png'
						  }
				)
				.setDescription(
					(
						options.embed?.description ||
						`Interact with the giveaway using the buttons.`
					)
						.replaceAll('{hosted}', `<@${message.member.user.id}>`)
						.replaceAll('{prize}', prize)
						.replaceAll('{endsAt}', `<t:${endtime}:R>`)
						.replaceAll(
							'{requirements}',
							req === 'None'
								? 'None'
								: req + ' | ' + (req === 'Role' ? `${val}` : val)
						)
						.replaceAll('{winCount}', winners)
						.replaceAll('{entered}', '0')
				)
				.addFields(options.fields);

			await ch
				.send({ content: content, embeds: [embed], components: [row] })
				.then(async (msg: Message) => {
					resolve({
						message: msg.id,
						winners: winners,
						prize: prize,
						endsAt: endtime,
						req:
							req === 'None'
								? 'None'
								: req + ' | ' + (req === 'Role' ? val : gid)
					});

					const link = new MessageButton()
						.setLabel('View Giveaway.')
						.setStyle('LINK')
						.setURL(msg.url);

					const rowew = new MessageActionRow().addComponents([link]);

					if (int && interaction) {
						await int.followUp({
							content: 'Giveaway has started.',
							components: [rowew]
						});
					} else
						await message.channel.send({
							content: 'Giveaway has started.',
							components: [rowew]
						});

					const tim = Number(Date.now() + time);

					const crete = new model({
						message: msg.id,
						entered: 0,
						winCount: winners,
						desc: options.embed?.description || null,
						requirements: {
							type: req === 'None' ? 'none' : req.toLowerCase(),
							id: req === 'Role' ? val : gid
						},
						started: timeStart,
						prize: prize,
						entry: [],
						endTime: tim,
						host: message.member.user.id
					});

					await crete.save();

					const timer = setInterval(async () => {
						if (!msg) return;
						const allComp = await msg?.components[0];

						const dt = await model.findOne({ message: msg.id });

						if (dt.endTime && Number(dt.endTime) < Date.now()) {
							const embeded = new MessageEmbed()
								.setTitle('Processing Data...')
								.setColor(0xcc0000)
								.setDescription(
									`Please wait.. We are Processing the winner with some magiks`
								)
								.setFooter({
									text: 'Ending the Giveaway, Scraping the ticket..'
								});

							clearInterval(timer);

							await msg
								.edit({ embeds: [embeded], components: [] })
								.catch(() => {});

							const dispWin: string[] = [];

							const winArr: any[] = [];

							const winCt = dt.winCount;

							const entries = dt.entry;

							for (let i = 0; i < winCt; i++) {
								const winno = Math.floor(Math.random() * dt.entered);

								winArr.push(entries[winno]);
							}

							setTimeout(() => {
								winArr.forEach(async (name) => {
									await message.guild.members
										.fetch(name?.userID)
										.then((user) => {
											dispWin.push(`<@${user.user.id}>`);

											const embod = new MessageEmbed()
												.setTitle('You.. Won the Giveaway !')
												.setDescription(
													`You just won \`${dt.prize}\` in the Giveaway at \`${user.guild.name}\` Go claim it fast !`
												)
												.setColor(0x075fff)
												.setFooter(
													options.embed?.credit === false
														? options.embed?.footer
														: {
																text: '©️ Rahuletto. npm i simply-djs',
																iconURL: 'https://i.imgur.com/XFUIwPh.png'
														  }
												);

											const gothe = new MessageButton()
												.setLabel('View Giveaway')
												.setStyle('LINK')
												.setURL(msg.url);

											const entrow = new MessageActionRow().addComponents([
												gothe
											]);

											return user
												.send({ embeds: [embod], components: [entrow] })
												.catch(() => {});
										})
										.catch(() => {});
								});
							}, 2000);

							setTimeout(async () => {
								if (!dt) return await msg.delete();
								if (dt) {
									const tim = Number(dt.endTime.slice(0, -3));
									const f: EmbedFieldData[] = [];
									if (options.fields) {
										options.fields.forEach((a) => {
											a.value = a.value
												.replaceAll('{hosted}', `<@${dt.host}>`)
												.replaceAll('{endsAt}', `<t:${tim}:f>`)
												.replaceAll('{prize}', dt.prize.toString())
												.replaceAll(
													'{requirements}',
													req === 'None'
														? 'None'
														: req + ' | ' + (req === 'Role' ? `${val}` : val)
												)
												.replaceAll('{winCount}', dt.winCount.toString())
												.replaceAll('{entered}', dt.entered.toString());

											f.push(a);
										});
									}

									if (dt.entered <= 0 || !winArr[0]) {
										embed
											.setTitle('No one entered')

											.setFields(f)
											.setColor('RED')
											.setFooter(
												options.embed?.credit === false
													? options.embed?.footer
													: {
															text: '©️ Rahuletto. npm i simply-djs',
															iconURL: 'https://i.imgur.com/XFUIwPh.png'
													  }
											);

										return await msg.edit({
											embeds: [embed],
											components: []
										});
									}

									embed
										.setTitle('We got the winner !')
										.setDescription(
											`${dispWin.join(', ')} got the prize !\n\n` +
												(
													options.embed?.description ||
													`Interact with the giveaway using the buttons.`
												)
													.replaceAll('{hosted}', `<@${dt.host}>`)
													.replaceAll('{prize}', dt.prize)
													.replaceAll('{endsAt}', `<t:${dt.endTime}:R>`)
													.replaceAll(
														'{requirements}',
														req === 'None'
															? 'None'
															: req + ' | ' + (req === 'Role' ? `${val}` : val)
													)
													.replaceAll('{winCount}', dt.winCount.toString())
													.replaceAll('{entered}', dt.entered.toString())
										)
										.setFields(options.fields)
										.setColor(0x3bb143)
										.setFooter(
											options.embed?.credit === false
												? options.embed?.footer
												: {
														text: '©️ Rahuletto. npm i simply-djs',
														iconURL: 'https://i.imgur.com/XFUIwPh.png'
												  }
										);

									allComp.components[0].disabled = true;
									allComp.components[1].disabled = false;
									allComp.components[2].disabled = true;

									await msg.edit({
										embeds: [embed],
										components: [allComp]
									});
								}
							}, 5200);
						}
					}, 5000);
				});
		} catch (err: any) {
			console.log(
				`${chalk.red('Error Occured.')} | ${chalk.magenta(
					'giveaway'
				)} | Error: ${err.stack}`
			);
		}
	});
}

function ms(str: string) {
	let sum = 0,
		time,
		type,
		val;

	const arr: string[] = ('' + str)
		.split(' ')
		.filter((v) => v != '' && /^(\d{1,}\.)?\d{1,}([wdhms])?$/i.test(v));

	const length = arr.length;

	for (let i = 0; i < length; i++) {
		time = arr[i];
		type = time.match(/[wdhms]$/i);

		if (type) {
			val = Number(time.replace(type[0], ''));

			switch (type[0].toLowerCase()) {
				case 'w':
					sum += val * 604800000;
					break;
				case 'd':
					sum += val * 86400000;
					break;
				case 'h':
					sum += val * 3600000;
					break;
				case 'm':
					sum += val * 60000;
					break;
				case 's':
					sum += val * 1000;
					break;
			}
		} else if (!isNaN(parseFloat(time)) && isFinite(parseFloat(time))) {
			sum += parseFloat(time);
		}
	}
	return sum;
}
