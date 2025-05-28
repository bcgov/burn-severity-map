import {ColorFieldContext as $4e85f108e88277b8$export$44644b8a16031b5b} from "./RSPContexts.mjs";
import {FieldErrorContext as $ee014567cb39d3f0$export$ff05c3ac10437e03} from "./FieldError.mjs";
import {InputContext as $3985021b0ad6602f$export$37fb8590cf2c088c} from "./Input.mjs";
import {LabelContext as $01b77f81d0f07f68$export$75b6ee27786ba447} from "./Label.mjs";
import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, removeDataAttributes as $64fa3d84918910a7$export$ef03459518577ad4, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3, useSlot as $64fa3d84918910a7$export$9d4c57ee4c6ffdd8} from "./utils.mjs";
import {TextContext as $514c0188e459b4c0$export$9afb8bc826b033ea} from "./Text.mjs";
import {useColorChannelField as $kjuGe$useColorChannelField, useColorField as $kjuGe$useColorField} from "@react-aria/color";
import {useColorChannelFieldState as $kjuGe$useColorChannelFieldState, useColorFieldState as $kjuGe$useColorFieldState} from "@react-stately/color";
import {filterDOMProps as $kjuGe$filterDOMProps} from "@react-aria/utils";
import $kjuGe$react, {createContext as $kjuGe$createContext, forwardRef as $kjuGe$forwardRef, useRef as $kjuGe$useRef} from "react";
import {useLocale as $kjuGe$useLocale} from "react-aria";

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










const $3ada01a82feafb94$export$96b6d32b05a1a8ed = /*#__PURE__*/ (0, $kjuGe$createContext)(null);
const $3ada01a82feafb94$export$b865d4358897bb17 = /*#__PURE__*/ (0, $kjuGe$forwardRef)(function ColorField(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, (0, $4e85f108e88277b8$export$44644b8a16031b5b));
    if (props.channel) return /*#__PURE__*/ (0, $kjuGe$react).createElement($3ada01a82feafb94$var$ColorChannelField, {
        ...props,
        channel: props.channel,
        forwardedRef: ref
    });
    else return /*#__PURE__*/ (0, $kjuGe$react).createElement($3ada01a82feafb94$var$HexColorField, {
        ...props,
        forwardedRef: ref
    });
});
function $3ada01a82feafb94$var$ColorChannelField(props) {
    let { locale: locale } = (0, $kjuGe$useLocale)();
    let state = (0, $kjuGe$useColorChannelFieldState)({
        ...props,
        locale: locale
    });
    let inputRef = (0, $kjuGe$useRef)(null);
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    var _props_validationBehavior;
    let { labelProps: labelProps, inputProps: inputProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $kjuGe$useColorChannelField)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        label: label,
        validationBehavior: (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : 'native'
    }, state, inputRef);
    return /*#__PURE__*/ (0, $kjuGe$react).createElement((0, $kjuGe$react).Fragment, null, $3ada01a82feafb94$var$useChildren(props, state, props.forwardedRef, inputProps, inputRef, labelProps, labelRef, descriptionProps, errorMessageProps, validation), props.name && /*#__PURE__*/ (0, $kjuGe$react).createElement("input", {
        type: "hidden",
        name: props.name,
        value: isNaN(state.numberValue) ? '' : state.numberValue
    }));
}
function $3ada01a82feafb94$var$HexColorField(props) {
    var _props_validationBehavior;
    let state = (0, $kjuGe$useColorFieldState)({
        ...props,
        validationBehavior: (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : 'native'
    });
    let inputRef = (0, $kjuGe$useRef)(null);
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    var _props_validationBehavior1;
    let { labelProps: labelProps, inputProps: inputProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $kjuGe$useColorField)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        label: label,
        validationBehavior: (_props_validationBehavior1 = props.validationBehavior) !== null && _props_validationBehavior1 !== void 0 ? _props_validationBehavior1 : 'native'
    }, state, inputRef);
    return $3ada01a82feafb94$var$useChildren(props, state, props.forwardedRef, inputProps, inputRef, labelProps, labelRef, descriptionProps, errorMessageProps, validation);
}
function $3ada01a82feafb94$var$useChildren(props, state, ref, inputProps, inputRef, labelProps, labelRef, descriptionProps, errorMessageProps, validation) {
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            state: state,
            channel: props.channel || 'hex',
            isDisabled: props.isDisabled || false,
            isInvalid: validation.isInvalid || false
        },
        defaultClassName: 'react-aria-ColorField'
    });
    let DOMProps = (0, $kjuGe$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $kjuGe$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $3ada01a82feafb94$export$96b6d32b05a1a8ed,
                state
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
    }, /*#__PURE__*/ (0, $kjuGe$react).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-channel": props.channel || 'hex',
        "data-disabled": props.isDisabled || undefined,
        "data-invalid": validation.isInvalid || undefined
    }));
}


export {$3ada01a82feafb94$export$96b6d32b05a1a8ed as ColorFieldStateContext, $3ada01a82feafb94$export$b865d4358897bb17 as ColorField};
//# sourceMappingURL=ColorField.module.js.map
