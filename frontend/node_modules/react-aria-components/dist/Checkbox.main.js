var $525402dfec7da5bc$exports = require("./RSPContexts.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $846a838139f2ac6b$exports = require("./FieldError.main.js");
var $35157657e549736b$exports = require("./Form.main.js");
var $84ae0bf5bd8e2a5f$exports = require("./Label.main.js");
var $a8a589c28affdc40$exports = require("./Text.main.js");
var $72alD$reactaria = require("react-aria");
var $72alD$reactstately = require("react-stately");
var $72alD$reactariautils = require("@react-aria/utils");
var $72alD$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "CheckboxGroupContext", () => $e733553516d848a9$export$baf37c4be89255b8);
$parcel$export(module.exports, "CheckboxGroupStateContext", () => $e733553516d848a9$export$139c5b8563afc1fc);
$parcel$export(module.exports, "CheckboxGroup", () => $e733553516d848a9$export$4aa08d5625cb8ead);
$parcel$export(module.exports, "Checkbox", () => $e733553516d848a9$export$48513f6b9f8ce62d);
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









const $e733553516d848a9$export$baf37c4be89255b8 = /*#__PURE__*/ (0, $72alD$react.createContext)(null);
const $e733553516d848a9$export$139c5b8563afc1fc = /*#__PURE__*/ (0, $72alD$react.createContext)(null);
const $e733553516d848a9$export$4aa08d5625cb8ead = /*#__PURE__*/ (0, $72alD$react.forwardRef)(function CheckboxGroup(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $e733553516d848a9$export$baf37c4be89255b8);
    let { validationBehavior: formValidationBehavior } = (0, $c5ccf687772c0422$exports.useSlottedContext)((0, $35157657e549736b$exports.FormContext)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let state = (0, $72alD$reactstately.useCheckboxGroupState)({
        ...props,
        validationBehavior: validationBehavior
    });
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let { groupProps: groupProps, labelProps: labelProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $72alD$reactaria.useCheckboxGroup)({
        ...props,
        label: label,
        validationBehavior: validationBehavior
    }, state);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    return /*#__PURE__*/ (0, ($parcel$interopDefault($72alD$react))).createElement("div", {
        ...groupProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-readonly": state.isReadOnly || undefined,
        "data-required": props.isRequired || undefined,
        "data-invalid": state.isInvalid || undefined,
        "data-disabled": props.isDisabled || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($72alD$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $e733553516d848a9$export$139c5b8563afc1fc,
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
const $e733553516d848a9$export$48513f6b9f8ce62d = /*#__PURE__*/ (0, $72alD$react.forwardRef)(function Checkbox(props, ref) {
    let { inputRef: userProvidedInputRef = null, ...otherProps } = props;
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(otherProps, ref, (0, $525402dfec7da5bc$exports.CheckboxContext));
    let { validationBehavior: formValidationBehavior } = (0, $c5ccf687772c0422$exports.useSlottedContext)((0, $35157657e549736b$exports.FormContext)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let groupState = (0, $72alD$react.useContext)($e733553516d848a9$export$139c5b8563afc1fc);
    let inputRef = (0, $72alD$reactariautils.useObjectRef)((0, $72alD$reactariautils.mergeRefs)(userProvidedInputRef, props.inputRef !== undefined ? props.inputRef : null));
    let { labelProps: labelProps, inputProps: inputProps, isSelected: isSelected, isDisabled: isDisabled, isReadOnly: isReadOnly, isPressed: isPressed, isInvalid: isInvalid } = groupState ? (0, $72alD$reactaria.useCheckboxGroupItem)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        // Value is optional for standalone checkboxes, but required for CheckboxGroup items;
        // it's passed explicitly here to avoid typescript error (requires ignore).
        // @ts-ignore
        value: props.value,
        // ReactNode type doesn't allow function children.
        children: typeof props.children === 'function' ? true : props.children
    }, groupState, inputRef) : (0, $72alD$reactaria.useCheckbox)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        children: typeof props.children === 'function' ? true : props.children,
        validationBehavior: validationBehavior
    }, (0, $72alD$reactstately.useToggleState)(props), inputRef);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $72alD$reactaria.useFocusRing)();
    let isInteractionDisabled = isDisabled || isReadOnly;
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $72alD$reactaria.useHover)({
        ...props,
        isDisabled: isInteractionDisabled
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    let DOMProps = (0, $72alD$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($72alD$react))).createElement("label", {
        ...(0, $72alD$reactaria.mergeProps)(DOMProps, labelProps, hoverProps, renderProps),
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
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($72alD$react))).createElement((0, $72alD$reactaria.VisuallyHidden), {
        elementType: "span"
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($72alD$react))).createElement("input", {
        ...(0, $72alD$reactaria.mergeProps)(inputProps, focusProps),
        ref: inputRef
    })), renderProps.children);
});


//# sourceMappingURL=Checkbox.main.js.map
