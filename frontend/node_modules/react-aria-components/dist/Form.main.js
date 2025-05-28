var $c5ccf687772c0422$exports = require("./utils.main.js");
var $bpD8E$reactstately = require("react-stately");
var $bpD8E$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "FormContext", () => $35157657e549736b$export$c24727297075ec6a);
$parcel$export(module.exports, "Form", () => $35157657e549736b$export$a7fed597f4b8afd8);
/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 


const $35157657e549736b$export$c24727297075ec6a = /*#__PURE__*/ (0, $bpD8E$react.createContext)(null);
const $35157657e549736b$export$a7fed597f4b8afd8 = /*#__PURE__*/ (0, $bpD8E$react.forwardRef)(function Form(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $35157657e549736b$export$c24727297075ec6a);
    let { validationErrors: validationErrors, validationBehavior: validationBehavior = 'native', children: children, className: className, ...domProps } = props;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($bpD8E$react))).createElement("form", {
        noValidate: validationBehavior !== 'native',
        ...domProps,
        ref: ref,
        className: className || 'react-aria-Form'
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($bpD8E$react))).createElement($35157657e549736b$export$c24727297075ec6a.Provider, {
        value: {
            ...props,
            validationBehavior: validationBehavior
        }
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($bpD8E$react))).createElement((0, $bpD8E$reactstately.FormValidationContext).Provider, {
        value: validationErrors !== null && validationErrors !== void 0 ? validationErrors : {}
    }, children)));
});


//# sourceMappingURL=Form.main.js.map
