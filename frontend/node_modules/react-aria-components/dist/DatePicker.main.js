var $b856e6788a7ea5bf$exports = require("./Button.main.js");
var $3f539f26b167ddde$exports = require("./Calendar.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $9eb4e1c2268ca198$exports = require("./DateField.main.js");
var $2979ab89b336194b$exports = require("./Dialog.main.js");
var $846a838139f2ac6b$exports = require("./FieldError.main.js");
var $35157657e549736b$exports = require("./Form.main.js");
var $dcae72abc18c0045$exports = require("./Group.main.js");
var $84ae0bf5bd8e2a5f$exports = require("./Label.main.js");
var $61e2b7078adb18bc$exports = require("./Popover.main.js");
var $a8a589c28affdc40$exports = require("./Text.main.js");
var $bhT4V$reactaria = require("react-aria");
var $bhT4V$reactstately = require("react-stately");
var $bhT4V$reactariautils = require("@react-aria/utils");
var $bhT4V$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "DatePickerContext", () => $adfe8d3f75d5162e$export$cf316c7f3b44c11e);
$parcel$export(module.exports, "DateRangePickerContext", () => $adfe8d3f75d5162e$export$8282edba42ee28a);
$parcel$export(module.exports, "DatePickerStateContext", () => $adfe8d3f75d5162e$export$50a10c048fdcdee9);
$parcel$export(module.exports, "DateRangePickerStateContext", () => $adfe8d3f75d5162e$export$80d7ae1f804790be);
$parcel$export(module.exports, "DatePicker", () => $adfe8d3f75d5162e$export$5109c6dd95d8fb00);
$parcel$export(module.exports, "DateRangePicker", () => $adfe8d3f75d5162e$export$17334619f3ac2224);
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














const $adfe8d3f75d5162e$export$cf316c7f3b44c11e = /*#__PURE__*/ (0, $bhT4V$react.createContext)(null);
const $adfe8d3f75d5162e$export$8282edba42ee28a = /*#__PURE__*/ (0, $bhT4V$react.createContext)(null);
const $adfe8d3f75d5162e$export$50a10c048fdcdee9 = /*#__PURE__*/ (0, $bhT4V$react.createContext)(null);
const $adfe8d3f75d5162e$export$80d7ae1f804790be = /*#__PURE__*/ (0, $bhT4V$react.createContext)(null);
const $adfe8d3f75d5162e$export$5109c6dd95d8fb00 = /*#__PURE__*/ (0, $bhT4V$react.forwardRef)(function DatePicker(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $adfe8d3f75d5162e$export$cf316c7f3b44c11e);
    let { validationBehavior: formValidationBehavior } = (0, $c5ccf687772c0422$exports.useSlottedContext)((0, $35157657e549736b$exports.FormContext)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let state = (0, $bhT4V$reactstately.useDatePickerState)({
        ...props,
        validationBehavior: validationBehavior
    });
    let groupRef = (0, $bhT4V$react.useRef)(null);
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let { groupProps: groupProps, labelProps: labelProps, fieldProps: fieldProps, buttonProps: buttonProps, dialogProps: dialogProps, calendarProps: calendarProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $bhT4V$reactaria.useDatePicker)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        label: label,
        validationBehavior: validationBehavior
    }, state, groupRef);
    // Allows calendar width to match input group
    let [groupWidth, setGroupWidth] = (0, $bhT4V$react.useState)(null);
    let onResize = (0, $bhT4V$react.useCallback)(()=>{
        if (groupRef.current) setGroupWidth(groupRef.current.offsetWidth + 'px');
    }, []);
    (0, $bhT4V$reactariautils.useResizeObserver)({
        ref: groupRef,
        onResize: onResize
    });
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $bhT4V$reactaria.useFocusRing)({
        within: true
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    let DOMProps = (0, $bhT4V$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($bhT4V$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $adfe8d3f75d5162e$export$50a10c048fdcdee9,
                state
            ],
            [
                (0, $dcae72abc18c0045$exports.GroupContext),
                {
                    ...groupProps,
                    ref: groupRef,
                    isInvalid: state.isInvalid
                }
            ],
            [
                (0, $9eb4e1c2268ca198$exports.DateFieldContext),
                fieldProps
            ],
            [
                (0, $b856e6788a7ea5bf$exports.ButtonContext),
                {
                    ...buttonProps,
                    isPressed: state.isOpen
                }
            ],
            [
                (0, $84ae0bf5bd8e2a5f$exports.LabelContext),
                {
                    ...labelProps,
                    ref: labelRef,
                    elementType: 'span'
                }
            ],
            [
                (0, $3f539f26b167ddde$exports.CalendarContext),
                calendarProps
            ],
            [
                (0, $2979ab89b336194b$exports.OverlayTriggerStateContext),
                state
            ],
            [
                (0, $61e2b7078adb18bc$exports.PopoverContext),
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
                (0, $2979ab89b336194b$exports.DialogContext),
                dialogProps
            ],
            [
                (0, $a8a589c28affdc40$exports.TextContext),
                {
                    slots: {
                        description: descriptionProps,
                        errorMessage: errorMessageProps
                    }
                }
            ],
            [
                (0, $846a838139f2ac6b$exports.FieldErrorContext),
                validation
            ]
        ]
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($bhT4V$react))).createElement("div", {
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
const $adfe8d3f75d5162e$export$17334619f3ac2224 = /*#__PURE__*/ (0, $bhT4V$react.forwardRef)(function DateRangePicker(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $adfe8d3f75d5162e$export$8282edba42ee28a);
    let { validationBehavior: formValidationBehavior } = (0, $c5ccf687772c0422$exports.useSlottedContext)((0, $35157657e549736b$exports.FormContext)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let state = (0, $bhT4V$reactstately.useDateRangePickerState)({
        ...props,
        validationBehavior: validationBehavior
    });
    let groupRef = (0, $bhT4V$react.useRef)(null);
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let { groupProps: groupProps, labelProps: labelProps, startFieldProps: startFieldProps, endFieldProps: endFieldProps, buttonProps: buttonProps, dialogProps: dialogProps, calendarProps: calendarProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $bhT4V$reactaria.useDateRangePicker)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        label: label,
        validationBehavior: validationBehavior
    }, state, groupRef);
    // Allows calendar width to match input group
    let [groupWidth, setGroupWidth] = (0, $bhT4V$react.useState)(null);
    let onResize = (0, $bhT4V$react.useCallback)(()=>{
        if (groupRef.current) setGroupWidth(groupRef.current.offsetWidth + 'px');
    }, []);
    (0, $bhT4V$reactariautils.useResizeObserver)({
        ref: groupRef,
        onResize: onResize
    });
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $bhT4V$reactaria.useFocusRing)({
        within: true
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    let DOMProps = (0, $bhT4V$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($bhT4V$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $adfe8d3f75d5162e$export$80d7ae1f804790be,
                state
            ],
            [
                (0, $dcae72abc18c0045$exports.GroupContext),
                {
                    ...groupProps,
                    ref: groupRef,
                    isInvalid: state.isInvalid
                }
            ],
            [
                (0, $b856e6788a7ea5bf$exports.ButtonContext),
                {
                    ...buttonProps,
                    isPressed: state.isOpen
                }
            ],
            [
                (0, $84ae0bf5bd8e2a5f$exports.LabelContext),
                {
                    ...labelProps,
                    ref: labelRef,
                    elementType: 'span'
                }
            ],
            [
                (0, $3f539f26b167ddde$exports.RangeCalendarContext),
                calendarProps
            ],
            [
                (0, $2979ab89b336194b$exports.OverlayTriggerStateContext),
                state
            ],
            [
                (0, $61e2b7078adb18bc$exports.PopoverContext),
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
                (0, $2979ab89b336194b$exports.DialogContext),
                dialogProps
            ],
            [
                (0, $9eb4e1c2268ca198$exports.DateFieldContext),
                {
                    slots: {
                        start: startFieldProps,
                        end: endFieldProps
                    }
                }
            ],
            [
                (0, $a8a589c28affdc40$exports.TextContext),
                {
                    slots: {
                        description: descriptionProps,
                        errorMessage: errorMessageProps
                    }
                }
            ],
            [
                (0, $846a838139f2ac6b$exports.FieldErrorContext),
                validation
            ]
        ]
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($bhT4V$react))).createElement("div", {
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


//# sourceMappingURL=DatePicker.main.js.map
