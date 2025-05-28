import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.mjs";
import {useToolbar as $8qPHH$useToolbar} from "@react-aria/toolbar";
import {filterDOMProps as $8qPHH$filterDOMProps, mergeProps as $8qPHH$mergeProps} from "@react-aria/utils";
import $8qPHH$react, {createContext as $8qPHH$createContext, forwardRef as $8qPHH$forwardRef} from "react";

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



const $13c3c67164f4d5be$export$6311e7ab80ef752f = /*#__PURE__*/ (0, $8qPHH$createContext)({});
const $13c3c67164f4d5be$export$4c260019440d418f = /*#__PURE__*/ (0, $8qPHH$forwardRef)(function Toolbar(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $13c3c67164f4d5be$export$6311e7ab80ef752f);
    let { toolbarProps: toolbarProps } = (0, $8qPHH$useToolbar)(props, ref);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            orientation: props.orientation || 'horizontal'
        },
        defaultClassName: 'react-aria-Toolbar'
    });
    let DOMProps = (0, $8qPHH$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $8qPHH$react).createElement("div", {
        ...(0, $8qPHH$mergeProps)(toolbarProps, DOMProps),
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-orientation": props.orientation || 'horizontal'
    }, renderProps.children);
});


export {$13c3c67164f4d5be$export$6311e7ab80ef752f as ToolbarContext, $13c3c67164f4d5be$export$4c260019440d418f as Toolbar};
//# sourceMappingURL=Toolbar.module.js.map
