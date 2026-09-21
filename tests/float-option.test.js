import assert from 'node:assert/strict';
import process from 'node:process';
import {test} from 'node:test';
import boxen from '../index.js';
import './setup.js';

test('float option (left)', t => {
	const box = boxen('foo', {
		float: 'left',
	});

	t.assert.snapshot(box);
});

test('float option (center)', t => {
	const box = boxen('foo', {
		float: 'center',
	});

	t.assert.snapshot(box);
});

test('float option (right)', t => {
	const box = boxen('foo', {
		float: 'right',
	});

	t.assert.snapshot(box);
});

test('float option (center) with margin', t => {
	const box = boxen('foo', {
		float: 'right',
		margin: {
			left: 3,
			top: 4,
		},
	});

	t.assert.snapshot(box);
});

test('float option (right) with margin', t => {
	const box = boxen('foo', {
		float: 'right',
		margin: {
			right: 2,
			bottom: 5,
		},
	});

	t.assert.snapshot(box);
});

test('float option (center) when content > columns', t => {
	const longContent = 'foobar'.repeat(process.env.COLUMNS);

	const box = boxen(longContent, {
		float: 'center',
	});

	t.assert.snapshot(box);
});

test('float option (right) when content > columns', t => {
	const longContent = 'foobar'.repeat(process.env.COLUMNS);

	const box = boxen(longContent, {
		float: 'right',
	});

	t.assert.snapshot(box);
});

test('a margin that is not drawn does not take columns from the content', () => {
	// A box that is floated is centered or pushed right instead of being indented, so its left margin is not drawn
	const text = 'x'.repeat(50);

	assert.equal(boxen(text, {float: 'center', margin: 2}), boxen(text, {float: 'center', margin: {top: 2, bottom: 2}}));
	assert.equal(boxen(text, {float: 'right', margin: {left: 2}}), boxen(text, {float: 'right'}));

	// The margin that is drawn still takes its columns
	assert.notEqual(boxen(text, {float: 'right', margin: {right: 2}}), boxen(text, {float: 'right'}));
	assert.notEqual(boxen(text, {float: 'left', margin: 1}), boxen(text));
});
