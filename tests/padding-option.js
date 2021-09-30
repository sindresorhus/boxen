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
