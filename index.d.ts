/**
 * Style of the box border.
 */
export interface BorderStyle {
	readonly topLeft: string;
	readonly topRight: string;
	readonly bottomLeft: string;
	readonly bottomRight: string;
	readonly horizontal: string;
	readonly vertical: string;
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
	readonly borderColor?: string;

	/**
	 * Style of the box border.
	 *
	 * @default 'single'
	 */
	readonly borderStyle?: string | BorderStyle;

	/**
	 * Reduce opacity of the border.
	 *
	 * @default: false
	 */
	readonly dimBorder?: boolean;

	/**
	 * Space between the text and box border.
	 *
	 * @default: 0
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
	readonly float?: string;

	/**
	 * Color of the background.
	 */
	readonly backgroundColor?: string;

	/**
	 * Align the text in the box based on the widest line.
	 *
	 * @default 'left'
	 */
	readonly align?: string;
}

/**
 * Border styles imported from `sindresorhus/cli-boxes`
 */
declare const _borderStyles: BorderStyle[];

/**
 * Creates a box in the terminal.
 *
 * @param text - The text inside the box.
 * @returns The box.
 */
export default function boxen(text: string, options?: Options): string;
