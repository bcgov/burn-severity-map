import {ColorWheelContext as $4e85f108e88277b8$export$265015d6dc85bf21} from "./RSPContexts.module.js";
import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import {InternalColorThumbContext as $e2b71ec1d6016406$export$c80c0ea2ca5cb846} from "./ColorThumb.module.js";
import {useColorWheel as $fp8U1$useColorWheel} from "@react-aria/color";
import {useColorWheelState as $fp8U1$useColorWheelState} from "@react-stately/color";
import {filterDOMProps as $fp8U1$filterDOMProps} from "@react-aria/utils";
import $fp8U1$react, {createContext as $fp8U1$createContext, forwardRef as $fp8U1$forwardRef, useRef as $fp8U1$useRef, useContext as $fp8U1$useContext} from "react";








const $66beab92e74e495f$export$f5327df9fc840d47 = /*#__PURE__*/ (0, $fp8U1$createContext)(null);
const $66beab92e74e495f$export$f80663f808113381 = /*#__PURE__*/ (0, $fp8U1$forwardRef)(function ColorWheel(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, (0, $4e85f108e88277b8$export$265015d6dc85bf21));
    let state = (0, $fp8U1$useColorWheelState)(props);
    let inputRef = (0, $fp8U1$useRef)(null);
    let { trackProps: trackProps, inputProps: inputProps, thumbProps: thumbProps } = (0, $fp8U1$useColorWheel)(props, state, inputRef);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            state: state,
            isDisabled: props.isDisabled || false
        },
        defaultClassName: 'react-aria-ColorWheel',
        defaultStyle: {
            position: 'relative'
        }
    });
    let DOMProps = (0, $fp8U1$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $fp8U1$react).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-disabled": props.isDisabled || undefined
    }, /*#__PURE__*/ (0, $fp8U1$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $66beab92e74e495f$export$f5327df9fc840d47,
                state
            ],
            [
                $66beab92e74e495f$export$aec8299548648839,
                trackProps
            ],
            [
                (0, $e2b71ec1d6016406$export$c80c0ea2ca5cb846),
                {
                    state: state,
                    thumbProps: thumbProps,
                    inputXRef: inputRef,
                    xInputProps: inputProps,
                    isDisabled: props.isDisabled
                }
            ]
        ]
    }, renderProps.children));
});
const $66beab92e74e495f$export$aec8299548648839 = /*#__PURE__*/ (0, $fp8U1$createContext)(null);
const $66beab92e74e495f$export$aaae3dd1f909c692 = /*#__PURE__*/ (0, $fp8U1$forwardRef)(function ColorWheelTrack(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $66beab92e74e495f$export$aec8299548648839);
    let state = (0, $fp8U1$useContext)($66beab92e74e495f$export$f5327df9fc840d47);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        defaultClassName: 'react-aria-ColorWheelTrack',
        values: {
            isDisabled: state.isDisabled,
            state: state
        }
    });
    return /*#__PURE__*/ (0, $fp8U1$react).createElement("div", {
        ...props,
        ...renderProps,
        ref: ref,
        "data-disabled": state.isDisabled || undefined
    });
});


export {$66beab92e74e495f$export$f5327df9fc840d47 as ColorWheelStateContext, $66beab92e74e495f$export$f80663f808113381 as ColorWheel, $66beab92e74e495f$export$aec8299548648839 as ColorWheelTrackContext, $66beab92e74e495f$export$aaae3dd1f909c692 as ColorWheelTrack};
//# sourceMappingURL=ColorWheel.module.js.map
