'use strict';
const chalk = require('chalk');
const boxen = require('.');

console.log('\n\n' + boxen(chalk.blue.bold('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: 'yellow',
	title:'Hello'
}) + '\n');

console.log('\n\n' + boxen(chalk.blue.bold('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: 'yellow',
	borderStyle: 'double',
	title: 'Hello'

}) + '\n');

console.log('\n\n' + boxen(chalk.blue.bold('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: '#eebbaa',
	borderStyle: 'double',
	title: 'Hello',
	titleColor:'red',
	dimTitle:true
}) + '\n');

console.log('\n\n' + boxen(chalk.blue.bold('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: '#ffc0cb',
	backgroundColor: '#00ffff',
	borderStyle: 'double',
	title: 'Hello',
	titleColor: 'red'

}) + '\n');

console.log('\n\n' + boxen(chalk.blue.bold('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: 'yellow',
	backgroundColor: 'magenta',
	title: 'Hello',
	borderStyle: {
		topLeft: '+',
		topRight: '+',
		bottomLeft: '+',
		bottomRight: '+',
		horizontal: '-',
		vertical: '|'
	}
}) + '\n');
