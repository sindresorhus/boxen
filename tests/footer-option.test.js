import assert from 'node:assert/strict';
import {test} from 'node:test';
import chalk, {Chalk} from 'chalk';
import boxen from '../index.js';
import './setup.js';

const level3Chalk = new Chalk({level: 3});

/**
Run a function with ANSI colors enabled.

@param {() => string} callback - The function to run.
*/
const withColorEnabled = callback => {
	const {level} = chalk;
	chalk.level = 3;

	try {
		return callback();
	} finally {
		chalk.level = level;
	}
};

test('footer option works', t => {
	const box = boxen('foo', {
		footer: 'footer',
	});

	t.assert.snapshot(box);
});

test('footer align left', t => {
	const box = boxen('foo bar foo bar', {
		footer: 'footer',
		footerAlignment: 'left',
	});

	t.assert.snapshot(box);
});

test('footer align center', t => {
	const box = boxen('foo bar foo bar', {
		footer: 'footer',
		footerAlignment: 'center',
	});

	t.assert.snapshot(box);
});

test('footer align right', t => {
	const box = boxen('foo bar foo bar', {
		footer: 'footer',
		footerAlignment: 'right',
	});

	t.assert.snapshot(box);
});

test('long footer expands box', t => {
	const box = boxen('foo', {
		footer: 'very long footer',
	});

	t.assert.snapshot(box);
});

test('title and footer together', t => {
	const box = boxen('foo', {
		title: 'title',
		footer: 'footer',
	});

	t.assert.snapshot(box);
});

test('footer + width option', t => {
	// Not enough space, no footer
	t.assert.snapshot(
		boxen('foo', {
			footer: 'very long footer',
			width: 3,
		}),
	);

	// Space for only one character
	t.assert.snapshot(
		boxen('foo', {
			footer: 'very long footer',
			width: 5,
		}),
	);

	t.assert.snapshot(
		boxen('foo', {
			footer: 'very long footer',
			width: 20,
		}),
	);

	t.assert.snapshot(
		boxen('foo', {
			footer: level3Chalk.red('colorful footer'),
			width: 18,
		}),
	);
});

test('footer option with border style (none)', t => {
	const box = boxen('foo', {
		footer: 'footer',
		borderStyle: 'none',
	});

	t.assert.snapshot(box);
});

test('footer option with border style (none) keeps the box width', () => {
	assert.equal(boxen('foobar', {footer: 'x', borderStyle: 'none'}), 'foobar\nx     ');
});

test('footer option with border style (none) uses the full width', () => {
	assert.equal(boxen('x', {width: 10, footer: 'abcdefgh', borderStyle: 'none'}), 'x         \nabcdefgh  ');
});

test('footer alignment with border style (none)', () => {
	assert.equal(boxen('foobar', {footer: 'x', footerAlignment: 'center', borderStyle: 'none'}), 'foobar\n  x   ');
	assert.equal(boxen('foobar', {footer: 'x', footerAlignment: 'right', borderStyle: 'none'}), 'foobar\n     x');
});

test('footer uses the border color', () => {
	const box = withColorEnabled(() => boxen('foo', {
		footer: 'footer',
		borderColor: 'red',
	}));

	assert.ok(box.includes(level3Chalk.red('└ footer ┘')));
});
