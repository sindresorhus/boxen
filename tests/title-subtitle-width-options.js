import test from 'ava';
import boxen from '../index.js';

test('longest of title, subtitle, or content expands box', t => {
	t.snapshot(
		boxen('very, very, very long content', {
			title: 'short title',
			subtitle: 'short subtitle',
		}),
	);

	t.snapshot(
		boxen('short content', {
			title: 'much, much, much longer title',
			subtitle: 'short subtitle',
		}),
	);

	t.snapshot(
		boxen('short content', {
			title: 'short title',
			subtitle: 'much, much, much longer subtitle',
		}),
	);
});

test('title + subtitle + width option', t => {
	// Not enough space, no title
	t.snapshot(
		boxen('short content', {
			title: 'very long title',
			subtitle: 'very long subtitle',
			width: 3,
		}),
	);

	// Space for only one character
	t.snapshot(
		boxen('short content', {
			title: 'very long title',
			subtitle: 'very long subtitle',
			width: 5,
		}),
	);

	t.snapshot(
		boxen('short content', {
			title: 'very long title',
			subtitle: 'very long subtitle',
			width: 30,
		}),
	);
});
