var $6fc07bed32f3daee$exports = require("./intlStrings.main.js");
var $gqXxM$reactariagridlist = require("@react-aria/gridlist");
var $gqXxM$reactariautils = require("@react-aria/utils");
var $gqXxM$reactariai18n = require("@react-aria/i18n");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "useTreeGridListItem", () => $89b99a0b1379ba07$export$8001083cb3f61028);
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



function $89b99a0b1379ba07$export$8001083cb3f61028(props, state, ref) {
    let { node: node } = props;
    let gridListAria = (0, $gqXxM$reactariagridlist.useGridListItem)(props, state, ref);
    let isExpanded = gridListAria.rowProps['aria-expanded'] === true;
    let stringFormatter = (0, $gqXxM$reactariai18n.useLocalizedStringFormatter)((0, ($parcel$interopDefault($6fc07bed32f3daee$exports))), '@react-aria/tree');
    let expandButtonProps = {
        onPress: ()=>{
            if (!gridListAria.isDisabled) {
                state.toggleKey(node.key);
                state.selectionManager.setFocused(true);
                state.selectionManager.setFocusedKey(node.key);
            }
        },
        'aria-label': isExpanded ? stringFormatter.format('collapse') : stringFormatter.format('expand'),
        tabIndex: (0, $gqXxM$reactariautils.isAndroid)() ? -1 : null,
        'data-react-aria-prevent-focus': true
    };
    // TODO: should it return a state specifically for isExpanded? Or is aria attribute sufficient?
    return {
        ...gridListAria,
        expandButtonProps: expandButtonProps
    };
}


//# sourceMappingURL=useTreeGridListItem.main.js.map
