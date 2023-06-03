import { https } from './misc';

import { SimplyError } from './error';
import { ExtendedMessage } from './typedef';

import { Configuration, OpenAIApi } from 'openai';

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

/**
 * **Documentation Url** of the options: https://simplyd.js.org/docs/fun/chatbot#chatbotoptions
 */

export type chatbotOptions = {
	strict?: boolean;
	channelId?: string | string[];
	toggle?: boolean;
	name?: string;
	developer?: string;
	gptToken?: string; // To access ChatGPT
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A chatbot system that is both technically advanced and intelligent, and is your buddy.
 *
 * Implements a chatbot feature using an external API to generate responses to user messages.
 *
 * @param message
 * @param options
 *
 * @link `Documentation:` https://simplyd.js.org/docs/Fun/chatbot
 * @example simplydjs.chatbot(client, message)
 */

export async function chatbot(
	message: ExtendedMessage,
	options: chatbotOptions = { strict: false }
): Promise<void> {
	return new Promise(async () => {
		const { client } = message;
		if (message.author.bot) return;
		if (options && options?.toggle === false) return;

		let channels = [];
		if (Array.isArray(options.channelId)) channels = options.channelId;
		else channels.push(options.channelId);

		try {
			for (const channel of channels) {
				const ch = await client.channels.cache.get(channel);
				if (!ch)
					if (options?.strict)
						throw new SimplyError({
							function: 'chatbot',
							title: `Invalid Channel (or) No VIEW_CHANNEL permission`,
							tip: `Check the permissions (or) Try using another Channel ID.\nReceived ${
								options.channelId || 'undefined'
							}`
						});
					else
						console.log(
							`SimplyError - chatbot | Invalid Channel (or) No VIEW_CHANNEL permission\n\nCheck the permissions (or) Try using another Channel ID.\nReceived ${
								options.channelId || 'undefined'
							}`
						);
			}

			//Return if the channel of the message is not a chatbot channel
			if (!channels.includes(message.channel.id)) return null;

			const ranges = [
				'\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
				'\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
				'\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
			];

			// Remove such content
			let input = message.cleanContent.replace(
				new RegExp(ranges.join('|'), 'g'),
				'.'
			);

			// For ChatGPT integration.
			if (options?.gptToken) {
				await message.channel.sendTyping();

				const configuration = new Configuration({
					apiKey: options?.gptToken
				});
				const openai = new OpenAIApi(configuration);

				async function runCompletion() {
					const completion = await openai.createCompletion({
						model: 'text-davinci-003',
						prompt: input
					});
					return completion.data.choices[0].text;
				}

				return await message.reply({
					content: await runCompletion(),
					allowedMentions: { repliedUser: false }
				});
			}

			const regg =
				/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
			//Replacing Emojis
			input = input.replace(/<a?:.+:\d+>/gm, '');
			input = input.replace(regg, '');

			if (!input || input == '') return;

			options.name ??= 'Simply-DJS';
			options.developer ??= 'Rahuletto';

			const url = new URL('https://simplyapi.js.org/api/chatbot'),
				params = url.searchParams,
				age = new Date().getFullYear() - client.user.createdAt.getFullYear();

			params.set('message', input);
			params.set('developer', options.developer);
			params.set('name', options.name ?? client.user.username);
			params.set('age', age.toString());
			params.set('year', client.user.createdAt.getFullYear().toString());
			params.set('bday', client.user.createdAt.toLocaleDateString());
			params.set('birthplace', 'Simply-Develop');
			params.set('uid', message.author.id);

			await message.channel.sendTyping();

			// Get data from the api made by the same team
			const jsonRes = await https(
				`simplyapi.js.org` + url.pathname + '?' + params.toString()
			);

			const chatbotReply = jsonRes.reply // Just replacing any mass mentions just in case
				.replace(/@everyone/g, '`@everyone`')
				.replace(/@here/g, '`@here`');

			if (chatbotReply === '') {
				return message.reply({
					content:
						"That message is beyond my intelligence. I can't understand.",
					allowedMentions: { repliedUser: false }
				});
			}
			await message.reply({
				content: chatbotReply,
				allowedMentions: { repliedUser: false }
			});
		} catch (err: any) {
			if (options?.strict)
				throw new SimplyError({
					function: 'chatbot',
					title: 'An Error occured when running the function',
					tip: err.stack
				});
			else console.log(`SimplyError - chatbot | Error: ${err.stack}`);
		}
	});
}
