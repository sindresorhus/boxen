import assert from 'node:assert/strict';
import process from 'node:process';
import {test} from 'node:test';
import boxen from '../index.js';
import './setup.js';

test('margin that is not a finite positive number is ignored', () => {
	// A negative margin would throw when the box is built
	assert.equal(boxen('foo', {margin: -1}), boxen('foo'));
	assert.equal(boxen('foo', {margin: {right: -5}}), boxen('foo'));
	assert.equal(boxen('foo', {
		margin: {
			top: -1, right: -1, bottom: -1, left: -1,
		},
	}), boxen('foo'));

	// A missing side would corrupt the width of the box
	assert.equal(boxen('foo', {margin: {left: undefined}}), boxen('foo'));
	assert.equal(boxen('foo', {margin: {bottom: null}}), boxen('foo'));
	assert.equal(boxen('foo', {margin: NaN}), boxen('foo'));
	assert.equal(boxen('foo', {margin: Infinity}), boxen('foo'));
});

test('margin option works', t => {
	const box = boxen('foo', {
		margin: 2,
	});

	t.assert.snapshot(box);
});

test('margin option with custom margins', t => {
	const box = boxen('foo', {
		margin: {
			top: 1,
			left: 2,
			right: 3,
			bottom: 4,
		},
	});

	t.assert.snapshot(box);
});

test('one-sided margin is shrunk to fit the terminal', () => {
	// A margin that does not fit is shrunk, exactly like a margin on both sides
	const box = boxen('foo', {
		margin: {
			left: Number(process.env.COLUMNS),
		},
	});
	const indent = ' '.repeat(Number(process.env.COLUMNS) - 5);

	assert.equal(box, [
		`${indent}┌───┐`,
		`${indent}│foo│`,
		`${indent}└───┘`,
	].join('\n'));
});

test('one-sided margin with empty text is shrunk to fit the terminal', () => {
	// The margin has to leave room for the content, which keeps at least one column
	const box = boxen('', {
		margin: {
			left: Number(process.env.COLUMNS),
		},
	});
	const indent = ' '.repeat(Number(process.env.COLUMNS) - 3);

	assert.equal(box, [
		`${indent}┌─┐`,
		`${indent}│ │`,
		`${indent}└─┘`,
	].join('\n'));
});

test('one-sided margin with empty text that leaves no column for the box is shrunk', () => {
	// The margin has to leave room for the one column that the content keeps
	const columns = Number(process.env.COLUMNS);
	const box = boxen('', {
		margin: {
			left: columns - 2,
		},
	});
	const indent = ' '.repeat(columns - 3);

	assert.equal(box, [
		`${indent}┌─┐`,
		`${indent}│ │`,
		`${indent}└─┘`,
	].join('\n'));
});

test('margin option with fullscreen is shrunk to fit the terminal', () => {
	// The box fills the terminal, so the margin has no room and is shrunk like any other margin
	const columns = Number(process.env.COLUMNS);
	const box = boxen('foo', {
		fullscreen: true,
		margin: 1,
	});

	assert.equal(box, [
		'',
		`┌${'─'.repeat(columns - 2)}┐`,
		`│foo${' '.repeat(columns - 5)}│`,
		`└${'─'.repeat(columns - 2)}┘`,
		'',
	].join('\n'));
});

test('margin option with a width that fits the terminal is kept', () => {
	// The box and the margin that is drawn fit the terminal, so the margin is kept
	const box = boxen('foo', {
		width: 20,
		margin: 10,
	});
	const indent = ' '.repeat(30);

	assert.equal(box, [
		...Array.from({length: 10}, () => ''),
		`${indent}┌──────────────────┐`,
		`${indent}│foo               │`,
		`${indent}└──────────────────┘`,
		...Array.from({length: 10}, () => ''),
	].join('\n'));
});

test('margin option with a width as wide as the terminal is shrunk', () => {
	// The margin has no room next to a box that fills the terminal
	const columns = Number(process.env.COLUMNS);
	const box = boxen('foo', {
		width: columns,
		margin: 10,
	});

	assert.equal(box, [
		...Array.from({length: 10}, () => ''),
		`┌${'─'.repeat(columns - 2)}┐`,
		`│foo${' '.repeat(columns - 5)}│`,
		`└${'─'.repeat(columns - 2)}┘`,
		...Array.from({length: 10}, () => ''),
	].join('\n'));
});

test('margin option with padding', t => {
	const box = boxen('foo', {
		margin: 1,
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('margin proportionally decreases when content <= columns', t => {
	// Plenty space
	let box = boxen('x'.repeat((process.env.COLUMNS / 2) - 2), {
		margin: 2,
	});

	t.assert.snapshot(box);

	// A bit of space
	box = boxen('x'.repeat(process.env.COLUMNS - 6 - 2), {
		margin: 2,
	});

	t.assert.snapshot(box);

	// No room
	box = boxen('ax'.repeat(process.env.COLUMNS - 2), {
		margin: 2,
	});

	t.assert.snapshot(box);
});

test('margin option wider than the terminal', t => {
	// A margin that leaves no room should not throw
	const box = boxen('foo', {
		margin: {
			right: process.env.COLUMNS * 2,
		},
	});

	// The margin is shrunk, so the content is kept
	t.assert.ok(box.includes('│foo│'));

	t.assert.snapshot(box);
});

test('margin option with border style (none)', t => {
	const box = boxen('foo', {
		margin: {
			top: 1,
			bottom: 1,
			left: 1,
			right: 1,
		},
		borderStyle: 'none',
	});

	t.assert.snapshot(box);
});
