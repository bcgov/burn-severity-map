import {removeDataAttributes as $64fa3d84918910a7$export$ef03459518577ad4, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import {useSwitch as $hYf9o$useSwitch, useFocusRing as $hYf9o$useFocusRing, useHover as $hYf9o$useHover, mergeProps as $hYf9o$mergeProps, VisuallyHidden as $hYf9o$VisuallyHidden} from "react-aria";
import {useObjectRef as $hYf9o$useObjectRef, mergeRefs as $hYf9o$mergeRefs, filterDOMProps as $hYf9o$filterDOMProps} from "@react-aria/utils";
import $hYf9o$react, {createContext as $hYf9o$createContext, forwardRef as $hYf9o$forwardRef} from "react";
import {useToggleState as $hYf9o$useToggleState} from "react-stately";

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




const $8e59e948500a8fe1$export$8699e3b644d5a28a = /*#__PURE__*/ (0, $hYf9o$createContext)(null);
const $8e59e948500a8fe1$export$b5d5cf8927ab7262 = /*#__PURE__*/ (0, $hYf9o$forwardRef)(function Switch(props, ref) {
    let { inputRef: userProvidedInputRef = null, ...otherProps } = props;
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(otherProps, ref, $8e59e948500a8fe1$export$8699e3b644d5a28a);
    let inputRef = (0, $hYf9o$useObjectRef)((0, $hYf9o$mergeRefs)(userProvidedInputRef, props.inputRef !== undefined ? props.inputRef : null));
    let state = (0, $hYf9o$useToggleState)(props);
    let { labelProps: labelProps, inputProps: inputProps, isSelected: isSelected, isDisabled: isDisabled, isReadOnly: isReadOnly, isPressed: isPressed } = (0, $hYf9o$useSwitch)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        // ReactNode type doesn't allow function children.
        children: typeof props.children === 'function' ? true : props.children
    }, state, inputRef);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $hYf9o$useFocusRing)();
    let isInteractionDisabled = props.isDisabled || props.isReadOnly;
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $hYf9o$useHover)({
        ...props,
        isDisabled: isInteractionDisabled
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
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
    let DOMProps = (0, $hYf9o$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $hYf9o$react).createElement("label", {
        ...(0, $hYf9o$mergeProps)(DOMProps, labelProps, hoverProps, renderProps),
        ref: ref,
        slot: props.slot || undefined,
        "data-selected": isSelected || undefined,
        "data-pressed": isPressed || undefined,
        "data-hovered": isHovered || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-disabled": isDisabled || undefined,
        "data-readonly": isReadOnly || undefined
    }, /*#__PURE__*/ (0, $hYf9o$react).createElement((0, $hYf9o$VisuallyHidden), {
        elementType: "span"
    }, /*#__PURE__*/ (0, $hYf9o$react).createElement("input", {
        ...(0, $hYf9o$mergeProps)(inputProps, focusProps),
        ref: inputRef
    })), renderProps.children);
});


export {$8e59e948500a8fe1$export$8699e3b644d5a28a as SwitchContext, $8e59e948500a8fe1$export$b5d5cf8927ab7262 as Switch};
//# sourceMappingURL=Switch.module.js.map
