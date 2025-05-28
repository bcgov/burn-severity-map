import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import {useHover as $gZciS$useHover, useFocusRing as $gZciS$useFocusRing, mergeProps as $gZciS$mergeProps} from "react-aria";
import $gZciS$react, {createContext as $gZciS$createContext, forwardRef as $gZciS$forwardRef} from "react";

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


const $a049562f99e7db0e$export$f9c6924e160136d1 = /*#__PURE__*/ (0, $gZciS$createContext)({});
const $a049562f99e7db0e$export$eb2fcfdbd7ba97d4 = /*#__PURE__*/ (0, $gZciS$forwardRef)(function Group(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $a049562f99e7db0e$export$f9c6924e160136d1);
    let { isDisabled: isDisabled, isInvalid: isInvalid, onHoverStart: onHoverStart, onHoverChange: onHoverChange, onHoverEnd: onHoverEnd, ...otherProps } = props;
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $gZciS$useHover)({
        onHoverStart: onHoverStart,
        onHoverChange: onHoverChange,
        onHoverEnd: onHoverEnd,
        isDisabled: isDisabled
    });
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $gZciS$useFocusRing)({
        within: true
    });
    isDisabled !== null && isDisabled !== void 0 ? isDisabled : isDisabled = !!props['aria-disabled'] && props['aria-disabled'] !== 'false';
    isInvalid !== null && isInvalid !== void 0 ? isInvalid : isInvalid = !!props['aria-invalid'] && props['aria-invalid'] !== 'false';
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
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
    return /*#__PURE__*/ (0, $gZciS$react).createElement("div", {
        ...(0, $gZciS$mergeProps)(otherProps, focusProps, hoverProps),
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


export {$a049562f99e7db0e$export$f9c6924e160136d1 as GroupContext, $a049562f99e7db0e$export$eb2fcfdbd7ba97d4 as Group};
//# sourceMappingURL=Group.module.js.map
