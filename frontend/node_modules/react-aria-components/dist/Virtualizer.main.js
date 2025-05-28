var $3114c2382242bdc0$exports = require("./Collection.main.js");
var $elHQ5$reactstatelyvirtualizer = require("@react-stately/virtualizer");
var $elHQ5$react = require("react");
var $elHQ5$reactariavirtualizer = require("@react-aria/virtualizer");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "Virtualizer", () => $eff08fda52c0d997$export$89be5a243e59c4b2);
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



const $eff08fda52c0d997$var$VirtualizerContext = /*#__PURE__*/ (0, $elHQ5$react.createContext)(null);
const $eff08fda52c0d997$var$LayoutContext = /*#__PURE__*/ (0, $elHQ5$react.createContext)(null);
function $eff08fda52c0d997$export$89be5a243e59c4b2(props) {
    let { children: children, layout: layout, layoutOptions: layoutOptions } = props;
    let renderer = (0, $elHQ5$react.useMemo)(()=>({
            isVirtualized: true,
            layoutDelegate: layout,
            dropTargetDelegate: layout.getDropTargetFromPoint ? layout : undefined,
            CollectionRoot: $eff08fda52c0d997$var$CollectionRoot,
            CollectionBranch: $eff08fda52c0d997$var$CollectionBranch
        }), [
        layout
    ]);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($elHQ5$react))).createElement((0, $3114c2382242bdc0$exports.CollectionRendererContext).Provider, {
        value: renderer
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($elHQ5$react))).createElement($eff08fda52c0d997$var$LayoutContext.Provider, {
        value: {
            layout: layout,
            layoutOptions: layoutOptions
        }
    }, children));
}
function $eff08fda52c0d997$var$CollectionRoot({ collection: collection, persistedKeys: persistedKeys, scrollRef: scrollRef, renderDropIndicator: renderDropIndicator }) {
    var _layout_useLayoutOptions;
    let { layout: layout, layoutOptions: layoutOptions } = (0, $elHQ5$react.useContext)($eff08fda52c0d997$var$LayoutContext);
    let layoutOptions2 = (_layout_useLayoutOptions = layout.useLayoutOptions) === null || _layout_useLayoutOptions === void 0 ? void 0 : _layout_useLayoutOptions.call(layout);
    let state = (0, $elHQ5$reactstatelyvirtualizer.useVirtualizerState)({
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
        layoutOptions: (0, $elHQ5$react.useMemo)(()=>{
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
    let { contentProps: contentProps } = (0, $elHQ5$reactariavirtualizer.useScrollView)({
        onVisibleRectChange: state.setVisibleRect,
        contentSize: state.contentSize,
        onScrollStart: state.startScrolling,
        onScrollEnd: state.endScrolling
    }, scrollRef);
    if (state.contentSize.area === 0) return null;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($elHQ5$react))).createElement("div", contentProps, /*#__PURE__*/ (0, ($parcel$interopDefault($elHQ5$react))).createElement($eff08fda52c0d997$var$VirtualizerContext.Provider, {
        value: state
    }, $eff08fda52c0d997$var$renderChildren(null, state.visibleViews, renderDropIndicator)));
}
function $eff08fda52c0d997$var$CollectionBranch({ parent: parent, renderDropIndicator: renderDropIndicator }) {
    let virtualizer = (0, $elHQ5$react.useContext)($eff08fda52c0d997$var$VirtualizerContext);
    let parentView = virtualizer.virtualizer.getVisibleView(parent.key);
    return $eff08fda52c0d997$var$renderChildren(parentView, Array.from(parentView.children), renderDropIndicator);
}
function $eff08fda52c0d997$var$renderChildren(parent, children, renderDropIndicator) {
    return children.map((view)=>$eff08fda52c0d997$var$renderWrapper(parent, view, renderDropIndicator));
}
function $eff08fda52c0d997$var$renderWrapper(parent, reusableView, renderDropIndicator) {
    let rendered = /*#__PURE__*/ (0, ($parcel$interopDefault($elHQ5$react))).createElement((0, $elHQ5$reactariavirtualizer.VirtualizerItem), {
        key: reusableView.key,
        layoutInfo: reusableView.layoutInfo,
        virtualizer: reusableView.virtualizer,
        parent: parent === null || parent === void 0 ? void 0 : parent.layoutInfo
    }, reusableView.rendered);
    let { collection: collection, layout: layout } = reusableView.virtualizer;
    let { key: key, type: type } = reusableView.content;
    if (type === 'item' && renderDropIndicator && layout.getDropTargetLayoutInfo) rendered = /*#__PURE__*/ (0, ($parcel$interopDefault($elHQ5$react))).createElement((0, ($parcel$interopDefault($elHQ5$react))).Fragment, {
        key: reusableView.key
    }, $eff08fda52c0d997$var$renderDropIndicatorWrapper(parent, reusableView, 'before', renderDropIndicator), rendered, collection.getKeyAfter(key) == null && $eff08fda52c0d997$var$renderDropIndicatorWrapper(parent, reusableView, 'after', renderDropIndicator));
    return rendered;
}
function $eff08fda52c0d997$var$renderDropIndicatorWrapper(parent, reusableView, dropPosition, renderDropIndicator) {
    let target = {
        type: 'item',
        key: reusableView.content.key,
        dropPosition: dropPosition
    };
    let indicator = renderDropIndicator(target);
    if (indicator) {
        let layoutInfo = reusableView.virtualizer.layout.getDropTargetLayoutInfo(target);
        indicator = /*#__PURE__*/ (0, ($parcel$interopDefault($elHQ5$react))).createElement((0, $elHQ5$reactariavirtualizer.VirtualizerItem), {
            layoutInfo: layoutInfo,
            virtualizer: reusableView.virtualizer,
            parent: parent === null || parent === void 0 ? void 0 : parent.layoutInfo
        }, indicator);
    }
    return indicator;
}


//# sourceMappingURL=Virtualizer.main.js.map
