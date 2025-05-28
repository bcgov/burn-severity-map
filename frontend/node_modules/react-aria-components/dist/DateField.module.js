import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, removeDataAttributes as $64fa3d84918910a7$export$ef03459518577ad4, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3, useSlot as $64fa3d84918910a7$export$9d4c57ee4c6ffdd8, useSlottedContext as $64fa3d84918910a7$export$fabf2dc03a41866e} from "./utils.module.js";
import {FieldErrorContext as $ee014567cb39d3f0$export$ff05c3ac10437e03} from "./FieldError.module.js";
import {FormContext as $d3e0e05bdfcf66bd$export$c24727297075ec6a} from "./Form.module.js";
import {Group as $a049562f99e7db0e$export$eb2fcfdbd7ba97d4, GroupContext as $a049562f99e7db0e$export$f9c6924e160136d1} from "./Group.module.js";
import {Input as $3985021b0ad6602f$export$f5b8910cec6cf069, InputContext as $3985021b0ad6602f$export$37fb8590cf2c088c} from "./Input.module.js";
import {LabelContext as $01b77f81d0f07f68$export$75b6ee27786ba447} from "./Label.module.js";
import {TextContext as $514c0188e459b4c0$export$9afb8bc826b033ea} from "./Text.module.js";
import {useLocale as $a9Sgq$useLocale, useDateField as $a9Sgq$useDateField, useTimeField as $a9Sgq$useTimeField, useDateSegment as $a9Sgq$useDateSegment, useFocusRing as $a9Sgq$useFocusRing, useHover as $a9Sgq$useHover, mergeProps as $a9Sgq$mergeProps} from "react-aria";
import {createCalendar as $a9Sgq$createCalendar} from "@internationalized/date";
import {useDateFieldState as $a9Sgq$useDateFieldState, useTimeFieldState as $a9Sgq$useTimeFieldState} from "react-stately";
import {filterDOMProps as $a9Sgq$filterDOMProps, useObjectRef as $a9Sgq$useObjectRef} from "@react-aria/utils";
import $a9Sgq$react, {createContext as $a9Sgq$createContext, forwardRef as $a9Sgq$forwardRef, useRef as $a9Sgq$useRef, useContext as $a9Sgq$useContext, cloneElement as $a9Sgq$cloneElement} from "react";

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











const $40825cdb76e74f70$export$7b3e670c86da5fe8 = /*#__PURE__*/ (0, $a9Sgq$createContext)(null);
const $40825cdb76e74f70$export$8e17ddc448e87c1e = /*#__PURE__*/ (0, $a9Sgq$createContext)(null);
const $40825cdb76e74f70$export$3b08bebcf796eea0 = /*#__PURE__*/ (0, $a9Sgq$createContext)(null);
const $40825cdb76e74f70$export$5d8dc44abd10a920 = /*#__PURE__*/ (0, $a9Sgq$createContext)(null);
const $40825cdb76e74f70$export$d9781c7894a82487 = /*#__PURE__*/ (0, $a9Sgq$forwardRef)(function DateField(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $40825cdb76e74f70$export$7b3e670c86da5fe8);
    let { validationBehavior: formValidationBehavior } = (0, $64fa3d84918910a7$export$fabf2dc03a41866e)((0, $d3e0e05bdfcf66bd$export$c24727297075ec6a)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let { locale: locale } = (0, $a9Sgq$useLocale)();
    let state = (0, $a9Sgq$useDateFieldState)({
        ...props,
        locale: locale,
        createCalendar: $a9Sgq$createCalendar,
        validationBehavior: validationBehavior
    });
    let fieldRef = (0, $a9Sgq$useRef)(null);
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let inputRef = (0, $a9Sgq$useRef)(null);
    let { labelProps: labelProps, fieldProps: fieldProps, inputProps: inputProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $a9Sgq$useDateField)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        label: label,
        inputRef: inputRef,
        validationBehavior: validationBehavior
    }, state, fieldRef);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        values: {
            state: state,
            isInvalid: state.isInvalid,
            isDisabled: state.isDisabled
        },
        defaultClassName: 'react-aria-DateField'
    });
    let DOMProps = (0, $a9Sgq$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $a9Sgq$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $40825cdb76e74f70$export$3b08bebcf796eea0,
                state
            ],
            [
                (0, $a049562f99e7db0e$export$f9c6924e160136d1),
                {
                    ...fieldProps,
                    ref: fieldRef,
                    isInvalid: state.isInvalid
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
    }, /*#__PURE__*/ (0, $a9Sgq$react).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-invalid": state.isInvalid || undefined
    }));
});
const $40825cdb76e74f70$export$5eaee2322dd727eb = /*#__PURE__*/ (0, $a9Sgq$forwardRef)(function TimeField(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $40825cdb76e74f70$export$8e17ddc448e87c1e);
    let { validationBehavior: formValidationBehavior } = (0, $64fa3d84918910a7$export$fabf2dc03a41866e)((0, $d3e0e05bdfcf66bd$export$c24727297075ec6a)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let { locale: locale } = (0, $a9Sgq$useLocale)();
    let state = (0, $a9Sgq$useTimeFieldState)({
        ...props,
        locale: locale,
        validationBehavior: validationBehavior
    });
    let fieldRef = (0, $a9Sgq$useRef)(null);
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let inputRef = (0, $a9Sgq$useRef)(null);
    let { labelProps: labelProps, fieldProps: fieldProps, inputProps: inputProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $a9Sgq$useTimeField)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        label: label,
        inputRef: inputRef,
        validationBehavior: validationBehavior
    }, state, fieldRef);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            state: state,
            isInvalid: state.isInvalid,
            isDisabled: state.isDisabled
        },
        defaultClassName: 'react-aria-TimeField'
    });
    let DOMProps = (0, $a9Sgq$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $a9Sgq$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $40825cdb76e74f70$export$5d8dc44abd10a920,
                state
            ],
            [
                (0, $a049562f99e7db0e$export$f9c6924e160136d1),
                {
                    ...fieldProps,
                    ref: fieldRef,
                    isInvalid: state.isInvalid
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
    }, /*#__PURE__*/ (0, $a9Sgq$react).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-invalid": state.isInvalid || undefined
    }));
});
const $40825cdb76e74f70$export$7edc06cf1783b30f = /*#__PURE__*/ (0, $a9Sgq$forwardRef)(function DateInput(props, ref) {
    // If state is provided by DateField/TimeField, just render.
    // Otherwise (e.g. in DatePicker), we need to call hooks and create state ourselves.
    let dateFieldState = (0, $a9Sgq$useContext)($40825cdb76e74f70$export$3b08bebcf796eea0);
    let timeFieldState = (0, $a9Sgq$useContext)($40825cdb76e74f70$export$5d8dc44abd10a920);
    return dateFieldState || timeFieldState ? /*#__PURE__*/ (0, $a9Sgq$react).createElement($40825cdb76e74f70$var$DateInputInner, {
        ...props,
        ref: ref
    }) : /*#__PURE__*/ (0, $a9Sgq$react).createElement($40825cdb76e74f70$var$DateInputStandalone, {
        ...props,
        ref: ref
    });
});
const $40825cdb76e74f70$var$DateInputStandalone = /*#__PURE__*/ (0, $a9Sgq$forwardRef)((props, ref)=>{
    let [dateFieldProps, fieldRef] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)({
        slot: props.slot
    }, ref, $40825cdb76e74f70$export$7b3e670c86da5fe8);
    let { locale: locale } = (0, $a9Sgq$useLocale)();
    let state = (0, $a9Sgq$useDateFieldState)({
        ...dateFieldProps,
        locale: locale,
        createCalendar: $a9Sgq$createCalendar
    });
    let inputRef = (0, $a9Sgq$useRef)(null);
    let { fieldProps: fieldProps, inputProps: inputProps } = (0, $a9Sgq$useDateField)({
        ...dateFieldProps,
        inputRef: inputRef
    }, state, fieldRef);
    return /*#__PURE__*/ (0, $a9Sgq$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $40825cdb76e74f70$export$3b08bebcf796eea0,
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
                (0, $a049562f99e7db0e$export$f9c6924e160136d1),
                {
                    ...fieldProps,
                    ref: fieldRef,
                    isInvalid: state.isInvalid
                }
            ]
        ]
    }, /*#__PURE__*/ (0, $a9Sgq$react).createElement($40825cdb76e74f70$var$DateInputInner, props));
});
const $40825cdb76e74f70$var$DateInputInner = /*#__PURE__*/ (0, $a9Sgq$forwardRef)((props, ref)=>{
    let { className: className, children: children } = props;
    let dateFieldState = (0, $a9Sgq$useContext)($40825cdb76e74f70$export$3b08bebcf796eea0);
    let timeFieldState = (0, $a9Sgq$useContext)($40825cdb76e74f70$export$5d8dc44abd10a920);
    let state = dateFieldState !== null && dateFieldState !== void 0 ? dateFieldState : timeFieldState;
    return /*#__PURE__*/ (0, $a9Sgq$react).createElement((0, $a9Sgq$react).Fragment, null, /*#__PURE__*/ (0, $a9Sgq$react).createElement((0, $a049562f99e7db0e$export$eb2fcfdbd7ba97d4), {
        ...props,
        ref: ref,
        slot: props.slot || undefined,
        className: className !== null && className !== void 0 ? className : 'react-aria-DateInput',
        isInvalid: state.isInvalid
    }, state.segments.map((segment, i)=>/*#__PURE__*/ (0, $a9Sgq$cloneElement)(children(segment), {
            key: i
        }))), /*#__PURE__*/ (0, $a9Sgq$react).createElement((0, $3985021b0ad6602f$export$f5b8910cec6cf069), null));
});
const $40825cdb76e74f70$export$336ab7fa954c4b5f = /*#__PURE__*/ (0, $a9Sgq$forwardRef)(function DateSegment({ segment: segment, ...otherProps }, ref) {
    let dateFieldState = (0, $a9Sgq$useContext)($40825cdb76e74f70$export$3b08bebcf796eea0);
    let timeFieldState = (0, $a9Sgq$useContext)($40825cdb76e74f70$export$5d8dc44abd10a920);
    let state = dateFieldState !== null && dateFieldState !== void 0 ? dateFieldState : timeFieldState;
    let domRef = (0, $a9Sgq$useObjectRef)(ref);
    let { segmentProps: segmentProps } = (0, $a9Sgq$useDateSegment)(segment, state, domRef);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $a9Sgq$useFocusRing)();
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $a9Sgq$useHover)({
        ...otherProps,
        isDisabled: state.isDisabled || segment.type === 'literal'
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...otherProps,
        values: {
            ...segment,
            isReadOnly: !segment.isEditable,
            isInvalid: state.isInvalid,
            isDisabled: state.isDisabled,
            isHovered: isHovered,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible
        },
        defaultChildren: segment.text,
        defaultClassName: 'react-aria-DateSegment'
    });
    return /*#__PURE__*/ (0, $a9Sgq$react).createElement("div", {
        ...(0, $a9Sgq$mergeProps)((0, $a9Sgq$filterDOMProps)(otherProps), segmentProps, focusProps, hoverProps),
        ...renderProps,
        ref: domRef,
        "data-placeholder": segment.isPlaceholder || undefined,
        "data-invalid": state.isInvalid || undefined,
        "data-readonly": !segment.isEditable || undefined,
        "data-disabled": state.isDisabled || undefined,
        "data-type": segment.type,
        "data-hovered": isHovered || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined
    });
});


export {$40825cdb76e74f70$export$7b3e670c86da5fe8 as DateFieldContext, $40825cdb76e74f70$export$8e17ddc448e87c1e as TimeFieldContext, $40825cdb76e74f70$export$3b08bebcf796eea0 as DateFieldStateContext, $40825cdb76e74f70$export$5d8dc44abd10a920 as TimeFieldStateContext, $40825cdb76e74f70$export$d9781c7894a82487 as DateField, $40825cdb76e74f70$export$5eaee2322dd727eb as TimeField, $40825cdb76e74f70$export$7edc06cf1783b30f as DateInput, $40825cdb76e74f70$export$336ab7fa954c4b5f as DateSegment};
//# sourceMappingURL=DateField.module.js.map
