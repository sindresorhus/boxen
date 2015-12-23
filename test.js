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
