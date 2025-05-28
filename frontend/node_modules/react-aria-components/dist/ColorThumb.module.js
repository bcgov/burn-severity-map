import {useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import {filterDOMProps as $1Ipl1$filterDOMProps} from "@react-aria/utils";
import {mergeProps as $1Ipl1$mergeProps} from "react-aria";
import $1Ipl1$react, {createContext as $1Ipl1$createContext, forwardRef as $1Ipl1$forwardRef, useContext as $1Ipl1$useContext} from "react";
import {useFocusRing as $1Ipl1$useFocusRing} from "@react-aria/focus";
import {useHover as $1Ipl1$useHover} from "@react-aria/interactions";







const $e2b71ec1d6016406$export$c80c0ea2ca5cb846 = /*#__PURE__*/ (0, $1Ipl1$createContext)(null);
const $e2b71ec1d6016406$export$a3cc47cee1c1ccc = /*#__PURE__*/ (0, $1Ipl1$forwardRef)(function ColorThumb(props, ref) {
    let { state: state, thumbProps: thumbProps, inputXRef: inputXRef, inputYRef: inputYRef, xInputProps: xInputProps, yInputProps: yInputProps, isDisabled: isDisabled = false } = (0, $1Ipl1$useContext)($e2b71ec1d6016406$export$c80c0ea2ca5cb846);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $1Ipl1$useFocusRing)();
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $1Ipl1$useHover)(props);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        defaultClassName: 'react-aria-ColorThumb',
        defaultStyle: {
            ...thumbProps.style,
            backgroundColor: state.getDisplayColor().toString()
        },
        values: {
            color: state.getDisplayColor(),
            isHovered: isHovered,
            isDragging: state.isDragging,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isDisabled: isDisabled
        }
    });
    let DOMProps = (0, $1Ipl1$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $1Ipl1$react).createElement("div", {
        ...(0, $1Ipl1$mergeProps)(thumbProps, hoverProps, DOMProps),
        ...renderProps,
        ref: ref,
        "data-hovered": isHovered || undefined,
        "data-dragging": state.isDragging || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-disabled": isDisabled || undefined
    }, /*#__PURE__*/ (0, $1Ipl1$react).createElement("input", {
        ref: inputXRef,
        ...xInputProps,
        ...focusProps
    }), yInputProps && /*#__PURE__*/ (0, $1Ipl1$react).createElement("input", {
        ref: inputYRef,
        ...yInputProps,
        ...focusProps
    }), renderProps.children);
});


export {$e2b71ec1d6016406$export$c80c0ea2ca5cb846 as InternalColorThumbContext, $e2b71ec1d6016406$export$a3cc47cee1c1ccc as ColorThumb};
//# sourceMappingURL=ColorThumb.module.js.map
