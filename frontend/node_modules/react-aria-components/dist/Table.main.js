var $b856e6788a7ea5bf$exports = require("./Button.main.js");
var $525402dfec7da5bc$exports = require("./RSPContexts.main.js");
var $3114c2382242bdc0$exports = require("./Collection.main.js");
var $c5ccf687772c0422$exports = require("./utils.main.js");
var $0c2289d253cb4544$exports = require("./DragAndDrop.main.js");
var $d72d752ea1c67b9a$exports = require("./intlStrings.main.js");
var $5VUTk$reactariacollections = require("@react-aria/collections");
var $5VUTk$reactstatelytable = require("@react-stately/table");
var $5VUTk$reactstately = require("react-stately");
var $5VUTk$reactaria = require("react-aria");
var $5VUTk$reactariautils = require("@react-aria/utils");
var $5VUTk$react = require("react");
var $5VUTk$reactdom = require("react-dom");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "ResizableTableContainer", () => $37b9a5d4bd0d4ded$export$7063e69b8a954175);
$parcel$export(module.exports, "TableContext", () => $37b9a5d4bd0d4ded$export$93e4b0b2cc49b648);
$parcel$export(module.exports, "TableStateContext", () => $37b9a5d4bd0d4ded$export$38de1cb0526c21fb);
$parcel$export(module.exports, "TableColumnResizeStateContext", () => $37b9a5d4bd0d4ded$export$a2680a798823803c);
$parcel$export(module.exports, "Table", () => $37b9a5d4bd0d4ded$export$54ec01a60f47d33d);
$parcel$export(module.exports, "useTableOptions", () => $37b9a5d4bd0d4ded$export$fddc468cd8cb4db9);
$parcel$export(module.exports, "TableHeader", () => $37b9a5d4bd0d4ded$export$f850895b287ef28e);
$parcel$export(module.exports, "Column", () => $37b9a5d4bd0d4ded$export$816b5d811295e6bc);
$parcel$export(module.exports, "ColumnResizer", () => $37b9a5d4bd0d4ded$export$ee689e97a7664bfd);
$parcel$export(module.exports, "TableBody", () => $37b9a5d4bd0d4ded$export$76ccd210b9029917);
$parcel$export(module.exports, "Row", () => $37b9a5d4bd0d4ded$export$b59bdbef9ce70de2);
$parcel$export(module.exports, "Cell", () => $37b9a5d4bd0d4ded$export$f6f0c3fe4ec306ea);
$parcel$export(module.exports, "UNSTABLE_TableLoadingIndicator", () => $37b9a5d4bd0d4ded$export$f241c45dcdfa4093);













class $37b9a5d4bd0d4ded$var$TableCollection extends (0, $5VUTk$reactariacollections.BaseCollection) {
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
        this.headerRows = (0, $5VUTk$reactstatelytable.buildHeaderRows)(columnKeyMap, this.columns);
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
        super(...args), this.headerRows = [], this.columns = [], this.rows = [], this.rowHeaderColumnKeys = new Set(), this.head = new (0, $5VUTk$reactariacollections.CollectionNode)('tableheader', -1), this.body = new (0, $5VUTk$reactariacollections.CollectionNode)('tablebody', -2), this.columnsDirty = true;
    }
}
const $37b9a5d4bd0d4ded$var$ResizableTableContainerContext = /*#__PURE__*/ (0, $5VUTk$react.createContext)(null);
const $37b9a5d4bd0d4ded$export$7063e69b8a954175 = /*#__PURE__*/ (0, $5VUTk$react.forwardRef)(function ResizableTableContainer(props, ref) {
    let containerRef = (0, $5VUTk$reactariautils.useObjectRef)(ref);
    let tableRef = (0, $5VUTk$react.useRef)(null);
    let scrollRef = (0, $5VUTk$react.useRef)(null);
    let [width, setWidth] = (0, $5VUTk$react.useState)(0);
    (0, $5VUTk$reactariautils.useLayoutEffect)(()=>{
        // Walk up the DOM from the Table to the ResizableTableContainer and stop
        // when we reach the first scrollable element. This is what we'll measure
        // to determine column widths (important due to width of scrollbars).
        // This will usually be the ResizableTableContainer for native tables, and
        // the Table itself for virtualized tables.
        let table = tableRef.current;
        while(table && table !== containerRef.current && !(0, $5VUTk$reactariautils.isScrollable)(table))table = table.parentElement;
        scrollRef.current = table;
    }, [
        containerRef
    ]);
    (0, $5VUTk$reactariautils.useResizeObserver)({
        ref: scrollRef,
        box: 'border-box',
        onResize () {
            var _scrollRef_current;
            var _scrollRef_current_clientWidth;
            setWidth((_scrollRef_current_clientWidth = (_scrollRef_current = scrollRef.current) === null || _scrollRef_current === void 0 ? void 0 : _scrollRef_current.clientWidth) !== null && _scrollRef_current_clientWidth !== void 0 ? _scrollRef_current_clientWidth : 0);
        }
    });
    (0, $5VUTk$reactariautils.useLayoutEffect)(()=>{
        var _scrollRef_current;
        var _scrollRef_current_clientWidth;
        setWidth((_scrollRef_current_clientWidth = (_scrollRef_current = scrollRef.current) === null || _scrollRef_current === void 0 ? void 0 : _scrollRef_current.clientWidth) !== null && _scrollRef_current_clientWidth !== void 0 ? _scrollRef_current_clientWidth : 0);
    }, []);
    let ctx = (0, $5VUTk$react.useMemo)(()=>({
            tableRef: tableRef,
            scrollRef: scrollRef,
            tableWidth: width,
            useTableColumnResizeState: $5VUTk$reactstately.useTableColumnResizeState,
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
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement("div", {
        ...(0, $5VUTk$reactariautils.filterDOMProps)(props),
        ref: containerRef,
        className: props.className || 'react-aria-ResizableTableContainer',
        style: props.style,
        onScroll: props.onScroll
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement($37b9a5d4bd0d4ded$var$ResizableTableContainerContext.Provider, {
        value: ctx
    }, props.children));
});
const $37b9a5d4bd0d4ded$export$93e4b0b2cc49b648 = /*#__PURE__*/ (0, $5VUTk$react.createContext)(null);
const $37b9a5d4bd0d4ded$export$38de1cb0526c21fb = /*#__PURE__*/ (0, $5VUTk$react.createContext)(null);
const $37b9a5d4bd0d4ded$export$a2680a798823803c = /*#__PURE__*/ (0, $5VUTk$react.createContext)(null);
const $37b9a5d4bd0d4ded$export$54ec01a60f47d33d = /*#__PURE__*/ (0, $5VUTk$react.forwardRef)(function Table(props, ref) {
    var _props_dragAndDropHooks;
    [props, ref] = (0, $c5ccf687772c0422$exports.useContextProps)(props, ref, $37b9a5d4bd0d4ded$export$93e4b0b2cc49b648);
    // Separate selection state so we have access to it from collection components via useTableOptions.
    let selectionState = (0, $5VUTk$reactstately.useMultipleSelectionState)(props);
    let { selectionBehavior: selectionBehavior, selectionMode: selectionMode, disallowEmptySelection: disallowEmptySelection } = selectionState;
    let hasDragHooks = !!((_props_dragAndDropHooks = props.dragAndDropHooks) === null || _props_dragAndDropHooks === void 0 ? void 0 : _props_dragAndDropHooks.useDraggableCollectionState);
    let ctx = (0, $5VUTk$react.useMemo)(()=>({
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
    let content = /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement($37b9a5d4bd0d4ded$var$TableOptionsContext.Provider, {
        value: ctx
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement((0, $5VUTk$reactariacollections.Collection), props));
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement((0, $5VUTk$reactariacollections.CollectionBuilder), {
        content: content,
        createCollection: ()=>new $37b9a5d4bd0d4ded$var$TableCollection()
    }, (collection)=>/*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement($37b9a5d4bd0d4ded$var$TableInner, {
            props: props,
            forwardedRef: ref,
            selectionState: selectionState,
            collection: collection
        }));
});
function $37b9a5d4bd0d4ded$var$TableInner({ props: props, forwardedRef: ref, selectionState: selectionState, collection: collection }) {
    let tableContainerContext = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$var$ResizableTableContainerContext);
    ref = (0, $5VUTk$reactariautils.useObjectRef)((0, $5VUTk$react.useMemo)(()=>(0, $5VUTk$reactariautils.mergeRefs)(ref, tableContainerContext === null || tableContainerContext === void 0 ? void 0 : tableContainerContext.tableRef), [
        ref,
        tableContainerContext === null || tableContainerContext === void 0 ? void 0 : tableContainerContext.tableRef
    ]));
    let state = (0, $5VUTk$reactstately.useTableState)({
        ...props,
        collection: collection,
        children: undefined,
        UNSAFE_selectionState: selectionState
    });
    let { isVirtualized: isVirtualized, layoutDelegate: layoutDelegate, dropTargetDelegate: ctxDropTargetDelegate, CollectionRoot: CollectionRoot } = (0, $5VUTk$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    let { dragAndDropHooks: dragAndDropHooks } = props;
    let { gridProps: gridProps } = (0, $5VUTk$reactaria.useTable)({
        ...props,
        layoutDelegate: layoutDelegate,
        isVirtualized: isVirtualized
    }, state, ref);
    let selectionManager = state.selectionManager;
    let hasDragHooks = !!(dragAndDropHooks === null || dragAndDropHooks === void 0 ? void 0 : dragAndDropHooks.useDraggableCollectionState);
    let hasDropHooks = !!(dragAndDropHooks === null || dragAndDropHooks === void 0 ? void 0 : dragAndDropHooks.useDroppableCollectionState);
    let dragHooksProvided = (0, $5VUTk$react.useRef)(hasDragHooks);
    let dropHooksProvided = (0, $5VUTk$react.useRef)(hasDropHooks);
    (0, $5VUTk$react.useEffect)(()=>{
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
    let preview = (0, $5VUTk$react.useRef)(null);
    if (hasDragHooks && dragAndDropHooks) {
        dragState = dragAndDropHooks.useDraggableCollectionState({
            collection: collection,
            selectionManager: selectionManager,
            preview: dragAndDropHooks.renderDragPreview ? preview : undefined
        });
        dragAndDropHooks.useDraggableCollection({}, dragState, ref);
        let DragPreview = dragAndDropHooks.DragPreview;
        dragPreview = dragAndDropHooks.renderDragPreview ? /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(DragPreview, {
            ref: preview
        }, dragAndDropHooks.renderDragPreview) : null;
    }
    if (hasDropHooks && dragAndDropHooks) {
        dropState = dragAndDropHooks.useDroppableCollectionState({
            collection: collection,
            selectionManager: selectionManager
        });
        let keyboardDelegate = new (0, $5VUTk$reactaria.ListKeyboardDelegate)({
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
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $5VUTk$reactaria.useFocusRing)();
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    let ElementType = $37b9a5d4bd0d4ded$var$useElementType('table');
    var _tableContainerContext_scrollRef;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $37b9a5d4bd0d4ded$export$38de1cb0526c21fb,
                state
            ],
            [
                $37b9a5d4bd0d4ded$export$a2680a798823803c,
                layoutState
            ],
            [
                (0, $0c2289d253cb4544$exports.DragAndDropContext),
                {
                    dragAndDropHooks: dragAndDropHooks,
                    dragState: dragState,
                    dropState: dropState
                }
            ],
            [
                (0, $0c2289d253cb4544$exports.DropIndicatorContext),
                {
                    render: $37b9a5d4bd0d4ded$var$TableDropIndicatorWrapper
                }
            ]
        ]
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement((0, $5VUTk$reactaria.FocusScope), null, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(ElementType, {
        ...(0, $5VUTk$reactariautils.filterDOMProps)(props),
        ...renderProps,
        ...(0, $5VUTk$reactaria.mergeProps)(gridProps, focusProps, droppableCollection === null || droppableCollection === void 0 ? void 0 : droppableCollection.collectionProps),
        style: style,
        ref: ref,
        slot: props.slot || undefined,
        onScroll: props.onScroll,
        "data-allows-dragging": isListDraggable || undefined,
        "data-drop-target": isRootDropTarget || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(CollectionRoot, {
        collection: collection,
        scrollRef: (_tableContainerContext_scrollRef = tableContainerContext === null || tableContainerContext === void 0 ? void 0 : tableContainerContext.scrollRef) !== null && _tableContainerContext_scrollRef !== void 0 ? _tableContainerContext_scrollRef : ref,
        persistedKeys: (0, $0c2289d253cb4544$exports.useDndPersistedKeys)(selectionManager, dragAndDropHooks, dropState)
    }))), dragPreview);
}
function $37b9a5d4bd0d4ded$var$useElementType(element) {
    let { isVirtualized: isVirtualized } = (0, $5VUTk$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    return isVirtualized ? 'div' : element;
}
const $37b9a5d4bd0d4ded$var$TableOptionsContext = /*#__PURE__*/ (0, $5VUTk$react.createContext)(null);
function $37b9a5d4bd0d4ded$export$fddc468cd8cb4db9() {
    return (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$var$TableOptionsContext);
}
const $37b9a5d4bd0d4ded$export$f850895b287ef28e = /*#__PURE__*/ (0, $5VUTk$reactariacollections.createBranchComponent)('tableheader', (props, ref)=>{
    let collection = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$export$38de1cb0526c21fb).collection;
    let headerRows = (0, $5VUTk$reactariacollections.useCachedChildren)({
        items: collection.headerRows,
        children: (0, $5VUTk$react.useCallback)((item)=>{
            switch(item.type){
                case 'headerrow':
                    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement($37b9a5d4bd0d4ded$var$TableHeaderRow, {
                        item: item
                    });
                default:
                    throw new Error('Unsupported node type in TableHeader: ' + item.type);
            }
        }, [])
    });
    let THead = $37b9a5d4bd0d4ded$var$useElementType('thead');
    let { rowGroupProps: rowGroupProps } = (0, $5VUTk$reactaria.useTableRowGroup)();
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $5VUTk$reactaria.useHover)({
        onHoverStart: props.onHoverStart,
        onHoverChange: props.onHoverChange,
        onHoverEnd: props.onHoverEnd
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        className: props.className,
        style: props.style,
        defaultClassName: 'react-aria-TableHeader',
        values: {
            isHovered: isHovered
        }
    });
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(THead, {
        ...(0, $5VUTk$reactaria.mergeProps)((0, $5VUTk$reactariautils.filterDOMProps)(props), rowGroupProps, hoverProps),
        ...renderProps,
        ref: ref,
        "data-hovered": isHovered || undefined
    }, headerRows);
}, (props)=>/*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement((0, $5VUTk$reactariacollections.Collection), {
        dependencies: props.dependencies,
        items: props.columns
    }, props.children));
function $37b9a5d4bd0d4ded$var$TableHeaderRow({ item: item }) {
    let ref = (0, $5VUTk$react.useRef)(null);
    let state = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$export$38de1cb0526c21fb);
    let { isVirtualized: isVirtualized, CollectionBranch: CollectionBranch } = (0, $5VUTk$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    let { rowProps: rowProps } = (0, $5VUTk$reactaria.useTableHeaderRow)({
        node: item,
        isVirtualized: isVirtualized
    }, state, ref);
    let { checkboxProps: checkboxProps } = (0, $5VUTk$reactaria.useTableSelectAllCheckbox)(state);
    let TR = $37b9a5d4bd0d4ded$var$useElementType('tr');
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TR, {
        ...rowProps,
        ref: ref
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                (0, $525402dfec7da5bc$exports.CheckboxContext),
                {
                    slots: {
                        selection: checkboxProps
                    }
                }
            ]
        ]
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(CollectionBranch, {
        collection: state.collection,
        parent: item
    })));
}
const $37b9a5d4bd0d4ded$export$816b5d811295e6bc = /*#__PURE__*/ (0, $5VUTk$reactariacollections.createLeafComponent)('column', (props, forwardedRef, column)=>{
    var _state_sortDescriptor, _state_sortDescriptor1;
    let ref = (0, $5VUTk$reactariautils.useObjectRef)(forwardedRef);
    let state = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$export$38de1cb0526c21fb);
    let { isVirtualized: isVirtualized } = (0, $5VUTk$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    let { columnHeaderProps: columnHeaderProps } = (0, $5VUTk$reactaria.useTableColumnHeader)({
        node: column,
        isVirtualized: isVirtualized
    }, state, ref);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $5VUTk$reactaria.useFocusRing)();
    let layoutState = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$export$a2680a798823803c);
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
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $5VUTk$reactaria.useHover)({
        isDisabled: !props.allowsSorting
    });
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    let TH = $37b9a5d4bd0d4ded$var$useElementType('th');
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TH, {
        ...(0, $5VUTk$reactaria.mergeProps)((0, $5VUTk$reactariautils.filterDOMProps)(props), columnHeaderProps, focusProps, hoverProps),
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
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                $37b9a5d4bd0d4ded$var$ColumnResizerContext,
                {
                    column: column,
                    triggerRef: ref
                }
            ],
            [
                (0, $3114c2382242bdc0$exports.CollectionRendererContext),
                (0, $3114c2382242bdc0$exports.DefaultCollectionRenderer)
            ]
        ]
    }, renderProps.children));
});
const $37b9a5d4bd0d4ded$var$ColumnResizerContext = /*#__PURE__*/ (0, $5VUTk$react.createContext)(null);
const $37b9a5d4bd0d4ded$export$ee689e97a7664bfd = /*#__PURE__*/ (0, $5VUTk$react.forwardRef)(function ColumnResizer(props, ref) {
    let layoutState = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$export$a2680a798823803c);
    if (!layoutState) throw new Error('Wrap your <Table> in a <ResizableTableContainer> to enable column resizing');
    let stringFormatter = (0, $5VUTk$reactaria.useLocalizedStringFormatter)((0, ($parcel$interopDefault($d72d752ea1c67b9a$exports))), 'react-aria-components');
    let { onResizeStart: onResizeStart, onResize: onResize, onResizeEnd: onResizeEnd } = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$var$ResizableTableContainerContext);
    let { column: column, triggerRef: triggerRef } = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$var$ColumnResizerContext);
    let inputRef = (0, $5VUTk$react.useRef)(null);
    let { resizerProps: resizerProps, inputProps: inputProps, isResizing: isResizing } = (0, $5VUTk$reactaria.useTableColumnResize)({
        column: column,
        'aria-label': props['aria-label'] || stringFormatter.format('tableResizer'),
        onResizeStart: onResizeStart,
        onResize: onResize,
        onResizeEnd: onResizeEnd,
        triggerRef: triggerRef
    }, layoutState, inputRef);
    let { focusProps: focusProps, isFocused: isFocused, isFocusVisible: isFocusVisible } = (0, $5VUTk$reactaria.useFocusRing)();
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $5VUTk$reactaria.useHover)(props);
    let isEResizable = layoutState.getColumnMinWidth(column.key) >= layoutState.getColumnWidth(column.key);
    let isWResizable = layoutState.getColumnMaxWidth(column.key) <= layoutState.getColumnWidth(column.key);
    let { direction: direction } = (0, $5VUTk$reactaria.useLocale)();
    let resizableDirection = 'both';
    if (isEResizable) resizableDirection = direction === 'rtl' ? 'right' : 'left';
    else if (isWResizable) resizableDirection = direction === 'rtl' ? 'left' : 'right';
    else resizableDirection = 'both';
    let objectRef = (0, $5VUTk$reactariautils.useObjectRef)(ref);
    let [cursor, setCursor] = (0, $5VUTk$react.useState)('');
    (0, $5VUTk$react.useEffect)(()=>{
        if (!objectRef.current) return;
        let style = window.getComputedStyle(objectRef.current);
        setCursor(style.cursor);
    }, [
        objectRef,
        resizableDirection
    ]);
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    let [isMouseDown, setMouseDown] = (0, $5VUTk$react.useState)(false);
    let onPointerDown = (e)=>{
        if (e.pointerType === 'mouse') setMouseDown(true);
    };
    if (!isResizing && isMouseDown) setMouseDown(false);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement("div", {
        ref: objectRef,
        role: "presentation",
        ...(0, $5VUTk$reactariautils.filterDOMProps)(props),
        ...renderProps,
        ...(0, $5VUTk$reactaria.mergeProps)(resizerProps, {
            onPointerDown: onPointerDown
        }, hoverProps),
        "data-hovered": isHovered || undefined,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-resizing": isResizing || undefined,
        "data-resizable-direction": resizableDirection
    }, renderProps.children, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement("input", {
        ref: inputRef,
        ...(0, $5VUTk$reactaria.mergeProps)(inputProps, focusProps)
    }), isResizing && isMouseDown && /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$reactdom))).createPortal(/*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement("div", {
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
const $37b9a5d4bd0d4ded$export$76ccd210b9029917 = /*#__PURE__*/ (0, $5VUTk$reactariacollections.createBranchComponent)('tablebody', (props, ref)=>{
    let state = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$export$38de1cb0526c21fb);
    let { isVirtualized: isVirtualized } = (0, $5VUTk$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    let collection = state.collection;
    let { CollectionBranch: CollectionBranch } = (0, $5VUTk$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    let { dragAndDropHooks: dragAndDropHooks, dropState: dropState } = (0, $5VUTk$react.useContext)((0, $0c2289d253cb4544$exports.DragAndDropContext));
    let isDroppable = !!(dragAndDropHooks === null || dragAndDropHooks === void 0 ? void 0 : dragAndDropHooks.useDroppableCollectionState) && !(dropState === null || dropState === void 0 ? void 0 : dropState.isDisabled);
    var _dropState_isDropTarget;
    let isRootDropTarget = isDroppable && !!dropState && ((_dropState_isDropTarget = dropState.isDropTarget({
        type: 'root'
    })) !== null && _dropState_isDropTarget !== void 0 ? _dropState_isDropTarget : false);
    let renderValues = {
        isDropTarget: isRootDropTarget,
        isEmpty: collection.size === 0
    };
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        id: undefined,
        children: undefined,
        defaultClassName: 'react-aria-TableBody',
        values: renderValues
    });
    let emptyState;
    let TR = $37b9a5d4bd0d4ded$var$useElementType('tr');
    let TD = $37b9a5d4bd0d4ded$var$useElementType('td');
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
        emptyState = /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TR, {
            role: "row",
            ...rowProps,
            style: style
        }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TD, {
            role: "rowheader",
            ...rowHeaderProps,
            style: style
        }, props.renderEmptyState(renderValues)));
    }
    let { rowGroupProps: rowGroupProps } = (0, $5VUTk$reactaria.useTableRowGroup)();
    let TBody = $37b9a5d4bd0d4ded$var$useElementType('tbody');
    // TODO: TableBody doesn't support being the scrollable body of the table yet, to revisit if needed. Would need to
    // call useLoadMore here and walk up the DOM to the nearest scrollable element to set scrollRef
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TBody, {
        ...(0, $5VUTk$reactaria.mergeProps)((0, $5VUTk$reactariautils.filterDOMProps)(props), rowGroupProps),
        ...renderProps,
        ref: ref,
        "data-empty": collection.size === 0 || undefined
    }, isDroppable && /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement($37b9a5d4bd0d4ded$var$RootDropIndicator, null), /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(CollectionBranch, {
        collection: collection,
        parent: collection.body,
        renderDropIndicator: (0, $0c2289d253cb4544$exports.useRenderDropIndicator)(dragAndDropHooks, dropState)
    }), emptyState);
});
const $37b9a5d4bd0d4ded$export$b59bdbef9ce70de2 = /*#__PURE__*/ (0, $5VUTk$reactariacollections.createBranchComponent)('item', (props, forwardedRef, item)=>{
    let ref = (0, $5VUTk$reactariautils.useObjectRef)(forwardedRef);
    let state = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$export$38de1cb0526c21fb);
    let { dragAndDropHooks: dragAndDropHooks, dragState: dragState, dropState: dropState } = (0, $5VUTk$react.useContext)((0, $0c2289d253cb4544$exports.DragAndDropContext));
    let { isVirtualized: isVirtualized, CollectionBranch: CollectionBranch } = (0, $5VUTk$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    let { rowProps: rowProps, ...states } = (0, $5VUTk$reactaria.useTableRow)({
        node: item,
        shouldSelectOnPressUp: !!dragState,
        isVirtualized: isVirtualized
    }, state, ref);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $5VUTk$reactaria.useFocusRing)();
    let { isFocusVisible: isFocusVisibleWithin, focusProps: focusWithinProps } = (0, $5VUTk$reactaria.useFocusRing)({
        within: true
    });
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $5VUTk$reactaria.useHover)({
        isDisabled: !states.allowsSelection && !states.hasAction,
        onHoverStart: props.onHoverStart,
        onHoverChange: props.onHoverChange,
        onHoverEnd: props.onHoverEnd
    });
    let { checkboxProps: checkboxProps } = (0, $5VUTk$reactaria.useTableSelectionCheckbox)({
        key: item.key
    }, state);
    let draggableItem = undefined;
    if (dragState && dragAndDropHooks) draggableItem = dragAndDropHooks.useDraggableItem({
        key: item.key,
        hasDragButton: true
    }, dragState);
    let dropIndicator = undefined;
    let dropIndicatorRef = (0, $5VUTk$react.useRef)(null);
    let { visuallyHiddenProps: visuallyHiddenProps } = (0, $5VUTk$reactaria.useVisuallyHidden)();
    if (dropState && dragAndDropHooks) dropIndicator = dragAndDropHooks.useDropIndicator({
        target: {
            type: 'item',
            key: item.key,
            dropPosition: 'on'
        }
    }, dropState, dropIndicatorRef);
    let dragButtonRef = (0, $5VUTk$react.useRef)(null);
    (0, $5VUTk$react.useEffect)(()=>{
        if (dragState && !dragButtonRef.current) console.warn('Draggable items in a Table must contain a <Button slot="drag"> element so that keyboard and screen reader users can drag them.');
    // eslint-disable-next-line
    }, []);
    let isDragging = dragState && dragState.isDragging(item.key);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let { children: _, ...restProps } = props;
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    let TR = $37b9a5d4bd0d4ded$var$useElementType('tr');
    let TD = $37b9a5d4bd0d4ded$var$useElementType('td');
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement((0, ($parcel$interopDefault($5VUTk$react))).Fragment, null, dropIndicator && !dropIndicator.isHidden && /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TR, {
        role: "row",
        style: {
            height: 0
        }
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TD, {
        role: "gridcell",
        colSpan: state.collection.columnCount,
        style: {
            padding: 0
        }
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement("div", {
        role: "button",
        ...visuallyHiddenProps,
        ...dropIndicator.dropIndicatorProps,
        ref: dropIndicatorRef
    }))), /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TR, {
        ...(0, $5VUTk$reactaria.mergeProps)((0, $5VUTk$reactariautils.filterDOMProps)(props), rowProps, focusProps, hoverProps, draggableItem === null || draggableItem === void 0 ? void 0 : draggableItem.dragProps, focusWithinProps),
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
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement((0, $c5ccf687772c0422$exports.Provider), {
        values: [
            [
                (0, $525402dfec7da5bc$exports.CheckboxContext),
                {
                    slots: {
                        [(0, $c5ccf687772c0422$exports.DEFAULT_SLOT)]: {},
                        selection: checkboxProps
                    }
                }
            ],
            [
                (0, $b856e6788a7ea5bf$exports.ButtonContext),
                {
                    slots: {
                        [(0, $c5ccf687772c0422$exports.DEFAULT_SLOT)]: {},
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
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(CollectionBranch, {
        collection: state.collection,
        parent: item
    }))));
}, (props)=>{
    if (props.id == null && typeof props.children === 'function') throw new Error('No id detected for the Row element. The Row element requires a id to be provided to it when the cells are rendered dynamically.');
    let dependencies = [
        props.value
    ].concat(props.dependencies);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement((0, $5VUTk$reactariacollections.Collection), {
        dependencies: dependencies,
        items: props.columns,
        idScope: props.id
    }, props.children);
});
const $37b9a5d4bd0d4ded$export$f6f0c3fe4ec306ea = /*#__PURE__*/ (0, $5VUTk$reactariacollections.createLeafComponent)('cell', (props, forwardedRef, cell)=>{
    let ref = (0, $5VUTk$reactariautils.useObjectRef)(forwardedRef);
    let state = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$export$38de1cb0526c21fb);
    let { dragState: dragState } = (0, $5VUTk$react.useContext)((0, $0c2289d253cb4544$exports.DragAndDropContext));
    let { isVirtualized: isVirtualized } = (0, $5VUTk$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    cell.column = state.collection.columns[cell.index];
    let { gridCellProps: gridCellProps, isPressed: isPressed } = (0, $5VUTk$reactaria.useTableCell)({
        node: cell,
        shouldSelectOnPressUp: !!dragState,
        isVirtualized: isVirtualized
    }, state, ref);
    let { isFocused: isFocused, isFocusVisible: isFocusVisible, focusProps: focusProps } = (0, $5VUTk$reactaria.useFocusRing)();
    let { hoverProps: hoverProps, isHovered: isHovered } = (0, $5VUTk$reactaria.useHover)({});
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
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
    let TD = $37b9a5d4bd0d4ded$var$useElementType('td');
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TD, {
        ...(0, $5VUTk$reactaria.mergeProps)((0, $5VUTk$reactariautils.filterDOMProps)(props), gridCellProps, focusProps, hoverProps),
        ...renderProps,
        ref: ref,
        "data-focused": isFocused || undefined,
        "data-focus-visible": isFocusVisible || undefined,
        "data-pressed": isPressed || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement((0, $3114c2382242bdc0$exports.CollectionRendererContext).Provider, {
        value: (0, $3114c2382242bdc0$exports.DefaultCollectionRenderer)
    }, renderProps.children));
});
function $37b9a5d4bd0d4ded$var$TableDropIndicatorWrapper(props, ref) {
    ref = (0, $5VUTk$reactariautils.useObjectRef)(ref);
    let { dragAndDropHooks: dragAndDropHooks, dropState: dropState } = (0, $5VUTk$react.useContext)((0, $0c2289d253cb4544$exports.DragAndDropContext));
    let buttonRef = (0, $5VUTk$react.useRef)(null);
    let { dropIndicatorProps: dropIndicatorProps, isHidden: isHidden, isDropTarget: isDropTarget } = dragAndDropHooks.useDropIndicator(props, dropState, buttonRef);
    if (isHidden) return null;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement($37b9a5d4bd0d4ded$var$TableDropIndicatorForwardRef, {
        ...props,
        dropIndicatorProps: dropIndicatorProps,
        isDropTarget: isDropTarget,
        buttonRef: buttonRef,
        ref: ref
    });
}
function $37b9a5d4bd0d4ded$var$TableDropIndicator(props, ref) {
    let { dropIndicatorProps: dropIndicatorProps, isDropTarget: isDropTarget, buttonRef: buttonRef, ...otherProps } = props;
    let state = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$export$38de1cb0526c21fb);
    let { visuallyHiddenProps: visuallyHiddenProps } = (0, $5VUTk$reactaria.useVisuallyHidden)();
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...otherProps,
        defaultClassName: 'react-aria-DropIndicator',
        values: {
            isDropTarget: isDropTarget
        }
    });
    let TR = $37b9a5d4bd0d4ded$var$useElementType('tr');
    let TD = $37b9a5d4bd0d4ded$var$useElementType('td');
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TR, {
        ...(0, $5VUTk$reactariautils.filterDOMProps)(props),
        ...renderProps,
        role: "row",
        ref: ref,
        "data-drop-target": isDropTarget || undefined
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TD, {
        role: "gridcell",
        colSpan: state.collection.columnCount,
        style: {
            padding: 0
        }
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement("div", {
        ...visuallyHiddenProps,
        role: "button",
        ...dropIndicatorProps,
        ref: buttonRef
    }), renderProps.children));
}
const $37b9a5d4bd0d4ded$var$TableDropIndicatorForwardRef = /*#__PURE__*/ (0, $5VUTk$react.forwardRef)($37b9a5d4bd0d4ded$var$TableDropIndicator);
function $37b9a5d4bd0d4ded$var$RootDropIndicator() {
    let state = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$export$38de1cb0526c21fb);
    let { dragAndDropHooks: dragAndDropHooks, dropState: dropState } = (0, $5VUTk$react.useContext)((0, $0c2289d253cb4544$exports.DragAndDropContext));
    let ref = (0, $5VUTk$react.useRef)(null);
    let { dropIndicatorProps: dropIndicatorProps } = dragAndDropHooks.useDropIndicator({
        target: {
            type: 'root'
        }
    }, dropState, ref);
    let isDropTarget = dropState.isDropTarget({
        type: 'root'
    });
    let { visuallyHiddenProps: visuallyHiddenProps } = (0, $5VUTk$reactaria.useVisuallyHidden)();
    let TR = $37b9a5d4bd0d4ded$var$useElementType('tr');
    let TD = $37b9a5d4bd0d4ded$var$useElementType('td');
    if (!isDropTarget && dropIndicatorProps['aria-hidden']) return null;
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TR, {
        role: "row",
        "aria-hidden": dropIndicatorProps['aria-hidden'],
        style: {
            height: 0
        }
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TD, {
        role: "gridcell",
        colSpan: state.collection.columnCount,
        style: {
            padding: 0
        }
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement("div", {
        role: "button",
        ...visuallyHiddenProps,
        ...dropIndicatorProps,
        ref: ref
    })));
}
const $37b9a5d4bd0d4ded$export$f241c45dcdfa4093 = (0, $5VUTk$reactariacollections.createLeafComponent)('loader', function TableLoadingIndicator(props, ref, item) {
    let state = (0, $5VUTk$react.useContext)($37b9a5d4bd0d4ded$export$38de1cb0526c21fb);
    let { isVirtualized: isVirtualized } = (0, $5VUTk$react.useContext)((0, $3114c2382242bdc0$exports.CollectionRendererContext));
    let numColumns = state.collection.columns.length;
    let renderProps = (0, $c5ccf687772c0422$exports.useRenderProps)({
        ...props,
        id: undefined,
        children: item.rendered,
        defaultClassName: 'react-aria-TableLoadingIndicator',
        values: null
    });
    let TR = $37b9a5d4bd0d4ded$var$useElementType('tr');
    let TD = $37b9a5d4bd0d4ded$var$useElementType('td');
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
    return /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement((0, ($parcel$interopDefault($5VUTk$react))).Fragment, null, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TR, {
        role: "row",
        ref: ref,
        ...(0, $5VUTk$reactaria.mergeProps)((0, $5VUTk$reactariautils.filterDOMProps)(props), rowProps),
        ...renderProps
    }, /*#__PURE__*/ (0, ($parcel$interopDefault($5VUTk$react))).createElement(TD, {
        role: "rowheader",
        ...rowHeaderProps,
        style: style
    }, renderProps.children)));
});


//# sourceMappingURL=Table.main.js.map
