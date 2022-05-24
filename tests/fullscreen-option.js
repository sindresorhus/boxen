import test from 'ava';
import boxen from '../index.js';

test('fullscreen option', t => {
	const box = boxen('foo', {
		fullscreen: true,
	});

	t.snapshot(box);
});

test('fullscreen option + width', t => {
	const box = boxen('foo', {
		fullscreen: true,
		width: 10,
	});

	t.snapshot(box);
});

test('fullscreen option + height', t => {
	const box = boxen('foo', {
		fullscreen: true,
		height: 10,
	});

	t.snapshot(box);
});

test('fullscreen option with callback', t => {
	const box = boxen('foo', {
		fullscreen: (w, h) => [w - 2, h - 2],
	});

	t.snapshot(box);
});
