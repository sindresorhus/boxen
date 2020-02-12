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
