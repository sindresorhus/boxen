export interface Options {
	/**
	 * Color of the box border.
	 */
	borderColor?: string;

	/**
	 * Style of the box border.
	 *
	 * @default `single`
	 */
	borderStyle?: string | BorderStyle;

	/**
	 * Reduce opacity of the border.
	 *
	 * @default: false
	 */
	dimBorder?: boolean;

	/**
	 * Space between the text and box border.
	 *
	 * @default: 0
	 */
	padding?: number | Spacing;

	/**
	 * Space around the box.
	 *
	 * @default 0
	 */
	margin?: number | Spacing;

	/**
	 * Float the box on the available terminal screen space.
	 *
	 * @default `left`
	 */
	float?: string;

	/**
	 * Color of the background.
	 */
	backgroundColor?: string;

	/**
	 * Align the text in the box based on the widest line.
	 *
	 * @default `left`
	 */
	align?: string;
}

/**
 * Style of the box border.
 */
export interface BorderStyle {
	topLeft: string;
	topRight: string;
	bottomLeft: string;
	bottomRight: string;
	horizontal: string;
	vertical: string;
}

/**
 * Spacing used for `padding` and `margin`.
 */
export interface Spacing {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

/**
 * Border styles imported from `sindresorhus/cli-boxes`
 */
declare const _borderStyles: BorderStyle[];

/**
 * Creates a box in the terminal.
 *
 * @param input - Text inside the box
 * @returns Box containing text.
 */
export default function boxen(input: string, options?: Options): string;
