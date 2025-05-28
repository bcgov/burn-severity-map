var $525402dfec7da5bc$exports = require("./RSPContexts.main.js");
var $9775047c98afa2ef$exports = require("./ColorThumb.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $hLuah$reactstatelycolor = require("@react-stately/color");
var $hLuah$reactariautils = require("@react-aria/utils");
var $hLuah$react = require("react");
var $hLuah$reactariacolor = require("@react-aria/color");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ColorAreaStateContext", () => $4b8ff932b8d77df7$export$6b32221de49982e);
$parcel$export(module.exports, "ColorArea", () => $4b8ff932b8d77df7$export$b2103f68a961418e);







const $4b8ff932b8d77df7$export$6b32221de49982e = /*#__PURE__*/ (0, $hLuah$react.createContext)(null);
const $4b8ff932b8d77df7$export$b2103f68a961418e = /*#__PURE__*/ (0, $hLuah$react.forwardRef)(function ColorArea(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, (0, $525402dfec7da5bc$exports.ColorAreaContext));
    let inputXRef = (0, $hLuah$react.useRef)(null);
    let inputYRef = (0, $hLuah$react.useRef)(null);
    let state = (0, $hLuah$reactstatelycolor.useColorAreaState)(props);
    let { colorAreaProps: colorAreaProps, xInputProps: xInputProps, yInputProps: yInputProps, thumbProps: thumbProps } = (0, $hLuah$reactariacolor.useColorArea)({
        ...props,
        inputXRef: inputXRef,
        inputYRef: inputYRef,
        containerRef: ref
    }, state);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-ColorArea',
        defaultStyle: colorAreaProps.style,
        values: {
            state: state,
            isDisabled: props.isDisabled || false
        }
    });
    let DOMProps = (0, $hLuah$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($hLuah$react))).createElement("div", {
        ref: ref,
        ...colorAreaProps,
        ...DOMProps,
        ...renderProps,
        slot: props.slot || undefined,
        "data-disabled": props.isDisabled || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($hLuah$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $4b8ff932b8d77df7$export$6b32221de49982e,
                state
            ],
            [
                (0, $9775047c98afa2ef$exports.InternalColorThumbContext),
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


//# sourceMappingURL=ColorArea.main.js.map
