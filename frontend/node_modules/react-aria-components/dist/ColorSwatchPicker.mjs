import {ColorSwatchContext as $251c695a52d94a8d$export$83cc445538396800} from "./ColorSwatch.mjs";
import {composeRenderProps as $64fa3d84918910a7$export$c245e6201fed2f75, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415} from "./utils.mjs";
import $jTaLw$intlStringsmodulejs from "./intlStrings.mjs";
import {ListBox as $eed445e0843c11d0$export$41f133550aa26f48, ListBoxItem as $eed445e0843c11d0$export$a11e76429ed99b4} from "./ListBox.mjs";
import {useColorPickerState as $jTaLw$useColorPickerState, parseColor as $jTaLw$parseColor} from "@react-stately/color";
import {filterDOMProps as $jTaLw$filterDOMProps} from "@react-aria/utils";
import $jTaLw$react, {createContext as $jTaLw$createContext, forwardRef as $jTaLw$forwardRef, useMemo as $jTaLw$useMemo, useContext as $jTaLw$useContext, useEffect as $jTaLw$useEffect} from "react";
import {useLocalizedStringFormatter as $jTaLw$useLocalizedStringFormatter, useLocale as $jTaLw$useLocale} from "react-aria";


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}








const $0bb41941cfe72bd4$export$7214f50881fc1eaf = /*#__PURE__*/ (0, $jTaLw$createContext)(null);
const $0bb41941cfe72bd4$var$ColorMapContext = /*#__PURE__*/ (0, $jTaLw$createContext)(null);
const $0bb41941cfe72bd4$export$b46792416e3d8515 = /*#__PURE__*/ (0, $jTaLw$forwardRef)(function ColorSwatchPicker(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $0bb41941cfe72bd4$export$7214f50881fc1eaf);
    let state = (0, $jTaLw$useColorPickerState)(props);
    let colorMap = (0, $jTaLw$useMemo)(()=>new Map(), []);
    let formatter = (0, $jTaLw$useLocalizedStringFormatter)((0, ($parcel$interopDefault($jTaLw$intlStringsmodulejs))), 'react-aria-components');
    return /*#__PURE__*/ (0, $jTaLw$react).createElement((0, $eed445e0843c11d0$export$41f133550aa26f48), {
        ...(0, $jTaLw$filterDOMProps)(props, {
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
    }, /*#__PURE__*/ (0, $jTaLw$react).createElement($0bb41941cfe72bd4$var$ColorMapContext.Provider, {
        value: colorMap
    }, props.children));
});
const $0bb41941cfe72bd4$export$abcd89c27081c2ef = /*#__PURE__*/ (0, $jTaLw$forwardRef)(function ColorSwatchPickerItem(props, ref) {
    let propColor = props.color || '#0000';
    let color = (0, $jTaLw$useMemo)(()=>typeof propColor === 'string' ? (0, $jTaLw$parseColor)(propColor) : propColor, [
        propColor
    ]);
    let { locale: locale } = (0, $jTaLw$useLocale)();
    let map = (0, $jTaLw$useContext)($0bb41941cfe72bd4$var$ColorMapContext);
    (0, $jTaLw$useEffect)(()=>{
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
    return /*#__PURE__*/ (0, $jTaLw$react).createElement((0, $eed445e0843c11d0$export$a11e76429ed99b4), {
        ...props,
        ref: ref,
        id: color.toString('hexa'),
        textValue: color.getColorName(locale),
        className: wrap(props.className || 'react-aria-ColorSwatchPickerItem'),
        style: wrap(props.style)
    }, (0, $64fa3d84918910a7$export$c245e6201fed2f75)(wrap(props.children), (children)=>/*#__PURE__*/ (0, $jTaLw$react).createElement((0, $251c695a52d94a8d$export$83cc445538396800).Provider, {
            value: {
                color: color
            }
        }, children)));
});


export {$0bb41941cfe72bd4$export$7214f50881fc1eaf as ColorSwatchPickerContext, $0bb41941cfe72bd4$export$b46792416e3d8515 as ColorSwatchPicker, $0bb41941cfe72bd4$export$abcd89c27081c2ef as ColorSwatchPickerItem};
//# sourceMappingURL=ColorSwatchPicker.module.js.map
