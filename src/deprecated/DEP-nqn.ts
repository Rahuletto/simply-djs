import { Message, TextChannel } from 'discord.js';
import { Deprecated, SimplyError } from '../error';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/deprecated/nqn#nqnoptions
 */

export type nqnOptions = {
	strict?: boolean;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * @deprecated Removed from the package
 *
 * NQN bot feature. But you have the power to do it.
 * @param message
 * @link `Documentation:` https://simplyd.js.org/docs/deprecated/nqn
 * @example simplydjs.nqn(message)
 */

export async function nqn(
	message: Message,
	options: nqnOptions = { strict: false }
): Promise<void> {
	Deprecated({
		desc: 'Removed nqn() from the package. Please use other package or our code in github.'
	});
	return new Promise(async () => {
		try {
			const { client } = message;

			if (message.author.bot) return;

			let msg = message.content;

			if (msg.includes('<:') || msg.includes('<a:')) return;

			const str = msg.match(/(:)([^:\s]+)(:)/gi);

			let reply: string = message.content;

			if (str && str[0]) {
				str.forEach(async (emo) => {
					const rlem = emo.replaceAll(':', '');
					const emoji =
						message.guild.emojis.cache.find((x) => x.name === rlem) ||
						client.emojis.cache.find((x) => x.name === rlem);

					if (!emoji?.id) return;

					reply = reply.replace(emo, emoji?.toString());
				});

				let webhook = await (
					await (message.channel as TextChannel).fetchWebhooks()
				).find((w) => w.name == `simply-djs NQN`);

				if (!webhook) {
					webhook = await (message.channel as TextChannel).createWebhook({
						name: `simply-djs NQN`,
						avatar: client.user.displayAvatarURL()
					});
				}

				await message.delete();
				await webhook.send({
					username: message.member.nickname || message.author.username,
					avatarURL: message.author.displayAvatarURL({ forceStatic: false }),
					content: reply
				});
			}
		} catch (err: any) {
			if (options?.strict)
				throw new SimplyError({
					function: 'nqn',
					title: 'An Error occured when running the function ',
					tip: err.stack
				});
			else console.log(`SimplyError - nqn | Error: ${err.stack}`);
		}
	});
}
