import {ColorAreaContext as $4e85f108e88277b8$export$ebe63fadcdce34ed} from "./RSPContexts.module.js";
import {InternalColorThumbContext as $e2b71ec1d6016406$export$c80c0ea2ca5cb846} from "./ColorThumb.module.js";
import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import {useColorAreaState as $xv8AM$useColorAreaState} from "@react-stately/color";
import {filterDOMProps as $xv8AM$filterDOMProps} from "@react-aria/utils";
import $xv8AM$react, {createContext as $xv8AM$createContext, forwardRef as $xv8AM$forwardRef, useRef as $xv8AM$useRef} from "react";
import {useColorArea as $xv8AM$useColorArea} from "@react-aria/color";








const $0de070065d44825d$export$6b32221de49982e = /*#__PURE__*/ (0, $xv8AM$createContext)(null);
const $0de070065d44825d$export$b2103f68a961418e = /*#__PURE__*/ (0, $xv8AM$forwardRef)(function ColorArea(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, (0, $4e85f108e88277b8$export$ebe63fadcdce34ed));
    let inputXRef = (0, $xv8AM$useRef)(null);
    let inputYRef = (0, $xv8AM$useRef)(null);
    let state = (0, $xv8AM$useColorAreaState)(props);
    let { colorAreaProps: colorAreaProps, xInputProps: xInputProps, yInputProps: yInputProps, thumbProps: thumbProps } = (0, $xv8AM$useColorArea)({
        ...props,
        inputXRef: inputXRef,
        inputYRef: inputYRef,
        containerRef: ref
    }, state);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        defaultClassName: 'react-aria-ColorArea',
        defaultStyle: colorAreaProps.style,
        values: {
            state: state,
            isDisabled: props.isDisabled || false
        }
    });
    let DOMProps = (0, $xv8AM$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $xv8AM$react).createElement("div", {
        ref: ref,
        ...colorAreaProps,
        ...DOMProps,
        ...renderProps,
        slot: props.slot || undefined,
        "data-disabled": props.isDisabled || undefined
    }, /*#__PURE__*/ (0, $xv8AM$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $0de070065d44825d$export$6b32221de49982e,
                state
            ],
            [
                (0, $e2b71ec1d6016406$export$c80c0ea2ca5cb846),
                {
                    state: state,
                    thumbProps: thumbProps,
                    inputXRef: inputXRef,
                    xInputProps: xInputProps,
                    inputYRef: inputYRef,
                    yInputProps: yInputProps,
                    isDisabled: props.isDisabled
                }
            ]
        ]
    }, renderProps.children));
});


export {$0de070065d44825d$export$6b32221de49982e as ColorAreaStateContext, $0de070065d44825d$export$b2103f68a961418e as ColorArea};
//# sourceMappingURL=ColorArea.module.js.map
