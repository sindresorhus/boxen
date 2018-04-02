'use strict';
const chalk = require('chalk');
const boxen = require('.');

console.log('\n\n' + boxen(chalk.blue.bold('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: 'yellow'
}) + '\n');

console.log('\n\n' + boxen(chalk.blue.bold('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: 'yellow',
	borderStyle: 'double'
}) + '\n');

console.log('\n\n' + boxen(chalk.blue.bold('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: chalk.hex('#eebbaa'),
	borderStyle: 'double'
}) + '\n');

console.log('\n\n' + boxen(chalk.blue.bold('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: chalk.keyword('pink'),
	backgroundColor: chalk.bgKeyword('cyan'),
	borderStyle: 'double'
}) + '\n');

console.log('\n\n' + boxen(chalk.blue.bold('unicorn'), {
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
