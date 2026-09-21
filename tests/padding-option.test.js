import assert from 'node:assert/strict';
import {test} from 'node:test';
import boxen from '../index.js';
import './setup.js';

test('padding that is not a finite positive number is ignored', () => {
	// A negative padding would throw when the box is built
	assert.equal(boxen('foo', {padding: -1}), boxen('foo'));
	assert.equal(boxen('foo', {padding: {top: -2, left: -1}}), boxen('foo'));
	assert.equal(boxen('foo', {
		padding: {
			top: -1, right: -1, bottom: -1, left: -1,
		},
	}), boxen('foo'));

	// A missing side would corrupt the width of the box
	assert.equal(boxen('foo', {padding: {left: undefined}}), boxen('foo'));
	assert.equal(boxen('foo', {padding: {right: null}}), boxen('foo'));
	assert.equal(boxen('foo', {padding: NaN}), boxen('foo'));
	assert.equal(boxen('foo', {padding: Infinity}), boxen('foo'));
});

test('padding option works', t => {
	const box = boxen('foo', {
		padding: 2,
	});

	t.assert.snapshot(box);
});

test('padding option advanced', t => {
	const box = boxen('foo', {
		padding: {
			top: 0,
			bottom: 2,
			left: 5,
			right: 10,
		},
	});

	t.assert.snapshot(box);
});

test('padding option with border style (none)', t => {
	const box = boxen('foo', {
		padding: {
			top: 1,
			bottom: 1,
			left: 1,
			right: 1,
		},
		borderStyle: 'none',
	});

	t.assert.snapshot(box);
});

test('padding option that is not a whole number of columns', () => {
	// A side is drawn a whole number of columns wide, so the box is measured with the width that is drawn
	assert.equal(boxen('foo', {padding: {left: 2.5, right: 0.5}}), '┌─────┐\n│  foo│\n└─────┘');
	// A number is three times as wide on the sides, and the sides are floored to a whole column
	assert.equal(boxen('foo', {padding: 1.5}), '┌───────────┐\n│           │\n│    foo    │\n│           │\n└───────────┘');
	assert.equal(boxen('foo', {padding: {top: 1.5}}), '┌───┐\n│   │\n│foo│\n└───┘');
});
