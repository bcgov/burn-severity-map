var $c5ccf687772c0422$exports = require("./utils.main.js");
var $4aAuT$reactariacollections = require("@react-aria/collections");
var $4aAuT$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "LabelContext", () => $84ae0bf5bd8e2a5f$export$75b6ee27786ba447);
$parcel$export(module.exports, "Label", () => $84ae0bf5bd8e2a5f$export$b04be29aa201d4f5);
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


const $84ae0bf5bd8e2a5f$export$75b6ee27786ba447 = /*#__PURE__*/ (0, $4aAuT$react.createContext)({});
const $84ae0bf5bd8e2a5f$export$b04be29aa201d4f5 = /*#__PURE__*/ (0, $4aAuT$reactariacollections.createHideableComponent)(function Label(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $84ae0bf5bd8e2a5f$export$75b6ee27786ba447);
    let { elementType: ElementType = 'label', ...labelProps } = props;
    // @ts-ignore
    return /*#__PURE__*/ (0, ($parcel$interopDefault($4aAuT$react))).createElement(ElementType, {
        className: "react-aria-Label",
        ...labelProps,
        ref: ref
    });
});


//# sourceMappingURL=Label.main.js.map
