import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.mjs";
import {ToggleGroupStateContext as $84b7d8702d4ff4a8$export$a8a71863db173133} from "./ToggleButtonGroup.mjs";
import {useToggleButtonGroupItem as $jrJ9L$useToggleButtonGroupItem, useToggleButton as $jrJ9L$useToggleButton, useFocusRing as $jrJ9L$useFocusRing, useHover as $jrJ9L$useHover, mergeProps as $jrJ9L$mergeProps} from "react-aria";
import $jrJ9L$react, {createContext as $jrJ9L$createContext, forwardRef as $jrJ9L$forwardRef, useContext as $jrJ9L$useContext} from "react";
import {useToggleState as $jrJ9L$useToggleState} from "react-stately";

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




const $efde0372d7a700fe$export$43506d75ebd2e218 = /*#__PURE__*/ (0, $jrJ9L$createContext)({});
const $efde0372d7a700fe$export$d2b052e7b4be1756 = /*#__PURE__*/ (0, $jrJ9L$forwardRef)(function ToggleButton(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $efde0372d7a700fe$export$43506d75ebd2e218);
    let groupState = (0, $jrJ9L$useContext)((0, $84b7d8702d4ff4a8$export$a8a71863db173133));
    let state = (0, $jrJ9L$useToggleState)(groupState && props.id != null ? {
        isSelected: groupState.selectedKeys.has(props.id),
        onChange (isSelected) {
            groupState.setSelected(props.id, isSelected);
        }
    } : props);
    let { buttonProps: buttonProps, isPressed: isPressed, isSelected: isSelected, isDisabled: isDisabled } = groupState && props.id != null ? (0, $jrJ9L$useToggleButtonGroupItem)({
        ...props,
        id: props.id
    }, groupState, ref) : (0, $jrJ9L$useToggleButton)({
        ...props,
        id: props.id != null ? String(props.id) : undefined
    }, state, ref);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $jrJ9L$useFocusRing)(props);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $jrJ9L$useHover)(props);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
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
    return /*#__PURE__*/ (0, $jrJ9L$react).createElement("button", {
        ...(0, $jrJ9L$mergeProps)(buttonProps, focusProps, hoverProps),
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


export {$efde0372d7a700fe$export$43506d75ebd2e218 as ToggleButtonContext, $efde0372d7a700fe$export$d2b052e7b4be1756 as ToggleButton};
//# sourceMappingURL=ToggleButton.module.js.map
