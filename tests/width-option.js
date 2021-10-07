import test from 'ava';
import boxen from '../index.js';

test('width option works', t => {
	// Creates a wide box for little text
	t.snapshot(
		boxen('foo', {
			width: 20,
		})
	);

	// Creates a small box for a lot of text
	t.snapshot(
		boxen('foo bar foo bar', {
			width: 10,
		})
	);
});

test('width option with padding + margin', t => {
	// Creates a wide box for little text
	const box = boxen('foo', {
		width: 20,
		margin: 2,
		padding: 1,
	});

	t.snapshot(box);
});

test('width option with big padding', t => {
	// Should disable the paddings
	const box = boxen('foo', {
		width: 6,
		padding: 3,
	});

	t.snapshot(box);
});
