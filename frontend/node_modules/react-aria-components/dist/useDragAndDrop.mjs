import {useDraggableCollection as $fvh6P$useDraggableCollection, useDraggableItem as $fvh6P$useDraggableItem, DragPreview as $fvh6P$DragPreview, useDroppableItem as $fvh6P$useDroppableItem, useDroppableCollection as $fvh6P$useDroppableCollection, useDropIndicator as $fvh6P$useDropIndicator, ListDropTargetDelegate as $fvh6P$ListDropTargetDelegate} from "react-aria";
import {useDraggableCollectionState as $fvh6P$useDraggableCollectionState, useDroppableCollectionState as $fvh6P$useDroppableCollectionState} from "react-stately";
import {isVirtualDragging as $fvh6P$isVirtualDragging} from "@react-aria/dnd";
import {useMemo as $fvh6P$useMemo} from "react";

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



function $d8f176866e6dc039$export$2cfc5be7a55829f6(options) {
    let dragAndDropHooks = (0, $fvh6P$useMemo)(()=>{
        let { onDrop: onDrop, onInsert: onInsert, onItemDrop: onItemDrop, onReorder: onReorder, onRootDrop: onRootDrop, getItems: getItems, renderDragPreview: renderDragPreview, renderDropIndicator: renderDropIndicator, dropTargetDelegate: dropTargetDelegate } = options;
        let isDraggable = !!getItems;
        let isDroppable = !!(onDrop || onInsert || onItemDrop || onReorder || onRootDrop);
        let hooks = {};
        if (isDraggable) {
            hooks.useDraggableCollectionState = function useDraggableCollectionStateOverride(props) {
                return (0, $fvh6P$useDraggableCollectionState)({
                    ...props,
                    ...options
                });
            };
            hooks.useDraggableCollection = (0, $fvh6P$useDraggableCollection);
            hooks.useDraggableItem = (0, $fvh6P$useDraggableItem);
            hooks.DragPreview = (0, $fvh6P$DragPreview);
            hooks.renderDragPreview = renderDragPreview;
            hooks.isVirtualDragging = (0, $fvh6P$isVirtualDragging);
        }
        if (isDroppable) {
            hooks.useDroppableCollectionState = function useDroppableCollectionStateOverride(props) {
                return (0, $fvh6P$useDroppableCollectionState)({
                    ...props,
                    ...options
                });
            };
            hooks.useDroppableItem = (0, $fvh6P$useDroppableItem);
            hooks.useDroppableCollection = function useDroppableCollectionOverride(props, state, ref) {
                return (0, $fvh6P$useDroppableCollection)({
                    ...props,
                    ...options
                }, state, ref);
            };
            hooks.useDropIndicator = (0, $fvh6P$useDropIndicator);
            hooks.renderDropIndicator = renderDropIndicator;
            hooks.dropTargetDelegate = dropTargetDelegate;
            hooks.ListDropTargetDelegate = (0, $fvh6P$ListDropTargetDelegate);
        }
        return hooks;
    }, [
        options
    ]);
    return {
        dragAndDropHooks: dragAndDropHooks
    };
}


export {$d8f176866e6dc039$export$2cfc5be7a55829f6 as useDragAndDrop};
//# sourceMappingURL=useDragAndDrop.module.js.map
