import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415} from "./utils.mjs";
import {useSeparator as $i9JCE$useSeparator} from "react-aria";
import {createLeafComponent as $i9JCE$createLeafComponent} from "@react-aria/collections";
import {filterDOMProps as $i9JCE$filterDOMProps} from "@react-aria/utils";
import $i9JCE$react, {createContext as $i9JCE$createContext} from "react";

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




const $431f98aba6844401$export$6615d83f6de245ce = /*#__PURE__*/ (0, $i9JCE$createContext)({});
const $431f98aba6844401$export$1ff3c3f08ae963c0 = /*#__PURE__*/ (0, $i9JCE$createLeafComponent)('separator', function Separator(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $431f98aba6844401$export$6615d83f6de245ce);
    let { elementType: elementType, orientation: orientation, style: style, className: className } = props;
    let Element = elementType || 'hr';
    if (Element === 'hr' && orientation === 'vertical') Element = 'div';
    let { separatorProps: separatorProps } = (0, $i9JCE$useSeparator)({
        elementType: elementType,
        orientation: orientation
    });
    return /*#__PURE__*/ (0, $i9JCE$react).createElement(Element, {
        ...(0, $i9JCE$filterDOMProps)(props),
        ...separatorProps,
        style: style,
        className: className !== null && className !== void 0 ? className : 'react-aria-Separator',
        ref: ref,
        slot: props.slot || undefined
    });
});


export {$431f98aba6844401$export$6615d83f6de245ce as SeparatorContext, $431f98aba6844401$export$1ff3c3f08ae963c0 as Separator};
//# sourceMappingURL=Separator.module.js.map
