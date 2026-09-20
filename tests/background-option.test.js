import assert from 'node:assert/strict';
import {test} from 'node:test';
import boxen from '../index.js';
import './setup.js';

test('backgroundColor option', t => {
	const box = boxen('foo', {backgroundColor: 'red'});

	t.assert.snapshot(box);
});

test('backgroundColor hex', t => {
	const box = boxen('foo', {backgroundColor: '#FF0000'});

	t.assert.snapshot(box);
});

test('throws on unexpected backgroundColor', () => {
	assert.throws(() => {
		boxen('foo', {backgroundColor: 'dark-yellow'});
	}, {message: 'dark-yellow is not a valid backgroundColor'});
});

test('borderBackgroundColor option', t => {
	const box = boxen('foo', {borderBackgroundColor: 'red'});

	t.assert.snapshot(box);
});

test('borderBackgroundColor hex', t => {
	const box = boxen('foo', {borderBackgroundColor: '#FF0000'});

	t.assert.snapshot(box);
});

test('borderBackgroundColor with conflicting backgroundColor', t => {
	const box = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: 'red'});

	t.assert.snapshot(box);
});

test('borderBackgroundColor and dimBorder option', t => {
	const box = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: 'red', dimBorder: true});

	t.assert.snapshot(box);
});

test('borderBackgroundColor inherit with backgroundColor', t => {
	const box = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: 'inherit'});

	t.assert.snapshot(box);
});

test('borderBackgroundColor inherit without backgroundColor', t => {
	const box = boxen('foo', {borderBackgroundColor: 'inherit'});

	t.assert.snapshot(box);
});

test('borderBackgroundColor undefined disables background', t => {
	const box = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: undefined});

	t.assert.snapshot(box);
});

test('borderBackgroundColor defaults to inherit', () => {
	const box1 = boxen('foo', {backgroundColor: 'blue'});
	const box2 = boxen('foo', {backgroundColor: 'blue', borderBackgroundColor: 'inherit'});

	assert.equal(box1, box2);
});

test('throws on unexpected borderBackgroundColor', () => {
	assert.throws(() => {
		boxen('foo', {borderBackgroundColor: 'dark-yellow'});
	}, {message: 'dark-yellow is not a valid borderBackgroundColor'});
});
