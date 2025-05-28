import {ButtonContext as $d2b4bc8c273e7be6$export$24d547caef80ccd1} from "./Button.module.js";
import {DEFAULT_SLOT as $64fa3d84918910a7$export$c62b8e45d58ddad9, Provider as $64fa3d84918910a7$export$2881499e37b75b9a, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import {HeadingContext as $4e85f108e88277b8$export$d688439359537581} from "./RSPContexts.module.js";
import {PopoverContext as $07b14b47974efb58$export$9b9a0cd73afb7ca4} from "./Popover.module.js";
import {RootMenuTriggerStateContext as $3674c52c6b3c5bce$export$795aec4671cbae19} from "./Menu.module.js";
import {useOverlayTrigger as $6IYYA$useOverlayTrigger, useId as $6IYYA$useId, useDialog as $6IYYA$useDialog} from "react-aria";
import {filterDOMProps as $6IYYA$filterDOMProps} from "@react-aria/utils";
import {useMenuTriggerState as $6IYYA$useMenuTriggerState} from "react-stately";
import {PressResponder as $6IYYA$PressResponder} from "@react-aria/interactions";
import $6IYYA$react, {createContext as $6IYYA$createContext, useRef as $6IYYA$useRef, forwardRef as $6IYYA$forwardRef, useContext as $6IYYA$useContext} from "react";

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









const $de32f1b87079253c$export$8b93a07348a7730c = /*#__PURE__*/ (0, $6IYYA$createContext)(null);
const $de32f1b87079253c$export$d2f961adcb0afbe = /*#__PURE__*/ (0, $6IYYA$createContext)(null);
function $de32f1b87079253c$export$2e1e1122cf0cba88(props) {
    // Use useMenuTriggerState instead of useOverlayTriggerState in case a menu is embedded in the dialog.
    // This is needed to handle submenus.
    let state = (0, $6IYYA$useMenuTriggerState)(props);
    let buttonRef = (0, $6IYYA$useRef)(null);
    let { triggerProps: triggerProps, overlayProps: overlayProps } = (0, $6IYYA$useOverlayTrigger)({
        type: 'dialog'
    }, state, buttonRef);
    // Label dialog by the trigger as a fallback if there is no title slot.
    // This is done in RAC instead of hooks because otherwise we cannot distinguish
    // between context and props. Normally aria-labelledby overrides the title
    // but when sent by context we want the title to win.
    triggerProps.id = (0, $6IYYA$useId)();
    overlayProps['aria-labelledby'] = triggerProps.id;
    return /*#__PURE__*/ (0, $6IYYA$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $de32f1b87079253c$export$d2f961adcb0afbe,
                state
            ],
            [
                (0, $3674c52c6b3c5bce$export$795aec4671cbae19),
                state
            ],
            [
                $de32f1b87079253c$export$8b93a07348a7730c,
                overlayProps
            ],
            [
                (0, $07b14b47974efb58$export$9b9a0cd73afb7ca4),
                {
                    trigger: 'DialogTrigger',
                    triggerRef: buttonRef
                }
            ]
        ]
    }, /*#__PURE__*/ (0, $6IYYA$react).createElement((0, $6IYYA$PressResponder), {
        ...triggerProps,
        ref: buttonRef,
        isPressed: state.isOpen
    }, props.children));
}
const $de32f1b87079253c$export$3ddf2d174ce01153 = /*#__PURE__*/ (0, $6IYYA$forwardRef)(function Dialog(props, ref) {
    let originalAriaLabelledby = props['aria-labelledby'];
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $de32f1b87079253c$export$8b93a07348a7730c);
    let { dialogProps: dialogProps, titleProps: titleProps } = (0, $6IYYA$useDialog)({
        ...props,
        // Only pass aria-labelledby from props, not context.
        // Context is used as a fallback below.
        'aria-labelledby': originalAriaLabelledby
    }, ref);
    let state = (0, $6IYYA$useContext)($de32f1b87079253c$export$d2f961adcb0afbe);
    if (!dialogProps['aria-label'] && !dialogProps['aria-labelledby']) {
        // If aria-labelledby exists on props, we know it came from context.
        // Use that as a fallback in case there is no title slot.
        if (props['aria-labelledby']) dialogProps['aria-labelledby'] = props['aria-labelledby'];
        else console.warn('If a Dialog does not contain a <Heading slot="title">, it must have an aria-label or aria-labelledby attribute for accessibility.');
    }
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        defaultClassName: 'react-aria-Dialog',
        className: props.className,
        style: props.style,
        children: props.children,
        values: {
            close: (state === null || state === void 0 ? void 0 : state.close) || (()=>{})
        }
    });
    return /*#__PURE__*/ (0, $6IYYA$react).createElement("section", {
        ...(0, $6IYYA$filterDOMProps)(props),
        ...dialogProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined
    }, /*#__PURE__*/ (0, $6IYYA$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                (0, $4e85f108e88277b8$export$d688439359537581),
                {
                    slots: {
                        [(0, $64fa3d84918910a7$export$c62b8e45d58ddad9)]: {},
                        title: {
                            ...titleProps,
                            level: 2
                        }
                    }
                }
            ],
            [
                (0, $d2b4bc8c273e7be6$export$24d547caef80ccd1),
                {
                    slots: {
                        [(0, $64fa3d84918910a7$export$c62b8e45d58ddad9)]: {},
                        close: {
                            onPress: ()=>state === null || state === void 0 ? void 0 : state.close()
                        }
                    }
                }
            ]
        ]
    }, renderProps.children));
});


export {$de32f1b87079253c$export$8b93a07348a7730c as DialogContext, $de32f1b87079253c$export$d2f961adcb0afbe as OverlayTriggerStateContext, $de32f1b87079253c$export$2e1e1122cf0cba88 as DialogTrigger, $de32f1b87079253c$export$3ddf2d174ce01153 as Dialog};
//# sourceMappingURL=Dialog.module.js.map
