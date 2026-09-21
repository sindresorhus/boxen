import process from 'node:process';
import stringWidth from 'string-width';
import chalk from 'chalk';
import widestLine from 'widest-line';
import cliBoxes from 'cli-boxes';
import wrapAnsi from 'wrap-ansi';
import sliceAnsi from 'slice-ansi';

const NEWLINE = '\n';
const PAD = ' ';
const NONE = 'none';

// A text or a label is drawn inside a box, so every control that moves the cursor would break it
const LINE_BREAKS = /\r\n|[\n\v\f\r]/gv;

/*
A text, a label and a border are drawn inside the box, so a control that moves the cursor would break it.
A style escape and a hyperlink are drawn with the text they wrap, every other escape is dropped, a tab is drawn as a single space, which is not the column it moves the cursor to but keeps the row as wide as it is measured, and a backspace overtypes the character before it.
*/
const STYLING_ESCAPE = /(\u{1B}\[[0-9:;]*m|\u{1B}\][^\u{7}\u{1B}]*(?:\u{7}|\u{1B}\\))/gv;
const CURSOR_ESCAPE = /\u{1B}\[[\u{20}-\u{3F}]*[\u{40}-\u{7E}]|\u{1B}[^\u{7}\u{5B}\u{5D}]?/gv;

const writeControls = text => {
	// The styling escapes are the odd entries of the split, the rest of the text is stripped of the escapes that move the cursor
	const written = text
		.split(STYLING_ESCAPE)
		.map((part, index) => index % 2 === 1 ? part : part.replaceAll(CURSOR_ESCAPE, '').replaceAll('\t', ' '))
		.join('');

	const characters = [];

	for (const character of written) {
		if (character === '\u{8}') {
			characters.pop();
		} else {
			characters.push(character);
		}
	}

	return characters.join('');
};

const terminalColumns = () => process.stdout?.columns
	|| process.stderr?.columns
	|| Number(process.env.COLUMNS)
	|| 80;

// A terminal has no height when the output is not a terminal, and there is nothing to fill then
const terminalRows = () => process.stdout?.rows
	|| process.stderr?.rows
	|| Number(process.env.LINES);

const getObject = detail => {
	const object = typeof detail === 'number'
		? {
			top: detail,
			right: detail * 3,
			bottom: detail,
			left: detail * 3,
		}
		: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			...detail,
		};

	// A side has to be a finite non-negative number, anything else means no spacing
	for (const side of ['top', 'right', 'bottom', 'left']) {
		const value = Number(object[side]);
		object[side] = Number.isFinite(value) ? Math.max(0, value) : 0;
	}

	return object;
};

// The width of the border is the width of the sides it draws, and a side that draws nothing is drawn as a space
const getBorderWidth = borderStyle => {
	if (borderStyle === NONE) {
		return 0;
	}

	const {left, right} = getBorderChars(borderStyle);

	return stringWidth(left || PAD) + stringWidth(right || PAD);
};

// The top and the bottom are drawn on a row of their own, whether the sides are empty or not
const getBorderHeight = borderStyle => borderStyle === NONE ? 0 : 2;

// A size has to be a finite positive number, anything else means it is not set. The size is the space inside the border, so it can not be below 1.
const sanitizeSize = (size, borderWidth) => {
	const value = Number(size);

	return Number.isFinite(value) && value > 0 ? Math.max(1, value - borderWidth) : undefined;
};

// Wrapping trims the whitespace at the edges of a line, so a line that fits is kept as it is
const wrapLine = (line, width) => stringWidth(line) > width ? wrapAnsi(line, width, {hard: true}) : line;

const isValidSize = size => {
	const value = Number(size);

	return Number.isFinite(value) && value > 0;
};

// Pad every line to `width`, so that the text can be aligned in the box. A line that is wider than that is not padded, so a row that overflows the box does not widen the rows that fit.
const alignText = (text, alignment, width) => {
	if (alignment === 'left') {
		return text;
	}

	return text.split(NEWLINE).map(line => {
		const padding = Math.max(0, width - stringWidth(line));

		return PAD.repeat(alignment === 'right' ? padding : Math.floor(padding / 2)) + line;
	}).join(NEWLINE);
};

const getBorderChars = borderStyle => {
	const sides = [
		'topLeft',
		'topRight',
		'bottomRight',
		'bottomLeft',
		'left',
		'right',
		'top',
		'bottom',
	];

	let characters;

	// Create empty border style
	if (borderStyle === NONE) {
		borderStyle = Object.fromEntries(sides.map(side => [side, '']));
	}

	if (typeof borderStyle === 'string') {
		// The style has to be an own property, or an inherited name like `constructor` would pass as a style
		characters = Object.hasOwn(cliBoxes, borderStyle) ? cliBoxes[borderStyle] : undefined;

		if (!characters) {
			throw new TypeError(`Invalid border style: ${borderStyle}`);
		}
	} else {
		/*
		Ensure retro-compatibility: `vertical` and `horizontal` are the deprecated names of the sides.
		The style is copied, because the object belongs to the caller.
		*/
		borderStyle = {
			...borderStyle,
			left: borderStyle?.left ?? borderStyle?.vertical,
			right: borderStyle?.right ?? borderStyle?.vertical,
			top: borderStyle?.top ?? borderStyle?.horizontal,
			bottom: borderStyle?.bottom ?? borderStyle?.horizontal,
		};

		for (const side of sides) {
			if (borderStyle[side] === null || typeof borderStyle[side] !== 'string') {
				throw new TypeError(`Invalid border style: ${side}`);
			}
		}

		characters = borderStyle;
	}

	// A side is drawn inside the box as well, so the sides are copied and stripped of the controls that would move the cursor
	return Object.fromEntries(sides.map(side => [side, writeControls(characters[side])]));
};

const makeLabel = (text, horizontal, alignment) => {
	let label = '';

	// A bar character can be wider than one column, so the label is placed with the width of the bar, not with its length
	const textWidth = stringWidth(text);

	switch (alignment) {
		case 'left': {
			label = text + sliceAnsi(horizontal, textWidth);
			break;
		}

		case 'right': {
			label = sliceAnsi(horizontal, textWidth) + text;
			break;
		}

		default: {
			const width = Math.max(0, stringWidth(horizontal) - textWidth);

			if (width % 2 === 1) { // This is needed in case the width is odd
				horizontal = sliceAnsi(horizontal, Math.floor(width / 2) + textWidth);
				label = sliceAnsi(horizontal, 1) + text + horizontal; // We reduce the left part of one column to avoid the bar to go beyond its limit
			} else {
				horizontal = sliceAnsi(horizontal, (width / 2) + textWidth);
				label = horizontal + text + horizontal;
			}

			break;
		}
	}

	return label;
};

const makeContentText = (text, {padding, width, textAlignment, height}) => {
	const max = width - padding.left - padding.right;

	// The text is wrapped first, so that the alignment measures the rows that are drawn
	const wrappedText = text.split(NEWLINE).map(line => wrapLine(line, max)).join(NEWLINE);
	// A character can be wider than the box, in which case the row overflows it and the other rows are not aligned to it
	const textWidth = Math.min(max, widestLine(wrappedText));
	const alignedText = alignText(wrappedText, textAlignment, textWidth);
	// The rows are aligned to the widest row, and the block of rows is aligned in the box
	let offset = 0;

	if (textAlignment === 'right') {
		offset = max - textWidth;
	} else if (textAlignment === 'center') {
		offset = Math.floor((max - textWidth) / 2);
	}

	let lines = alignedText.split(NEWLINE).map(line => PAD.repeat(offset) + line);

	const paddingLeft = PAD.repeat(padding.left);
	const paddingRight = PAD.repeat(padding.right);

	lines = lines.map(line => {
		const newLine = paddingLeft + line + paddingRight;

		return newLine + PAD.repeat(Math.max(0, width - stringWidth(newLine)));
	});

	// The padding rows are part of the height, so only the text is cropped
	if (height && lines.length > height - padding.top - padding.bottom) {
		lines = lines.slice(0, height - padding.top - padding.bottom);
	}

	if (padding.top > 0) {
		lines = [...Array.from({length: padding.top}, () => PAD.repeat(width)), ...lines];
	}

	if (padding.bottom > 0) {
		lines = [...lines, ...Array.from({length: padding.bottom}, () => PAD.repeat(width))];
	}

	if (height && lines.length < height) {
		lines = [...lines, ...Array.from({length: height - lines.length}, () => PAD.repeat(width))];
	}

	return lines.join(NEWLINE);
};

/*
Fill a bar with the character of a side. The character can be wider than one column, or empty, in which case the bar is filled with spaces, so it is repeated and cut to the width of the bar.
*/
const fillBar = (character, width) => {
	const fill = character || PAD;
	const count = Math.ceil(Math.max(0, width) / Math.max(1, stringWidth(fill)));

	return sliceAnsi(fill.repeat(count), 0, Math.max(0, width));
};

const boxContent = (content, contentWidth, options) => {
	const colorizeBorder = border => {
		const coloredBorder = options.borderColor ? getColorFunction(options.borderColor)(border) : border;

		let bgColoredBorder = coloredBorder;
		if (options.borderBackgroundColor !== undefined) {
			if (options.borderBackgroundColor === 'inherit') {
				if (options.backgroundColor) {
					bgColoredBorder = getBGColorFunction(options.backgroundColor)(coloredBorder);
				}
			} else {
				bgColoredBorder = getBGColorFunction(options.borderBackgroundColor)(coloredBorder);
			}
		}

		return options.dimBorder ? chalk.dim(bgColoredBorder) : bgColoredBorder;
	};

	const colorizeContent = text => options.backgroundColor ? getBGColorFunction(options.backgroundColor)(text) : text;

	// Styling already applied to the title takes precedence
	const colorizeTitle = title => options.titleColor ? getColorFunction(options.titleColor)(title) : title;

	const chars = getBorderChars(options.borderStyle);
	const columns = terminalColumns();
	let marginLeft = PAD.repeat(options.margin.left);

	if (options.float === 'center') {
		const marginWidth = Math.max((columns - contentWidth - getBorderWidth(options.borderStyle)) / 2, 0);
		marginLeft = PAD.repeat(marginWidth);
	} else if (options.float === 'right') {
		const marginWidth = Math.max(columns - contentWidth - options.margin.right - getBorderWidth(options.borderStyle), 0);
		marginLeft = PAD.repeat(marginWidth);
	}

	let result = '';

	if (options.margin.top) {
		result += NEWLINE.repeat(options.margin.top);
	}

	// The rows have the width of the content plus the sides, and a style that draws a border draws a space for a side that is empty
	const hasBorder = options.borderStyle !== NONE;
	const left = hasBorder ? (chars.left || PAD) : '';
	const right = hasBorder ? (chars.right || PAD) : '';
	const rowWidth = contentWidth + stringWidth(left) + stringWidth(right);
	// A bar spans the width of a row, so it is filled to the width that is left between the corners, and the label is placed in the fill
	const bar = (character, cornerStart, cornerEnd, label, alignment) => {
		const width = Math.max(0, rowWidth - stringWidth(cornerStart) - stringWidth(cornerEnd));
		const fill = fillBar(character, width);
		const filled = label ? makeLabel(label, fill, alignment) : fill;

		// A character that is wider than one column does not fill the last column of an odd width, and a label can end in the middle of one
		const padding = PAD.repeat(Math.max(0, width - stringWidth(filled)));

		return sliceAnsi(filled + padding, 0, Math.max(0, width));
	};

	if (options.borderStyle !== NONE || options.title) {
		const topBar = bar(chars.top, chars.topLeft, chars.topRight, options.title ? colorizeTitle(options.title) : '', options.titleAlignment);

		result += marginLeft + colorizeBorder(chars.topLeft + topBar + chars.topRight) + NEWLINE;
	}

	const lines = content.split(NEWLINE);

	result += lines.map(line => marginLeft + colorizeBorder(left) + colorizeContent(line) + colorizeBorder(right)).join(NEWLINE);

	if (options.borderStyle !== NONE || options.footer) {
		const bottomBar = bar(chars.bottom, chars.bottomLeft, chars.bottomRight, options.footer ?? '', options.footerAlignment);

		result += NEWLINE + marginLeft + colorizeBorder(chars.bottomLeft + bottomBar + chars.bottomRight);
	}

	if (options.margin.bottom) {
		result += NEWLINE.repeat(options.margin.bottom);
	}

	return result;
};

const sanitizeOptions = options => {
	// If fullscreen is enabled, max-out unspecified width/height
	if (options.fullscreen && process?.stdout) {
		let newDimensions = [terminalColumns(), terminalRows()];

		if (typeof options.fullscreen === 'function') {
			newDimensions = options.fullscreen(...newDimensions);
		}

		if (!isValidSize(options.width)) {
			options.width = newDimensions[0];
		}

		if (!isValidSize(options.height)) {
			options.height = newDimensions[1];
		}
	}

	const borderWidth = getBorderWidth(options.borderStyle);

	options.width = sanitizeSize(options.width, borderWidth);
	options.maxWidth = sanitizeSize(options.maxWidth, borderWidth);
	options.height = sanitizeSize(options.height, getBorderHeight(options.borderStyle));

	return options;
};

const formatLabel = (label, borderStyle) => borderStyle === NONE ? label : ` ${label} `;

// Slice a label to the available space and pad it with spaces
const fitLabel = (label, width, borderStyle) => {
	if (!label) {
		return label;
	}

	// A label is a single line, so line breaks would break the box
	label = writeControls(label.replaceAll(LINE_BREAKS, ' ')).toWellFormed();
	label = sliceAnsi(label, 0, Math.max(0, width - getBorderWidth(borderStyle)));

	return label && formatLabel(label, borderStyle);
};

const determineDimensions = (text, options) => {
	options = sanitizeOptions(options);
	const isWidthOverride = options.width !== undefined;
	const columns = terminalColumns();
	const borderWidth = getBorderWidth(options.borderStyle);
	const terminalWidth = columns - borderWidth;
	// The box grows with the content up to the terminal width and `maxWidth`
	const maxContentWidth = Math.min(terminalWidth, options.maxWidth || terminalWidth);
	// A box that is floated is centered or pushed to the right of the terminal instead of being indented, so only a margin that is drawn takes columns from the content
	const marginWidth = () => {
		switch (options.float) {
			case 'center': {
				return 0;
			}

			case 'right': {
				return options.margin.right;
			}

			default: {
				return options.margin.left + options.margin.right;
			}
		}
	};

	// A width that is fixed brings its own size, so only the margin that is indented can push the box past the terminal then
	const availableWidth = isWidthOverride
		? columns - borderWidth - (options.float === 'left' ? options.margin.left : 0)
		: terminalWidth - marginWidth();

	// The text is measured the way it is wrapped for the box, or the box can end up a column wider than the text
	const maxTextWidth = Math.max(1, maxContentWidth - options.padding.left - options.padding.right);
	const wrappedText = text.split(NEWLINE).map(line => wrapLine(line, maxTextWidth)).join(NEWLINE);
	const widestText = widestLine(wrappedText);
	let widest = Math.min(widestText + options.padding.left + options.padding.right, maxContentWidth);

	// If fixed width is provided, use it or content width as reference
	options.width ||= widest;

	// The margin is shrunk whether it is on one side or both, otherwise the box would be pushed past the terminal
	// The content keeps one column, exactly like it does in `spaceForMargins`, or the margin can be left one column short
	if ((options.margin.left || options.margin.right) && Math.max(1, options.width) > availableWidth) {
		// Let's assume we have margins: left = 3, right = 5, in total = 8, and that the content keeps one column
		const spaceForMargins = columns - Math.max(1, options.width) - borderWidth;
		// Let's assume we have space = 4
		const multiplier = spaceForMargins / (options.margin.left + options.margin.right);
		// Here: multiplier = 4/8 = 0.5
		options.margin.left = Math.max(0, Math.floor(options.margin.left * multiplier));
		options.margin.right = Math.max(0, Math.floor(options.margin.right * multiplier));
		// Left: 3 * 0.5 = 1.5 -> 1
		// Right: 6 * 0.5 = 3
	}

	// The labels are fitted with the space that the margin leaves behind, so that a shrunk margin still fits them
	const labelWidth = isWidthOverride ? options.width : Math.min(columns - borderWidth - marginWidth(), maxContentWidth);
	options.title = fitLabel(options.title, labelWidth, options.borderStyle);
	options.footer = fitLabel(options.footer, labelWidth, options.borderStyle);

	// A label is drawn on a row of the border, but on a row of its own when there is no border
	if (getBorderHeight(options.borderStyle) === 0 && options.height) {
		options.height = Math.max(1, options.height - (options.title ? 1 : 0) - (options.footer ? 1 : 0));
	}

	if (!isWidthOverride) {
		// If a label is larger than content, box adheres to label width
		for (const label of [options.title, options.footer]) {
			if (label) {
				widest = Math.max(widest, stringWidth(label));
			}
		}

		// Re-cap width considering the margins after shrinking, keeping at least one column for the content
		options.width = Math.max(1, Math.min(widest, columns - borderWidth - marginWidth()));
	}

	// Prevent padding overflow
	if (options.padding.left + options.padding.right >= options.width) {
		options.padding.left = 0;
		options.padding.right = 0;
	}

	if (options.height && options.padding.top + options.padding.bottom >= options.height) {
		options.padding.top = 0;
		options.padding.bottom = 0;
	}

	return options;
};

const colorNames = new Set([
	'black',
	'red',
	'green',
	'yellow',
	'blue',
	'magenta',
	'cyan',
	'white',
	'gray',
	'grey',
	'blackBright',
	'redBright',
	'greenBright',
	'yellowBright',
	'blueBright',
	'magentaBright',
	'cyanBright',
	'whiteBright',
]);

const isHex = color => /^#(?:[\da-f]{3}){1,2}$/iv.test(color);
const isColorValid = color => typeof color === 'string' && (colorNames.has(color) || isHex(color));
const getColorFunction = color => isHex(color) ? chalk.hex(color) : chalk[color];
const getBGColorFunction = color => isHex(color) ? chalk.bgHex(color) : chalk[`bg${color[0].toUpperCase()}${color.slice(1)}`];

export default function boxen(text, options) {
	// Normalize the line breaks so that a carriage return, a vertical tab or a form feed can not move the cursor inside the box
	// A lone surrogate is written as a replacement character, which is one column wide, so it has to be measured as one
	text = writeControls(text.replaceAll(LINE_BREAKS, '\n')).toWellFormed();

	options = {
		padding: 0,
		dimBorder: false,
		float: 'left',
		...options,
	};

	// A nullish option, for example one that is explicitly `undefined`, means its default
	options.borderStyle ??= 'single';
	options.textAlignment ??= options.align ?? 'left'; // `align` is deprecated
	options.titleAlignment ??= 'left';
	options.footerAlignment ??= 'left';

	if (options.borderColor && !isColorValid(options.borderColor)) {
		throw new Error(`${options.borderColor} is not a valid borderColor`);
	}

	if (options.titleColor && !isColorValid(options.titleColor)) {
		throw new Error(`${options.titleColor} is not a valid titleColor`);
	}

	if (options.backgroundColor && !isColorValid(options.backgroundColor)) {
		throw new Error(`${options.backgroundColor} is not a valid backgroundColor`);
	}

	// Option borderBackgroundColor defaults to 'inherit' if unspecified (not explicitly set to undefined)
	if (!('borderBackgroundColor' in options)) {
		options.borderBackgroundColor = 'inherit';
	}

	if (options.borderBackgroundColor !== undefined && options.borderBackgroundColor !== 'inherit' && !isColorValid(options.borderBackgroundColor)) {
		throw new Error(`${options.borderBackgroundColor} is not a valid borderBackgroundColor`);
	}

	options.padding = getObject(options.padding);
	options.margin = getObject(options.margin);

	options = determineDimensions(text, options);

	text = makeContentText(text, options);

	return boxContent(text, options.width, options);
}

export {default as _borderStyles} from 'cli-boxes';
