import test from 'ava';
import boxen from '../index.js';

test('padding option works', t => {
	const box = boxen('foo', {
		padding: 2,
	});

	t.snapshot(box);
});

test('padding option advanced', t => {
	const box = boxen('foo', {
		padding: {
			top: 0,
			bottom: 2,
			left: 5,
			right: 10,
		},
	});

	t.snapshot(box);
});

test('padding option with border style (none)', t => {
	const box = boxen('foo', {
		padding: {
			top: 1,
			bottom: 1,
			left: 1,
			right: 1,
		},
		borderStyle: 'none',
	});

	t.snapshot(box);
});
