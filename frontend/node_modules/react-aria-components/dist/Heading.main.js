var $525402dfec7da5bc$exports = require("./RSPContexts.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $9f9JY$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "Heading", () => $1063ac64677bb13f$export$a8a3e93435678ff9);
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


const $1063ac64677bb13f$export$a8a3e93435678ff9 = /*#__PURE__*/ (0, $9f9JY$react.forwardRef)(function Heading(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, (0, $525402dfec7da5bc$exports.HeadingContext));
    let { children: children, level: level = 3, className: className, ...domProps } = props;
    let Element = `h${level}`;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($9f9JY$react))).createElement(Element, {
        ...domProps,
        ref: ref,
        className: className !== null && className !== void 0 ? className : 'react-aria-Heading'
    }, children);
});


//# sourceMappingURL=Heading.main.js.map
