var $c5ccf687772c0422$exports = require("./utils.main.js");
var $d72d752ea1c67b9a$exports = require("./intlStrings.main.js");
var $a8a589c28affdc40$exports = require("./Text.main.js");
var $iiEmS$reactaria = require("react-aria");
var $iiEmS$reactariautils = require("@react-aria/utils");
var $iiEmS$reactariafocus = require("@react-aria/focus");
var $iiEmS$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "DropZoneContext", () => $80a65baccb138f12$export$14a72053295ff9a6);
$parcel$export(module.exports, "DropZone", () => $80a65baccb138f12$export$3c6489d84dc98b6);
/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 






const $80a65baccb138f12$export$14a72053295ff9a6 = /*#__PURE__*/ (0, $iiEmS$react.createContext)(null);
const $80a65baccb138f12$export$3c6489d84dc98b6 = /*#__PURE__*/ (0, $iiEmS$react.forwardRef)(function DropZone(props, ref) {
    let { isDisabled: isDisabled = false } = props;
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $80a65baccb138f12$export$14a72053295ff9a6);
    let dropzoneRef = (0, $iiEmS$reactariautils.useObjectRef)(ref);
    let buttonRef = (0, $iiEmS$react.useRef)(null);
    let { dropProps: dropProps, dropButtonProps: dropButtonProps, isDropTarget: isDropTarget } = (0, $iiEmS$reactaria.useDrop)({
        ...props,
        ref: buttonRef,
        hasDropButton: true
    });
    let { buttonProps: buttonProps } = (0, $iiEmS$reactaria.useButton)(dropButtonProps || {}, buttonRef);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $iiEmS$reactaria.useHover)(props);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $iiEmS$reactaria.useFocusRing)();
    let stringFormatter = (0, $iiEmS$reactaria.useLocalizedStringFormatter)((0, ($parcel$interopDefault($d72d752ea1c67b9a$exports))), 'react-aria-components');
    let textId = (0, $iiEmS$reactariautils.useSlotId)();
    let ariaLabel = props['aria-label'] || stringFormatter.format('dropzoneLabel');
    let messageId = props['aria-labelledby'];
    let ariaLabelledby = [
        textId,
        messageId
    ].filter(Boolean).join(' ');
    let labelProps = (0, $iiEmS$reactariautils.useLabels)({
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby
    });
    let { clipboardProps: clipboardProps } = (0, $iiEmS$reactaria.useClipboard)({
        isDisabled: isDisabled,
        onPaste: (items)=>{
            var _props_onDrop;
            return (_props_onDrop = props.onDrop) === null || _props_onDrop === void 0 ? void 0 : _props_onDrop.call(props, {
                type: 'drop',
                items: items,
                x: 0,
                y: 0,
                dropOperation: 'copy'
            });
        }
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: {
            isHovered: isHovered,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isDropTarget: isDropTarget,
            isDisabled: isDisabled
        },
        defaultClassName: 'react-aria-DropZone'
    });
    let DOMProps = (0, $iiEmS$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($iiEmS$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                (0, $a8a589c28affdc40$exports.TextContext),
                {
                    id: textId,
                    slot: 'label'
                }
            ]
        ]
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($iiEmS$react))).createElement("div", {
        ...(0, $iiEmS$reactaria.mergeProps)(dropProps, hoverProps, DOMProps),
        ...renderProps,
        slot: props.slot || undefined,
        ref: dropzoneRef,
        onClick: (e)=>{
            var _dropzoneRef_current;
            let target = e.target;
            while(target && ((_dropzoneRef_current = dropzoneRef.current) === null || _dropzoneRef_current === void 0 ? void 0 : _dropzoneRef_current.contains(target))){
                if ((0, $iiEmS$reactariafocus.isFocusable)(target)) break;
                else if (target === dropzoneRef.current) {
                    var _buttonRef_current;
                    (_buttonRef_current = buttonRef.current) === null || _buttonRef_current === void 0 ? void 0 : _buttonRef_current.focus();
                    break;
                }
                target = target.parentElement;
            }
        },
        "data-hovered": isHovered || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-drop-target": isDropTarget || undefined,
        "data-disabled": isDisabled || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($iiEmS$react))).createElement((0, $iiEmS$reactaria.VisuallyHidden), null, /*#__PURE__*/ (0, ($parcel$interopDefault($iiEmS$react))).createElement("button", {
        ...(0, $iiEmS$reactaria.mergeProps)(buttonProps, focusProps, clipboardProps, labelProps),
        ref: buttonRef
    })), renderProps.children));
});


//# sourceMappingURL=DropZone.main.js.map
