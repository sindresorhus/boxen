import {test} from 'node:test';
import boxen from '../index.js';
import './setup.js';

test('width option works', t => {
	// Creates a wide box for little text
	t.assert.snapshot(
		boxen('foo', {
			width: 20,
		}),
	);

	// Creates a small box for a lot of text
	t.assert.snapshot(
		boxen('foo bar foo bar', {
			width: 10,
		}),
	);
});

test('width option with padding + margin', t => {
	// Creates a wide box for little text
	const box = boxen('foo', {
		width: 20,
		margin: 2,
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('width option with big padding', t => {
	// Should disable the paddings
	const box = boxen('foo', {
		width: 6,
		padding: 3,
	});

	t.assert.snapshot(box);
});

test('width option with border style (none)', t => {
	const box = boxen('foo', {
		width: 3,
		borderStyle: 'none',
	});

	t.assert.snapshot(box);
});
