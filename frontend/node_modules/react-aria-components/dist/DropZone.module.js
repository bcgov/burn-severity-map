import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import $dVbUU$intlStringsmodulejs from "./intlStrings.module.js";
import {TextContext as $514c0188e459b4c0$export$9afb8bc826b033ea} from "./Text.module.js";
import {useDrop as $dVbUU$useDrop, useButton as $dVbUU$useButton, useHover as $dVbUU$useHover, useFocusRing as $dVbUU$useFocusRing, useLocalizedStringFormatter as $dVbUU$useLocalizedStringFormatter, useClipboard as $dVbUU$useClipboard, mergeProps as $dVbUU$mergeProps, VisuallyHidden as $dVbUU$VisuallyHidden} from "react-aria";
import {useObjectRef as $dVbUU$useObjectRef, useSlotId as $dVbUU$useSlotId, useLabels as $dVbUU$useLabels, filterDOMProps as $dVbUU$filterDOMProps} from "@react-aria/utils";
import {isFocusable as $dVbUU$isFocusable} from "@react-aria/focus";
import $dVbUU$react, {createContext as $dVbUU$createContext, forwardRef as $dVbUU$forwardRef, useRef as $dVbUU$useRef} from "react";


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 






const $cb088e721efb9218$export$14a72053295ff9a6 = /*#__PURE__*/ (0, $dVbUU$createContext)(null);
const $cb088e721efb9218$export$3c6489d84dc98b6 = /*#__PURE__*/ (0, $dVbUU$forwardRef)(function DropZone(props, ref) {
    let { isDisabled: isDisabled = false } = props;
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $cb088e721efb9218$export$14a72053295ff9a6);
    let dropzoneRef = (0, $dVbUU$useObjectRef)(ref);
    let buttonRef = (0, $dVbUU$useRef)(null);
    let { dropProps: dropProps, dropButtonProps: dropButtonProps, isDropTarget: isDropTarget } = (0, $dVbUU$useDrop)({
        ...props,
        ref: buttonRef,
        hasDropButton: true
    });
    let { buttonProps: buttonProps } = (0, $dVbUU$useButton)(dropButtonProps || {}, buttonRef);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $dVbUU$useHover)(props);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $dVbUU$useFocusRing)();
    let stringFormatter = (0, $dVbUU$useLocalizedStringFormatter)((0, ($parcel$interopDefault($dVbUU$intlStringsmodulejs))), 'react-aria-components');
    let textId = (0, $dVbUU$useSlotId)();
    let ariaLabel = props['aria-label'] || stringFormatter.format('dropzoneLabel');
    let messageId = props['aria-labelledby'];
    let ariaLabelledby = [
        textId,
        messageId
    ].filter(Boolean).join(' ');
    let labelProps = (0, $dVbUU$useLabels)({
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby
    });
    let { clipboardProps: clipboardProps } = (0, $dVbUU$useClipboard)({
        isDisabled: isDisabled,
        onPaste: (items)=>{
            var _props_onDrop;
            return (_props_onDrop = props.onDrop) === null || _props_onDrop === void 0 ? void 0 : _props_onDrop.call(props, {
                type: 'drop',
                items: items,
                x: 0,
                y: 0,
                dropOperation: 'copy'
            });
        }
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            isHovered: isHovered,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isDropTarget: isDropTarget,
            isDisabled: isDisabled
        },
        defaultClassName: 'react-aria-DropZone'
    });
    let DOMProps = (0, $dVbUU$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $dVbUU$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                (0, $514c0188e459b4c0$export$9afb8bc826b033ea),
                {
                    id: textId,
                    slot: 'label'
                }
            ]
        ]
    }, /*#__PURE__*/ (0, $dVbUU$react).createElement("div", {
        ...(0, $dVbUU$mergeProps)(dropProps, hoverProps, DOMProps),
        ...renderProps,
        slot: props.slot || undefined,
        ref: dropzoneRef,
        onClick: (e)=>{
            var _dropzoneRef_current;
            let target = e.target;
            while(target && ((_dropzoneRef_current = dropzoneRef.current) === null || _dropzoneRef_current === void 0 ? void 0 : _dropzoneRef_current.contains(target))){
                if ((0, $dVbUU$isFocusable)(target)) break;
                else if (target === dropzoneRef.current) {
                    var _buttonRef_current;
                    (_buttonRef_current = buttonRef.current) === null || _buttonRef_current === void 0 ? void 0 : _buttonRef_current.focus();
                    break;
                }
                target = target.parentElement;
            }
        },
        "data-hovered": isHovered || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-drop-target": isDropTarget || undefined,
        "data-disabled": isDisabled || undefined
    }, /*#__PURE__*/ (0, $dVbUU$react).createElement((0, $dVbUU$VisuallyHidden), null, /*#__PURE__*/ (0, $dVbUU$react).createElement("button", {
        ...(0, $dVbUU$mergeProps)(buttonProps, focusProps, clipboardProps, labelProps),
        ref: buttonRef
    })), renderProps.children));
});


export {$cb088e721efb9218$export$14a72053295ff9a6 as DropZoneContext, $cb088e721efb9218$export$3c6489d84dc98b6 as DropZone};
//# sourceMappingURL=DropZone.module.js.map
