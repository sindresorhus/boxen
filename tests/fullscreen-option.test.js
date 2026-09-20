import assert from 'node:assert/strict';
import process from 'node:process';
import {test} from 'node:test';
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
