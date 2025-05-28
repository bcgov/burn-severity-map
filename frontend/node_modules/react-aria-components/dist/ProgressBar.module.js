import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3, useSlot as $64fa3d84918910a7$export$9d4c57ee4c6ffdd8} from "./utils.module.js";
import {LabelContext as $01b77f81d0f07f68$export$75b6ee27786ba447} from "./Label.module.js";
import {useProgressBar as $hU2kz$useProgressBar} from "react-aria";
import {clamp as $hU2kz$clamp} from "@react-stately/utils";
import $hU2kz$react, {createContext as $hU2kz$createContext, forwardRef as $hU2kz$forwardRef} from "react";

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




const $0393f8ab869a0f1a$export$e9f3bf65a26ce129 = /*#__PURE__*/ (0, $hU2kz$createContext)(null);
const $0393f8ab869a0f1a$export$c17561cb55d4db30 = /*#__PURE__*/ (0, $hU2kz$forwardRef)(function ProgressBar(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $0393f8ab869a0f1a$export$e9f3bf65a26ce129);
    let { value: value = 0, minValue: minValue = 0, maxValue: maxValue = 100, isIndeterminate: isIndeterminate = false } = props;
    value = (0, $hU2kz$clamp)(value, minValue, maxValue);
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let { progressBarProps: progressBarProps, labelProps: labelProps } = (0, $hU2kz$useProgressBar)({
        ...props,
        label: label
    });
    // Calculate the width of the progress bar as a percentage
    let percentage = isIndeterminate ? undefined : (value - minValue) / (maxValue - minValue) * 100;
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        defaultClassName: 'react-aria-ProgressBar',
        values: {
            percentage: percentage,
            valueText: progressBarProps['aria-valuetext'],
            isIndeterminate: isIndeterminate
        }
    });
    return /*#__PURE__*/ (0, $hU2kz$react).createElement("div", {
        ...progressBarProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined
    }, /*#__PURE__*/ (0, $hU2kz$react).createElement((0, $01b77f81d0f07f68$export$75b6ee27786ba447).Provider, {
        value: {
            ...labelProps,
            ref: labelRef,
            elementType: 'span'
        }
    }, renderProps.children));
});


export {$0393f8ab869a0f1a$export$e9f3bf65a26ce129 as ProgressBarContext, $0393f8ab869a0f1a$export$c17561cb55d4db30 as ProgressBar};
//# sourceMappingURL=ProgressBar.module.js.map
