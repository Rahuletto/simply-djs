import chalk from 'chalk';

export type deprecate = {
	desc?: string;
};

export async function Deprecated(options: deprecate = {}): Promise<void> {
	process.emitWarning(
		options.desc,
		`${chalk.blue('Simply-DJS')} | ${chalk.red('DeprecationWarning')}`
	);
}
