var $c5ccf687772c0422$exports = require("./utils.main.js");
var $3jWEE$reactariautils = require("@react-aria/utils");
var $3jWEE$reactaria = require("react-aria");
var $3jWEE$react = require("react");
var $3jWEE$reactariafocus = require("@react-aria/focus");
var $3jWEE$reactariainteractions = require("@react-aria/interactions");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "InternalColorThumbContext", () => $9775047c98afa2ef$export$c80c0ea2ca5cb846);
$parcel$export(module.exports, "ColorThumb", () => $9775047c98afa2ef$export$a3cc47cee1c1ccc);






const $9775047c98afa2ef$export$c80c0ea2ca5cb846 = /*#__PURE__*/ (0, $3jWEE$react.createContext)(null);
const $9775047c98afa2ef$export$a3cc47cee1c1ccc = /*#__PURE__*/ (0, $3jWEE$react.forwardRef)(function ColorThumb(props, ref) {
    let { state: state, thumbProps: thumbProps, inputXRef: inputXRef, inputYRef: inputYRef, xInputProps: xInputProps, yInputProps: yInputProps, isDisabled: isDisabled = false } = (0, $3jWEE$react.useContext)($9775047c98afa2ef$export$c80c0ea2ca5cb846);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $3jWEE$reactariafocus.useFocusRing)();
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $3jWEE$reactariainteractions.useHover)(props);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        defaultClassName: 'react-aria-ColorThumb',
        defaultStyle: {
            ...thumbProps.style,
            backgroundColor: state.getDisplayColor().toString()
        },
        values: {
            color: state.getDisplayColor(),
            isHovered: isHovered,
            isDragging: state.isDragging,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isDisabled: isDisabled
        }
    });
    let DOMProps = (0, $3jWEE$reactariautils.filterDOMProps)(props);
    delete DOMProps.id;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($3jWEE$react))).createElement("div", {
        ...(0, $3jWEE$reactaria.mergeProps)(thumbProps, hoverProps, DOMProps),
        ...renderProps,
        ref: ref,
        "data-hovered": isHovered || undefined,
        "data-dragging": state.isDragging || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-disabled": isDisabled || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($3jWEE$react))).createElement("input", {
        ref: inputXRef,
        ...xInputProps,
        ...focusProps
    }), yInputProps && /*#__PURE__*/ (0, ($parcel$interopDefault($3jWEE$react))).createElement("input", {
        ref: inputYRef,
        ...yInputProps,
        ...focusProps
    }), renderProps.children);
});


//# sourceMappingURL=ColorThumb.main.js.map
