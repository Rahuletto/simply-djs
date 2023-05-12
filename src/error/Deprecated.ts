export type deprecate = {
	desc?: string;
};

export async function Deprecated(options: deprecate = {}): Promise<void> {
	process.emitWarning(
		options.desc + '\nThank you 🤗',
		`SimplyDJS | DeprecationWarning`
	);
}
