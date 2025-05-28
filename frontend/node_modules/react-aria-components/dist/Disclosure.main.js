var $b856e6788a7ea5bf$exports = require("./Button.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $8afVX$reactariadisclosure = require("@react-aria/disclosure");
var $8afVX$reactstatelydisclosure = require("@react-stately/disclosure");
var $8afVX$reactariautils = require("@react-aria/utils");
var $8afVX$react = require("react");
var $8afVX$reactaria = require("react-aria");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "DisclosureGroupStateContext", () => $11c780105231f6ef$export$1d40e3e0cc4d5de);
$parcel$export(module.exports, "DisclosureGroup", () => $11c780105231f6ef$export$944aceb4f8c89f10);
$parcel$export(module.exports, "DisclosureContext", () => $11c780105231f6ef$export$d665dd135a51b28a);
$parcel$export(module.exports, "DisclosureStateContext", () => $11c780105231f6ef$export$dab3ea4a6ef094da);
$parcel$export(module.exports, "Disclosure", () => $11c780105231f6ef$export$74a362b31437ec83);
$parcel$export(module.exports, "DisclosurePanel", () => $11c780105231f6ef$export$feabaa331e1d464c);
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






const $11c780105231f6ef$export$1d40e3e0cc4d5de = /*#__PURE__*/ (0, $8afVX$react.createContext)(null);
const $11c780105231f6ef$export$944aceb4f8c89f10 = /*#__PURE__*/ (0, $8afVX$react.forwardRef)(function DisclosureGroup(props, ref) {
    let state = (0, $8afVX$reactstatelydisclosure.useDisclosureGroupState)(props);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-DisclosureGroup',
        values: {
            isDisabled: state.isDisabled,
            state: state
        }
    });
    let domProps = (0, $8afVX$reactariautils.filterDOMProps)(props);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($8afVX$react))).createElement("div", {
        ...domProps,
        ...renderProps,
        ref: ref,
        "data-disabled": props.isDisabled || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($8afVX$react))).createElement($11c780105231f6ef$export$1d40e3e0cc4d5de.Provider, {
        value: state
    }, renderProps.children));
});
const $11c780105231f6ef$export$d665dd135a51b28a = /*#__PURE__*/ (0, $8afVX$react.createContext)(null);
const $11c780105231f6ef$export$dab3ea4a6ef094da = /*#__PURE__*/ (0, $8afVX$react.createContext)(null);
const $11c780105231f6ef$var$InternalDisclosureContext = /*#__PURE__*/ (0, $8afVX$react.createContext)(null);
const $11c780105231f6ef$export$74a362b31437ec83 = /*#__PURE__*/ (0, $8afVX$react.forwardRef)(function Disclosure(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $11c780105231f6ef$export$d665dd135a51b28a);
    let groupState = (0, $8afVX$react.useContext)($11c780105231f6ef$export$1d40e3e0cc4d5de);
    let { id: id, ...otherProps } = props;
    // Generate an id if one wasn't provided.
    // (can't pass id into useId since it can also be a number)
    let defaultId = (0, $8afVX$reactariautils.useId)();
    id || (id = defaultId);
    let isExpanded = groupState ? groupState.expandedKeys.has(id) : props.isExpanded;
    let state = (0, $8afVX$reactstatelydisclosure.useDisclosureState)({
        ...props,
        isExpanded: isExpanded,
        onExpandedChange (isExpanded) {
            var _props_onExpandedChange;
            if (groupState) groupState.toggleKey(id);
            (_props_onExpandedChange = props.onExpandedChange) === null || _props_onExpandedChange === void 0 ? void 0 : _props_onExpandedChange.call(props, isExpanded);
        }
    });
    let panelRef = (0, ($parcel$interopDefault($8afVX$react))).useRef(null);
    let isDisabled = props.isDisabled || (groupState === null || groupState === void 0 ? void 0 : groupState.isDisabled) || false;
    let { buttonProps: buttonProps, panelProps: panelProps } = (0, $8afVX$reactariadisclosure.useDisclosure)({
        ...props,
        isExpanded: isExpanded,
        isDisabled: isDisabled
    }, state, panelRef);
    let { isFocusVisible: isFocusVisibleWithin, focusProps: focusWithinProps } = (0, $8afVX$reactaria.useFocusRing)({
        within: true
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        id: undefined,
        defaultClassName: 'react-aria-Disclosure',
        values: {
            isExpanded: state.isExpanded,
            isDisabled: isDisabled,
            isFocusVisibleWithin: isFocusVisibleWithin,
            state: state
        }
    });
    let domProps = (0, $8afVX$reactariautils.filterDOMProps)(otherProps);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($8afVX$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                (0, $b856e6788a7ea5bf$exports.ButtonContext),
                {
                    slots: {
                        [(0, $c5ccf687772c0422$exports.DEFAULT_SLOT)]: {},
                        trigger: buttonProps
                    }
                }
            ],
            [
                $11c780105231f6ef$var$InternalDisclosureContext,
                {
                    panelProps: panelProps,
                    panelRef: panelRef
                }
            ],
            [
                $11c780105231f6ef$export$dab3ea4a6ef094da,
                state
            ]
        ]
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($8afVX$react))).createElement("div", {
        ref: ref,
        "data-expanded": state.isExpanded || undefined,
        "data-disabled": isDisabled || undefined,
        "data-focus-visible-within": isFocusVisibleWithin || undefined,
        ...domProps,
        ...focusWithinProps,
        ...renderProps
    }, renderProps.children));
});
const $11c780105231f6ef$export$feabaa331e1d464c = /*#__PURE__*/ (0, $8afVX$react.forwardRef)(function DisclosurePanel(props, ref) {
    let { role: role = 'group' } = props;
    let { panelProps: panelProps, panelRef: panelRef } = (0, $8afVX$react.useContext)($11c780105231f6ef$var$InternalDisclosureContext);
    let { isFocusVisible: isFocusVisibleWithin, focusProps: focusWithinProps } = (0, $8afVX$reactaria.useFocusRing)({
        within: true
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-DisclosurePanel',
        values: {
            isFocusVisibleWithin: isFocusVisibleWithin
        }
    });
    let DOMProps = (0, $8afVX$reactariautils.filterDOMProps)(props);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($8afVX$react))).createElement("div", {
        ...DOMProps,
        ref: (0, $8afVX$reactariautils.mergeRefs)(ref, panelRef),
        ...(0, $8afVX$reactariautils.mergeProps)(panelProps, focusWithinProps),
        ...renderProps,
        role: role,
        "data-focus-visible-within": isFocusVisibleWithin || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($8afVX$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                (0, $b856e6788a7ea5bf$exports.ButtonContext),
                null
            ]
        ]
    }, props.children));
});


//# sourceMappingURL=Disclosure.main.js.map
