# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.1] - 2017-05-19

### Added

- This *CHANGELOG*
- *\@plainBlock* decorator similar to *\@block* but without *\@element* and *\@modifier* support (performance reasons)
- *tag* factory function to define simple DOM components with restricted list of attributes (see react\@15.2.0 unknown props warning)

### Changed

- *README* updated with new cases
- Minor refactoring

## [1.0.0] - 2017-05-17

### Added

- *\@block*, *\@element*, *\@modifier* decorators to define *BEM* entities as *React* components
- *BEM* naming convention assertions
- Modular tests
- *Travis CI* integration
- *Coveralls* integration
- *README* with the very basic documentation

[Unreleased]: https://github.com/redneckz/react-bem-helper/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/redneckz/react-bem-helper/compare/v1.0.0...v1.0.1