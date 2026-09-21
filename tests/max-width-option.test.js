import assert from 'node:assert/strict';
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

test('maxWidth measures wrapped text with its horizontal padding', () => {
	const box = boxen('xxxxxxxxxx bb bb', {maxWidth: 20, padding: 1});

	assert.equal(box, [
		'┌────────────────┐',
		'│                │',
		'│   xxxxxxxxxx   │',
		'│   bb bb        │',
		'│                │',
		'└────────────────┘',
	].join('\n'));
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
	// A character that is wider than the content area overflows the box instead of throwing
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

test('maxWidth option that is a number in a string', () => {
	// A size that can be read as a number is a size, exactly like a padding side
	const text = 'foo bar foo bar foo bar';
	assert.equal(boxen(text, {maxWidth: '20'}), boxen(text, {maxWidth: 20}));
	assert.equal(boxen(text, {maxWidth: '0'}), boxen(text));
	assert.equal(boxen(text, {maxWidth: 'wide'}), boxen(text));
});
