import assert from 'node:assert/strict';
import process from 'node:process';
import {test} from 'node:test';
import chalk from 'chalk';
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
