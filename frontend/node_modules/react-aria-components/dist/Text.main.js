var $c5ccf687772c0422$exports = require("./utils.main.js");
var $bTf3o$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "TextContext", () => $a8a589c28affdc40$export$9afb8bc826b033ea);
$parcel$export(module.exports, "Text", () => $a8a589c28affdc40$export$5f1af8db9871e1d6);
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

const $a8a589c28affdc40$export$9afb8bc826b033ea = /*#__PURE__*/ (0, $bTf3o$react.createContext)({});
const $a8a589c28affdc40$export$5f1af8db9871e1d6 = /*#__PURE__*/ (0, $bTf3o$react.forwardRef)(function Text(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $a8a589c28affdc40$export$9afb8bc826b033ea);
    let { elementType: ElementType = 'span', ...domProps } = props;
    // @ts-ignore
    return /*#__PURE__*/ (0, ($parcel$interopDefault($bTf3o$react))).createElement(ElementType, {
        className: "react-aria-Text",
        ...domProps,
        ref: ref
    });
});


//# sourceMappingURL=Text.main.js.map
