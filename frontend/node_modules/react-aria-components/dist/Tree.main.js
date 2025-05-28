var $b856e6788a7ea5bf$exports = require("./Button.main.js");
var $525402dfec7da5bc$exports = require("./RSPContexts.main.js");
var $3114c2382242bdc0$exports = require("./Collection.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $5SMu3$reactariatree = require("@react-aria/tree");
var $5SMu3$reactariacollections = require("@react-aria/collections");
var $5SMu3$reactariautils = require("@react-aria/utils");
var $5SMu3$reactaria = require("react-aria");
var $5SMu3$reactstately = require("react-stately");
var $5SMu3$react = require("react");
var $5SMu3$reactstatelyutils = require("@react-stately/utils");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "UNSTABLE_TreeContext", () => $c6576bb58bfa084b$export$3bc9de6f50aaf218);
$parcel$export(module.exports, "UNSTABLE_TreeStateContext", () => $c6576bb58bfa084b$export$284f9562065cdd9d);
$parcel$export(module.exports, "UNSTABLE_Tree", () => $c6576bb58bfa084b$export$d0a8e7e54b84533e);
$parcel$export(module.exports, "UNSTABLE_TreeItemContent", () => $c6576bb58bfa084b$export$c6dbc5e1eadc6d13);
$parcel$export(module.exports, "UNSTABLE_TreeItem", () => $c6576bb58bfa084b$export$635b3358b7a3dfbb);
$parcel$export(module.exports, "UNSTABLE_TreeLoadingIndicator", () => $c6576bb58bfa084b$export$9d1a587784d97b41);
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










class $c6576bb58bfa084b$var$TreeCollection {
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
        let { flattenedRows: flattenedRows, keyMap: keyMap } = $c6576bb58bfa084b$var$flattenTree(collection, {
            expandedKeys: expandedKeys
        });
        this.flattenedRows = flattenedRows;
        // Use generated keyMap because it contains the modified collection nodes (aka it adjusts the indexes so that they ignore the existence of the Content items)
        this.keyMap = keyMap;
    }
}
const $c6576bb58bfa084b$export$3bc9de6f50aaf218 = /*#__PURE__*/ (0, $5SMu3$react.createContext)(null);
const $c6576bb58bfa084b$export$284f9562065cdd9d = /*#__PURE__*/ (0, $5SMu3$react.createContext)(null);
const $c6576bb58bfa084b$export$d0a8e7e54b84533e = /*#__PURE__*/ (0, $5SMu3$react.forwardRef)(function Tree(props, ref) {
    // Render the portal first so that we have the collection by the time we render the DOM in SSR.
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $c6576bb58bfa084b$export$3bc9de6f50aaf218);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement((0, $5SMu3$reactariacollections.CollectionBuilder), {
        content: /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement((0, $5SMu3$reactariacollections.Collection), props)
    }, (collection)=>/*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement($c6576bb58bfa084b$var$TreeInner, {
            props: props,
            collection: collection,
            treeRef: ref
        }));
});
function $c6576bb58bfa084b$var$TreeInner({ props: props, collection: collection, treeRef: ref }) {
    let { selectionMode: selectionMode = 'none', expandedKeys: propExpandedKeys, defaultExpandedKeys: propDefaultExpandedKeys, onExpandedChange: onExpandedChange, disabledBehavior: disabledBehavior = 'selection' } = props;
    let { CollectionRoot: CollectionRoot, isVirtualized: isVirtualized, layoutDelegate: layoutDelegate } = (0, $5SMu3$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    // Kinda annoying that we have to replicate this code here as well as in useTreeState, but don't want to add
    // flattenCollection stuff to useTreeState. Think about this later
    let [expandedKeys, setExpandedKeys] = (0, $5SMu3$reactstatelyutils.useControlledState)(propExpandedKeys ? $c6576bb58bfa084b$var$convertExpanded(propExpandedKeys) : undefined, propDefaultExpandedKeys ? $c6576bb58bfa084b$var$convertExpanded(propDefaultExpandedKeys) : new Set(), onExpandedChange);
    let flattenedCollection = (0, $5SMu3$react.useMemo)(()=>{
        return new $c6576bb58bfa084b$var$TreeCollection({
            collection: collection,
            expandedKeys: expandedKeys
        });
    }, [
        collection,
        expandedKeys
    ]);
    let state = (0, $5SMu3$reactstately.useTreeState)({
        ...props,
        selectionMode: selectionMode,
        expandedKeys: expandedKeys,
        onExpandedChange: setExpandedKeys,
        collection: flattenedCollection,
        children: undefined,
        disabledBehavior: disabledBehavior
    });
    let { gridProps: gridProps } = (0, $5SMu3$reactariatree.useTreeGridList)({
        ...props,
        isVirtualized: isVirtualized,
        layoutDelegate: layoutDelegate
    }, state, ref);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $5SMu3$reactaria.useFocusRing)();
    let renderValues = {
        isEmpty: state.collection.size === 0,
        isFocused: isFocused,
        isFocusVisible: isFocusVisible,
        state: state
    };
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
        emptyState = /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement("div", {
            role: "row",
            style: {
                display: 'contents'
            },
            ...treeGridRowProps
        }, /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement("div", {
            role: "gridcell",
            style: {
                display: 'contents'
            }
        }, content));
    }
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement((0, $5SMu3$reactaria.FocusScope), null, /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement("div", {
        ...(0, $5SMu3$reactariautils.filterDOMProps)(props),
        ...renderProps,
        ...(0, $5SMu3$reactaria.mergeProps)(gridProps, focusProps, emptyStatePropOverrides),
        ref: ref,
        slot: props.slot || undefined,
        onScroll: props.onScroll,
        "data-empty": state.collection.size === 0 || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $c6576bb58bfa084b$export$284f9562065cdd9d,
                state
            ]
        ]
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement(CollectionRoot, {
        collection: state.collection,
        persistedKeys: (0, $3114c2382242bdc0$exports.usePersistedKeys)(state.selectionManager.focusedKey),
        scrollRef: ref
    })), emptyState));
}
const $c6576bb58bfa084b$export$c6dbc5e1eadc6d13 = /*#__PURE__*/ (0, $5SMu3$reactariacollections.createLeafComponent)('content', function TreeItemContent(props) {
    let values = (0, $5SMu3$react.useContext)($c6576bb58bfa084b$export$36b5dda0d9bc8f78);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        children: props.children,
        values: values
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement((0, $3114c2382242bdc0$exports.CollectionRendererContext).Provider, {
        value: (0, $3114c2382242bdc0$exports.DefaultCollectionRenderer)
    }, renderProps.children);
});
const $c6576bb58bfa084b$export$36b5dda0d9bc8f78 = /*#__PURE__*/ (0, $5SMu3$react.createContext)(null);
const $c6576bb58bfa084b$export$635b3358b7a3dfbb = /*#__PURE__*/ (0, $5SMu3$reactariacollections.createBranchComponent)('item', (props, ref, item)=>{
    var _this;
    let state = (0, $5SMu3$react.useContext)($c6576bb58bfa084b$export$284f9562065cdd9d);
    ref = (0, $5SMu3$reactariautils.useObjectRef)(ref);
    // TODO: remove this when we support description in tree row
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let { rowProps: rowProps, gridCellProps: gridCellProps, expandButtonProps: expandButtonProps, descriptionProps: descriptionProps, ...states } = (0, $5SMu3$reactariatree.useTreeGridListItem)({
        node: item
    }, state, ref);
    let isExpanded = rowProps['aria-expanded'] === true;
    let hasChildRows = ((_this = [
        ...state.collection.getChildren(item.key)
    ]) === null || _this === void 0 ? void 0 : _this.length) > 1;
    let level = rowProps['aria-level'] || 1;
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $5SMu3$reactaria.useHover)({
        isDisabled: !states.allowsSelection && !states.hasAction,
        onHoverStart: props.onHoverStart,
        onHoverChange: props.onHoverChange,
        onHoverEnd: props.onHoverEnd
    });
    let { isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $5SMu3$reactaria.useFocusRing)();
    let { isFocusVisible: isFocusVisibleWithin, focusProps: focusWithinProps } = (0, $5SMu3$reactaria.useFocusRing)({
        within: true
    });
    let { checkboxProps: checkboxProps } = (0, $5SMu3$reactaria.useGridListSelectionCheckbox)({
        key: item.key
    }, state);
    let renderPropValues = (0, ($parcel$interopDefault($5SMu3$react))).useMemo(()=>({
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
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    (0, $5SMu3$react.useEffect)(()=>{
        if (!item.textValue) console.warn('A `textValue` prop is required for <TreeItem> elements in order to support accessibility features such as type to select.');
    }, [
        item.textValue
    ]);
    let expandButtonRef = (0, $5SMu3$react.useRef)(null);
    (0, $5SMu3$react.useEffect)(()=>{
        if (hasChildRows && !expandButtonRef.current) console.warn('Expandable tree items must contain a expand button so screen reader users can expand/collapse the item.');
    // eslint-disable-next-line
    }, []);
    let children = (0, $5SMu3$reactariacollections.useCachedChildren)({
        items: state.collection.getChildren(item.key),
        children: (item)=>{
            switch(item.type){
                case 'content':
                    return item.render(item);
                // Skip item since we don't render the nested rows as children of the parent row, the flattened collection
                // will render them each as siblings instead
                case 'loader':
                case 'item':
                    return /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement((0, ($parcel$interopDefault($5SMu3$react))).Fragment, null);
                default:
                    throw new Error('Unsupported element type in TreeRow: ' + item.type);
            }
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement((0, ($parcel$interopDefault($5SMu3$react))).Fragment, null, /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement("div", {
        ...(0, $5SMu3$reactaria.mergeProps)((0, $5SMu3$reactariautils.filterDOMProps)(props), rowProps, focusProps, hoverProps, focusWithinProps),
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
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement("div", {
        ...gridCellProps,
        style: {
            display: 'contents'
        }
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                (0, $525402dfec7da5bc$exports.CheckboxContext),
                {
                    slots: {
                        selection: checkboxProps
                    }
                }
            ],
            // TODO: support description in the tree row
            // TODO: don't think I need to pass isExpanded to the button here since it can be sourced from the renderProps? Might be worthwhile passing it down?
            [
                (0, $b856e6788a7ea5bf$exports.ButtonContext),
                {
                    slots: {
                        [(0, $c5ccf687772c0422$exports.DEFAULT_SLOT)]: {},
                        chevron: {
                            ...expandButtonProps,
                            ref: expandButtonRef
                        }
                    }
                }
            ],
            [
                $c6576bb58bfa084b$export$36b5dda0d9bc8f78,
                {
                    ...renderPropValues
                }
            ]
        ]
    }, children))));
});
const $c6576bb58bfa084b$export$9d1a587784d97b41 = (0, $5SMu3$reactariacollections.createLeafComponent)('loader', function TreeLoader(props, ref, item) {
    let state = (0, $5SMu3$react.useContext)($c6576bb58bfa084b$export$284f9562065cdd9d);
    // This loader row is is non-interactable, but we want the same aria props calculated as a typical row
    // @ts-ignore
    let { rowProps: rowProps } = (0, $5SMu3$reactariatree.useTreeGridListItem)({
        node: item
    }, state, ref);
    let level = rowProps['aria-level'] || 1;
    let ariaProps = {
        'aria-level': rowProps['aria-level'],
        'aria-posinset': rowProps['aria-posinset'],
        'aria-setsize': rowProps['aria-setsize']
    };
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        id: undefined,
        children: item.rendered,
        defaultClassName: 'react-aria-TreeLoader',
        values: {
            level: level
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement((0, ($parcel$interopDefault($5SMu3$react))).Fragment, null, /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement("div", {
        role: "row",
        ref: ref,
        ...(0, $5SMu3$reactaria.mergeProps)((0, $5SMu3$reactariautils.filterDOMProps)(props), ariaProps),
        ...renderProps,
        "data-level": level
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5SMu3$react))).createElement("div", {
        role: "gridcell",
        "aria-colindex": 1
    }, renderProps.children)));
});
function $c6576bb58bfa084b$var$convertExpanded(expanded) {
    if (!expanded) return new Set();
    return expanded === 'all' ? 'all' : new Set(expanded);
}
function $c6576bb58bfa084b$var$flattenTree(collection, opts) {
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


//# sourceMappingURL=Tree.main.js.map
