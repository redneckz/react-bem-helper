# react-bem-helper

BEM library for React

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependency Status][npm-deps-image]][npm-deps-url]

# Table of Contents

-   [Installation](#installation)
-   [Motivation](#motivation)
-   [Features](#features)
-   [Prerequisites](#prerequisites)
-   [Usage](#usage)
-   [Configuration](#configuration)
    -   [BEM naming convention](#bem-naming-convention)
    -   [Flow](#flow)
-   [License](#license)

# Installation

```bash
$ npm install --save @redneckz/react-bem-helper
```

```bash
$ yarn add @redneckz/react-bem-helper
```

# Motivation

This utility helps to declare BEM entities in terms of React components.
Primarily it useful for projects with CSS artifacts (Sass, Less, PostCSS, ...).

Also compared to other libraries this one is aimed at simplicity and
incremental adaptation of BEM (even for proprietary projects).

# Features

1.  Configurable
2.  BEM mixins support
3.  Modular CSS support
4.  Flow definitions
5.  Very small bundle ~8Kb
6.  Almost no dependencies

# Prerequisites

1.  [BEM Methodology](https://en.bem.info/methodology/)
2.  [Higher-Order Components](https://reactjs.org/docs/higher-order-components.html)
3.  [Flow](https://flow.org/en/)
4.  [classnames](https://www.npmjs.com/package/classnames)

# Usage

```sass
.some-button
    padding: 8px

    &--major
        background: blue

    &--size
        &--small
            padding: 4px
        &--large
            padding: 16px
```

```jsx
import React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import styles from './some-button.sass';

const someButton = BEM(styles);

export const SomeButton = someButton(({ className, disabled, children }) => (
    <button className={className} disabled={disabled}>
        {children}
    </button>
));
```

```jsx
<React.Fragment>
    <SomeButton major>Major</SomeButton>
    <SomeButton size="small">Small</SomeButton>
    <SomeButton major size="large">
        Large
    </SomeButton>
    <SomeButton disabled>Disabled</SomeButton>
</React.Fragment>
```

will produce

```html
<button class="some-button some-button--major">Major</button>
<button class="some-button some-button--size--small">Small</button>
<button class="some-button some-button--major some-button--size--large">Large</button>
<button class="some-button" disabled>Disabled</button>
```

Any valid component can be used to declare block or its elements

```jsx
export const SomeButton = someButton(
    class extends React.PureComponent {
        render() {
            const { className, disabled, children } = this.props;
            return (
                <button className={className} disabled={disabled}>
                    {children}
                </button>
            );
        }
    },
);
```

```javascript
export const SomeButton = someButton('button'); // DOM component
```

Also library provides several factory functions to declare DOM components
with restricted attributes list (div, span, form, button, input, label, textarea)

```javascript
import React from 'react';
import { BEM, div } from '@redneckz/react-bem-helper';
import styles from './some-button.sass';

const someButton = BEM(styles);

export const SomeButton = someButton(div({ role: 'button' }));
```

Block with elements

```sass
.panel
    display: flex

    &__item
        flex-grow: 0

        &--align
            &--start
                align-self: flex-start
            &--center
                align-self: center
            &--end
                align-self: flex-end

    &__spread
        flex-grow: 1
```

```javascript
import React from 'react';
import { BEM, div } from '@redneckz/react-bem-helper';
import styles from './panel.sass';

const panel = BEM(styles);

export const Panel = panel('div');
export const PanelItem = panel.item(div());
export const PanelSpread = panel.spread('div');
```

## Configuration

### BEM naming convention

```javascript
import React from 'react';
import { Config } from '@redneckz/react-bem-helper';

Config.ELEMENT_SEPARATOR = '__';
Config.MODIFIER_SEPARATOR = '--';
```

### Flow

Generate stub for [classnames](https://www.npmjs.com/package/classnames)

```bash
$ flow-typed create-stub classnames@x.x.x
```

Do not forget to configure includes and ignores to put library into scope.

# License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://badge.fury.io/js/%40redneckz%2Freact-bem-helper.svg
[npm-url]: https://www.npmjs.com/package/%40redneckz%2Freact-bem-helper
[npm-deps-image]: https://www.versioneye.com/user/projects/59280e6f131ac0004ae2fe2b/badge.svg?style=flat-square
[npm-deps-url]: https://www.versioneye.com/user/projects/59280e6f131ac0004ae2fe2b
[travis-image]: https://travis-ci.org/redneckz/react-bem-helper.svg?branch=master
[travis-url]: https://travis-ci.org/redneckz/react-bem-helper
[coveralls-image]: https://coveralls.io/repos/github/redneckz/react-bem-helper/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/redneckz/react-bem-helper?branch=master
