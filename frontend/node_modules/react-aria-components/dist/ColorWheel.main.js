var $525402dfec7da5bc$exports = require("./RSPContexts.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $9775047c98afa2ef$exports = require("./ColorThumb.main.js");
var $k1tmY$reactariacolor = require("@react-aria/color");
var $k1tmY$reactstatelycolor = require("@react-stately/color");
var $k1tmY$reactariautils = require("@react-aria/utils");
var $k1tmY$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ColorWheelStateContext", () => $85ae22f3b2559b04$export$f5327df9fc840d47);
$parcel$export(module.exports, "ColorWheel", () => $85ae22f3b2559b04$export$f80663f808113381);
$parcel$export(module.exports, "ColorWheelTrackContext", () => $85ae22f3b2559b04$export$aec8299548648839);
$parcel$export(module.exports, "ColorWheelTrack", () => $85ae22f3b2559b04$export$aaae3dd1f909c692);







const $85ae22f3b2559b04$export$f5327df9fc840d47 = /*#__PURE__*/ (0, $k1tmY$react.createContext)(null);
const $85ae22f3b2559b04$export$f80663f808113381 = /*#__PURE__*/ (0, $k1tmY$react.forwardRef)(function ColorWheel(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, (0, $525402dfec7da5bc$exports.ColorWheelContext));
    let state = (0, $k1tmY$reactstatelycolor.useColorWheelState)(props);
    let inputRef = (0, $k1tmY$react.useRef)(null);
    let { trackProps: trackProps, inputProps: inputProps, thumbProps: thumbProps } = (0, $k1tmY$reactariacolor.useColorWheel)(props, state, inputRef);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    let DOMProps = (0, $k1tmY$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($k1tmY$react))).createElement("div", {
        ...DOMProps,
        ...renderProps,
        ref: ref,
        slot: props.slot || undefined,
        "data-disabled": props.isDisabled || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($k1tmY$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $85ae22f3b2559b04$export$f5327df9fc840d47,
                state
            ],
            [
                $85ae22f3b2559b04$export$aec8299548648839,
                trackProps
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
    }, renderProps.children));
});
const $85ae22f3b2559b04$export$aec8299548648839 = /*#__PURE__*/ (0, $k1tmY$react.createContext)(null);
const $85ae22f3b2559b04$export$aaae3dd1f909c692 = /*#__PURE__*/ (0, $k1tmY$react.forwardRef)(function ColorWheelTrack(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $85ae22f3b2559b04$export$aec8299548648839);
    let state = (0, $k1tmY$react.useContext)($85ae22f3b2559b04$export$f5327df9fc840d47);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-ColorWheelTrack',
        values: {
            isDisabled: state.isDisabled,
            state: state
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($k1tmY$react))).createElement("div", {
        ...props,
        ...renderProps,
        ref: ref,
        "data-disabled": state.isDisabled || undefined
    });
});


//# sourceMappingURL=ColorWheel.main.js.map
