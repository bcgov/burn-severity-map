var $c5ccf687772c0422$exports = require("./utils.main.js");
var $846a838139f2ac6b$exports = require("./FieldError.main.js");
var $35157657e549736b$exports = require("./Form.main.js");
var $84ae0bf5bd8e2a5f$exports = require("./Label.main.js");
var $a8a589c28affdc40$exports = require("./Text.main.js");
var $g9Qo8$reactaria = require("react-aria");
var $g9Qo8$reactariautils = require("@react-aria/utils");
var $g9Qo8$reactstately = require("react-stately");
var $g9Qo8$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "RadioGroupContext", () => $1456b76f687bd4ed$export$a79eda4ff50e30b6);
$parcel$export(module.exports, "RadioContext", () => $1456b76f687bd4ed$export$b118023277d4a5c3);
$parcel$export(module.exports, "RadioGroupStateContext", () => $1456b76f687bd4ed$export$29d84393af70866c);
$parcel$export(module.exports, "RadioGroup", () => $1456b76f687bd4ed$export$a98f0dcb43a68a25);
$parcel$export(module.exports, "Radio", () => $1456b76f687bd4ed$export$d7b12c4107be0d61);
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








const $1456b76f687bd4ed$export$a79eda4ff50e30b6 = /*#__PURE__*/ (0, $g9Qo8$react.createContext)(null);
const $1456b76f687bd4ed$export$b118023277d4a5c3 = /*#__PURE__*/ (0, $g9Qo8$react.createContext)(null);
const $1456b76f687bd4ed$export$29d84393af70866c = /*#__PURE__*/ (0, $g9Qo8$react.createContext)(null);
const $1456b76f687bd4ed$export$a98f0dcb43a68a25 = /*#__PURE__*/ (0, $g9Qo8$react.forwardRef)(function RadioGroup(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $1456b76f687bd4ed$export$a79eda4ff50e30b6);
    let { validationBehavior: formValidationBehavior } = (0, $c5ccf687772c0422$exports.useSlottedContext)((0, $35157657e549736b$exports.FormContext)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let state = (0, $g9Qo8$reactstately.useRadioGroupState)({
        ...props,
        validationBehavior: validationBehavior
    });
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let { radioGroupProps: radioGroupProps, labelProps: labelProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $g9Qo8$reactaria.useRadioGroup)({
        ...props,
        label: label,
        validationBehavior: validationBehavior
    }, state);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    return /*#__PURE__*/ (0, ($parcel$interopDefault($g9Qo8$react))).createElement("div", {
        ...radioGroupProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-orientation": props.orientation || 'vertical',
        "data-invalid": state.isInvalid || undefined,
        "data-disabled": state.isDisabled || undefined,
        "data-readonly": state.isReadOnly || undefined,
        "data-required": state.isRequired || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($g9Qo8$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $1456b76f687bd4ed$export$29d84393af70866c,
                state
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
    }, renderProps.children));
});
const $1456b76f687bd4ed$export$d7b12c4107be0d61 = /*#__PURE__*/ (0, $g9Qo8$react.forwardRef)(function Radio(props, ref) {
    let { inputRef: userProvidedInputRef = null, ...otherProps } = props;
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(otherProps, ref, $1456b76f687bd4ed$export$b118023277d4a5c3);
    let state = (0, ($parcel$interopDefault($g9Qo8$react))).useContext($1456b76f687bd4ed$export$29d84393af70866c);
    let inputRef = (0, $g9Qo8$reactariautils.useObjectRef)((0, $g9Qo8$reactariautils.mergeRefs)(userProvidedInputRef, props.inputRef !== undefined ? props.inputRef : null));
    let { labelProps: labelProps, inputProps: inputProps, isSelected: isSelected, isDisabled: isDisabled, isPressed: isPressed } = (0, $g9Qo8$reactaria.useRadio)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        // ReactNode type doesn't allow function children.
        children: typeof props.children === 'function' ? true : props.children
    }, state, inputRef);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $g9Qo8$reactaria.useFocusRing)();
    let interactionDisabled = isDisabled || state.isReadOnly;
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $g9Qo8$reactaria.useHover)({
        ...props,
        isDisabled: interactionDisabled
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    let DOMProps = (0, $g9Qo8$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($g9Qo8$react))).createElement("label", {
        ...(0, $g9Qo8$reactariautils.mergeProps)(DOMProps, labelProps, hoverProps, renderProps),
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
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($g9Qo8$react))).createElement((0, $g9Qo8$reactaria.VisuallyHidden), {
        elementType: "span"
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($g9Qo8$react))).createElement("input", {
        ...(0, $g9Qo8$reactariautils.mergeProps)(inputProps, focusProps),
        ref: inputRef
    })), renderProps.children);
});


//# sourceMappingURL=RadioGroup.main.js.map
