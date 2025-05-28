var $c5ccf687772c0422$exports = require("./utils.main.js");
var $fed71ed29b70a020$exports = require("./ToggleButtonGroup.main.js");
var $3sDBP$reactaria = require("react-aria");
var $3sDBP$react = require("react");
var $3sDBP$reactstately = require("react-stately");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ToggleButtonContext", () => $3def510c5b419a98$export$43506d75ebd2e218);
$parcel$export(module.exports, "ToggleButton", () => $3def510c5b419a98$export$d2b052e7b4be1756);
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




const $3def510c5b419a98$export$43506d75ebd2e218 = /*#__PURE__*/ (0, $3sDBP$react.createContext)({});
const $3def510c5b419a98$export$d2b052e7b4be1756 = /*#__PURE__*/ (0, $3sDBP$react.forwardRef)(function ToggleButton(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $3def510c5b419a98$export$43506d75ebd2e218);
    let groupState = (0, $3sDBP$react.useContext)((0, $fed71ed29b70a020$exports.ToggleGroupStateContext));
    let state = (0, $3sDBP$reactstately.useToggleState)(groupState && props.id != null ? {
        isSelected: groupState.selectedKeys.has(props.id),
        onChange (isSelected) {
            groupState.setSelected(props.id, isSelected);
        }
    } : props);
    let { buttonProps: buttonProps, isPressed: isPressed, isSelected: isSelected, isDisabled: isDisabled } = groupState && props.id != null ? (0, $3sDBP$reactaria.useToggleButtonGroupItem)({
        ...props,
        id: props.id
    }, groupState, ref) : (0, $3sDBP$reactaria.useToggleButton)({
        ...props,
        id: props.id != null ? String(props.id) : undefined
    }, state, ref);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $3sDBP$reactaria.useFocusRing)(props);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $3sDBP$reactaria.useHover)(props);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        id: undefined,
        values: {
            isHovered: isHovered,
            isPressed: isPressed,
            isFocused: isFocused,
            isSelected: state.isSelected,
            isFocusVisible: isFocusVisible,
            isDisabled: isDisabled,
            state: state
        },
        defaultClassName: 'react-aria-ToggleButton'
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($3sDBP$react))).createElement("button", {
        ...(0, $3sDBP$reactaria.mergeProps)(buttonProps, focusProps, hoverProps),
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-focused": isFocused || undefined,
        "data-disabled": isDisabled || undefined,
        "data-pressed": isPressed || undefined,
        "data-selected": isSelected || undefined,
        "data-hovered": isHovered || undefined,
        "data-focus-visible": isFocusVisible || undefined
    });
});


//# sourceMappingURL=ToggleButton.main.js.map
