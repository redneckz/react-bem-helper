# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [2.0.2] - 2018-12-24

### Added

-   ☆ TypeScript definitions ☆

## [2.0.1] - 2018-08-06

### Changed

-   Build scripts to optimize bundling time

## [2.0.0] - 2018-06-08

### Added

-   ☆ Migration to React 16.4 (context) ☆
-   ☆ BEM factory to share context between blocks and elements ☆
-   ☆ Flow typings ☆
-   New build script based on "rollup"
-   Enumerable modifiers support
-   Tags namespace to declare DOM components

### Changed

-   Renamed Config to BEMConfig

### Removed

-   JSDocs
-   plainBlock (according to new context API)

## [1.1.1] - 2018-03-13

### Fixed

-   Critical issue with block context propagation

## [1.1.0] - 2018-03-12

### Fixed

-   Issues related to React 16

### Added

-   "pick" utility to define simple mapping from props to modifiers
-   Modifier predicates to define separate components for particular modifiers

### Changed

-   _\@modifier_ decorator is totally refactored (breaking changes)
-   _README_ updated according to refactoring
-   Dev. dependencies updated
-   Bundle optimized by means of [Rollup](https://github.com/rollup/rollup)

### Removed

-   Lodash dependency

## [1.0.4] - 2017-05-30

### Fixed

-   UMD builds (build:es)
-   _\@plainBlock_ comments and documentation

### Added

-   _README_ extended with methodological section
-   _VersionEye_ integration

### Changed

-   Dev. dependencies updated

## [1.0.3] - 2017-05-26

### Added

-   Namespaced _\@element_ decorator provided by _\@block_ and _\@plainBlock_ decorators (see Issue \#9)

### Fixed

-   Issue \#9 Element catches wrong block

## [1.0.2] - 2017-05-24

### Added

-   _tag_ factory is extended with form tags (form, input, label, button, textarea)

### Fixed

-   Issue \#8 Support mixins

## [1.0.1] - 2017-05-19

### Added

-   This _CHANGELOG_
-   _\@plainBlock_ decorator similar to _\@block_ but without _\@element_ and _\@modifier_ support (performance reasons)
-   _tag_ factory function to define simple DOM components with restricted list of attributes (see react\@15.2.0 unknown props warning)

### Changed

-   _README_ updated with new cases
-   Minor refactoring

## 1.0.0 - 2017-05-17

### Added

-   _\@block_, _\@element_, _\@modifier_ decorators to define _BEM_ entities as _React_ components
-   _BEM_ naming convention assertions
-   Modular tests
-   _Travis CI_ integration
-   _Coveralls_ integration
-   _README_ with the very basic documentation

[unreleased]: https://github.com/redneckz/react-bem-helper/compare/v2.0.2...HEAD
[2.0.2]: https://github.com/redneckz/react-bem-helper/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/redneckz/react-bem-helper/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/redneckz/react-bem-helper/compare/v1.1.1...v2.0.0
[1.1.1]: https://github.com/redneckz/react-bem-helper/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/redneckz/react-bem-helper/compare/v1.0.4...v1.1.0
[1.0.4]: https://github.com/redneckz/react-bem-helper/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/redneckz/react-bem-helper/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/redneckz/react-bem-helper/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/redneckz/react-bem-helper/compare/v1.0.0...v1.0.1
