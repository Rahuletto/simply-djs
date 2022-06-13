import { Message, TextChannel } from 'discord.js';
import chalk from 'chalk';

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * NQN bot feature. But you have the power to do it.
 * @param message
 * @link `Documentation:` ***https://simplyd.js.org/docs/General/nqn***
 * @example simplydjs.nqn(message)
 */

export async function nqn(message: Message) {
	try {
		const { client } = message;
		if (message.author.bot) return;

		let msg = message.content;
		const str = msg.match(/(?<=:)([^:\s]+)(?=:)/gi);

		if (msg.includes('<:') || msg.includes('<a:')) return;

		msg = msg.replace('<:', '').replace('<a:', '');

		const st = msg.match(/(:)([^:\s]+)(:)/gi);

		let reply: string = message.content;

		if (st && st[0]) {
			st.forEach(async (emojii) => {
				const rlem = emojii.replaceAll(':', '');
				const emoji =
					message.guild.emojis.cache.find((x) => x.name === rlem) ||
					client.emojis.cache.find((x) => x.name === rlem);

				if (!emoji?.id) return;

				reply = reply.replace(emojii, emoji?.toString());
			});

			let webhook = await (
				await (message.channel as TextChannel).fetchWebhooks()
			).find((w) => w.name == `simply-djs NQN`);

			if (!webhook) {
				webhook = await (message.channel as TextChannel).createWebhook(
					'simply-djs NQN',
					{
						avatar: client.user.displayAvatarURL()
					}
				);
			}

			await message.delete();
			await webhook.send({
				username: message.member.nickname || message.author.username,
				avatarURL: message.author.displayAvatarURL({ dynamic: true }),
				content: reply
			});
		}
	} catch (err: any) {
		console.log(
			`${chalk.red('Error Occured.')} | ${chalk.magenta('nqn')} | Error: ${
				err.stack
			}`
		);
	}
}
