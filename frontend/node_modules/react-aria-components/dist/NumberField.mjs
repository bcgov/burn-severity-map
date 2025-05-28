import {ButtonContext as $d2b4bc8c273e7be6$export$24d547caef80ccd1} from "./Button.mjs";
import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, removeDataAttributes as $64fa3d84918910a7$export$ef03459518577ad4, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3, useSlot as $64fa3d84918910a7$export$9d4c57ee4c6ffdd8, useSlottedContext as $64fa3d84918910a7$export$fabf2dc03a41866e} from "./utils.mjs";
import {FieldErrorContext as $ee014567cb39d3f0$export$ff05c3ac10437e03} from "./FieldError.mjs";
import {FormContext as $d3e0e05bdfcf66bd$export$c24727297075ec6a} from "./Form.mjs";
import {GroupContext as $a049562f99e7db0e$export$f9c6924e160136d1} from "./Group.mjs";
import {InputContext as $3985021b0ad6602f$export$37fb8590cf2c088c} from "./Input.mjs";
import {LabelContext as $01b77f81d0f07f68$export$75b6ee27786ba447} from "./Label.mjs";
import {TextContext as $514c0188e459b4c0$export$9afb8bc826b033ea} from "./Text.mjs";
import {useLocale as $a4EfP$useLocale, useNumberField as $a4EfP$useNumberField} from "react-aria";
import {filterDOMProps as $a4EfP$filterDOMProps} from "@react-aria/utils";
import {useNumberFieldState as $a4EfP$useNumberFieldState} from "react-stately";
import $a4EfP$react, {createContext as $a4EfP$createContext, forwardRef as $a4EfP$forwardRef, useRef as $a4EfP$useRef} from "react";

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











const $b91743d66a0ed188$export$b414a48cf5dcbc11 = /*#__PURE__*/ (0, $a4EfP$createContext)(null);
const $b91743d66a0ed188$export$6cc906c6cff9bec5 = /*#__PURE__*/ (0, $a4EfP$createContext)(null);
const $b91743d66a0ed188$export$63c5fa0b2fdccd2e = /*#__PURE__*/ (0, $a4EfP$forwardRef)(function NumberField(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $b91743d66a0ed188$export$b414a48cf5dcbc11);
    let { validationBehavior: formValidationBehavior } = (0, $64fa3d84918910a7$export$fabf2dc03a41866e)((0, $d3e0e05bdfcf66bd$export$c24727297075ec6a)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let { locale: locale } = (0, $a4EfP$useLocale)();
    let state = (0, $a4EfP$useNumberFieldState)({
        ...props,
        locale: locale,
        validationBehavior: validationBehavior
    });
    let inputRef = (0, $a4EfP$useRef)(null);
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let { labelProps: labelProps, groupProps: groupProps, inputProps: inputProps, incrementButtonProps: incrementButtonProps, decrementButtonProps: decrementButtonProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $a4EfP$useNumberField)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        label: label,
        validationBehavior: validationBehavior
    }, state, inputRef);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            state: state,
            isDisabled: props.isDisabled || false,
            isInvalid: validation.isInvalid || false
        },
        defaultClassName: 'react-aria-NumberField'
    });
    let DOMProps = (0, $a4EfP$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $a4EfP$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $b91743d66a0ed188$export$6cc906c6cff9bec5,
                state
            ],
            [
                (0, $a049562f99e7db0e$export$f9c6924e160136d1),
                groupProps
            ],
            [
                (0, $3985021b0ad6602f$export$37fb8590cf2c088c),
                {
                    ...inputProps,
                    ref: inputRef
                }
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
                    slots: {
                        increment: incrementButtonProps,
                        decrement: decrementButtonProps
                    }
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
    }, /*#__PURE__*/ (0, $a4EfP$react).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-disabled": props.isDisabled || undefined,
        "data-invalid": validation.isInvalid || undefined
    }), props.name && /*#__PURE__*/ (0, $a4EfP$react).createElement("input", {
        type: "hidden",
        name: props.name,
        value: isNaN(state.numberValue) ? '' : state.numberValue
    }));
});


export {$b91743d66a0ed188$export$b414a48cf5dcbc11 as NumberFieldContext, $b91743d66a0ed188$export$6cc906c6cff9bec5 as NumberFieldStateContext, $b91743d66a0ed188$export$63c5fa0b2fdccd2e as NumberField};
//# sourceMappingURL=NumberField.module.js.map
