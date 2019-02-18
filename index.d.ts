import cliBoxes, {BoxStyle} from 'cli-boxes';

/**
 * Characters used for custom border.
 *
 * @example
 *
 * // affffb
 * // e    e
 * // dffffc
 *
 * const border: CustomBorderStyle = {
 * 	topLeft: 'a',
 * 	topRight: 'b',
 * 	bottomRight: 'c',
 * 	bottomLeft: 'd',
 * 	vertical: 'e',
 * 	horizontal: 'f'
 * };
 */
export interface CustomBorderStyle extends BoxStyle {}

/**
 * Border styles from [`cli-boxes`](https://github.com/sindresorhus/cli-boxes).
 */
declare const enum BorderStyle {
	Single = 'single',
	Double = 'double',
	Round = 'round',
	SingleDouble = 'singleDouble',
	DoubleSingle = 'doubleSingle',
	Classic = 'classic'
}

/**
 * Spacing used for `padding` and `margin`.
 */
export interface Spacing {
	readonly top: number;
	readonly right: number;
	readonly bottom: number;
	readonly left: number;
}

export interface Options {
	/**
	 * Color of the box border.
	 */
	readonly borderColor?:
		| 'black'
		| 'red'
		| 'green'
		| 'yellow'
		| 'blue'
		| 'magenta'
		| 'cyan'
		| 'white'
		| 'gray'
		| 'grey'
		| 'blackBright'
		| 'redBright'
		| 'greenBright'
		| 'yellowBright'
		| 'blueBright'
		| 'magentaBright'
		| 'cyanBright'
		| 'whiteBright'
		| string;

	/**
	 * Style of the box border.
	 *
	 * @default BorderStyle.Single
	 */
	readonly borderStyle?: BorderStyle | CustomBorderStyle;

	/**
	 * Reduce opacity of the border.
	 *
	 * @default false
	 */
	readonly dimBorder?: boolean;

	/**
	 * Space between the text and box border.
	 *
	 * @default 0
	 */
	readonly padding?: number | Spacing;

	/**
	 * Space around the box.
	 *
	 * @default 0
	 */
	readonly margin?: number | Spacing;

	/**
	 * Float the box on the available terminal screen space.
	 *
	 * @default 'left'
	 */
	readonly float?: 'left' | 'right' | 'center';

	/**
	 * Color of the background.
	 */
	readonly backgroundColor?:
		| 'black'
		| 'red'
		| 'green'
		| 'yellow'
		| 'blue'
		| 'magenta'
		| 'cyan'
		| 'white'
		| 'blackBright'
		| 'redBright'
		| 'greenBright'
		| 'yellowBright'
		| 'blueBright'
		| 'magentaBright'
		| 'cyanBright'
		| 'whiteBright'
		| string;

	/**
	 * Align the text in the box based on the widest line.
	 *
	 * @default 'left'
	 */
	readonly align?: 'left' | 'right' | 'center';
}

/**
 * Creates a box in the terminal.
 *
 * @param text - The text inside the box.
 * @returns The box.
 */
export default function boxen(text: string, options?: Options): string;
