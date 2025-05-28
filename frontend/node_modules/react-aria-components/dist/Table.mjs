import {ButtonContext as $d2b4bc8c273e7be6$export$24d547caef80ccd1} from "./Button.mjs";
import {CheckboxContext as $4e85f108e88277b8$export$b085522c77523c51} from "./RSPContexts.mjs";
import {CollectionRendererContext as $7135fc7d473fd974$export$4feb769f8ddf26c5, DefaultCollectionRenderer as $7135fc7d473fd974$export$a164736487e3f0ae} from "./Collection.mjs";
import {DEFAULT_SLOT as $64fa3d84918910a7$export$c62b8e45d58ddad9, Provider as $64fa3d84918910a7$export$2881499e37b75b9a, useContextProps as $64fa3d84918910a7$export$29f1550f4b0d4415, useRenderProps as $64fa3d84918910a7$export$4d86445c2cf5e3} from "./utils.mjs";
import {DragAndDropContext as $612b8eb6cb90e02d$export$d188a835a7bc5783, DropIndicatorContext as $612b8eb6cb90e02d$export$f55761759794cf55, useDndPersistedKeys as $612b8eb6cb90e02d$export$d1e8e3fbb7461f6, useRenderDropIndicator as $612b8eb6cb90e02d$export$971707d8a129a1f7} from "./DragAndDrop.mjs";
import $dbSRa$intlStringsmodulejs from "./intlStrings.mjs";
import {CollectionNode as $dbSRa$CollectionNode, BaseCollection as $dbSRa$BaseCollection, Collection as $dbSRa$Collection, CollectionBuilder as $dbSRa$CollectionBuilder, createBranchComponent as $dbSRa$createBranchComponent, useCachedChildren as $dbSRa$useCachedChildren, createLeafComponent as $dbSRa$createLeafComponent} from "@react-aria/collections";
import {buildHeaderRows as $dbSRa$buildHeaderRows} from "@react-stately/table";
import {useTableColumnResizeState as $dbSRa$useTableColumnResizeState, useMultipleSelectionState as $dbSRa$useMultipleSelectionState, useTableState as $dbSRa$useTableState} from "react-stately";
import {useTable as $dbSRa$useTable, ListKeyboardDelegate as $dbSRa$ListKeyboardDelegate, useFocusRing as $dbSRa$useFocusRing, FocusScope as $dbSRa$FocusScope, mergeProps as $dbSRa$mergeProps, useTableRowGroup as $dbSRa$useTableRowGroup, useHover as $dbSRa$useHover, useTableHeaderRow as $dbSRa$useTableHeaderRow, useTableSelectAllCheckbox as $dbSRa$useTableSelectAllCheckbox, useTableColumnHeader as $dbSRa$useTableColumnHeader, useLocalizedStringFormatter as $dbSRa$useLocalizedStringFormatter, useTableColumnResize as $dbSRa$useTableColumnResize, useLocale as $dbSRa$useLocale, useTableRow as $dbSRa$useTableRow, useTableSelectionCheckbox as $dbSRa$useTableSelectionCheckbox, useVisuallyHidden as $dbSRa$useVisuallyHidden, useTableCell as $dbSRa$useTableCell} from "react-aria";
import {useObjectRef as $dbSRa$useObjectRef, useLayoutEffect as $dbSRa$useLayoutEffect, isScrollable as $dbSRa$isScrollable, useResizeObserver as $dbSRa$useResizeObserver, filterDOMProps as $dbSRa$filterDOMProps, mergeRefs as $dbSRa$mergeRefs} from "@react-aria/utils";
import $dbSRa$react, {createContext as $dbSRa$createContext, forwardRef as $dbSRa$forwardRef, useRef as $dbSRa$useRef, useState as $dbSRa$useState, useMemo as $dbSRa$useMemo, useContext as $dbSRa$useContext, useEffect as $dbSRa$useEffect, useCallback as $dbSRa$useCallback} from "react";
import $dbSRa$reactdom from "react-dom";


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}













class $1910c06f0ca9905e$var$TableCollection extends (0, $dbSRa$BaseCollection) {
    addNode(node) {
        super.addNode(node);
        this.columnsDirty || (this.columnsDirty = node.type === 'column');
        if (node.type === 'tableheader') this.head = node;
        if (node.type === 'tablebody') this.body = node;
    }
    commit(firstKey, lastKey, isSSR = false) {
        this.updateColumns(isSSR);
        super.commit(firstKey, lastKey, isSSR);
        this.rows = [
            ...this.getChildren(this.body.key)
        ];
    }
    updateColumns(isSSR) {
        if (!this.columnsDirty) return;
        this.rowHeaderColumnKeys = new Set();
        this.columns = [];
        let columnKeyMap = new Map();
        let visit = (node)=>{
            switch(node.type){
                case 'column':
                    columnKeyMap.set(node.key, node);
                    if (!node.hasChildNodes) {
                        node.index = this.columns.length;
                        this.columns.push(node);
                        if (node.props.isRowHeader) this.rowHeaderColumnKeys.add(node.key);
                    }
                    break;
            }
            for (let child of this.getChildren(node.key))visit(child);
        };
        for (let node of this.getChildren(this.head.key))visit(node);
        this.headerRows = (0, $dbSRa$buildHeaderRows)(columnKeyMap, this.columns);
        this.columnsDirty = false;
        if (this.rowHeaderColumnKeys.size === 0 && this.columns.length > 0 && !isSSR) throw new Error('A table must have at least one Column with the isRowHeader prop set to true');
    }
    get columnCount() {
        return this.columns.length;
    }
    *[Symbol.iterator]() {
        // Wait until the collection is initialized.
        if (this.head.key === -1) return;
        yield this.head;
        yield this.body;
    }
    get size() {
        return this.rows.length;
    }
    getFirstKey() {
        return this.body.firstChildKey;
    }
    getLastKey() {
        return this.body.lastChildKey;
    }
    getKeyAfter(key) {
        let node = this.getItem(key);
        var _node_nextKey;
        if ((node === null || node === void 0 ? void 0 : node.type) === 'column') return (_node_nextKey = node.nextKey) !== null && _node_nextKey !== void 0 ? _node_nextKey : null;
        return super.getKeyAfter(key);
    }
    getKeyBefore(key) {
        var _this_getItem;
        let node = this.getItem(key);
        var _node_prevKey;
        if ((node === null || node === void 0 ? void 0 : node.type) === 'column') return (_node_prevKey = node.prevKey) !== null && _node_prevKey !== void 0 ? _node_prevKey : null;
        let k = super.getKeyBefore(key);
        if (k != null && ((_this_getItem = this.getItem(k)) === null || _this_getItem === void 0 ? void 0 : _this_getItem.type) === 'tablebody') return null;
        return k;
    }
    getChildren(key) {
        if (!this.getItem(key)) for (let row of this.headerRows){
            if (row.key === key) return row.childNodes;
        }
        return super.getChildren(key);
    }
    clone() {
        let collection = super.clone();
        collection.headerRows = this.headerRows;
        collection.columns = this.columns;
        collection.rowHeaderColumnKeys = this.rowHeaderColumnKeys;
        collection.head = this.head;
        collection.body = this.body;
        return collection;
    }
    getTextValue(key) {
        let row = this.getItem(key);
        if (!row) return '';
        // If the row has a textValue, use that.
        if (row.textValue) return row.textValue;
        // Otherwise combine the text of each of the row header columns.
        let rowHeaderColumnKeys = this.rowHeaderColumnKeys;
        let text = [];
        for (let cell of this.getChildren(key)){
            let column = this.columns[cell.index];
            if (rowHeaderColumnKeys.has(column.key) && cell.textValue) text.push(cell.textValue);
            if (text.length === rowHeaderColumnKeys.size) break;
        }
        return text.join(' ');
    }
    constructor(...args){
        super(...args), this.headerRows = [], this.columns = [], this.rows = [], this.rowHeaderColumnKeys = new Set(), this.head = new (0, $dbSRa$CollectionNode)('tableheader', -1), this.body = new (0, $dbSRa$CollectionNode)('tablebody', -2), this.columnsDirty = true;
    }
}
const $1910c06f0ca9905e$var$ResizableTableContainerContext = /*#__PURE__*/ (0, $dbSRa$createContext)(null);
const $1910c06f0ca9905e$export$7063e69b8a954175 = /*#__PURE__*/ (0, $dbSRa$forwardRef)(function ResizableTableContainer(props, ref) {
    let containerRef = (0, $dbSRa$useObjectRef)(ref);
    let tableRef = (0, $dbSRa$useRef)(null);
    let scrollRef = (0, $dbSRa$useRef)(null);
    let [width, setWidth] = (0, $dbSRa$useState)(0);
    (0, $dbSRa$useLayoutEffect)(()=>{
        // Walk up the DOM from the Table to the ResizableTableContainer and stop
        // when we reach the first scrollable element. This is what we'll measure
        // to determine column widths (important due to width of scrollbars).
        // This will usually be the ResizableTableContainer for native tables, and
        // the Table itself for virtualized tables.
        let table = tableRef.current;
        while(table && table !== containerRef.current && !(0, $dbSRa$isScrollable)(table))table = table.parentElement;
        scrollRef.current = table;
    }, [
        containerRef
    ]);
    (0, $dbSRa$useResizeObserver)({
        ref: scrollRef,
        box: 'border-box',
        onResize () {
            var _scrollRef_current;
            var _scrollRef_current_clientWidth;
            setWidth((_scrollRef_current_clientWidth = (_scrollRef_current = scrollRef.current) === null || _scrollRef_current === void 0 ? void 0 : _scrollRef_current.clientWidth) !== null && _scrollRef_current_clientWidth !== void 0 ? _scrollRef_current_clientWidth : 0);
        }
    });
    (0, $dbSRa$useLayoutEffect)(()=>{
        var _scrollRef_current;
        var _scrollRef_current_clientWidth;
        setWidth((_scrollRef_current_clientWidth = (_scrollRef_current = scrollRef.current) === null || _scrollRef_current === void 0 ? void 0 : _scrollRef_current.clientWidth) !== null && _scrollRef_current_clientWidth !== void 0 ? _scrollRef_current_clientWidth : 0);
    }, []);
    let ctx = (0, $dbSRa$useMemo)(()=>({
            tableRef: tableRef,
            scrollRef: scrollRef,
            tableWidth: width,
            useTableColumnResizeState: $dbSRa$useTableColumnResizeState,
            onResizeStart: props.onResizeStart,
            onResize: props.onResize,
            onResizeEnd: props.onResizeEnd
        }), [
        tableRef,
        width,
        props.onResizeStart,
        props.onResize,
        props.onResizeEnd
    ]);
    return /*#__PURE__*/ (0, $dbSRa$react).createElement("div", {
        ...(0, $dbSRa$filterDOMProps)(props),
        ref: containerRef,
        className: props.className || 'react-aria-ResizableTableContainer',
        style: props.style,
        onScroll: props.onScroll
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement($1910c06f0ca9905e$var$ResizableTableContainerContext.Provider, {
        value: ctx
    }, props.children));
});
const $1910c06f0ca9905e$export$93e4b0b2cc49b648 = /*#__PURE__*/ (0, $dbSRa$createContext)(null);
const $1910c06f0ca9905e$export$38de1cb0526c21fb = /*#__PURE__*/ (0, $dbSRa$createContext)(null);
const $1910c06f0ca9905e$export$a2680a798823803c = /*#__PURE__*/ (0, $dbSRa$createContext)(null);
const $1910c06f0ca9905e$export$54ec01a60f47d33d = /*#__PURE__*/ (0, $dbSRa$forwardRef)(function Table(props, ref) {
    var _props_dragAndDropHooks;
    [props, ref] = (0, $64fa3d84918910a7$export$29f1550f4b0d4415)(props, ref, $1910c06f0ca9905e$export$93e4b0b2cc49b648);
    // Separate selection state so we have access to it from collection components via useTableOptions.
    let selectionState = (0, $dbSRa$useMultipleSelectionState)(props);
    let { selectionBehavior: selectionBehavior, selectionMode: selectionMode, disallowEmptySelection: disallowEmptySelection } = selectionState;
    let hasDragHooks = !!((_props_dragAndDropHooks = props.dragAndDropHooks) === null || _props_dragAndDropHooks === void 0 ? void 0 : _props_dragAndDropHooks.useDraggableCollectionState);
    let ctx = (0, $dbSRa$useMemo)(()=>({
            selectionBehavior: selectionMode === 'none' ? null : selectionBehavior,
            selectionMode: selectionMode,
            disallowEmptySelection: disallowEmptySelection,
            allowsDragging: hasDragHooks
        }), [
        selectionBehavior,
        selectionMode,
        disallowEmptySelection,
        hasDragHooks
    ]);
    let content = /*#__PURE__*/ (0, $dbSRa$react).createElement($1910c06f0ca9905e$var$TableOptionsContext.Provider, {
        value: ctx
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement((0, $dbSRa$Collection), props));
    return /*#__PURE__*/ (0, $dbSRa$react).createElement((0, $dbSRa$CollectionBuilder), {
        content: content,
        createCollection: ()=>new $1910c06f0ca9905e$var$TableCollection()
    }, (collection)=>/*#__PURE__*/ (0, $dbSRa$react).createElement($1910c06f0ca9905e$var$TableInner, {
            props: props,
            forwardedRef: ref,
            selectionState: selectionState,
            collection: collection
        }));
});
function $1910c06f0ca9905e$var$TableInner({ props: props, forwardedRef: ref, selectionState: selectionState, collection: collection }) {
    let tableContainerContext = (0, $dbSRa$useContext)($1910c06f0ca9905e$var$ResizableTableContainerContext);
    ref = (0, $dbSRa$useObjectRef)((0, $dbSRa$useMemo)(()=>(0, $dbSRa$mergeRefs)(ref, tableContainerContext === null || tableContainerContext === void 0 ? void 0 : tableContainerContext.tableRef), [
        ref,
        tableContainerContext === null || tableContainerContext === void 0 ? void 0 : tableContainerContext.tableRef
    ]));
    let state = (0, $dbSRa$useTableState)({
        ...props,
        collection: collection,
        children: undefined,
        UNSAFE_selectionState: selectionState
    });
    let { isVirtualized: isVirtualized, layoutDelegate: layoutDelegate, dropTargetDelegate: ctxDropTargetDelegate, CollectionRoot: CollectionRoot } = (0, $dbSRa$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    let { dragAndDropHooks: dragAndDropHooks } = props;
    let { gridProps: gridProps } = (0, $dbSRa$useTable)({
        ...props,
        layoutDelegate: layoutDelegate,
        isVirtualized: isVirtualized
    }, state, ref);
    let selectionManager = state.selectionManager;
    let hasDragHooks = !!(dragAndDropHooks === null || dragAndDropHooks === void 0 ? void 0 : dragAndDropHooks.useDraggableCollectionState);
    let hasDropHooks = !!(dragAndDropHooks === null || dragAndDropHooks === void 0 ? void 0 : dragAndDropHooks.useDroppableCollectionState);
    let dragHooksProvided = (0, $dbSRa$useRef)(hasDragHooks);
    let dropHooksProvided = (0, $dbSRa$useRef)(hasDropHooks);
    (0, $dbSRa$useEffect)(()=>{
        if (dragHooksProvided.current !== hasDragHooks) console.warn('Drag hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.');
        if (dropHooksProvided.current !== hasDropHooks) console.warn('Drop hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.');
    }, [
        hasDragHooks,
        hasDropHooks
    ]);
    let dragState = undefined;
    let dropState = undefined;
    let droppableCollection = undefined;
    let isRootDropTarget = false;
    let dragPreview = null;
    let preview = (0, $dbSRa$useRef)(null);
    if (hasDragHooks && dragAndDropHooks) {
        dragState = dragAndDropHooks.useDraggableCollectionState({
            collection: collection,
            selectionManager: selectionManager,
            preview: dragAndDropHooks.renderDragPreview ? preview : undefined
        });
        dragAndDropHooks.useDraggableCollection({}, dragState, ref);
        let DragPreview = dragAndDropHooks.DragPreview;
        dragPreview = dragAndDropHooks.renderDragPreview ? /*#__PURE__*/ (0, $dbSRa$react).createElement(DragPreview, {
            ref: preview
        }, dragAndDropHooks.renderDragPreview) : null;
    }
    if (hasDropHooks && dragAndDropHooks) {
        dropState = dragAndDropHooks.useDroppableCollectionState({
            collection: collection,
            selectionManager: selectionManager
        });
        let keyboardDelegate = new (0, $dbSRa$ListKeyboardDelegate)({
            collection: collection,
            disabledKeys: selectionManager.disabledKeys,
            disabledBehavior: selectionManager.disabledBehavior,
            ref: ref,
            layoutDelegate: layoutDelegate
        });
        let dropTargetDelegate = dragAndDropHooks.dropTargetDelegate || ctxDropTargetDelegate || new dragAndDropHooks.ListDropTargetDelegate(collection.rows, ref);
        droppableCollection = dragAndDropHooks.useDroppableCollection({
            keyboardDelegate: keyboardDelegate,
            dropTargetDelegate: dropTargetDelegate
        }, dropState, ref);
        isRootDropTarget = dropState.isDropTarget({
            type: 'root'
        });
    }
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $dbSRa$useFocusRing)();
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        className: props.className,
        style: props.style,
        defaultClassName: 'react-aria-Table',
        values: {
            isDropTarget: isRootDropTarget,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            state: state
        }
    });
    let isListDraggable = !!(hasDragHooks && !(dragState === null || dragState === void 0 ? void 0 : dragState.isDisabled));
    let style = renderProps.style;
    let layoutState = null;
    if (tableContainerContext) {
        layoutState = tableContainerContext.useTableColumnResizeState({
            tableWidth: tableContainerContext.tableWidth
        }, state);
        if (!isVirtualized) style = {
            ...style,
            tableLayout: 'fixed',
            width: 'fit-content'
        };
    }
    let ElementType = $1910c06f0ca9905e$var$useElementType('table');
    var _tableContainerContext_scrollRef;
    return /*#__PURE__*/ (0, $dbSRa$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $1910c06f0ca9905e$export$38de1cb0526c21fb,
                state
            ],
            [
                $1910c06f0ca9905e$export$a2680a798823803c,
                layoutState
            ],
            [
                (0, $612b8eb6cb90e02d$export$d188a835a7bc5783),
                {
                    dragAndDropHooks: dragAndDropHooks,
                    dragState: dragState,
                    dropState: dropState
                }
            ],
            [
                (0, $612b8eb6cb90e02d$export$f55761759794cf55),
                {
                    render: $1910c06f0ca9905e$var$TableDropIndicatorWrapper
                }
            ]
        ]
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement((0, $dbSRa$FocusScope), null, /*#__PURE__*/ (0, $dbSRa$react).createElement(ElementType, {
        ...(0, $dbSRa$filterDOMProps)(props),
        ...renderProps,
        ...(0, $dbSRa$mergeProps)(gridProps, focusProps, droppableCollection === null || droppableCollection === void 0 ? void 0 : droppableCollection.collectionProps),
        style: style,
        ref: ref,
        slot: props.slot || undefined,
        onScroll: props.onScroll,
        "data-allows-dragging": isListDraggable || undefined,
        "data-drop-target": isRootDropTarget || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement(CollectionRoot, {
        collection: collection,
        scrollRef: (_tableContainerContext_scrollRef = tableContainerContext === null || tableContainerContext === void 0 ? void 0 : tableContainerContext.scrollRef) !== null && _tableContainerContext_scrollRef !== void 0 ? _tableContainerContext_scrollRef : ref,
        persistedKeys: (0, $612b8eb6cb90e02d$export$d1e8e3fbb7461f6)(selectionManager, dragAndDropHooks, dropState)
    }))), dragPreview);
}
function $1910c06f0ca9905e$var$useElementType(element) {
    let { isVirtualized: isVirtualized } = (0, $dbSRa$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    return isVirtualized ? 'div' : element;
}
const $1910c06f0ca9905e$var$TableOptionsContext = /*#__PURE__*/ (0, $dbSRa$createContext)(null);
function $1910c06f0ca9905e$export$fddc468cd8cb4db9() {
    return (0, $dbSRa$useContext)($1910c06f0ca9905e$var$TableOptionsContext);
}
const $1910c06f0ca9905e$export$f850895b287ef28e = /*#__PURE__*/ (0, $dbSRa$createBranchComponent)('tableheader', (props, ref)=>{
    let collection = (0, $dbSRa$useContext)($1910c06f0ca9905e$export$38de1cb0526c21fb).collection;
    let headerRows = (0, $dbSRa$useCachedChildren)({
        items: collection.headerRows,
        children: (0, $dbSRa$useCallback)((item)=>{
            switch(item.type){
                case 'headerrow':
                    return /*#__PURE__*/ (0, $dbSRa$react).createElement($1910c06f0ca9905e$var$TableHeaderRow, {
                        item: item
                    });
                default:
                    throw new Error('Unsupported node type in TableHeader: ' + item.type);
            }
        }, [])
    });
    let THead = $1910c06f0ca9905e$var$useElementType('thead');
    let { rowGroupProps: rowGroupProps } = (0, $dbSRa$useTableRowGroup)();
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $dbSRa$useHover)({
        onHoverStart: props.onHoverStart,
        onHoverChange: props.onHoverChange,
        onHoverEnd: props.onHoverEnd
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        className: props.className,
        style: props.style,
        defaultClassName: 'react-aria-TableHeader',
        values: {
            isHovered: isHovered
        }
    });
    return /*#__PURE__*/ (0, $dbSRa$react).createElement(THead, {
        ...(0, $dbSRa$mergeProps)((0, $dbSRa$filterDOMProps)(props), rowGroupProps, hoverProps),
        ...renderProps,
        ref: ref,
        "data-hovered": isHovered || undefined
    }, headerRows);
}, (props)=>/*#__PURE__*/ (0, $dbSRa$react).createElement((0, $dbSRa$Collection), {
        dependencies: props.dependencies,
        items: props.columns
    }, props.children));
function $1910c06f0ca9905e$var$TableHeaderRow({ item: item }) {
    let ref = (0, $dbSRa$useRef)(null);
    let state = (0, $dbSRa$useContext)($1910c06f0ca9905e$export$38de1cb0526c21fb);
    let { isVirtualized: isVirtualized, CollectionBranch: CollectionBranch } = (0, $dbSRa$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    let { rowProps: rowProps } = (0, $dbSRa$useTableHeaderRow)({
        node: item,
        isVirtualized: isVirtualized
    }, state, ref);
    let { checkboxProps: checkboxProps } = (0, $dbSRa$useTableSelectAllCheckbox)(state);
    let TR = $1910c06f0ca9905e$var$useElementType('tr');
    return /*#__PURE__*/ (0, $dbSRa$react).createElement(TR, {
        ...rowProps,
        ref: ref
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                (0, $4e85f108e88277b8$export$b085522c77523c51),
                {
                    slots: {
                        selection: checkboxProps
                    }
                }
            ]
        ]
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement(CollectionBranch, {
        collection: state.collection,
        parent: item
    })));
}
const $1910c06f0ca9905e$export$816b5d811295e6bc = /*#__PURE__*/ (0, $dbSRa$createLeafComponent)('column', (props, forwardedRef, column)=>{
    var _state_sortDescriptor, _state_sortDescriptor1;
    let ref = (0, $dbSRa$useObjectRef)(forwardedRef);
    let state = (0, $dbSRa$useContext)($1910c06f0ca9905e$export$38de1cb0526c21fb);
    let { isVirtualized: isVirtualized } = (0, $dbSRa$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    let { columnHeaderProps: columnHeaderProps } = (0, $dbSRa$useTableColumnHeader)({
        node: column,
        isVirtualized: isVirtualized
    }, state, ref);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $dbSRa$useFocusRing)();
    let layoutState = (0, $dbSRa$useContext)($1910c06f0ca9905e$export$a2680a798823803c);
    let isResizing = false;
    if (layoutState) isResizing = layoutState.resizingColumn === column.key;
    else {
        for(let prop in [
            'width',
            'defaultWidth',
            'minWidth',
            'maxWidth'
        ])if (prop in column.props) console.warn(`The ${prop} prop on a <Column> only applies when a <Table> is wrapped in a <ResizableTableContainer>. If you aren't using column resizing, you can set the width of a column with CSS.`);
    }
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $dbSRa$useHover)({
        isDisabled: !props.allowsSorting
    });
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        id: undefined,
        children: column.rendered,
        defaultClassName: 'react-aria-Column',
        values: {
            isHovered: isHovered,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            allowsSorting: column.props.allowsSorting,
            sortDirection: ((_state_sortDescriptor = state.sortDescriptor) === null || _state_sortDescriptor === void 0 ? void 0 : _state_sortDescriptor.column) === column.key ? state.sortDescriptor.direction : undefined,
            isResizing: isResizing,
            startResize: ()=>{
                if (layoutState) {
                    layoutState.startResize(column.key);
                    state.setKeyboardNavigationDisabled(true);
                } else throw new Error('Wrap your <Table> in a <ResizableTableContainer> to enable column resizing');
            },
            sort: (direction)=>{
                state.sort(column.key, direction);
            }
        }
    });
    let style = renderProps.style;
    if (layoutState) style = {
        ...style,
        width: layoutState.getColumnWidth(column.key)
    };
    let TH = $1910c06f0ca9905e$var$useElementType('th');
    return /*#__PURE__*/ (0, $dbSRa$react).createElement(TH, {
        ...(0, $dbSRa$mergeProps)((0, $dbSRa$filterDOMProps)(props), columnHeaderProps, focusProps, hoverProps),
        ...renderProps,
        style: style,
        colSpan: column.colspan,
        ref: ref,
        "data-hovered": isHovered || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-resizing": isResizing || undefined,
        "data-allows-sorting": column.props.allowsSorting || undefined,
        "data-sort-direction": ((_state_sortDescriptor1 = state.sortDescriptor) === null || _state_sortDescriptor1 === void 0 ? void 0 : _state_sortDescriptor1.column) === column.key ? state.sortDescriptor.direction : undefined
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                $1910c06f0ca9905e$var$ColumnResizerContext,
                {
                    column: column,
                    triggerRef: ref
                }
            ],
            [
                (0, $7135fc7d473fd974$export$4feb769f8ddf26c5),
                (0, $7135fc7d473fd974$export$a164736487e3f0ae)
            ]
        ]
    }, renderProps.children));
});
const $1910c06f0ca9905e$var$ColumnResizerContext = /*#__PURE__*/ (0, $dbSRa$createContext)(null);
const $1910c06f0ca9905e$export$ee689e97a7664bfd = /*#__PURE__*/ (0, $dbSRa$forwardRef)(function ColumnResizer(props, ref) {
    let layoutState = (0, $dbSRa$useContext)($1910c06f0ca9905e$export$a2680a798823803c);
    if (!layoutState) throw new Error('Wrap your <Table> in a <ResizableTableContainer> to enable column resizing');
    let stringFormatter = (0, $dbSRa$useLocalizedStringFormatter)((0, ($parcel$interopDefault($dbSRa$intlStringsmodulejs))), 'react-aria-components');
    let { onResizeStart: onResizeStart, onResize: onResize, onResizeEnd: onResizeEnd } = (0, $dbSRa$useContext)($1910c06f0ca9905e$var$ResizableTableContainerContext);
    let { column: column, triggerRef: triggerRef } = (0, $dbSRa$useContext)($1910c06f0ca9905e$var$ColumnResizerContext);
    let inputRef = (0, $dbSRa$useRef)(null);
    let { resizerProps: resizerProps, inputProps: inputProps, isResizing: isResizing } = (0, $dbSRa$useTableColumnResize)({
        column: column,
        'aria-label': props['aria-label'] || stringFormatter.format('tableResizer'),
        onResizeStart: onResizeStart,
        onResize: onResize,
        onResizeEnd: onResizeEnd,
        triggerRef: triggerRef
    }, layoutState, inputRef);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $dbSRa$useFocusRing)();
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $dbSRa$useHover)(props);
    let isEResizable = layoutState.getColumnMinWidth(column.key) >= layoutState.getColumnWidth(column.key);
    let isWResizable = layoutState.getColumnMaxWidth(column.key) <= layoutState.getColumnWidth(column.key);
    let { direction: direction } = (0, $dbSRa$useLocale)();
    let resizableDirection = 'both';
    if (isEResizable) resizableDirection = direction === 'rtl' ? 'right' : 'left';
    else if (isWResizable) resizableDirection = direction === 'rtl' ? 'left' : 'right';
    else resizableDirection = 'both';
    let objectRef = (0, $dbSRa$useObjectRef)(ref);
    let [cursor, setCursor] = (0, $dbSRa$useState)('');
    (0, $dbSRa$useEffect)(()=>{
        if (!objectRef.current) return;
        let style = window.getComputedStyle(objectRef.current);
        setCursor(style.cursor);
    }, [
        objectRef,
        resizableDirection
    ]);
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        defaultClassName: 'react-aria-ColumnResizer',
        values: {
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isResizing: isResizing,
            isHovered: isHovered,
            resizableDirection: resizableDirection
        }
    });
    let [isMouseDown, setMouseDown] = (0, $dbSRa$useState)(false);
    let onPointerDown = (e)=>{
        if (e.pointerType === 'mouse') setMouseDown(true);
    };
    if (!isResizing && isMouseDown) setMouseDown(false);
    return /*#__PURE__*/ (0, $dbSRa$react).createElement("div", {
        ref: objectRef,
        role: "presentation",
        ...(0, $dbSRa$filterDOMProps)(props),
        ...renderProps,
        ...(0, $dbSRa$mergeProps)(resizerProps, {
            onPointerDown: onPointerDown
        }, hoverProps),
        "data-hovered": isHovered || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-resizing": isResizing || undefined,
        "data-resizable-direction": resizableDirection
    }, renderProps.children, /*#__PURE__*/ (0, $dbSRa$react).createElement("input", {
        ref: inputRef,
        ...(0, $dbSRa$mergeProps)(inputProps, focusProps)
    }), isResizing && isMouseDown && /*#__PURE__*/ (0, $dbSRa$reactdom).createPortal(/*#__PURE__*/ (0, $dbSRa$react).createElement("div", {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            cursor: cursor
        }
    }), document.body));
});
const $1910c06f0ca9905e$export$76ccd210b9029917 = /*#__PURE__*/ (0, $dbSRa$createBranchComponent)('tablebody', (props, ref)=>{
    let state = (0, $dbSRa$useContext)($1910c06f0ca9905e$export$38de1cb0526c21fb);
    let { isVirtualized: isVirtualized } = (0, $dbSRa$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    let collection = state.collection;
    let { CollectionBranch: CollectionBranch } = (0, $dbSRa$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    let { dragAndDropHooks: dragAndDropHooks, dropState: dropState } = (0, $dbSRa$useContext)((0, $612b8eb6cb90e02d$export$d188a835a7bc5783));
    let isDroppable = !!(dragAndDropHooks === null || dragAndDropHooks === void 0 ? void 0 : dragAndDropHooks.useDroppableCollectionState) && !(dropState === null || dropState === void 0 ? void 0 : dropState.isDisabled);
    var _dropState_isDropTarget;
    let isRootDropTarget = isDroppable && !!dropState && ((_dropState_isDropTarget = dropState.isDropTarget({
        type: 'root'
    })) !== null && _dropState_isDropTarget !== void 0 ? _dropState_isDropTarget : false);
    let renderValues = {
        isDropTarget: isRootDropTarget,
        isEmpty: collection.size === 0
    };
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        id: undefined,
        children: undefined,
        defaultClassName: 'react-aria-TableBody',
        values: renderValues
    });
    let emptyState;
    let TR = $1910c06f0ca9905e$var$useElementType('tr');
    let TD = $1910c06f0ca9905e$var$useElementType('td');
    let numColumns = collection.columnCount;
    if (collection.size === 0 && props.renderEmptyState && state) {
        let rowProps = {};
        let rowHeaderProps = {};
        let style = {};
        if (isVirtualized) {
            rowProps['aria-rowindex'] = collection.headerRows.length + 1;
            rowHeaderProps['aria-colspan'] = numColumns;
            style = {
                display: 'contents'
            };
        } else rowHeaderProps['colSpan'] = numColumns;
        emptyState = /*#__PURE__*/ (0, $dbSRa$react).createElement(TR, {
            role: "row",
            ...rowProps,
            style: style
        }, /*#__PURE__*/ (0, $dbSRa$react).createElement(TD, {
            role: "rowheader",
            ...rowHeaderProps,
            style: style
        }, props.renderEmptyState(renderValues)));
    }
    let { rowGroupProps: rowGroupProps } = (0, $dbSRa$useTableRowGroup)();
    let TBody = $1910c06f0ca9905e$var$useElementType('tbody');
    // TODO: TableBody doesn't support being the scrollable body of the table yet, to revisit if needed. Would need to
    // call useLoadMore here and walk up the DOM to the nearest scrollable element to set scrollRef
    return /*#__PURE__*/ (0, $dbSRa$react).createElement(TBody, {
        ...(0, $dbSRa$mergeProps)((0, $dbSRa$filterDOMProps)(props), rowGroupProps),
        ...renderProps,
        ref: ref,
        "data-empty": collection.size === 0 || undefined
    }, isDroppable && /*#__PURE__*/ (0, $dbSRa$react).createElement($1910c06f0ca9905e$var$RootDropIndicator, null), /*#__PURE__*/ (0, $dbSRa$react).createElement(CollectionBranch, {
        collection: collection,
        parent: collection.body,
        renderDropIndicator: (0, $612b8eb6cb90e02d$export$971707d8a129a1f7)(dragAndDropHooks, dropState)
    }), emptyState);
});
const $1910c06f0ca9905e$export$b59bdbef9ce70de2 = /*#__PURE__*/ (0, $dbSRa$createBranchComponent)('item', (props, forwardedRef, item)=>{
    let ref = (0, $dbSRa$useObjectRef)(forwardedRef);
    let state = (0, $dbSRa$useContext)($1910c06f0ca9905e$export$38de1cb0526c21fb);
    let { dragAndDropHooks: dragAndDropHooks, dragState: dragState, dropState: dropState } = (0, $dbSRa$useContext)((0, $612b8eb6cb90e02d$export$d188a835a7bc5783));
    let { isVirtualized: isVirtualized, CollectionBranch: CollectionBranch } = (0, $dbSRa$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    let { rowProps: rowProps, ...states } = (0, $dbSRa$useTableRow)({
        node: item,
        shouldSelectOnPressUp: !!dragState,
        isVirtualized: isVirtualized
    }, state, ref);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $dbSRa$useFocusRing)();
    let { isFocusVisible: isFocusVisibleWithin, focusProps: focusWithinProps } = (0, $dbSRa$useFocusRing)({
        within: true
    });
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $dbSRa$useHover)({
        isDisabled: !states.allowsSelection && !states.hasAction,
        onHoverStart: props.onHoverStart,
        onHoverChange: props.onHoverChange,
        onHoverEnd: props.onHoverEnd
    });
    let { checkboxProps: checkboxProps } = (0, $dbSRa$useTableSelectionCheckbox)({
        key: item.key
    }, state);
    let draggableItem = undefined;
    if (dragState && dragAndDropHooks) draggableItem = dragAndDropHooks.useDraggableItem({
        key: item.key,
        hasDragButton: true
    }, dragState);
    let dropIndicator = undefined;
    let dropIndicatorRef = (0, $dbSRa$useRef)(null);
    let { visuallyHiddenProps: visuallyHiddenProps } = (0, $dbSRa$useVisuallyHidden)();
    if (dropState && dragAndDropHooks) dropIndicator = dragAndDropHooks.useDropIndicator({
        target: {
            type: 'item',
            key: item.key,
            dropPosition: 'on'
        }
    }, dropState, dropIndicatorRef);
    let dragButtonRef = (0, $dbSRa$useRef)(null);
    (0, $dbSRa$useEffect)(()=>{
        if (dragState && !dragButtonRef.current) console.warn('Draggable items in a Table must contain a <Button slot="drag"> element so that keyboard and screen reader users can drag them.');
    // eslint-disable-next-line
    }, []);
    let isDragging = dragState && dragState.isDragging(item.key);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let { children: _, ...restProps } = props;
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...restProps,
        id: undefined,
        defaultClassName: 'react-aria-Row',
        values: {
            ...states,
            isHovered: isHovered,
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            selectionMode: state.selectionManager.selectionMode,
            selectionBehavior: state.selectionManager.selectionBehavior,
            isDragging: isDragging,
            isDropTarget: dropIndicator === null || dropIndicator === void 0 ? void 0 : dropIndicator.isDropTarget,
            isFocusVisibleWithin: isFocusVisibleWithin
        }
    });
    let TR = $1910c06f0ca9905e$var$useElementType('tr');
    let TD = $1910c06f0ca9905e$var$useElementType('td');
    return /*#__PURE__*/ (0, $dbSRa$react).createElement((0, $dbSRa$react).Fragment, null, dropIndicator && !dropIndicator.isHidden && /*#__PURE__*/ (0, $dbSRa$react).createElement(TR, {
        role: "row",
        style: {
            height: 0
        }
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement(TD, {
        role: "gridcell",
        colSpan: state.collection.columnCount,
        style: {
            padding: 0
        }
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement("div", {
        role: "button",
        ...visuallyHiddenProps,
        ...dropIndicator.dropIndicatorProps,
        ref: dropIndicatorRef
    }))), /*#__PURE__*/ (0, $dbSRa$react).createElement(TR, {
        ...(0, $dbSRa$mergeProps)((0, $dbSRa$filterDOMProps)(props), rowProps, focusProps, hoverProps, draggableItem === null || draggableItem === void 0 ? void 0 : draggableItem.dragProps, focusWithinProps),
        ...renderProps,
        ref: ref,
        "data-disabled": states.isDisabled || undefined,
        "data-selected": states.isSelected || undefined,
        "data-hovered": isHovered || undefined,
        "data-focused": states.isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-pressed": states.isPressed || undefined,
        "data-dragging": isDragging || undefined,
        "data-drop-target": (dropIndicator === null || dropIndicator === void 0 ? void 0 : dropIndicator.isDropTarget) || undefined,
        "data-selection-mode": state.selectionManager.selectionMode === 'none' ? undefined : state.selectionManager.selectionMode,
        "data-focus-visible-within": isFocusVisibleWithin || undefined
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement((0, $64fa3d84918910a7$export$2881499e37b75b9a), {
        values: [
            [
                (0, $4e85f108e88277b8$export$b085522c77523c51),
                {
                    slots: {
                        [(0, $64fa3d84918910a7$export$c62b8e45d58ddad9)]: {},
                        selection: checkboxProps
                    }
                }
            ],
            [
                (0, $d2b4bc8c273e7be6$export$24d547caef80ccd1),
                {
                    slots: {
                        [(0, $64fa3d84918910a7$export$c62b8e45d58ddad9)]: {},
                        drag: {
                            ...draggableItem === null || draggableItem === void 0 ? void 0 : draggableItem.dragButtonProps,
                            ref: dragButtonRef,
                            style: {
                                pointerEvents: 'none'
                            }
                        }
                    }
                }
            ]
        ]
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement(CollectionBranch, {
        collection: state.collection,
        parent: item
    }))));
}, (props)=>{
    if (props.id == null && typeof props.children === 'function') throw new Error('No id detected for the Row element. The Row element requires a id to be provided to it when the cells are rendered dynamically.');
    let dependencies = [
        props.value
    ].concat(props.dependencies);
    return /*#__PURE__*/ (0, $dbSRa$react).createElement((0, $dbSRa$Collection), {
        dependencies: dependencies,
        items: props.columns,
        idScope: props.id
    }, props.children);
});
const $1910c06f0ca9905e$export$f6f0c3fe4ec306ea = /*#__PURE__*/ (0, $dbSRa$createLeafComponent)('cell', (props, forwardedRef, cell)=>{
    let ref = (0, $dbSRa$useObjectRef)(forwardedRef);
    let state = (0, $dbSRa$useContext)($1910c06f0ca9905e$export$38de1cb0526c21fb);
    let { dragState: dragState } = (0, $dbSRa$useContext)((0, $612b8eb6cb90e02d$export$d188a835a7bc5783));
    let { isVirtualized: isVirtualized } = (0, $dbSRa$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    cell.column = state.collection.columns[cell.index];
    let { gridCellProps: gridCellProps, isPressed: isPressed } = (0, $dbSRa$useTableCell)({
        node: cell,
        shouldSelectOnPressUp: !!dragState,
        isVirtualized: isVirtualized
    }, state, ref);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $dbSRa$useFocusRing)();
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $dbSRa$useHover)({});
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        id: undefined,
        defaultClassName: 'react-aria-Cell',
        values: {
            isFocused: isFocused,
            isFocusVisible: isFocusVisible,
            isPressed: isPressed,
            isHovered: isHovered
        }
    });
    let TD = $1910c06f0ca9905e$var$useElementType('td');
    return /*#__PURE__*/ (0, $dbSRa$react).createElement(TD, {
        ...(0, $dbSRa$mergeProps)((0, $dbSRa$filterDOMProps)(props), gridCellProps, focusProps, hoverProps),
        ...renderProps,
        ref: ref,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-pressed": isPressed || undefined
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement((0, $7135fc7d473fd974$export$4feb769f8ddf26c5).Provider, {
        value: (0, $7135fc7d473fd974$export$a164736487e3f0ae)
    }, renderProps.children));
});
function $1910c06f0ca9905e$var$TableDropIndicatorWrapper(props, ref) {
    ref = (0, $dbSRa$useObjectRef)(ref);
    let { dragAndDropHooks: dragAndDropHooks, dropState: dropState } = (0, $dbSRa$useContext)((0, $612b8eb6cb90e02d$export$d188a835a7bc5783));
    let buttonRef = (0, $dbSRa$useRef)(null);
    let { dropIndicatorProps: dropIndicatorProps, isHidden: isHidden, isDropTarget: isDropTarget } = dragAndDropHooks.useDropIndicator(props, dropState, buttonRef);
    if (isHidden) return null;
    return /*#__PURE__*/ (0, $dbSRa$react).createElement($1910c06f0ca9905e$var$TableDropIndicatorForwardRef, {
        ...props,
        dropIndicatorProps: dropIndicatorProps,
        isDropTarget: isDropTarget,
        buttonRef: buttonRef,
        ref: ref
    });
}
function $1910c06f0ca9905e$var$TableDropIndicator(props, ref) {
    let { dropIndicatorProps: dropIndicatorProps, isDropTarget: isDropTarget, buttonRef: buttonRef, ...otherProps } = props;
    let state = (0, $dbSRa$useContext)($1910c06f0ca9905e$export$38de1cb0526c21fb);
    let { visuallyHiddenProps: visuallyHiddenProps } = (0, $dbSRa$useVisuallyHidden)();
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...otherProps,
        defaultClassName: 'react-aria-DropIndicator',
        values: {
            isDropTarget: isDropTarget
        }
    });
    let TR = $1910c06f0ca9905e$var$useElementType('tr');
    let TD = $1910c06f0ca9905e$var$useElementType('td');
    return /*#__PURE__*/ (0, $dbSRa$react).createElement(TR, {
        ...(0, $dbSRa$filterDOMProps)(props),
        ...renderProps,
        role: "row",
        ref: ref,
        "data-drop-target": isDropTarget || undefined
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement(TD, {
        role: "gridcell",
        colSpan: state.collection.columnCount,
        style: {
            padding: 0
        }
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement("div", {
        ...visuallyHiddenProps,
        role: "button",
        ...dropIndicatorProps,
        ref: buttonRef
    }), renderProps.children));
}
const $1910c06f0ca9905e$var$TableDropIndicatorForwardRef = /*#__PURE__*/ (0, $dbSRa$forwardRef)($1910c06f0ca9905e$var$TableDropIndicator);
function $1910c06f0ca9905e$var$RootDropIndicator() {
    let state = (0, $dbSRa$useContext)($1910c06f0ca9905e$export$38de1cb0526c21fb);
    let { dragAndDropHooks: dragAndDropHooks, dropState: dropState } = (0, $dbSRa$useContext)((0, $612b8eb6cb90e02d$export$d188a835a7bc5783));
    let ref = (0, $dbSRa$useRef)(null);
    let { dropIndicatorProps: dropIndicatorProps } = dragAndDropHooks.useDropIndicator({
        target: {
            type: 'root'
        }
    }, dropState, ref);
    let isDropTarget = dropState.isDropTarget({
        type: 'root'
    });
    let { visuallyHiddenProps: visuallyHiddenProps } = (0, $dbSRa$useVisuallyHidden)();
    let TR = $1910c06f0ca9905e$var$useElementType('tr');
    let TD = $1910c06f0ca9905e$var$useElementType('td');
    if (!isDropTarget && dropIndicatorProps['aria-hidden']) return null;
    return /*#__PURE__*/ (0, $dbSRa$react).createElement(TR, {
        role: "row",
        "aria-hidden": dropIndicatorProps['aria-hidden'],
        style: {
            height: 0
        }
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement(TD, {
        role: "gridcell",
        colSpan: state.collection.columnCount,
        style: {
            padding: 0
        }
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement("div", {
        role: "button",
        ...visuallyHiddenProps,
        ...dropIndicatorProps,
        ref: ref
    })));
}
const $1910c06f0ca9905e$export$f241c45dcdfa4093 = (0, $dbSRa$createLeafComponent)('loader', function TableLoadingIndicator(props, ref, item) {
    let state = (0, $dbSRa$useContext)($1910c06f0ca9905e$export$38de1cb0526c21fb);
    let { isVirtualized: isVirtualized } = (0, $dbSRa$useContext)((0, $7135fc7d473fd974$export$4feb769f8ddf26c5));
    let numColumns = state.collection.columns.length;
    let renderProps = (0, $64fa3d84918910a7$export$4d86445c2cf5e3)({
        ...props,
        id: undefined,
        children: item.rendered,
        defaultClassName: 'react-aria-TableLoadingIndicator',
        values: null
    });
    let TR = $1910c06f0ca9905e$var$useElementType('tr');
    let TD = $1910c06f0ca9905e$var$useElementType('td');
    let rowProps = {};
    let rowHeaderProps = {};
    let style = {};
    if (isVirtualized) {
        rowProps['aria-rowindex'] = state.collection.headerRows.length + state.collection.size;
        rowHeaderProps['aria-colspan'] = numColumns;
        style = {
            display: 'contents'
        };
    } else rowHeaderProps['colSpan'] = numColumns;
    return /*#__PURE__*/ (0, $dbSRa$react).createElement((0, $dbSRa$react).Fragment, null, /*#__PURE__*/ (0, $dbSRa$react).createElement(TR, {
        role: "row",
        ref: ref,
        ...(0, $dbSRa$mergeProps)((0, $dbSRa$filterDOMProps)(props), rowProps),
        ...renderProps
    }, /*#__PURE__*/ (0, $dbSRa$react).createElement(TD, {
        role: "rowheader",
        ...rowHeaderProps,
        style: style
    }, renderProps.children)));
});


export {$1910c06f0ca9905e$export$7063e69b8a954175 as ResizableTableContainer, $1910c06f0ca9905e$export$93e4b0b2cc49b648 as TableContext, $1910c06f0ca9905e$export$38de1cb0526c21fb as TableStateContext, $1910c06f0ca9905e$export$a2680a798823803c as TableColumnResizeStateContext, $1910c06f0ca9905e$export$54ec01a60f47d33d as Table, $1910c06f0ca9905e$export$fddc468cd8cb4db9 as useTableOptions, $1910c06f0ca9905e$export$f850895b287ef28e as TableHeader, $1910c06f0ca9905e$export$816b5d811295e6bc as Column, $1910c06f0ca9905e$export$ee689e97a7664bfd as ColumnResizer, $1910c06f0ca9905e$export$76ccd210b9029917 as TableBody, $1910c06f0ca9905e$export$b59bdbef9ce70de2 as Row, $1910c06f0ca9905e$export$f6f0c3fe4ec306ea as Cell, $1910c06f0ca9905e$export$f241c45dcdfa4093 as UNSTABLE_TableLoadingIndicator};
//# sourceMappingURL=Table.module.js.map
