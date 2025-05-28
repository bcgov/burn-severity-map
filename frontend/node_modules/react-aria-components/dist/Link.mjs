import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.mjs";
import {useLink as $115DY$useLink, useHover as $115DY$useHover, useFocusRing as $115DY$useFocusRing, mergeProps as $115DY$mergeProps} from "react-aria";
import $115DY$react, {createContext as $115DY$createContext, forwardRef as $115DY$forwardRef} from "react";

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


const $4f118338184dc1d9$export$e2509388b49734e7 = /*#__PURE__*/ (0, $115DY$createContext)(null);
const $4f118338184dc1d9$export$a6c7ac8248d6e38a = /*#__PURE__*/ (0, $115DY$forwardRef)(function Link(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $4f118338184dc1d9$export$e2509388b49734e7);
    let ElementType = props.href && !props.isDisabled ? 'a' : 'span';
    let { linkProps: linkProps, isPressed: isPressed } = (0, $115DY$useLink)({
        ...props,
        elementType: ElementType
    }, ref);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $115DY$useHover)(props);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $115DY$useFocusRing)();
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
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
    return /*#__PURE__*/ (0, $115DY$react).createElement(ElementType, {
        ref: ref,
        slot: props.slot || undefined,
        ...(0, $115DY$mergeProps)(renderProps, linkProps, hoverProps, focusProps),
        "data-focused": isFocused || undefined,
        "data-hovered": isHovered || undefined,
        "data-pressed": isPressed || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-current": !!props['aria-current'] || undefined,
        "data-disabled": props.isDisabled || undefined
    }, renderProps.children);
});


export {$4f118338184dc1d9$export$e2509388b49734e7 as LinkContext, $4f118338184dc1d9$export$a6c7ac8248d6e38a as Link};
//# sourceMappingURL=Link.module.js.map
