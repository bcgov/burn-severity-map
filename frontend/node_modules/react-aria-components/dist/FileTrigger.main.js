var $1bcfcef5af644e13$exports = require("./Input.main.js");
var $g6L2B$reactariautils = require("@react-aria/utils");
var $g6L2B$reactariainteractions = require("@react-aria/interactions");
var $g6L2B$react = require("react");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "FileTrigger", () => $8e055a19745f522c$export$6fb4a10d2c950550);
/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 



const $8e055a19745f522c$export$6fb4a10d2c950550 = /*#__PURE__*/ (0, $g6L2B$react.forwardRef)(function FileTrigger(props, ref) {
    let { onSelect: onSelect, acceptedFileTypes: acceptedFileTypes, allowsMultiple: allowsMultiple, defaultCamera: defaultCamera, children: children, acceptDirectory: acceptDirectory, ...rest } = props;
    let inputRef = (0, $g6L2B$reactariautils.useObjectRef)(ref);
    let domProps = (0, $g6L2B$reactariautils.filterDOMProps)(rest);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($g6L2B$react))).createElement((0, ($parcel$interopDefault($g6L2B$react))).Fragment, null, /*#__PURE__*/ (0, ($parcel$interopDefault($g6L2B$react))).createElement((0, $g6L2B$reactariainteractions.PressResponder), {
        onPress: ()=>{
            var _inputRef_current, _inputRef_current1;
            if ((_inputRef_current = inputRef.current) === null || _inputRef_current === void 0 ? void 0 : _inputRef_current.value) inputRef.current.value = '';
            (_inputRef_current1 = inputRef.current) === null || _inputRef_current1 === void 0 ? void 0 : _inputRef_current1.click();
        }
    }, children), /*#__PURE__*/ (0, ($parcel$interopDefault($g6L2B$react))).createElement((0, $1bcfcef5af644e13$exports.Input), {
        ...domProps,
        type: "file",
        ref: inputRef,
        style: {
            display: 'none'
        },
        accept: acceptedFileTypes === null || acceptedFileTypes === void 0 ? void 0 : acceptedFileTypes.toString(),
        onChange: (e)=>onSelect === null || onSelect === void 0 ? void 0 : onSelect(e.target.files),
        capture: defaultCamera,
        multiple: allowsMultiple,
        // @ts-expect-error
        webkitdirectory: acceptDirectory ? '' : undefined
    }));
});


//# sourceMappingURL=FileTrigger.main.js.map
