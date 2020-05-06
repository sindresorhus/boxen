'use strict';
const chalk = require('chalk');
const boxen = require('.');

console.log('\n\n' + boxen(chalk.cyan('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: 'yellow'
}) + '\n');

console.log('\n\n' + boxen(chalk.cyan('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: 'yellow',
	borderStyle: 'double'
}) + '\n');

console.log('\n\n' + boxen(chalk.cyan('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: '#eebbaa',
	borderStyle: 'double'
}) + '\n');

console.log('\n\n' + boxen(chalk.black('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: '#ffc0cb',
	backgroundColor: '#00ffff',
	borderStyle: 'double'
}) + '\n');

console.log('\n\n' + boxen(chalk.black('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: 'yellow',
	backgroundColor: 'magenta',
	borderStyle: {
		topLeft: '+',
		topRight: '+',
		bottomLeft: '+',
		bottomRight: '+',
		horizontal: '-',
		vertical: '|'
	}
}) + '\n');

const sentences = 'Unbreakable_text_because_it_has_no_spaces '.repeat(5);
console.log('\n\n' + boxen(sentences, {align: 'left'}) + '\n');

console.log('\n\n' + boxen(sentences, {align: 'center'}) + '\n');

console.log('\n\n' + boxen(sentences, {align: 'right', padding: {left: 1, right: 1, top: 0, bottom: 0}}) + '\n');

const longWord = 'x'.repeat(process.stdout.columns + 20);
console.log('\n\n' + boxen(longWord, {align: 'center'}) + '\n');
