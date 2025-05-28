import {useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.module.js";
import {useColorSwatch as $dfXrE$useColorSwatch} from "@react-aria/color";
import $dfXrE$react, {createContext as $dfXrE$createContext, forwardRef as $dfXrE$forwardRef} from "react";




const $251c695a52d94a8d$export$83cc445538396800 = /*#__PURE__*/ (0, $dfXrE$createContext)(null);
const $251c695a52d94a8d$export$cae13e90592f246a = /*#__PURE__*/ (0, $dfXrE$forwardRef)(function ColorSwatch(props, ref) {
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $251c695a52d94a8d$export$83cc445538396800);
    let { colorSwatchProps: colorSwatchProps, color: color } = (0, $dfXrE$useColorSwatch)(props);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        defaultClassName: 'react-aria-ColorSwatch',
        defaultStyle: colorSwatchProps.style,
        values: {
            color: color
        }
    });
    return /*#__PURE__*/ (0, $dfXrE$react).createElement("div", {
        ...colorSwatchProps,
        ...renderProps,
        slot: props.slot || undefined,
        ref: ref
    });
});


export {$251c695a52d94a8d$export$83cc445538396800 as ColorSwatchContext, $251c695a52d94a8d$export$cae13e90592f246a as ColorSwatch};
//# sourceMappingURL=ColorSwatch.module.js.map
