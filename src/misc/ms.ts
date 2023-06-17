/**
 * A Powerful, efficient yet simple system to convert human-readable time to ms
 * @param str
 * @link `Documentation:` https://simplyd.js.org/docs/misc/ms
 * @example simplydjs.ms('1h')
 */

export function ms(str: string) {
	let sum = 0,
		time,
		type,
		val;

	// Convert the string to easier terms
	str = str
		.replaceAll('week', 'w')
		.replaceAll('weeks', 'w')
		.replaceAll('day', 'd')
		.replaceAll('days', 'd')
		.replaceAll('hour', 'h')
		.replaceAll('hours', 'h')
		.replaceAll('minute', 'm')
		.replaceAll('minutes', 'm')
		.replaceAll('min', 'm')
		.replaceAll('second', 's')
		.replaceAll('seconds', 's')
		.replaceAll('sec', 's');

	// Splitting the string based on the terms
	const arr: string[] = ('' + str)
		.split(' ')
		.filter((v) => v != '' && /^(\d{1,}\.)?\d{1,}([wdhms])?$/i.test(v));

	const length = arr.length;

	for (let i = 0; i < length; i++) {
		time = arr[i];
		type = time.match(/[wdhms]$/i);

		if (type) {
			val = Number(time.replace(type[0], ''));

			// Actual conversion from human-readable time to ms
			switch (type[0].toLowerCase()) {
				case 'w': // weeks
					sum += val * 604800000;
					break;
				case 'd': // days
					sum += val * 86400000;
					break;
				case 'h': // hours
					sum += val * 3600000;
					break;
				case 'm': // minutes
					sum += val * 60000;
					break;
				case 's': // seconds
					sum += val * 1000;
					break;
			}
		} else if (!isNaN(parseFloat(time)) && isFinite(parseFloat(time))) {
			sum += parseFloat(time);
		}
	}
	return sum;
}
