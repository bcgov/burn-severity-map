var $a8uUY$reactdom = require("react-dom");
var $a8uUY$react = require("react");
var $a8uUY$reactariassr = require("@react-aria/ssr");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "Hidden", () => $eaaf60978b89fc58$export$8dc98ba7eadeaa56);
$parcel$export(module.exports, "createHideableComponent", () => $eaaf60978b89fc58$export$86427a43e3e48ebb);
$parcel$export(module.exports, "useIsHidden", () => $eaaf60978b89fc58$export$b5d7cc18bb8d2b59);
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


// React doesn't understand the <template> element, which doesn't have children like a normal element.
// It will throw an error during hydration when it expects the firstChild to contain content rendered
// on the server, when in reality, the browser will have placed this inside the `content` document fragment.
// This monkey patches the firstChild property for our special hidden template elements to work around this error.
// See https://github.com/facebook/react/issues/19932
if (typeof HTMLTemplateElement !== 'undefined') {
    const getFirstChild = Object.getOwnPropertyDescriptor(Node.prototype, 'firstChild').get;
    Object.defineProperty(HTMLTemplateElement.prototype, 'firstChild', {
        configurable: true,
        enumerable: true,
        get: function() {
            if (this.dataset.reactAriaHidden) return this.content.firstChild;
            else return getFirstChild.call(this);
        }
    });
}
const $eaaf60978b89fc58$export$94b6d0abf7d33e8c = /*#__PURE__*/ (0, $a8uUY$react.createContext)(false);
// Portal to nowhere
const $eaaf60978b89fc58$var$hiddenFragment = typeof DocumentFragment !== 'undefined' ? new DocumentFragment() : null;
function $eaaf60978b89fc58$export$8dc98ba7eadeaa56(props) {
    let isHidden = (0, $a8uUY$react.useContext)($eaaf60978b89fc58$export$94b6d0abf7d33e8c);
    let isSSR = (0, $a8uUY$reactariassr.useIsSSR)();
    if (isHidden) // Don't hide again if we are already hidden.
    return /*#__PURE__*/ (0, ($parcel$interopDefault($a8uUY$react))).createElement((0, ($parcel$interopDefault($a8uUY$react))).Fragment, null, props.children);
    let children = /*#__PURE__*/ (0, ($parcel$interopDefault($a8uUY$react))).createElement($eaaf60978b89fc58$export$94b6d0abf7d33e8c.Provider, {
        value: true
    }, props.children);
    // In SSR, portals are not supported by React. Instead, render into a <template>
    // element, which the browser will never display to the user. In addition, the
    // content is not part of the DOM tree, so it won't affect ids or other accessibility attributes.
    return isSSR ? /*#__PURE__*/ (0, ($parcel$interopDefault($a8uUY$react))).createElement("template", {
        "data-react-aria-hidden": true
    }, children) : /*#__PURE__*/ (0, $a8uUY$reactdom.createPortal)(children, $eaaf60978b89fc58$var$hiddenFragment);
}
function $eaaf60978b89fc58$export$86427a43e3e48ebb(fn) {
    let Wrapper = (props, ref)=>{
        let isHidden = (0, $a8uUY$react.useContext)($eaaf60978b89fc58$export$94b6d0abf7d33e8c);
        if (isHidden) return null;
        return fn(props, ref);
    };
    // @ts-ignore - for react dev tools
    Wrapper.displayName = fn.displayName || fn.name;
    return (0, $a8uUY$react.forwardRef)(Wrapper);
}
function $eaaf60978b89fc58$export$b5d7cc18bb8d2b59() {
    return (0, $a8uUY$react.useContext)($eaaf60978b89fc58$export$94b6d0abf7d33e8c);
}


//# sourceMappingURL=Hidden.main.js.map
