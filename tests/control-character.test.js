import assert from 'node:assert/strict';
import {test} from 'node:test';
import stringWidth from 'string-width';
import boxen from '../index.js';
import './setup.js';

const TAB_STOP = 8;
const STYLING_ESCAPE = /\u{1B}(?:\[[0-9:;]*m|\][^\u{7}\u{1B}]*(?:\u{7}|\u{1B}\\))/vy;

/**
Draw the character at `index` the way a terminal does and give back the column it ends on with the width it takes in code units.

@param {string} row - The row being drawn.
@param {number} index - The index of the character to draw.
@param {number} column - The column the character starts on.
@returns {{column: number, size: number}} The column after the character and its size in code units.
*/
const drawCharacter = (row, index, column) => {
	const code = row.codePointAt(index);

	switch (code) {
		case 9: { // Tab
			return {column: column + TAB_STOP - (column % TAB_STOP), size: 1};
		}

		case 8: { // Backspace
			return {column: Math.max(0, column - 1), size: 1};
		}

		case 13: { // Carriage return
			return {column: 0, size: 1};
		}

		default: {
			if (code === 127 || code < 32) { // A control character draws nothing
				return {column, size: 1};
			}

			const character = String.fromCodePoint(code);

			return {column: column + stringWidth(character), size: character.length};
		}
	}
};

/**
Draw a row the way a terminal does and give back the column it ends on. A tab moves to the next tab stop, a backspace moves back, and an escape sequence draws nothing.

@param {string} row - The row to draw.
@returns {number} The column the row ends on.
*/
const drawnWidth = row => {
	let column = 0;
	let index = 0;

	while (index < row.length) {
		STYLING_ESCAPE.lastIndex = 0;
		const escape = STYLING_ESCAPE.exec(row.slice(index));

		if (escape?.index === 0) {
			index += escape[0].length;
			continue;
		}

		const drawn = drawCharacter(row, index, column);

		column = drawn.column;
		index += drawn.size;
	}

	return column;
};

/**
Assert that every row of the box ends on the same column, or the box does not line up in a terminal.

@param {string} text - The text inside the box.
@param {object} [options] - The options for the box.
*/
const assertAligned = (text, options) => {
	const box = boxen(text, options);
	const widths = box.split('\n').map(row => drawnWidth(row));

	assert.equal(new Set(widths).size, 1, `Rows end on ${widths.join(', ')}\n${box}`);
};

test('a tab in the text is drawn as a space', () => {
	// A terminal moves the cursor to the next tab stop, but the width of a tab is measured as zero, so it would break the box
	assert.equal(boxen('a\tb'), '┌───┐\n│a b│\n└───┘');
	assert.equal(boxen('a\t\tb'), '┌────┐\n│a  b│\n└────┘');
	assert.equal(boxen('\tfoo'), '┌────┐\n│ foo│\n└────┘');

	assertAligned('a\tb');
});

test('a tab in a wrapped text or between wide characters is drawn as a space', () => {
	assert.equal(boxen('中\t文'), '┌─────┐\n│中 文│\n└─────┘');

	assertAligned('aaa bbb ccc\tddd eee fff ggg', {maxWidth: 12});
	assertAligned('中\t文');
	assertAligned('a\tb', {width: 20, textAlignment: 'center'});
});

test('a tab in a title or a footer is drawn as a space', () => {
	assert.equal(boxen('foo', {title: 'a\tb'}), '┌ a b ┐\n│foo  │\n└─────┘');
	assert.equal(boxen('foo', {footer: 'a\tb'}), '┌─────┐\n│foo  │\n└ a b ┘');

	assertAligned('foo', {title: 'a\tb'});
	assertAligned('foo', {footer: 'a\tb'});
});

test('a tab in a border style is drawn as a space', () => {
	const borderStyle = {
		topLeft: '+',
		topRight: '+',
		bottomLeft: '+',
		bottomRight: '+',
		top: '-',
		bottom: '-',
		left: '\t',
		right: '|',
	};

	assert.equal(boxen('foo', {borderStyle}), '+---+\n foo|\n+---+');

	assertAligned('foo', {borderStyle});
});

test('a backspace overtypes the character before it', () => {
	// A backspace moves the cursor back over the character before it, so it would cut the row short
	assert.equal(boxen('a\bb'), '┌─┐\n│b│\n└─┘');
	assert.equal(boxen('foo\b\b\bbar'), '┌───┐\n│bar│\n└───┘');
	assert.equal(boxen('\bfoo'), '┌───┐\n│foo│\n└───┘');

	assertAligned('a\bb');
	assertAligned('foo', {title: 'a\bb'});
	assertAligned('foo', {footer: 'a\bb'});
});

test('a backspace does not remove a line break', () => {
	assert.equal(boxen('a\n\bb'), '┌─┐\n│a│\n│b│\n└─┘');
});

test('a backspace crosses styling escapes to overtype the preceding character', () => {
	const red = '\u{1B}[31m';
	const reset = '\u{1B}[39m';

	assert.equal(boxen(`a${red}\bb${reset}`), `┌─┐\n│${red}b${reset}│\n└─┘`);
});

test('a control character that moves the cursor is not drawn', () => {
	// A terminal draws nothing for these, so the box must not count them
	const escapes = ['\u{1B}[2A', '\u{1B}[1B', '\u{1B}[2K', '\u{1B}[H', '\u{1B}[2J', '\u{1B}[?25l'];
	const boxes = escapes.map(escape => boxen(`a${escape}b`));

	assert.deepEqual([...new Set(boxes)], ['┌──┐\n│ab│\n└──┘']);
});

test('a two character escape is not drawn', () => {
	// The escape eats the character it is made of, exactly like the terminal does
	assert.equal(boxen('a\u{1B}cb'), '┌──┐\n│ab│\n└──┘');
	assert.equal(boxen('a\u{1B}7b'), '┌──┐\n│ab│\n└──┘');
	assert.equal(boxen('a\u{1B}b'), '┌─┐\n│a│\n└─┘');

	assertAligned('a\u{1B}[2Ab');
});

test('a styling escape and a hyperlink are kept', () => {
	// A color, a style and a hyperlink are drawn as the text they wrap, so they are not controls
	const colored = '\u{1B}[31mfoo\u{1B}[39m';
	const hyperlink = '\u{1B}]8;;https://example.com\u{1B}\\click\u{1B}]8;;\u{1B}\\';

	assert.equal(boxen(colored), `┌───┐\n│${colored}│\n└───┘`);
	assert.equal(boxen(hyperlink), `┌─────┐\n│${hyperlink}│\n└─────┘`);

	// An escape in a title is kept as well
	assert.equal(boxen('foo', {title: colored}), '┌ \u{1B}[31mfoo\u{1B}[39m ┐\n│foo  │\n└─────┘');
});

test('terminal commands other than hyperlinks are not kept', () => {
	const clipboardCommand = '\u{1B}]52;c;SGVsbG8=\u{7}';
	const titleCommand = '\u{1B}]2;changed\u{1B}\\';

	assert.equal(boxen(`a${clipboardCommand}b`), '┌──┐\n│ab│\n└──┘');
	assert.equal(boxen(`a${titleCommand}b`), '┌──┐\n│ab│\n└──┘');
	assert.equal(boxen('a\u{1B}]2;unfinished'), '┌─┐\n│a│\n└─┘');
	assert.equal(boxen('a\u{1B}]2;unfinished\u{1B}c'), '┌─┐\n│a│\n└─┘');
	assert.equal(boxen('a\u{1B}]8;;https://example.com\nb\u{7}'), '┌─┐\n│a│\n└─┘');
	assert.equal(boxen('a\u{1B}]52;c;SGVsbG8=\u{1B}[31mxyz\u{7}b'), '┌──┐\n│ab│\n└──┘');
	assert.equal(boxen('a\u{1B}]52;c;SGVsbG8=\u{1B}]8;;https://example.com\u{7}b'), '┌──┐\n│ab│\n└──┘');
});

test('a backspace does not cut an escape sequence in half', () => {
	// An escape sequence is not a character that can be overtyped, so the backspace preserves it while removing the preceding displayed character
	const red = '\u{1B}[31mred\u{1B}[39m';

	assert.equal(boxen(`${red}\b`), '┌──┐\n│\u{1B}[31mre\u{1B}[39m│\n└──┘');
	assert.equal(boxen(`${red}\bg`), '┌───┐\n│\u{1B}[31mre\u{1B}[39mg│\n└───┘');
	assert.equal(boxen(`a\b${red}`), `┌───┐\n│${red}│\n└───┘`);

	assertAligned(`${red}\b`);
	assertAligned(`${red}\bg`);
	assertAligned(`a\b${red}`);
});

test('a line break in a border character is drawn as a space', () => {
	// A side is a single row of the box, so a line break would break it
	const borderStyle = {
		topLeft: '+',
		topRight: '+',
		bottomLeft: '+',
		bottomRight: '+',
		top: '-',
		bottom: '-',
		left: '\n',
		right: '|',
	};
	const box = boxen('foo', {borderStyle});

	assert.equal(box, '+---+\n foo|\n+---+');
	assert.equal(box.split('\n').length, 3);
});

test('a lone surrogate in a border character is a replacement character', () => {
	// A character that is cut in half is not a character, and the box is written as it is measured
	const half = '👍'.slice(0, 1);
	const box = boxen('foo', {
		borderStyle: {
			topLeft: '+',
			topRight: '+',
			bottomLeft: '+',
			bottomRight: '+',
			top: half,
			bottom: half,
			left: '|',
			right: '|',
		},
	});

	assert.ok(box.isWellFormed());
	assert.equal(box, '+\u{FFFD}\u{FFFD}\u{FFFD}+\n|foo|\n+\u{FFFD}\u{FFFD}\u{FFFD}+');
});

test('a combining mark after a styling escape keeps the escape whole', () => {
	// The text is normalized, and a normalizer that sees the sequence would compose its last character with the combining mark and destroy it
	const colored = '\u{1B}[31m\u{301}xy';

	assert.equal(boxen(colored, {width: 3, borderStyle: 'classic'}), '+-+\n|\u{1B}[31m\u{301}x\u{1B}[39m|\n|\u{1B}[31my|\n+-+');
	assert.equal(boxen(colored), `┌──┐\n│${colored}│\n└──┘`);
});
