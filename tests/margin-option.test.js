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
