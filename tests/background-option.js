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

test('borderBackgroundColor option', t => {
	const box = boxen('foo', {borderBackgroundColor: 'red'});

	t.snapshot(box);
});

test('borderBackgroundColor hex', t => {
	const box = boxen('foo', {borderBackgroundColor: '#FF0000'});

	t.snapshot(box);
});

test('borderBackgroundColor inherit with backgroundColor', t => {
	const box = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: 'inherit'});

	t.snapshot(box);
});

test('borderBackgroundColor inherit without backgroundColor', t => {
	const box = boxen('foo', {borderBackgroundColor: 'inherit'});

	t.snapshot(box);
});

test('borderBackgroundColor undefined disables background', t => {
	const box = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: undefined});

	t.snapshot(box);
});

test('borderBackgroundColor defaults to inherit', t => {
	const box1 = boxen('foo', {backgroundColor: 'blue'});
	const box2 = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: 'inherit'});

	t.is(box1, box2);
});

test('throws on unexpected borderBackgroundColor', t => {
	t.throws(() => {
		boxen('foo', {borderBackgroundColor: 'dark-yellow'});
	});
});
