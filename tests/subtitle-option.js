import test from 'ava';
import boxen from '../index.js';

test('subtitle option works', t => {
	const box = boxen('foo', {
		subtitle: 'subtitle',
	});

	t.snapshot(box);
});

test('subtitle align left', t => {
	const box = boxen('foo bar foo bar', {
		subtitle: 'subtitle',
		subtitleAlignment: 'left',
	});

	t.snapshot(box);
});

test('subtitle align center', t => {
	const box = boxen('foo bar foo bar', {
		subtitle: 'subtitle',
		subtitleAlignment: 'center',
	});

	t.snapshot(box);
});

test('subtitle align right', t => {
	const box = boxen('foo bar foo bar', {
		subtitle: 'subtitle',
		subtitleAlignment: 'right',
	});

	t.snapshot(box);
});

test('long subtitle expands box', t => {
	const box = boxen('foo', {
		subtitle: 'very long subtitle',
	});

	t.snapshot(box);
});

test('subtitle + width option', t => {
	// Not enough space, no subtitle
	t.snapshot(
		boxen('foo', {
			subtitle: 'very long subtitle',
			width: 3,
		}),
	);

	// Space for only one character
	t.snapshot(
		boxen('foo', {
			subtitle: 'very long subtitle',
			width: 5,
		}),
	);

	t.snapshot(
		boxen('foo', {
			subtitle: 'very long subtitle',
			width: 20,
		}),
	);
});

test('subtitle option with border style (none)', t => {
	const box = boxen('foo', {
		subtitle: 'subtitle',
		borderStyle: 'none',
	});

	t.snapshot(box);
});
