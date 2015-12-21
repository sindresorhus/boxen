'use strict';
var stringWidth = require('string-width');
var repeating = require('repeating');
var chalk = require('chalk');
var objectAssign = require('object-assign');
var widestLine = require('widest-line');
var filledArray = require('filled-array');

module.exports = function (text, opts) {
	opts = objectAssign({
		padding: 0
	}, opts);

	if (opts.borderColor && !chalk[opts.borderColor]) {
		throw new Error(opts.borderColor + ' is not a valid borderColor');
	}

	var padding = opts.padding;

	if (typeof padding === 'number') {
		padding = {
			top: padding,
			right: padding * 3,
			bottom: padding,
			left: padding * 3
		};
	} else {
		padding = objectAssign({
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}, padding);
	}

	var colorizeBorder = function (x) {
		return opts.borderColor ? chalk[opts.borderColor](x) : x;
	};

	var lines = text.split('\n');

	if (padding.top > 0) {
		lines = filledArray('', padding.top).concat(lines);
	}

	if (padding.bottom > 0) {
		lines = lines.concat(filledArray('', padding.bottom));
	}

	var contentWidth = widestLine(text) + padding.left + padding.right;
	var horizontal = repeating('─', contentWidth);
	var top = colorizeBorder('┌' + horizontal + '┐');
	var bottom = colorizeBorder('└' + horizontal + '┘');
	var side = colorizeBorder('│');

	var middle = lines.map(function (line) {
		var paddingLeft = repeating(' ', padding.left);
		var paddingRight = repeating(' ', contentWidth - stringWidth(line) - padding.left);

		return side + paddingLeft + line + paddingRight + side;
	}).join('\n');

	return top + '\n' + middle + '\n' + bottom;
};
