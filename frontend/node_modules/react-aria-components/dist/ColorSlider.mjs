import {ColorSliderContext as $4e85f108e88277b8$export$717b2c0a523a0b53} from "./RSPContexts.mjs";
import {InternalColorThumbContext as $e2b71ec1d6016406$export$c80c0ea2ca5cb846} from "./ColorThumb.mjs";
import {LabelContext as $01b77f81d0f07f68$export$75b6ee27786ba447} from "./Label.mjs";
import {Provider as $64fa3d84918910a7$export$2881499e37b75b9a, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3, useSlot as $64fa3d84918910a7$export$9d4c57ee4c6ffdd8} from "./utils.mjs";
import {SliderOutputContext as $6f909507e6374d18$export$6189c2744041d8f8, SliderStateContext as $6f909507e6374d18$export$1e7083018727fa60, SliderTrackContext as $6f909507e6374d18$export$f1fce0420cc6d8ee} from "./Slider.mjs";
import {useColorSliderState as $bYfIo$useColorSliderState} from "@react-stately/color";
import {filterDOMProps as $bYfIo$filterDOMProps} from "@react-aria/utils";
import {useLocale as $bYfIo$useLocale} from "react-aria";
import $bYfIo$react, {createContext as $bYfIo$createContext, forwardRef as $bYfIo$forwardRef} from "react";
import {useColorSlider as $bYfIo$useColorSlider} from "@react-aria/color";











const $1cca5300a3c2e7f9$export$c7fad7ea00194428 = /*#__PURE__*/ (0, $bYfIo$createContext)(null);
const $1cca5300a3c2e7f9$export$44fd664bcca5b6fb = /*#__PURE__*/ (0, $bYfIo$forwardRef)(function ColorSlider(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, (0, $4e85f108e88277b8$export$717b2c0a523a0b53));
    let { locale: locale } = (0, $bYfIo$useLocale)();
    let state = (0, $bYfIo$useColorSliderState)({
        ...props,
        locale: locale
    });
    let trackRef = (0, $bYfIo$react).useRef(null);
    let inputRef = (0, $bYfIo$react).useRef(null);
    let [labelRef, label] = (0, $64fa3d84918910a7$export$9d4c57ee4c6ffdd8)();
    let { trackProps: trackProps, thumbProps: thumbProps, inputProps: inputProps, labelProps: labelProps, outputProps: outputProps } = (0, $bYfIo$useColorSlider)({
        ...props,
        label: label,
        trackRef: trackRef,
        inputRef: inputRef
    }, state);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        values: {
            orientation: state.orientation,
            isDisabled: state.isDisabled,
            state: state
        },
        defaultClassName: 'react-aria-ColorSlider'
    });
    let DOMProps = (0, $bYfIo$filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, $bYfIo$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $1cca5300a3c2e7f9$export$c7fad7ea00194428,
                state
            ],
            [
                (0, $6f909507e6374d18$export$1e7083018727fa60),
                state
            ],
            [
                (0, $6f909507e6374d18$export$f1fce0420cc6d8ee),
                {
                    ...trackProps,
                    ref: trackRef
                }
            ],
            [
                (0, $6f909507e6374d18$export$6189c2744041d8f8),
                outputProps
            ],
            [
                (0, $01b77f81d0f07f68$export$75b6ee27786ba447),
                {
                    ...labelProps,
                    ref: labelRef,
                    children: state.value.getChannelName(props.channel, locale)
                }
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
    }, /*#__PURE__*/ (0, $bYfIo$react).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-orientation": state.orientation,
        "data-disabled": state.isDisabled || undefined
    }));
});


export {$1cca5300a3c2e7f9$export$c7fad7ea00194428 as ColorSliderStateContext, $1cca5300a3c2e7f9$export$44fd664bcca5b6fb as ColorSlider};
//# sourceMappingURL=ColorSlider.module.js.map
