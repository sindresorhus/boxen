import process from 'node:process';
import stringWidth from 'string-width';
import chalk from 'chalk';
import widestLine from 'widest-line';
import cliBoxes from 'cli-boxes';
import ansiAlign from 'ansi-align';
import wrapAnsi from 'wrap-ansi';
import sliceAnsi from 'slice-ansi';

const NEWLINE = '\n';
const PAD = ' ';
const NONE = 'none';

const terminalColumns = () => process.stdout?.columns
	|| process.stderr?.columns
	|| Number(process.env.COLUMNS)
	|| 80;

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

const getBorderWidth = borderStyle => borderStyle === NONE ? 0 : 2;

// A size has to be a finite number, anything else means it is not set. The size is the space inside the border, so it can not be below 1.
const sanitizeSize = (size, borderWidth) => size && Number.isFinite(size) ? Math.max(1, size - borderWidth) : undefined;

// Wrapping trims the whitespace at the edges of a line, so a line that fits is kept as it is
const wrapLine = (line, width) => stringWidth(line) > width ? wrapAnsi(line, width, {hard: true}) : line;

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

	return characters;
};

const makeLabel = (text, horizontal, alignment) => {
	let label = '';

	const textWidth = stringWidth(text);

	switch (alignment) {
		case 'left': {
			label = text + horizontal.slice(textWidth);
			break;
		}

		case 'right': {
			label = horizontal.slice(textWidth) + text;
			break;
		}

		default: {
			horizontal = horizontal.slice(textWidth);

			if (horizontal.length % 2 === 1) { // This is needed in case the length is odd
				horizontal = horizontal.slice(Math.floor(horizontal.length / 2));
				label = horizontal.slice(1) + text + horizontal; // We reduce the left part of one character to avoid the bar to go beyond its limit
			} else {
				horizontal = horizontal.slice(horizontal.length / 2);
				label = horizontal + text + horizontal;
			}

			break;
		}
	}

	return label;
};

const makeContentText = (text, {padding, width, textAlignment, height}) => {
	text = ansiAlign(text, {align: textAlignment});
	let lines = text.split(NEWLINE);
	const textWidth = widestLine(text);

	const max = width - padding.left - padding.right;

	if (textWidth > max) {
		const newLines = [];
		for (const line of lines) {
			const createdLines = wrapLine(line, max);
			const alignedLines = ansiAlign(createdLines, {align: textAlignment});
			const alignedLinesArray = alignedLines.split('\n');
			// A character can be wider than the box, in which case the line overflows it
			const longestLength = Math.min(max, widestLine(alignedLines));

			for (const alignedLine of alignedLinesArray) {
				let leftPadding = 0;

				if (textAlignment === 'center') {
					leftPadding = (max - longestLength) / 2;
				} else if (textAlignment === 'right') {
					leftPadding = max - longestLength;
				}

				newLines.push(PAD.repeat(leftPadding) + alignedLine);
			}
		}

		lines = newLines;
	}

	if (textAlignment === 'center' && textWidth < max) {
		lines = lines.map(line => PAD.repeat((max - textWidth) / 2) + line);
	} else if (textAlignment === 'right' && textWidth < max) {
		lines = lines.map(line => PAD.repeat(max - textWidth) + line);
	}

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

	if (options.borderStyle !== NONE || options.title) {
		// A label always spans the full width of the box, so an empty border is filled with spaces
		const topBar = options.title
			? makeLabel(colorizeTitle(options.title), (chars.top || PAD).repeat(contentWidth), options.titleAlignment)
			: chars.top.repeat(contentWidth);

		result += marginLeft + colorizeBorder(chars.topLeft + topBar + chars.topRight) + NEWLINE;
	}

	const lines = content.split(NEWLINE);

	result += lines.map(line => marginLeft + colorizeBorder(chars.left) + colorizeContent(line) + colorizeBorder(chars.right)).join(NEWLINE);

	if (options.borderStyle !== NONE || options.footer) {
		const bottomBar = options.footer
			? makeLabel(options.footer, (chars.bottom || PAD).repeat(contentWidth), options.footerAlignment)
			: chars.bottom.repeat(contentWidth);

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
		let newDimensions = [terminalColumns(), process.stdout.rows || process.stderr.rows];

		if (typeof options.fullscreen === 'function') {
			newDimensions = options.fullscreen(...newDimensions);
		}

		options.width ||= newDimensions[0];

		options.height ||= newDimensions[1];
	}

	const borderWidth = getBorderWidth(options.borderStyle);

	options.width = sanitizeSize(options.width, borderWidth);
	options.maxWidth = sanitizeSize(options.maxWidth, borderWidth);
	options.height = sanitizeSize(options.height, borderWidth);

	return options;
};

const formatLabel = (label, borderStyle) => borderStyle === NONE ? label : ` ${label} `;

// Slice a label to the available space and pad it with spaces
const fitLabel = (label, width, borderStyle) => {
	if (!label) {
		return label;
	}

	// A label is a single line, so line breaks would break the box
	label = label.replaceAll(/\r\n|[\n\r]/gv, ' ');
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
	// A width that is fixed brings its own size, so only a margin that is drawn can push the box past the terminal then.
	// A box that grows with the content is squeezed by both sides, and a margin that does not fit takes columns from the content.
	const drawnMargin = options.float === 'left' ? options.margin.left : 0;
	const availableWidth = isWidthOverride
		? columns - borderWidth - drawnMargin
		: terminalWidth - options.margin.left - options.margin.right;

	// The text is measured the way it is wrapped for the box, or the box can end up a column wider than the text
	const alignedText = ansiAlign(text, {align: options.textAlignment});
	const maxTextWidth = Math.max(1, maxContentWidth - options.padding.left - options.padding.right);
	const wrappedText = alignedText.split(NEWLINE).map(line => wrapLine(line, maxTextWidth)).join(NEWLINE);
	const widestText = widestLine(wrappedText);
	let widest = Math.min(widestText + options.padding.left + options.padding.right, maxContentWidth);

	// If width is provided, the labels adhere to it
	const labelWidth = isWidthOverride ? options.width : Math.min(availableWidth, maxContentWidth);
	options.title = fitLabel(options.title, labelWidth, options.borderStyle);
	options.footer = fitLabel(options.footer, labelWidth, options.borderStyle);

	if (!isWidthOverride) {
		// If a label is larger than content, box adheres to label width
		for (const label of [options.title, options.footer]) {
			if (label) {
				widest = Math.max(widest, stringWidth(label));
			}
		}
	}

	// If fixed width is provided, use it or content width as reference
	options.width ||= widest;

	// The margin is shrunk whether it is on one side or both, otherwise the box would be pushed past the terminal
	if ((options.margin.left || options.margin.right) && options.width > availableWidth) {
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

	if (!isWidthOverride) {
		// Re-cap width considering the margins after shrinking, keeping at least one column for the content
		options.width = Math.max(1, Math.min(options.width, columns - borderWidth - options.margin.left - options.margin.right));
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
	// Normalize the line endings so that a carriage return can not move the cursor inside the box
	text = text.replaceAll(/\r\n?/gv, '\n');

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
