import assert from 'node:assert/strict';
import {test} from 'node:test';
import boxen from '../index.js';
import './setup.js';

test('width option works', t => {
	// Creates a wide box for little text
	t.assert.snapshot(
		boxen('foo', {
			width: 20,
		}),
	);

	// Creates a small box for a lot of text
	t.assert.snapshot(
		boxen('foo bar foo bar', {
			width: 10,
		}),
	);
});

test('width option with padding + margin', t => {
	// Creates a wide box for little text
	const box = boxen('foo', {
		width: 20,
		margin: 2,
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('width option with big padding', t => {
	// Should disable the paddings
	const box = boxen('foo', {
		width: 6,
		padding: 3,
	});

	t.assert.snapshot(box);
});

test('the box is as wide as the text and its padding', () => {
	const box = boxen('foo bar', {
		padding: {
			left: 2,
			right: 3,
		},
	});
	const [topBorder] = box.split('\n', 1);

	// The border adds a column on each side
	assert.equal(topBorder, `┌${'─'.repeat(12)}┐`);
});

test('the box is not wider than the text', () => {
	// A wrapped row must be measured the way it is drawn, without the whitespace that the wrapping drops
	const box = boxen('xxxxxxxxxxxx bb bb bb', {
		maxWidth: 15,
	});

	assert.equal(box, [
		'┌────────────┐',
		'│xxxxxxxxxxxx│',
		'│bb bb bb    │',
		'└────────────┘',
	].join('\n'));
});

test('width option that is not a finite number', () => {
	// A size that is not a finite number is meaningless and would throw when the box is built
	assert.equal(boxen('foo', {width: Infinity}), boxen('foo'));
	assert.equal(boxen('foo', {width: -Infinity}), boxen('foo'));
	assert.equal(boxen('foo', {width: NaN}), boxen('foo'));
	assert.equal(boxen('foo', {maxWidth: Infinity}), boxen('foo'));
	assert.equal(boxen('foo', {maxWidth: NaN}), boxen('foo'));

	// A size of 0 means it is not set too, so it must not drop a title or footer
	assert.equal(boxen('foo bar', {width: 0, title: 'Hi'}), boxen('foo bar', {title: 'Hi'}));
	assert.equal(boxen('foo', {maxWidth: 0}), boxen('foo'));
});

test('width option that can not be a width', () => {
	// A negative size is as meaningless as a size of 0, and it must not crop the box or drop a title
	assert.equal(boxen('foo', {width: -5}), boxen('foo'));
	assert.equal(boxen('foo', {maxWidth: -5}), boxen('foo'));
	assert.equal(boxen('foo bar', {width: -5, title: 'Hi'}), boxen('foo bar', {title: 'Hi'}));
});

test('width option with border style (none)', t => {
	const box = boxen('foo', {
		width: 3,
		borderStyle: 'none',
	});

	t.assert.snapshot(box);
});

test('width option with a character wider than the box', t => {
	// A character that is wider than the content area overflows the box instead of throwing
	t.assert.snapshot(
		boxen('字', {
			width: 2,
		}),
	);

	t.assert.snapshot(
		boxen('字', {
			width: 2,
			textAlignment: 'center',
		}),
	);

	t.assert.snapshot(
		boxen('字', {
			width: 2,
			textAlignment: 'right',
		}),
	);
});
