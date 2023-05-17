import { ButtonStyle } from 'discord.js';

export function MessageButtonStyle(style: string) {
	if (style == undefined) return ButtonStyle.Secondary;

	const combination = [
		{ key: 'PRIMARY', value: ButtonStyle.Primary },
		{ key: 'SECONDARY', value: ButtonStyle.Secondary },
		{ key: 'SUCCESS', value: ButtonStyle.Success },
		{ key: 'DANGER', value: ButtonStyle.Danger },
		{ key: 'LINK', value: ButtonStyle.Link }
	];

	const buttonstyle = combination.find((o) => o.key == style);
	if (!buttonstyle || buttonstyle == undefined) return ButtonStyle.Secondary;
	return buttonstyle.value;
}
