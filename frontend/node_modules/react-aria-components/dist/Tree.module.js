import {ButtonContext as $d2b4bc8c273e7be6$export$24d547caef80ccd1} from "./Button.module.js";
import {CheckboxContext as $4e85f108e88277b8$export$b085522c77523c51} from "./RSPContexts.module.js";
import {CollectionRendererContext as $7135fc7d473fd974$export$4feb769f8ddf26c5, DefaultCollectionRenderer as $7135fc7d473fd974$export$a164736487e3f0ae, usePersistedKeys as $7135fc7d473fd974$export$90e00781bc59d8f9} from "./Collection.module.js";
import {DEFAULT_SLOT as $64fa3d84918910a7$export$c62b8e45d58ddad9, Provider as $64fa3d84918910a7$export$2881499e37b75b9a, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import {useTreeGridList as $kUtXx$useTreeGridList, useTreeGridListItem as $kUtXx$useTreeGridListItem} from "@react-aria/tree";
import {CollectionBuilder as $kUtXx$CollectionBuilder, Collection as $kUtXx$Collection, createLeafComponent as $kUtXx$createLeafComponent, createBranchComponent as $kUtXx$createBranchComponent, useCachedChildren as $kUtXx$useCachedChildren} from "@react-aria/collections";
import {filterDOMProps as $kUtXx$filterDOMProps, useObjectRef as $kUtXx$useObjectRef} from "@react-aria/utils";
import {useFocusRing as $kUtXx$useFocusRing, FocusScope as $kUtXx$FocusScope, mergeProps as $kUtXx$mergeProps, useHover as $kUtXx$useHover, useGridListSelectionCheckbox as $kUtXx$useGridListSelectionCheckbox} from "react-aria";
import {useTreeState as $kUtXx$useTreeState} from "react-stately";
import $kUtXx$react, {createContext as $kUtXx$createContext, forwardRef as $kUtXx$forwardRef, useContext as $kUtXx$useContext, useMemo as $kUtXx$useMemo, useEffect as $kUtXx$useEffect, useRef as $kUtXx$useRef} from "react";
import {useControlledState as $kUtXx$useControlledState} from "@react-stately/utils";

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










class $2f5eaf4a2a47b4cf$var$TreeCollection {
    // TODO: should this collection's getters reflect the flattened structure or the original structure
    // If we respresent the flattened structure, it is easier for the keyboard nav but harder to find all the nodes
    *[Symbol.iterator]() {
        yield* this.flattenedRows;
    }
    get size() {
        return this.flattenedRows.length;
    }
    getKeys() {
        return this.keyMap.keys();
    }
    getItem(key) {
        return this.keyMap.get(key) || null;
    }
    at(idx) {
        return this.flattenedRows[idx];
    }
    getFirstKey() {
        var _this_flattenedRows_;
        return (_this_flattenedRows_ = this.flattenedRows[0]) === null || _this_flattenedRows_ === void 0 ? void 0 : _this_flattenedRows_.key;
    }
    getLastKey() {
        var _this_flattenedRows_;
        return (_this_flattenedRows_ = this.flattenedRows[this.size - 1]) === null || _this_flattenedRows_ === void 0 ? void 0 : _this_flattenedRows_.key;
    }
    getKeyAfter(key) {
        var _this_flattenedRows_;
        let index = this.flattenedRows.findIndex((row)=>row.key === key);
        return (_this_flattenedRows_ = this.flattenedRows[index + 1]) === null || _this_flattenedRows_ === void 0 ? void 0 : _this_flattenedRows_.key;
    }
    getKeyBefore(key) {
        var _this_flattenedRows_;
        let index = this.flattenedRows.findIndex((row)=>row.key === key);
        return (_this_flattenedRows_ = this.flattenedRows[index - 1]) === null || _this_flattenedRows_ === void 0 ? void 0 : _this_flattenedRows_.key;
    }
    // Note that this will return Content nodes in addition to nested TreeItems
    getChildren(key) {
        let keyMap = this.keyMap;
        return {
            *[Symbol.iterator] () {
                let parent = keyMap.get(key);
                let node = (parent === null || parent === void 0 ? void 0 : parent.firstChildKey) != null ? keyMap.get(parent.firstChildKey) : null;
                while(node){
                    yield node;
                    node = node.nextKey != null ? keyMap.get(node.nextKey) : undefined;
                }
            }
        };
    }
    getTextValue(key) {
        let item = this.getItem(key);
        return item ? item.textValue : '';
    }
    constructor(opts){
        this.keyMap = new Map();
        let { collection: collection, expandedKeys: expandedKeys } = opts;
        let { flattenedRows: flattenedRows, keyMap: keyMap } = $2f5eaf4a2a47b4cf$var$flattenTree(collection, {
            expandedKeys: expandedKeys
        });
        this.flattenedRows = flattenedRows;
        // Use generated keyMap because it contains the modified collection nodes (aka it adjusts the indexes so that they ignore the existence of the Content items)
        this.keyMap = keyMap;
    }
}
const $2f5eaf4a2a47b4cf$export$3bc9de6f50aaf218 = /*#__PURE__*/ (0, $kUtXx$createContext)(null);
const $2f5eaf4a2a47b4cf$export$284f9562065cdd9d = /*#__PURE__*/ (0, $kUtXx$createContext)(null);
const $2f5eaf4a2a47b4cf$export$d0a8e7e54b84533e = /*#__PURE__*/ (0, $kUtXx$forwardRef)(function Tree(props, ref) {
    // Render the portal first so that we have the collection by the time we render the DOM in SSR.
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $2f5eaf4a2a47b4cf$export$3bc9de6f50aaf218);
    return /*#__PURE__*/ (0, $kUtXx$react).createElement((0, $kUtXx$CollectionBuilder), {
        content: /*#__PURE__*/ (0, $kUtXx$react).createElement((0, $kUtXx$Collection), props)
    }, (collection)=>/*#__PURE__*/ (0, $kUtXx$react).createElement($2f5eaf4a2a47b4cf$var$TreeInner, {
            props: props,
            collection: collection,
            treeRef: ref
        }));
});
function $2f5eaf4a2a47b4cf$var$TreeInner({ props: props, collection: collection, treeRef: ref }) {
    let { selectionMode: selectionMode = 'none', expandedKeys: propExpandedKeys, defaultExpandedKeys: propDefaultExpandedKeys, onExpandedChange: onExpandedChange, disabledBehavior: disabledBehavior = 'selection' } = props;
    let { CollectionRoot: CollectionRoot, isVirtualized: isVirtualized, layoutDelegate: layoutDelegate } = (0, $kUtXx$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    // Kinda annoying that we have to replicate this code here as well as in useTreeState, but don't want to add
    // flattenCollection stuff to useTreeState. Think about this later
    let [expandedKeys, setExpandedKeys] = (0, $kUtXx$useControlledState)(propExpandedKeys ? $2f5eaf4a2a47b4cf$var$convertExpanded(propExpandedKeys) : undefined, propDefaultExpandedKeys ? $2f5eaf4a2a47b4cf$var$convertExpanded(propDefaultExpandedKeys) : new Set(), onExpandedChange);
    let flattenedCollection = (0, $kUtXx$useMemo)(()=>{
        return new $2f5eaf4a2a47b4cf$var$TreeCollection({
            collection: collection,
            expandedKeys: expandedKeys
        });
    }, [
        collection,
        expandedKeys
    ]);
    let state = (0, $kUtXx$useTreeState)({
        ...props,
        selectionMode: selectionMode,
        expandedKeys: expandedKeys,
        onExpandedChange: setExpandedKeys,
        collection: flattenedCollection,
        children: undefined,
        disabledBehavior: disabledBehavior
    });
    let { gridProps: gridProps } = (0, $kUtXx$useTreeGridList)({
        ...props,
        isVirtualized: isVirtualized,
        layoutDelegate: layoutDelegate
    }, state, ref);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $kUtXx$useFocusRing)();
    let renderValues = {
        isEmpty: state.collection.size === 0,
        isFocused: isFocused,
        isFocusVisible: isFocusVisible,
        state: state
    };
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        className: props.className,
        style: props.style,
        defaultClassName: 'react-aria-Tree',
        values: renderValues
    });
    let emptyState = null;
    let emptyStatePropOverrides = null;
    if (state.collection.size === 0 && props.renderEmptyState) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let { isEmpty: isEmpty, ...values } = renderValues;
        let content = props.renderEmptyState({
            ...values
        });
        let treeGridRowProps = {
            'aria-level': 1,
            'aria-posinset': 1,
            'aria-setsize': 1
        };
        emptyState = /*#__PURE__*/ (0, $kUtXx$react).createElement("div", {
            role: "row",
            style: {
                display: 'contents'
            },
            ...treeGridRowProps
        }, /*#__PURE__*/ (0, $kUtXx$react).createElement("div", {
            role: "gridcell",
            style: {
                display: 'contents'
            }
        }, content));
    }
    return /*#__PURE__*/ (0, $kUtXx$react).createElement((0, $kUtXx$FocusScope), null, /*#__PURE__*/ (0, $kUtXx$react).createElement("div", {
        ...(0, $kUtXx$filterDOMProps)(props),
        ...renderProps,
        ...(0, $kUtXx$mergeProps)(gridProps, focusProps, emptyStatePropOverrides),
        ref: ref,
        slot: props.slot || undefined,
        onScroll: props.onScroll,
        "data-empty": state.collection.size === 0 || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined
    }, /*#__PURE__*/ (0, $kUtXx$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $2f5eaf4a2a47b4cf$export$284f9562065cdd9d,
                state
            ]
        ]
    }, /*#__PURE__*/ (0, $kUtXx$react).createElement(CollectionRoot, {
        collection: state.collection,
        persistedKeys: (0, $7135fc7d473fd974$export$90e00781bc59d8f9)(state.selectionManager.focusedKey),
        scrollRef: ref
    })), emptyState));
}
const $2f5eaf4a2a47b4cf$export$c6dbc5e1eadc6d13 = /*#__PURE__*/ (0, $kUtXx$createLeafComponent)('content', function TreeItemContent(props) {
    let values = (0, $kUtXx$useContext)($2f5eaf4a2a47b4cf$export$36b5dda0d9bc8f78);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        children: props.children,
        values: values
    });
    return /*#__PURE__*/ (0, $kUtXx$react).createElement((0, $7135fc7d473fd974$export$4feb769f8ddf26c5).Provider, {
        value: (0, $7135fc7d473fd974$export$a164736487e3f0ae)
    }, renderProps.children);
});
const $2f5eaf4a2a47b4cf$export$36b5dda0d9bc8f78 = /*#__PURE__*/ (0, $kUtXx$createContext)(null);
const $2f5eaf4a2a47b4cf$export$635b3358b7a3dfbb = /*#__PURE__*/ (0, $kUtXx$createBranchComponent)('item', (props, ref, item)=>{
    var _this;
    let state = (0, $kUtXx$useContext)($2f5eaf4a2a47b4cf$export$284f9562065cdd9d);
    ref = (0, $kUtXx$useObjectRef)(ref);
    // TODO: remove this when we support description in tree row
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let { rowProps: rowProps, gridCellProps: gridCellProps, expandButtonProps: expandButtonProps, descriptionProps: descriptionProps, ...states } = (0, $kUtXx$useTreeGridListItem)({
        node: item
    }, state, ref);
    let isExpanded = rowProps['aria-expanded'] === true;
    let hasChildRows = ((_this = [
        ...state.collection.getChildren(item.key)
    ]) === null || _this === void 0 ? void 0 : _this.length) > 1;
    let level = rowProps['aria-level'] || 1;
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $kUtXx$useHover)({
        isDisabled: !states.allowsSelection && !states.hasAction,
        onHoverStart: props.onHoverStart,
        onHoverChange: props.onHoverChange,
        onHoverEnd: props.onHoverEnd
    });
    let { isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $kUtXx$useFocusRing)();
    let { isFocusVisible: isFocusVisibleWithin, focusProps: focusWithinProps } = (0, $kUtXx$useFocusRing)({
        within: true
    });
    let { checkboxProps: checkboxProps } = (0, $kUtXx$useGridListSelectionCheckbox)({
        key: item.key
    }, state);
    let renderPropValues = (0, $kUtXx$react).useMemo(()=>({
            ...states,
            isHovered: isHovered,
            isFocusVisible: isFocusVisible,
            isExpanded: isExpanded,
            hasChildRows: hasChildRows,
            level: level,
            selectionMode: state.selectionManager.selectionMode,
            selectionBehavior: state.selectionManager.selectionBehavior,
            isFocusVisibleWithin: isFocusVisibleWithin
        }), [
        states,
        isHovered,
        isFocusVisible,
        state.selectionManager,
        isExpanded,
        hasChildRows,
        level,
        isFocusVisibleWithin
    ]);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        id: undefined,
        children: item.rendered,
        defaultClassName: 'react-aria-TreeItem',
        defaultStyle: {
            // @ts-ignore
            '--tree-item-level': level
        },
        values: renderPropValues
    });
    (0, $kUtXx$useEffect)(()=>{
        if (!item.textValue) console.warn('A `textValue` prop is required for <TreeItem> elements in order to support accessibility features such as type to select.');
    }, [
        item.textValue
    ]);
    let expandButtonRef = (0, $kUtXx$useRef)(null);
    (0, $kUtXx$useEffect)(()=>{
        if (hasChildRows && !expandButtonRef.current) console.warn('Expandable tree items must contain a expand button so screen reader users can expand/collapse the item.');
    // eslint-disable-next-line
    }, []);
    let children = (0, $kUtXx$useCachedChildren)({
        items: state.collection.getChildren(item.key),
        children: (item)=>{
            switch(item.type){
                case 'content':
                    return item.render(item);
                // Skip item since we don't render the nested rows as children of the parent row, the flattened collection
                // will render them each as siblings instead
                case 'loader':
                case 'item':
                    return /*#__PURE__*/ (0, $kUtXx$react).createElement((0, $kUtXx$react).Fragment, null);
                default:
                    throw new Error('Unsupported element type in TreeRow: ' + item.type);
            }
        }
    });
    return /*#__PURE__*/ (0, $kUtXx$react).createElement((0, $kUtXx$react).Fragment, null, /*#__PURE__*/ (0, $kUtXx$react).createElement("div", {
        ...(0, $kUtXx$mergeProps)((0, $kUtXx$filterDOMProps)(props), rowProps, focusProps, hoverProps, focusWithinProps),
        ...renderProps,
        ref: ref,
        // TODO: missing selectionBehavior, hasAction and allowsSelection data attribute equivalents (available in renderProps). Do we want those?
        "data-expanded": hasChildRows && isExpanded || undefined,
        "data-has-child-rows": hasChildRows || undefined,
        "data-level": level,
        "data-selected": states.isSelected || undefined,
        "data-disabled": states.isDisabled || undefined,
        "data-hovered": isHovered || undefined,
        "data-focused": states.isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-pressed": states.isPressed || undefined,
        "data-selection-mode": state.selectionManager.selectionMode === 'none' ? undefined : state.selectionManager.selectionMode
    }, /*#__PURE__*/ (0, $kUtXx$react).createElement("div", {
        ...gridCellProps,
        style: {
            display: 'contents'
        }
    }, /*#__PURE__*/ (0, $kUtXx$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                (0, $4e85f108e88277b8$export$b085522c77523c51),
                {
                    slots: {
                        selection: checkboxProps
                    }
                }
            ],
            // TODO: support description in the tree row
            // TODO: don't think I need to pass isExpanded to the button here since it can be sourced from the renderProps? Might be worthwhile passing it down?
            [
                (0, $d2b4bc8c273e7be6$export$24d547caef80ccd1),
                {
                    slots: {
                        [(0, $64fa3d84918910a7$export$c62b8e45d58ddad9)]: {},
                        chevron: {
                            ...expandButtonProps,
                            ref: expandButtonRef
                        }
                    }
                }
            ],
            [
                $2f5eaf4a2a47b4cf$export$36b5dda0d9bc8f78,
                {
                    ...renderPropValues
                }
            ]
        ]
    }, children))));
});
const $2f5eaf4a2a47b4cf$export$9d1a587784d97b41 = (0, $kUtXx$createLeafComponent)('loader', function TreeLoader(props, ref, item) {
    let state = (0, $kUtXx$useContext)($2f5eaf4a2a47b4cf$export$284f9562065cdd9d);
    // This loader row is is non-interactable, but we want the same aria props calculated as a typical row
    // @ts-ignore
    let { rowProps: rowProps } = (0, $kUtXx$useTreeGridListItem)({
        node: item
    }, state, ref);
    let level = rowProps['aria-level'] || 1;
    let ariaProps = {
        'aria-level': rowProps['aria-level'],
        'aria-posinset': rowProps['aria-posinset'],
        'aria-setsize': rowProps['aria-setsize']
    };
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        id: undefined,
        children: item.rendered,
        defaultClassName: 'react-aria-TreeLoader',
        values: {
            level: level
        }
    });
    return /*#__PURE__*/ (0, $kUtXx$react).createElement((0, $kUtXx$react).Fragment, null, /*#__PURE__*/ (0, $kUtXx$react).createElement("div", {
        role: "row",
        ref: ref,
        ...(0, $kUtXx$mergeProps)((0, $kUtXx$filterDOMProps)(props), ariaProps),
        ...renderProps,
        "data-level": level
    }, /*#__PURE__*/ (0, $kUtXx$react).createElement("div", {
        role: "gridcell",
        "aria-colindex": 1
    }, renderProps.children)));
});
function $2f5eaf4a2a47b4cf$var$convertExpanded(expanded) {
    if (!expanded) return new Set();
    return expanded === 'all' ? 'all' : new Set(expanded);
}
function $2f5eaf4a2a47b4cf$var$flattenTree(collection, opts) {
    let { expandedKeys: expandedKeys = new Set() } = opts;
    let keyMap = new Map();
    let flattenedRows = [];
    let visitNode = (node)=>{
        if (node.type === 'item' || node.type === 'loader') {
            let parentKey = node === null || node === void 0 ? void 0 : node.parentKey;
            let clone = {
                ...node
            };
            if (parentKey != null) {
                // TODO: assumes that non item content node (aka TreeItemContent always placed before Collection) will be always placed before the child rows. If we can't make this assumption then we can filter out
                // every non-item per level and assign indicies based off the node's position in said filtered array
                let hasContentNode = [
                    ...collection.getChildren(parentKey)
                ][0].type !== 'item';
                if (hasContentNode) clone.index = (node === null || node === void 0 ? void 0 : node.index) != null ? (node === null || node === void 0 ? void 0 : node.index) - 1 : 0;
                // For loader nodes that have a parent (aka non-root level loaders), these need their levels incremented by 1 for parity with their sibiling rows
                // (Collection only increments the level if it is a "item" type node).
                if (node.type === 'loader') clone.level = node.level + 1;
                keyMap.set(clone.key, clone);
            } else keyMap.set(node.key, node);
            if (node.level === 0 || parentKey != null && expandedKeys.has(parentKey) && flattenedRows.find((row)=>row.key === parentKey)) // Grab the modified node from the key map so our flattened list and modified key map point to the same nodes
            flattenedRows.push(keyMap.get(node.key) || node);
        } else if (node.type !== null) keyMap.set(node.key, node);
        for (let child of collection.getChildren(node.key))visitNode(child);
    };
    for (let node of collection)visitNode(node);
    return {
        flattenedRows: flattenedRows,
        keyMap: keyMap
    };
}


export {$2f5eaf4a2a47b4cf$export$3bc9de6f50aaf218 as UNSTABLE_TreeContext, $2f5eaf4a2a47b4cf$export$284f9562065cdd9d as UNSTABLE_TreeStateContext, $2f5eaf4a2a47b4cf$export$d0a8e7e54b84533e as UNSTABLE_Tree, $2f5eaf4a2a47b4cf$export$c6dbc5e1eadc6d13 as UNSTABLE_TreeItemContent, $2f5eaf4a2a47b4cf$export$36b5dda0d9bc8f78 as TreeItemContentContext, $2f5eaf4a2a47b4cf$export$635b3358b7a3dfbb as UNSTABLE_TreeItem, $2f5eaf4a2a47b4cf$export$9d1a587784d97b41 as UNSTABLE_TreeLoadingIndicator};
//# sourceMappingURL=Tree.module.js.map
