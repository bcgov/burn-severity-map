var $c5ccf687772c0422$exports = require("./utils.main.js");
var $gp0Yb$reactaria = require("react-aria");
var $gp0Yb$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "TextAreaContext", () => $a5d2423f42834231$export$2dc6166a7e65358c);
$parcel$export(module.exports, "TextArea", () => $a5d2423f42834231$export$f5c9f3c2c4054eec);



const $a5d2423f42834231$export$2dc6166a7e65358c = /*#__PURE__*/ (0, $gp0Yb$react.createContext)({});
let $a5d2423f42834231$var$filterHoverProps = (props)=>{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let { onHoverStart: onHoverStart, onHoverChange: onHoverChange, onHoverEnd: onHoverEnd, ...otherProps } = props;
    return otherProps;
};
const $a5d2423f42834231$export$f5c9f3c2c4054eec = /*#__PURE__*/ (0, $gp0Yb$react.forwardRef)(function TextArea(props, ref) {
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $a5d2423f42834231$export$2dc6166a7e65358c);
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $gp0Yb$reactaria.useHover)(props);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $gp0Yb$reactaria.useFocusRing)({
        isTextInput: true,
        autoFocus: props.autoFocus
    });
    let isInvalid = !!props['aria-invalid'] && props['aria-invalid'] !== 'false';
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        values: {
            isHovered: isHovered,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isDisabled: props.disabled || false,
            isInvalid: isInvalid
        },
        defaultClassName: 'react-aria-TextArea'
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($gp0Yb$react))).createElement("textarea", {
        ...(0, $gp0Yb$reactaria.mergeProps)($a5d2423f42834231$var$filterHoverProps(props), focusProps, hoverProps),
        ...renderProps,
        ref: ref,
        "data-focused": isFocused || undefined,
        "data-disabled": props.disabled || undefined,
        "data-hovered": isHovered || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-invalid": isInvalid || undefined
    });
});


//# sourceMappingURL=TextArea.main.js.map
