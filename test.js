import test from 'ava';
import chalk from 'chalk';
import boxen from '.';

chalk.enabled = true;
chalk.level = 3;

const compare = (t, actual, expected) => {
	t.is(actual.trim(), expected.trim());
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
	const padSize = Math.ceil((process.stdout.columns - 2) / 2) - 1;
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

	compare(t, gotWithCenter, gotWithLeft);
	compare(t, gotWithCenter, gotWithRight);
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
