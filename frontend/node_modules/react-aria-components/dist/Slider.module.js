import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3, useSlot as $64fa3d84918910a7$export$9d4c57ee4c6ffdd8, useSlottedContext as $64fa3d84918910a7$export$fabf2dc03a41866e} from "./utils.module.js";
import {LabelContext as $01b77f81d0f07f68$export$75b6ee27786ba447} from "./Label.module.js";
import {useNumberFormatter as $6YMke$useNumberFormatter, useSlider as $6YMke$useSlider, useHover as $6YMke$useHover, mergeProps as $6YMke$mergeProps, useSliderThumb as $6YMke$useSliderThumb, useFocusRing as $6YMke$useFocusRing, VisuallyHidden as $6YMke$VisuallyHidden} from "react-aria";
import {filterDOMProps as $6YMke$filterDOMProps} from "@react-aria/utils";
import $6YMke$react, {createContext as $6YMke$createContext, forwardRef as $6YMke$forwardRef, useRef as $6YMke$useRef, useContext as $6YMke$useContext} from "react";
import {useSliderState as $6YMke$useSliderState} from "react-stately";

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





const $6f909507e6374d18$export$e99164f0030f3bff = /*#__PURE__*/ (0, $6YMke$createContext)(null);
const $6f909507e6374d18$export$1e7083018727fa60 = /*#__PURE__*/ (0, $6YMke$createContext)(null);
const $6f909507e6374d18$export$f1fce0420cc6d8ee = /*#__PURE__*/ (0, $6YMke$createContext)(null);
const $6f909507e6374d18$export$6189c2744041d8f8 = /*#__PURE__*/ (0, $6YMke$createContext)(null);
const $6f909507e6374d18$export$472062a354075cee = /*#__PURE__*/ (0, $6YMke$forwardRef)(function Slider(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $6f909507e6374d18$export$e99164f0030f3bff);
    let trackRef = (0, $6YMke$useRef)(null);
    let numberFormatter = (0, $6YMke$useNumberFormatter)(props.formatOptions);
    let state = (0, $6YMke$useSliderState)({
        ...props,
        numberFormatter: numberFormatter
    });
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let { groupProps: groupProps, trackProps: trackProps, labelProps: labelProps, outputProps: outputProps } = (0, $6YMke$useSlider)({
        ...props,
        label: label
    }, state, trackRef);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            orientation: state.orientation,
            isDisabled: state.isDisabled,
            state: state
        },
        defaultClassName: 'react-aria-Slider'
    });
    let DOMProps = (0, $6YMke$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $6YMke$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $6f909507e6374d18$export$1e7083018727fa60,
                state
            ],
            [
                $6f909507e6374d18$export$f1fce0420cc6d8ee,
                {
                    ...trackProps,
                    ref: trackRef
                }
            ],
            [
                $6f909507e6374d18$export$6189c2744041d8f8,
                outputProps
            ],
            [
                (0, $01b77f81d0f07f68$export$75b6ee27786ba447),
                {
                    ...labelProps,
                    ref: labelRef
                }
            ]
        ]
    }, /*#__PURE__*/ (0, $6YMke$react).createElement("div", {
        ...DOMProps,
        ...groupProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-orientation": state.orientation,
        "data-disabled": state.isDisabled || undefined
    }));
});
const $6f909507e6374d18$export$a590f758a961cb5b = /*#__PURE__*/ (0, $6YMke$forwardRef)(function SliderOutput(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $6f909507e6374d18$export$6189c2744041d8f8);
    let { children: children, style: style, className: className, ...otherProps } = props;
    let state = (0, $6YMke$useContext)($6f909507e6374d18$export$1e7083018727fa60);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
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
    return /*#__PURE__*/ (0, $6YMke$react).createElement("output", {
        ...otherProps,
        ...renderProps,
        ref: ref,
        "data-orientation": state.orientation || undefined,
        "data-disabled": state.isDisabled || undefined
    });
});
const $6f909507e6374d18$export$105594979f116971 = /*#__PURE__*/ (0, $6YMke$forwardRef)(function SliderTrack(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $6f909507e6374d18$export$f1fce0420cc6d8ee);
    let state = (0, $6YMke$useContext)($6f909507e6374d18$export$1e7083018727fa60);
    let { onHoverStart: onHoverStart, onHoverEnd: onHoverEnd, onHoverChange: onHoverChange, ...otherProps } = props;
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $6YMke$useHover)({
        onHoverStart: onHoverStart,
        onHoverEnd: onHoverEnd,
        onHoverChange: onHoverChange
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        defaultClassName: 'react-aria-SliderTrack',
        values: {
            orientation: state.orientation,
            isDisabled: state.isDisabled,
            isHovered: isHovered,
            state: state
        }
    });
    return /*#__PURE__*/ (0, $6YMke$react).createElement("div", {
        ...(0, $6YMke$mergeProps)(otherProps, hoverProps),
        ...renderProps,
        ref: ref,
        "data-hovered": isHovered || undefined,
        "data-orientation": state.orientation || undefined,
        "data-disabled": state.isDisabled || undefined
    });
});
const $6f909507e6374d18$export$2c1b491743890dec = /*#__PURE__*/ (0, $6YMke$forwardRef)(function SliderThumb(props, ref) {
    let { inputRef: userInputRef = null } = props;
    let state = (0, $6YMke$useContext)($6f909507e6374d18$export$1e7083018727fa60);
    let { ref: trackRef } = (0, $64fa3d84918910a7$export$fabf2dc03a41866e)($6f909507e6374d18$export$f1fce0420cc6d8ee);
    let { index: index = 0 } = props;
    let defaultInputRef = (0, $6YMke$useRef)(null);
    let inputRef = userInputRef || defaultInputRef;
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let { thumbProps: thumbProps, inputProps: inputProps, labelProps: labelProps, isDragging: isDragging, isFocused: isFocused, isDisabled: isDisabled } = (0, $6YMke$useSliderThumb)({
        ...props,
        index: index,
        trackRef: trackRef,
        inputRef: inputRef,
        label: label
    }, state);
    let { focusProps: focusProps, isFocusVisible: isFocusVisible } = (0, $6YMke$useFocusRing)();
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $6YMke$useHover)(props);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
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
    let DOMProps = (0, $6YMke$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $6YMke$react).createElement("div", {
        ...(0, $6YMke$mergeProps)(DOMProps, thumbProps, hoverProps),
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
    }, /*#__PURE__*/ (0, $6YMke$react).createElement((0, $6YMke$VisuallyHidden), null, /*#__PURE__*/ (0, $6YMke$react).createElement("input", {
        ref: inputRef,
        ...(0, $6YMke$mergeProps)(inputProps, focusProps)
    })), /*#__PURE__*/ (0, $6YMke$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                (0, $01b77f81d0f07f68$export$75b6ee27786ba447),
                {
                    ...labelProps,
                    ref: labelRef
                }
            ]
        ]
    }, renderProps.children));
});


export {$6f909507e6374d18$export$e99164f0030f3bff as SliderContext, $6f909507e6374d18$export$1e7083018727fa60 as SliderStateContext, $6f909507e6374d18$export$f1fce0420cc6d8ee as SliderTrackContext, $6f909507e6374d18$export$6189c2744041d8f8 as SliderOutputContext, $6f909507e6374d18$export$472062a354075cee as Slider, $6f909507e6374d18$export$a590f758a961cb5b as SliderOutput, $6f909507e6374d18$export$105594979f116971 as SliderTrack, $6f909507e6374d18$export$2c1b491743890dec as SliderThumb};
//# sourceMappingURL=Slider.module.js.map
