import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.mjs";
import {useToggleButtonGroup as $1lXgK$useToggleButtonGroup} from "react-aria";
import $1lXgK$react, {createContext as $1lXgK$createContext, forwardRef as $1lXgK$forwardRef} from "react";
import {useToggleGroupState as $1lXgK$useToggleGroupState} from "react-stately";

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



const $84b7d8702d4ff4a8$export$298258635ae0dd97 = /*#__PURE__*/ (0, $1lXgK$createContext)({});
const $84b7d8702d4ff4a8$export$a8a71863db173133 = /*#__PURE__*/ (0, $1lXgK$createContext)(null);
const $84b7d8702d4ff4a8$export$40258cc1d95ff477 = /*#__PURE__*/ (0, $1lXgK$forwardRef)(function ToggleButtonGroup(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $84b7d8702d4ff4a8$export$298258635ae0dd97);
    let state = (0, $1lXgK$useToggleGroupState)(props);
    let { groupProps: groupProps } = (0, $1lXgK$useToggleButtonGroup)(props, state, ref);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            isDisabled: state.isDisabled,
            state: state
        },
        defaultClassName: 'react-aria-ToggleButtonGroup'
    });
    return /*#__PURE__*/ (0, $1lXgK$react).createElement("div", {
        ...groupProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-orientation": props.orientation || 'horizontal',
        "data-disabled": props.isDisabled || undefined
    }, /*#__PURE__*/ (0, $1lXgK$react).createElement($84b7d8702d4ff4a8$export$a8a71863db173133.Provider, {
        value: state
    }, renderProps.children));
});


export {$84b7d8702d4ff4a8$export$298258635ae0dd97 as ToggleButtonGroupContext, $84b7d8702d4ff4a8$export$a8a71863db173133 as ToggleGroupStateContext, $84b7d8702d4ff4a8$export$40258cc1d95ff477 as ToggleButtonGroup};
//# sourceMappingURL=ToggleButtonGroup.module.js.map
