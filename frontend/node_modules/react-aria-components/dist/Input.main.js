var $c5ccf687772c0422$exports = require("./utils.main.js");
var $fA2o8$reactariacollections = require("@react-aria/collections");
var $fA2o8$reactaria = require("react-aria");
var $fA2o8$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "InputContext", () => $1bcfcef5af644e13$export$37fb8590cf2c088c);
$parcel$export(module.exports, "Input", () => $1bcfcef5af644e13$export$f5b8910cec6cf069);
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



const $1bcfcef5af644e13$export$37fb8590cf2c088c = /*#__PURE__*/ (0, $fA2o8$react.createContext)({});
let $1bcfcef5af644e13$var$filterHoverProps = (props)=>{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let { onHoverStart: onHoverStart, onHoverChange: onHoverChange, onHoverEnd: onHoverEnd, ...otherProps } = props;
    return otherProps;
};
const $1bcfcef5af644e13$export$f5b8910cec6cf069 = /*#__PURE__*/ (0, $fA2o8$reactariacollections.createHideableComponent)(function Input(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $1bcfcef5af644e13$export$37fb8590cf2c088c);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $fA2o8$reactaria.useHover)(props);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $fA2o8$reactaria.useFocusRing)({
        isTextInput: true,
        autoFocus: props.autoFocus
    });
    let isInvalid = !!props['aria-invalid'] && props['aria-invalid'] !== 'false';
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: {
            isHovered: isHovered,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isDisabled: props.disabled || false,
            isInvalid: isInvalid
        },
        defaultClassName: 'react-aria-Input'
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($fA2o8$react))).createElement("input", {
        ...(0, $fA2o8$reactaria.mergeProps)($1bcfcef5af644e13$var$filterHoverProps(props), focusProps, hoverProps),
        ...renderProps,
        ref: ref,
        "data-focused": isFocused || undefined,
        "data-disabled": props.disabled || undefined,
        "data-hovered": isHovered || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-invalid": isInvalid || undefined
    });
});


//# sourceMappingURL=Input.main.js.map
