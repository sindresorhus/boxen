import process from 'node:process';
import test from 'ava';
import boxen from '../index.js';

test('float option (left)', t => {
	const box = boxen('foo', {
		float: 'left',
	});

	t.snapshot(box);
});

test('float option (center)', t => {
	const box = boxen('foo', {
		float: 'center',
	});

	t.snapshot(box);
});

test('float option (right)', t => {
	const box = boxen('foo', {
		float: 'right',
	});

	t.snapshot(box);
});

test('float option (center) with margin', t => {
	const box = boxen('foo', {
		float: 'right',
		margin: {
			left: 3,
			top: 4,
		},
	});

	t.snapshot(box);
});

test('float option (right) with margin', t => {
	const box = boxen('foo', {
		float: 'right',
		margin: {
			right: 2,
			bottom: 5,
		},
	});

	t.snapshot(box);
});

test('float option (center) when content > columns', t => {
	const longContent = 'foobar'.repeat(process.env.COLUMNS);

	t.notThrows(() => {
		boxen(longContent, {
			float: 'center',
		});
	});

	const box = boxen(longContent, {
		float: 'center',
	});

	t.snapshot(box);
});

test('float option (right) when content > columns', t => {
	const longContent = 'foobar'.repeat(process.env.COLUMNS);

	t.notThrows(() => {
		boxen(longContent, {
			float: 'right',
		});
	});

	const box = boxen(longContent, {
		float: 'right',
	});

	t.snapshot(box);
});
