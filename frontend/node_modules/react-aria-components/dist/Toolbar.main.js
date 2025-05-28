var $c5ccf687772c0422$exports = require("./utils.main.js");
var $6hkB7$reactariatoolbar = require("@react-aria/toolbar");
var $6hkB7$reactariautils = require("@react-aria/utils");
var $6hkB7$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ToolbarContext", () => $a36bb7fee39de77a$export$6311e7ab80ef752f);
$parcel$export(module.exports, "Toolbar", () => $a36bb7fee39de77a$export$4c260019440d418f);
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



const $a36bb7fee39de77a$export$6311e7ab80ef752f = /*#__PURE__*/ (0, $6hkB7$react.createContext)({});
const $a36bb7fee39de77a$export$4c260019440d418f = /*#__PURE__*/ (0, $6hkB7$react.forwardRef)(function Toolbar(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $a36bb7fee39de77a$export$6311e7ab80ef752f);
    let { toolbarProps: toolbarProps } = (0, $6hkB7$reactariatoolbar.useToolbar)(props, ref);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: {
            orientation: props.orientation || 'horizontal'
        },
        defaultClassName: 'react-aria-Toolbar'
    });
    let DOMProps = (0, $6hkB7$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($6hkB7$react))).createElement("div", {
        ...(0, $6hkB7$reactariautils.mergeProps)(toolbarProps, DOMProps),
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-orientation": props.orientation || 'horizontal'
    }, renderProps.children);
});


//# sourceMappingURL=Toolbar.main.js.map
