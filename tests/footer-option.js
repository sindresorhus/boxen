import test from 'ava';
import boxen from '../index.js';

test('footer option works', t => {
	const box = boxen('foo', {
		footer: 'footer',
	});

	t.snapshot(box);
});

test('footer align left', t => {
	const box = boxen('foo bar foo bar', {
		footer: 'footer',
		footerAlignment: 'left',
	});

	t.snapshot(box);
});

test('footer align center', t => {
	const box = boxen('foo bar foo bar', {
		footer: 'footer',
		footerAlignment: 'center',
	});

	t.snapshot(box);
});

test('footer align right', t => {
	const box = boxen('foo bar foo bar', {
		footer: 'footer',
		footerAlignment: 'right',
	});

	t.snapshot(box);
});

test('long footer expands box', t => {
	const box = boxen('foo', {
		footer: 'very long footer',
	});

	t.snapshot(box);
});

test('footer + width option', t => {
	// Not enough space, no footer
	t.snapshot(
		boxen('foo', {
			footer: 'very long footer',
			width: 3,
		}),
	);

	// Space for only one character
	t.snapshot(
		boxen('foo', {
			footer: 'very long footer',
			width: 5,
		}),
	);

	t.snapshot(
		boxen('foo', {
			footer: 'very long footer',
			width: 20,
		}),
	);
});

test('footer option with border style (none)', t => {
	const box = boxen('foo', {
		footer: 'footer',
		borderStyle: 'none',
	});

	t.snapshot(box);
});
