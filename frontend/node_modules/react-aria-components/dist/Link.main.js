var $c5ccf687772c0422$exports = require("./utils.main.js");
var $7KWRi$reactaria = require("react-aria");
var $7KWRi$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "LinkContext", () => $c87397ee936d2bda$export$e2509388b49734e7);
$parcel$export(module.exports, "Link", () => $c87397ee936d2bda$export$a6c7ac8248d6e38a);
/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 


const $c87397ee936d2bda$export$e2509388b49734e7 = /*#__PURE__*/ (0, $7KWRi$react.createContext)(null);
const $c87397ee936d2bda$export$a6c7ac8248d6e38a = /*#__PURE__*/ (0, $7KWRi$react.forwardRef)(function Link(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $c87397ee936d2bda$export$e2509388b49734e7);
    let ElementType = props.href && !props.isDisabled ? 'a' : 'span';
    let { linkProps: linkProps, isPressed: isPressed } = (0, $7KWRi$reactaria.useLink)({
        ...props,
        elementType: ElementType
    }, ref);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $7KWRi$reactaria.useHover)(props);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $7KWRi$reactaria.useFocusRing)();
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-Link',
        values: {
            isCurrent: !!props['aria-current'],
            isDisabled: props.isDisabled || false,
            isPressed: isPressed,
            isHovered: isHovered,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($7KWRi$react))).createElement(ElementType, {
        ref: ref,
        slot: props.slot || undefined,
        ...(0, $7KWRi$reactaria.mergeProps)(renderProps, linkProps, hoverProps, focusProps),
        "data-focused": isFocused || undefined,
        "data-hovered": isHovered || undefined,
        "data-pressed": isPressed || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-current": !!props['aria-current'] || undefined,
        "data-disabled": props.isDisabled || undefined
    }, renderProps.children);
});


//# sourceMappingURL=Link.main.js.map
