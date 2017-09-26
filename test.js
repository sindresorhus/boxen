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

test('float option (right) with margin', t => {
	const marginWidth = 6;
	const padSize = Math.max(process.stdout.columns - 4 - marginWidth, 0) - 1;
	const padding = ' '.repeat(padSize);

	compare(t, m('foo', {
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

	compare(t, m('foo', {
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

test('dimBorder option', t => {
	const dimTopBorder = chalk.dim('┌───┐');
	const dimSide = chalk.dim('│');
	const dimBottomBorder = chalk.dim('└───┘');
	compare(t, m('foo', {dimBorder: true}), `
${dimTopBorder}
${dimSide}foo${dimSide}
${dimBottomBorder}
	`);
});

test('wrap text', t => {
	const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus efficitur, nibh at consectetur vehicula, ante mauris sodales mi, sit amet sagittis lacus ante at diam. Aliquam quis posuere odio, quis lacinia felis. Quisque scelerisque ac tellus a hendrerit. Curabitur sit amet mauris aliquam, aliquet leo et, dignissim turpis. Phasellus pulvinar, velit sed ultrices lobortis, neque sem euismod est, ut dignissim nibh sapien at quam. Integer odio urna, luctus malesuada turpis in, consectetur pretium arcu. Vivamus magna nisi, facilisis pretium interdum nec, gravida eget ante. Quisque semper blandit scelerisque. Donec et feugiat arcu. Duis pretium pulvinar egestas. Nunc blandit diam velit, sit amet viverra ligula dictum eu. Mauris sapien elit, feugiat ac maximus vitae, dignissim a eros. Vivamus lobortis eros quis dui tincidunt hendrerit.';
	process.stdout.columns = 80;
	compare(t, m(text, {padding: 1}), `
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus efficitur,      │
│   nibh at consectetur vehicula, ante mauris sodales mi, sit amet sagittis lacus      │
│   ante at diam. Aliquam quis posuere odio, quis lacinia felis. Quisque scelerisque   │
│   ac tellus a hendrerit. Curabitur sit amet mauris aliquam, aliquet leo et,          │
│   dignissim turpis. Phasellus pulvinar, velit sed ultrices lobortis, neque sem       │
│   euismod est, ut dignissim nibh sapien at quam. Integer odio urna, luctus           │
│   malesuada turpis in, consectetur pretium arcu. Vivamus magna nisi, facilisis       │
│   pretium interdum nec, gravida eget ante. Quisque semper blandit scelerisque.       │
│   Donec et feugiat arcu. Duis pretium pulvinar egestas. Nunc blandit diam velit,     │
│   sit amet viverra ligula dictum eu. Mauris sapien elit, feugiat ac maximus vitae,   │
│   dignissim a eros. Vivamus lobortis eros quis dui tincidunt hendrerit.              │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
	`);
});
