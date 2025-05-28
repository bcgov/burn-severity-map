import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import {createHideableComponent as $jMZTB$createHideableComponent} from "@react-aria/collections";
import {useHover as $jMZTB$useHover, useFocusRing as $jMZTB$useFocusRing, mergeProps as $jMZTB$mergeProps} from "react-aria";
import $jMZTB$react, {createContext as $jMZTB$createContext} from "react";

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



const $3985021b0ad6602f$export$37fb8590cf2c088c = /*#__PURE__*/ (0, $jMZTB$createContext)({});
let $3985021b0ad6602f$var$filterHoverProps = (props)=>{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let { onHoverStart: onHoverStart, onHoverChange: onHoverChange, onHoverEnd: onHoverEnd, ...otherProps } = props;
    return otherProps;
};
const $3985021b0ad6602f$export$f5b8910cec6cf069 = /*#__PURE__*/ (0, $jMZTB$createHideableComponent)(function Input(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $3985021b0ad6602f$export$37fb8590cf2c088c);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $jMZTB$useHover)(props);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $jMZTB$useFocusRing)({
        isTextInput: true,
        autoFocus: props.autoFocus
    });
    let isInvalid = !!props['aria-invalid'] && props['aria-invalid'] !== 'false';
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
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
    return /*#__PURE__*/ (0, $jMZTB$react).createElement("input", {
        ...(0, $jMZTB$mergeProps)($3985021b0ad6602f$var$filterHoverProps(props), focusProps, hoverProps),
        ...renderProps,
        ref: ref,
        "data-focused": isFocused || undefined,
        "data-disabled": props.disabled || undefined,
        "data-hovered": isHovered || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-invalid": isInvalid || undefined
    });
});


export {$3985021b0ad6602f$export$37fb8590cf2c088c as InputContext, $3985021b0ad6602f$export$f5b8910cec6cf069 as Input};
//# sourceMappingURL=Input.module.js.map
