var $c5ccf687772c0422$exports = require("./utils.main.js");
var $a8a589c28affdc40$exports = require("./Text.main.js");
var $74w6C$reactariautils = require("@react-aria/utils");
var $74w6C$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "FieldErrorContext", () => $846a838139f2ac6b$export$ff05c3ac10437e03);
$parcel$export(module.exports, "FieldError", () => $846a838139f2ac6b$export$f551688fc98f2e09);
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



const $846a838139f2ac6b$export$ff05c3ac10437e03 = /*#__PURE__*/ (0, $74w6C$react.createContext)(null);
const $846a838139f2ac6b$export$f551688fc98f2e09 = /*#__PURE__*/ (0, $74w6C$react.forwardRef)(function FieldError(props, ref) {
    let validation = (0, $74w6C$react.useContext)($846a838139f2ac6b$export$ff05c3ac10437e03);
    if (!(validation === null || validation === void 0 ? void 0 : validation.isInvalid)) return null;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($74w6C$react))).createElement($846a838139f2ac6b$var$FieldErrorInner, {
        ...props,
        ref: ref
    });
});
const $846a838139f2ac6b$var$FieldErrorInner = /*#__PURE__*/ (0, $74w6C$react.forwardRef)((props, ref)=>{
    let validation = (0, $74w6C$react.useContext)($846a838139f2ac6b$export$ff05c3ac10437e03);
    let domProps = (0, $74w6C$reactariautils.filterDOMProps)(props);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-FieldError',
        defaultChildren: validation.validationErrors.length === 0 ? undefined : validation.validationErrors.join(' '),
        values: validation
    });
    if (renderProps.children == null) return null;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($74w6C$react))).createElement((0, $a8a589c28affdc40$exports.Text), {
        slot: "errorMessage",
        ...domProps,
        ...renderProps,
        ref: ref
    });
});


//# sourceMappingURL=FieldError.main.js.map
