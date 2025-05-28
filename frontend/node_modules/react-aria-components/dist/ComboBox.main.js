var $b856e6788a7ea5bf$exports = require("./Button.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $846a838139f2ac6b$exports = require("./FieldError.main.js");
var $35157657e549736b$exports = require("./Form.main.js");
var $dcae72abc18c0045$exports = require("./Group.main.js");
var $1bcfcef5af644e13$exports = require("./Input.main.js");
var $84ae0bf5bd8e2a5f$exports = require("./Label.main.js");
var $a03b42240404b420$exports = require("./ListBox.main.js");
var $2979ab89b336194b$exports = require("./Dialog.main.js");
var $61e2b7078adb18bc$exports = require("./Popover.main.js");
var $a8a589c28affdc40$exports = require("./Text.main.js");
var $9obPC$reactaria = require("react-aria");
var $9obPC$reactstately = require("react-stately");
var $9obPC$reactariacollections = require("@react-aria/collections");
var $9obPC$reactariautils = require("@react-aria/utils");
var $9obPC$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ComboBoxContext", () => $1d716ce69f118fad$export$d414ccceff7063c3);
$parcel$export(module.exports, "ComboBoxStateContext", () => $1d716ce69f118fad$export$c02625b26074192c);
$parcel$export(module.exports, "ComboBox", () => $1d716ce69f118fad$export$72b9695b8216309a);
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















const $1d716ce69f118fad$export$d414ccceff7063c3 = /*#__PURE__*/ (0, $9obPC$react.createContext)(null);
const $1d716ce69f118fad$export$c02625b26074192c = /*#__PURE__*/ (0, $9obPC$react.createContext)(null);
const $1d716ce69f118fad$export$72b9695b8216309a = /*#__PURE__*/ (0, $9obPC$react.forwardRef)(function ComboBox(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $1d716ce69f118fad$export$d414ccceff7063c3);
    let { children: children, isDisabled: isDisabled = false, isInvalid: isInvalid = false, isRequired: isRequired = false } = props;
    let content = (0, $9obPC$react.useMemo)(()=>{
        var _props_items;
        return /*#__PURE__*/ (0, ($parcel$interopDefault($9obPC$react))).createElement((0, $a03b42240404b420$exports.ListBoxContext).Provider, {
            value: {
                items: (_props_items = props.items) !== null && _props_items !== void 0 ? _props_items : props.defaultItems
            }
        }, typeof children === 'function' ? children({
            isOpen: false,
            isDisabled: isDisabled,
            isInvalid: isInvalid,
            isRequired: isRequired,
            defaultChildren: null
        }) : children);
    }, [
        children,
        isDisabled,
        isInvalid,
        isRequired,
        props.items,
        props.defaultItems
    ]);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($9obPC$react))).createElement((0, $9obPC$reactariacollections.CollectionBuilder), {
        content: content
    }, (collection)=>/*#__PURE__*/ (0, ($parcel$interopDefault($9obPC$react))).createElement($1d716ce69f118fad$var$ComboBoxInner, {
            props: props,
            collection: collection,
            comboBoxRef: ref
        }));
});
function $1d716ce69f118fad$var$ComboBoxInner({ props: props, collection: collection, comboBoxRef: ref }) {
    let { name: name, formValue: formValue = 'key', allowsCustomValue: allowsCustomValue } = props;
    if (allowsCustomValue) formValue = 'text';
    let { validationBehavior: formValidationBehavior } = (0, $c5ccf687772c0422$exports.useSlottedContext)((0, $35157657e549736b$exports.FormContext)) || {};
    var _props_validationBehavior, _ref;
    let validationBehavior = (_ref = (_props_validationBehavior = props.validationBehavior) !== null && _props_validationBehavior !== void 0 ? _props_validationBehavior : formValidationBehavior) !== null && _ref !== void 0 ? _ref : 'native';
    let { contains: contains } = (0, $9obPC$reactaria.useFilter)({
        sensitivity: 'base'
    });
    let state = (0, $9obPC$reactstately.useComboBoxState)({
        defaultFilter: props.defaultFilter || contains,
        ...props,
        // If props.items isn't provided, rely on collection filtering (aka listbox.items is provided or defaultItems provided to Combobox)
        items: props.items,
        children: undefined,
        collection: collection,
        validationBehavior: validationBehavior
    });
    let buttonRef = (0, $9obPC$react.useRef)(null);
    let inputRef = (0, $9obPC$react.useRef)(null);
    let listBoxRef = (0, $9obPC$react.useRef)(null);
    let popoverRef = (0, $9obPC$react.useRef)(null);
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let { buttonProps: buttonProps, inputProps: inputProps, listBoxProps: listBoxProps, labelProps: labelProps, descriptionProps: descriptionProps, errorMessageProps: errorMessageProps, ...validation } = (0, $9obPC$reactaria.useComboBox)({
        ...(0, $c5ccf687772c0422$exports.removeDataAttributes)(props),
        label: label,
        inputRef: inputRef,
        buttonRef: buttonRef,
        listBoxRef: listBoxRef,
        popoverRef: popoverRef,
        name: formValue === 'text' ? name : undefined,
        validationBehavior: validationBehavior
    }, state);
    // Make menu width match input + button
    let [menuWidth, setMenuWidth] = (0, $9obPC$react.useState)(null);
    let onResize = (0, $9obPC$react.useCallback)(()=>{
        if (inputRef.current) {
            var _buttonRef_current;
            let buttonRect = (_buttonRef_current = buttonRef.current) === null || _buttonRef_current === void 0 ? void 0 : _buttonRef_current.getBoundingClientRect();
            let inputRect = inputRef.current.getBoundingClientRect();
            let minX = buttonRect ? Math.min(buttonRect.left, inputRect.left) : inputRect.left;
            let maxX = buttonRect ? Math.max(buttonRect.right, inputRect.right) : inputRect.right;
            setMenuWidth(maxX - minX + 'px');
        }
    }, [
        buttonRef,
        inputRef,
        setMenuWidth
    ]);
    (0, $9obPC$reactariautils.useResizeObserver)({
        ref: inputRef,
        onResize: onResize
    });
    // Only expose a subset of state to renderProps function to avoid infinite render loop
    let renderPropsState = (0, $9obPC$react.useMemo)(()=>({
            isOpen: state.isOpen,
            isDisabled: props.isDisabled || false,
            isInvalid: validation.isInvalid || false,
            isRequired: props.isRequired || false
        }), [
        state.isOpen,
        props.isDisabled,
        validation.isInvalid,
        props.isRequired
    ]);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: renderPropsState,
        defaultClassName: 'react-aria-ComboBox'
    });
    let DOMProps = (0, $9obPC$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    var _state_selectedKey;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($9obPC$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $1d716ce69f118fad$export$c02625b26074192c,
                state
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
                    ...buttonProps,
                    ref: buttonRef,
                    isPressed: state.isOpen
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
                (0, $2979ab89b336194b$exports.OverlayTriggerStateContext),
                state
            ],
            [
                (0, $61e2b7078adb18bc$exports.PopoverContext),
                {
                    ref: popoverRef,
                    triggerRef: inputRef,
                    scrollRef: listBoxRef,
                    placement: 'bottom start',
                    isNonModal: true,
                    trigger: 'ComboBox',
                    style: {
                        '--trigger-width': menuWidth
                    }
                }
            ],
            [
                (0, $a03b42240404b420$exports.ListBoxContext),
                {
                    ...listBoxProps,
                    ref: listBoxRef
                }
            ],
            [
                (0, $a03b42240404b420$exports.ListStateContext),
                state
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
                (0, $dcae72abc18c0045$exports.GroupContext),
                {
                    isInvalid: validation.isInvalid,
                    isDisabled: props.isDisabled || false
                }
            ],
            [
                (0, $846a838139f2ac6b$exports.FieldErrorContext),
                validation
            ]
        ]
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($9obPC$react))).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-focused": state.isFocused || undefined,
        "data-open": state.isOpen || undefined,
        "data-disabled": props.isDisabled || undefined,
        "data-invalid": validation.isInvalid || undefined,
        "data-required": props.isRequired || undefined
    }), name && formValue === 'key' && /*#__PURE__*/ (0, ($parcel$interopDefault($9obPC$react))).createElement("input", {
        type: "hidden",
        name: name,
        value: (_state_selectedKey = state.selectedKey) !== null && _state_selectedKey !== void 0 ? _state_selectedKey : ''
    }));
}


//# sourceMappingURL=ComboBox.main.js.map
