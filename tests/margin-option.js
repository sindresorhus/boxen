import process from 'node:process';
import test from 'ava';
import boxen from '../index.js';

test('margin option works', t => {
	const box = boxen('foo', {
		margin: 2,
	});

	t.snapshot(box);
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

	t.snapshot(box);
});

test('margin option with padding', t => {
	const box = boxen('foo', {
		margin: 1,
		padding: 1,
	});

	t.snapshot(box);
});

test('margin proportionally decreases when content <= columns', t => {
	// Plenty space
	let box = boxen('x'.repeat((process.env.COLUMNS / 2) - 2), {
		margin: 2,
	});

	t.snapshot(box);

	// A bit of space
	box = boxen('x'.repeat(process.env.COLUMNS - 6 - 2), {
		margin: 2,
	});

	t.snapshot(box);

	// No room
	box = boxen('ax'.repeat(process.env.COLUMNS - 2), {
		margin: 2,
	});

	t.snapshot(box);
});
