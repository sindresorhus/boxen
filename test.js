import test from 'ava';
import chalk from 'chalk';
import m from './';

chalk.enabled = true;

const compare = (t, actual, expected) => t.is(actual.trim(), expected.trim());

test('creates a box', t => {
	compare(t, m('foo'), `
┌───┐
│foo│
└───┘
	`);
});

test('padding option', t => {
	compare(t, m('foo', {padding: 2}), `
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
	compare(t, m('foo', {
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
	compare(t, m('foo', {
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
	compare(t, m('foo', {
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

	compare(t, m('foo', {
		float: 'center'
	}), `
${padding}┌───┐
${padding}│foo│
${padding}└───┘
${padding}    `);
});

test('float option (right)', t => {
	const padSize = Math.max(process.stdout.columns - 4, 0) - 1;
	const padding = ' '.repeat(padSize);

	compare(t, m('foo', {
		float: 'right'
	}), `
${padding}┌───┐
${padding}│foo│
${padding}└───┘
${padding}    `);
});

test('borderStyle option `double`', t => {
	compare(t, m('foo', {borderStyle: 'double'}), `
╔═══╗
║foo║
╚═══╝
	`);
});

test('borderStyle option `round`', t => {
	compare(t, m('foo', {borderStyle: 'round'}), `
╭───╮
│foo│
╰───╯
	`);
});

test('borderStyle option `single-double`', t => {
	compare(t, m('foo', {borderStyle: 'single-double'}), `
╓───╖
║foo║
╙───╜
	`);
});

test('borderStyle option `double-single`', t => {
	compare(t, m('foo', {borderStyle: 'double-single'}), `
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

	compare(t, m('foo', {borderStyle: asciiStyle}), `
1---2
|foo|
3---4
	`);
});

test('throws on unexpected borderStyle as string', t => {
	t.throws(() => m('foo', {borderStyle: 'shaken-snake'}), /border style/);
});

test('throws on unexpected borderStyle as object', t => {
	t.throws(() => m('foo', {borderStyle: {shake: 'snake'}}), /border style/);

	// Missing bottomRight
	const invalid = {
		topLeft: '1',
		topRight: '2',
		bottomLeft: '3',
		horizontal: '-',
		vertical: '|'
	};

	t.throws(() => m('foo', {borderStyle: invalid}), /bottomRight/);
});

test('borderColor option', t => {
	const box = m('foo', {borderColor: 'yellow'});
	const yellowAnsiOpen = '\u001b[33m';
	const colorAnsiClose = '\u001b[39m';
	t.true(box.indexOf(yellowAnsiOpen) !== -1);
	t.true(box.indexOf(colorAnsiClose) !== -1);
});

test('throws on unexpected borderColor', t => {
	t.throws(() => m('foo', {borderColor: 'greasy-white'}), /borderColor/);
});

test('backgroundColor option', t => {
	const box = m('foo', {backgroundColor: 'red'});
	const redAnsiOpen = '\u001b[41m';
	const redAnsiClose = '\u001b[49m';
	t.true(box.indexOf(redAnsiOpen) !== -1);
	t.true(box.indexOf(redAnsiClose) !== -1);
});

test('throws on unexpected backgroundColor', t => {
	t.throws(() => m('foo', {backgroundColor: 'dark-yellow'}), /backgroundColor/);
});

test('align option `center`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, m(`Boxes are\n${beautifulColor}\nand beneficial too!`, {
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
	compare(t, m(`Boxes are\n${beautifulColor}\nand beneficial too!`, {align: 'right'}), `
┌───────────────────┐
│          Boxes are│
│  ${beautifulColor}│
│and beneficial too!│
└───────────────────┘
	`);
});

test('align option `left`', t => {
	const beautifulColor = chalk.magenta('B E A U T I F U L');
	compare(t, m(`Boxes are\n${beautifulColor}\nand beneficial too!`, {align: 'left'}), `
┌───────────────────┐
│Boxes are          │
│${beautifulColor}  │
│and beneficial too!│
└───────────────────┘
	`);
});
