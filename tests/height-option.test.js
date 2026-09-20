import assert from 'node:assert/strict';
import {test} from 'node:test';
import boxen from '../index.js';
import './setup.js';

test('height option works', t => {
	// Creates a tall box with empty rows
	t.assert.snapshot(
		boxen('foo', {
			height: 5,
		}),
	);

	// Creates a 1 line box, cropping the other lines
	t.assert.snapshot(
		boxen('foo bar\nfoo bar', {
			height: 3,
		}),
	);
});

test('height option keeps the vertical padding', () => {
	// The padding rows are part of the height, so only the text is cropped
	const box = boxen('a\nb\nc', {
		height: 5,
		padding: 1,
	});

	assert.equal(box, [
		'┌───────┐',
		'│       │',
		'│   a   │',
		'│       │',
		'└───────┘',
	].join('\n'));
});

test('height option with big padding', () => {
	// The padding does not fit in the box, so it is disabled
	const box = boxen('foo', {
		height: 5,
		padding: 3,
	});

	assert.equal(box, [
		'┌─────────────────────┐',
		'│         foo         │',
		'│                     │',
		'│                     │',
		'└─────────────────────┘',
	].join('\n'));
});

test('height option with padding + margin', t => {
	// Creates a wide box for little text
	const box = boxen('foo', {
		height: 20,
		margin: 2,
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('height option with width', t => {
	// Creates a wide box for little text
	const box = boxen('foo', {
		height: 5,
		width: 20,
	});

	t.assert.snapshot(box);
});

test('height option with width + padding + margin', t => {
	// Creates a wide box for little text
	const box = boxen('foo', {
		height: 5,
		width: 20,
		margin: 2,
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('height option with border style (none)', t => {
	const box = boxen('foo', {
		height: 3,
		borderStyle: 'none',
	});

	t.assert.snapshot(box);
});
