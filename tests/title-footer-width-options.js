import test from 'ava';
import boxen from '../index.js';

test('longest of title, footer, or content expands box', t => {
	t.snapshot(
		boxen('very, very, very long content', {
			title: 'short title',
			footer: 'short footer',
		}),
	);

	t.snapshot(
		boxen('short content', {
			title: 'much, much, much longer title',
			footer: 'short footer',
		}),
	);

	t.snapshot(
		boxen('short content', {
			title: 'short title',
			footer: 'much, much, much longer footer',
		}),
	);
});

test('title + footer + width option', t => {
	// Not enough space, no title
	t.snapshot(
		boxen('short content', {
			title: 'very long title',
			footer: 'very long footer',
			width: 3,
		}),
	);

	// Space for only one character
	t.snapshot(
		boxen('short content', {
			title: 'very long title',
			footer: 'very long footer',
			width: 5,
		}),
	);

	t.snapshot(
		boxen('short content', {
			title: 'very long title',
			footer: 'very long footer',
			width: 30,
		}),
	);
});
