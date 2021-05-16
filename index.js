'use strict';
const stringWidth = require('string-width');
const chalk = require('chalk');
const widestLine = require('widest-line');
const cliBoxes = require('cli-boxes');
const camelCase = require('camelcase');
const wrapAnsi = require('wrap-ansi');

const NL = '\n';
const PAD = ' ';

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

const wrapLines = (max, lines) => {
	const newLines = [];
	for (const line of lines) {
		const createdLines = wrapAnsi(line, max, {hard: true});
		const alignedLinesArray = createdLines.split(NL);

		for (const alignedLine of alignedLinesArray) {
			newLines.push(alignedLine);
		}
	}

	return newLines;
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

	let lines = text.split(NL);

	let contentWidth = widestLine(text) + padding.left + padding.right;

	const BORDERS_WIDTH = 2;

	if (options.width && contentWidth > options.width) {
		contentWidth = options.width - BORDERS_WIDTH;
		const max = contentWidth - padding.left - padding.right;

		lines = wrapLines(max, lines);
	} else if (contentWidth + BORDERS_WIDTH > columns) {
		contentWidth = columns - BORDERS_WIDTH;
		const max = contentWidth - padding.left - padding.right;

		lines = wrapLines(max, lines);
	}

	if (contentWidth + BORDERS_WIDTH + margin.left + margin.right > columns) {
		// Let's assume we have margins: left = 3, right = 5, in total = 8
		const spaceForMargins = columns - contentWidth - BORDERS_WIDTH;
		// Let's assume we have space = 4
		const multiplier = spaceForMargins / (margin.left + margin.right);
		// Here: multiplier = 4/8 = 0.5
		margin.left = Math.floor(margin.left * multiplier);
		margin.right = Math.floor(margin.right * multiplier);
		// Left: 3 * 0.5 = 1.5 -> 1
		// Right: 6 * 0.5 = 3
	}

	if (padding.top > 0) {
		lines = new Array(padding.top).fill('').concat(lines);
	}

	if (padding.bottom > 0) {
		lines = lines.concat(new Array(padding.bottom).fill(''));
	}

	const paddingLeft = PAD.repeat(padding.left);
	const paddingRight = PAD.repeat(padding.right);
	let marginLeft = PAD.repeat(margin.left);

	if (options.float === 'center') {
		const padWidth = Math.max((columns - contentWidth - BORDERS_WIDTH) / 2, 0);
		marginLeft = PAD.repeat(padWidth);
	} else if (options.float === 'right') {
		const padWidth = Math.max(columns - contentWidth - margin.right - BORDERS_WIDTH, 0);
		marginLeft = PAD.repeat(padWidth);
	}

	const totalWidth = options.width ? (options.width + BORDERS_WIDTH + padding.left + padding.right > columns ? columns - BORDERS_WIDTH : options.width) : contentWidth;

	const horizontal = chars.horizontal.repeat(totalWidth);
	const top = colorizeBorder(NL.repeat(margin.top) + marginLeft + chars.topLeft + horizontal + chars.topRight);
	const bottom = colorizeBorder(marginLeft + chars.bottomLeft + horizontal + chars.bottomRight + NL.repeat(margin.bottom));
	const side = colorizeBorder(chars.vertical);

	const LINE_SEPARATOR = (contentWidth + BORDERS_WIDTH + margin.left >= columns) ? '' : NL;

	const middle = lines.map(line => {
		const alignmentPadding = totalWidth - stringWidth(line) - padding.left - padding.right;
		let rightAlignmentPadding = '';
		let leftAlignmentPadding = '';
		switch (options.align) {
			case 'center':
				rightAlignmentPadding = PAD.repeat(Math.ceil(alignmentPadding / 2));
				leftAlignmentPadding = PAD.repeat(alignmentPadding / 2);
				break;
			case 'right':
				leftAlignmentPadding = PAD.repeat(alignmentPadding);
				break;
			default:
				rightAlignmentPadding = PAD.repeat(alignmentPadding);
				break;
		}

		return marginLeft + side + colorizeContent(
			paddingLeft + leftAlignmentPadding + line + rightAlignmentPadding + paddingRight
		) + side;
	}).join(LINE_SEPARATOR);

	return top + LINE_SEPARATOR + middle + LINE_SEPARATOR + bottom;
};

module.exports._borderStyles = cliBoxes;
