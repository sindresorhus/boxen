import process from 'node:process';
import chalk from 'chalk';
import boxen from './index.js';

console.log('\n\n' + boxen(chalk.cyan('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: 'yellow',
}) + '\n');

console.log('\n\n' + boxen(chalk.cyan('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: 'yellow',
	borderStyle: 'double',
}) + '\n');

console.log('\n\n' + boxen(chalk.cyan('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: '#eebbaa',
	borderStyle: 'double',
}) + '\n');

console.log('\n\n' + boxen(chalk.black('unicorn'), {
	padding: 1,
	margin: 1,
	borderColor: '#ffc0cb',
	backgroundColor: '#00ffff',
	borderStyle: 'double',
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
		top: '-',
		bottom: '-',
		left: '|',
		right: '|',
	},
}) + '\n');

const sentences = 'Unbreakable_text_because_it_has_no_spaces '.repeat(5);
console.log('\n\n' + boxen(sentences, {textAlignment: 'left'}) + '\n');

console.log('\n\n' + boxen(sentences, {textAlignment: 'center'}) + '\n');

console.log('\n\n' + boxen(sentences, {
	textAlignment: 'right',
	padding: {
		left: 1,
		right: 1,
		top: 0,
		bottom: 0,
	},
}) + '\n');

const longWord = 'x'.repeat(process.stdout.columns + 20);
console.log('\n\n' + boxen(longWord, {textAlignment: 'center'}) + '\n');

const title = 'Beautiful title';
console.log('\n\n' + boxen('This box has a nice title', {title}) + '\n');

console.log('\n\n' + boxen('This box has a centered title', {title, titleAlignment: 'center'}) + '\n');

const subtitle = 'Interesting subtitle';
console.log('\n\n' + boxen('This box has a nice subtitle', {subtitle}) + '\n');

console.log('\n\n' + boxen('This box has a centered subtitle', {subtitle, subtitleAlignment: 'center'}) + '\n');

console.log('\n\n' + boxen('This box has fixed width of 20', {width: 20}) + '\n');

console.log('\n\n' + boxen('This box has fixed width of 50', {width: 50}) + '\n');

console.log('\n\n' + boxen('This box has fixed height of 5', {height: 5}) + '\n');

console.log('\n\n' + boxen('This box has fixed height of 5', {height: 5, padding: 2}) + '\n');

console.log('\n\n' + boxen('This box has fixed height of 5 and width of 15', {height: 8, width: 15}) + '\n');

console.log('\n\n' + boxen('This box is in fullscreen !', {fullscreen: true}) + '\n');

console.log('\n\n' + boxen('This box is in full-width and half-height !', {fullscreen: (w, h) => [w, h / 2]}) + '\n');

console.log('\n\n' + boxen('And this one is in half-width and full-height !', {fullscreen: (w, h) => [w / 2, h]}) + '\n');
