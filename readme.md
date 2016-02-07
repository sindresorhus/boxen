# ![boxen](screenshot.png)

> Create boxes in the terminal

[![Build Status](https://travis-ci.org/sindresorhus/boxen.svg?branch=master)](https://travis-ci.org/sindresorhus/boxen)


## Install

```
$ npm install --save boxen
```


## Usage

```js
const boxen = require('boxen');

console.log(boxen('unicorn', {padding: 1}));
/*
┌─────────────┐
│             │
│   unicorn   │
│             │
└─────────────┘
*/

console.log(boxen('unicorn', {padding: 1, margin: 1, borderStyle: 'double'}));
/*

   ╔═════════════╗
   ║             ║
   ║   unicorn   ║
   ║             ║
   ╚═════════════╝

*/
```


## API

### boxen(input, [options])

#### input

Type: `string`

Text inside the box.

#### options

##### borderColor

Type: `string`  
Values: `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `gray`

Color of the box border.

##### borderStyle

Type: `string`, `object`
Default: `single`
Values:
- `single`, e.g.
```
┌───┐
│foo│
└───┘
```
- `double`, e.g.
```
╔═══╗
║foo║
╚═══╝
```
- `round` (`single` sides with round corners), e.g.
```
╭───╮
│foo│
╰───╯
```
- `single-double` (`single` on top and bottom, `double` on right and left), e.g.
```
╓───╖
║foo║
╙───╜
```
- `double-single` (`double` on top and bottom, `single` on right and left), e.g.
```
╒═══╕
│foo│
╘═══╛
```

Style of the box border. Can be any of the predefined styles from above or an object with the following keys:

- `topLeft`: The string to use for the top-left corner
- `topRight`: The string to use for the top-right corner
- `bottomLeft`: The string to use for the bottom-left corner
- `bottomRight`: The string to use for the bottom-right corner
- `vertical`: The string to use for the vertical sides (right and left)
- `horizontal`: The string to use for the horizontal sides (top and bottom)

The following object would render an ASCII-like box: `{ topLeft: '+', topRight: '+', bottomLeft: '+', bottomRight '+', horizontal: '-', vertical: '|'};`.


##### padding

Type: `number`, `object`  
Default: `0`

Space between the text and box border.

Accepts a number or an object with any of the `top`, `right`, `bottom`, `left` properties. When a number is specified, the left/right padding is 3 times the top/bottom to make it look nice.

##### margin

Type: `number`, `object`  
Default: `0`

Space around the box.

Accepts a number or an object with any of the `top`, `right`, `bottom`, `left` properties. When a number is specified, the left/right margin is 3 times the top/bottom to make it look nice.


## Related

- [boxen-cli](https://github.com/sindresorhus/boxen-cli) - CLI for this module


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
