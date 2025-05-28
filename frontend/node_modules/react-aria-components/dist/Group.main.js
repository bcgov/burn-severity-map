var $c5ccf687772c0422$exports = require("./utils.main.js");
var $1Rw7b$reactaria = require("react-aria");
var $1Rw7b$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "GroupContext", () => $dcae72abc18c0045$export$f9c6924e160136d1);
$parcel$export(module.exports, "Group", () => $dcae72abc18c0045$export$eb2fcfdbd7ba97d4);
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


const $dcae72abc18c0045$export$f9c6924e160136d1 = /*#__PURE__*/ (0, $1Rw7b$react.createContext)({});
const $dcae72abc18c0045$export$eb2fcfdbd7ba97d4 = /*#__PURE__*/ (0, $1Rw7b$react.forwardRef)(function Group(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $dcae72abc18c0045$export$f9c6924e160136d1);
    let { isDisabled: isDisabled, isInvalid: isInvalid, onHoverStart: onHoverStart, onHoverChange: onHoverChange, onHoverEnd: onHoverEnd, ...otherProps } = props;
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $1Rw7b$reactaria.useHover)({
        onHoverStart: onHoverStart,
        onHoverChange: onHoverChange,
        onHoverEnd: onHoverEnd,
        isDisabled: isDisabled
    });
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $1Rw7b$reactaria.useFocusRing)({
        within: true
    });
    isDisabled !== null && isDisabled !== void 0 ? isDisabled : isDisabled = !!props['aria-disabled'] && props['aria-disabled'] !== 'false';
    isInvalid !== null && isInvalid !== void 0 ? isInvalid : isInvalid = !!props['aria-invalid'] && props['aria-invalid'] !== 'false';
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: {
            isHovered: isHovered,
            isFocusWithin: isFocused,
            isFocusVisible: isFocusVisible,
            isDisabled: isDisabled,
            isInvalid: isInvalid
        },
        defaultClassName: 'react-aria-Group'
    });
    var _props_role, _props_slot;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($1Rw7b$react))).createElement("div", {
        ...(0, $1Rw7b$reactaria.mergeProps)(otherProps, focusProps, hoverProps),
        ...renderProps,
        ref: ref,
        role: (_props_role = props.role) !== null && _props_role !== void 0 ? _props_role : 'group',
        slot: (_props_slot = props.slot) !== null && _props_slot !== void 0 ? _props_slot : undefined,
        "data-focus-within": isFocused || undefined,
        "data-hovered": isHovered || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-disabled": isDisabled || undefined,
        "data-invalid": isInvalid || undefined
    }, renderProps.children);
});


//# sourceMappingURL=Group.main.js.map
