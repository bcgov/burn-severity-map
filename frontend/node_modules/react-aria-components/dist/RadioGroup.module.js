import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, removeDataAttributes as $64fa3d84918910a7$export$ef03459518577ad4, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3, useSlot as $64fa3d84918910a7$export$9d4c57ee4c6ffdd8, useSlottedContext as $64fa3d84918910a7$export$fabf2dc03a41866e} from "./utils.module.js";
import {FieldErrorContext as $ee014567cb39d3f0$export$ff05c3ac10437e03} from "./FieldError.module.js";
import {FormContext as $d3e0e05bdfcf66bd$export$c24727297075ec6a} from "./Form.module.js";
import {LabelContext as $01b77f81d0f07f68$export$75b6ee27786ba447} from "./Label.module.js";
import {TextContext as $514c0188e459b4c0$export$9afb8bc826b033ea} from "./Text.module.js";
import {useRadioGroup as $3sixo$useRadioGroup, useRadio as $3sixo$useRadio, useFocusRing as $3sixo$useFocusRing, useHover as $3sixo$useHover, VisuallyHidden as $3sixo$VisuallyHidden} from "react-aria";
import {useObjectRef as $3sixo$useObjectRef, mergeRefs as $3sixo$mergeRefs, filterDOMProps as $3sixo$filterDOMProps, mergeProps as $3sixo$mergeProps} from "@react-aria/utils";
import {useRadioGroupState as $3sixo$useRadioGroupState} from "react-stately";
import $3sixo$react, {createContext as $3sixo$createContext, forwardRef as $3sixo$forwardRef} from "react";

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








const $b6c3ddc6086f204d$export$a79eda4ff50e30b6 = /*#__PURE__*/ (0, $3sixo$createContext)(null);
const $b6c3ddc6086f204d$export$b118023277d4a5c3 = /*#__PURE__*/ (0, $3sixo$createContext)(null);
const $b6c3ddc6086f204d$export$29d84393af70866c = /*#__PURE__*/ (0, $3sixo$createContext)(null);
const $b6c3ddc6086f204d$export$a98f0dcb43a68a25 = /*#__PURE__*/ (0, $3sixo$forwardRef)(function RadioGroup(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $b6c3ddc6086f204d$export$a79eda4ff50e30b6);
    let { validationBehavior: formValidationBehavior } = (0, $64fa3d84918910a7$export$fabf2dc03a41866e)((0, $d3e0e05bdfcf66bd$export$c24727297075ec6a)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let state = (0, $3sixo$useRadioGroupState)({
        ...props,
        validationBehavior: validationBehavior
    });
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let { radioGroupProps: radioGroupProps, labelProps: labelProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $3sixo$useRadioGroup)({
        ...props,
        label: label,
        validationBehavior: validationBehavior
    }, state);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            orientation: props.orientation || 'vertical',
            isDisabled: state.isDisabled,
            isReadOnly: state.isReadOnly,
            isRequired: state.isRequired,
            isInvalid: state.isInvalid,
            state: state
        },
        defaultClassName: 'react-aria-RadioGroup'
    });
    return /*#__PURE__*/ (0, $3sixo$react).createElement("div", {
        ...radioGroupProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-orientation": props.orientation || 'vertical',
        "data-invalid": state.isInvalid || undefined,
        "data-disabled": state.isDisabled || undefined,
        "data-readonly": state.isReadOnly || undefined,
        "data-required": state.isRequired || undefined
    }, /*#__PURE__*/ (0, $3sixo$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $b6c3ddc6086f204d$export$29d84393af70866c,
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
const $b6c3ddc6086f204d$export$d7b12c4107be0d61 = /*#__PURE__*/ (0, $3sixo$forwardRef)(function Radio(props, ref) {
    let { inputRef: userProvidedInputRef = null, ...otherProps } = props;
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(otherProps, ref, $b6c3ddc6086f204d$export$b118023277d4a5c3);
    let state = (0, $3sixo$react).useContext($b6c3ddc6086f204d$export$29d84393af70866c);
    let inputRef = (0, $3sixo$useObjectRef)((0, $3sixo$mergeRefs)(userProvidedInputRef, props.inputRef !== undefined ? props.inputRef : null));
    let { labelProps: labelProps, inputProps: inputProps, isSelected: isSelected, isDisabled: isDisabled, isPressed: isPressed } = (0, $3sixo$useRadio)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        // ReactNode type doesn't allow function children.
        children: typeof props.children === 'function' ? true : props.children
    }, state, inputRef);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $3sixo$useFocusRing)();
    let interactionDisabled = isDisabled || state.isReadOnly;
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $3sixo$useHover)({
        ...props,
        isDisabled: interactionDisabled
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        defaultClassName: 'react-aria-Radio',
        values: {
            isSelected: isSelected,
            isPressed: isPressed,
            isHovered: isHovered,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isDisabled: isDisabled,
            isReadOnly: state.isReadOnly,
            isInvalid: state.isInvalid,
            isRequired: state.isRequired
        }
    });
    let DOMProps = (0, $3sixo$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $3sixo$react).createElement("label", {
        ...(0, $3sixo$mergeProps)(DOMProps, labelProps, hoverProps, renderProps),
        ref: ref,
        "data-selected": isSelected || undefined,
        "data-pressed": isPressed || undefined,
        "data-hovered": isHovered || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-disabled": isDisabled || undefined,
        "data-readonly": state.isReadOnly || undefined,
        "data-invalid": state.isInvalid || undefined,
        "data-required": state.isRequired || undefined
    }, /*#__PURE__*/ (0, $3sixo$react).createElement((0, $3sixo$VisuallyHidden), {
        elementType: "span"
    }, /*#__PURE__*/ (0, $3sixo$react).createElement("input", {
        ...(0, $3sixo$mergeProps)(inputProps, focusProps),
        ref: inputRef
    })), renderProps.children);
});


export {$b6c3ddc6086f204d$export$a79eda4ff50e30b6 as RadioGroupContext, $b6c3ddc6086f204d$export$b118023277d4a5c3 as RadioContext, $b6c3ddc6086f204d$export$29d84393af70866c as RadioGroupStateContext, $b6c3ddc6086f204d$export$a98f0dcb43a68a25 as RadioGroup, $b6c3ddc6086f204d$export$d7b12c4107be0d61 as Radio};
//# sourceMappingURL=RadioGroup.module.js.map
