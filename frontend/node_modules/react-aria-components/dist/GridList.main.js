var $b856e6788a7ea5bf$exports = require("./Button.main.js");
var $525402dfec7da5bc$exports = require("./RSPContexts.main.js");
var $3114c2382242bdc0$exports = require("./Collection.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $0c2289d253cb4544$exports = require("./DragAndDrop.main.js");
var $a03b42240404b420$exports = require("./ListBox.main.js");
var $a8a589c28affdc40$exports = require("./Text.main.js");
var $UaDUV$reactaria = require("react-aria");
var $UaDUV$reactariacollections = require("@react-aria/collections");
var $UaDUV$reactstately = require("react-stately");
var $UaDUV$reactariautils = require("@react-aria/utils");
var $UaDUV$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "GridListContext", () => $132cbde493282f82$export$54fe942636b6416d);
$parcel$export(module.exports, "GridList", () => $132cbde493282f82$export$a7bfbda1311ca015);
$parcel$export(module.exports, "GridListItem", () => $132cbde493282f82$export$e96fc9a8407faa6b);
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











const $132cbde493282f82$export$54fe942636b6416d = /*#__PURE__*/ (0, $UaDUV$react.createContext)(null);
const $132cbde493282f82$export$a7bfbda1311ca015 = /*#__PURE__*/ (0, $UaDUV$react.forwardRef)(function GridList(props, ref) {
    // Render the portal first so that we have the collection by the time we render the DOM in SSR.
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $132cbde493282f82$export$54fe942636b6416d);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement((0, $UaDUV$reactariacollections.CollectionBuilder), {
        content: /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement((0, $UaDUV$reactariacollections.Collection), props)
    }, (collection)=>/*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement($132cbde493282f82$var$GridListInner, {
            props: props,
            collection: collection,
            gridListRef: ref
        }));
});
function $132cbde493282f82$var$GridListInner({ props: props, collection: collection, gridListRef: ref }) {
    let { dragAndDropHooks: dragAndDropHooks, keyboardNavigationBehavior: keyboardNavigationBehavior = 'arrow', layout: layout = 'stack' } = props;
    let { CollectionRoot: CollectionRoot, isVirtualized: isVirtualized, layoutDelegate: layoutDelegate, dropTargetDelegate: ctxDropTargetDelegate } = (0, $UaDUV$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    let state = (0, $UaDUV$reactstately.useListState)({
        ...props,
        collection: collection,
        children: undefined,
        layoutDelegate: layoutDelegate
    });
    let collator = (0, $UaDUV$reactaria.useCollator)({
        usage: 'search',
        sensitivity: 'base'
    });
    let { disabledBehavior: disabledBehavior, disabledKeys: disabledKeys } = state.selectionManager;
    let { direction: direction } = (0, $UaDUV$reactaria.useLocale)();
    let keyboardDelegate = (0, $UaDUV$react.useMemo)(()=>new (0, $UaDUV$reactaria.ListKeyboardDelegate)({
            collection: collection,
            collator: collator,
            ref: ref,
            disabledKeys: disabledKeys,
            disabledBehavior: disabledBehavior,
            layoutDelegate: layoutDelegate,
            layout: layout,
            direction: direction
        }), [
        collection,
        ref,
        layout,
        disabledKeys,
        disabledBehavior,
        layoutDelegate,
        collator,
        direction
    ]);
    let { gridProps: gridProps } = (0, $UaDUV$reactaria.useGridList)({
        ...props,
        keyboardDelegate: keyboardDelegate,
        // Only tab navigation is supported in grid layout.
        keyboardNavigationBehavior: layout === 'grid' ? 'tab' : keyboardNavigationBehavior,
        isVirtualized: isVirtualized
    }, state, ref);
    let selectionManager = state.selectionManager;
    let isListDraggable = !!(dragAndDropHooks === null || dragAndDropHooks === void 0 ? void 0 : dragAndDropHooks.useDraggableCollectionState);
    let isListDroppable = !!(dragAndDropHooks === null || dragAndDropHooks === void 0 ? void 0 : dragAndDropHooks.useDroppableCollectionState);
    let dragHooksProvided = (0, $UaDUV$react.useRef)(isListDraggable);
    let dropHooksProvided = (0, $UaDUV$react.useRef)(isListDroppable);
    (0, $UaDUV$react.useEffect)(()=>{
        if (dragHooksProvided.current !== isListDraggable) console.warn('Drag hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.');
        if (dropHooksProvided.current !== isListDroppable) console.warn('Drop hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.');
    }, [
        isListDraggable,
        isListDroppable
    ]);
    let dragState = undefined;
    let dropState = undefined;
    let droppableCollection = undefined;
    let isRootDropTarget = false;
    let dragPreview = null;
    let preview = (0, $UaDUV$react.useRef)(null);
    if (isListDraggable && dragAndDropHooks) {
        dragState = dragAndDropHooks.useDraggableCollectionState({
            collection: collection,
            selectionManager: selectionManager,
            preview: dragAndDropHooks.renderDragPreview ? preview : undefined
        });
        dragAndDropHooks.useDraggableCollection({}, dragState, ref);
        let DragPreview = dragAndDropHooks.DragPreview;
        dragPreview = dragAndDropHooks.renderDragPreview ? /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement(DragPreview, {
            ref: preview
        }, dragAndDropHooks.renderDragPreview) : null;
    }
    if (isListDroppable && dragAndDropHooks) {
        dropState = dragAndDropHooks.useDroppableCollectionState({
            collection: collection,
            selectionManager: selectionManager
        });
        let keyboardDelegate = new (0, $UaDUV$reactaria.ListKeyboardDelegate)({
            collection: collection,
            disabledKeys: selectionManager.disabledKeys,
            disabledBehavior: selectionManager.disabledBehavior,
            ref: ref
        });
        let dropTargetDelegate = dragAndDropHooks.dropTargetDelegate || ctxDropTargetDelegate || new dragAndDropHooks.ListDropTargetDelegate(collection, ref, {
            layout: layout,
            direction: direction
        });
        droppableCollection = dragAndDropHooks.useDroppableCollection({
            keyboardDelegate: keyboardDelegate,
            dropTargetDelegate: dropTargetDelegate
        }, dropState, ref);
        isRootDropTarget = dropState.isDropTarget({
            type: 'root'
        });
    }
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $UaDUV$reactaria.useFocusRing)();
    let renderValues = {
        isDropTarget: isRootDropTarget,
        isEmpty: state.collection.size === 0,
        isFocused: isFocused,
        isFocusVisible: isFocusVisible,
        layout: layout,
        state: state
    };
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        className: props.className,
        style: props.style,
        defaultClassName: 'react-aria-GridList',
        values: renderValues
    });
    let emptyState = null;
    let emptyStatePropOverrides = null;
    if (state.collection.size === 0 && props.renderEmptyState) {
        let content = props.renderEmptyState(renderValues);
        emptyState = /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
            role: "row",
            style: {
                display: 'contents'
            }
        }, /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
            role: "gridcell",
            style: {
                display: 'contents'
            }
        }, content));
    }
    return /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement((0, $UaDUV$reactaria.FocusScope), null, /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
        ...(0, $UaDUV$reactariautils.filterDOMProps)(props),
        ...renderProps,
        ...(0, $UaDUV$reactaria.mergeProps)(gridProps, focusProps, droppableCollection === null || droppableCollection === void 0 ? void 0 : droppableCollection.collectionProps, emptyStatePropOverrides),
        ref: ref,
        slot: props.slot || undefined,
        onScroll: props.onScroll,
        "data-drop-target": isRootDropTarget || undefined,
        "data-empty": state.collection.size === 0 || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-layout": layout
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                (0, $a03b42240404b420$exports.ListStateContext),
                state
            ],
            [
                (0, $0c2289d253cb4544$exports.DragAndDropContext),
                {
                    dragAndDropHooks: dragAndDropHooks,
                    dragState: dragState,
                    dropState: dropState
                }
            ],
            [
                (0, $0c2289d253cb4544$exports.DropIndicatorContext),
                {
                    render: $132cbde493282f82$var$GridListDropIndicatorWrapper
                }
            ]
        ]
    }, isListDroppable && /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement($132cbde493282f82$var$RootDropIndicator, null), /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement(CollectionRoot, {
        collection: collection,
        scrollRef: ref,
        persistedKeys: (0, $0c2289d253cb4544$exports.useDndPersistedKeys)(selectionManager, dragAndDropHooks, dropState),
        renderDropIndicator: (0, $0c2289d253cb4544$exports.useRenderDropIndicator)(dragAndDropHooks, dropState)
    })), emptyState, dragPreview));
}
const $132cbde493282f82$export$e96fc9a8407faa6b = /*#__PURE__*/ (0, $UaDUV$reactariacollections.createLeafComponent)('item', function GridListItem(props, forwardedRef, item) {
    let state = (0, $UaDUV$react.useContext)((0, $a03b42240404b420$exports.ListStateContext));
    let { dragAndDropHooks: dragAndDropHooks, dragState: dragState, dropState: dropState } = (0, $UaDUV$react.useContext)((0, $0c2289d253cb4544$exports.DragAndDropContext));
    let ref = (0, $UaDUV$reactariautils.useObjectRef)(forwardedRef);
    let { isVirtualized: isVirtualized } = (0, $UaDUV$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    let { rowProps: rowProps, gridCellProps: gridCellProps, descriptionProps: descriptionProps, ...states } = (0, $UaDUV$reactaria.useGridListItem)({
        node: item,
        shouldSelectOnPressUp: !!dragState,
        isVirtualized: isVirtualized
    }, state, ref);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $UaDUV$reactaria.useHover)({
        isDisabled: !states.allowsSelection && !states.hasAction,
        onHoverStart: item.props.onHoverStart,
        onHoverChange: item.props.onHoverChange,
        onHoverEnd: item.props.onHoverEnd
    });
    let { isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $UaDUV$reactaria.useFocusRing)();
    let { checkboxProps: checkboxProps } = (0, $UaDUV$reactaria.useGridListSelectionCheckbox)({
        key: item.key
    }, state);
    let buttonProps = state.selectionManager.disabledBehavior === 'all' && states.isDisabled ? {
        isDisabled: true
    } : {};
    let draggableItem = null;
    if (dragState && dragAndDropHooks) draggableItem = dragAndDropHooks.useDraggableItem({
        key: item.key,
        hasDragButton: true
    }, dragState);
    let dropIndicator = null;
    let dropIndicatorRef = (0, $UaDUV$react.useRef)(null);
    let { visuallyHiddenProps: visuallyHiddenProps } = (0, $UaDUV$reactaria.useVisuallyHidden)();
    if (dropState && dragAndDropHooks) dropIndicator = dragAndDropHooks.useDropIndicator({
        target: {
            type: 'item',
            key: item.key,
            dropPosition: 'on'
        }
    }, dropState, dropIndicatorRef);
    let isDragging = dragState && dragState.isDragging(item.key);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        id: undefined,
        children: item.rendered,
        defaultClassName: 'react-aria-GridListItem',
        values: {
            ...states,
            isHovered: isHovered,
            isFocusVisible: isFocusVisible,
            selectionMode: state.selectionManager.selectionMode,
            selectionBehavior: state.selectionManager.selectionBehavior,
            allowsDragging: !!dragState,
            isDragging: isDragging,
            isDropTarget: dropIndicator === null || dropIndicator === void 0 ? void 0 : dropIndicator.isDropTarget
        }
    });
    let dragButtonRef = (0, $UaDUV$react.useRef)(null);
    (0, $UaDUV$react.useEffect)(()=>{
        if (dragState && !dragButtonRef.current) console.warn('Draggable items in a GridList must contain a <Button slot="drag"> element so that keyboard and screen reader users can drag them.');
    // eslint-disable-next-line
    }, []);
    (0, $UaDUV$react.useEffect)(()=>{
        if (!item.textValue) console.warn('A `textValue` prop is required for <GridListItem> elements with non-plain text children in order to support accessibility features such as type to select.');
    }, [
        item.textValue
    ]);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement((0, ($parcel$interopDefault($UaDUV$react))).Fragment, null, dropIndicator && !dropIndicator.isHidden && /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
        role: "row",
        style: {
            position: 'absolute'
        }
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
        role: "gridcell"
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
        role: "button",
        ...visuallyHiddenProps,
        ...dropIndicator === null || dropIndicator === void 0 ? void 0 : dropIndicator.dropIndicatorProps,
        ref: dropIndicatorRef
    }))), /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
        ...(0, $UaDUV$reactaria.mergeProps)((0, $UaDUV$reactariautils.filterDOMProps)(props), rowProps, focusProps, hoverProps, draggableItem === null || draggableItem === void 0 ? void 0 : draggableItem.dragProps),
        ...renderProps,
        ref: ref,
        "data-selected": states.isSelected || undefined,
        "data-disabled": states.isDisabled || undefined,
        "data-hovered": isHovered || undefined,
        "data-focused": states.isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-pressed": states.isPressed || undefined,
        "data-allows-dragging": !!dragState || undefined,
        "data-dragging": isDragging || undefined,
        "data-drop-target": (dropIndicator === null || dropIndicator === void 0 ? void 0 : dropIndicator.isDropTarget) || undefined,
        "data-selection-mode": state.selectionManager.selectionMode === 'none' ? undefined : state.selectionManager.selectionMode
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
        ...gridCellProps,
        style: {
            display: 'contents'
        }
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                (0, $525402dfec7da5bc$exports.CheckboxContext),
                {
                    slots: {
                        [(0, $c5ccf687772c0422$exports.DEFAULT_SLOT)]: {},
                        selection: checkboxProps
                    }
                }
            ],
            [
                (0, $b856e6788a7ea5bf$exports.ButtonContext),
                {
                    slots: {
                        [(0, $c5ccf687772c0422$exports.DEFAULT_SLOT)]: buttonProps,
                        drag: {
                            ...draggableItem === null || draggableItem === void 0 ? void 0 : draggableItem.dragButtonProps,
                            ref: dragButtonRef,
                            style: {
                                pointerEvents: 'none'
                            }
                        }
                    }
                }
            ],
            [
                (0, $a8a589c28affdc40$exports.TextContext),
                {
                    slots: {
                        [(0, $c5ccf687772c0422$exports.DEFAULT_SLOT)]: {},
                        description: descriptionProps
                    }
                }
            ],
            [
                (0, $3114c2382242bdc0$exports.CollectionRendererContext),
                (0, $3114c2382242bdc0$exports.DefaultCollectionRenderer)
            ],
            [
                (0, $a03b42240404b420$exports.ListStateContext),
                null
            ]
        ]
    }, renderProps.children))));
});
function $132cbde493282f82$var$GridListDropIndicatorWrapper(props, ref) {
    ref = (0, $UaDUV$reactariautils.useObjectRef)(ref);
    let { dragAndDropHooks: dragAndDropHooks, dropState: dropState } = (0, $UaDUV$react.useContext)((0, $0c2289d253cb4544$exports.DragAndDropContext));
    let buttonRef = (0, $UaDUV$react.useRef)(null);
    let { dropIndicatorProps: dropIndicatorProps, isHidden: isHidden, isDropTarget: isDropTarget } = dragAndDropHooks.useDropIndicator(props, dropState, buttonRef);
    if (isHidden) return null;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement($132cbde493282f82$var$GridListDropIndicatorForwardRef, {
        ...props,
        dropIndicatorProps: dropIndicatorProps,
        isDropTarget: isDropTarget,
        buttonRef: buttonRef,
        ref: ref
    });
}
function $132cbde493282f82$var$GridListDropIndicator(props, ref) {
    let { dropIndicatorProps: dropIndicatorProps, isDropTarget: isDropTarget, buttonRef: buttonRef, ...otherProps } = props;
    let { visuallyHiddenProps: visuallyHiddenProps } = (0, $UaDUV$reactaria.useVisuallyHidden)();
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...otherProps,
        defaultClassName: 'react-aria-DropIndicator',
        values: {
            isDropTarget: isDropTarget
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
        ...renderProps,
        role: "row",
        ref: ref,
        "data-drop-target": isDropTarget || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
        role: "gridcell"
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
        ...visuallyHiddenProps,
        role: "button",
        ...dropIndicatorProps,
        ref: buttonRef
    }), renderProps.children));
}
const $132cbde493282f82$var$GridListDropIndicatorForwardRef = /*#__PURE__*/ (0, $UaDUV$react.forwardRef)($132cbde493282f82$var$GridListDropIndicator);
function $132cbde493282f82$var$RootDropIndicator() {
    let { dragAndDropHooks: dragAndDropHooks, dropState: dropState } = (0, $UaDUV$react.useContext)((0, $0c2289d253cb4544$exports.DragAndDropContext));
    let ref = (0, $UaDUV$react.useRef)(null);
    let { dropIndicatorProps: dropIndicatorProps } = dragAndDropHooks.useDropIndicator({
        target: {
            type: 'root'
        }
    }, dropState, ref);
    let isDropTarget = dropState.isDropTarget({
        type: 'root'
    });
    let { visuallyHiddenProps: visuallyHiddenProps } = (0, $UaDUV$reactaria.useVisuallyHidden)();
    if (!isDropTarget && dropIndicatorProps['aria-hidden']) return null;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
        role: "row",
        "aria-hidden": dropIndicatorProps['aria-hidden'],
        style: {
            position: 'absolute'
        }
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
        role: "gridcell"
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($UaDUV$react))).createElement("div", {
        role: "button",
        ...visuallyHiddenProps,
        ...dropIndicatorProps,
        ref: ref
    })));
}


//# sourceMappingURL=GridList.main.js.map
