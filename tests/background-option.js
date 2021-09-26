import test from 'ava';
import boxen from '../index.js';

test('backgroundColor option', t => {
	const box = boxen('foo', {backgroundColor: 'red'});

	t.snapshot(box);
});

test('backgroundColor hex', t => {
	const box = boxen('foo', {backgroundColor: '#FF0000'});

	t.snapshot(box);
});

test('throws on unexpected backgroundColor', t => {
	t.throws(() => {
		boxen('foo', {backgroundColor: 'dark-yellow'});
	});
});
