var $b856e6788a7ea5bf$exports = require("./Button.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $525402dfec7da5bc$exports = require("./RSPContexts.main.js");
var $61e2b7078adb18bc$exports = require("./Popover.main.js");
var $a8f6e7d095d1cc86$exports = require("./Menu.main.js");
var $03da9$reactaria = require("react-aria");
var $03da9$reactariautils = require("@react-aria/utils");
var $03da9$reactstately = require("react-stately");
var $03da9$reactariainteractions = require("@react-aria/interactions");
var $03da9$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "DialogContext", () => $2979ab89b336194b$export$8b93a07348a7730c);
$parcel$export(module.exports, "OverlayTriggerStateContext", () => $2979ab89b336194b$export$d2f961adcb0afbe);
$parcel$export(module.exports, "DialogTrigger", () => $2979ab89b336194b$export$2e1e1122cf0cba88);
$parcel$export(module.exports, "Dialog", () => $2979ab89b336194b$export$3ddf2d174ce01153);
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









const $2979ab89b336194b$export$8b93a07348a7730c = /*#__PURE__*/ (0, $03da9$react.createContext)(null);
const $2979ab89b336194b$export$d2f961adcb0afbe = /*#__PURE__*/ (0, $03da9$react.createContext)(null);
function $2979ab89b336194b$export$2e1e1122cf0cba88(props) {
    // Use useMenuTriggerState instead of useOverlayTriggerState in case a menu is embedded in the dialog.
    // This is needed to handle submenus.
    let state = (0, $03da9$reactstately.useMenuTriggerState)(props);
    let buttonRef = (0, $03da9$react.useRef)(null);
    let { triggerProps: triggerProps, overlayProps: overlayProps } = (0, $03da9$reactaria.useOverlayTrigger)({
        type: 'dialog'
    }, state, buttonRef);
    // Label dialog by the trigger as a fallback if there is no title slot.
    // This is done in RAC instead of hooks because otherwise we cannot distinguish
    // between context and props. Normally aria-labelledby overrides the title
    // but when sent by context we want the title to win.
    triggerProps.id = (0, $03da9$reactaria.useId)();
    overlayProps['aria-labelledby'] = triggerProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($03da9$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $2979ab89b336194b$export$d2f961adcb0afbe,
                state
            ],
            [
                (0, $a8f6e7d095d1cc86$exports.RootMenuTriggerStateContext),
                state
            ],
            [
                $2979ab89b336194b$export$8b93a07348a7730c,
                overlayProps
            ],
            [
                (0, $61e2b7078adb18bc$exports.PopoverContext),
                {
                    trigger: 'DialogTrigger',
                    triggerRef: buttonRef
                }
            ]
        ]
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($03da9$react))).createElement((0, $03da9$reactariainteractions.PressResponder), {
        ...triggerProps,
        ref: buttonRef,
        isPressed: state.isOpen
    }, props.children));
}
const $2979ab89b336194b$export$3ddf2d174ce01153 = /*#__PURE__*/ (0, $03da9$react.forwardRef)(function Dialog(props, ref) {
    let originalAriaLabelledby = props['aria-labelledby'];
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $2979ab89b336194b$export$8b93a07348a7730c);
    let { dialogProps: dialogProps, titleProps: titleProps } = (0, $03da9$reactaria.useDialog)({
        ...props,
        // Only pass aria-labelledby from props, not context.
        // Context is used as a fallback below.
        'aria-labelledby': originalAriaLabelledby
    }, ref);
    let state = (0, $03da9$react.useContext)($2979ab89b336194b$export$d2f961adcb0afbe);
    if (!dialogProps['aria-label'] && !dialogProps['aria-labelledby']) {
        // If aria-labelledby exists on props, we know it came from context.
        // Use that as a fallback in case there is no title slot.
        if (props['aria-labelledby']) dialogProps['aria-labelledby'] = props['aria-labelledby'];
        else console.warn('If a Dialog does not contain a <Heading slot="title">, it must have an aria-label or aria-labelledby attribute for accessibility.');
    }
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        defaultClassName: 'react-aria-Dialog',
        className: props.className,
        style: props.style,
        children: props.children,
        values: {
            close: (state === null || state === void 0 ? void 0 : state.close) || (()=>{})
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($03da9$react))).createElement("section", {
        ...(0, $03da9$reactariautils.filterDOMProps)(props),
        ...dialogProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($03da9$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                (0, $525402dfec7da5bc$exports.HeadingContext),
                {
                    slots: {
                        [(0, $c5ccf687772c0422$exports.DEFAULT_SLOT)]: {},
                        title: {
                            ...titleProps,
                            level: 2
                        }
                    }
                }
            ],
            [
                (0, $b856e6788a7ea5bf$exports.ButtonContext),
                {
                    slots: {
                        [(0, $c5ccf687772c0422$exports.DEFAULT_SLOT)]: {},
                        close: {
                            onPress: ()=>state === null || state === void 0 ? void 0 : state.close()
                        }
                    }
                }
            ]
        ]
    }, renderProps.children));
});


//# sourceMappingURL=Dialog.main.js.map
