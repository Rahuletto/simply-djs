import { ButtonStyle } from 'discord.js';

export function MessageButtonStyle(style: string) {
	// The style options are optional so if its undefined just don't care
	if (style == undefined) return;

	// The combination to find
	const combination = [
		{ key: 'PRIMARY', value: ButtonStyle.Primary },
		{ key: 'SECONDARY', value: ButtonStyle.Secondary },
		{ key: 'SUCCESS', value: ButtonStyle.Success },
		{ key: 'DANGER', value: ButtonStyle.Danger },
		{ key: 'LINK', value: ButtonStyle.Link }
	];

	// Using .find(callback) to get the combination
	const buttonstyle = combination.find((o) => o.key == style);

	// If it doesn't exist just return nothing
	if (!buttonstyle || buttonstyle == undefined) return;

	return buttonstyle.value;
}
