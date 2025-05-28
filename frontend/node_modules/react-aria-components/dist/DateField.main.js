var $c5ccf687772c0422$exports = require("./utils.main.js");
var $846a838139f2ac6b$exports = require("./FieldError.main.js");
var $35157657e549736b$exports = require("./Form.main.js");
var $dcae72abc18c0045$exports = require("./Group.main.js");
var $1bcfcef5af644e13$exports = require("./Input.main.js");
var $84ae0bf5bd8e2a5f$exports = require("./Label.main.js");
var $a8a589c28affdc40$exports = require("./Text.main.js");
var $hucUZ$reactaria = require("react-aria");
var $hucUZ$internationalizeddate = require("@internationalized/date");
var $hucUZ$reactstately = require("react-stately");
var $hucUZ$reactariautils = require("@react-aria/utils");
var $hucUZ$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "DateFieldContext", () => $9eb4e1c2268ca198$export$7b3e670c86da5fe8);
$parcel$export(module.exports, "TimeFieldContext", () => $9eb4e1c2268ca198$export$8e17ddc448e87c1e);
$parcel$export(module.exports, "DateFieldStateContext", () => $9eb4e1c2268ca198$export$3b08bebcf796eea0);
$parcel$export(module.exports, "TimeFieldStateContext", () => $9eb4e1c2268ca198$export$5d8dc44abd10a920);
$parcel$export(module.exports, "DateField", () => $9eb4e1c2268ca198$export$d9781c7894a82487);
$parcel$export(module.exports, "TimeField", () => $9eb4e1c2268ca198$export$5eaee2322dd727eb);
$parcel$export(module.exports, "DateInput", () => $9eb4e1c2268ca198$export$7edc06cf1783b30f);
$parcel$export(module.exports, "DateSegment", () => $9eb4e1c2268ca198$export$336ab7fa954c4b5f);
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











const $9eb4e1c2268ca198$export$7b3e670c86da5fe8 = /*#__PURE__*/ (0, $hucUZ$react.createContext)(null);
const $9eb4e1c2268ca198$export$8e17ddc448e87c1e = /*#__PURE__*/ (0, $hucUZ$react.createContext)(null);
const $9eb4e1c2268ca198$export$3b08bebcf796eea0 = /*#__PURE__*/ (0, $hucUZ$react.createContext)(null);
const $9eb4e1c2268ca198$export$5d8dc44abd10a920 = /*#__PURE__*/ (0, $hucUZ$react.createContext)(null);
const $9eb4e1c2268ca198$export$d9781c7894a82487 = /*#__PURE__*/ (0, $hucUZ$react.forwardRef)(function DateField(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $9eb4e1c2268ca198$export$7b3e670c86da5fe8);
    let { validationBehavior: formValidationBehavior } = (0, $c5ccf687772c0422$exports.useSlottedContext)((0, $35157657e549736b$exports.FormContext)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let { locale: locale } = (0, $hucUZ$reactaria.useLocale)();
    let state = (0, $hucUZ$reactstately.useDateFieldState)({
        ...props,
        locale: locale,
        createCalendar: $hucUZ$internationalizeddate.createCalendar,
        validationBehavior: validationBehavior
    });
    let fieldRef = (0, $hucUZ$react.useRef)(null);
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let inputRef = (0, $hucUZ$react.useRef)(null);
    let { labelProps: labelProps, fieldProps: fieldProps, inputProps: inputProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $hucUZ$reactaria.useDateField)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        label: label,
        inputRef: inputRef,
        validationBehavior: validationBehavior
    }, state, fieldRef);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        values: {
            state: state,
            isInvalid: state.isInvalid,
            isDisabled: state.isDisabled
        },
        defaultClassName: 'react-aria-DateField'
    });
    let DOMProps = (0, $hucUZ$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($hucUZ$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $9eb4e1c2268ca198$export$3b08bebcf796eea0,
                state
            ],
            [
                (0, $dcae72abc18c0045$exports.GroupContext),
                {
                    ...fieldProps,
                    ref: fieldRef,
                    isInvalid: state.isInvalid
                }
            ],
            [
                (0, $1bcfcef5af644e13$exports.InputContext),
                {
                    ...inputProps,
                    ref: inputRef
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
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($hucUZ$react))).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-invalid": state.isInvalid || undefined
    }));
});
const $9eb4e1c2268ca198$export$5eaee2322dd727eb = /*#__PURE__*/ (0, $hucUZ$react.forwardRef)(function TimeField(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $9eb4e1c2268ca198$export$8e17ddc448e87c1e);
    let { validationBehavior: formValidationBehavior } = (0, $c5ccf687772c0422$exports.useSlottedContext)((0, $35157657e549736b$exports.FormContext)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let { locale: locale } = (0, $hucUZ$reactaria.useLocale)();
    let state = (0, $hucUZ$reactstately.useTimeFieldState)({
        ...props,
        locale: locale,
        validationBehavior: validationBehavior
    });
    let fieldRef = (0, $hucUZ$react.useRef)(null);
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let inputRef = (0, $hucUZ$react.useRef)(null);
    let { labelProps: labelProps, fieldProps: fieldProps, inputProps: inputProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $hucUZ$reactaria.useTimeField)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        label: label,
        inputRef: inputRef,
        validationBehavior: validationBehavior
    }, state, fieldRef);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: {
            state: state,
            isInvalid: state.isInvalid,
            isDisabled: state.isDisabled
        },
        defaultClassName: 'react-aria-TimeField'
    });
    let DOMProps = (0, $hucUZ$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($hucUZ$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $9eb4e1c2268ca198$export$5d8dc44abd10a920,
                state
            ],
            [
                (0, $dcae72abc18c0045$exports.GroupContext),
                {
                    ...fieldProps,
                    ref: fieldRef,
                    isInvalid: state.isInvalid
                }
            ],
            [
                (0, $1bcfcef5af644e13$exports.InputContext),
                {
                    ...inputProps,
                    ref: inputRef
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
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($hucUZ$react))).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-invalid": state.isInvalid || undefined
    }));
});
const $9eb4e1c2268ca198$export$7edc06cf1783b30f = /*#__PURE__*/ (0, $hucUZ$react.forwardRef)(function DateInput(props, ref) {
    // If state is provided by DateField/TimeField, just render.
    // Otherwise (e.g. in DatePicker), we need to call hooks and create state ourselves.
    let dateFieldState = (0, $hucUZ$react.useContext)($9eb4e1c2268ca198$export$3b08bebcf796eea0);
    let timeFieldState = (0, $hucUZ$react.useContext)($9eb4e1c2268ca198$export$5d8dc44abd10a920);
    return dateFieldState || timeFieldState ? /*#__PURE__*/ (0, ($parcel$interopDefault($hucUZ$react))).createElement($9eb4e1c2268ca198$var$DateInputInner, {
        ...props,
        ref: ref
    }) : /*#__PURE__*/ (0, ($parcel$interopDefault($hucUZ$react))).createElement($9eb4e1c2268ca198$var$DateInputStandalone, {
        ...props,
        ref: ref
    });
});
const $9eb4e1c2268ca198$var$DateInputStandalone = /*#__PURE__*/ (0, $hucUZ$react.forwardRef)((props, ref)=>{
    let [dateFieldProps, fieldRef] = (0, $c5ccf687772c0422$exports.useContextProps)({
        slot: props.slot
    }, ref, $9eb4e1c2268ca198$export$7b3e670c86da5fe8);
    let { locale: locale } = (0, $hucUZ$reactaria.useLocale)();
    let state = (0, $hucUZ$reactstately.useDateFieldState)({
        ...dateFieldProps,
        locale: locale,
        createCalendar: $hucUZ$internationalizeddate.createCalendar
    });
    let inputRef = (0, $hucUZ$react.useRef)(null);
    let { fieldProps: fieldProps, inputProps: inputProps } = (0, $hucUZ$reactaria.useDateField)({
        ...dateFieldProps,
        inputRef: inputRef
    }, state, fieldRef);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($hucUZ$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $9eb4e1c2268ca198$export$3b08bebcf796eea0,
                state
            ],
            [
                (0, $1bcfcef5af644e13$exports.InputContext),
                {
                    ...inputProps,
                    ref: inputRef
                }
            ],
            [
                (0, $dcae72abc18c0045$exports.GroupContext),
                {
                    ...fieldProps,
                    ref: fieldRef,
                    isInvalid: state.isInvalid
                }
            ]
        ]
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($hucUZ$react))).createElement($9eb4e1c2268ca198$var$DateInputInner, props));
});
const $9eb4e1c2268ca198$var$DateInputInner = /*#__PURE__*/ (0, $hucUZ$react.forwardRef)((props, ref)=>{
    let { className: className, children: children } = props;
    let dateFieldState = (0, $hucUZ$react.useContext)($9eb4e1c2268ca198$export$3b08bebcf796eea0);
    let timeFieldState = (0, $hucUZ$react.useContext)($9eb4e1c2268ca198$export$5d8dc44abd10a920);
    let state = dateFieldState !== null && dateFieldState !== void 0 ? dateFieldState : timeFieldState;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($hucUZ$react))).createElement((0, ($parcel$interopDefault($hucUZ$react))).Fragment, null, /*#__PURE__*/ (0, ($parcel$interopDefault($hucUZ$react))).createElement((0, $dcae72abc18c0045$exports.Group), {
        ...props,
        ref: ref,
        slot: props.slot || undefined,
        className: className !== null && className !== void 0 ? className : 'react-aria-DateInput',
        isInvalid: state.isInvalid
    }, state.segments.map((segment, i)=>/*#__PURE__*/ (0, $hucUZ$react.cloneElement)(children(segment), {
            key: i
        }))), /*#__PURE__*/ (0, ($parcel$interopDefault($hucUZ$react))).createElement((0, $1bcfcef5af644e13$exports.Input), null));
});
const $9eb4e1c2268ca198$export$336ab7fa954c4b5f = /*#__PURE__*/ (0, $hucUZ$react.forwardRef)(function DateSegment({ segment: segment, ...otherProps }, ref) {
    let dateFieldState = (0, $hucUZ$react.useContext)($9eb4e1c2268ca198$export$3b08bebcf796eea0);
    let timeFieldState = (0, $hucUZ$react.useContext)($9eb4e1c2268ca198$export$5d8dc44abd10a920);
    let state = dateFieldState !== null && dateFieldState !== void 0 ? dateFieldState : timeFieldState;
    let domRef = (0, $hucUZ$reactariautils.useObjectRef)(ref);
    let { segmentProps: segmentProps } = (0, $hucUZ$reactaria.useDateSegment)(segment, state, domRef);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $hucUZ$reactaria.useFocusRing)();
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $hucUZ$reactaria.useHover)({
        ...otherProps,
        isDisabled: state.isDisabled || segment.type === 'literal'
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    return /*#__PURE__*/ (0, ($parcel$interopDefault($hucUZ$react))).createElement("div", {
        ...(0, $hucUZ$reactaria.mergeProps)((0, $hucUZ$reactariautils.filterDOMProps)(otherProps), segmentProps, focusProps, hoverProps),
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


//# sourceMappingURL=DateField.main.js.map
