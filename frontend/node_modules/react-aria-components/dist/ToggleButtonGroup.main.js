var $c5ccf687772c0422$exports = require("./utils.main.js");
var $kZVyu$reactaria = require("react-aria");
var $kZVyu$react = require("react");
var $kZVyu$reactstately = require("react-stately");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ToggleButtonGroupContext", () => $fed71ed29b70a020$export$298258635ae0dd97);
$parcel$export(module.exports, "ToggleGroupStateContext", () => $fed71ed29b70a020$export$a8a71863db173133);
$parcel$export(module.exports, "ToggleButtonGroup", () => $fed71ed29b70a020$export$40258cc1d95ff477);
/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 



const $fed71ed29b70a020$export$298258635ae0dd97 = /*#__PURE__*/ (0, $kZVyu$react.createContext)({});
const $fed71ed29b70a020$export$a8a71863db173133 = /*#__PURE__*/ (0, $kZVyu$react.createContext)(null);
const $fed71ed29b70a020$export$40258cc1d95ff477 = /*#__PURE__*/ (0, $kZVyu$react.forwardRef)(function ToggleButtonGroup(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $fed71ed29b70a020$export$298258635ae0dd97);
    let state = (0, $kZVyu$reactstately.useToggleGroupState)(props);
    let { groupProps: groupProps } = (0, $kZVyu$reactaria.useToggleButtonGroup)(props, state, ref);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: {
            isDisabled: state.isDisabled,
            state: state
        },
        defaultClassName: 'react-aria-ToggleButtonGroup'
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($kZVyu$react))).createElement("div", {
        ...groupProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-orientation": props.orientation || 'horizontal',
        "data-disabled": props.isDisabled || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($kZVyu$react))).createElement($fed71ed29b70a020$export$a8a71863db173133.Provider, {
        value: state
    }, renderProps.children));
});


//# sourceMappingURL=ToggleButtonGroup.main.js.map
