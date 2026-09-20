import assert from 'node:assert/strict';
import {test} from 'node:test';
import chalk, {Chalk} from 'chalk';
import boxen from '../index.js';
import './setup.js';

const level3Chalk = new Chalk({level: 3});

/**
Run a function with ANSI colors enabled.
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

test('title option with border style (none)', t => {
	const box = boxen('foo', {
		title: 'title',
		borderStyle: 'none',
	});

	t.assert.snapshot(box);
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

	assert.ok(box.includes('\u001B[31m┌ title '));
});

test('titleColor option takes precedence over the border color', () => {
	const box = withColorEnabled(() => boxen('foo', {
		title: 'title',
		borderColor: 'blue',
		titleColor: 'red',
	}));

	assert.ok(box.includes('\u001B[34m┌\u001B[31m title '));
});

test('titleColor option keeps the color of the title', () => {
	const box = withColorEnabled(() => boxen('foo', {
		title: level3Chalk.blue('title'),
		titleColor: 'red',
	}));

	// The title's own color comes after the title color, so it wins
	assert.ok(box.includes('\u001B[31m \u001B[34mtitle'));
});

test('titleColor option supports hex colors', () => {
	const box = withColorEnabled(() => boxen('foo', {
		title: 'title',
		titleColor: '#FF0000',
	}));

	assert.ok(box.includes(level3Chalk.hex('#FF0000')(' title ')));
});

test('throws on unexpected titleColor', () => {
	for (const titleColor of ['dark-yellow', 'bold', 'bgRed', '#ggg', '#12345g']) {
		assert.throws(() => {
			boxen('foo', {
				title: 'title',
				titleColor,
			});
		}, {message: `${titleColor} is not a valid titleColor`});
	}
});
