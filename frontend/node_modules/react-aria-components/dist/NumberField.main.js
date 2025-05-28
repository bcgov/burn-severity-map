var $b856e6788a7ea5bf$exports = require("./Button.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $846a838139f2ac6b$exports = require("./FieldError.main.js");
var $35157657e549736b$exports = require("./Form.main.js");
var $dcae72abc18c0045$exports = require("./Group.main.js");
var $1bcfcef5af644e13$exports = require("./Input.main.js");
var $84ae0bf5bd8e2a5f$exports = require("./Label.main.js");
var $a8a589c28affdc40$exports = require("./Text.main.js");
var $3iM7b$reactaria = require("react-aria");
var $3iM7b$reactariautils = require("@react-aria/utils");
var $3iM7b$reactstately = require("react-stately");
var $3iM7b$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "NumberFieldContext", () => $177b28eee7968d58$export$b414a48cf5dcbc11);
$parcel$export(module.exports, "NumberFieldStateContext", () => $177b28eee7968d58$export$6cc906c6cff9bec5);
$parcel$export(module.exports, "NumberField", () => $177b28eee7968d58$export$63c5fa0b2fdccd2e);
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











const $177b28eee7968d58$export$b414a48cf5dcbc11 = /*#__PURE__*/ (0, $3iM7b$react.createContext)(null);
const $177b28eee7968d58$export$6cc906c6cff9bec5 = /*#__PURE__*/ (0, $3iM7b$react.createContext)(null);
const $177b28eee7968d58$export$63c5fa0b2fdccd2e = /*#__PURE__*/ (0, $3iM7b$react.forwardRef)(function NumberField(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $177b28eee7968d58$export$b414a48cf5dcbc11);
    let { validationBehavior: formValidationBehavior } = (0, $c5ccf687772c0422$exports.useSlottedContext)((0, $35157657e549736b$exports.FormContext)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let { locale: locale } = (0, $3iM7b$reactaria.useLocale)();
    let state = (0, $3iM7b$reactstately.useNumberFieldState)({
        ...props,
        locale: locale,
        validationBehavior: validationBehavior
    });
    let inputRef = (0, $3iM7b$react.useRef)(null);
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let { labelProps: labelProps, groupProps: groupProps, inputProps: inputProps, incrementButtonProps: incrementButtonProps, decrementButtonProps: decrementButtonProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $3iM7b$reactaria.useNumberField)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        label: label,
        validationBehavior: validationBehavior
    }, state, inputRef);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: {
            state: state,
            isDisabled: props.isDisabled || false,
            isInvalid: validation.isInvalid || false
        },
        defaultClassName: 'react-aria-NumberField'
    });
    let DOMProps = (0, $3iM7b$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($3iM7b$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $177b28eee7968d58$export$6cc906c6cff9bec5,
                state
            ],
            [
                (0, $dcae72abc18c0045$exports.GroupContext),
                groupProps
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
                    ref: labelRef
                }
            ],
            [
                (0, $b856e6788a7ea5bf$exports.ButtonContext),
                {
                    slots: {
                        increment: incrementButtonProps,
                        decrement: decrementButtonProps
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
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($3iM7b$react))).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-disabled": props.isDisabled || undefined,
        "data-invalid": validation.isInvalid || undefined
    }), props.name && /*#__PURE__*/ (0, ($parcel$interopDefault($3iM7b$react))).createElement("input", {
        type: "hidden",
        name: props.name,
        value: isNaN(state.numberValue) ? '' : state.numberValue
    }));
});


//# sourceMappingURL=NumberField.main.js.map
