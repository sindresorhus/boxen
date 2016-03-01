import test from 'ava';
import fn from './';

function compare(t, actual, expected) {
	return t.is(actual.trim(), expected.trim());
}

test('creates a box', t => {
	compare(t, fn('foo'), `
┌───┐
│foo│
└───┘
	`);
});

test('padding option', t => {
	compare(t, fn('foo', {padding: 2}), `
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
	compare(t, fn('foo', {
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
	compare(t, fn('foo', {padding: 2, margin: 2}), `

      ┌───────────────┐
      │               │
      │               │
      │      foo      │
      │               │
      │               │
      └───────────────┘

    `);
});

test('borderStyle option `double`', t => {
	compare(t, fn('foo', {borderStyle: 'double'}), `
╔═══╗
║foo║
╚═══╝
	`);
});

test('borderStyle option `round`', t => {
	compare(t, fn('foo', {borderStyle: 'round'}), `
╭───╮
│foo│
╰───╯
	`);
});

test('borderStyle option `single-double`', t => {
	compare(t, fn('foo', {borderStyle: 'single-double'}), `
╓───╖
║foo║
╙───╜
	`);
});

test('borderStyle option `double-single`', t => {
	compare(t, fn('foo', {borderStyle: 'double-single'}), `
╒═══╕
│foo│
╘═══╛
	`);
});

test('borderStyle option with object', t => {
	const asciiStyle = {
		topLeft: '1', topRight: '2', bottomLeft: '3', bottomRight: '4', horizontal: '-', vertical: '|'
	};

	compare(t, fn('foo', {borderStyle: asciiStyle}), `
1---2
|foo|
3---4
	`);
});

test('throws on unexpected borderStyle as string', t => {
	t.throws(() => fn('foo', {borderStyle: 'shaken-snake'}), /border style/);
});

test('throws on unexpected borderStyle as object', t => {
	t.throws(() => fn('foo', {borderStyle: {shake: 'snake'}}), /border style/);

	// missing bottomRight
	const invalid = {
		topLeft: '1',
		topRight: '2',
		bottomLeft: '3',
		horizontal: '-',
		vertical: '|'
	};

	t.throws(() => fn('foo', {borderStyle: invalid}), /bottomRight/);
});

test('borderColor option', t => {
	const box = fn('foo', {borderColor: 'yellow'});
	const yellowAnsiOpen = '\u001b[33m';
	const colorAnsiClose = '\u001b[39m';
	t.true(box.indexOf(yellowAnsiOpen) !== -1);
	t.true(box.indexOf(colorAnsiClose) !== -1);
});

test('throws on unexpected borderColor', t => {
	t.throws(() => fn('foo', {borderColor: 'greasy-white'}), /borderColor/);
});

test('backgroundColor option', t => {
	const box = fn('foo', {backgroundColor: 'red'});
	const redAnsiOpen = '\u001b[41m';
	const redAnsiClose = '\u001b[49m';
	t.true(box.indexOf(redAnsiOpen) !== -1);
	t.true(box.indexOf(redAnsiClose) !== -1);
});

test('throws on unexpected backgroundColor', t => {
	t.throws(() => fn('foo', {backgroundColor: 'dark-yellow'}), /backgroundColor/);
});
