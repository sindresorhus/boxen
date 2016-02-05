'use strict';
var stringWidth = require('string-width');
var repeating = require('repeating');
var chalk = require('chalk');
var objectAssign = require('object-assign');
var widestLine = require('widest-line');
var filledArray = require('filled-array');
var borderChars = require('./border-characters');

var getObject = function (detail) {
	var obj;
	if (typeof detail === 'number') {
		obj = {
			top: detail,
			right: detail * 3,
			bottom: detail,
			left: detail * 3
		};
	} else {
		obj = objectAssign({
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}, detail);
	}
	return obj;
};
var getBorderChars = function (borderStyle) {
	var chars;
	if(typeof borderStyle === 'string') {
		chars = borderChars[borderStyle];
		if (!chars) {
			throw new TypeError('Invalid borderStyle ' + borderStyle);
		}
	} else {
		['topLeft', 'topRight', 'bottomRight', 'bottomLeft', 'vertical', 'horizontal'].forEach(function (key) {
			if(!borderStyle[key] || typeof borderStyle[key] !== 'string') {
				throw new TypeError('Invalid borderStyle, missing or wrong valued key ' + key);
			}
		});
		chars = borderStyle;
	}
	return chars;
}

module.exports = function (text, opts) {
	opts = objectAssign({
		padding: 0,
		borderStyle: 'single'
	}, opts);

	if (opts.borderColor && !chalk[opts.borderColor]) {
		throw new Error(opts.borderColor + ' is not a valid borderColor');
	}

	var chars = getBorderChars(opts.borderStyle);
	var padding = getObject(opts.padding);
	var margin = getObject(opts.margin);

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
	var horizontal = repeating(chars.horizontal, contentWidth);
	var top = colorizeBorder(repeating('\n', margin.top) + repeating(' ', margin.left) + chars.topLeft + horizontal + chars.topRight);
	var bottom = colorizeBorder(repeating(' ', margin.left) + chars.bottomLeft + horizontal + chars.bottomRight + repeating('\n', margin.bottom));
	var side = colorizeBorder(chars.vertical);

	var middle = lines.map(function (line) {
		var paddingLeft = repeating(' ', padding.left);
		var paddingRight = repeating(' ', contentWidth - stringWidth(line) - padding.left);

		return repeating(' ', margin.left) + side + paddingLeft + line + paddingRight + side;
	}).join('\n');

	return top + '\n' + middle + '\n' + bottom;
};
