import {TableColumnResizeStateContext as $1910c06f0ca9905e$export$a2680a798823803c} from "./Table.module.js";
import {TableLayout as $b7YLp$TableLayout} from "@react-stately/layout";
import {useContext as $b7YLp$useContext, useMemo as $b7YLp$useMemo} from "react";

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


class $2f9e0b0e857fd9ba$export$62444c3c724b1b20 extends (0, $b7YLp$TableLayout) {
    // Invalidate the layout whenever the column widths change.
    useLayoutOptions() {
        // This is not a React class component, just a regular class.
        /* eslint-disable react-hooks/rules-of-hooks */ let colResizeState = (0, $b7YLp$useContext)((0, $1910c06f0ca9905e$export$a2680a798823803c));
        return (0, $b7YLp$useMemo)(()=>({
                columnWidths: colResizeState === null || colResizeState === void 0 ? void 0 : colResizeState.columnWidths
            }), [
            colResizeState === null || colResizeState === void 0 ? void 0 : colResizeState.columnWidths
        ]);
    }
}


export {$2f9e0b0e857fd9ba$export$62444c3c724b1b20 as TableLayout};
//# sourceMappingURL=TableLayout.module.js.map
