# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.3] - 2017-05-26

### Added

- Namespaced *\@element* decorator provided by *\@block* and *\@plainBlock* decorators (see Issue \#9)

### Fixed

- Issue \#9 Element catches wrong block

## [1.0.2] - 2017-05-24

### Added

- *tag* factory is extended with form tags (form, input, label, button, textarea)

### Fixed

- Issue \#8 Support mixins

## [1.0.1] - 2017-05-19

### Added

- This *CHANGELOG*
- *\@plainBlock* decorator similar to *\@block* but without *\@element* and *\@modifier* support (performance reasons)
- *tag* factory function to define simple DOM components with restricted list of attributes (see react\@15.2.0 unknown props warning)

### Changed

- *README* updated with new cases
- Minor refactoring

## 1.0.0 - 2017-05-17

### Added

- *\@block*, *\@element*, *\@modifier* decorators to define *BEM* entities as *React* components
- *BEM* naming convention assertions
- Modular tests
- *Travis CI* integration
- *Coveralls* integration
- *README* with the very basic documentation

[Unreleased]: https://github.com/redneckz/react-bem-helper/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/redneckz/react-bem-helper/compare/v1.0.0...v1.0.1
[1.0.2]: https://github.com/redneckz/react-bem-helper/compare/v1.0.1...v1.0.2
[1.0.3]: https://github.com/redneckz/react-bem-helper/compare/v1.0.2...v1.0.3
