import {createBranchComponent as $18I52$createBranchComponent, useCachedChildren as $18I52$useCachedChildren} from "@react-aria/collections";
import $18I52$react, {createContext as $18I52$createContext, useContext as $18I52$useContext, useMemo as $18I52$useMemo} from "react";

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

const $7135fc7d473fd974$export$d40e14dec8b060a8 = /*#__PURE__*/ (0, $18I52$createContext)(null);
const $7135fc7d473fd974$export$6e2c8f0811a474ce = /*#__PURE__*/ (0, $18I52$createBranchComponent)('section', (props, ref, section)=>{
    let { name: name, render: render } = (0, $18I52$useContext)($7135fc7d473fd974$export$d40e14dec8b060a8);
    console.warn(`<Section> is deprecated. Please use <${name}> instead.`);
    return render(props, ref, section, 'react-aria-Section');
});
const $7135fc7d473fd974$export$a164736487e3f0ae = {
    CollectionRoot ({ collection: collection, renderDropIndicator: renderDropIndicator }) {
        return $7135fc7d473fd974$var$useCollectionRender(collection, null, renderDropIndicator);
    },
    CollectionBranch ({ collection: collection, parent: parent, renderDropIndicator: renderDropIndicator }) {
        return $7135fc7d473fd974$var$useCollectionRender(collection, parent, renderDropIndicator);
    }
};
function $7135fc7d473fd974$var$useCollectionRender(collection, parent, renderDropIndicator) {
    return (0, $18I52$useCachedChildren)({
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
            return /*#__PURE__*/ (0, $18I52$react).createElement((0, $18I52$react).Fragment, null, renderDropIndicator({
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
const $7135fc7d473fd974$export$4feb769f8ddf26c5 = /*#__PURE__*/ (0, $18I52$createContext)($7135fc7d473fd974$export$a164736487e3f0ae);
function $7135fc7d473fd974$export$90e00781bc59d8f9(focusedKey) {
    return (0, $18I52$useMemo)(()=>focusedKey != null ? new Set([
            focusedKey
        ]) : null, [
        focusedKey
    ]);
}


export {$7135fc7d473fd974$export$d40e14dec8b060a8 as SectionContext, $7135fc7d473fd974$export$6e2c8f0811a474ce as Section, $7135fc7d473fd974$export$a164736487e3f0ae as DefaultCollectionRenderer, $7135fc7d473fd974$export$4feb769f8ddf26c5 as CollectionRendererContext, $7135fc7d473fd974$export$90e00781bc59d8f9 as usePersistedKeys};
//# sourceMappingURL=Collection.module.js.map
