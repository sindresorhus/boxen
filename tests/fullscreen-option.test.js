import assert from 'node:assert/strict';
import process from 'node:process';
import {
	after,
	before,
	describe,
	test,
} from 'node:test';
import boxen from '../index.js';
import './setup.js';

test('fullscreen option uses the terminal width', () => {
	// The box fills the terminal, which is the `COLUMNS` fallback when the output is not a terminal
	const columns = Number(process.env.COLUMNS);
	const [topBorder] = boxen('foo', {fullscreen: true}).split('\n', 1);

	assert.equal(topBorder, `┌${'─'.repeat(columns - 2)}┐`);
});

test('fullscreen option', t => {
	const box = boxen('foo', {
		fullscreen: true,
	});

	t.assert.snapshot(box);
});

test('fullscreen option + width', t => {
	const box = boxen('foo', {
		fullscreen: true,
		width: 10,
	});

	t.assert.snapshot(box);
});

test('invalid dimensions do not override fullscreen', () => {
	const expected = boxen('foo', {fullscreen: true});

	assert.deepEqual([-1, Infinity, 'invalid'].map(width => boxen('foo', {fullscreen: true, width})), [expected, expected, expected]);
});

test('fullscreen option + height', t => {
	const box = boxen('foo', {
		fullscreen: true,
		height: 10,
	});

	t.assert.snapshot(box);
});

test('fullscreen option with callback', t => {
	const box = boxen('foo', {
		fullscreen: (width, height) => [width - 2, height - 2],
	});

	t.assert.snapshot(box);
});

describe('fullscreen option with a terminal that has a height', () => {
	const {LINES} = process.env;

	before(() => {
		// The `LINES` fallback is used when the output is not a terminal
		process.env.LINES = '10';
	});

	after(() => {
		if (LINES === undefined) {
			delete process.env.LINES;
		} else {
			process.env.LINES = LINES;
		}
	});

	test('fullscreen option uses the terminal height', () => {
		const box = boxen('foo', {fullscreen: true});

		assert.equal(box.split('\n').length, 10);
		assert.equal(box.split('\n').at(-1), `└${'─'.repeat(Number(process.env.COLUMNS) - 2)}┘`);

		// A size that is given wins over the terminal
		assert.equal(boxen('foo', {fullscreen: true, height: 5}).split('\n').length, 5);

		// The callback gets the terminal height
		assert.equal(boxen('foo', {fullscreen: (width, height) => [width, height / 2]}).split('\n').length, 5);

		assert.deepEqual([-1, Infinity, 'invalid'].map(height => boxen('foo', {fullscreen: true, height}).split('\n').length), [10, 10, 10]);
	});
});

describe('fullscreen option with a terminal height that is not a number', () => {
	before(() => {
		process.env.LINES = 'tall';
	});

	after(() => {
		delete process.env.LINES;
	});

	test('the height of the terminal is not used', () => {
		assert.equal(boxen('foo', {fullscreen: true}).split('\n').length, 3);
	});
});

test('fullscreen option without a terminal height keeps the height of the text', () => {
	// There is nothing to fill when the terminal has no height
	assert.equal(boxen('foo', {fullscreen: true}).split('\n').length, 3);
});
