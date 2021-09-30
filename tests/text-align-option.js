import test from 'ava';
import boxen from '../index.js';

const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id erat arcu. Integer urna mauris, sodales vel egestas eu, consequat id turpis. Vivamus faucibus est mattis tincidunt lobortis. In aliquam placerat nunc eget viverra. Duis aliquet faucibus diam, blandit tincidunt magna congue eu. Sed vel ante vestibulum, maximus risus eget, iaculis velit. Quisque id dapibus purus, ut sodales lorem. Aenean laoreet iaculis tellus at malesuada. Donec imperdiet eu lacus vitae fringilla.';

test('text alignement option (left)', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'left',
	});

	t.snapshot(box);
});

test('text alignement option (center)', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'center',
	});

	t.snapshot(box);
});

test('text alignement option (right)', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'right',
	});

	t.snapshot(box);
});

test('text alignement option (left) + padding', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'left',
		padding: 1,
	});

	t.snapshot(box);
});

test('text alignement option (center) + padding', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'center',
		padding: 1,
	});

	t.snapshot(box);
});

test('text alignement option (right) + padding', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'right',
		padding: 1,
	});

	t.snapshot(box);
});

test('text alignement option (left) + long title', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'left',
		title: 'This is a famous movie quote:',
	});

	t.snapshot(box);
});

test('text alignement option (center) + long title', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'center',
		title: 'This is a famous movie quote:',
	});

	t.snapshot(box);
});

test('text alignement option (right) + long title', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'right',
		title: 'This is a famous movie quote:',
	});

	t.snapshot(box);
});

test('text alignement option (left) + long title + padding', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'left',
		title: 'This is a famous movie quote:',
		padding: 1,
	});

	t.snapshot(box);
});

test('text alignement option (center) + long title + padding', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'center',
		title: 'This is a famous movie quote:',
		padding: 1,
	});

	t.snapshot(box);
});

test('text alignement option (right) + long title + padding', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'right',
		title: 'This is a famous movie quote:',
		padding: 1,
	});

	t.snapshot(box);
});

test('text alignement option (left) + long title + padding + margin', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'left',
		title: 'This is a famous movie quote:',
		margin: 1,
		padding: 1,
	});

	t.snapshot(box);
});

test('text alignement option (center) + long title + padding + margin', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'center',
		title: 'This is a famous movie quote:',
		margin: 1,
		padding: 1,
	});

	t.snapshot(box);
});

test('text alignement option (right) + long title + padding + margin', t => {
	const box = boxen('Hello there !\nGeneral Kenobi !', {
		textAlignment: 'right',
		title: 'This is a famous movie quote:',
		margin: 1,
		padding: 1,
	});

	t.snapshot(box);
});

test('text alignement option (center) after wrapping', t => {
	const box = boxen(longText, {
		textAlignment: 'center',
	});

	t.snapshot(box);
});

test('text alignement option (right) after wrapping', t => {
	const box = boxen(longText, {
		textAlignment: 'right',
	});

	t.snapshot(box);
});

test('text alignement option (center) after wrapping + padding', t => {
	const box = boxen(longText, {
		textAlignment: 'center',
		padding: 1,
	});

	t.snapshot(box);
});

test('text alignement option (right) after wrapping + padding + margin', t => {
	const box = boxen(longText, {
		textAlignment: 'center',
		margin: 1,
		padding: 1,
	});

	t.snapshot(box);
});
