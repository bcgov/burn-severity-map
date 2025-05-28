import {ButtonContext as $d2b4bc8c273e7be6$export$24d547caef80ccd1} from "./Button.module.js";
import {CollectionRendererContext as $7135fc7d473fd974$export$4feb769f8ddf26c5, DefaultCollectionRenderer as $7135fc7d473fd974$export$a164736487e3f0ae, usePersistedKeys as $7135fc7d473fd974$export$90e00781bc59d8f9} from "./Collection.module.js";
import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3, useSlot as $64fa3d84918910a7$export$9d4c57ee4c6ffdd8} from "./utils.module.js";
import {LabelContext as $01b77f81d0f07f68$export$75b6ee27786ba447} from "./Label.module.js";
import {ListStateContext as $eed445e0843c11d0$export$7c5906fe4f1f2af2} from "./ListBox.module.js";
import {TextContext as $514c0188e459b4c0$export$9afb8bc826b033ea} from "./Text.module.js";
import {useTagGroup as $7lruP$useTagGroup, useFocusRing as $7lruP$useFocusRing, useTag as $7lruP$useTag, useHover as $7lruP$useHover} from "react-aria";
import {CollectionBuilder as $7lruP$CollectionBuilder, Collection as $7lruP$Collection, createLeafComponent as $7lruP$createLeafComponent} from "@react-aria/collections";
import {filterDOMProps as $7lruP$filterDOMProps, mergeProps as $7lruP$mergeProps, useObjectRef as $7lruP$useObjectRef} from "@react-aria/utils";
import {useListState as $7lruP$useListState} from "react-stately";
import $7lruP$react, {createContext as $7lruP$createContext, forwardRef as $7lruP$forwardRef, useRef as $7lruP$useRef, useContext as $7lruP$useContext, useEffect as $7lruP$useEffect} from "react";

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










const $eaf9e70818b436db$export$5b07b5dd2cbd96e3 = /*#__PURE__*/ (0, $7lruP$createContext)(null);
const $eaf9e70818b436db$export$e755ce3685dd0ca9 = /*#__PURE__*/ (0, $7lruP$createContext)(null);
const $eaf9e70818b436db$export$67ea30858aaf75e3 = /*#__PURE__*/ (0, $7lruP$forwardRef)(function TagGroup(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $eaf9e70818b436db$export$5b07b5dd2cbd96e3);
    return /*#__PURE__*/ (0, $7lruP$react).createElement((0, $7lruP$CollectionBuilder), {
        content: props.children
    }, (collection)=>/*#__PURE__*/ (0, $7lruP$react).createElement($eaf9e70818b436db$var$TagGroupInner, {
            props: props,
            forwardedRef: ref,
            collection: collection
        }));
});
function $eaf9e70818b436db$var$TagGroupInner({ props: props, forwardedRef: ref, collection: collection }) {
    let tagListRef = (0, $7lruP$useRef)(null);
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let state = (0, $7lruP$useListState)({
        ...props,
        children: undefined,
        collection: collection
    });
    // Prevent DOM props from going to two places.
    let domProps = (0, $7lruP$filterDOMProps)(props);
    let domPropOverrides = Object.fromEntries(Object.entries(domProps).map(([k])=>[
            k,
            undefined
        ]));
    let { gridProps: gridProps, labelProps: labelProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps } = (0, $7lruP$useTagGroup)({
        ...props,
        ...domPropOverrides,
        label: label
    }, state, tagListRef);
    var _props_className;
    return /*#__PURE__*/ (0, $7lruP$react).createElement("div", {
        ...domProps,
        ref: ref,
        slot: props.slot || undefined,
        className: (_props_className = props.className) !== null && _props_className !== void 0 ? _props_className : 'react-aria-TagGroup',
        style: props.style
    }, /*#__PURE__*/ (0, $7lruP$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                (0, $01b77f81d0f07f68$export$75b6ee27786ba447),
                {
                    ...labelProps,
                    elementType: 'span',
                    ref: labelRef
                }
            ],
            [
                $eaf9e70818b436db$export$e755ce3685dd0ca9,
                {
                    ...gridProps,
                    ref: tagListRef
                }
            ],
            [
                (0, $eed445e0843c11d0$export$7c5906fe4f1f2af2),
                state
            ],
            [
                (0, $514c0188e459b4c0$export$9afb8bc826b033ea),
                {
                    slots: {
                        description: descriptionProps,
                        errorMessage: errorMessageProps
                    }
                }
            ]
        ]
    }, props.children));
}
const $eaf9e70818b436db$export$f9fef0f55402315b = /*#__PURE__*/ (0, $7lruP$forwardRef)(function TagList(props, ref) {
    let state = (0, $7lruP$useContext)((0, $eed445e0843c11d0$export$7c5906fe4f1f2af2));
    return state ? /*#__PURE__*/ (0, $7lruP$react).createElement($eaf9e70818b436db$var$TagListInner, {
        props: props,
        forwardedRef: ref
    }) : /*#__PURE__*/ (0, $7lruP$react).createElement((0, $7lruP$Collection), props);
});
function $eaf9e70818b436db$var$TagListInner({ props: props, forwardedRef: forwardedRef }) {
    let state = (0, $7lruP$useContext)((0, $eed445e0843c11d0$export$7c5906fe4f1f2af2));
    let { CollectionRoot: CollectionRoot } = (0, $7lruP$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    let [gridProps, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, forwardedRef, $eaf9e70818b436db$export$e755ce3685dd0ca9);
    delete gridProps.items;
    delete gridProps.renderEmptyState;
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $7lruP$useFocusRing)();
    let renderValues = {
        isEmpty: state.collection.size === 0,
        isFocused: isFocused,
        isFocusVisible: isFocusVisible,
        state: state
    };
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        className: props.className,
        style: props.style,
        defaultClassName: 'react-aria-TagList',
        values: renderValues
    });
    let persistedKeys = (0, $7135fc7d473fd974$export$90e00781bc59d8f9)(state.selectionManager.focusedKey);
    return /*#__PURE__*/ (0, $7lruP$react).createElement("div", {
        ...(0, $7lruP$mergeProps)(gridProps, focusProps),
        ...renderProps,
        ref: ref,
        "data-empty": state.collection.size === 0 || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined
    }, state.collection.size === 0 && props.renderEmptyState ? props.renderEmptyState(renderValues) : /*#__PURE__*/ (0, $7lruP$react).createElement(CollectionRoot, {
        collection: state.collection,
        persistedKeys: persistedKeys
    }));
}
const $eaf9e70818b436db$export$3288d34c523a1192 = /*#__PURE__*/ (0, $7lruP$createLeafComponent)('item', (props, forwardedRef, item)=>{
    let state = (0, $7lruP$useContext)((0, $eed445e0843c11d0$export$7c5906fe4f1f2af2));
    let ref = (0, $7lruP$useObjectRef)(forwardedRef);
    let { focusProps: focusProps, isFocusVisible: isFocusVisible } = (0, $7lruP$useFocusRing)({
        within: true
    });
    let { rowProps: rowProps, gridCellProps: gridCellProps, removeButtonProps: removeButtonProps, ...states } = (0, $7lruP$useTag)({
        item: item
    }, state, ref);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $7lruP$useHover)({
        isDisabled: !states.allowsSelection,
        onHoverStart: item.props.onHoverStart,
        onHoverChange: item.props.onHoverChange,
        onHoverEnd: item.props.onHoverEnd
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        id: undefined,
        children: item.rendered,
        defaultClassName: 'react-aria-Tag',
        values: {
            ...states,
            isFocusVisible: isFocusVisible,
            isHovered: isHovered,
            selectionMode: state.selectionManager.selectionMode,
            selectionBehavior: state.selectionManager.selectionBehavior
        }
    });
    (0, $7lruP$useEffect)(()=>{
        if (!item.textValue) console.warn('A `textValue` prop is required for <Tag> elements with non-plain text children for accessibility.');
    }, [
        item.textValue
    ]);
    return /*#__PURE__*/ (0, $7lruP$react).createElement("div", {
        ref: ref,
        ...renderProps,
        ...(0, $7lruP$mergeProps)((0, $7lruP$filterDOMProps)(props), rowProps, focusProps, hoverProps),
        "data-selected": states.isSelected || undefined,
        "data-disabled": states.isDisabled || undefined,
        "data-hovered": isHovered || undefined,
        "data-focused": states.isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-pressed": states.isPressed || undefined,
        "data-allows-removing": states.allowsRemoving || undefined,
        "data-selection-mode": state.selectionManager.selectionMode === 'none' ? undefined : state.selectionManager.selectionMode
    }, /*#__PURE__*/ (0, $7lruP$react).createElement("div", {
        ...gridCellProps,
        style: {
            display: 'contents'
        }
    }, /*#__PURE__*/ (0, $7lruP$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                (0, $d2b4bc8c273e7be6$export$24d547caef80ccd1),
                {
                    slots: {
                        remove: removeButtonProps
                    }
                }
            ],
            [
                (0, $7135fc7d473fd974$export$4feb769f8ddf26c5),
                (0, $7135fc7d473fd974$export$a164736487e3f0ae)
            ]
        ]
    }, renderProps.children)));
});


export {$eaf9e70818b436db$export$5b07b5dd2cbd96e3 as TagGroupContext, $eaf9e70818b436db$export$e755ce3685dd0ca9 as TagListContext, $eaf9e70818b436db$export$67ea30858aaf75e3 as TagGroup, $eaf9e70818b436db$export$f9fef0f55402315b as TagList, $eaf9e70818b436db$export$3288d34c523a1192 as Tag};
//# sourceMappingURL=TagGroup.module.js.map
