# react-bem-helper

BEM library for React

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

# Table of Contents

* [Install](#install)
* [Motivation](#motivation)
* [Features](#features)
* [Prerequisites](#prerequisites)
* [Usage](#usage)
    * [Block with element](#block-with-element)
    * [Block with namespaced element](#block-with-namespaced-element)
    * [Block with enumerable modifier](#block-with-enumerable-modifier)
    * [Block shares modifier across elements](#block-shares-modifier-across-elements)
    * [Modular CSS](#modular-css)
    * [Modifier component](#modifier-component)
* [Configuration](#configuration)
* [License](#license)

# Install

```bash
npm install --save @redneckz/react-bem-helper
```

# Motivation

This library helps to declare *BEM* entities in terms of *React* components.
Primarily it useful to organize interaction between *React* components
and *style* artifacts (CSS, Less, Sass, ...) computing valid class names
and ensuring compliance with the BEM naming convention (configurable).

# Features

1. Decorators *\@block*, *\@element*, *\@modifier* to define *BEM* entities
as *React* components
2. *className* property computation according to active modifiers
3. *BEM* naming convention assertion
4. Component name assertion
5. *BEM mixins* support
6. Modular CSS support
7. Configurable

# Prerequisites

1. [BEM Methodology](https://en.bem.info/methodology/)
2. [ECMAScript Decorators](https://github.com/wycats/javascript-decorators)
3. [classnames](https://www.npmjs.com/package/classnames)

# Usage

```jsx
import React from 'react';
import {block} from '@redneckz/react-bem-helper';

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

This is *very similar* to

```jsx
const SomeButton = block('some-button', ({disabled}) => ({disabled}))(
    ({className, ...props}) => <button className={className} {...props} />
);
```

Or *even* more complicated

```jsx
@block('some-button', ({disabled}) => ({disabled}))
class Panel extends React.PureComponent {
    render() {
        const {className, ...props} = this.props;
        return <button className={className} {...props} />;
    }
}
```

And one *more* (button attributes are *whitelisted* in the following example)

```jsx
import React from 'react';
import {block, button} from '@redneckz/react-bem-helper';

const SomeButton = block('some-button', ({disabled}) => ({disabled}))(
    button({disabled: false}) // Produces DOM component
);
```

All of the above can be applied to *\@element*.

## Block with element

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

## Block with namespaced element

Both *\@block* and *\@plainBlock* decorators support so called namespaced *@element* decorator.

> *\@plainBlock* is a simplified version of *\@block* decorator.
>
> Support of standalone *\@element* is disabled due to performance reasons
> (see https://facebook.github.io/react/docs/context.html).
> But its interface is very similar to *\@block*.
> So it can be used as follows (with "renaming"):
>
> `import {plainBlock as block} from '@redneckz/react-bem-helper';`
>
> Use namespaced *\@element* instead of standalone *\@element*. For example:
>
> `const Foo = plainBlock('foo')('div');`
>
> `const Bar = Foo.element('bar')('div');`

Following example uses *Panel* defined earlier

```jsx
const PanelTitle = Panel.element('title')('div');
```

Also such definitions are useful in complicated cases:

```jsx
const BlockA = block('block-a')(() => (
    <BlockB>
        <ElementA /> {/* ElementA is erroneously bound to BlockB */}
        <ElementB /> {/* ElementB works just fine */}
    </BlockB>
));
const ElementA = element('element-a')('div');
const ElementB = BlockA.element('element-b')('div');
```

## Block with enumerable modifier

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

## Block shares modifier across elements

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

## Modular CSS

```jsx
import styles from './panel.scss';

const SomeButton = block(
    'some-button',
     // Component props to block modifiers transducer
    ({disabled}) => ({disabled}),
    {styles} // Can be passed as second argument
)('button');
```

Styles bound to block will be applied to its elements.

## Modifier component

Some times it's useful to define separate JSX artifacts for particular modifiers.

```jsx
const SomeButton = block(
    'some-button',
    ({icon}) => ({icon})
)(
    'button', // default component (no modifiers applied)
    modifier('icon')(({className, icon}) => (
        <svg
            className={className}
            width={SIZE} height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
        >
            <Group><path d={icon} /></Group>
        </svg>
    ))
);
```

```jsx
const Group = element('group')('g');
```

See the Pen [Block "some-button" with modifier component "some-button--icon"](https://codepen.io/redneckz/pen/QvZzWE)
on [CodePen](http://codepen.io)

## Configuration

*BEM* naming convention can be configured

```javascript
import React from 'react';
import {Config} from '@redneckz/react-bem-helper';

Config.ELEMENT_SEPARATOR = '__';
Config.MODIFIER_SEPARATOR = '--';
Config.ASSERTION_ENABLED = process.env.NODE_ENV === 'development';
Config.COMPONENT_BASE_CLASS = React.PureComponent;
```

# License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://badge.fury.io/js/%40redneckz%2Freact-bem-helper.svg
[npm-url]: https://www.npmjs.com/package/%40redneckz%2Freact-bem-helper
[travis-image]: https://travis-ci.org/redneckz/react-bem-helper.svg?branch=master
[travis-url]: https://travis-ci.org/redneckz/react-bem-helper
[coveralls-image]: https://coveralls.io/repos/github/redneckz/react-bem-helper/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/redneckz/react-bem-helper?branch=master
