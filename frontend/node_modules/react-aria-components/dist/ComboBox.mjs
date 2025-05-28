import {ButtonContext as $d2b4bc8c273e7be6$export$24d547caef80ccd1} from "./Button.mjs";
import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, removeDataAttributes as $64fa3d84918910a7$export$ef03459518577ad4, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3, useSlot as $64fa3d84918910a7$export$9d4c57ee4c6ffdd8, useSlottedContext as $64fa3d84918910a7$export$fabf2dc03a41866e} from "./utils.mjs";
import {FieldErrorContext as $ee014567cb39d3f0$export$ff05c3ac10437e03} from "./FieldError.mjs";
import {FormContext as $d3e0e05bdfcf66bd$export$c24727297075ec6a} from "./Form.mjs";
import {GroupContext as $a049562f99e7db0e$export$f9c6924e160136d1} from "./Group.mjs";
import {InputContext as $3985021b0ad6602f$export$37fb8590cf2c088c} from "./Input.mjs";
import {LabelContext as $01b77f81d0f07f68$export$75b6ee27786ba447} from "./Label.mjs";
import {ListBoxContext as $eed445e0843c11d0$export$7ff8f37d2d81a48d, ListStateContext as $eed445e0843c11d0$export$7c5906fe4f1f2af2} from "./ListBox.mjs";
import {OverlayTriggerStateContext as $de32f1b87079253c$export$d2f961adcb0afbe} from "./Dialog.mjs";
import {PopoverContext as $07b14b47974efb58$export$9b9a0cd73afb7ca4} from "./Popover.mjs";
import {TextContext as $514c0188e459b4c0$export$9afb8bc826b033ea} from "./Text.mjs";
import {useFilter as $cP7hC$useFilter, useComboBox as $cP7hC$useComboBox} from "react-aria";
import {useComboBoxState as $cP7hC$useComboBoxState} from "react-stately";
import {CollectionBuilder as $cP7hC$CollectionBuilder} from "@react-aria/collections";
import {useResizeObserver as $cP7hC$useResizeObserver, filterDOMProps as $cP7hC$filterDOMProps} from "@react-aria/utils";
import $cP7hC$react, {createContext as $cP7hC$createContext, forwardRef as $cP7hC$forwardRef, useMemo as $cP7hC$useMemo, useRef as $cP7hC$useRef, useState as $cP7hC$useState, useCallback as $cP7hC$useCallback} from "react";

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















const $d01f2c01039c0eec$export$d414ccceff7063c3 = /*#__PURE__*/ (0, $cP7hC$createContext)(null);
const $d01f2c01039c0eec$export$c02625b26074192c = /*#__PURE__*/ (0, $cP7hC$createContext)(null);
const $d01f2c01039c0eec$export$72b9695b8216309a = /*#__PURE__*/ (0, $cP7hC$forwardRef)(function ComboBox(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $d01f2c01039c0eec$export$d414ccceff7063c3);
    let { children: children, isDisabled: isDisabled = false, isInvalid: isInvalid = false, isRequired: isRequired = false } = props;
    let content = (0, $cP7hC$useMemo)(()=>{
        var _props_items;
        return /*#__PURE__*/ (0, $cP7hC$react).createElement((0, $eed445e0843c11d0$export$7ff8f37d2d81a48d).Provider, {
            value: {
                items: (_props_items = props.items) !== null && _props_items !== void 0 ? _props_items : props.defaultItems
            }
        }, typeof children === 'function' ? children({
            isOpen: false,
            isDisabled: isDisabled,
            isInvalid: isInvalid,
            isRequired: isRequired,
            defaultChildren: null
        }) : children);
    }, [
        children,
        isDisabled,
        isInvalid,
        isRequired,
        props.items,
        props.defaultItems
    ]);
    return /*#__PURE__*/ (0, $cP7hC$react).createElement((0, $cP7hC$CollectionBuilder), {
        content: content
    }, (collection)=>/*#__PURE__*/ (0, $cP7hC$react).createElement($d01f2c01039c0eec$var$ComboBoxInner, {
            props: props,
            collection: collection,
            comboBoxRef: ref
        }));
});
function $d01f2c01039c0eec$var$ComboBoxInner({ props: props, collection: collection, comboBoxRef: ref }) {
    let { name: name, formValue: formValue = 'key', allowsCustomValue: allowsCustomValue } = props;
    if (allowsCustomValue) formValue = 'text';
    let { validationBehavior: formValidationBehavior } = (0, $64fa3d84918910a7$export$fabf2dc03a41866e)((0, $d3e0e05bdfcf66bd$export$c24727297075ec6a)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let { contains: contains } = (0, $cP7hC$useFilter)({
        sensitivity: 'base'
    });
    let state = (0, $cP7hC$useComboBoxState)({
        defaultFilter: props.defaultFilter || contains,
        ...props,
        // If props.items isn't provided, rely on collection filtering (aka listbox.items is provided or defaultItems provided to Combobox)
        items: props.items,
        children: undefined,
        collection: collection,
        validationBehavior: validationBehavior
    });
    let buttonRef = (0, $cP7hC$useRef)(null);
    let inputRef = (0, $cP7hC$useRef)(null);
    let listBoxRef = (0, $cP7hC$useRef)(null);
    let popoverRef = (0, $cP7hC$useRef)(null);
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let { buttonProps: buttonProps, inputProps: inputProps, listBoxProps: listBoxProps, labelProps: labelProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $cP7hC$useComboBox)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        label: label,
        inputRef: inputRef,
        buttonRef: buttonRef,
        listBoxRef: listBoxRef,
        popoverRef: popoverRef,
        name: formValue === 'text' ? name : undefined,
        validationBehavior: validationBehavior
    }, state);
    // Make menu width match input + button
    let [menuWidth, setMenuWidth] = (0, $cP7hC$useState)(null);
    let onResize = (0, $cP7hC$useCallback)(()=>{
        if (inputRef.current) {
            var _buttonRef_current;
            let buttonRect = (_buttonRef_current = buttonRef.current) === null || _buttonRef_current === void 0 ? void 0 : _buttonRef_current.getBoundingClientRect();
            let inputRect = inputRef.current.getBoundingClientRect();
            let minX = buttonRect ? Math.min(buttonRect.left, inputRect.left) : inputRect.left;
            let maxX = buttonRect ? Math.max(buttonRect.right, inputRect.right) : inputRect.right;
            setMenuWidth(maxX - minX + 'px');
        }
    }, [
        buttonRef,
        inputRef,
        setMenuWidth
    ]);
    (0, $cP7hC$useResizeObserver)({
        ref: inputRef,
        onResize: onResize
    });
    // Only expose a subset of state to renderProps function to avoid infinite render loop
    let renderPropsState = (0, $cP7hC$useMemo)(()=>({
            isOpen: state.isOpen,
            isDisabled: props.isDisabled || false,
            isInvalid: validation.isInvalid || false,
            isRequired: props.isRequired || false
        }), [
        state.isOpen,
        props.isDisabled,
        validation.isInvalid,
        props.isRequired
    ]);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: renderPropsState,
        defaultClassName: 'react-aria-ComboBox'
    });
    let DOMProps = (0, $cP7hC$filterDOMProps)(props);
    delete DOMProps.id;
    var _state_selectedKey;
    return /*#__PURE__*/ (0, $cP7hC$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $d01f2c01039c0eec$export$c02625b26074192c,
                state
            ],
            [
                (0, $01b77f81d0f07f68$export$75b6ee27786ba447),
                {
                    ...labelProps,
                    ref: labelRef
                }
            ],
            [
                (0, $d2b4bc8c273e7be6$export$24d547caef80ccd1),
                {
                    ...buttonProps,
                    ref: buttonRef,
                    isPressed: state.isOpen
                }
            ],
            [
                (0, $3985021b0ad6602f$export$37fb8590cf2c088c),
                {
                    ...inputProps,
                    ref: inputRef
                }
            ],
            [
                (0, $de32f1b87079253c$export$d2f961adcb0afbe),
                state
            ],
            [
                (0, $07b14b47974efb58$export$9b9a0cd73afb7ca4),
                {
                    ref: popoverRef,
                    triggerRef: inputRef,
                    scrollRef: listBoxRef,
                    placement: 'bottom start',
                    isNonModal: true,
                    trigger: 'ComboBox',
                    style: {
                        '--trigger-width': menuWidth
                    }
                }
            ],
            [
                (0, $eed445e0843c11d0$export$7ff8f37d2d81a48d),
                {
                    ...listBoxProps,
                    ref: listBoxRef
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
            ],
            [
                (0, $a049562f99e7db0e$export$f9c6924e160136d1),
                {
                    isInvalid: validation.isInvalid,
                    isDisabled: props.isDisabled || false
                }
            ],
            [
                (0, $ee014567cb39d3f0$export$ff05c3ac10437e03),
                validation
            ]
        ]
    }, /*#__PURE__*/ (0, $cP7hC$react).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-focused": state.isFocused || undefined,
        "data-open": state.isOpen || undefined,
        "data-disabled": props.isDisabled || undefined,
        "data-invalid": validation.isInvalid || undefined,
        "data-required": props.isRequired || undefined
    }), name && formValue === 'key' && /*#__PURE__*/ (0, $cP7hC$react).createElement("input", {
        type: "hidden",
        name: name,
        value: (_state_selectedKey = state.selectedKey) !== null && _state_selectedKey !== void 0 ? _state_selectedKey : ''
    }));
}


export {$d01f2c01039c0eec$export$d414ccceff7063c3 as ComboBoxContext, $d01f2c01039c0eec$export$c02625b26074192c as ComboBoxStateContext, $d01f2c01039c0eec$export$72b9695b8216309a as ComboBox};
//# sourceMappingURL=ComboBox.module.js.map
