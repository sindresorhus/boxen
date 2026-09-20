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

const getObject = detail => typeof detail === 'number'
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

const getBorderWidth = borderStyle => borderStyle === NONE ? 0 : 2;

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
		characters = cliBoxes[borderStyle];

		if (!characters) {
			throw new TypeError(`Invalid border style: ${borderStyle}`);
		}
	} else {
		// Ensure retro-compatibility
		if (typeof borderStyle?.vertical === 'string') {
			borderStyle.left = borderStyle.vertical;
			borderStyle.right = borderStyle.vertical;
		}

		// Ensure retro-compatibility
		if (typeof borderStyle?.horizontal === 'string') {
			borderStyle.top = borderStyle.horizontal;
			borderStyle.bottom = borderStyle.horizontal;
		}

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
			const createdLines = wrapAnsi(line, max, {hard: true});
			const alignedLines = ansiAlign(createdLines, {align: textAlignment});
			const alignedLinesArray = alignedLines.split('\n');
			// A character can be wider than the box, in which case the line overflows it
			const longestLength = Math.min(max, Math.max(...alignedLinesArray.map(s => stringWidth(s))));

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

	if (padding.top > 0) {
		lines = [...Array.from({length: padding.top}, () => PAD.repeat(width)), ...lines];
	}

	if (padding.bottom > 0) {
		lines = [...lines, ...Array.from({length: padding.bottom}, () => PAD.repeat(width))];
	}

	if (height && lines.length > height) {
		lines = lines.slice(0, height);
	} else if (height && lines.length < height) {
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
		const topBar = options.title
			? makeLabel(colorizeTitle(options.title), chars.top.repeat(contentWidth), options.titleAlignment)
			: chars.top.repeat(contentWidth);

		result += marginLeft + colorizeBorder(chars.topLeft + topBar + chars.topRight) + NEWLINE;
	}

	const lines = content.split(NEWLINE);

	result += lines.map(line => marginLeft + colorizeBorder(chars.left) + colorizeContent(line) + colorizeBorder(chars.right)).join(NEWLINE);

	if (options.borderStyle !== NONE || options.footer) {
		const bottomBar = options.footer
			? makeLabel(options.footer, chars.bottom.repeat(contentWidth), options.footerAlignment)
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
		let newDimensions = [process.stdout.columns, process.stdout.rows];

		if (typeof options.fullscreen === 'function') {
			newDimensions = options.fullscreen(...newDimensions);
		}

		options.width ||= newDimensions[0];

		options.height ||= newDimensions[1];
	}

	// If width is provided, make sure it's not below 1
	options.width &&= Math.max(1, options.width - getBorderWidth(options.borderStyle));

	// If maxWidth is provided, make sure it's not below 1
	options.maxWidth &&= Math.max(1, options.maxWidth - getBorderWidth(options.borderStyle));

	// If height is provided, make sure it's not below 1
	options.height &&= Math.max(1, options.height - getBorderWidth(options.borderStyle));

	return options;
};

const formatLabel = (label, borderStyle) => borderStyle === NONE ? label : ` ${label} `;

// Slice a label to the available space and pad it with spaces
const fitLabel = (label, width, borderStyle) => {
	if (!label) {
		return label;
	}

	label = sliceAnsi(label, 0, Math.max(0, width - 2));

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
	const availableWidth = terminalWidth - options.margin.left - options.margin.right;

	let widest = Math.min(widestLine(wrapAnsi(text, maxContentWidth, {hard: true, trim: false})) + options.padding.left + options.padding.right, maxContentWidth);

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

	if (!isWidthOverride) {
		if ((options.margin.left && options.margin.right) && options.width > availableWidth) {
			// Let's assume we have margins: left = 3, right = 5, in total = 8
			const spaceForMargins = columns - options.width - borderWidth;
			// Let's assume we have space = 4
			const multiplier = spaceForMargins / (options.margin.left + options.margin.right);
			// Here: multiplier = 4/8 = 0.5
			options.margin.left = Math.max(0, Math.floor(options.margin.left * multiplier));
			options.margin.right = Math.max(0, Math.floor(options.margin.right * multiplier));
			// Left: 3 * 0.5 = 1.5 -> 1
			// Right: 6 * 0.5 = 3
		}

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
	options = {
		padding: 0,
		borderStyle: 'single',
		dimBorder: false,
		textAlignment: 'left',
		float: 'left',
		titleAlignment: 'left',
		footerAlignment: 'left',
		...options,
	};

	// This option is deprecated
	if (options.align) {
		options.textAlignment = options.align;
	}

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
