import {CollectionRendererContext as $7135fc7d473fd974$export$4feb769f8ddf26c5} from "./Collection.module.js";
import {useVirtualizerState as $dVUg9$useVirtualizerState} from "@react-stately/virtualizer";
import $dVUg9$react, {createContext as $dVUg9$createContext, useMemo as $dVUg9$useMemo, useContext as $dVUg9$useContext} from "react";
import {useScrollView as $dVUg9$useScrollView, VirtualizerItem as $dVUg9$VirtualizerItem} from "@react-aria/virtualizer";

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



const $ce3a951440fc273f$var$VirtualizerContext = /*#__PURE__*/ (0, $dVUg9$createContext)(null);
const $ce3a951440fc273f$var$LayoutContext = /*#__PURE__*/ (0, $dVUg9$createContext)(null);
function $ce3a951440fc273f$export$89be5a243e59c4b2(props) {
    let { children: children, layout: layout, layoutOptions: layoutOptions } = props;
    let renderer = (0, $dVUg9$useMemo)(()=>({
            isVirtualized: true,
            layoutDelegate: layout,
            dropTargetDelegate: layout.getDropTargetFromPoint ? layout : undefined,
            CollectionRoot: $ce3a951440fc273f$var$CollectionRoot,
            CollectionBranch: $ce3a951440fc273f$var$CollectionBranch
        }), [
        layout
    ]);
    return /*#__PURE__*/ (0, $dVUg9$react).createElement((0, $7135fc7d473fd974$export$4feb769f8ddf26c5).Provider, {
        value: renderer
    }, /*#__PURE__*/ (0, $dVUg9$react).createElement($ce3a951440fc273f$var$LayoutContext.Provider, {
        value: {
            layout: layout,
            layoutOptions: layoutOptions
        }
    }, children));
}
function $ce3a951440fc273f$var$CollectionRoot({ collection: collection, persistedKeys: persistedKeys, scrollRef: scrollRef, renderDropIndicator: renderDropIndicator }) {
    var _layout_useLayoutOptions;
    let { layout: layout, layoutOptions: layoutOptions } = (0, $dVUg9$useContext)($ce3a951440fc273f$var$LayoutContext);
    let layoutOptions2 = (_layout_useLayoutOptions = layout.useLayoutOptions) === null || _layout_useLayoutOptions === void 0 ? void 0 : _layout_useLayoutOptions.call(layout);
    let state = (0, $dVUg9$useVirtualizerState)({
        layout: layout,
        collection: collection,
        renderView: (type, item)=>{
            var _item_render;
            return item === null || item === void 0 ? void 0 : (_item_render = item.render) === null || _item_render === void 0 ? void 0 : _item_render.call(item, item);
        },
        onVisibleRectChange (rect) {
            let element = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current;
            if (element) {
                element.scrollLeft = rect.x;
                element.scrollTop = rect.y;
            }
        },
        persistedKeys: persistedKeys,
        layoutOptions: (0, $dVUg9$useMemo)(()=>{
            if (layoutOptions && layoutOptions2) return {
                ...layoutOptions,
                ...layoutOptions2
            };
            return layoutOptions || layoutOptions2;
        }, [
            layoutOptions,
            layoutOptions2
        ])
    });
    let { contentProps: contentProps } = (0, $dVUg9$useScrollView)({
        onVisibleRectChange: state.setVisibleRect,
        contentSize: state.contentSize,
        onScrollStart: state.startScrolling,
        onScrollEnd: state.endScrolling
    }, scrollRef);
    if (state.contentSize.area === 0) return null;
    return /*#__PURE__*/ (0, $dVUg9$react).createElement("div", contentProps, /*#__PURE__*/ (0, $dVUg9$react).createElement($ce3a951440fc273f$var$VirtualizerContext.Provider, {
        value: state
    }, $ce3a951440fc273f$var$renderChildren(null, state.visibleViews, renderDropIndicator)));
}
function $ce3a951440fc273f$var$CollectionBranch({ parent: parent, renderDropIndicator: renderDropIndicator }) {
    let virtualizer = (0, $dVUg9$useContext)($ce3a951440fc273f$var$VirtualizerContext);
    let parentView = virtualizer.virtualizer.getVisibleView(parent.key);
    return $ce3a951440fc273f$var$renderChildren(parentView, Array.from(parentView.children), renderDropIndicator);
}
function $ce3a951440fc273f$var$renderChildren(parent, children, renderDropIndicator) {
    return children.map((view)=>$ce3a951440fc273f$var$renderWrapper(parent, view, renderDropIndicator));
}
function $ce3a951440fc273f$var$renderWrapper(parent, reusableView, renderDropIndicator) {
    let rendered = /*#__PURE__*/ (0, $dVUg9$react).createElement((0, $dVUg9$VirtualizerItem), {
        key: reusableView.key,
        layoutInfo: reusableView.layoutInfo,
        virtualizer: reusableView.virtualizer,
        parent: parent === null || parent === void 0 ? void 0 : parent.layoutInfo
    }, reusableView.rendered);
    let { collection: collection, layout: layout } = reusableView.virtualizer;
    let { key: key, type: type } = reusableView.content;
    if (type === 'item' && renderDropIndicator && layout.getDropTargetLayoutInfo) rendered = /*#__PURE__*/ (0, $dVUg9$react).createElement((0, $dVUg9$react).Fragment, {
        key: reusableView.key
    }, $ce3a951440fc273f$var$renderDropIndicatorWrapper(parent, reusableView, 'before', renderDropIndicator), rendered, collection.getKeyAfter(key) == null && $ce3a951440fc273f$var$renderDropIndicatorWrapper(parent, reusableView, 'after', renderDropIndicator));
    return rendered;
}
function $ce3a951440fc273f$var$renderDropIndicatorWrapper(parent, reusableView, dropPosition, renderDropIndicator) {
    let target = {
        type: 'item',
        key: reusableView.content.key,
        dropPosition: dropPosition
    };
    let indicator = renderDropIndicator(target);
    if (indicator) {
        let layoutInfo = reusableView.virtualizer.layout.getDropTargetLayoutInfo(target);
        indicator = /*#__PURE__*/ (0, $dVUg9$react).createElement((0, $dVUg9$VirtualizerItem), {
            layoutInfo: layoutInfo,
            virtualizer: reusableView.virtualizer,
            parent: parent === null || parent === void 0 ? void 0 : parent.layoutInfo
        }, indicator);
    }
    return indicator;
}


export {$ce3a951440fc273f$export$89be5a243e59c4b2 as Virtualizer};
//# sourceMappingURL=Virtualizer.module.js.map
