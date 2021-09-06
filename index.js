'use strict';
const stringWidth = require('string-width');
const chalk = require('chalk');
const widestLine = require('widest-line');
const cliBoxes = require('cli-boxes');
const camelCase = require('camelcase');
const ansiAlign = require('ansi-align');
const wrapAnsi = require('wrap-ansi');

const NL = '\n';
const PAD = ' ';
const BORDERS_WIDTH = 2;

const terminalColumns = () => {
	const {env, stdout, stderr} = process;

	if (stdout && stdout.columns) {
		return stdout.columns;
	}

	if (stderr && stderr.columns) {
		return stderr.columns;
	}

	if (env.COLUMNS) {
		return Number.parseInt(env.COLUMNS, 10);
	}

	return 80;
};

const getObject = detail => {
	return typeof detail === 'number' ? {
		top: detail,
		right: detail * 3,
		bottom: detail,
		left: detail * 3
	} : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...detail
	};
};

const getBorderChars = borderStyle => {
	const sides = [
		'topLeft',
		'topRight',
		'bottomRight',
		'bottomLeft',
		'vertical',
		'horizontal'
	];

	let chararacters;

	if (typeof borderStyle === 'string') {
		chararacters = cliBoxes[borderStyle];

		if (!chararacters) {
			throw new TypeError(`Invalid border style: ${borderStyle}`);
		}
	} else {
		for (const side of sides) {
			if (!borderStyle[side] || typeof borderStyle[side] !== 'string') {
				throw new TypeError(`Invalid border style: ${side}`);
			}
		}

		chararacters = borderStyle;
	}

	return chararacters;
};

const makeContentText = (text, padding, columns, align) => {
	text = ansiAlign(text, {align});
	let lines = text.split(NL);
	const textWidth = widestLine(text);

	const max = columns - padding.left - padding.right;

	if (textWidth > max) {
		const newLines = [];
		for (const line of lines) {
			const createdLines = wrapAnsi(line, max, {hard: true});
			const alignedLines = ansiAlign(createdLines, {align});
			const alignedLinesArray = alignedLines.split('\n');
			const longestLength = Math.max(...alignedLinesArray.map(s => stringWidth(s)));

			for (const alignedLine of alignedLinesArray) {
				let paddedLine;
				switch (align) {
					case 'center':
						paddedLine = PAD.repeat((max - longestLength) / 2) + alignedLine;
						break;
					case 'right':
						paddedLine = PAD.repeat(max - longestLength) + alignedLine;
						break;
					default:
						paddedLine = alignedLine;
						break;
				}

				newLines.push(paddedLine);
			}
		}

		lines = newLines;
	}

	if (align === 'center' && textWidth < max) {
		lines = lines.map(line => PAD.repeat((max - textWidth) / 2) + line);
	} else if (align === 'right' && textWidth < max) {
		lines = lines.map(line => PAD.repeat(max - textWidth) + line);
	}

	const paddingLeft = PAD.repeat(padding.left);
	const paddingRight = PAD.repeat(padding.right);

	lines = lines.map(line => paddingLeft + line + paddingRight);

	lines = lines.map(line => {
		if (columns - stringWidth(line) > 0) {
			switch (align) {
				case 'center':
					return line + PAD.repeat(columns - stringWidth(line));
				case 'right':
					return line + PAD.repeat(columns - stringWidth(line));
				default:
					return line + PAD.repeat(columns - stringWidth(line));
			}
		}

		return line;
	});

	if (padding.top > 0) {
		lines = new Array(padding.top).fill(PAD.repeat(columns)).concat(lines);
	}

	if (padding.bottom > 0) {
		lines = lines.concat(new Array(padding.bottom).fill(PAD.repeat(columns)));
	}

	return lines.join(NL);
};

const isHex = color => color.match(/^#(?:[0-f]{3}){1,2}$/i);
const isColorValid = color => typeof color === 'string' && ((chalk[color]) || isHex(color));
const getColorFn = color => isHex(color) ? chalk.hex(color) : chalk[color];
const getBGColorFn = color => isHex(color) ? chalk.bgHex(color) : chalk[camelCase(['bg', color])];

module.exports = (text, options) => {
	options = {
		padding: 0,
		borderStyle: 'single',
		dimBorder: false,
		align: 'left',
		float: 'left',
		...options
	};

	if (options.borderColor && !isColorValid(options.borderColor)) {
		throw new Error(`${options.borderColor} is not a valid borderColor`);
	}

	if (options.backgroundColor && !isColorValid(options.backgroundColor)) {
		throw new Error(`${options.backgroundColor} is not a valid backgroundColor`);
	}

	const chars = getBorderChars(options.borderStyle);
	const padding = getObject(options.padding);
	const margin = getObject(options.margin);

	const colorizeBorder = border => {
		const newBorder = options.borderColor ? getColorFn(options.borderColor)(border) : border;
		return options.dimBorder ? chalk.dim(newBorder) : newBorder;
	};

	const colorizeContent = content => options.backgroundColor ? getBGColorFn(options.backgroundColor)(content) : content;

	const columns = terminalColumns();

	let contentWidth = widestLine(wrapAnsi(text, columns - BORDERS_WIDTH, {hard: true})) + padding.left + padding.right;

	if ((margin.left && margin.right) && contentWidth + BORDERS_WIDTH + margin.left + margin.right > columns) {
		// Let's assume we have margins: left = 3, right = 5, in total = 8
		const spaceForMargins = columns - contentWidth - BORDERS_WIDTH;
		// Let's assume we have space = 4
		const multiplier = spaceForMargins / (margin.left + margin.right);
		// Here: multiplier = 4/8 = 0.5
		margin.left = Math.max(0, Math.floor(margin.left * multiplier));
		margin.right = Math.max(0, Math.floor(margin.right * multiplier));
		// Left: 3 * 0.5 = 1.5 -> 1
		// Right: 6 * 0.5 = 3
	}

	// Prevent content from exceeding the console's width
	contentWidth = Math.min(contentWidth, columns - BORDERS_WIDTH - margin.left - margin.right);

	text = makeContentText(text, padding, contentWidth, options.align);

	let marginLeft = PAD.repeat(margin.left);

	if (options.float === 'center') {
		const marginWidth = Math.max((columns - contentWidth - BORDERS_WIDTH) / 2, 0);
		marginLeft = PAD.repeat(marginWidth);
	} else if (options.float === 'right') {
		const marginWidth = Math.max(columns - contentWidth - margin.right - BORDERS_WIDTH, 0);
		marginLeft = PAD.repeat(marginWidth);
	}

	const horizontal = chars.horizontal.repeat(contentWidth);
	const top = colorizeBorder(NL.repeat(margin.top) + marginLeft + chars.topLeft + horizontal + chars.topRight);
	const bottom = colorizeBorder(marginLeft + chars.bottomLeft + horizontal + chars.bottomRight + NL.repeat(margin.bottom));
	const side = colorizeBorder(chars.vertical);

	const LINE_SEPARATOR = (contentWidth + BORDERS_WIDTH + margin.left >= columns) ? '' : NL;

	const lines = text.split(NL);

	const middle = lines.map(line => {
		return marginLeft + side + colorizeContent(line) + side;
	}).join(LINE_SEPARATOR);

	return top + LINE_SEPARATOR + middle + LINE_SEPARATOR + bottom;
};

module.exports._borderStyles = cliBoxes;
