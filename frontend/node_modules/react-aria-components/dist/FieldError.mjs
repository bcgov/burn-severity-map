import {useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.mjs";
import {Text as $514c0188e459b4c0$export$5f1af8db9871e1d6} from "./Text.mjs";
import {filterDOMProps as $hnYyE$filterDOMProps} from "@react-aria/utils";
import $hnYyE$react, {createContext as $hnYyE$createContext, forwardRef as $hnYyE$forwardRef, useContext as $hnYyE$useContext} from "react";

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



const $ee014567cb39d3f0$export$ff05c3ac10437e03 = /*#__PURE__*/ (0, $hnYyE$createContext)(null);
const $ee014567cb39d3f0$export$f551688fc98f2e09 = /*#__PURE__*/ (0, $hnYyE$forwardRef)(function FieldError(props, ref) {
    let validation = (0, $hnYyE$useContext)($ee014567cb39d3f0$export$ff05c3ac10437e03);
    if (!(validation === null || validation === void 0 ? void 0 : validation.isInvalid)) return null;
    return /*#__PURE__*/ (0, $hnYyE$react).createElement($ee014567cb39d3f0$var$FieldErrorInner, {
        ...props,
        ref: ref
    });
});
const $ee014567cb39d3f0$var$FieldErrorInner = /*#__PURE__*/ (0, $hnYyE$forwardRef)((props, ref)=>{
    let validation = (0, $hnYyE$useContext)($ee014567cb39d3f0$export$ff05c3ac10437e03);
    let domProps = (0, $hnYyE$filterDOMProps)(props);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        defaultClassName: 'react-aria-FieldError',
        defaultChildren: validation.validationErrors.length === 0 ? undefined : validation.validationErrors.join(' '),
        values: validation
    });
    if (renderProps.children == null) return null;
    return /*#__PURE__*/ (0, $hnYyE$react).createElement((0, $514c0188e459b4c0$export$5f1af8db9871e1d6), {
        slot: "errorMessage",
        ...domProps,
        ...renderProps,
        ref: ref
    });
});


export {$ee014567cb39d3f0$export$ff05c3ac10437e03 as FieldErrorContext, $ee014567cb39d3f0$export$f551688fc98f2e09 as FieldError};
//# sourceMappingURL=FieldError.module.js.map
