var $c5ccf687772c0422$exports = require("./utils.main.js");
var $84ae0bf5bd8e2a5f$exports = require("./Label.main.js");
var $av4IL$reactaria = require("react-aria");
var $av4IL$reactstatelyutils = require("@react-stately/utils");
var $av4IL$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ProgressBarContext", () => $0d6436f6a1b0b001$export$e9f3bf65a26ce129);
$parcel$export(module.exports, "ProgressBar", () => $0d6436f6a1b0b001$export$c17561cb55d4db30);
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




const $0d6436f6a1b0b001$export$e9f3bf65a26ce129 = /*#__PURE__*/ (0, $av4IL$react.createContext)(null);
const $0d6436f6a1b0b001$export$c17561cb55d4db30 = /*#__PURE__*/ (0, $av4IL$react.forwardRef)(function ProgressBar(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $0d6436f6a1b0b001$export$e9f3bf65a26ce129);
    let { value: value = 0, minValue: minValue = 0, maxValue: maxValue = 100, isIndeterminate: isIndeterminate = false } = props;
    value = (0, $av4IL$reactstatelyutils.clamp)(value, minValue, maxValue);
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let { progressBarProps: progressBarProps, labelProps: labelProps } = (0, $av4IL$reactaria.useProgressBar)({
        ...props,
        label: label
    });
    // Calculate the width of the progress bar as a percentage
    let percentage = isIndeterminate ? undefined : (value - minValue) / (maxValue - minValue) * 100;
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-ProgressBar',
        values: {
            percentage: percentage,
            valueText: progressBarProps['aria-valuetext'],
            isIndeterminate: isIndeterminate
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($av4IL$react))).createElement("div", {
        ...progressBarProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($av4IL$react))).createElement((0, $84ae0bf5bd8e2a5f$exports.LabelContext).Provider, {
        value: {
            ...labelProps,
            ref: labelRef,
            elementType: 'span'
        }
    }, renderProps.children));
});


//# sourceMappingURL=ProgressBar.main.js.map
