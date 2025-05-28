var $525402dfec7da5bc$exports = require("./RSPContexts.main.js");
var $846a838139f2ac6b$exports = require("./FieldError.main.js");
var $1bcfcef5af644e13$exports = require("./Input.main.js");
var $84ae0bf5bd8e2a5f$exports = require("./Label.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $a8a589c28affdc40$exports = require("./Text.main.js");
var $jBBea$reactariacolor = require("@react-aria/color");
var $jBBea$reactstatelycolor = require("@react-stately/color");
var $jBBea$reactariautils = require("@react-aria/utils");
var $jBBea$react = require("react");
var $jBBea$reactaria = require("react-aria");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ColorFieldStateContext", () => $266025a3ea7f6c3b$export$96b6d32b05a1a8ed);
$parcel$export(module.exports, "ColorField", () => $266025a3ea7f6c3b$export$b865d4358897bb17);
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










const $266025a3ea7f6c3b$export$96b6d32b05a1a8ed = /*#__PURE__*/ (0, $jBBea$react.createContext)(null);
const $266025a3ea7f6c3b$export$b865d4358897bb17 = /*#__PURE__*/ (0, $jBBea$react.forwardRef)(function ColorField(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, (0, $525402dfec7da5bc$exports.ColorFieldContext));
    if (props.channel) return /*#__PURE__*/ (0, ($parcel$interopDefault($jBBea$react))).createElement($266025a3ea7f6c3b$var$ColorChannelField, {
        ...props,
        channel: props.channel,
        forwardedRef: ref
    });
    else return /*#__PURE__*/ (0, ($parcel$interopDefault($jBBea$react))).createElement($266025a3ea7f6c3b$var$HexColorField, {
        ...props,
        forwardedRef: ref
    });
});
function $266025a3ea7f6c3b$var$ColorChannelField(props) {
    let { locale: locale } = (0, $jBBea$reactaria.useLocale)();
    let state = (0, $jBBea$reactstatelycolor.useColorChannelFieldState)({
        ...props,
        locale: locale
    });
    let inputRef = (0, $jBBea$react.useRef)(null);
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    var _props_validationBehavior;
    let { labelProps: labelProps, inputProps: inputProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $jBBea$reactariacolor.useColorChannelField)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        label: label,
        validationBehavior: (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : 'native'
    }, state, inputRef);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($jBBea$react))).createElement((0, ($parcel$interopDefault($jBBea$react))).Fragment, null, $266025a3ea7f6c3b$var$useChildren(props, state, props.forwardedRef, inputProps, inputRef, labelProps, labelRef, descriptionProps, errorMessageProps, validation), props.name && /*#__PURE__*/ (0, ($parcel$interopDefault($jBBea$react))).createElement("input", {
        type: "hidden",
        name: props.name,
        value: isNaN(state.numberValue) ? '' : state.numberValue
    }));
}
function $266025a3ea7f6c3b$var$HexColorField(props) {
    var _props_validationBehavior;
    let state = (0, $jBBea$reactstatelycolor.useColorFieldState)({
        ...props,
        validationBehavior: (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : 'native'
    });
    let inputRef = (0, $jBBea$react.useRef)(null);
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    var _props_validationBehavior1;
    let { labelProps: labelProps, inputProps: inputProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $jBBea$reactariacolor.useColorField)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        label: label,
        validationBehavior: (_props_validationBehavior1 = props.validationBehavior) !== null && _props_validationBehavior1 !== void 0 ? _props_validationBehavior1 : 'native'
    }, state, inputRef);
    return $266025a3ea7f6c3b$var$useChildren(props, state, props.forwardedRef, inputProps, inputRef, labelProps, labelRef, descriptionProps, errorMessageProps, validation);
}
function $266025a3ea7f6c3b$var$useChildren(props, state, ref, inputProps, inputRef, labelProps, labelRef, descriptionProps, errorMessageProps, validation) {
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: {
            state: state,
            channel: props.channel || 'hex',
            isDisabled: props.isDisabled || false,
            isInvalid: validation.isInvalid || false
        },
        defaultClassName: 'react-aria-ColorField'
    });
    let DOMProps = (0, $jBBea$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($jBBea$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $266025a3ea7f6c3b$export$96b6d32b05a1a8ed,
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
                (0, $84ae0bf5bd8e2a5f$exports.LabelContext),
                {
                    ...labelProps,
                    ref: labelRef
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
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($jBBea$react))).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-channel": props.channel || 'hex',
        "data-disabled": props.isDisabled || undefined,
        "data-invalid": validation.isInvalid || undefined
    }));
}


//# sourceMappingURL=ColorField.main.js.map
