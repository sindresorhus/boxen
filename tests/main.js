import process from 'node:process';
import test from 'ava';
import chalk from 'chalk';
import boxen from '../index.js';

const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id erat arcu. Integer urna mauris, sodales vel egestas eu, consequat id turpis. Vivamus faucibus est mattis tincidunt lobortis. In aliquam placerat nunc eget viverra. Duis aliquet faucibus diam, blandit tincidunt magna congue eu. Sed vel ante vestibulum, maximus risus eget, iaculis velit. Quisque id dapibus purus, ut sodales lorem. Aenean laoreet iaculis tellus at malesuada. Donec imperdiet eu lacus vitae fringilla.';

const formattedText = `
!!!  Unicorns are lit !!!
Hello this is a formatted text !
				It has alignements
				already includes${' '}
				in it.${' '}
Boxen should protect this alignement,
		otherwise the users would be sad !
Hehe          Haha${' '.repeat(33)}
Hihi       Hoho
	All this garbage is on purpose.
Have a good day !
`;

const randomText = 'lewb{+^PN_6-l 8eK2eqB:jn^YFgGl;wuT)mdA9TZlf 9}?X#P49`x"@+nLx:BH5p{5_b`S\'E8\0{A0l"(62`TIf(z8n2arEY~]y|bk,6,FYf~rGY*Xfa00q{=fdm=4.zVf6#\'|3S!`pJ3 6y02]nj2o4?-`1v$mudH?Wbw3fZ]a+aE\'\'P4Q(6:NHBry)L_&/7v]0<!7<kw~gLc.)\'ajS>\0~y8PZ*|-BRY&m%UaCe\'3A,N?8&wbOP}*.O<47rnPzxO=4"*|[%A):;E)Z6!V&x!1*OprW-*+q<F$6|864~1HmYX@J#Nl1j1`!$Y~j^`j;PB2qpe[_;.+vJGnE3) yo&5qRI~WHxK~r%+\'P>Up&=P6M<kDdpSL#<Ur/[NN0qI3dFEEy|>_VGx0O/VOvPEez:7C58a^.N,"Rxc|a6C[i$3QC_)~x!wd+ZMtYsGF&?';

test('creates a box', t => {
	const box = boxen('foo');

	t.snapshot(box);
});

test('box not overflowing terminal', t => {
	const box = boxen('foo'.repeat(process.env.COLUMNS));

	t.snapshot(box);
});

test('box not overflowing terminal with padding', t => {
	const box = boxen('foo'.repeat(process.env.COLUMNS), {
		padding: 3,
	});

	t.snapshot(box);
});

test('box not overflowing terminal with words', t => {
	const box = boxen('foo '.repeat(process.env.COLUMNS));

	t.snapshot(box);
});

test('box not overflowing terminal with words + padding', t => {
	const box = boxen('foo '.repeat(process.env.COLUMNS), {
		padding: 2,
	});

	t.snapshot(box);
});

test('box not overflowing terminal with words + padding + margin', t => {
	const box = boxen('foo '.repeat(process.env.COLUMNS), {
		padding: 2,
		magin: 1,
	});

	t.snapshot(box);
});

test('handles long text', t => {
	const box = boxen(longText);

	t.snapshot(box);
});

test('handles formatted text', t => {
	const box = boxen(formattedText);

	t.snapshot(box);
});

test('handles random text', t => {
	const box = boxen(randomText);

	t.snapshot(box);
});

test('handles colored texts', t => {
	let box = boxen(chalk.red(longText));

	t.snapshot(box);

	box = boxen(chalk.blue(formattedText));

	t.snapshot(box);

	box = boxen(chalk.yellow(randomText));

	t.snapshot(box);
});
