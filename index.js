'use strict';
const stringWidth = require('string-width');
const chalk = require('chalk');
const widestLine = require('widest-line');
const cliBoxes = require('cli-boxes');
const camelCase = require('camelcase');
const ansiAlign = require('ansi-align');
const termSize = require('term-size');
const wrapAnsi = require('wrap-ansi');
const hasAnsi = require('has-ansi')
const ansi_Split = require('ansi-split')

const getObject = detail => {
	let object;

	if (typeof detail === 'number') {
		object = {
			top: detail,
			right: detail * 3,
			bottom: detail,
			left: detail * 3
		};
	} else {
		object = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			...detail
		};
	}

	return object;
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

const isHex = color => color.match(/^#[0-f]{3}(?:[0-f]{3})?$/i);
const isColorValid = color => typeof color === 'string' && ((chalk[color]) || isHex(color));
const getColorFn = color => isHex(color) ? chalk.hex(color) : chalk[color];
const getBGColorFn = color => isHex(color) ? chalk.bgHex(color) : chalk[camelCase(['bg', color])];
const ansiSplit = text => {
	let lines = []
	let currStr = ""
	let resetAnsi = '\u001b[39m'
	let lastAnsi = resetAnsi

	for(const el of ansi_Split(text)){
		if(el === ""){
			continue
		}

		if(hasAnsi(el)){
			const ansiCodes = el.split("m")
			lastAnsi = ansiCodes[ansiCodes.length - 2]
			currStr += lastAnsi + 'm'
		}
		else{
			let nlIndex
			let txt = el
			do{
				nlIndex = txt.indexOf("\n")
				if(nlIndex === -1){
					currStr += txt
				}
				else{
					currStr += txt.slice(0, nlIndex) + resetAnsi
					lines.push(currStr)
					currStr = ""
					currStr += lastAnsi + 'm'
					txt = txt.slice(nlIndex+1)
				}
			}while(nlIndex !== -1)
		}
	}
	lines.push(currStr)

	return lines;
}

const getBackgroundColorName = x => camelCase('bg', x);

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

	text = ansiAlign(text, {align: options.align});

	const NL = '\n';
	const PAD = ' ';

	let lines = hasAnsi(text) ?  ansiSplit(text) : text.split(NL);

	if (padding.top > 0) {
		lines = new Array(padding.top).fill('').concat(lines);
	}

	if (padding.bottom > 0) {
		lines = lines.concat(new Array(padding.bottom).fill(''));
	}

	let contentWidth = widestLine(text) + padding.left + padding.right;
	const paddingLeft = PAD.repeat(padding.left);
	const {columns} = termSize();
	let marginLeft = PAD.repeat(margin.left);

	if(columns < contentWidth + margin.right + margin.left){
		const newWidestLine = widestLine(text) - (contentWidth + margin.right + margin.left - columns);
		const wrapText = wrapAnsi(text, newWidestLine, {hard: true});
		lines = new Array(padding.top).fill('')
				.concat(hasAnsi(wrapText) ?  ansiSplit(wrapText) : text.split(NL))
				.concat(new Array(padding.bottom).fill(''));
		contentWidth = widestLine(wrapText) + padding.left + padding.right;
	}

	if (options.float === 'center') {
		const padWidth = Math.max((columns - contentWidth) / 2, 0);
		marginLeft = PAD.repeat(padWidth);
	} else if (options.float === 'right') {
		const padWidth = Math.max(columns - contentWidth - margin.right - 2, 0);
		marginLeft = PAD.repeat(padWidth);
	}

	const horizontal = chars.horizontal.repeat(contentWidth);
	const top = colorizeBorder(NL.repeat(margin.top) + marginLeft + chars.topLeft + horizontal + chars.topRight);
	const bottom = colorizeBorder(marginLeft + chars.bottomLeft + horizontal + chars.bottomRight + NL.repeat(margin.bottom));
	const side = colorizeBorder(chars.vertical);

	const middle = lines.map(line => {
		console.log(line)
		console.log(contentWidth - stringWidth(line) - padding.left);
		const paddingRight = PAD.repeat(contentWidth - stringWidth(line) - padding.left);
		return marginLeft + side + colorizeContent(paddingLeft + line + paddingRight) + side;
	}).join(NL);

	return top + NL + middle + NL + bottom;
};

module.exports._borderStyles = cliBoxes;
