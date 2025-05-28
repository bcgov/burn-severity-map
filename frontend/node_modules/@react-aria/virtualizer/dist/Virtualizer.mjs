import {ScrollView as $44a6ee657928b002$export$5665e3d6be6adea} from "./ScrollView.mjs";
import {VirtualizerItem as $ccf8a0a04e4175ae$export$6796df8ba7398521} from "./VirtualizerItem.mjs";
import {useVirtualizerState as $9WwqA$useVirtualizerState} from "@react-stately/virtualizer";
import {useObjectRef as $9WwqA$useObjectRef, useLoadMore as $9WwqA$useLoadMore, mergeProps as $9WwqA$mergeProps} from "@react-aria/utils";
import $9WwqA$react, {useCallback as $9WwqA$useCallback} from "react";

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




const $6d0a5c394373ae64$export$89be5a243e59c4b2 = /*#__PURE__*/ (0, $9WwqA$react).forwardRef(function Virtualizer(props, forwardedRef) {
    let { children: renderView, renderWrapper: renderWrapper, layout: layout, collection: collection, scrollDirection: scrollDirection, isLoading: isLoading, onLoadMore: onLoadMore, persistedKeys: persistedKeys, layoutOptions: layoutOptions, ...otherProps } = props;
    let ref = (0, $9WwqA$useObjectRef)(forwardedRef);
    let state = (0, $9WwqA$useVirtualizerState)({
        layout: layout,
        collection: collection,
        renderView: renderView,
        onVisibleRectChange (rect) {
            if (ref.current) {
                ref.current.scrollLeft = rect.x;
                ref.current.scrollTop = rect.y;
            }
        },
        persistedKeys: persistedKeys,
        layoutOptions: layoutOptions
    });
    (0, $9WwqA$useLoadMore)({
        isLoading: isLoading,
        onLoadMore: onLoadMore,
        scrollOffset: 1
    }, ref);
    let onVisibleRectChange = (0, $9WwqA$useCallback)((rect)=>{
        state.setVisibleRect(rect);
    }, [
        state
    ]);
    return /*#__PURE__*/ (0, $9WwqA$react).createElement((0, $44a6ee657928b002$export$5665e3d6be6adea), {
        ...(0, $9WwqA$mergeProps)(otherProps, {
            onVisibleRectChange: onVisibleRectChange
        }),
        ref: ref,
        contentSize: state.contentSize,
        onScrollStart: state.startScrolling,
        onScrollEnd: state.endScrolling,
        scrollDirection: scrollDirection
    }, $6d0a5c394373ae64$var$renderChildren(null, state.visibleViews, renderWrapper || $6d0a5c394373ae64$var$defaultRenderWrapper));
});
function $6d0a5c394373ae64$var$renderChildren(parent, views, renderWrapper) {
    return views.map((view)=>{
        return renderWrapper(parent, view, view.children ? Array.from(view.children) : [], (childViews)=>$6d0a5c394373ae64$var$renderChildren(view, childViews, renderWrapper));
    });
}
function $6d0a5c394373ae64$var$defaultRenderWrapper(parent, reusableView) {
    return /*#__PURE__*/ (0, $9WwqA$react).createElement((0, $ccf8a0a04e4175ae$export$6796df8ba7398521), {
        key: reusableView.key,
        layoutInfo: reusableView.layoutInfo,
        virtualizer: reusableView.virtualizer,
        parent: parent === null || parent === void 0 ? void 0 : parent.layoutInfo
    }, reusableView.rendered);
}


export {$6d0a5c394373ae64$export$89be5a243e59c4b2 as Virtualizer};
//# sourceMappingURL=Virtualizer.module.js.map
