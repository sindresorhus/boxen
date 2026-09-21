import assert from 'node:assert/strict';
import process from 'node:process';
import {test} from 'node:test';
import chalk from 'chalk';
import stringWidth from 'string-width';
import boxen from '../index.js';
import './setup.js';

const longText = [
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id erat arcu. Integer urna mauris, sodales vel egestas eu, consequat id turpis. Vivamus faucibus est',
	'mattis tincidunt lobortis. In aliquam placerat nunc eget viverra. Duis aliquet faucibus diam, blandit tincidunt magna congue eu. Sed vel ante vestibulum, maximus risus',
	'eget, iaculis velit. Quisque id dapibus purus, ut sodales lorem. Aenean laoreet iaculis tellus at malesuada. Donec imperdiet eu lacus vitae fringilla.',
].join(' ');

const formattedText = `
!!!  Unicorns are lit !!!
Hello this is a formatted text !
				It has alignements
				already includes 
				in it. 
Boxen should protect this alignement,
		otherwise the users would be sad !
Hehe          Haha${' '.repeat(33)}
Hihi       Hoho
	All this garbage is on purpose.
Have a good day !
`;

const randomText = [
	'lewb{+^PN_6-l 8eK2eqB:jn^YFgGl;wuT)mdA9TZlf 9}?X#P49`x"@+nLx:BH5p{5_b`S\'E8\0{A0l"(62`TIf(z8n2arEY~]y|bk,6,FYf~rGY*Xfa00q{=fdm=4.zVf6#\'|3S!`pJ3 6y02]nj2',
	'o4?-`1v$mudH?Wbw3fZ]a+aE\'\'P4Q(6:NHBry)L_&/7v]0<!7<kw~gLc.)\'ajS>\0~y8PZ*|-BRY&m%UaCe\'3A,N?8&wbOP}*.O<47rnPzxO=4"*|[%A):;E)Z6!V&x!1*OprW-*+q<F$6|864~1HmY',
	'X@J#Nl1j1`!$Y~j^`j;PB2qpe[_;.+vJGnE3) yo&5qRI~WHxK~r%+\'P>Up&=P6M<kDdpSL#<Ur/[NN0qI3dFEEy|>_VGx0O/VOvPEez:7C58a^.N,"Rxc|a6C[i$3QC_)~x!wd+ZMtYsGF&?',
].join('');

test('creates a box', t => {
	const box = boxen('foo');

	t.assert.snapshot(box);
});

test('box not overflowing terminal', t => {
	const box = boxen('foo'.repeat(process.env.COLUMNS));

	t.assert.snapshot(box);
});

test('box not overflowing terminal with padding', t => {
	const box = boxen('foo'.repeat(process.env.COLUMNS), {
		padding: 3,
	});

	t.assert.snapshot(box);
});

test('box not overflowing terminal with words', t => {
	const box = boxen('foo '.repeat(process.env.COLUMNS));

	t.assert.snapshot(box);
});

test('box not overflowing terminal with words + padding', t => {
	const box = boxen('foo '.repeat(process.env.COLUMNS), {
		padding: 2,
	});

	t.assert.snapshot(box);
});

test('box not overflowing terminal with words + padding + margin', t => {
	const box = boxen('foo '.repeat(process.env.COLUMNS), {
		padding: 2,
		margin: 1,
	});

	t.assert.snapshot(box);
});

test('handles Windows line endings', () => {
	// A carriage return would move the cursor back and break the box
	const box = boxen('foo\r\nbar');

	assert.equal(box, [
		'┌───┐',
		'│foo│',
		'│bar│',
		'└───┘',
	].join('\n'));
});

test('handles a lone carriage return', () => {
	// A carriage return would move the cursor back and break the box
	assert.equal(boxen('foo\rbar'), '┌───┐\n│foo│\n│bar│\n└───┘');
});

test('handles a vertical tab and a form feed', () => {
	// A vertical tab and a form feed move the cursor down, which would break the box
	assert.equal(boxen('foo\vbar'), '┌───┐\n│foo│\n│bar│\n└───┘');
	assert.equal(boxen('foo\fbar'), '┌───┐\n│foo│\n│bar│\n└───┘');
});

test('handles Windows line endings with wrapped text', () => {
	const box = boxen('foo bar baz qux quux corge grault\r\n    indented', {
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

test('handles empty text', () => {
	assert.equal(boxen(''), '┌─┐\n│ │\n└─┘');
});

test('handles a hyperlink', () => {
	// A hyperlink is drawn as its text, so only the text counts for the box
	const link = '\u{1B}]8;;https://example.com\u{1B}\\click\u{1B}]8;;\u{1B}\\';

	assert.equal(boxen(link), `┌─────┐\n│${link}│\n└─────┘`);
});

test('does not modify the options', () => {
	const options = {
		borderStyle: {
			topLeft: '1',
			topRight: '2',
			bottomLeft: '3',
			bottomRight: '4',
			top: '-',
			bottom: '-',
			left: '|',
			right: '|',
		},
		padding: {
			top: 1, right: 2, bottom: 3, left: 4,
		},
		margin: {
			top: 0, right: 1, bottom: 2, left: 3,
		},
		title: 'title',
		footer: 'footer',
		width: 20,
		height: 5,
		float: 'center',
		textAlignment: 'center',
		titleAlignment: 'right',
		footerAlignment: 'center',
		borderColor: 'red',
		backgroundColor: 'blue',
	};
	const copy = structuredClone(options);

	// The object belongs to the caller
	boxen('foo bar', options);

	assert.deepEqual(options, copy);
});

test('handles a lone surrogate', () => {
	// Cutting a character in half leaves a lone surrogate, which is written as a replacement character
	const half = '👍'.slice(0, 1);
	const box = boxen(half + 'abc');

	assert.equal(box, [
		'┌────┐',
		'│\u{FFFD}abc│',
		'└────┘',
	].join('\n'));

	// A title and a footer are normalized the same way
	assert.equal(boxen('foo', {title: half}), '┌ \u{FFFD} ┐\n│foo│\n└───┘');
	assert.equal(boxen('foo', {footer: half}), '┌───┐\n│foo│\n└ \u{FFFD} ┘');
});

test('handles a long word in a narrow box', () => {
	// The rows of a single line must not be spread into a function call either
	const box = boxen('a'.repeat(130_000), {maxWidth: 3});
	const lines = box.split('\n');

	assert.equal(lines.length, 130_002);
	assert.equal(lines[0], '┌─┐');
});

test('handles many lines', () => {
	// The lines must not be spread into a function call, which overflows the stack on a long text
	const lines = 130_000;
	const box = boxen('x\n'.repeat(lines));

	assert.equal(box.split('\n').length, lines + 3);
});

test('handles long text', t => {
	const box = boxen(longText);

	t.assert.snapshot(box);
});

test('handles formatted text', t => {
	const box = boxen(formattedText);

	t.assert.snapshot(box);
});

test('handles random text', t => {
	const box = boxen(randomText);

	t.assert.snapshot(box);
});

test('handles colored texts', t => {
	let box = boxen(chalk.red(longText));

	t.assert.snapshot(box);

	box = boxen(chalk.blue(formattedText));

	t.assert.snapshot(box);

	box = boxen(chalk.yellow(randomText));

	t.assert.snapshot(box);
});

test('every row of the box ends on the same column', () => {
	// The border, the text and the padding are drawn next to each other, so a row that is measured wrong does not line up
	const texts = ['foo', '', 'foo bar baz qux quux corge grault', 'a\nbb\nccc\ndddd', '   indented  ', 'a b c d e f g h i j k l m n o p', '字', 'foo 字 bar', 'a\tb', 'a\bb'];
	const wideCorners = {
		topLeft: '中',
		topRight: '中',
		bottomLeft: '中',
		bottomRight: '中',
		top: '-',
		bottom: '-',
		left: '|',
		right: '|',
	};
	const wideSides = {
		topLeft: '+',
		topRight: '+',
		bottomLeft: '+',
		bottomRight: '+',
		top: '-',
		bottom: '-',
		left: '||',
		right: '||',
	};
	const optionSets = [
		{},
		{padding: 1},
		{
			padding: {
				top: 1, right: 3, bottom: 2, left: 4,
			},
		},
		{margin: 2},
		{width: 12},
		{maxWidth: 12},
		{height: 5},
		{height: 2},
		{
			title: 'title',
			footer: 'footer',
		},
		{float: 'right'},
		{float: 'center', margin: 1},
		{borderStyle: 'none', title: 'title'},
		{textAlignment: 'center'},
		{textAlignment: 'right', padding: 1},
		{borderStyle: wideCorners},
		{borderStyle: wideCorners, title: 'title', footer: 'footer'},
		{borderStyle: wideSides},
		{borderStyle: wideSides, title: 'title'},
		{maxWidth: 3},
		{width: 2},
		{title: '中', padding: 1},
	];
	const misaligned = [];

	for (const text of texts) {
		for (const options of optionSets) {
			const box = boxen(text, options);
			const rows = box.split('\n').filter(row => row.trim() !== '');
			const widths = rows.map(row => stringWidth(row));

			if (new Set(widths).size > 1) {
				misaligned.push({
					text,
					options,
					widths,
				});
			}
		}
	}

	assert.deepEqual(misaligned, []);
});

test('the box is as wide as the text and its padding', () => {
	// The box grows with the text up to the terminal and `maxWidth`, and it is never wider than the text needs
	const cases = [
		['foo', {}, 5],
		['foo', {padding: 1}, 11],
		['foo bar baz', {padding: {left: 2, right: 3}}, 18],
		// The box grows up to `maxWidth` and no further
		['foo bar baz qux quux corge', {maxWidth: 20}, 17],
		['', {}, 3],
		['foo', {title: 't'}, 5],
		['foo', {footer: 'a longer footer'}, 19],
	];
	const wrong = [];

	for (const [text, options, expected] of cases) {
		const [firstRow] = boxen(text, options).split('\n', 1);
		const actual = stringWidth(firstRow);

		if (actual !== expected) {
			wrong.push({
				text,
				options,
				expected,
				actual,
			});
		}
	}

	assert.deepEqual(wrong, []);
});

test('the box never becomes wider than the terminal', () => {
	const columns = Number(process.env.COLUMNS);
	const text = 'foo bar baz qux quux corge grault';
	const cases = [
		[text, {}],
		[text, {padding: 2}],
		[text, {margin: 3}],
		[text, {title: 'a title that is way too long'}],
		[text, {float: 'right'}],
		[text, {float: 'center', margin: 2}],
		['x'.repeat(columns * 2), {}],
		['', {margin: columns}],
	];
	const overflowed = [];

	for (const [value, options] of cases) {
		const box = boxen(value, options);

		for (const row of box.split('\n')) {
			if (stringWidth(row) > columns) {
				overflowed.push({value: value.slice(0, 20), options, row});
			}
		}
	}

	assert.deepEqual(overflowed, []);
});

test('a size that is given is the size the box has', () => {
	// The same box without a size is the box the text needs, so a size that is the size of the box does not change it
	const box = boxen('foo bar');
	const [firstRow] = box.split('\n', 1);

	assert.equal(boxen('foo bar', {width: stringWidth(firstRow)}), box);
	assert.equal(boxen('foo bar', {maxWidth: stringWidth(firstRow)}), box);
	assert.equal(boxen('foo bar', {height: box.split('\n').length}), box);
	assert.equal(boxen('foo bar', {borderStyle: 'single'}), box);
	assert.equal(boxen('foo bar', {padding: 0, margin: 0}), box);
	assert.equal(boxen('foo bar', {textAlignment: 'left', float: 'left', dimBorder: false}), box);
});
