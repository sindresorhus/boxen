import test from 'ava';
import boxen from '../index.js';

test('height option works', t => {
	// Creates a tall box with empty rows
	t.snapshot(
		boxen('foo', {
			height: 5,
		}),
	);

	// Creates a 1 line box, cropping the other lines
	t.snapshot(
		boxen('foo bar\nfoo bar', {
			height: 3,
		}),
	);
});

test('height option with padding + margin', t => {
	// Creates a wide box for little text
	const box = boxen('foo', {
		height: 20,
		margin: 2,
		padding: 1,
	});

	t.snapshot(box);
});

test('height option with width', t => {
	// Creates a wide box for little text
	const box = boxen('foo', {
		height: 5,
		width: 20,
	});

	t.snapshot(box);
});

test('height option with width + padding + margin', t => {
	// Creates a wide box for little text
	const box = boxen('foo', {
		height: 5,
		width: 20,
		margin: 2,
		padding: 1,
	});

	t.snapshot(box);
});
