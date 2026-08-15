import test from 'ava';
import chalk, {Chalk} from 'chalk';
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

test('titleColor option', t => {
	chalk.level = 3;
	const box = boxen('foo', {
		title: 'title',
		titleColor: 'red',
	});
	chalk.level = 0;

	t.true(box.includes(level3Chalk.red('title')));
});

test('titleColor hex', t => {
	chalk.level = 3;
	const box = boxen('foo', {
		title: 'title',
		titleColor: '#FF0000',
	});
	chalk.level = 0;

	t.true(box.includes(level3Chalk.hex('#FF0000')('title')));
});

test('throws on unexpected titleColor', t => {
	t.throws(() => {
		boxen('foo', {
			title: 'title',
			titleColor: 'dark-yellow',
		});
	});
});

