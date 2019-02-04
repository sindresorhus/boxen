import {expectType} from 'tsd-check';
import boxen, { Spacing, BorderStyle, Options} from '.';
import { BoxStyle } from 'cli-boxes';

const border: BoxStyle = {
	topLeft: ' ',
	topRight: ' ',
	bottomLeft: ' ',
	bottomRight: ' ',
	horizontal: ' ',
	vertical: ' '
};

const spacing: Spacing = {
	top: 1,
	right: 0,
	bottom: 1,
	left: 0
};

expectType<string>(boxen('unicorns'));
expectType<string>(boxen('unicorns', {borderColor: 'green'}));
expectType<string>(boxen('unicorns', {borderStyle: BorderStyle.Double}));
expectType<string>(boxen('unicorns', {borderStyle: border}));
expectType<string>(boxen('unicorns', {dimBorder: true}));
expectType<string>(boxen('unicorns', {padding: 3}));
expectType<string>(boxen('unicorns', {padding: spacing}));
expectType<string>(boxen('unicorns', {margin: 3}));
expectType<string>(boxen('unicorns', {margin: spacing}));
expectType<string>(boxen('unicorns', {float: 'center'}));
expectType<string>(boxen('unicorns', {backgroundColor: 'green'}));
expectType<string>(boxen('unicorns', {align: 'right'}));

const b: Options = {borderColor: 'b'}
