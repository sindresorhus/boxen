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

test('align option `center`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, boxen(`Boxes are\n${beautifulColor}\nand beneficial too!`, {
		align: 'center',
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

test('align option `right`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, boxen(`Boxes are\n${beautifulColor}\nand beneficial too!`, {align: 'right'}), `
┌───────────────────┐
│          Boxes are│
│  ${beautifulColor}│
│and beneficial too!│
└───────────────────┘
	`);
});

test('align option `left`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, boxen(`Boxes are\n${beautifulColor}\nand beneficial too!`, {align: 'left'}), `
┌───────────────────┐
│Boxes are          │
│${beautifulColor}  │
│and beneficial too!│
└───────────────────┘
	`);
});

test('align option (left) does not throw when colorized content > columns', t => {
	console.log('process.stdout.columns', process.stdout.columns);
	const longContent = chalk.green('ab').repeat(process.stdout.columns);
	t.notThrows(() => {
		boxen(longContent, {
			align: 'left'
		});
	});
});

test('align option (center) does not throw when colorized content > columns', t => {
	const longContent = chalk.green('ab').repeat(process.stdout.columns);
	t.notThrows(() => {
		boxen(longContent, {
			align: 'center'
		});
	});
});

test('align option (right) does not throw when colorized content > columns', t => {
	const longContent = chalk.green('ab').repeat(process.stdout.columns);
	t.notThrows(() => {
		boxen(longContent, {
			align: 'right'
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
	const box = boxen(longContent, {align: 'center'});

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

test('text is left-aligned after wrapping', t => {
	const width = process.stdout.columns || 120;
	const longContent = 'x'.repeat(width - 1);
	const box = boxen(longContent, {align: 'left'});

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
	const box = boxen(longContent, {align: 'right'});

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

// TODO: Find out why it fails on GitHub Actions.
if (!process.env.CI) {
	test('text is centered after wrapping when using words', t => {
		const width = process.stdout.columns || 120;
		const sentence = 'x'.repeat(width / 3) + ' ';
		const longContent = sentence.repeat(3).trim();
		const box = boxen(longContent, {align: 'center'});

		t.is(box.length, width * 4);

		const lines = [];
		for (let index = 0; index < 4; ++index) {
			const line = box.slice(index * width, (index + 1) * width);
			t.is(line.length, width, 'Length of line #' + index);
			t.is(line, line.trim(), 'No margin of line #' + index);

			lines.push(line);
		}

		const checkAlign = index => {
			const line = lines[index];
			const lineWithoutBorders = line.slice(1, -1);
			const paddingLeft = lineWithoutBorders.length - lineWithoutBorders.trimStart().length;
			const paddingRight = lineWithoutBorders.length - lineWithoutBorders.trimEnd().length;

			t.true(paddingLeft > 0, 'Padding left in line #' + index);
			t.true(paddingRight > 0, 'Padding right in line #' + index);
			t.true(Math.abs(paddingLeft - paddingRight) <= 1, 'Left and right padding are not (almost) equal in line #' + index);
		};

		checkAlign(1);
		checkAlign(2);
	});
}

test('text is left-aligned after wrapping when using words', t => {
	const width = process.stdout.columns || 120;
	const sentence = 'x'.repeat(width / 3) + ' ';
	const longContent = sentence.repeat(3).trim();
	const box = boxen(longContent, {align: 'left'});

	t.is(box.length, width * 4);

	const lines = [];
	for (let index = 0; index < 4; ++index) {
		const line = box.slice(index * width, (index + 1) * width);
		t.is(line.length, width, 'Length of line #' + index);
		t.is(line, line.trim(), 'No margin of line #' + index);

		lines.push(line);
	}

	const checkAlign = index => {
		const line = lines[index];
		const lineWithoutBorders = line.slice(1, -1);
		const paddingLeft = lineWithoutBorders.length - lineWithoutBorders.trimStart().length;
		const paddingRight = lineWithoutBorders.length - lineWithoutBorders.trimEnd().length;

		t.is(paddingLeft, 0, 'Padding left in line #' + index);
		t.true(paddingRight > 0, 'Padding right in line #' + index);
	};

	checkAlign(1);
	checkAlign(2);
});

test('text is right-aligned after wrapping when using words', t => {
	const width = process.stdout.columns || 120;
	const sentence = 'x'.repeat(width / 3) + ' ';
	const longContent = sentence.repeat(3).trim();
	const box = boxen(longContent, {align: 'right'});

	t.is(box.length, width * 4);

	const lines = [];
	for (let index = 0; index < 4; ++index) {
		const line = box.slice(index * width, (index + 1) * width);
		t.is(line.length, width, 'Length of line #' + index);
		t.is(line, line.trim(), 'No margin of line #' + index);

		lines.push(line);
	}

	const checkAlign = index => {
		const line = lines[index];
		const lineWithoutBorders = line.slice(1, -1);
		const paddingLeft = lineWithoutBorders.length - lineWithoutBorders.trimStart().length;
		const paddingRight = lineWithoutBorders.length - lineWithoutBorders.trimEnd().length;

		t.true(paddingLeft > 0, 'Padding left in line #' + index);
		t.is(paddingRight, 0, 'Padding right in line #' + index);
	};

	checkAlign(1);
	checkAlign(2);
});

test('text is right-aligned after wrapping when using words, with padding', t => {
	const width = process.stdout.columns || 120;
	const sentence = 'x'.repeat(width / 3) + ' ';
	const longContent = sentence.repeat(3).trim();
	const box = boxen(longContent, {
		align: 'right',
		padding: {left: 1, right: 1, top: 0, bottom: 0}
	});

	t.is(box.length, width * 4);

	const lines = [];
	for (let index = 0; index < 4; ++index) {
		const line = box.slice(index * width, (index + 1) * width);
		t.is(line.length, width, 'Length of line #' + index);
		t.is(line, line.trim(), 'No margin of line #' + index);

		lines.push(line);
	}

	const checkAlign = index => {
		const line = lines[index];
		const lineWithoutBorders = line.slice(1, -1);
		const paddingLeft = lineWithoutBorders.length - lineWithoutBorders.trimStart().length;
		const paddingRight = lineWithoutBorders.length - lineWithoutBorders.trimEnd().length;

		t.true(paddingLeft > 0, 'Padding left in line #' + index);
		t.is(paddingRight, 1, 'Padding right in line #' + index);
	};

	checkAlign(1);
	checkAlign(2);
});
