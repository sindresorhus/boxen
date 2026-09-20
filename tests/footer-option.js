import test from 'ava';
import chalk, {Chalk} from 'chalk';
import boxen from '../index.js';

const level3Chalk = new Chalk({level: 3});

/**
Run a function with ANSI colors enabled.
*/
const withColorEnabled = callback => {
	const {level} = chalk;
	chalk.level = 3;

	try {
		return callback();
	} finally {
		chalk.level = level;
	}
};

// These snapshots are known to fail in this environment. AVA's `cbor` dependency drops data on Node.js 26, so the snapshot files AVA writes cannot be read back. The tests pass on the first run, which records the snapshots, and fail on every run after that.

test('footer option works', t => {
	const box = boxen('foo', {
		footer: 'footer',
	});

	t.snapshot(box);
});

test('footer align left', t => {
	const box = boxen('foo bar foo bar', {
		footer: 'footer',
		footerAlignment: 'left',
	});

	t.snapshot(box);
});

test('footer align center', t => {
	const box = boxen('foo bar foo bar', {
		footer: 'footer',
		footerAlignment: 'center',
	});

	t.snapshot(box);
});

test('footer align right', t => {
	const box = boxen('foo bar foo bar', {
		footer: 'footer',
		footerAlignment: 'right',
	});

	t.snapshot(box);
});

test('long footer expands box', t => {
	const box = boxen('foo', {
		footer: 'very long footer',
	});

	t.snapshot(box);
});

test('title and footer together', t => {
	const box = boxen('foo', {
		title: 'title',
		footer: 'footer',
	});

	t.snapshot(box);
});

test('footer + width option', t => {
	// Not enough space, no footer
	t.snapshot(
		boxen('foo', {
			footer: 'very long footer',
			width: 3,
		}),
	);

	// Space for only one character
	t.snapshot(
		boxen('foo', {
			footer: 'very long footer',
			width: 5,
		}),
	);

	t.snapshot(
		boxen('foo', {
			footer: 'very long footer',
			width: 20,
		}),
	);

	t.snapshot(
		boxen('foo', {
			footer: level3Chalk.red('colorful footer'),
			width: 18,
		}),
	);
});

test('footer option with border style (none)', t => {
	const box = boxen('foo', {
		footer: 'footer',
		borderStyle: 'none',
	});

	t.snapshot(box);
});

test('footer uses the border color', t => {
	const box = withColorEnabled(() => boxen('foo', {
		footer: 'footer',
		borderColor: 'red',
	}));

	t.true(box.includes(level3Chalk.red('└ footer ┘')));
});
