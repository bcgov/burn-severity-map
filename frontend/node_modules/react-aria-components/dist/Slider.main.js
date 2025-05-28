var $c5ccf687772c0422$exports = require("./utils.main.js");
var $84ae0bf5bd8e2a5f$exports = require("./Label.main.js");
var $e0QX4$reactaria = require("react-aria");
var $e0QX4$reactariautils = require("@react-aria/utils");
var $e0QX4$react = require("react");
var $e0QX4$reactstately = require("react-stately");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "SliderContext", () => $b7152ce4839d0838$export$e99164f0030f3bff);
$parcel$export(module.exports, "SliderStateContext", () => $b7152ce4839d0838$export$1e7083018727fa60);
$parcel$export(module.exports, "SliderTrackContext", () => $b7152ce4839d0838$export$f1fce0420cc6d8ee);
$parcel$export(module.exports, "SliderOutputContext", () => $b7152ce4839d0838$export$6189c2744041d8f8);
$parcel$export(module.exports, "Slider", () => $b7152ce4839d0838$export$472062a354075cee);
$parcel$export(module.exports, "SliderOutput", () => $b7152ce4839d0838$export$a590f758a961cb5b);
$parcel$export(module.exports, "SliderTrack", () => $b7152ce4839d0838$export$105594979f116971);
$parcel$export(module.exports, "SliderThumb", () => $b7152ce4839d0838$export$2c1b491743890dec);
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





const $b7152ce4839d0838$export$e99164f0030f3bff = /*#__PURE__*/ (0, $e0QX4$react.createContext)(null);
const $b7152ce4839d0838$export$1e7083018727fa60 = /*#__PURE__*/ (0, $e0QX4$react.createContext)(null);
const $b7152ce4839d0838$export$f1fce0420cc6d8ee = /*#__PURE__*/ (0, $e0QX4$react.createContext)(null);
const $b7152ce4839d0838$export$6189c2744041d8f8 = /*#__PURE__*/ (0, $e0QX4$react.createContext)(null);
const $b7152ce4839d0838$export$472062a354075cee = /*#__PURE__*/ (0, $e0QX4$react.forwardRef)(function Slider(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $b7152ce4839d0838$export$e99164f0030f3bff);
    let trackRef = (0, $e0QX4$react.useRef)(null);
    let numberFormatter = (0, $e0QX4$reactaria.useNumberFormatter)(props.formatOptions);
    let state = (0, $e0QX4$reactstately.useSliderState)({
        ...props,
        numberFormatter: numberFormatter
    });
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let { groupProps: groupProps, trackProps: trackProps, labelProps: labelProps, outputProps: outputProps } = (0, $e0QX4$reactaria.useSlider)({
        ...props,
        label: label
    }, state, trackRef);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: {
            orientation: state.orientation,
            isDisabled: state.isDisabled,
            state: state
        },
        defaultClassName: 'react-aria-Slider'
    });
    let DOMProps = (0, $e0QX4$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($e0QX4$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $b7152ce4839d0838$export$1e7083018727fa60,
                state
            ],
            [
                $b7152ce4839d0838$export$f1fce0420cc6d8ee,
                {
                    ...trackProps,
                    ref: trackRef
                }
            ],
            [
                $b7152ce4839d0838$export$6189c2744041d8f8,
                outputProps
            ],
            [
                (0, $84ae0bf5bd8e2a5f$exports.LabelContext),
                {
                    ...labelProps,
                    ref: labelRef
                }
            ]
        ]
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($e0QX4$react))).createElement("div", {
        ...DOMProps,
        ...groupProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-orientation": state.orientation,
        "data-disabled": state.isDisabled || undefined
    }));
});
const $b7152ce4839d0838$export$a590f758a961cb5b = /*#__PURE__*/ (0, $e0QX4$react.forwardRef)(function SliderOutput(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $b7152ce4839d0838$export$6189c2744041d8f8);
    let { children: children, style: style, className: className, ...otherProps } = props;
    let state = (0, $e0QX4$react.useContext)($b7152ce4839d0838$export$1e7083018727fa60);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        className: className,
        style: style,
        children: children,
        defaultChildren: state.getThumbValueLabel(0),
        defaultClassName: 'react-aria-SliderOutput',
        values: {
            orientation: state.orientation,
            isDisabled: state.isDisabled,
            state: state
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($e0QX4$react))).createElement("output", {
        ...otherProps,
        ...renderProps,
        ref: ref,
        "data-orientation": state.orientation || undefined,
        "data-disabled": state.isDisabled || undefined
    });
});
const $b7152ce4839d0838$export$105594979f116971 = /*#__PURE__*/ (0, $e0QX4$react.forwardRef)(function SliderTrack(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $b7152ce4839d0838$export$f1fce0420cc6d8ee);
    let state = (0, $e0QX4$react.useContext)($b7152ce4839d0838$export$1e7083018727fa60);
    let { onHoverStart: onHoverStart, onHoverEnd: onHoverEnd, onHoverChange: onHoverChange, ...otherProps } = props;
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $e0QX4$reactaria.useHover)({
        onHoverStart: onHoverStart,
        onHoverEnd: onHoverEnd,
        onHoverChange: onHoverChange
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-SliderTrack',
        values: {
            orientation: state.orientation,
            isDisabled: state.isDisabled,
            isHovered: isHovered,
            state: state
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($e0QX4$react))).createElement("div", {
        ...(0, $e0QX4$reactaria.mergeProps)(otherProps, hoverProps),
        ...renderProps,
        ref: ref,
        "data-hovered": isHovered || undefined,
        "data-orientation": state.orientation || undefined,
        "data-disabled": state.isDisabled || undefined
    });
});
const $b7152ce4839d0838$export$2c1b491743890dec = /*#__PURE__*/ (0, $e0QX4$react.forwardRef)(function SliderThumb(props, ref) {
    let { inputRef: userInputRef = null } = props;
    let state = (0, $e0QX4$react.useContext)($b7152ce4839d0838$export$1e7083018727fa60);
    let { ref: trackRef } = (0, $c5ccf687772c0422$exports.useSlottedContext)($b7152ce4839d0838$export$f1fce0420cc6d8ee);
    let { index: index = 0 } = props;
    let defaultInputRef = (0, $e0QX4$react.useRef)(null);
    let inputRef = userInputRef || defaultInputRef;
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let { thumbProps: thumbProps, inputProps: inputProps, labelProps: labelProps, isDragging: isDragging, isFocused: isFocused, isDisabled: isDisabled } = (0, $e0QX4$reactaria.useSliderThumb)({
        ...props,
        index: index,
        trackRef: trackRef,
        inputRef: inputRef,
        label: label
    }, state);
    let { focusProps: focusProps, isFocusVisible: isFocusVisible } = (0, $e0QX4$reactaria.useFocusRing)();
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $e0QX4$reactaria.useHover)(props);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-SliderThumb',
        values: {
            state: state,
            isHovered: isHovered,
            isDragging: isDragging,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isDisabled: isDisabled
        }
    });
    let DOMProps = (0, $e0QX4$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($e0QX4$react))).createElement("div", {
        ...(0, $e0QX4$reactaria.mergeProps)(DOMProps, thumbProps, hoverProps),
        ...renderProps,
        ref: ref,
        style: {
            ...thumbProps.style,
            ...renderProps.style
        },
        "data-hovered": isHovered || undefined,
        "data-dragging": isDragging || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-disabled": isDisabled || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($e0QX4$react))).createElement((0, $e0QX4$reactaria.VisuallyHidden), null, /*#__PURE__*/ (0, ($parcel$interopDefault($e0QX4$react))).createElement("input", {
        ref: inputRef,
        ...(0, $e0QX4$reactaria.mergeProps)(inputProps, focusProps)
    })), /*#__PURE__*/ (0, ($parcel$interopDefault($e0QX4$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                (0, $84ae0bf5bd8e2a5f$exports.LabelContext),
                {
                    ...labelProps,
                    ref: labelRef
                }
            ]
        ]
    }, renderProps.children));
});


//# sourceMappingURL=Slider.main.js.map
