import assert from 'node:assert/strict';
import {test} from 'node:test';
import chalk from 'chalk';
import boxen from '../index.js';
import './setup.js';

/**
Run a function with ANSI colors enabled.

@param {() => string} callback - The function to run.
*/
const withColorEnabled = callback => {
	const {level} = chalk;
	chalk.level = 3;

	try {
		return callback();
	} finally {
		chalk.level = level;
	}
};

test('backgroundColor option', t => {
	const box = boxen('foo', {backgroundColor: 'red'});

	t.assert.snapshot(box);
});

test('backgroundColor option covers the padding', () => {
	const box = withColorEnabled(() => boxen('foo', {
		backgroundColor: 'red',
		padding: 1,
	}));

	// The background covers the text and the space around it, and stops at the border
	assert.ok(box.includes('\u{1B}[41m   foo   \u{1B}[49m'));
});

test('backgroundColor option with height', () => {
	const box = withColorEnabled(() => boxen('foo', {
		backgroundColor: 'red',
		height: 4,
	}));

	// The rows that fill the height are part of the content
	assert.ok(box.includes('\u{1B}[41m   \u{1B}[49m'));
});

test('dimBorder option only dims the border', () => {
	const box = withColorEnabled(() => boxen('foo', {
		backgroundColor: 'blue',
		dimBorder: true,
	}));

	assert.ok(box.includes('\u{1B}[2m\u{1B}[44m┌───┐\u{1B}[49m\u{1B}[22m'));
	assert.ok(box.includes('\u{1B}[44mfoo\u{1B}[49m'));
});

test('backgroundColor hex', t => {
	const box = boxen('foo', {backgroundColor: '#FF0000'});

	t.assert.snapshot(box);
});

test('throws on unexpected backgroundColor', () => {
	assert.throws(() => {
		boxen('foo', {backgroundColor: 'dark-yellow'});
	}, {message: 'dark-yellow is not a valid backgroundColor'});
});

test('borderBackgroundColor option', t => {
	const box = boxen('foo', {borderBackgroundColor: 'red'});

	t.assert.snapshot(box);
});

test('borderBackgroundColor hex', t => {
	const box = boxen('foo', {borderBackgroundColor: '#FF0000'});

	t.assert.snapshot(box);
});

test('borderBackgroundColor with conflicting backgroundColor', t => {
	const box = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: 'red'});

	t.assert.snapshot(box);
});

test('borderBackgroundColor and dimBorder option', t => {
	const box = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: 'red', dimBorder: true});

	t.assert.snapshot(box);
});

test('borderBackgroundColor option covers the title', () => {
	const box = withColorEnabled(() => boxen('foo', {
		title: 'title',
		borderBackgroundColor: 'red',
	}));

	assert.ok(box.includes('\u{1B}[41m┌ title ┐\u{1B}[49m'));
});

test('borderBackgroundColor inherit with backgroundColor', t => {
	const box = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: 'inherit'});

	t.assert.snapshot(box);
});

test('borderBackgroundColor inherit without backgroundColor', t => {
	const box = boxen('foo', {borderBackgroundColor: 'inherit'});

	t.assert.snapshot(box);
});

test('borderBackgroundColor undefined disables background', t => {
	const box = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: undefined});

	t.assert.snapshot(box);
});

test('borderBackgroundColor defaults to inherit', () => {
	const box1 = boxen('foo', {backgroundColor: 'blue'});
	const box2 = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: 'inherit'});

	assert.equal(box1, box2);
});

test('throws on unexpected borderBackgroundColor', () => {
	assert.throws(() => {
		boxen('foo', {borderBackgroundColor: 'dark-yellow'});
	}, {message: 'dark-yellow is not a valid borderBackgroundColor'});
});
