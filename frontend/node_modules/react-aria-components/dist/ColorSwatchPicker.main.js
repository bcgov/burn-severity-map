var $804cfb3beb27b520$exports = require("./ColorSwatch.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $d72d752ea1c67b9a$exports = require("./intlStrings.main.js");
var $a03b42240404b420$exports = require("./ListBox.main.js");
var $1ahOz$reactstatelycolor = require("@react-stately/color");
var $1ahOz$reactariautils = require("@react-aria/utils");
var $1ahOz$react = require("react");
var $1ahOz$reactaria = require("react-aria");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ColorSwatchPickerContext", () => $4adbbc5a2d33d279$export$7214f50881fc1eaf);
$parcel$export(module.exports, "ColorSwatchPicker", () => $4adbbc5a2d33d279$export$b46792416e3d8515);
$parcel$export(module.exports, "ColorSwatchPickerItem", () => $4adbbc5a2d33d279$export$abcd89c27081c2ef);








const $4adbbc5a2d33d279$export$7214f50881fc1eaf = /*#__PURE__*/ (0, $1ahOz$react.createContext)(null);
const $4adbbc5a2d33d279$var$ColorMapContext = /*#__PURE__*/ (0, $1ahOz$react.createContext)(null);
const $4adbbc5a2d33d279$export$b46792416e3d8515 = /*#__PURE__*/ (0, $1ahOz$react.forwardRef)(function ColorSwatchPicker(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $4adbbc5a2d33d279$export$7214f50881fc1eaf);
    let state = (0, $1ahOz$reactstatelycolor.useColorPickerState)(props);
    let colorMap = (0, $1ahOz$react.useMemo)(()=>new Map(), []);
    let formatter = (0, $1ahOz$reactaria.useLocalizedStringFormatter)((0, ($parcel$interopDefault($d72d752ea1c67b9a$exports))), 'react-aria-components');
    return /*#__PURE__*/ (0, ($parcel$interopDefault($1ahOz$react))).createElement((0, $a03b42240404b420$exports.ListBox), {
        ...(0, $1ahOz$reactariautils.filterDOMProps)(props, {
            labelable: true
        }),
        ref: ref,
        className: props.className || 'react-aria-ColorSwatchPicker',
        style: props.style,
        "aria-label": props['aria-label'] || (!props['aria-labelledby'] ? formatter.format('colorSwatchPicker') : undefined),
        layout: props.layout || 'grid',
        selectionMode: "single",
        selectedKeys: [
            state.color.toString('hexa')
        ],
        onSelectionChange: (keys)=>{
            // single select, 'all' cannot occur. appease typescript.
            if (keys !== 'all') state.setColor(colorMap.get([
                ...keys
            ][0]));
        },
        disallowEmptySelection: true
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($1ahOz$react))).createElement($4adbbc5a2d33d279$var$ColorMapContext.Provider, {
        value: colorMap
    }, props.children));
});
const $4adbbc5a2d33d279$export$abcd89c27081c2ef = /*#__PURE__*/ (0, $1ahOz$react.forwardRef)(function ColorSwatchPickerItem(props, ref) {
    let propColor = props.color || '#0000';
    let color = (0, $1ahOz$react.useMemo)(()=>typeof propColor === 'string' ? (0, $1ahOz$reactstatelycolor.parseColor)(propColor) : propColor, [
        propColor
    ]);
    let { locale: locale } = (0, $1ahOz$reactaria.useLocale)();
    let map = (0, $1ahOz$react.useContext)($4adbbc5a2d33d279$var$ColorMapContext);
    (0, $1ahOz$react.useEffect)(()=>{
        let key = color.toString('hexa');
        map.set(key, color);
        return ()=>{
            map.delete(key);
        };
    }, [
        color,
        map
    ]);
    let wrap = (v)=>{
        if (typeof v === 'function') return (renderProps)=>v({
                ...renderProps,
                color: color
            });
        return v;
    };
    return /*#__PURE__*/ (0, ($parcel$interopDefault($1ahOz$react))).createElement((0, $a03b42240404b420$exports.ListBoxItem), {
        ...props,
        ref: ref,
        id: color.toString('hexa'),
        textValue: color.getColorName(locale),
        className: wrap(props.className || 'react-aria-ColorSwatchPickerItem'),
        style: wrap(props.style)
    }, (0, $c5ccf687772c0422$exports.composeRenderProps)(wrap(props.children), (children)=>/*#__PURE__*/ (0, ($parcel$interopDefault($1ahOz$react))).createElement((0, $804cfb3beb27b520$exports.ColorSwatchContext).Provider, {
            value: {
                color: color
            }
        }, children)));
});


//# sourceMappingURL=ColorSwatchPicker.main.js.map
