var $c5ccf687772c0422$exports = require("./utils.main.js");
var $8RzkX$reactariacolor = require("@react-aria/color");
var $8RzkX$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ColorSwatchContext", () => $804cfb3beb27b520$export$83cc445538396800);
$parcel$export(module.exports, "ColorSwatch", () => $804cfb3beb27b520$export$cae13e90592f246a);



const $804cfb3beb27b520$export$83cc445538396800 = /*#__PURE__*/ (0, $8RzkX$react.createContext)(null);
const $804cfb3beb27b520$export$cae13e90592f246a = /*#__PURE__*/ (0, $8RzkX$react.forwardRef)(function ColorSwatch(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $804cfb3beb27b520$export$83cc445538396800);
    let { colorSwatchProps: colorSwatchProps, color: color } = (0, $8RzkX$reactariacolor.useColorSwatch)(props);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-ColorSwatch',
        defaultStyle: colorSwatchProps.style,
        values: {
            color: color
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($8RzkX$react))).createElement("div", {
        ...colorSwatchProps,
        ...renderProps,
        slot: props.slot || undefined,
        ref: ref
    });
});


//# sourceMappingURL=ColorSwatch.main.js.map
