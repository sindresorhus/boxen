import assert from 'node:assert/strict';
import {test} from 'node:test';
import boxen from '../index.js';
import './setup.js';

const longText = [
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id erat arcu. Integer urna mauris, sodales vel egestas eu, consequat id turpis. Vivamus faucibus est',
	'mattis tincidunt lobortis. In aliquam placerat nunc eget viverra. Duis aliquet faucibus diam, blandit tincidunt magna congue eu. Sed vel ante vestibulum, maximus risus',
	'eget, iaculis velit. Quisque id dapibus purus, ut sodales lorem. Aenean laoreet iaculis tellus at malesuada. Donec imperdiet eu lacus vitae fringilla.',
].join(' ');

test('text alignement option (left)', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'left',
	});

	t.assert.snapshot(box);
});

test('text alignement option (center)', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'center',
	});

	t.assert.snapshot(box);
});

test('text alignement option (right)', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'right',
	});

	t.assert.snapshot(box);
});

test('nullish text alignment means the default', () => {
	// An option that is explicitly `undefined` must not change the layout
	assert.equal(
		boxen('foo\nbarbaz', {width: 10, textAlignment: undefined}),
		boxen('foo\nbarbaz', {width: 10}),
	);

	assert.equal(boxen('foo', {width: 10, align: undefined}), boxen('foo', {width: 10}));
});

test('text alignement option (left) + padding', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'left',
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('text alignement option (center) + padding', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'center',
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('text alignement option (right) + padding', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'right',
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('text alignement option (left) + long title', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'left',
		title: 'This is a famous movie quote:',
	});

	t.assert.snapshot(box);
});

test('text alignement option (center) + long title', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'center',
		title: 'This is a famous movie quote:',
	});

	t.assert.snapshot(box);
});

test('text alignement option (right) + long title', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'right',
		title: 'This is a famous movie quote:',
	});

	t.assert.snapshot(box);
});

test('text alignement option (left) + long title + padding', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'left',
		title: 'This is a famous movie quote:',
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('text alignement option (center) + long title + padding', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'center',
		title: 'This is a famous movie quote:',
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('text alignement option (right) + long title + padding', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'right',
		title: 'This is a famous movie quote:',
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('text alignement option (left) + long title + padding + margin', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'left',
		title: 'This is a famous movie quote:',
		margin: 1,
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('text alignement option (center) + long title + padding + margin', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'center',
		title: 'This is a famous movie quote:',
		margin: 1,
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('text alignement option (right) + long title + padding + margin', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'right',
		title: 'This is a famous movie quote:',
		margin: 1,
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('deprecated align option is a fallback for textAlignment', () => {
	// The deprecated option must not override the option that replaces it
	assert.equal(
		boxen('foo', {align: 'center', textAlignment: 'right', width: 10}),
		boxen('foo', {textAlignment: 'right', width: 10}),
	);

	assert.equal(
		boxen('foo', {align: 'right', width: 10}),
		boxen('foo', {textAlignment: 'right', width: 10}),
	);
});

test('text alignement option (left) keeps the whitespace of lines that fit', () => {
	// Wrapping a line must not trim the lines that fit in the box
	const box = boxen('foo bar baz qux quux corge grault\n    indented  ', {
		width: 20,
	});

	assert.equal(box, [
		'┌──────────────────┐',
		'│foo bar baz qux   │',
		'│quux corge grault │',
		'│    indented      │',
		'└──────────────────┘',
	].join('\n'));
});

test('text alignement option (center) after wrapping', t => {
	const box = boxen(longText, {
		textAlignment: 'center',
	});

	t.assert.snapshot(box);
});

test('text alignement option (center) keeps the lines of a wrapped text centered', () => {
	// The alignment has to measure the rows that are drawn, or a line that fits lands in the wrong column
	const box = boxen(`hi\n${'x'.repeat(30)}`, {
		width: 20,
		textAlignment: 'center',
	});

	assert.equal(box, [
		'┌──────────────────┐',
		'│        hi        │',
		'│xxxxxxxxxxxxxxxxxx│',
		'│   xxxxxxxxxxxx   │',
		'└──────────────────┘',
	].join('\n'));
});

test('text alignement option (right) with a character wider than the box', () => {
	// The character overflows the box, but the rows that fit are not pushed out with it
	const box = boxen('👍\nb', {
		width: 3,
		textAlignment: 'right',
	});

	assert.equal(box, [
		'┌─┐',
		'│👍│',
		'│b│',
		'└─┘',
	].join('\n'));
});

test('text alignement option (right) after wrapping', t => {
	const box = boxen(longText, {
		textAlignment: 'right',
	});

	t.assert.snapshot(box);
});

test('text alignement option (center) after wrapping + padding', t => {
	const box = boxen(longText, {
		textAlignment: 'center',
		padding: 1,
	});

	t.assert.snapshot(box);
});

test('text alignement option (right) after wrapping a zero width character', () => {
	// A soft hyphen is zero columns wide, and the rows are aligned with the width the box measures
	const box = boxen('\u{AD} soft hyphen', {
		width: 5,
		textAlignment: 'right',
	});

	assert.equal(box, [
		'┌───┐',
		'│\u{AD}sof│',
		'│  t│',
		'│hyp│',
		'│hen│',
		'└───┘',
	].join('\n'));
});

test('text alignement option (right) after wrapping + padding + margin', t => {
	const box = boxen(longText, {
		textAlignment: 'center',
		margin: 1,
		padding: 1,
	});

	t.assert.snapshot(box);
});
