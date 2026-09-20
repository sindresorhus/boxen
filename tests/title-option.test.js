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

test('title option works', t => {
	const box = boxen('foo', {
		title: 'title',
	});

	t.assert.snapshot(box);
});

test('title align left', t => {
	const box = boxen('foo bar foo bar', {
		title: 'title',
		titleAlignment: 'left',
	});

	t.assert.snapshot(box);
});

test('title align center', t => {
	const box = boxen('foo bar foo bar', {
		title: 'title',
		titleAlignment: 'center',
	});

	t.assert.snapshot(box);
});

test('title align right', t => {
	const box = boxen('foo bar foo bar', {
		title: 'title',
		titleAlignment: 'right',
	});

	t.assert.snapshot(box);
});

test('long title expands box', t => {
	const box = boxen('foo', {
		title: 'very long title',
	});

	t.assert.snapshot(box);
});

test('title + width option', t => {
	// Not enough space, no title
	t.assert.snapshot(
		boxen('foo', {
			title: 'very long title',
			width: 3,
		}),
	);

	// Space for only one character
	t.assert.snapshot(
		boxen('foo', {
			title: 'very long title',
			width: 5,
		}),
	);

	t.assert.snapshot(
		boxen('foo', {
			title: 'very long title',
			width: 20,
		}),
	);

	t.assert.snapshot(
		boxen('foo', {
			title: level3Chalk.red('colorful title'),
			width: 18,
		}),
	);
});

test('nullish title alignment means the default', () => {
	assert.equal(
		boxen('foo', {title: 't', width: 12, titleAlignment: undefined}),
		boxen('foo', {title: 't', width: 12}),
	);
});

test('title option with a line break', () => {
	// A title is a single line, so a line break would break the box
	assert.equal(boxen('foo', {title: 'a\nb'}), '┌ a b ┐\n│foo  │\n└─────┘');
	assert.equal(boxen('foo', {title: 'a\r\nb'}), '┌ a b ┐\n│foo  │\n└─────┘');
	assert.equal(boxen('foo', {title: 'a\nb\nc'}), '┌ a b c ┐\n│foo    │\n└───────┘');
});

test('title option with border style (none) and a long title', () => {
	// The title uses the full content width, as no space is needed for the border
	assert.equal(
		boxen('x', {width: 10, title: 'a very long title', borderStyle: 'none'}),
		'a very lon\nx         ',
	);
});

test('title option with border style (none)', t => {
	const box = boxen('foo', {
		title: 'title',
		borderStyle: 'none',
	});

	t.assert.snapshot(box);
});

test('title option with border style (none) keeps the box width', () => {
	// The title line is padded to the content width
	assert.equal(boxen('foobar', {title: 'x', borderStyle: 'none'}), 'x     \nfoobar');
});

test('title option with border style (none) uses the full width', () => {
	// Two spaces are not reserved for the border, as there is none
	assert.equal(boxen('x', {width: 10, title: 'abcdefgh', borderStyle: 'none'}), 'abcdefgh  \nx         ');
});

test('title alignment with border style (none)', () => {
	assert.equal(boxen('foobar', {title: 'x', titleAlignment: 'center', borderStyle: 'none'}), '  x   \nfoobar');
	assert.equal(boxen('foobar', {title: 'x', titleAlignment: 'right', borderStyle: 'none'}), '     x\nfoobar');
});

test('titleColor option', () => {
	const box = withColorEnabled(() => boxen('foo', {
		title: 'title',
		titleColor: 'red',
	}));

	assert.ok(box.includes(level3Chalk.red(' title ')));
});

test('titleColor option defaults to border color', () => {
	const box = withColorEnabled(() => boxen('foo', {
		title: 'title',
		borderColor: 'red',
	}));

	assert.ok(box.includes('\u{1B}[31m┌ title '));
});

test('titleColor option takes precedence over the border color', () => {
	const box = withColorEnabled(() => boxen('foo', {
		title: 'title',
		borderColor: 'blue',
		titleColor: 'red',
	}));

	assert.ok(box.includes('\u{1B}[34m┌\u{1B}[31m title '));
});

test('titleColor option keeps the color of the title', () => {
	const box = withColorEnabled(() => boxen('foo', {
		title: level3Chalk.blue('title'),
		titleColor: 'red',
	}));

	// The title's own color comes after the title color, so it wins
	assert.ok(box.includes('\u{1B}[31m \u{1B}[34mtitle'));
});

test('titleColor option supports hex colors', () => {
	const box = withColorEnabled(() => boxen('foo', {
		title: 'title',
		titleColor: '#FF0000',
	}));

	assert.ok(box.includes(level3Chalk.hex('#FF0000')(' title ')));
});

test('throws on unexpected titleColor', () => {
	assert.throws(() => boxen('foo', {title: 'title', titleColor: 'dark-yellow'}), {message: 'dark-yellow is not a valid titleColor'});
	assert.throws(() => boxen('foo', {title: 'title', titleColor: 'bold'}), {message: 'bold is not a valid titleColor'});
	assert.throws(() => boxen('foo', {title: 'title', titleColor: 'bgRed'}), {message: 'bgRed is not a valid titleColor'});
	assert.throws(() => boxen('foo', {title: 'title', titleColor: '#ggg'}), {message: '#ggg is not a valid titleColor'});
	assert.throws(() => boxen('foo', {title: 'title', titleColor: '#12345g'}), {message: '#12345g is not a valid titleColor'});
});
