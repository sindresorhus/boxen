import test from 'ava';
import {Chalk} from 'chalk';
import boxen from '../index.js';

const level3Chalk = new Chalk({level: 3});

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
	t.snapshot(
		boxen('foo', {
			title: 'very long title',
			width: 3,
		}),
	);

	// Space for only one character
	t.snapshot(
		boxen('foo', {
			title: 'very long title',
			width: 5,
		}),
	);

	t.snapshot(
		boxen('foo', {
			title: 'very long title',
			width: 20,
		}),
	);

	t.snapshot(
		boxen('foo', {
			title: level3Chalk.red('colorful title'),
			width: 18,
		}),
	);
});

test('title option with border style (none)', t => {
	const box = boxen('foo', {
		title: 'title',
		borderStyle: 'none',
	});

	t.snapshot(box);
});
