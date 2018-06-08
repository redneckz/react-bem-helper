'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

function pick(keys) {
    return function (obj) {
        if (!keys || !obj) {
            return {};
        }
        var validKeys = keys.filter(function (key) {
            return key in obj;
        });
        var filteredProps = validKeys.map(function (key) {
            var _ref;

            return _ref = {}, _ref[key] = obj[key], _ref;
        });
        return Object.assign.apply(Object, [{}].concat(filteredProps));
    };
}

function capitalize(str) {
    if (str === null || str === undefined || str === '') {
        return '';
    }
    if (typeof str !== 'string') {
        return capitalize(String(str));
    }
    return '' + str[0].toUpperCase() + str.substr(1).toLowerCase();
}

function decapitalize(str) {
    if (str === null || str === undefined || str === '') {
        return '';
    }
    if (typeof str !== 'string') {
        return decapitalize(String(str));
    }
    return '' + str[0].toLowerCase() + str.substr(1);
}

/**
 * Translates string to kebab-case
 */
function kebabCase(str) {
    if (str === null || str === undefined || str === '') {
        return '';
    }
    if (typeof str !== 'string') {
        return kebabCase(String(str));
    }
    return str.replace(/([A-Z]+)/g, '-$1').replace(/\W+/g, '-').replace(/^\W+/, '').replace(/\W+$/, '').toLowerCase();
}

function kebabToCamelCase(str) {
    if (str === null || str === undefined || str === '') {
        return '';
    }
    if (typeof str !== 'string') {
        return kebabToCamelCase(String(str));
    }
    if (str.indexOf('-') === -1) {
        // Not a kebab-case
        return clean(str);
    }

    var _map = (str.match(/[^-]+/g) || []).map(clean),
        head = _map[0],
        tail = _map.slice(1);

    return [decapitalize(head)].concat(tail.map(capitalize)).join('');
}

function clean(str) {
    return str.replace(/^\W+/, '').replace(/\W+$/, '');
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var bind = createCommonjsModule(function (module) {
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(this && this[arg] || arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(this, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(this && this[key] || key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (typeof undefined === 'function' && typeof undefined.amd === 'object' && undefined.amd) {
		// register as 'classnames', consistent with npm package name
		undefined('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());
});

/**
 * Wrapper around "classnames/bind" with slightly different output
 */
function classNamesList() {
    var styles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var boundClassNames = bind.bind(styles);
    return function () {
        return boundClassNames.apply(undefined, arguments).split(' ').filter(Boolean);
    };
}

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var KNOWN_KEYS = ['key', 'className', 'children'];

/**
 * Since react@15.2.0 there is new mechanism for handling unknown props.
 * This factory function provides straighforward way to define React DOM component
 * with restricted list of attributes (whitelist)
 */
function tag(tagName) {
    return function () {
        var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var whitelist = KNOWN_KEYS.concat(Object.keys(attrs));
        var prune = pick(whitelist);
        var Tag = function Tag(props) {
            return React.createElement(tagName, _extends({}, attrs, prune(props)));
        };
        Tag.displayName = 'tag(' + tagName + ')';
        return Tag;
    };
}

var div = tag('div');
var span = tag('span');

var form = tag('form');

var button = function button(attrs) {
    return tag('button')(_extends({
        type: 'button',
        onClick: function onClick() {}
    }, attrs));
};

var input = function input(attrs) {
    return tag('input')(_extends({
        type: 'text',
        name: '',
        value: '',
        onChange: function onChange() {},
        onFocus: function onFocus() {},
        onBlur: function onBlur() {}
    }, attrs));
};

var label = function label(attrs) {
    return tag('label')(_extends({
        htmlFor: ''
    }, attrs));
};

var textarea = function textarea(attrs) {
    return tag('textarea')(_extends({
        name: '',
        rows: 2,
        onChange: function onChange() {}
    }, attrs));
};



var index = /*#__PURE__*/Object.freeze({
    tag: tag,
    div: div,
    span: span,
    form: form,
    button: button,
    input: input,
    label: label,
    textarea: textarea
});

/**
 * Decorator to define components bound to particular modifiers
 */
function modifier(predicate, ModifiedComponent) {
    if (typeof predicate !== 'function') {
        throw new TypeError('Please specify modifier predicate');
    }
    if (typeof ModifiedComponent !== 'function') {
        throw new TypeError('Please specify modified component');
    }
    return function (DefaultComponent) {
        function Wrapper(props) {
            var modifiers = props['data-modifiers']; // Comes from block or element decorators

            var modifiersList = modifiers ? modifiers.split(' ') : [];
            var ActualComponent = predicate(modifiersList) ? ModifiedComponent : DefaultComponent;
            return React.createElement(ActualComponent, props);
        }
        Wrapper.displayName = 'modifier(' + (DefaultComponent.displayName || DefaultComponent.name) + ')';
        return Wrapper;
    };
}

var is = function is(mod) {
    return function (modifiersList) {
        return modifiersList.indexOf(mod) !== -1;
    };
};


var startsWith = function startsWith(prefix) {
    return function (modifiersList) {
        return modifiersList.some(function (m) {
            return m.indexOf(prefix) === 0;
        });
    };
};

var and = function and() {
    for (var _len = arguments.length, predicates = Array(_len), _key = 0; _key < _len; _key++) {
        predicates[_key] = arguments[_key];
    }

    return function (modifiersList) {
        return predicates.every(function (p) {
            return p(modifiersList);
        });
    };
};

var or = function or() {
    for (var _len2 = arguments.length, predicates = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        predicates[_key2] = arguments[_key2];
    }

    return function (modifiersList) {
        return predicates.some(function (p) {
            return p(modifiersList);
        });
    };
};

var not = function not(predicate) {
    return function (modifiersList) {
        return !predicate(modifiersList);
    };
};



var index$1 = /*#__PURE__*/Object.freeze({
    modifier: modifier,
    is: is,
    startsWith: startsWith,
    and: and,
    or: or,
    not: not
});

var BEMConfig = {
    ELEMENT_SEPARATOR: '__',
    MODIFIER_SEPARATOR: '--'
};

var blockContextsMap = {};

function createBlockContext(_ref) {
    var name = _ref.name,
        styles = _ref.styles;

    if (!blockContextsMap[name]) {
        blockContextsMap[name] = {
            name: name,
            styles: styles,
            modifiersContext: React.createContext()
        };
    }
    return blockContextsMap[name];
}

/**
 * Computes class names of block regarding active modifiers
 */
function blockClassNames(blockName) {
    if (!blockName) {
        throw new TypeError('[BEM] Block name should be defined');
    }
    return modifiedClassNames(blockName);
}

/**
 * Computes class names of element regarding active modifiers
 */
function elementClassNames(blockName, elementName) {
    if (!blockName) {
        throw new TypeError('[BEM] Block name should be defined');
    }
    if (!elementName) {
        throw new TypeError('[BEM] Element name should be defined');
    }
    return modifiedClassNames('' + blockName + BEMConfig.ELEMENT_SEPARATOR + elementName);
}

function modifiedClassNames(baseName) {
    return function (modifiers) {
        var modifiersClassNames = modifiers ? modifiers.filter(Boolean).map(adjustModifier).map(function (mod) {
            return '' + baseName + BEMConfig.MODIFIER_SEPARATOR + mod;
        }) : [];
        return [baseName].concat(modifiersClassNames);
    };
}

function adjustModifier(modifier) {
    return modifier.split(BEMConfig.MODIFIER_SEPARATOR).map(kebabCase).join(BEMConfig.MODIFIER_SEPARATOR);
}

/**
 * HOC to declare BEM blocks.
 * Injects [className] and [data-modifiers].
 *
 * Usage:
 *
 * import { block, element, createBlockContext } from '@redneckz/react-bem-helper';
 *
 * const ctx = createBlockContext({ name: 'foo' });
 * const Foo = block(ctx)()('div');
 * const Bar = element(ctx)('bar')('div');
 *
 * <Foo>
 *     <Bar>123</Bar>
 * </Foo>
 */
function block(context) {
    var name = context.name,
        styles = context.styles,
        ModifiersContext = context.modifiersContext;

    return function () {
        var modifiersMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        return function (BlockComponent) {
            function BaseBlockWrapper(props) {
                var className = props.className;

                var modifiers = classNamesList()(modifiersMap(props));
                return React.createElement(
                    ModifiersContext.Provider,
                    { value: modifiers.join(' ') },
                    React.createElement(BlockComponent, _extends({}, props, {
                        className: classNamesList(styles)(blockClassNames(name)(modifiers), className // BEM mixin
                        ).join(' '),
                        'data-modifiers': modifiers.join(' ')
                    }))
                );
            }
            BaseBlockWrapper.displayName = 'block(' + name + ')';
            return BaseBlockWrapper;
        };
    };
}

/**
 * HOC to declare BEM elements.
 * Injects [className] and [data-modifiers].
 *
 * Usage:
 *
 * import { block, element, pick, createBlockContext } from '@redneckz/react-bem-helper';
 *
 * const ctx = createBlockContext({ name: 'foo' });
 * const Foo = block(ctx)()('div');
 * const Bar = element(ctx)(
 *     'bar',
 *     pick(['quux', 'plugh']), // modifiers
 * )('div');
 *
 * <Foo>
 *     <Bar quux plugh>123</Bar>
 * </Foo>
 */
function element(context) {
    var blockName = context.name,
        blockStyles = context.styles,
        ModifiersContext = context.modifiersContext;

    return function (elementName) {
        var modifiersMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return function (ElementComponent) {
            var styles = options.styles;

            function ElementWrapper(props) {
                var className = props.className;

                return React.createElement(
                    ModifiersContext.Consumer,
                    null,
                    function (blockModifiers) {
                        var elementNamesList = elementClassNames(blockName, elementName);
                        var blockModifiersList = classNamesList()(blockModifiers);
                        var modifiers = classNamesList()(modifiersMap(props, blockModifiersList));
                        return React.createElement(ElementComponent, _extends({}, props, {
                            className: classNamesList(styles || blockStyles)(elementNamesList(modifiers), className // BEM mixin
                            ).join(' '),
                            'data-modifiers': modifiers.join(' ')
                        }));
                    }
                );
            }
            ElementWrapper.displayName = 'element(' + elementName + ')';
            return ElementWrapper;
        };
    };
}

/**
 * Creates modifiers map transparently applying all block modifiers to element
 * Usage:
 *
 * const Bar = element(ctx)(
 *     'bar',
 *     transparent(),
 * )('div');
 *
 * <Foo quux plugh>
 *     <Bar>123</Bar> <!-- "quux" and "plugh" will be applied -->
 * </Foo>
 */
function transparent() {
    var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

    return function (props, blockModifiersList) {
        return [map(props), blockModifiersList];
    };
}

function parseBEMName(name) {
    var ELEMENT_SEPARATOR = BEMConfig.ELEMENT_SEPARATOR,
        MODIFIER_SEPARATOR = BEMConfig.MODIFIER_SEPARATOR;

    var namePattern = '^(.+?)(' + ELEMENT_SEPARATOR + '(.+?))?(' + MODIFIER_SEPARATOR + '(.+))?$';

    var _ref = name.match(namePattern) || [],
        blockName = _ref[1],
        elementName = _ref[3],
        modifier = _ref[5];

    return [blockName, elementName, modifier];
}

function findoutBlockDescriptor(styles) {
    var namesList = Object.keys(styles);
    var someName = namesList[0];

    var _parseBEMName = parseBEMName(someName),
        blockName = _parseBEMName[0];

    return [blockName, findoutModifiers(namesList)(blockName)];
}

function findoutElementDescriptors(styles) {
    var namesList = Object.keys(styles);
    return namesList.map(parseBEMName).map(function (_ref2) {
        var elementName = _ref2[1];
        return elementName;
    }).filter(Boolean).map(function (elementName) {
        return [elementName, findoutModifiers(namesList)(elementName)];
    });
}

function findoutModifiers(namesList) {
    return function (name) {
        return namesList.map(parseBEMName).filter(function (_ref3) {
            var blockName = _ref3[0],
                elementName = _ref3[1];
            return blockName === name || elementName === name;
        }).map(function (_ref4) {
            var modifier = _ref4[2];
            return modifier;
        }).filter(Boolean);
    };
}

function modifiersListToModifiersMap(modifiersList) {
    if (!modifiersList || modifiersList.length === 0) {
        return function () {};
    }
    return function (props) {
        return [booleanModifiersListToModifiersMap(modifiersList || [])(props), enumerableModifiersListToModifiersMap(modifiersList || [])(props)];
    };
}

function booleanModifiersListToModifiersMap(modifiersList) {
    var booleanModifiers = modifiersList.filter(function (mod) {
        return !isEnumerableModifier(mod);
    });
    var booleanProps = booleanModifiers.map(kebabToCamelCase);
    return pick(booleanProps);
}

function enumerableModifiersListToModifiersMap(modifiersList) {
    var enumerableModifiers = modifiersList.filter(isEnumerableModifier);
    var enumerableProps = enumerableModifiers.map(function (pair) {
        return pair.split(BEMConfig.MODIFIER_SEPARATOR);
    }).map(function (_ref) {
        var mod = _ref[0];
        return mod;
    }).map(kebabToCamelCase);
    return function (props) {
        return Object.assign.apply(Object, [{}].concat(enumerableProps.map(function (key) {
            var _ref2;

            return props[key] && (_ref2 = {}, _ref2['' + key + BEMConfig.MODIFIER_SEPARATOR + props[key]] = true, _ref2);
        })));
    };
}

function isEnumerableModifier(mod) {
    return mod.indexOf(BEMConfig.MODIFIER_SEPARATOR) > 0;
}

/**
 * BEM factory provider.
 * Can be used to generate BEM HOCs from BEM CSS.
 */
function BEM(styles) {
    if (!styles || Object.keys(styles).length === 0) {
        throw new Error('[BEM] No class names found. Nothing to parse.');
    }

    var _findoutBlockDescript = findoutBlockDescriptor(styles),
        blockName = _findoutBlockDescript[0],
        blockModifiers = _findoutBlockDescript[1];

    var ctx = createBlockContext({ name: blockName, styles: styles });
    var elementDescriptors = findoutElementDescriptors(styles);
    return Object.assign.apply(Object, [block(ctx)(modifiersListToModifiersMap(blockModifiers))].concat(elementDescriptors.map(function (_ref) {
        var _ref2;

        var elementName = _ref[0],
            elementModifiers = _ref[1];

        var elementHOC = element(ctx)(elementName, modifiersListToModifiersMap(elementModifiers));
        return _ref2 = {}, _ref2[elementName] = elementHOC, _ref2[kebabToCamelCase(elementName)] = elementHOC, _ref2;
    })));
}

exports.Modifiers = index$1;
exports.Tags = index;
exports.BEMConfig = BEMConfig;
exports.BEM = BEM;
exports.createBlockContext = createBlockContext;
exports.block = block;
exports.element = element;
exports.transparent = transparent;
exports.modifier = modifier;
exports.is = is;
exports.startsWith = startsWith;
exports.and = and;
exports.or = or;
exports.not = not;
exports.tag = tag;
exports.div = div;
exports.span = span;
exports.form = form;
exports.button = button;
exports.input = input;
exports.label = label;
exports.textarea = textarea;
exports.pick = pick;
exports.capitalize = capitalize;
exports.decapitalize = decapitalize;
exports.kebabCase = kebabCase;
exports.kebabToCamelCase = kebabToCamelCase;
exports.classNamesList = classNamesList;
//# sourceMappingURL=index.js.map
