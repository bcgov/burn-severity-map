import {ButtonContext as $d2b4bc8c273e7be6$export$24d547caef80ccd1} from "./Button.module.js";
import {DEFAULT_SLOT as $64fa3d84918910a7$export$c62b8e45d58ddad9, Provider as $64fa3d84918910a7$export$2881499e37b75b9a, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import {useDisclosure as $hI1OT$useDisclosure} from "@react-aria/disclosure";
import {useDisclosureGroupState as $hI1OT$useDisclosureGroupState, useDisclosureState as $hI1OT$useDisclosureState} from "@react-stately/disclosure";
import {filterDOMProps as $hI1OT$filterDOMProps, useId as $hI1OT$useId, mergeRefs as $hI1OT$mergeRefs, mergeProps as $hI1OT$mergeProps} from "@react-aria/utils";
import $hI1OT$react, {createContext as $hI1OT$createContext, forwardRef as $hI1OT$forwardRef, useContext as $hI1OT$useContext} from "react";
import {useFocusRing as $hI1OT$useFocusRing} from "react-aria";

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






const $28f4fd908f0de97f$export$1d40e3e0cc4d5de = /*#__PURE__*/ (0, $hI1OT$createContext)(null);
const $28f4fd908f0de97f$export$944aceb4f8c89f10 = /*#__PURE__*/ (0, $hI1OT$forwardRef)(function DisclosureGroup(props, ref) {
    let state = (0, $hI1OT$useDisclosureGroupState)(props);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        defaultClassName: 'react-aria-DisclosureGroup',
        values: {
            isDisabled: state.isDisabled,
            state: state
        }
    });
    let domProps = (0, $hI1OT$filterDOMProps)(props);
    return /*#__PURE__*/ (0, $hI1OT$react).createElement("div", {
        ...domProps,
        ...renderProps,
        ref: ref,
        "data-disabled": props.isDisabled || undefined
    }, /*#__PURE__*/ (0, $hI1OT$react).createElement($28f4fd908f0de97f$export$1d40e3e0cc4d5de.Provider, {
        value: state
    }, renderProps.children));
});
const $28f4fd908f0de97f$export$d665dd135a51b28a = /*#__PURE__*/ (0, $hI1OT$createContext)(null);
const $28f4fd908f0de97f$export$dab3ea4a6ef094da = /*#__PURE__*/ (0, $hI1OT$createContext)(null);
const $28f4fd908f0de97f$var$InternalDisclosureContext = /*#__PURE__*/ (0, $hI1OT$createContext)(null);
const $28f4fd908f0de97f$export$74a362b31437ec83 = /*#__PURE__*/ (0, $hI1OT$forwardRef)(function Disclosure(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $28f4fd908f0de97f$export$d665dd135a51b28a);
    let groupState = (0, $hI1OT$useContext)($28f4fd908f0de97f$export$1d40e3e0cc4d5de);
    let { id: id, ...otherProps } = props;
    // Generate an id if one wasn't provided.
    // (can't pass id into useId since it can also be a number)
    let defaultId = (0, $hI1OT$useId)();
    id || (id = defaultId);
    let isExpanded = groupState ? groupState.expandedKeys.has(id) : props.isExpanded;
    let state = (0, $hI1OT$useDisclosureState)({
        ...props,
        isExpanded: isExpanded,
        onExpandedChange (isExpanded) {
            var _props_onExpandedChange;
            if (groupState) groupState.toggleKey(id);
            (_props_onExpandedChange = props.onExpandedChange) === null || _props_onExpandedChange === void 0 ? void 0 : _props_onExpandedChange.call(props, isExpanded);
        }
    });
    let panelRef = (0, $hI1OT$react).useRef(null);
    let isDisabled = props.isDisabled || (groupState === null || groupState === void 0 ? void 0 : groupState.isDisabled) || false;
    let { buttonProps: buttonProps, panelProps: panelProps } = (0, $hI1OT$useDisclosure)({
        ...props,
        isExpanded: isExpanded,
        isDisabled: isDisabled
    }, state, panelRef);
    let { isFocusVisible: isFocusVisibleWithin, focusProps: focusWithinProps } = (0, $hI1OT$useFocusRing)({
        within: true
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
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
    let domProps = (0, $hI1OT$filterDOMProps)(otherProps);
    return /*#__PURE__*/ (0, $hI1OT$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                (0, $d2b4bc8c273e7be6$export$24d547caef80ccd1),
                {
                    slots: {
                        [(0, $64fa3d84918910a7$export$c62b8e45d58ddad9)]: {},
                        trigger: buttonProps
                    }
                }
            ],
            [
                $28f4fd908f0de97f$var$InternalDisclosureContext,
                {
                    panelProps: panelProps,
                    panelRef: panelRef
                }
            ],
            [
                $28f4fd908f0de97f$export$dab3ea4a6ef094da,
                state
            ]
        ]
    }, /*#__PURE__*/ (0, $hI1OT$react).createElement("div", {
        ref: ref,
        "data-expanded": state.isExpanded || undefined,
        "data-disabled": isDisabled || undefined,
        "data-focus-visible-within": isFocusVisibleWithin || undefined,
        ...domProps,
        ...focusWithinProps,
        ...renderProps
    }, renderProps.children));
});
const $28f4fd908f0de97f$export$feabaa331e1d464c = /*#__PURE__*/ (0, $hI1OT$forwardRef)(function DisclosurePanel(props, ref) {
    let { role: role = 'group' } = props;
    let { panelProps: panelProps, panelRef: panelRef } = (0, $hI1OT$useContext)($28f4fd908f0de97f$var$InternalDisclosureContext);
    let { isFocusVisible: isFocusVisibleWithin, focusProps: focusWithinProps } = (0, $hI1OT$useFocusRing)({
        within: true
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        defaultClassName: 'react-aria-DisclosurePanel',
        values: {
            isFocusVisibleWithin: isFocusVisibleWithin
        }
    });
    let DOMProps = (0, $hI1OT$filterDOMProps)(props);
    return /*#__PURE__*/ (0, $hI1OT$react).createElement("div", {
        ...DOMProps,
        ref: (0, $hI1OT$mergeRefs)(ref, panelRef),
        ...(0, $hI1OT$mergeProps)(panelProps, focusWithinProps),
        ...renderProps,
        role: role,
        "data-focus-visible-within": isFocusVisibleWithin || undefined
    }, /*#__PURE__*/ (0, $hI1OT$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                (0, $d2b4bc8c273e7be6$export$24d547caef80ccd1),
                null
            ]
        ]
    }, props.children));
});


export {$28f4fd908f0de97f$export$1d40e3e0cc4d5de as DisclosureGroupStateContext, $28f4fd908f0de97f$export$944aceb4f8c89f10 as DisclosureGroup, $28f4fd908f0de97f$export$d665dd135a51b28a as DisclosureContext, $28f4fd908f0de97f$export$dab3ea4a6ef094da as DisclosureStateContext, $28f4fd908f0de97f$export$74a362b31437ec83 as Disclosure, $28f4fd908f0de97f$export$feabaa331e1d464c as DisclosurePanel};
//# sourceMappingURL=Disclosure.module.js.map
