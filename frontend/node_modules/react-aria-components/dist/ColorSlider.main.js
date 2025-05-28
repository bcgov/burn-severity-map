var $525402dfec7da5bc$exports = require("./RSPContexts.main.js");
var $9775047c98afa2ef$exports = require("./ColorThumb.main.js");
var $84ae0bf5bd8e2a5f$exports = require("./Label.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $b7152ce4839d0838$exports = require("./Slider.main.js");
var $cPSMR$reactstatelycolor = require("@react-stately/color");
var $cPSMR$reactariautils = require("@react-aria/utils");
var $cPSMR$reactaria = require("react-aria");
var $cPSMR$react = require("react");
var $cPSMR$reactariacolor = require("@react-aria/color");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ColorSliderStateContext", () => $037f8448dff48149$export$c7fad7ea00194428);
$parcel$export(module.exports, "ColorSlider", () => $037f8448dff48149$export$44fd664bcca5b6fb);










const $037f8448dff48149$export$c7fad7ea00194428 = /*#__PURE__*/ (0, $cPSMR$react.createContext)(null);
const $037f8448dff48149$export$44fd664bcca5b6fb = /*#__PURE__*/ (0, $cPSMR$react.forwardRef)(function ColorSlider(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, (0, $525402dfec7da5bc$exports.ColorSliderContext));
    let { locale: locale } = (0, $cPSMR$reactaria.useLocale)();
    let state = (0, $cPSMR$reactstatelycolor.useColorSliderState)({
        ...props,
        locale: locale
    });
    let trackRef = (0, ($parcel$interopDefault($cPSMR$react))).useRef(null);
    let inputRef = (0, ($parcel$interopDefault($cPSMR$react))).useRef(null);
    let [labelRef, label] = (0, $c5ccf687772c0422$exports.useSlot)();
    let { trackProps: trackProps, thumbProps: thumbProps, inputProps: inputProps, labelProps: labelProps, outputProps: outputProps } = (0, $cPSMR$reactariacolor.useColorSlider)({
        ...props,
        label: label,
        trackRef: trackRef,
        inputRef: inputRef
    }, state);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: {
            orientation: state.orientation,
            isDisabled: state.isDisabled,
            state: state
        },
        defaultClassName: 'react-aria-ColorSlider'
    });
    let DOMProps = (0, $cPSMR$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($cPSMR$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $037f8448dff48149$export$c7fad7ea00194428,
                state
            ],
            [
                (0, $b7152ce4839d0838$exports.SliderStateContext),
                state
            ],
            [
                (0, $b7152ce4839d0838$exports.SliderTrackContext),
                {
                    ...trackProps,
                    ref: trackRef
                }
            ],
            [
                (0, $b7152ce4839d0838$exports.SliderOutputContext),
                outputProps
            ],
            [
                (0, $84ae0bf5bd8e2a5f$exports.LabelContext),
                {
                    ...labelProps,
                    ref: labelRef,
                    children: state.value.getChannelName(props.channel, locale)
                }
            ],
            [
                (0, $9775047c98afa2ef$exports.InternalColorThumbContext),
                {
                    state: state,
                    thumbProps: thumbProps,
                    inputXRef: inputRef,
                    xInputProps: inputProps,
                    isDisabled: props.isDisabled
                }
            ]
        ]
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($cPSMR$react))).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-orientation": state.orientation,
        "data-disabled": state.isDisabled || undefined
    }));
});


//# sourceMappingURL=ColorSlider.main.js.map
