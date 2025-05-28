var $c5ccf687772c0422$exports = require("./utils.main.js");
var $hNQDK$reactaria = require("react-aria");
var $hNQDK$reactariautils = require("@react-aria/utils");
var $hNQDK$react = require("react");
var $hNQDK$reactstately = require("react-stately");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "SwitchContext", () => $8d81efc5c2ff8011$export$8699e3b644d5a28a);
$parcel$export(module.exports, "Switch", () => $8d81efc5c2ff8011$export$b5d5cf8927ab7262);
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




const $8d81efc5c2ff8011$export$8699e3b644d5a28a = /*#__PURE__*/ (0, $hNQDK$react.createContext)(null);
const $8d81efc5c2ff8011$export$b5d5cf8927ab7262 = /*#__PURE__*/ (0, $hNQDK$react.forwardRef)(function Switch(props, ref) {
    let { inputRef: userProvidedInputRef = null, ...otherProps } = props;
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(otherProps, ref, $8d81efc5c2ff8011$export$8699e3b644d5a28a);
    let inputRef = (0, $hNQDK$reactariautils.useObjectRef)((0, $hNQDK$reactariautils.mergeRefs)(userProvidedInputRef, props.inputRef !== undefined ? props.inputRef : null));
    let state = (0, $hNQDK$reactstately.useToggleState)(props);
    let { labelProps: labelProps, inputProps: inputProps, isSelected: isSelected, isDisabled: isDisabled, isReadOnly: isReadOnly, isPressed: isPressed } = (0, $hNQDK$reactaria.useSwitch)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        // ReactNode type doesn't allow function children.
        children: typeof props.children === 'function' ? true : props.children
    }, state, inputRef);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $hNQDK$reactaria.useFocusRing)();
    let isInteractionDisabled = props.isDisabled || props.isReadOnly;
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $hNQDK$reactaria.useHover)({
        ...props,
        isDisabled: isInteractionDisabled
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-Switch',
        values: {
            isSelected: isSelected,
            isPressed: isPressed,
            isHovered: isHovered,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isDisabled: isDisabled,
            isReadOnly: isReadOnly,
            state: state
        }
    });
    let DOMProps = (0, $hNQDK$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($hNQDK$react))).createElement("label", {
        ...(0, $hNQDK$reactaria.mergeProps)(DOMProps, labelProps, hoverProps, renderProps),
        ref: ref,
        slot: props.slot || undefined,
        "data-selected": isSelected || undefined,
        "data-pressed": isPressed || undefined,
        "data-hovered": isHovered || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-disabled": isDisabled || undefined,
        "data-readonly": isReadOnly || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($hNQDK$react))).createElement((0, $hNQDK$reactaria.VisuallyHidden), {
        elementType: "span"
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($hNQDK$react))).createElement("input", {
        ...(0, $hNQDK$reactaria.mergeProps)(inputProps, focusProps),
        ref: inputRef
    })), renderProps.children);
});


//# sourceMappingURL=Switch.main.js.map
