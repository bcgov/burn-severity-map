import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415} from "./utils.module.js";
import {FormValidationContext as $j6ya4$FormValidationContext} from "react-stately";
import $j6ya4$react, {createContext as $j6ya4$createContext, forwardRef as $j6ya4$forwardRef} from "react";

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


const $d3e0e05bdfcf66bd$export$c24727297075ec6a = /*#__PURE__*/ (0, $j6ya4$createContext)(null);
const $d3e0e05bdfcf66bd$export$a7fed597f4b8afd8 = /*#__PURE__*/ (0, $j6ya4$forwardRef)(function Form(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $d3e0e05bdfcf66bd$export$c24727297075ec6a);
    let { validationErrors: validationErrors, validationBehavior: validationBehavior = 'native', children: children, className: className, ...domProps } = props;
    return /*#__PURE__*/ (0, $j6ya4$react).createElement("form", {
        noValidate: validationBehavior !== 'native',
        ...domProps,
        ref: ref,
        className: className || 'react-aria-Form'
    }, /*#__PURE__*/ (0, $j6ya4$react).createElement($d3e0e05bdfcf66bd$export$c24727297075ec6a.Provider, {
        value: {
            ...props,
            validationBehavior: validationBehavior
        }
    }, /*#__PURE__*/ (0, $j6ya4$react).createElement((0, $j6ya4$FormValidationContext).Provider, {
        value: validationErrors !== null && validationErrors !== void 0 ? validationErrors : {}
    }, children)));
});


export {$d3e0e05bdfcf66bd$export$c24727297075ec6a as FormContext, $d3e0e05bdfcf66bd$export$a7fed597f4b8afd8 as Form};
//# sourceMappingURL=Form.module.js.map
