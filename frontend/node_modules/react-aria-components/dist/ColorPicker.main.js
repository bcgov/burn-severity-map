var $525402dfec7da5bc$exports = require("./RSPContexts.main.js");
var $804cfb3beb27b520$exports = require("./ColorSwatch.main.js");
var $4adbbc5a2d33d279$exports = require("./ColorSwatchPicker.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $lvYpl$reactstatelycolor = require("@react-stately/color");
var $lvYpl$reactaria = require("react-aria");
var $lvYpl$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ColorPickerContext", () => $34f42c35e4f8c327$export$cfac98503b32f6d6);
$parcel$export(module.exports, "ColorPickerStateContext", () => $34f42c35e4f8c327$export$2c14261be40a385f);
$parcel$export(module.exports, "ColorPicker", () => $34f42c35e4f8c327$export$9feb1bc2e5f1ccb3);
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






const $34f42c35e4f8c327$export$cfac98503b32f6d6 = /*#__PURE__*/ (0, $lvYpl$react.createContext)(null);
const $34f42c35e4f8c327$export$2c14261be40a385f = /*#__PURE__*/ (0, $lvYpl$react.createContext)(null);
function $34f42c35e4f8c327$export$9feb1bc2e5f1ccb3(props) {
    let ctx = (0, $c5ccf687772c0422$exports.useSlottedContext)($34f42c35e4f8c327$export$cfac98503b32f6d6, props.slot);
    props = (0, $lvYpl$reactaria.mergeProps)(ctx, props);
    let state = (0, $lvYpl$reactstatelycolor.useColorPickerState)(props);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: {
            color: state.color
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($lvYpl$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $34f42c35e4f8c327$export$2c14261be40a385f,
                state
            ],
            [
                (0, $525402dfec7da5bc$exports.ColorSliderContext),
                {
                    value: state.color,
                    onChange: state.setColor
                }
            ],
            [
                (0, $525402dfec7da5bc$exports.ColorAreaContext),
                {
                    value: state.color,
                    onChange: state.setColor
                }
            ],
            [
                (0, $525402dfec7da5bc$exports.ColorWheelContext),
                {
                    value: state.color,
                    onChange: state.setColor
                }
            ],
            [
                (0, $525402dfec7da5bc$exports.ColorFieldContext),
                {
                    value: state.color,
                    onChange: state.setColor
                }
            ],
            [
                (0, $804cfb3beb27b520$exports.ColorSwatchContext),
                {
                    color: state.color
                }
            ],
            [
                (0, $4adbbc5a2d33d279$exports.ColorSwatchPickerContext),
                {
                    value: state.color,
                    onChange: state.setColor
                }
            ]
        ]
    }, renderProps.children);
}


//# sourceMappingURL=ColorPicker.main.js.map
