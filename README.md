# react-bem-helper

BEM library for React

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

## Install

```bash
npm i --save react-bem-helper
```

## Motivation

This library helps to declare *BEM* entities in terms of *React* components.
Primarily it useful to organize interaction between *React* components
and *style* artifacts (CSS, Less, Sass, ...) computing valid class names
and ensuring compliance with the BEM naming convention (configurable).

## Features

1. Decorators *\@block*, *\@element*, *\@modifier* to define *BEM* entities
as *React* components
2. *className* property computation according to active modifiers
3. BEM naming convention assertion
4. Component name assertion
5. BEM mixins support
6. Modular CSS support
7. Configurable

## Prerequisites

1. [BEM Methodology](https://en.bem.info/methodology/)
2. [ECMAScript Decorators](https://github.com/wycats/javascript-decorators)
3. [classnames](https://www.npmjs.com/package/classnames)

## Usage

```jsx
import React from 'react';
import {block} from 'react-bem-helper';

const SomeButton = block(
    'some-button',
     // Component props to block modifiers transducer
    ({disabled}) => ({disabled})
)('button');
```

```jsx
<SomeButton disabled>BEM</SomeButton>
```

will produce

```html
<button class="some-button some-button--disabled" disabled>BEM</button>
```

*BEM* naming convention can be configured

```javascript
import React from 'react';
import {Config} from 'react-bem-helper';

Config.ELEMENT_SEPARATOR = '__';
Config.MODIFIER_SEPARATOR = '--';
Config.ASSERTION_ENABLED = process.env.NODE_ENV === 'development';
Config.COMPONENT_BASE_CLASS = React.PureComponent;
```

### Block "panel" with element "title"

```jsx
@block('panel')
class Panel extends React.PureComponent {
    render() {
        const {className, title, children} = this.props;
        return (
            <div className={className}>
                <PanelTitle>{title}</PanelTitle>
                {children}
            </div>
        );
    }
}
```

```jsx
const PanelTitle = element('title')('div');
```

See the Pen [Block "panel" with element "title"](https://codepen.io/redneckz/pen/pPrByW)
on [CodePen](http://codepen.io)

### Block "some-button" with enumerable modifier "size"

```jsx
@block(
    'some-button',
    ({size, disabled}) => [`size-${size}`, {disabled}]
)
class SomeButton extends React.PureComponent {
    render() {
        const {
            className, // computed and injected by @block
            disabled,
            children
        } = this.props;
        return (
            <button className={className} disabled={disabled}>
                {children}
            </button>
        );
    }
}
```

See the Pen [Block "some-button" with enumerable modifier "size"](http://codepen.io/redneckz/pen/vmJMwX)
on [CodePen](http://codepen.io)

### Block "panel" shares modifier "inverted" with its elements

```jsx
const Panel = block(
    'panel',
    ({inverted}) => ({inverted})
)(({className, title, children}) => (
    <div className={className}>
        <PanelTitle>{title}</PanelTitle>
        {children}
    </div>
))
```

```jsx
const PanelTitle = element(
    'title',
    // Apply block modifiers as is (transparently)
    transparent()
)('div');
```

See the Pen [Block "panel" shares modifier "inverted" with its elements](https://codepen.io/redneckz/pen/vmrRvN)
on [CodePen](http://codepen.io)

## License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://img.shields.io/npm/v/live-xxx.svg
[npm-url]: https://npmjs.org/package/live-xxx
[travis-image]: https://travis-ci.org/redneckz/react-bem-helper.svg?branch=master
[travis-url]: https://travis-ci.org/redneckz/react-bem-helper
[coveralls-image]: https://coveralls.io/repos/github/redneckz/react-bem-helper/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/redneckz/react-bem-helper?branch=master
