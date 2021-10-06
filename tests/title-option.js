import test from 'ava';
import boxen from '../index.js';

test('title option works', t => {
	const box = boxen('foo', {
		title: 'title',
	});

	t.snapshot(box);
});

test('title align left', t => {
	const box = boxen('foo bar foo bar', {
		title: 'title',
		titleAlignment: 'left',
	});

	t.snapshot(box);
});

test('title align center', t => {
	const box = boxen('foo bar foo bar', {
		title: 'title',
		titleAlignment: 'center',
	});

	t.snapshot(box);
});

test('title align right', t => {
	const box = boxen('foo bar foo bar', {
		title: 'title',
		titleAlignment: 'right',
	});

	t.snapshot(box);
});

test('long title expands box', t => {
	const box = boxen('foo', {
		title: 'very long title',
	});

	t.snapshot(box);
});

test('title + width option', t => {
	// Not enough space, no title
	let box = boxen('foo', {
		title: 'very long title',
		width: 3,
	});

	t.snapshot(box);

	// Space for only one character
	box = boxen('foo', {
		title: 'very long title',
		width: 5,
	});

	t.snapshot(box);

	box = boxen('foo', {
		title: 'very long title',
		width: 20,
	});

	t.snapshot(box);
});
