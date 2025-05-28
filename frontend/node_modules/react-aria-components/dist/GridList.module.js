import {ButtonContext as $d2b4bc8c273e7be6$export$24d547caef80ccd1} from "./Button.module.js";
import {CheckboxContext as $4e85f108e88277b8$export$b085522c77523c51} from "./RSPContexts.module.js";
import {CollectionRendererContext as $7135fc7d473fd974$export$4feb769f8ddf26c5, DefaultCollectionRenderer as $7135fc7d473fd974$export$a164736487e3f0ae} from "./Collection.module.js";
import {DEFAULT_SLOT as $64fa3d84918910a7$export$c62b8e45d58ddad9, Provider as $64fa3d84918910a7$export$2881499e37b75b9a, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import {DragAndDropContext as $612b8eb6cb90e02d$export$d188a835a7bc5783, DropIndicatorContext as $612b8eb6cb90e02d$export$f55761759794cf55, useDndPersistedKeys as $612b8eb6cb90e02d$export$d1e8e3fbb7461f6, useRenderDropIndicator as $612b8eb6cb90e02d$export$971707d8a129a1f7} from "./DragAndDrop.module.js";
import {ListStateContext as $eed445e0843c11d0$export$7c5906fe4f1f2af2} from "./ListBox.module.js";
import {TextContext as $514c0188e459b4c0$export$9afb8bc826b033ea} from "./Text.module.js";
import {useCollator as $jTmF7$useCollator, useLocale as $jTmF7$useLocale, ListKeyboardDelegate as $jTmF7$ListKeyboardDelegate, useGridList as $jTmF7$useGridList, useFocusRing as $jTmF7$useFocusRing, FocusScope as $jTmF7$FocusScope, mergeProps as $jTmF7$mergeProps, useGridListItem as $jTmF7$useGridListItem, useHover as $jTmF7$useHover, useGridListSelectionCheckbox as $jTmF7$useGridListSelectionCheckbox, useVisuallyHidden as $jTmF7$useVisuallyHidden} from "react-aria";
import {CollectionBuilder as $jTmF7$CollectionBuilder, Collection as $jTmF7$Collection, createLeafComponent as $jTmF7$createLeafComponent} from "@react-aria/collections";
import {useListState as $jTmF7$useListState} from "react-stately";
import {filterDOMProps as $jTmF7$filterDOMProps, useObjectRef as $jTmF7$useObjectRef} from "@react-aria/utils";
import $jTmF7$react, {createContext as $jTmF7$createContext, forwardRef as $jTmF7$forwardRef, useContext as $jTmF7$useContext, useMemo as $jTmF7$useMemo, useRef as $jTmF7$useRef, useEffect as $jTmF7$useEffect} from "react";

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











const $72e60046c03fbe42$export$54fe942636b6416d = /*#__PURE__*/ (0, $jTmF7$createContext)(null);
const $72e60046c03fbe42$export$a7bfbda1311ca015 = /*#__PURE__*/ (0, $jTmF7$forwardRef)(function GridList(props, ref) {
    // Render the portal first so that we have the collection by the time we render the DOM in SSR.
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $72e60046c03fbe42$export$54fe942636b6416d);
    return /*#__PURE__*/ (0, $jTmF7$react).createElement((0, $jTmF7$CollectionBuilder), {
        content: /*#__PURE__*/ (0, $jTmF7$react).createElement((0, $jTmF7$Collection), props)
    }, (collection)=>/*#__PURE__*/ (0, $jTmF7$react).createElement($72e60046c03fbe42$var$GridListInner, {
            props: props,
            collection: collection,
            gridListRef: ref
        }));
});
function $72e60046c03fbe42$var$GridListInner({ props: props, collection: collection, gridListRef: ref }) {
    let { dragAndDropHooks: dragAndDropHooks, keyboardNavigationBehavior: keyboardNavigationBehavior = 'arrow', layout: layout = 'stack' } = props;
    let { CollectionRoot: CollectionRoot, isVirtualized: isVirtualized, layoutDelegate: layoutDelegate, dropTargetDelegate: ctxDropTargetDelegate } = (0, $jTmF7$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    let state = (0, $jTmF7$useListState)({
        ...props,
        collection: collection,
        children: undefined,
        layoutDelegate: layoutDelegate
    });
    let collator = (0, $jTmF7$useCollator)({
        usage: 'search',
        sensitivity: 'base'
    });
    let { disabledBehavior: disabledBehavior, disabledKeys: disabledKeys } = state.selectionManager;
    let { direction: direction } = (0, $jTmF7$useLocale)();
    let keyboardDelegate = (0, $jTmF7$useMemo)(()=>new (0, $jTmF7$ListKeyboardDelegate)({
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
    let { gridProps: gridProps } = (0, $jTmF7$useGridList)({
        ...props,
        keyboardDelegate: keyboardDelegate,
        // Only tab navigation is supported in grid layout.
        keyboardNavigationBehavior: layout === 'grid' ? 'tab' : keyboardNavigationBehavior,
        isVirtualized: isVirtualized
    }, state, ref);
    let selectionManager = state.selectionManager;
    let isListDraggable = !!(dragAndDropHooks === null || dragAndDropHooks === void 0 ? void 0 : dragAndDropHooks.useDraggableCollectionState);
    let isListDroppable = !!(dragAndDropHooks === null || dragAndDropHooks === void 0 ? void 0 : dragAndDropHooks.useDroppableCollectionState);
    let dragHooksProvided = (0, $jTmF7$useRef)(isListDraggable);
    let dropHooksProvided = (0, $jTmF7$useRef)(isListDroppable);
    (0, $jTmF7$useEffect)(()=>{
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
    let preview = (0, $jTmF7$useRef)(null);
    if (isListDraggable && dragAndDropHooks) {
        dragState = dragAndDropHooks.useDraggableCollectionState({
            collection: collection,
            selectionManager: selectionManager,
            preview: dragAndDropHooks.renderDragPreview ? preview : undefined
        });
        dragAndDropHooks.useDraggableCollection({}, dragState, ref);
        let DragPreview = dragAndDropHooks.DragPreview;
        dragPreview = dragAndDropHooks.renderDragPreview ? /*#__PURE__*/ (0, $jTmF7$react).createElement(DragPreview, {
            ref: preview
        }, dragAndDropHooks.renderDragPreview) : null;
    }
    if (isListDroppable && dragAndDropHooks) {
        dropState = dragAndDropHooks.useDroppableCollectionState({
            collection: collection,
            selectionManager: selectionManager
        });
        let keyboardDelegate = new (0, $jTmF7$ListKeyboardDelegate)({
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
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $jTmF7$useFocusRing)();
    let renderValues = {
        isDropTarget: isRootDropTarget,
        isEmpty: state.collection.size === 0,
        isFocused: isFocused,
        isFocusVisible: isFocusVisible,
        layout: layout,
        state: state
    };
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        className: props.className,
        style: props.style,
        defaultClassName: 'react-aria-GridList',
        values: renderValues
    });
    let emptyState = null;
    let emptyStatePropOverrides = null;
    if (state.collection.size === 0 && props.renderEmptyState) {
        let content = props.renderEmptyState(renderValues);
        emptyState = /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
            role: "row",
            style: {
                display: 'contents'
            }
        }, /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
            role: "gridcell",
            style: {
                display: 'contents'
            }
        }, content));
    }
    return /*#__PURE__*/ (0, $jTmF7$react).createElement((0, $jTmF7$FocusScope), null, /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
        ...(0, $jTmF7$filterDOMProps)(props),
        ...renderProps,
        ...(0, $jTmF7$mergeProps)(gridProps, focusProps, droppableCollection === null || droppableCollection === void 0 ? void 0 : droppableCollection.collectionProps, emptyStatePropOverrides),
        ref: ref,
        slot: props.slot || undefined,
        onScroll: props.onScroll,
        "data-drop-target": isRootDropTarget || undefined,
        "data-empty": state.collection.size === 0 || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-layout": layout
    }, /*#__PURE__*/ (0, $jTmF7$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                (0, $eed445e0843c11d0$export$7c5906fe4f1f2af2),
                state
            ],
            [
                (0, $612b8eb6cb90e02d$export$d188a835a7bc5783),
                {
                    dragAndDropHooks: dragAndDropHooks,
                    dragState: dragState,
                    dropState: dropState
                }
            ],
            [
                (0, $612b8eb6cb90e02d$export$f55761759794cf55),
                {
                    render: $72e60046c03fbe42$var$GridListDropIndicatorWrapper
                }
            ]
        ]
    }, isListDroppable && /*#__PURE__*/ (0, $jTmF7$react).createElement($72e60046c03fbe42$var$RootDropIndicator, null), /*#__PURE__*/ (0, $jTmF7$react).createElement(CollectionRoot, {
        collection: collection,
        scrollRef: ref,
        persistedKeys: (0, $612b8eb6cb90e02d$export$d1e8e3fbb7461f6)(selectionManager, dragAndDropHooks, dropState),
        renderDropIndicator: (0, $612b8eb6cb90e02d$export$971707d8a129a1f7)(dragAndDropHooks, dropState)
    })), emptyState, dragPreview));
}
const $72e60046c03fbe42$export$e96fc9a8407faa6b = /*#__PURE__*/ (0, $jTmF7$createLeafComponent)('item', function GridListItem(props, forwardedRef, item) {
    let state = (0, $jTmF7$useContext)((0, $eed445e0843c11d0$export$7c5906fe4f1f2af2));
    let { dragAndDropHooks: dragAndDropHooks, dragState: dragState, dropState: dropState } = (0, $jTmF7$useContext)((0, $612b8eb6cb90e02d$export$d188a835a7bc5783));
    let ref = (0, $jTmF7$useObjectRef)(forwardedRef);
    let { isVirtualized: isVirtualized } = (0, $jTmF7$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    let { rowProps: rowProps, gridCellProps: gridCellProps, descriptionProps: descriptionProps, ...states } = (0, $jTmF7$useGridListItem)({
        node: item,
        shouldSelectOnPressUp: !!dragState,
        isVirtualized: isVirtualized
    }, state, ref);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $jTmF7$useHover)({
        isDisabled: !states.allowsSelection && !states.hasAction,
        onHoverStart: item.props.onHoverStart,
        onHoverChange: item.props.onHoverChange,
        onHoverEnd: item.props.onHoverEnd
    });
    let { isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $jTmF7$useFocusRing)();
    let { checkboxProps: checkboxProps } = (0, $jTmF7$useGridListSelectionCheckbox)({
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
    let dropIndicatorRef = (0, $jTmF7$useRef)(null);
    let { visuallyHiddenProps: visuallyHiddenProps } = (0, $jTmF7$useVisuallyHidden)();
    if (dropState && dragAndDropHooks) dropIndicator = dragAndDropHooks.useDropIndicator({
        target: {
            type: 'item',
            key: item.key,
            dropPosition: 'on'
        }
    }, dropState, dropIndicatorRef);
    let isDragging = dragState && dragState.isDragging(item.key);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
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
    let dragButtonRef = (0, $jTmF7$useRef)(null);
    (0, $jTmF7$useEffect)(()=>{
        if (dragState && !dragButtonRef.current) console.warn('Draggable items in a GridList must contain a <Button slot="drag"> element so that keyboard and screen reader users can drag them.');
    // eslint-disable-next-line
    }, []);
    (0, $jTmF7$useEffect)(()=>{
        if (!item.textValue) console.warn('A `textValue` prop is required for <GridListItem> elements with non-plain text children in order to support accessibility features such as type to select.');
    }, [
        item.textValue
    ]);
    return /*#__PURE__*/ (0, $jTmF7$react).createElement((0, $jTmF7$react).Fragment, null, dropIndicator && !dropIndicator.isHidden && /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
        role: "row",
        style: {
            position: 'absolute'
        }
    }, /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
        role: "gridcell"
    }, /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
        role: "button",
        ...visuallyHiddenProps,
        ...dropIndicator === null || dropIndicator === void 0 ? void 0 : dropIndicator.dropIndicatorProps,
        ref: dropIndicatorRef
    }))), /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
        ...(0, $jTmF7$mergeProps)((0, $jTmF7$filterDOMProps)(props), rowProps, focusProps, hoverProps, draggableItem === null || draggableItem === void 0 ? void 0 : draggableItem.dragProps),
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
    }, /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
        ...gridCellProps,
        style: {
            display: 'contents'
        }
    }, /*#__PURE__*/ (0, $jTmF7$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                (0, $4e85f108e88277b8$export$b085522c77523c51),
                {
                    slots: {
                        [(0, $64fa3d84918910a7$export$c62b8e45d58ddad9)]: {},
                        selection: checkboxProps
                    }
                }
            ],
            [
                (0, $d2b4bc8c273e7be6$export$24d547caef80ccd1),
                {
                    slots: {
                        [(0, $64fa3d84918910a7$export$c62b8e45d58ddad9)]: buttonProps,
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
                (0, $514c0188e459b4c0$export$9afb8bc826b033ea),
                {
                    slots: {
                        [(0, $64fa3d84918910a7$export$c62b8e45d58ddad9)]: {},
                        description: descriptionProps
                    }
                }
            ],
            [
                (0, $7135fc7d473fd974$export$4feb769f8ddf26c5),
                (0, $7135fc7d473fd974$export$a164736487e3f0ae)
            ],
            [
                (0, $eed445e0843c11d0$export$7c5906fe4f1f2af2),
                null
            ]
        ]
    }, renderProps.children))));
});
function $72e60046c03fbe42$var$GridListDropIndicatorWrapper(props, ref) {
    ref = (0, $jTmF7$useObjectRef)(ref);
    let { dragAndDropHooks: dragAndDropHooks, dropState: dropState } = (0, $jTmF7$useContext)((0, $612b8eb6cb90e02d$export$d188a835a7bc5783));
    let buttonRef = (0, $jTmF7$useRef)(null);
    let { dropIndicatorProps: dropIndicatorProps, isHidden: isHidden, isDropTarget: isDropTarget } = dragAndDropHooks.useDropIndicator(props, dropState, buttonRef);
    if (isHidden) return null;
    return /*#__PURE__*/ (0, $jTmF7$react).createElement($72e60046c03fbe42$var$GridListDropIndicatorForwardRef, {
        ...props,
        dropIndicatorProps: dropIndicatorProps,
        isDropTarget: isDropTarget,
        buttonRef: buttonRef,
        ref: ref
    });
}
function $72e60046c03fbe42$var$GridListDropIndicator(props, ref) {
    let { dropIndicatorProps: dropIndicatorProps, isDropTarget: isDropTarget, buttonRef: buttonRef, ...otherProps } = props;
    let { visuallyHiddenProps: visuallyHiddenProps } = (0, $jTmF7$useVisuallyHidden)();
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...otherProps,
        defaultClassName: 'react-aria-DropIndicator',
        values: {
            isDropTarget: isDropTarget
        }
    });
    return /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
        ...renderProps,
        role: "row",
        ref: ref,
        "data-drop-target": isDropTarget || undefined
    }, /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
        role: "gridcell"
    }, /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
        ...visuallyHiddenProps,
        role: "button",
        ...dropIndicatorProps,
        ref: buttonRef
    }), renderProps.children));
}
const $72e60046c03fbe42$var$GridListDropIndicatorForwardRef = /*#__PURE__*/ (0, $jTmF7$forwardRef)($72e60046c03fbe42$var$GridListDropIndicator);
function $72e60046c03fbe42$var$RootDropIndicator() {
    let { dragAndDropHooks: dragAndDropHooks, dropState: dropState } = (0, $jTmF7$useContext)((0, $612b8eb6cb90e02d$export$d188a835a7bc5783));
    let ref = (0, $jTmF7$useRef)(null);
    let { dropIndicatorProps: dropIndicatorProps } = dragAndDropHooks.useDropIndicator({
        target: {
            type: 'root'
        }
    }, dropState, ref);
    let isDropTarget = dropState.isDropTarget({
        type: 'root'
    });
    let { visuallyHiddenProps: visuallyHiddenProps } = (0, $jTmF7$useVisuallyHidden)();
    if (!isDropTarget && dropIndicatorProps['aria-hidden']) return null;
    return /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
        role: "row",
        "aria-hidden": dropIndicatorProps['aria-hidden'],
        style: {
            position: 'absolute'
        }
    }, /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
        role: "gridcell"
    }, /*#__PURE__*/ (0, $jTmF7$react).createElement("div", {
        role: "button",
        ...visuallyHiddenProps,
        ...dropIndicatorProps,
        ref: ref
    })));
}


export {$72e60046c03fbe42$export$54fe942636b6416d as GridListContext, $72e60046c03fbe42$export$a7bfbda1311ca015 as GridList, $72e60046c03fbe42$export$e96fc9a8407faa6b as GridListItem};
//# sourceMappingURL=GridList.module.js.map
