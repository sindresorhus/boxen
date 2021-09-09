import test from 'ava';
import chalk from 'chalk';
import boxen from '.';

chalk.level = 3;

const compare = (t, actual, expected, message) => {
	t.is(actual.trim(), expected.trim(), message);
};

test('creates a box', t => {
	compare(t, boxen('foo'), `
┌───┐
│foo│
└───┘
	`);
});

test('title option', t => {
	compare(t, boxen('foo', {title: 'title'}), `
┌ title ┐
│foo    │
└───────┘
	`);
});

test('titleAlignement center option', t => {
	compare(t, boxen('foo bar foo bar', {
		title: 'title',
		titleAlignement: 'center'
	}), `
┌──── title ────┐
│foo bar foo bar│
└───────────────┘
	`);
});

test('titleAlignement right option', t => {
	compare(t, boxen('foo bar foo bar', {
		title: 'title',
		titleAlignement: 'right'
	}), `
┌──────── title ┐
│foo bar foo bar│
└───────────────┘
	`);
});

test('title and textAlignement', t => {
	compare(t, boxen('Hello !\nThis text is on the right\nAmazing!', {
		title: 'title',
		textAlignement: 'right'
	}), `
┌ title ──────────────────┐
│                  Hello !│
│This text is on the right│
│                 Amazing!│
└─────────────────────────┘
	`);
});

test('box size adapts to title length', t => {
	compare(t, 	boxen('Hello !\nThis text is on the center\nAmazing!\nIt stretched to the title length.', {
		title: 'This is a very large title with many words in it',
		textAlignement: 'center'
	}), `
┌ This is a very large title with many words in it ┐
│                     Hello !                      │
│           This text is on the center             │
│                    Amazing!                      │
│        It stretched to the title length.         │
└──────────────────────────────────────────────────┘
	`);
});

test('title with textAlignement and text padding', t => {
	compare(t, 	boxen('Hello !\nAll the text here is on the right\nEven the title.\nAmazing padding too ;)', {
		title: 'This is a title',
		titleAlignement: 'right',
		textAlignement: 'right',
		padding: 2
	}), `
┌──────────────────────────── This is a title ┐
│                                             │
│                                             │
│                                Hello !      │
│      All the text here is on the right      │
│                        Even the title.      │
│                 Amazing padding too ;)      │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
	`);
});

test('title with textAlignement, padding and margin', t => {
	compare(t, 	boxen('Hello !\nThis text has padding and margin.\nCentered too !', {
		title: 'This is a title',
		titleAlignement: 'center',
		textAlignement: 'center',
		margin: 1,
		padding: 1
	}), `
   ┌─────────── This is a title ───────────┐
   │                                       │
   │                Hello !                │
   │   This text has padding and margin.   │
   │            Centered too !             │
   │                                       │
   └───────────────────────────────────────┘
	`);
});

test('padding option', t => {
	compare(t, boxen('foo', {padding: 2}), `
┌───────────────┐
│               │
│               │
│      foo      │
│               │
│               │
└───────────────┘
	`);
});

test('padding option - advanced', t => {
	compare(t, boxen('foo', {
		padding: {
			top: 0,
			bottom: 2,
			left: 5,
			right: 10
		}
	}), `
┌──────────────────┐
│     foo          │
│                  │
│                  │
└──────────────────┘
	`);
});

test('margin option', t => {
	compare(t, boxen('foo', {
		padding: 2,
		margin: 2
	}), `

      ┌───────────────┐
      │               │
      │               │
      │      foo      │
      │               │
      │               │
      └───────────────┘

    `);
});

test('float option (left)', t => {
	compare(t, boxen('foo', {
		float: 'left'
	}), `
┌───┐
│foo│
└───┘
    `);
});

test('float option (center)', t => {
	const padSize = Math.floor((process.stdout.columns - 5) / 2);
	const padding = ' '.repeat(padSize);

	compare(t, boxen('foo', {
		float: 'center'
	}), `
${padding}┌───┐
${padding}│foo│
${padding}└───┘
${padding}    `);
});

test('float option (center) does not throw when content > columns', t => {
	const longContent = 'ab'.repeat(process.stdout.columns);
	t.notThrows(() => {
		boxen(longContent, {
			float: 'center'
		});
	});
});

test('float option (center) ignored when content > columns', t => {
	const longContent = 'ab'.repeat(process.stdout.columns);
	const gotWithCenter = boxen(longContent, {
		float: 'center'
	});
	const gotWithLeft = boxen(longContent, {
		float: 'left'
	});
	const gotWithRight = boxen(longContent, {
		float: 'right'
	});

	compare(t, gotWithCenter, gotWithLeft, 'center vs left');
	compare(t, gotWithCenter, gotWithRight, 'center vs right');
});

test('float option (right)', t => {
	const padSize = Math.max(process.stdout.columns - 4, 0) - 1;
	const padding = ' '.repeat(padSize);

	compare(t, boxen('foo', {
		float: 'right'
	}), `
${padding}┌───┐
${padding}│foo│
${padding}└───┘
${padding}    `);
});

test('float option (right) with margin', t => {
	const marginWidth = 6;
	const padSize = Math.max(process.stdout.columns - 4 - marginWidth, 0) - 1;
	const padding = ' '.repeat(padSize);

	compare(t, boxen('foo', {
		float: 'right',
		margin: 2
	}), `


${padding}┌───┐
${padding}│foo│
${padding}└───┘


`);
});

test('float option (right) with margin right', t => {
	const marginWidth = 2;
	const padSize = Math.max(process.stdout.columns - 4 - marginWidth, 0) - 1;
	const padding = ' '.repeat(padSize);

	compare(t, boxen('foo', {
		float: 'right',
		margin: {
			right: 2
		}
	}), `
${padding}┌───┐
${padding}│foo│
${padding}└───┘
`);
});

test('borderStyle option `double`', t => {
	compare(t, boxen('foo', {borderStyle: 'double'}), `
╔═══╗
║foo║
╚═══╝
	`);
});

test('borderStyle option `round`', t => {
	compare(t, boxen('foo', {borderStyle: 'round'}), `
╭───╮
│foo│
╰───╯
	`);
});

test('borderStyle option `singleDouble`', t => {
	compare(t, boxen('foo', {borderStyle: 'singleDouble'}), `
╓───╖
║foo║
╙───╜
	`);
});

test('borderStyle option `doubleSingle`', t => {
	compare(t, boxen('foo', {borderStyle: 'doubleSingle'}), `
╒═══╕
│foo│
╘═══╛
	`);
});

test('borderStyle option with object', t => {
	const asciiStyle = {
		topLeft: '1',
		topRight: '2',
		bottomLeft: '3',
		bottomRight: '4',
		horizontal: '-',
		vertical: '|'
	};

	compare(t, boxen('foo', {borderStyle: asciiStyle}), `
1---2
|foo|
3---4
	`);
});

test('throws on unexpected borderStyle as string', t => {
	t.throws(() => {
		boxen('foo', {borderStyle: 'shakenSnake'});
	}, /border style/);
});

test('throws on unexpected borderStyle as object', t => {
	t.throws(() => {
		boxen('foo', {borderStyle: {shake: 'snake'}});
	}, /border style/);

	// Missing bottomRight
	const invalid = {
		topLeft: '1',
		topRight: '2',
		bottomLeft: '3',
		horizontal: '-',
		vertical: '|'
	};

	t.throws(() => {
		boxen('foo', {borderStyle: invalid});
	}, /bottomRight/);
});

test('borderColor option', t => {
	const box = boxen('foo', {borderColor: 'yellow'});
	const yellowAnsiOpen = '\u001B[33m';
	const colorAnsiClose = '\u001B[39m';
	t.true(box.includes(yellowAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('borderColor hex', t => {
	const box = boxen('foo', {borderColor: '#FF0000'});
	const rgbAnsiOpen = '\u001B[38;2;255;0;0m';
	const colorAnsiClose = '\u001B[39m';
	t.true(box.includes(rgbAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('throws on unexpected borderColor', t => {
	t.throws(() => {
		boxen('foo', {borderColor: 'greasy-white'});
	}, /borderColor/);
});

test('backgroundColor option', t => {
	const box = boxen('foo', {backgroundColor: 'red'});
	const redAnsiOpen = '\u001B[41m';
	const redAnsiClose = '\u001B[49m';
	t.true(box.includes(redAnsiOpen));
	t.true(box.includes(redAnsiClose));
});

test('backgroundColor hex', t => {
	const box = boxen('foo', {backgroundColor: '#FF0000'});
	const rgbAnsiOpen = '\u001B[48;2;255;0;0m';
	const colorAnsiClose = '\u001B[49m';
	t.true(box.includes(rgbAnsiOpen));
	t.true(box.includes(colorAnsiClose));
});

test('throws on unexpected backgroundColor', t => {
	t.throws(() => {
		boxen('foo', {backgroundColor: 'dark-yellow'});
	}, /backgroundColor/);
});

test('textAlignement option `center`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, boxen(`Boxes are\n${beautifulColor}\nand beneficial too!`, {
		textAlignement: 'center',
		padding: 1
	}), `
┌─────────────────────────┐
│                         │
│        Boxes are        │
│    ${beautifulColor}    │
│   and beneficial too!   │
│                         │
└─────────────────────────┘
	`);
});

test('textAlignement option `right`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, boxen(`Boxes are\n${beautifulColor}\nand beneficial too!`, {textAlignement: 'right'}), `
┌───────────────────┐
│          Boxes are│
│  ${beautifulColor}│
│and beneficial too!│
└───────────────────┘
	`);
});

test('textAlignement option `left`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, boxen(`Boxes are\n${beautifulColor}\nand beneficial too!`, {textAlignement: 'left'}), `
┌───────────────────┐
│Boxes are          │
│${beautifulColor}  │
│and beneficial too!│
└───────────────────┘
	`);
});

test('textAlignement option (left) does not throw when colorized content > columns', t => {
	console.log('process.stdout.columns', process.stdout.columns);
	const longContent = chalk.green('ab').repeat(process.stdout.columns);
	t.notThrows(() => {
		boxen(longContent, {
			textAlignement: 'left'
		});
	});
});

test('textAlignement option (center) does not throw when colorized content > columns', t => {
	const longContent = chalk.green('ab').repeat(process.stdout.columns);
	t.notThrows(() => {
		boxen(longContent, {
			textAlignement: 'center'
		});
	});
});

test('textAlignement option (right) does not throw when colorized content > columns', t => {
	const longContent = chalk.green('ab').repeat(process.stdout.columns);
	t.notThrows(() => {
		boxen(longContent, {
			textAlignement: 'right'
		});
	});
});

test('dimBorder option', t => {
	const dimTopBorder = chalk.dim('┌───┐');
	const dimSide = chalk.dim('│');
	const dimBottomBorder = chalk.dim('└───┘');
	compare(t, boxen('foo', {dimBorder: true}), `
${dimTopBorder}
${dimSide}foo${dimSide}
${dimBottomBorder}
	`);
});

test('no wrapping when content = columns - 2 and no padding and no margin', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width - 2);
	const box = boxen(longContent);

	// No endlines
	t.false(box.includes('\n'));

	// Every line has full length
	t.is(box.length, width * 3);

	// There are no spaces around (and in this case - within)
	t.false(box.includes(' '));
});

test('wrapping when content = columns - 1 and no padding and no margin', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width - 1);
	const box = boxen(longContent);

	// No endlines
	t.false(box.includes('\n'));

	// Every line has full length
	t.is(box.length, width * 4);

	// There are no spaces around
	t.is(box, box.trim());
});

test('wrapping when content = columns - 2 and padding = 1 and no margin', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width - 2);
	const box = boxen(longContent, {padding: 1});

	// No endlines
	t.false(box.includes('\n'));

	// Every line has full length: 3 normal lines + 1 wrapped + 2 padding = 6 lines
	t.is(box.length, width * 6);

	// There are no spaces around
	t.is(box, box.trim());
});

test('ignore margins when content = columns - 2 and no padding', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width - 2);
	const box = boxen(longContent, {margin: {left: 5, right: 5}});

	// No endlines
	t.false(box.includes('\n'));

	t.is(box.length, width * 3);

	// There are no spaces around (and in this case - within)
	t.false(box.includes(' '));
});

test('decrease margins when there is no space for them', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width - 8);
	// This gives only 3 spaces of margin on each side, but 5 were requested
	const box = boxen(longContent, {margin: {left: 5, right: 5}});

	const boxWidth = width - 3;
	// Minus 2 NL
	t.is(box.length - 2, 3 * boxWidth);

	const lines = box.split('\n');
	for (const [index, line] of lines.entries()) {
		t.is(line.length, boxWidth, 'Length of line #' + index);
	}

	const expected = '   │' + 'x'.repeat(width - 8) + '│';
	t.is(lines[1], expected);
});

test('proportionally decrease margins when there is no space for them', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width - 10);
	// This gives only 4 spaces of margin on each side, but 5/13 were requested
	// Boxen should print 2 spaces on the left and leave 5 spaces on the right
	const box = boxen(longContent, {margin: {left: 5, right: 13}});

	const boxWidth = width - 6;
	// Minus 2 NL
	t.is(box.length - 2, boxWidth * 3);

	const lines = box.split('\n');
	for (const [index, line] of lines.entries()) {
		t.is(line.length, boxWidth, 'Length of line #' + index);
	}

	const expected = '  │' + 'x'.repeat(width - 10) + '│';
	t.is(lines[1], expected);
});

test('text is centered after wrapping', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width - 1);
	const box = boxen(longContent, {textAlignement: 'center'});

	t.is(box.length, width * 4);

	const lines = [];
	for (let index = 0; index < 4; ++index) {
		const line = box.slice(index * width, (index + 1) * width);
		t.is(line.length, width, 'Length of line #' + index);
		t.is(line, line.trim(), 'No margin of line #' + index);
		if (index !== 2) {
			t.false(line.includes(' '), 'No spaces in line #' + index);
		}

		lines.push(line);
	}

	const paddingLeft = Math.floor((width - 3) / 2);
	const paddingRight = width - 3 - paddingLeft;
	const expected = '│' + ' '.repeat(paddingLeft) + 'x' + ' '.repeat(paddingRight) + '│';
	t.is(lines[2], expected);
});

test('text is left-textAlignemented after wrapping', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width - 1);
	const box = boxen(longContent, {textAlignement: 'left'});

	t.is(box.length, width * 4);

	const lines = [];
	for (let index = 0; index < 4; ++index) {
		const line = box.slice(index * width, (index + 1) * width);
		t.is(line.length, width, 'Length of line #' + index);
		t.is(line, line.trim(), 'No margin of line #' + index);
		if (index !== 2) {
			t.false(line.includes(' '), 'No spaces in line #' + index);
		}

		lines.push(line);
	}

	const padding = width - 3;
	const expected = '│x' + ' '.repeat(padding) + '│';
	t.is(lines[2], expected);
});

test('text is right-aligned after wrapping', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width - 1);
	const box = boxen(longContent, {textAlignement: 'right'});

	t.is(box.length, width * 4);

	const lines = [];
	for (let index = 0; index < 4; ++index) {
		const line = box.slice(index * width, (index + 1) * width);
		t.is(line.length, width, 'Length of line #' + index);
		t.is(line, line.trim(), 'No margin of line #' + index);
		if (index !== 2) {
			t.false(line.includes(' '), 'No spaces in line #' + index);
		}

		lines.push(line);
	}

	const padding = width - 3;
	const expected = '│' + ' '.repeat(padding) + 'x│';
	t.is(lines[2], expected);
});

test('box not overflowing terminal', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width * 4);
	const box = boxen(longContent);

	const lines = [];
	for (let index = 1; index < 6; ++index) {
		const line = box.slice(index * width, (index + 1) * width);
		lines.push(line);
	}

	for (const line of lines) {
		t.is(line[0], '│', 'First character of line isn\'t box border');
		t.is(line[width - 1], '│', 'Last character of line isn\'t box border');
	}
});

test('box not overflowing terminal with padding', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width * 4);
	const box = boxen(longContent, {padding: 2});

	const lines = [];
	for (let index = 1; index < 10; ++index) {
		const line = box.slice(index * width, (index + 1) * width);
		lines.push(line);
	}

	for (const line of lines) {
		t.is(line[0], '│', 'First character of line isn\'t box border');
		t.is(line[width - 1], '│', 'Last character of line isn\'t box border');
	}
});

test('box not overflowing terminal with padding and margin', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width * 4);
	const box = boxen(longContent, {padding: 2, margin: {left: 2, right: 2}});

	const lines = [];
	for (let index = 1; index < 10; ++index) {
		const line = box.slice(index * width, (index + 1) * width);
		lines.push(line);
	}

	for (const line of lines) {
		t.is(line[0], '│', 'First character of line isn\'t box border');
		t.is(line[width - 1], '│', 'Last character of line isn\'t box border');
	}
});

test('box not overflowing terminal with words and margin', t => {
	const width = process.stdout.columns || 120;
	const word = 'x'.repeat(width / 2) + ' ';
	const longContent = word.repeat(5);
	const box = boxen(longContent, {margin: {left: 2, right: 2}});

	const lines = [];
	for (let index = 1; index < 6; ++index) {
		const line = box.slice(index * (word.length + 4), (index + 1) * (word.length + 4));
		lines.push(line);
	}

	for (const line of lines) {
		t.is(line.trim()[0], '│', 'First character of line isn\'t box border');
		t.is(line.trim()[word.length], '│', 'Last character of line isn\'t box border');
	}
});

test('text is centered after wrapping when using words', t => {
	const width = process.stdout.columns || 120;
	const sentence = 'x'.repeat(width / 4) + ' ';
	const longContent = sentence.repeat(4).trim();
	const box = boxen(longContent, {textAlignement: 'center'});

	const lines = box.split('\n');

	const checkAlign = ({index, leftPad, rightPad}) => {
		const line = lines[index];
		const lineWithoutBorders = line.slice(1, -1);
		const paddingLeft = lineWithoutBorders.length - lineWithoutBorders.trimStart().length;
		const paddingRight = lineWithoutBorders.length - lineWithoutBorders.trimEnd().length;

		t.is(paddingLeft, leftPad, 'Padding left in line #' + index);
		t.is(paddingRight, rightPad, 'Padding right in line #' + index);
	};

	checkAlign({index: 1, leftPad: 0, rightPad: 0});
	checkAlign({index: 2, leftPad: sentence.length, rightPad: sentence.length});
});

test('text is left-aligned after wrapping when using words', t => {
	const width = process.stdout.columns || 120;
	const sentence = 'x'.repeat(width / 4) + ' ';
	const longContent = sentence.repeat(4).trim();
	const box = boxen(longContent);

	const lines = box.split('\n');

	const checkAlign = ({index, leftPad, rightPad}) => {
		const line = lines[index];
		const lineWithoutBorders = line.slice(1, -1);
		const paddingLeft = lineWithoutBorders.length - lineWithoutBorders.trimStart().length;
		const paddingRight = lineWithoutBorders.length - lineWithoutBorders.trimEnd().length;

		t.is(paddingLeft, leftPad, 'Padding left in line #' + index);
		t.is(paddingRight, rightPad, 'Padding right in line #' + index);
	};

	checkAlign({index: 1, leftPad: 0, rightPad: 0});
	checkAlign({index: 2, leftPad: 0, rightPad: sentence.length * 2});
});

test('text is right-aligned after wrapping when using words', t => {
	const width = process.stdout.columns || 120;
	const sentence = 'x'.repeat(width / 4) + ' ';
	const longContent = sentence.repeat(4).trim();
	const box = boxen(longContent, {textAlignement: 'right'});

	const lines = box.split('\n');

	const checkAlign = ({index, leftPad, rightPad}) => {
		const line = lines[index];
		const lineWithoutBorders = line.slice(1, -1);
		const paddingLeft = lineWithoutBorders.length - lineWithoutBorders.trimStart().length;
		const paddingRight = lineWithoutBorders.length - lineWithoutBorders.trimEnd().length;

		t.is(paddingLeft, leftPad, 'Padding left in line #' + index);
		t.is(paddingRight, rightPad, 'Padding right in line #' + index);
	};

	checkAlign({index: 1, leftPad: 0, rightPad: 0});
	checkAlign({index: 2, leftPad: sentence.length * 2, rightPad: 0});
});

test('text is right-aligned after wrapping when using words, with padding', t => {
	const width = process.stdout.columns || 120;
	const sentence = 'x'.repeat(width / 4) + ' ';
	const longContent = sentence.repeat(4).trim();
	const box = boxen(longContent, {
		textAlignement: 'right',
		padding: {left: 1, right: 1, top: 0, bottom: 0}
	});

	const lines = box.split('\n');

	const checkAlign = ({index, leftPad, rightPad}) => {
		const line = lines[index];
		const lineWithoutBorders = line.slice(1, -1);
		const paddingLeft = lineWithoutBorders.length - lineWithoutBorders.trimStart().length;
		const paddingRight = lineWithoutBorders.length - lineWithoutBorders.trimEnd().length;

		t.is(paddingLeft, leftPad, 'Padding left in line #' + index);
		t.is(paddingRight, rightPad, 'Padding right in line #' + index);
	};

	checkAlign({index: 1, leftPad: 1, rightPad: 1});
	checkAlign({index: 2, leftPad: (sentence.length * 2) + 1, rightPad: 1});
});
