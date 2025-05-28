var $64doO$reactstatelyvirtualizer = require("@react-stately/virtualizer");
var $64doO$react = require("react");
var $64doO$reactariautils = require("@react-aria/utils");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "useVirtualizerItem", () => $7d70e069fceb2deb$export$1da781778207e0a2);
/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 


function $7d70e069fceb2deb$export$1da781778207e0a2(options) {
    let { layoutInfo: layoutInfo, virtualizer: virtualizer, ref: ref } = options;
    let key = layoutInfo === null || layoutInfo === void 0 ? void 0 : layoutInfo.key;
    let updateSize = (0, $64doO$react.useCallback)(()=>{
        if (key != null && ref.current) {
            let size = $7d70e069fceb2deb$var$getSize(ref.current);
            virtualizer.updateItemSize(key, size);
        }
    }, [
        virtualizer,
        key,
        ref
    ]);
    (0, $64doO$reactariautils.useLayoutEffect)(()=>{
        if (layoutInfo === null || layoutInfo === void 0 ? void 0 : layoutInfo.estimatedSize) updateSize();
    });
    return {
        updateSize: updateSize
    };
}
function $7d70e069fceb2deb$var$getSize(node) {
    // Reset height before measuring so we get the intrinsic size
    let height = node.style.height;
    node.style.height = '';
    let size = new (0, $64doO$reactstatelyvirtualizer.Size)(node.scrollWidth, node.scrollHeight);
    node.style.height = height;
    return size;
}


//# sourceMappingURL=useVirtualizerItem.main.js.map
