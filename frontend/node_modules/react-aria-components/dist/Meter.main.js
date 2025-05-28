var $c5ccf687772c0422$exports = require("./utils.main.js");
var $84ae0bf5bd8e2a5f$exports = require("./Label.main.js");
var $ixfXu$reactaria = require("react-aria");
var $ixfXu$reactstatelyutils = require("@react-stately/utils");
var $ixfXu$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "MeterContext", () => $e85da53562ca5320$export$8b645da15a96b44f);
$parcel$export(module.exports, "Meter", () => $e85da53562ca5320$export$62e3ae2a4090b879);
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




const $e85da53562ca5320$export$8b645da15a96b44f = /*#__PURE__*/ (0, $ixfXu$react.createContext)(null);
const $e85da53562ca5320$export$62e3ae2a4090b879 = /*#__PURE__*/ (0, $ixfXu$react.forwardRef)(function Meter(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $e85da53562ca5320$export$8b645da15a96b44f);
    let { value: value = 0, minValue: minValue = 0, maxValue: maxValue = 100 } = props;
    value = (0, $ixfXu$reactstatelyutils.clamp)(value, minValue, maxValue);
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let { meterProps: meterProps, labelProps: labelProps } = (0, $ixfXu$reactaria.useMeter)({
        ...props,
        label: label
    });
    // Calculate the width of the progress bar as a percentage
    let percentage = (value - minValue) / (maxValue - minValue) * 100;
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-Meter',
        values: {
            percentage: percentage,
            valueText: meterProps['aria-valuetext']
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($ixfXu$react))).createElement("div", {
        ...meterProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($ixfXu$react))).createElement((0, $84ae0bf5bd8e2a5f$exports.LabelContext).Provider, {
        value: {
            ...labelProps,
            ref: labelRef,
            elementType: 'span'
        }
    }, renderProps.children));
});


//# sourceMappingURL=Meter.main.js.map
