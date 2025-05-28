import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415} from "./utils.mjs";
import {createHideableComponent as $kc2Tc$createHideableComponent} from "@react-aria/collections";
import $kc2Tc$react, {createContext as $kc2Tc$createContext} from "react";

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


const $01b77f81d0f07f68$export$75b6ee27786ba447 = /*#__PURE__*/ (0, $kc2Tc$createContext)({});
const $01b77f81d0f07f68$export$b04be29aa201d4f5 = /*#__PURE__*/ (0, $kc2Tc$createHideableComponent)(function Label(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $01b77f81d0f07f68$export$75b6ee27786ba447);
    let { elementType: ElementType = 'label', ...labelProps } = props;
    // @ts-ignore
    return /*#__PURE__*/ (0, $kc2Tc$react).createElement(ElementType, {
        className: "react-aria-Label",
        ...labelProps,
        ref: ref
    });
});


export {$01b77f81d0f07f68$export$75b6ee27786ba447 as LabelContext, $01b77f81d0f07f68$export$b04be29aa201d4f5 as Label};
//# sourceMappingURL=Label.module.js.map
