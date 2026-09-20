import assert from 'node:assert/strict';
import {test} from 'node:test';
import boxen from '../index.js';
import './setup.js';

test('border color (red)', t => {
	const box = boxen('foo', {
		borderColor: 'red',
	});

	t.assert.snapshot(box);
});

test('border color (blue)', t => {
	const box = boxen('foo', {
		borderColor: 'blue',
	});

	t.assert.snapshot(box);
});

test('border color (green)', t => {
	const box = boxen('foo', {
		borderColor: 'green',
	});

	t.assert.snapshot(box);
});

test('border color (yellow + dim)', t => {
	const box = boxen('foo', {
		borderColor: 'green',
		dimBorder: true,
	});

	t.assert.snapshot(box);
});

test('border color (hex)', t => {
	const box = boxen('foo', {
		borderColor: '#FF00FF',
		dimBorder: true,
	});

	t.assert.snapshot(box);
});

test('throws on unexpected borderColor', () => {
	assert.throws(() => {
		boxen('foo', {borderColor: 'greasy-white'});
	}, {message: 'greasy-white is not a valid borderColor'});
});

test('border style (single)', t => {
	const box = boxen('foo', {
		borderStyle: 'single',
	});

	t.assert.snapshot(box);
});

test('border style (singleDouble)', t => {
	const box = boxen('foo', {
		borderStyle: 'singleDouble',
	});

	t.assert.snapshot(box);
});

test('border style (doubleSingle)', t => {
	const box = boxen('foo', {
		borderStyle: 'doubleSingle',
	});

	t.assert.snapshot(box);
});

test('border style (double)', t => {
	const box = boxen('foo', {
		borderStyle: 'double',
	});

	t.assert.snapshot(box);
});

test('border style (classic)', t => {
	const box = boxen('foo', {
		borderStyle: 'classic',
	});

	t.assert.snapshot(box);
});

test('border style (bold)', t => {
	const box = boxen('foo', {
		borderStyle: 'bold',
	});

	t.assert.snapshot(box);
});

test('border style (round)', t => {
	const box = boxen('foo', {
		borderStyle: 'round',
	});

	t.assert.snapshot(box);
});

test('border style (none)', t => {
	const box = boxen('foo', {
		borderStyle: 'none',
	});

	t.assert.snapshot(box);
});

test('border style (custom ascii style)', t => {
	const box = boxen('foo', {
		borderStyle: {
			topLeft: '1',
			topRight: '2',
			bottomLeft: '3',
			bottomRight: '4',
			left: '|',
			right: '!',
			top: '-',
			bottom: '_',
		},
	});

	t.assert.snapshot(box);
});

test('nullish border style falls back to the default', () => {
	// An option that is explicitly `undefined` must not break the box
	assert.equal(boxen('foo', {borderStyle: undefined}), boxen('foo'));
	assert.equal(boxen('foo', {borderStyle: null}), boxen('foo'));
});

test('an empty top and bottom side is filled with spaces', () => {
	// The corners have to line up with the rows of the box
	const borderStyle = {
		topLeft: '1',
		topRight: '2',
		bottomLeft: '3',
		bottomRight: '4',
		top: '',
		bottom: '',
		left: '|',
		right: '|',
	};

	assert.equal(boxen('foo', {borderStyle}), '1   2\n|foo|\n3   4');

	// A label uses the same width as the rows
	assert.equal(boxen('foo', {borderStyle, title: 't'}), '1 t 2\n|foo|\n3   4');
});

test('deprecated vertical and horizontal border sides still work', () => {
	const box = boxen('foo', {
		borderStyle: {
			topLeft: '1',
			topRight: '2',
			bottomLeft: '3',
			bottomRight: '4',
			horizontal: '-',
			vertical: '|',
		},
	});

	assert.equal(box, '1---2\n|foo|\n3---4');
});

test('deprecated vertical and horizontal border sides are a fallback', () => {
	// The deprecated sides must not override the real ones
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
			horizontal: 'H',
			vertical: 'V',
		},
	});

	assert.equal(box, '1---2\n|foo!\n3___4');
});

test('does not modify the border style object', () => {
	const borderStyle = {
		topLeft: '1',
		topRight: '2',
		bottomLeft: '3',
		bottomRight: '4',
		horizontal: '-',
		vertical: '|',
	};

	// The object belongs to the caller
	assert.equal(boxen('foo', {borderStyle}), '1---2\n|foo|\n3---4');
	assert.deepEqual(borderStyle, {
		topLeft: '1',
		topRight: '2',
		bottomLeft: '3',
		bottomRight: '4',
		horizontal: '-',
		vertical: '|',
	});
});

test('throws on unexpected borderStyle as string', () => {
	assert.throws(() => {
		boxen('foo', {borderStyle: 'shakenSnake'});
	}, {message: 'Invalid border style: shakenSnake'});
});

test('throws on a border style name that only exists on the prototype', () => {
	// A name that is inherited from `Object` is not a border style either
	assert.throws(() => {
		boxen('foo', {borderStyle: 'constructor'});
	}, {message: 'Invalid border style: constructor'});

	assert.throws(() => {
		boxen('foo', {borderStyle: 'toString'});
	}, {message: 'Invalid border style: toString'});
});

test('throws on unexpected borderStyle as object', () => {
	assert.throws(() => {
		boxen('foo', {borderStyle: {shake: 'snake'}});
	}, {message: 'Invalid border style: topLeft'});

	// Missing bottomRight
	const invalid = {
		topLeft: '1',
		topRight: '2',
		bottomLeft: '3',
		horizontal: '-',
		vertical: '|',
	};

	assert.throws(() => {
		boxen('foo', {borderStyle: invalid});
	}, {message: 'Invalid border style: bottomRight'});
});
