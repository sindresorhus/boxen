import {test} from 'node:test';
import boxen from '../index.js';
import './setup.js';

test('maxWidth option works', t => {
	// Keeps the box small for little text
	t.assert.snapshot(
		boxen('foo bar', {
			maxWidth: 20,
		}),
	);

	// Wraps the text of a wide box
	t.assert.snapshot(
		boxen('foo bar foo bar foo bar foo bar foo bar foo bar', {
			maxWidth: 20,
		}),
	);
});

test('maxWidth option is capped by the terminal', t => {
	const box = boxen('foo bar foo bar foo bar foo bar foo bar foo bar foo bar foo bar foo bar foo bar', {
		maxWidth: 500,
	});

	t.assert.snapshot(box);
});

test('maxWidth option with width', t => {
	// The fixed width takes precedence
	const box = boxen('foo bar', {
		maxWidth: 10,
		width: 20,
	});

	t.assert.snapshot(box);
});

test('maxWidth option with padding + margin', t => {
	const box = boxen('foo bar foo bar foo bar', {
		maxWidth: 20,
		padding: 1,
		margin: 1,
	});

	t.assert.snapshot(box);
});

test('maxWidth option with title + footer', t => {
	// The labels are sliced to the maximum
	const box = boxen('foo bar', {
		maxWidth: 20,
		title: 'a title that is too long',
		footer: 'a footer that is too long',
	});

	t.assert.snapshot(box);
});

test('maxWidth option with border style (none)', t => {
	const box = boxen('foo bar foo bar foo bar', {
		maxWidth: 20,
		borderStyle: 'none',
	});

	t.assert.snapshot(box);
});

test('maxWidth option with a character wider than the box', t => {
	/*
	A character that is wider than the content area overflows the box instead of throwing. `wrapAnsi` also emits an empty first line, because it cannot split the character.
	*/
	t.assert.snapshot(
		boxen('字', {
			maxWidth: 3,
		}),
	);
});

test('maxWidth option with height', t => {
	const box = boxen('foo bar foo bar foo bar', {
		maxWidth: 20,
		height: 5,
	});

	t.assert.snapshot(box);
});
