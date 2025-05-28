import $ho3NY$intlStringsmodulejs from "./intlStrings.module.js";
import {useGridListItem as $ho3NY$useGridListItem} from "@react-aria/gridlist";
import {isAndroid as $ho3NY$isAndroid} from "@react-aria/utils";
import {useLocalizedStringFormatter as $ho3NY$useLocalizedStringFormatter} from "@react-aria/i18n";


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
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



function $0cbbe9a595ac1615$export$8001083cb3f61028(props, state, ref) {
    let { node: node } = props;
    let gridListAria = (0, $ho3NY$useGridListItem)(props, state, ref);
    let isExpanded = gridListAria.rowProps['aria-expanded'] === true;
    let stringFormatter = (0, $ho3NY$useLocalizedStringFormatter)((0, ($parcel$interopDefault($ho3NY$intlStringsmodulejs))), '@react-aria/tree');
    let expandButtonProps = {
        onPress: ()=>{
            if (!gridListAria.isDisabled) {
                state.toggleKey(node.key);
                state.selectionManager.setFocused(true);
                state.selectionManager.setFocusedKey(node.key);
            }
        },
        'aria-label': isExpanded ? stringFormatter.format('collapse') : stringFormatter.format('expand'),
        tabIndex: (0, $ho3NY$isAndroid)() ? -1 : null,
        'data-react-aria-prevent-focus': true
    };
    // TODO: should it return a state specifically for isExpanded? Or is aria attribute sufficient?
    return {
        ...gridListAria,
        expandButtonProps: expandButtonProps
    };
}


export {$0cbbe9a595ac1615$export$8001083cb3f61028 as useTreeGridListItem};
//# sourceMappingURL=useTreeGridListItem.module.js.map
