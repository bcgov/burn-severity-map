var $c5ccf687772c0422$exports = require("./utils.main.js");
var $6jQ43$reactaria = require("react-aria");
var $6jQ43$reactariacollections = require("@react-aria/collections");
var $6jQ43$reactariautils = require("@react-aria/utils");
var $6jQ43$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "SeparatorContext", () => $54b202ace195eaa4$export$6615d83f6de245ce);
$parcel$export(module.exports, "Separator", () => $54b202ace195eaa4$export$1ff3c3f08ae963c0);
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




const $54b202ace195eaa4$export$6615d83f6de245ce = /*#__PURE__*/ (0, $6jQ43$react.createContext)({});
const $54b202ace195eaa4$export$1ff3c3f08ae963c0 = /*#__PURE__*/ (0, $6jQ43$reactariacollections.createLeafComponent)('separator', function Separator(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $54b202ace195eaa4$export$6615d83f6de245ce);
    let { elementType: elementType, orientation: orientation, style: style, className: className } = props;
    let Element = elementType || 'hr';
    if (Element === 'hr' && orientation === 'vertical') Element = 'div';
    let { separatorProps: separatorProps } = (0, $6jQ43$reactaria.useSeparator)({
        elementType: elementType,
        orientation: orientation
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($6jQ43$react))).createElement(Element, {
        ...(0, $6jQ43$reactariautils.filterDOMProps)(props),
        ...separatorProps,
        style: style,
        className: className !== null && className !== void 0 ? className : 'react-aria-Separator',
        ref: ref,
        slot: props.slot || undefined
    });
});


//# sourceMappingURL=Separator.main.js.map
