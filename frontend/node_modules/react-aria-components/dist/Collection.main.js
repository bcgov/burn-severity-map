var $leb1U$reactariacollections = require("@react-aria/collections");
var $leb1U$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "SectionContext", () => $3114c2382242bdc0$export$d40e14dec8b060a8);
$parcel$export(module.exports, "Section", () => $3114c2382242bdc0$export$6e2c8f0811a474ce);
$parcel$export(module.exports, "DefaultCollectionRenderer", () => $3114c2382242bdc0$export$a164736487e3f0ae);
$parcel$export(module.exports, "CollectionRendererContext", () => $3114c2382242bdc0$export$4feb769f8ddf26c5);
$parcel$export(module.exports, "usePersistedKeys", () => $3114c2382242bdc0$export$90e00781bc59d8f9);
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

const $3114c2382242bdc0$export$d40e14dec8b060a8 = /*#__PURE__*/ (0, $leb1U$react.createContext)(null);
const $3114c2382242bdc0$export$6e2c8f0811a474ce = /*#__PURE__*/ (0, $leb1U$reactariacollections.createBranchComponent)('section', (props, ref, section)=>{
    let { name: name, render: render } = (0, $leb1U$react.useContext)($3114c2382242bdc0$export$d40e14dec8b060a8);
    console.warn(`<Section> is deprecated. Please use <${name}> instead.`);
    return render(props, ref, section, 'react-aria-Section');
});
const $3114c2382242bdc0$export$a164736487e3f0ae = {
    CollectionRoot ({ collection: collection, renderDropIndicator: renderDropIndicator }) {
        return $3114c2382242bdc0$var$useCollectionRender(collection, null, renderDropIndicator);
    },
    CollectionBranch ({ collection: collection, parent: parent, renderDropIndicator: renderDropIndicator }) {
        return $3114c2382242bdc0$var$useCollectionRender(collection, parent, renderDropIndicator);
    }
};
function $3114c2382242bdc0$var$useCollectionRender(collection, parent, renderDropIndicator) {
    return (0, $leb1U$reactariacollections.useCachedChildren)({
        items: parent ? collection.getChildren(parent.key) : collection,
        dependencies: [
            renderDropIndicator
        ],
        children (node) {
            var _collection_getItem;
            let rendered = node.render(node);
            if (!renderDropIndicator || node.type !== 'item') return rendered;
            let key = node.key;
            let keyAfter = collection.getKeyAfter(key);
            return /*#__PURE__*/ (0, ($parcel$interopDefault($leb1U$react))).createElement((0, ($parcel$interopDefault($leb1U$react))).Fragment, null, renderDropIndicator({
                type: 'item',
                key: key,
                dropPosition: 'before'
            }), rendered, (keyAfter == null || ((_collection_getItem = collection.getItem(keyAfter)) === null || _collection_getItem === void 0 ? void 0 : _collection_getItem.type) !== 'item') && renderDropIndicator({
                type: 'item',
                key: key,
                dropPosition: 'after'
            }));
        }
    });
}
const $3114c2382242bdc0$export$4feb769f8ddf26c5 = /*#__PURE__*/ (0, $leb1U$react.createContext)($3114c2382242bdc0$export$a164736487e3f0ae);
function $3114c2382242bdc0$export$90e00781bc59d8f9(focusedKey) {
    return (0, $leb1U$react.useMemo)(()=>focusedKey != null ? new Set([
            focusedKey
        ]) : null, [
        focusedKey
    ]);
}


//# sourceMappingURL=Collection.main.js.map
