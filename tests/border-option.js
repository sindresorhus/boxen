import test from 'ava';
import boxen from '../index.js';

test('border color (red)', t => {
	const box = boxen('foo', {
		borderColor: 'red',
	});

	t.snapshot(box);
});

test('border color (blue)', t => {
	const box = boxen('foo', {
		borderColor: 'blue',
	});

	t.snapshot(box);
});

test('border color (green)', t => {
	const box = boxen('foo', {
		borderColor: 'green',
	});

	t.snapshot(box);
});

test('border color (yellow + dim)', t => {
	const box = boxen('foo', {
		borderColor: 'green',
		dimBorder: true,
	});

	t.snapshot(box);
});

test('border color (hex)', t => {
	const box = boxen('foo', {
		borderColor: '#FF00FF',
		dimBorder: true,
	});

	t.snapshot(box);
});

test('throws on unexpected borderColor', t => {
	t.throws(() => {
		boxen('foo', {borderColor: 'greasy-white'});
	});
});

test('border style (single)', t => {
	const box = boxen('foo', {
		borderStyle: 'single',
	});

	t.snapshot(box);
});

test('border style (singleDouble)', t => {
	const box = boxen('foo', {
		borderStyle: 'singleDouble',
	});

	t.snapshot(box);
});

test('border style (doubleSingle)', t => {
	const box = boxen('foo', {
		borderStyle: 'doubleSingle',
	});

	t.snapshot(box);
});

test('border style (double)', t => {
	const box = boxen('foo', {
		borderStyle: 'double',
	});

	t.snapshot(box);
});

test('border style (classic)', t => {
	const box = boxen('foo', {
		borderStyle: 'classic',
	});

	t.snapshot(box);
});

test('border style (bold)', t => {
	const box = boxen('foo', {
		borderStyle: 'bold',
	});

	t.snapshot(box);
});

test('border style (round)', t => {
	const box = boxen('foo', {
		borderStyle: 'round',
	});

	t.snapshot(box);
});

test('border style (custom ascii style)', t => {
	const box = boxen('foo', {
		borderStyle: {
			topLeft: '1',
			topRight: '2',
			bottomLeft: '3',
			bottomRight: '4',
			top: '-',
			bottom: '_',
			left: '|',
			right: '!',
		},
	});

	t.snapshot(box);
});

test('throws on unexpected borderStyle as string', t => {
	t.throws(() => {
		boxen('foo', {borderStyle: 'shakenSnake'});
	});
});

test('throws on unexpected borderStyle as object', t => {
	t.throws(() => {
		boxen('foo', {borderStyle: {shake: 'snake'}});
	});

	// Missing bottomRight
	const invalid = {
		topLeft: '1',
		topRight: '2',
		bottomLeft: '3',
		horizontal: '-',
		vertical: '|',
	};

	t.throws(() => {
		boxen('foo', {borderStyle: invalid});
	});
});
