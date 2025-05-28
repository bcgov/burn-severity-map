var $9XrRC$reactaria = require("react-aria");
var $9XrRC$reactstately = require("react-stately");
var $9XrRC$reactariadnd = require("@react-aria/dnd");
var $9XrRC$react = require("react");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "useDragAndDrop", () => $368d79437ab76c11$export$2cfc5be7a55829f6);
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



function $368d79437ab76c11$export$2cfc5be7a55829f6(options) {
    let dragAndDropHooks = (0, $9XrRC$react.useMemo)(()=>{
        let { onDrop: onDrop, onInsert: onInsert, onItemDrop: onItemDrop, onReorder: onReorder, onRootDrop: onRootDrop, getItems: getItems, renderDragPreview: renderDragPreview, renderDropIndicator: renderDropIndicator, dropTargetDelegate: dropTargetDelegate } = options;
        let isDraggable = !!getItems;
        let isDroppable = !!(onDrop || onInsert || onItemDrop || onReorder || onRootDrop);
        let hooks = {};
        if (isDraggable) {
            hooks.useDraggableCollectionState = function useDraggableCollectionStateOverride(props) {
                return (0, $9XrRC$reactstately.useDraggableCollectionState)({
                    ...props,
                    ...options
                });
            };
            hooks.useDraggableCollection = (0, $9XrRC$reactaria.useDraggableCollection);
            hooks.useDraggableItem = (0, $9XrRC$reactaria.useDraggableItem);
            hooks.DragPreview = (0, $9XrRC$reactaria.DragPreview);
            hooks.renderDragPreview = renderDragPreview;
            hooks.isVirtualDragging = (0, $9XrRC$reactariadnd.isVirtualDragging);
        }
        if (isDroppable) {
            hooks.useDroppableCollectionState = function useDroppableCollectionStateOverride(props) {
                return (0, $9XrRC$reactstately.useDroppableCollectionState)({
                    ...props,
                    ...options
                });
            };
            hooks.useDroppableItem = (0, $9XrRC$reactaria.useDroppableItem);
            hooks.useDroppableCollection = function useDroppableCollectionOverride(props, state, ref) {
                return (0, $9XrRC$reactaria.useDroppableCollection)({
                    ...props,
                    ...options
                }, state, ref);
            };
            hooks.useDropIndicator = (0, $9XrRC$reactaria.useDropIndicator);
            hooks.renderDropIndicator = renderDropIndicator;
            hooks.dropTargetDelegate = dropTargetDelegate;
            hooks.ListDropTargetDelegate = (0, $9XrRC$reactaria.ListDropTargetDelegate);
        }
        return hooks;
    }, [
        options
    ]);
    return {
        dragAndDropHooks: dragAndDropHooks
    };
}


//# sourceMappingURL=useDragAndDrop.main.js.map
