var $b856e6788a7ea5bf$exports = require("./Button.main.js");
var $3114c2382242bdc0$exports = require("./Collection.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $84ae0bf5bd8e2a5f$exports = require("./Label.main.js");
var $a03b42240404b420$exports = require("./ListBox.main.js");
var $a8a589c28affdc40$exports = require("./Text.main.js");
var $4TsYs$reactaria = require("react-aria");
var $4TsYs$reactariacollections = require("@react-aria/collections");
var $4TsYs$reactariautils = require("@react-aria/utils");
var $4TsYs$reactstately = require("react-stately");
var $4TsYs$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "TagGroupContext", () => $ecf55d0c218a575e$export$5b07b5dd2cbd96e3);
$parcel$export(module.exports, "TagListContext", () => $ecf55d0c218a575e$export$e755ce3685dd0ca9);
$parcel$export(module.exports, "TagGroup", () => $ecf55d0c218a575e$export$67ea30858aaf75e3);
$parcel$export(module.exports, "TagList", () => $ecf55d0c218a575e$export$f9fef0f55402315b);
$parcel$export(module.exports, "Tag", () => $ecf55d0c218a575e$export$3288d34c523a1192);
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










const $ecf55d0c218a575e$export$5b07b5dd2cbd96e3 = /*#__PURE__*/ (0, $4TsYs$react.createContext)(null);
const $ecf55d0c218a575e$export$e755ce3685dd0ca9 = /*#__PURE__*/ (0, $4TsYs$react.createContext)(null);
const $ecf55d0c218a575e$export$67ea30858aaf75e3 = /*#__PURE__*/ (0, $4TsYs$react.forwardRef)(function TagGroup(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $ecf55d0c218a575e$export$5b07b5dd2cbd96e3);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($4TsYs$react))).createElement((0, $4TsYs$reactariacollections.CollectionBuilder), {
        content: props.children
    }, (collection)=>/*#__PURE__*/ (0, ($parcel$interopDefault($4TsYs$react))).createElement($ecf55d0c218a575e$var$TagGroupInner, {
            props: props,
            forwardedRef: ref,
            collection: collection
        }));
});
function $ecf55d0c218a575e$var$TagGroupInner({ props: props, forwardedRef: ref, collection: collection }) {
    let tagListRef = (0, $4TsYs$react.useRef)(null);
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let state = (0, $4TsYs$reactstately.useListState)({
        ...props,
        children: undefined,
        collection: collection
    });
    // Prevent DOM props from going to two places.
    let domProps = (0, $4TsYs$reactariautils.filterDOMProps)(props);
    let domPropOverrides = Object.fromEntries(Object.entries(domProps).map(([k])=>[
            k,
            undefined
        ]));
    let { gridProps: gridProps, labelProps: labelProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps } = (0, $4TsYs$reactaria.useTagGroup)({
        ...props,
        ...domPropOverrides,
        label: label
    }, state, tagListRef);
    var _props_className;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($4TsYs$react))).createElement("div", {
        ...domProps,
        ref: ref,
        slot: props.slot || undefined,
        className: (_props_className = props.className) !== null && _props_className !== void 0 ? _props_className : 'react-aria-TagGroup',
        style: props.style
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($4TsYs$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                (0, $84ae0bf5bd8e2a5f$exports.LabelContext),
                {
                    ...labelProps,
                    elementType: 'span',
                    ref: labelRef
                }
            ],
            [
                $ecf55d0c218a575e$export$e755ce3685dd0ca9,
                {
                    ...gridProps,
                    ref: tagListRef
                }
            ],
            [
                (0, $a03b42240404b420$exports.ListStateContext),
                state
            ],
            [
                (0, $a8a589c28affdc40$exports.TextContext),
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
const $ecf55d0c218a575e$export$f9fef0f55402315b = /*#__PURE__*/ (0, $4TsYs$react.forwardRef)(function TagList(props, ref) {
    let state = (0, $4TsYs$react.useContext)((0, $a03b42240404b420$exports.ListStateContext));
    return state ? /*#__PURE__*/ (0, ($parcel$interopDefault($4TsYs$react))).createElement($ecf55d0c218a575e$var$TagListInner, {
        props: props,
        forwardedRef: ref
    }) : /*#__PURE__*/ (0, ($parcel$interopDefault($4TsYs$react))).createElement((0, $4TsYs$reactariacollections.Collection), props);
});
function $ecf55d0c218a575e$var$TagListInner({ props: props, forwardedRef: forwardedRef }) {
    let state = (0, $4TsYs$react.useContext)((0, $a03b42240404b420$exports.ListStateContext));
    let { CollectionRoot: CollectionRoot } = (0, $4TsYs$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    let [gridProps, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, forwardedRef, $ecf55d0c218a575e$export$e755ce3685dd0ca9);
    delete gridProps.items;
    delete gridProps.renderEmptyState;
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $4TsYs$reactaria.useFocusRing)();
    let renderValues = {
        isEmpty: state.collection.size === 0,
        isFocused: isFocused,
        isFocusVisible: isFocusVisible,
        state: state
    };
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        className: props.className,
        style: props.style,
        defaultClassName: 'react-aria-TagList',
        values: renderValues
    });
    let persistedKeys = (0, $3114c2382242bdc0$exports.usePersistedKeys)(state.selectionManager.focusedKey);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($4TsYs$react))).createElement("div", {
        ...(0, $4TsYs$reactariautils.mergeProps)(gridProps, focusProps),
        ...renderProps,
        ref: ref,
        "data-empty": state.collection.size === 0 || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined
    }, state.collection.size === 0 && props.renderEmptyState ? props.renderEmptyState(renderValues) : /*#__PURE__*/ (0, ($parcel$interopDefault($4TsYs$react))).createElement(CollectionRoot, {
        collection: state.collection,
        persistedKeys: persistedKeys
    }));
}
const $ecf55d0c218a575e$export$3288d34c523a1192 = /*#__PURE__*/ (0, $4TsYs$reactariacollections.createLeafComponent)('item', (props, forwardedRef, item)=>{
    let state = (0, $4TsYs$react.useContext)((0, $a03b42240404b420$exports.ListStateContext));
    let ref = (0, $4TsYs$reactariautils.useObjectRef)(forwardedRef);
    let { focusProps: focusProps, isFocusVisible: isFocusVisible } = (0, $4TsYs$reactaria.useFocusRing)({
        within: true
    });
    let { rowProps: rowProps, gridCellProps: gridCellProps, removeButtonProps: removeButtonProps, ...states } = (0, $4TsYs$reactaria.useTag)({
        item: item
    }, state, ref);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $4TsYs$reactaria.useHover)({
        isDisabled: !states.allowsSelection,
        onHoverStart: item.props.onHoverStart,
        onHoverChange: item.props.onHoverChange,
        onHoverEnd: item.props.onHoverEnd
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    (0, $4TsYs$react.useEffect)(()=>{
        if (!item.textValue) console.warn('A `textValue` prop is required for <Tag> elements with non-plain text children for accessibility.');
    }, [
        item.textValue
    ]);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($4TsYs$react))).createElement("div", {
        ref: ref,
        ...renderProps,
        ...(0, $4TsYs$reactariautils.mergeProps)((0, $4TsYs$reactariautils.filterDOMProps)(props), rowProps, focusProps, hoverProps),
        "data-selected": states.isSelected || undefined,
        "data-disabled": states.isDisabled || undefined,
        "data-hovered": isHovered || undefined,
        "data-focused": states.isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-pressed": states.isPressed || undefined,
        "data-allows-removing": states.allowsRemoving || undefined,
        "data-selection-mode": state.selectionManager.selectionMode === 'none' ? undefined : state.selectionManager.selectionMode
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($4TsYs$react))).createElement("div", {
        ...gridCellProps,
        style: {
            display: 'contents'
        }
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($4TsYs$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                (0, $b856e6788a7ea5bf$exports.ButtonContext),
                {
                    slots: {
                        remove: removeButtonProps
                    }
                }
            ],
            [
                (0, $3114c2382242bdc0$exports.CollectionRendererContext),
                (0, $3114c2382242bdc0$exports.DefaultCollectionRenderer)
            ]
        ]
    }, renderProps.children)));
});


//# sourceMappingURL=TagGroup.main.js.map
