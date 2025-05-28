import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import {useHover as $9Usiy$useHover, useFocusRing as $9Usiy$useFocusRing, mergeProps as $9Usiy$mergeProps} from "react-aria";
import $9Usiy$react, {createContext as $9Usiy$createContext, forwardRef as $9Usiy$forwardRef} from "react";




const $216918bed6669f72$export$2dc6166a7e65358c = /*#__PURE__*/ (0, $9Usiy$createContext)({});
let $216918bed6669f72$var$filterHoverProps = (props)=>{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let { onHoverStart: onHoverStart, onHoverChange: onHoverChange, onHoverEnd: onHoverEnd, ...otherProps } = props;
    return otherProps;
};
const $216918bed6669f72$export$f5c9f3c2c4054eec = /*#__PURE__*/ (0, $9Usiy$forwardRef)(function TextArea(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $216918bed6669f72$export$2dc6166a7e65358c);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $9Usiy$useHover)(props);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $9Usiy$useFocusRing)({
        isTextInput: true,
        autoFocus: props.autoFocus
    });
    let isInvalid = !!props['aria-invalid'] && props['aria-invalid'] !== 'false';
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            isHovered: isHovered,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isDisabled: props.disabled || false,
            isInvalid: isInvalid
        },
        defaultClassName: 'react-aria-TextArea'
    });
    return /*#__PURE__*/ (0, $9Usiy$react).createElement("textarea", {
        ...(0, $9Usiy$mergeProps)($216918bed6669f72$var$filterHoverProps(props), focusProps, hoverProps),
        ...renderProps,
        ref: ref,
        "data-focused": isFocused || undefined,
        "data-disabled": props.disabled || undefined,
        "data-hovered": isHovered || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-invalid": isInvalid || undefined
    });
});


export {$216918bed6669f72$export$2dc6166a7e65358c as TextAreaContext, $216918bed6669f72$export$f5c9f3c2c4054eec as TextArea};
//# sourceMappingURL=TextArea.module.js.map
