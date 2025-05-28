import {CheckboxContext as $4e85f108e88277b8$export$b085522c77523c51} from "./RSPContexts.module.js";
import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, removeDataAttributes as $64fa3d84918910a7$export$ef03459518577ad4, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3, useSlot as $64fa3d84918910a7$export$9d4c57ee4c6ffdd8, useSlottedContext as $64fa3d84918910a7$export$fabf2dc03a41866e} from "./utils.module.js";
import {FieldErrorContext as $ee014567cb39d3f0$export$ff05c3ac10437e03} from "./FieldError.module.js";
import {FormContext as $d3e0e05bdfcf66bd$export$c24727297075ec6a} from "./Form.module.js";
import {LabelContext as $01b77f81d0f07f68$export$75b6ee27786ba447} from "./Label.module.js";
import {TextContext as $514c0188e459b4c0$export$9afb8bc826b033ea} from "./Text.module.js";
import {useCheckboxGroup as $kPH7g$useCheckboxGroup, useCheckboxGroupItem as $kPH7g$useCheckboxGroupItem, useCheckbox as $kPH7g$useCheckbox, useFocusRing as $kPH7g$useFocusRing, useHover as $kPH7g$useHover, mergeProps as $kPH7g$mergeProps, VisuallyHidden as $kPH7g$VisuallyHidden} from "react-aria";
import {useCheckboxGroupState as $kPH7g$useCheckboxGroupState, useToggleState as $kPH7g$useToggleState} from "react-stately";
import {useObjectRef as $kPH7g$useObjectRef, mergeRefs as $kPH7g$mergeRefs, filterDOMProps as $kPH7g$filterDOMProps} from "@react-aria/utils";
import $kPH7g$react, {createContext as $kPH7g$createContext, forwardRef as $kPH7g$forwardRef, useContext as $kPH7g$useContext} from "react";

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









const $bc237834342dbd75$export$baf37c4be89255b8 = /*#__PURE__*/ (0, $kPH7g$createContext)(null);
const $bc237834342dbd75$export$139c5b8563afc1fc = /*#__PURE__*/ (0, $kPH7g$createContext)(null);
const $bc237834342dbd75$export$4aa08d5625cb8ead = /*#__PURE__*/ (0, $kPH7g$forwardRef)(function CheckboxGroup(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $bc237834342dbd75$export$baf37c4be89255b8);
    let { validationBehavior: formValidationBehavior } = (0, $64fa3d84918910a7$export$fabf2dc03a41866e)((0, $d3e0e05bdfcf66bd$export$c24727297075ec6a)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let state = (0, $kPH7g$useCheckboxGroupState)({
        ...props,
        validationBehavior: validationBehavior
    });
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let { groupProps: groupProps, labelProps: labelProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $kPH7g$useCheckboxGroup)({
        ...props,
        label: label,
        validationBehavior: validationBehavior
    }, state);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            isDisabled: state.isDisabled,
            isReadOnly: state.isReadOnly,
            isRequired: props.isRequired || false,
            isInvalid: state.isInvalid,
            state: state
        },
        defaultClassName: 'react-aria-CheckboxGroup'
    });
    return /*#__PURE__*/ (0, $kPH7g$react).createElement("div", {
        ...groupProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-readonly": state.isReadOnly || undefined,
        "data-required": props.isRequired || undefined,
        "data-invalid": state.isInvalid || undefined,
        "data-disabled": props.isDisabled || undefined
    }, /*#__PURE__*/ (0, $kPH7g$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $bc237834342dbd75$export$139c5b8563afc1fc,
                state
            ],
            [
                (0, $01b77f81d0f07f68$export$75b6ee27786ba447),
                {
                    ...labelProps,
                    ref: labelRef,
                    elementType: 'span'
                }
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
                (0, $ee014567cb39d3f0$export$ff05c3ac10437e03),
                validation
            ]
        ]
    }, renderProps.children));
});
const $bc237834342dbd75$export$48513f6b9f8ce62d = /*#__PURE__*/ (0, $kPH7g$forwardRef)(function Checkbox(props, ref) {
    let { inputRef: userProvidedInputRef = null, ...otherProps } = props;
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(otherProps, ref, (0, $4e85f108e88277b8$export$b085522c77523c51));
    let { validationBehavior: formValidationBehavior } = (0, $64fa3d84918910a7$export$fabf2dc03a41866e)((0, $d3e0e05bdfcf66bd$export$c24727297075ec6a)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let groupState = (0, $kPH7g$useContext)($bc237834342dbd75$export$139c5b8563afc1fc);
    let inputRef = (0, $kPH7g$useObjectRef)((0, $kPH7g$mergeRefs)(userProvidedInputRef, props.inputRef !== undefined ? props.inputRef : null));
    let { labelProps: labelProps, inputProps: inputProps, isSelected: isSelected, isDisabled: isDisabled, isReadOnly: isReadOnly, isPressed: isPressed, isInvalid: isInvalid } = groupState ? (0, $kPH7g$useCheckboxGroupItem)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        // Value is optional for standalone checkboxes, but required for CheckboxGroup items;
        // it's passed explicitly here to avoid typescript error (requires ignore).
        // @ts-ignore
        value: props.value,
        // ReactNode type doesn't allow function children.
        children: typeof props.children === 'function' ? true : props.children
    }, groupState, inputRef) : (0, $kPH7g$useCheckbox)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        children: typeof props.children === 'function' ? true : props.children,
        validationBehavior: validationBehavior
    }, (0, $kPH7g$useToggleState)(props), inputRef);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $kPH7g$useFocusRing)();
    let isInteractionDisabled = isDisabled || isReadOnly;
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $kPH7g$useHover)({
        ...props,
        isDisabled: isInteractionDisabled
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        defaultClassName: 'react-aria-Checkbox',
        values: {
            isSelected: isSelected,
            isIndeterminate: props.isIndeterminate || false,
            isPressed: isPressed,
            isHovered: isHovered,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isDisabled: isDisabled,
            isReadOnly: isReadOnly,
            isInvalid: isInvalid,
            isRequired: props.isRequired || false
        }
    });
    let DOMProps = (0, $kPH7g$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $kPH7g$react).createElement("label", {
        ...(0, $kPH7g$mergeProps)(DOMProps, labelProps, hoverProps, renderProps),
        ref: ref,
        slot: props.slot || undefined,
        "data-selected": isSelected || undefined,
        "data-indeterminate": props.isIndeterminate || undefined,
        "data-pressed": isPressed || undefined,
        "data-hovered": isHovered || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-disabled": isDisabled || undefined,
        "data-readonly": isReadOnly || undefined,
        "data-invalid": isInvalid || undefined,
        "data-required": props.isRequired || undefined
    }, /*#__PURE__*/ (0, $kPH7g$react).createElement((0, $kPH7g$VisuallyHidden), {
        elementType: "span"
    }, /*#__PURE__*/ (0, $kPH7g$react).createElement("input", {
        ...(0, $kPH7g$mergeProps)(inputProps, focusProps),
        ref: inputRef
    })), renderProps.children);
});


export {$bc237834342dbd75$export$baf37c4be89255b8 as CheckboxGroupContext, $bc237834342dbd75$export$139c5b8563afc1fc as CheckboxGroupStateContext, $bc237834342dbd75$export$4aa08d5625cb8ead as CheckboxGroup, $bc237834342dbd75$export$48513f6b9f8ce62d as Checkbox};
//# sourceMappingURL=Checkbox.module.js.map
