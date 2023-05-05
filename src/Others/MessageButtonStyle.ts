import { ButtonStyle } from 'discord.js';

export function MessageButtonStyle(clr: string) {
	const c = [
		{ key: 'PRIMARY', value: ButtonStyle.Primary },
		{ key: 'SECONDARY', value: ButtonStyle.Secondary },
		{ key: 'SUCCESS', value: ButtonStyle.Success },
		{ key: 'DANGER', value: ButtonStyle.Danger },
		{ key: 'LINK', value: ButtonStyle.Link }
	];

	const ret = c.find((o) => o.key == clr);
	return ret.value;
}
