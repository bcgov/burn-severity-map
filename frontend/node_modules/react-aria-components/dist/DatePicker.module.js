import {ButtonContext as $d2b4bc8c273e7be6$export$24d547caef80ccd1} from "./Button.module.js";
import {CalendarContext as $dfd62f934fc76fed$export$3b805cea1f178355, RangeCalendarContext as $dfd62f934fc76fed$export$233dd9682e1ad64b} from "./Calendar.module.js";
import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, removeDataAttributes as $64fa3d84918910a7$export$ef03459518577ad4, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3, useSlot as $64fa3d84918910a7$export$9d4c57ee4c6ffdd8, useSlottedContext as $64fa3d84918910a7$export$fabf2dc03a41866e} from "./utils.module.js";
import {DateFieldContext as $40825cdb76e74f70$export$7b3e670c86da5fe8} from "./DateField.module.js";
import {DialogContext as $de32f1b87079253c$export$8b93a07348a7730c, OverlayTriggerStateContext as $de32f1b87079253c$export$d2f961adcb0afbe} from "./Dialog.module.js";
import {FieldErrorContext as $ee014567cb39d3f0$export$ff05c3ac10437e03} from "./FieldError.module.js";
import {FormContext as $d3e0e05bdfcf66bd$export$c24727297075ec6a} from "./Form.module.js";
import {GroupContext as $a049562f99e7db0e$export$f9c6924e160136d1} from "./Group.module.js";
import {LabelContext as $01b77f81d0f07f68$export$75b6ee27786ba447} from "./Label.module.js";
import {PopoverContext as $07b14b47974efb58$export$9b9a0cd73afb7ca4} from "./Popover.module.js";
import {TextContext as $514c0188e459b4c0$export$9afb8bc826b033ea} from "./Text.module.js";
import {useDatePicker as $8nhma$useDatePicker, useFocusRing as $8nhma$useFocusRing, useDateRangePicker as $8nhma$useDateRangePicker} from "react-aria";
import {useDatePickerState as $8nhma$useDatePickerState, useDateRangePickerState as $8nhma$useDateRangePickerState} from "react-stately";
import {useResizeObserver as $8nhma$useResizeObserver, filterDOMProps as $8nhma$filterDOMProps} from "@react-aria/utils";
import $8nhma$react, {createContext as $8nhma$createContext, forwardRef as $8nhma$forwardRef, useRef as $8nhma$useRef, useState as $8nhma$useState, useCallback as $8nhma$useCallback} from "react";

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














const $06d5b8ec9ee5d538$export$cf316c7f3b44c11e = /*#__PURE__*/ (0, $8nhma$createContext)(null);
const $06d5b8ec9ee5d538$export$8282edba42ee28a = /*#__PURE__*/ (0, $8nhma$createContext)(null);
const $06d5b8ec9ee5d538$export$50a10c048fdcdee9 = /*#__PURE__*/ (0, $8nhma$createContext)(null);
const $06d5b8ec9ee5d538$export$80d7ae1f804790be = /*#__PURE__*/ (0, $8nhma$createContext)(null);
const $06d5b8ec9ee5d538$export$5109c6dd95d8fb00 = /*#__PURE__*/ (0, $8nhma$forwardRef)(function DatePicker(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $06d5b8ec9ee5d538$export$cf316c7f3b44c11e);
    let { validationBehavior: formValidationBehavior } = (0, $64fa3d84918910a7$export$fabf2dc03a41866e)((0, $d3e0e05bdfcf66bd$export$c24727297075ec6a)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let state = (0, $8nhma$useDatePickerState)({
        ...props,
        validationBehavior: validationBehavior
    });
    let groupRef = (0, $8nhma$useRef)(null);
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let { groupProps: groupProps, labelProps: labelProps, fieldProps: fieldProps, buttonProps: buttonProps, dialogProps: dialogProps, calendarProps: calendarProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $8nhma$useDatePicker)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        label: label,
        validationBehavior: validationBehavior
    }, state, groupRef);
    // Allows calendar width to match input group
    let [groupWidth, setGroupWidth] = (0, $8nhma$useState)(null);
    let onResize = (0, $8nhma$useCallback)(()=>{
        if (groupRef.current) setGroupWidth(groupRef.current.offsetWidth + 'px');
    }, []);
    (0, $8nhma$useResizeObserver)({
        ref: groupRef,
        onResize: onResize
    });
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $8nhma$useFocusRing)({
        within: true
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            state: state,
            isFocusWithin: isFocused,
            isFocusVisible: isFocusVisible,
            isDisabled: props.isDisabled || false,
            isInvalid: state.isInvalid,
            isOpen: state.isOpen
        },
        defaultClassName: 'react-aria-DatePicker'
    });
    let DOMProps = (0, $8nhma$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $8nhma$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $06d5b8ec9ee5d538$export$50a10c048fdcdee9,
                state
            ],
            [
                (0, $a049562f99e7db0e$export$f9c6924e160136d1),
                {
                    ...groupProps,
                    ref: groupRef,
                    isInvalid: state.isInvalid
                }
            ],
            [
                (0, $40825cdb76e74f70$export$7b3e670c86da5fe8),
                fieldProps
            ],
            [
                (0, $d2b4bc8c273e7be6$export$24d547caef80ccd1),
                {
                    ...buttonProps,
                    isPressed: state.isOpen
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
                (0, $dfd62f934fc76fed$export$3b805cea1f178355),
                calendarProps
            ],
            [
                (0, $de32f1b87079253c$export$d2f961adcb0afbe),
                state
            ],
            [
                (0, $07b14b47974efb58$export$9b9a0cd73afb7ca4),
                {
                    trigger: 'DatePicker',
                    triggerRef: groupRef,
                    placement: 'bottom start',
                    style: {
                        '--trigger-width': groupWidth
                    }
                }
            ],
            [
                (0, $de32f1b87079253c$export$8b93a07348a7730c),
                dialogProps
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
    }, /*#__PURE__*/ (0, $8nhma$react).createElement("div", {
        ...focusProps,
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-focus-within": isFocused || undefined,
        "data-invalid": state.isInvalid || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-disabled": props.isDisabled || undefined,
        "data-open": state.isOpen || undefined
    }));
});
const $06d5b8ec9ee5d538$export$17334619f3ac2224 = /*#__PURE__*/ (0, $8nhma$forwardRef)(function DateRangePicker(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $06d5b8ec9ee5d538$export$8282edba42ee28a);
    let { validationBehavior: formValidationBehavior } = (0, $64fa3d84918910a7$export$fabf2dc03a41866e)((0, $d3e0e05bdfcf66bd$export$c24727297075ec6a)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let state = (0, $8nhma$useDateRangePickerState)({
        ...props,
        validationBehavior: validationBehavior
    });
    let groupRef = (0, $8nhma$useRef)(null);
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let { groupProps: groupProps, labelProps: labelProps, startFieldProps: startFieldProps, endFieldProps: endFieldProps, buttonProps: buttonProps, dialogProps: dialogProps, calendarProps: calendarProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $8nhma$useDateRangePicker)({
        ...(0, $64fa3d84918910a7$export$ef03459518577ad4)(props),
        label: label,
        validationBehavior: validationBehavior
    }, state, groupRef);
    // Allows calendar width to match input group
    let [groupWidth, setGroupWidth] = (0, $8nhma$useState)(null);
    let onResize = (0, $8nhma$useCallback)(()=>{
        if (groupRef.current) setGroupWidth(groupRef.current.offsetWidth + 'px');
    }, []);
    (0, $8nhma$useResizeObserver)({
        ref: groupRef,
        onResize: onResize
    });
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $8nhma$useFocusRing)({
        within: true
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            state: state,
            isFocusWithin: isFocused,
            isFocusVisible: isFocusVisible,
            isDisabled: props.isDisabled || false,
            isInvalid: state.isInvalid,
            isOpen: state.isOpen
        },
        defaultClassName: 'react-aria-DateRangePicker'
    });
    let DOMProps = (0, $8nhma$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $8nhma$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $06d5b8ec9ee5d538$export$80d7ae1f804790be,
                state
            ],
            [
                (0, $a049562f99e7db0e$export$f9c6924e160136d1),
                {
                    ...groupProps,
                    ref: groupRef,
                    isInvalid: state.isInvalid
                }
            ],
            [
                (0, $d2b4bc8c273e7be6$export$24d547caef80ccd1),
                {
                    ...buttonProps,
                    isPressed: state.isOpen
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
                (0, $dfd62f934fc76fed$export$233dd9682e1ad64b),
                calendarProps
            ],
            [
                (0, $de32f1b87079253c$export$d2f961adcb0afbe),
                state
            ],
            [
                (0, $07b14b47974efb58$export$9b9a0cd73afb7ca4),
                {
                    trigger: 'DateRangePicker',
                    triggerRef: groupRef,
                    placement: 'bottom start',
                    style: {
                        '--trigger-width': groupWidth
                    }
                }
            ],
            [
                (0, $de32f1b87079253c$export$8b93a07348a7730c),
                dialogProps
            ],
            [
                (0, $40825cdb76e74f70$export$7b3e670c86da5fe8),
                {
                    slots: {
                        start: startFieldProps,
                        end: endFieldProps
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
    }, /*#__PURE__*/ (0, $8nhma$react).createElement("div", {
        ...focusProps,
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-focus-within": isFocused || undefined,
        "data-invalid": state.isInvalid || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-disabled": props.isDisabled || undefined,
        "data-open": state.isOpen || undefined
    }));
});


export {$06d5b8ec9ee5d538$export$cf316c7f3b44c11e as DatePickerContext, $06d5b8ec9ee5d538$export$8282edba42ee28a as DateRangePickerContext, $06d5b8ec9ee5d538$export$50a10c048fdcdee9 as DatePickerStateContext, $06d5b8ec9ee5d538$export$80d7ae1f804790be as DateRangePickerStateContext, $06d5b8ec9ee5d538$export$5109c6dd95d8fb00 as DatePicker, $06d5b8ec9ee5d538$export$17334619f3ac2224 as DateRangePicker};
//# sourceMappingURL=DatePicker.module.js.map
