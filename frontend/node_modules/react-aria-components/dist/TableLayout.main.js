var $37b9a5d4bd0d4ded$exports = require("./Table.main.js");
var $hYq8G$reactstatelylayout = require("@react-stately/layout");
var $hYq8G$react = require("react");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "TableLayout", () => $2f8e0c602ddf4ab9$export$62444c3c724b1b20);
/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ 


class $2f8e0c602ddf4ab9$export$62444c3c724b1b20 extends (0, $hYq8G$reactstatelylayout.TableLayout) {
    // Invalidate the layout whenever the column widths change.
    useLayoutOptions() {
        // This is not a React class component, just a regular class.
        /* eslint-disable react-hooks/rules-of-hooks */ let colResizeState = (0, $hYq8G$react.useContext)((0, $37b9a5d4bd0d4ded$exports.TableColumnResizeStateContext));
        return (0, $hYq8G$react.useMemo)(()=>({
                columnWidths: colResizeState === null || colResizeState === void 0 ? void 0 : colResizeState.columnWidths
            }), [
            colResizeState === null || colResizeState === void 0 ? void 0 : colResizeState.columnWidths
        ]);
    }
}


//# sourceMappingURL=TableLayout.main.js.map
