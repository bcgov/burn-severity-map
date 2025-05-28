import {ColorAreaContext as $4e85f108e88277b8$export$ebe63fadcdce34ed, ColorFieldContext as $4e85f108e88277b8$export$44644b8a16031b5b, ColorSliderContext as $4e85f108e88277b8$export$717b2c0a523a0b53, ColorWheelContext as $4e85f108e88277b8$export$265015d6dc85bf21} from "./RSPContexts.mjs";
import {ColorSwatchContext as $251c695a52d94a8d$export$83cc445538396800} from "./ColorSwatch.mjs";
import {ColorSwatchPickerContext as $0bb41941cfe72bd4$export$7214f50881fc1eaf} from "./ColorSwatchPicker.mjs";
import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3, useSlottedContext as $64fa3d84918910a7$export$fabf2dc03a41866e} from "./utils.mjs";
import {useColorPickerState as $arEth$useColorPickerState} from "@react-stately/color";
import {mergeProps as $arEth$mergeProps} from "react-aria";
import $arEth$react, {createContext as $arEth$createContext} from "react";

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






const $2637d3f5efb23186$export$cfac98503b32f6d6 = /*#__PURE__*/ (0, $arEth$createContext)(null);
const $2637d3f5efb23186$export$2c14261be40a385f = /*#__PURE__*/ (0, $arEth$createContext)(null);
function $2637d3f5efb23186$export$9feb1bc2e5f1ccb3(props) {
    let ctx = (0, $64fa3d84918910a7$export$fabf2dc03a41866e)($2637d3f5efb23186$export$cfac98503b32f6d6, props.slot);
    props = (0, $arEth$mergeProps)(ctx, props);
    let state = (0, $arEth$useColorPickerState)(props);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            color: state.color
        }
    });
    return /*#__PURE__*/ (0, $arEth$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $2637d3f5efb23186$export$2c14261be40a385f,
                state
            ],
            [
                (0, $4e85f108e88277b8$export$717b2c0a523a0b53),
                {
                    value: state.color,
                    onChange: state.setColor
                }
            ],
            [
                (0, $4e85f108e88277b8$export$ebe63fadcdce34ed),
                {
                    value: state.color,
                    onChange: state.setColor
                }
            ],
            [
                (0, $4e85f108e88277b8$export$265015d6dc85bf21),
                {
                    value: state.color,
                    onChange: state.setColor
                }
            ],
            [
                (0, $4e85f108e88277b8$export$44644b8a16031b5b),
                {
                    value: state.color,
                    onChange: state.setColor
                }
            ],
            [
                (0, $251c695a52d94a8d$export$83cc445538396800),
                {
                    color: state.color
                }
            ],
            [
                (0, $0bb41941cfe72bd4$export$7214f50881fc1eaf),
                {
                    value: state.color,
                    onChange: state.setColor
                }
            ]
        ]
    }, renderProps.children);
}


export {$2637d3f5efb23186$export$cfac98503b32f6d6 as ColorPickerContext, $2637d3f5efb23186$export$2c14261be40a385f as ColorPickerStateContext, $2637d3f5efb23186$export$9feb1bc2e5f1ccb3 as ColorPicker};
//# sourceMappingURL=ColorPicker.module.js.map
