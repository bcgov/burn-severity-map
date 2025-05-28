import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415} from "./utils.mjs";
import $1B3Dx$react, {createContext as $1B3Dx$createContext, forwardRef as $1B3Dx$forwardRef} from "react";

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

const $514c0188e459b4c0$export$9afb8bc826b033ea = /*#__PURE__*/ (0, $1B3Dx$createContext)({});
const $514c0188e459b4c0$export$5f1af8db9871e1d6 = /*#__PURE__*/ (0, $1B3Dx$forwardRef)(function Text(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $514c0188e459b4c0$export$9afb8bc826b033ea);
    let { elementType: ElementType = 'span', ...domProps } = props;
    // @ts-ignore
    return /*#__PURE__*/ (0, $1B3Dx$react).createElement(ElementType, {
        className: "react-aria-Text",
        ...domProps,
        ref: ref
    });
});


export {$514c0188e459b4c0$export$9afb8bc826b033ea as TextContext, $514c0188e459b4c0$export$5f1af8db9871e1d6 as Text};
//# sourceMappingURL=Text.module.js.map
