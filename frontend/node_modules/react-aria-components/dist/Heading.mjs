import {HeadingContext as $4e85f108e88277b8$export$d688439359537581} from "./RSPContexts.mjs";
import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415} from "./utils.mjs";
import $bt28J$react, {forwardRef as $bt28J$forwardRef} from "react";

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


const $5cb03073d3f54797$export$a8a3e93435678ff9 = /*#__PURE__*/ (0, $bt28J$forwardRef)(function Heading(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, (0, $4e85f108e88277b8$export$d688439359537581));
    let { children: children, level: level = 3, className: className, ...domProps } = props;
    let Element = `h${level}`;
    return /*#__PURE__*/ (0, $bt28J$react).createElement(Element, {
        ...domProps,
        ref: ref,
        className: className !== null && className !== void 0 ? className : 'react-aria-Heading'
    }, children);
});


export {$5cb03073d3f54797$export$a8a3e93435678ff9 as Heading};
//# sourceMappingURL=Heading.module.js.map
