var $499e2959ba1abacc$exports = require("./BaseCollection.main.js");
var $c20afee375f3b2d6$exports = require("./Document.main.js");
var $245f3f827bea6653$exports = require("./useCachedChildren.main.js");
var $eaaf60978b89fc58$exports = require("./Hidden.main.js");
var $4ftIM$reactdom = require("react-dom");
var $4ftIM$react = require("react");
var $4ftIM$reactariassr = require("@react-aria/ssr");
var $4ftIM$reactariautils = require("@react-aria/utils");
var $4ftIM$usesyncexternalstoreshimindexjs = require("use-sync-external-store/shim/index.js");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "CollectionBuilder", () => $f20386e2aa690b4a$export$bf788dd355e3a401);
$parcel$export(module.exports, "createLeafComponent", () => $f20386e2aa690b4a$export$18af5c7a9e9b3664);
$parcel$export(module.exports, "createBranchComponent", () => $f20386e2aa690b4a$export$e953bb1cd0f19726);
$parcel$export(module.exports, "Collection", () => $f20386e2aa690b4a$export$fb8073518f34e6ec);
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








const $f20386e2aa690b4a$var$ShallowRenderContext = /*#__PURE__*/ (0, $4ftIM$react.createContext)(false);
const $f20386e2aa690b4a$var$CollectionDocumentContext = /*#__PURE__*/ (0, $4ftIM$react.createContext)(null);
function $f20386e2aa690b4a$export$bf788dd355e3a401(props) {
    // If a document was provided above us, we're already in a hidden tree. Just render the content.
    let doc = (0, $4ftIM$react.useContext)($f20386e2aa690b4a$var$CollectionDocumentContext);
    if (doc) // The React types prior to 18 did not allow returning ReactNode from components
    // even though the actual implementation since React 16 did.
    // We must return ReactElement so that TS does not complain that <CollectionBuilder>
    // is not a valid JSX element with React 16 and 17 types.
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
    return props.content;
    // Otherwise, render a hidden copy of the children so that we can build the collection before constructing the state.
    // This should always come before the real DOM content so we have built the collection by the time it renders during SSR.
    // This is fine. CollectionDocumentContext never changes after mounting.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let { collection: collection, document: document } = $f20386e2aa690b4a$var$useCollectionDocument(props.createCollection);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement((0, ($parcel$interopDefault($4ftIM$react))).Fragment, null, /*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement((0, $eaaf60978b89fc58$exports.Hidden), null, /*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement($f20386e2aa690b4a$var$CollectionDocumentContext.Provider, {
        value: document
    }, props.content)), /*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement($f20386e2aa690b4a$var$CollectionInner, {
        render: props.children,
        collection: collection
    }));
}
function $f20386e2aa690b4a$var$CollectionInner({ collection: collection, render: render }) {
    return render(collection);
}
// React 16 and 17 don't support useSyncExternalStore natively, and the shim provided by React does not support getServerSnapshot.
// This wrapper uses the shim, but additionally calls getServerSnapshot during SSR (according to SSRProvider).
function $f20386e2aa690b4a$var$useSyncExternalStoreFallback(subscribe, getSnapshot, getServerSnapshot) {
    let isSSR = (0, $4ftIM$reactariassr.useIsSSR)();
    let isSSRRef = (0, $4ftIM$react.useRef)(isSSR);
    // This is read immediately inside the wrapper, which also runs during render.
    // We just need a ref to avoid invalidating the callback itself, which
    // would cause React to re-run the callback more than necessary.
    // eslint-disable-next-line rulesdir/pure-render
    isSSRRef.current = isSSR;
    let getSnapshotWrapper = (0, $4ftIM$react.useCallback)(()=>{
        return isSSRRef.current ? getServerSnapshot() : getSnapshot();
    }, [
        getSnapshot,
        getServerSnapshot
    ]);
    return (0, $4ftIM$usesyncexternalstoreshimindexjs.useSyncExternalStore)(subscribe, getSnapshotWrapper);
}
const $f20386e2aa690b4a$var$useSyncExternalStore = typeof (0, ($parcel$interopDefault($4ftIM$react)))['useSyncExternalStore'] === 'function' ? (0, ($parcel$interopDefault($4ftIM$react)))['useSyncExternalStore'] : $f20386e2aa690b4a$var$useSyncExternalStoreFallback;
function $f20386e2aa690b4a$var$useCollectionDocument(createCollection) {
    // The document instance is mutable, and should never change between renders.
    // useSyncExternalStore is used to subscribe to updates, which vends immutable Collection objects.
    let [document] = (0, $4ftIM$react.useState)(()=>new (0, $c20afee375f3b2d6$exports.Document)((createCollection === null || createCollection === void 0 ? void 0 : createCollection()) || new (0, $499e2959ba1abacc$exports.BaseCollection)()));
    let subscribe = (0, $4ftIM$react.useCallback)((fn)=>document.subscribe(fn), [
        document
    ]);
    let getSnapshot = (0, $4ftIM$react.useCallback)(()=>{
        let collection = document.getCollection();
        if (document.isSSR) // After SSR is complete, reset the document to empty so it is ready for React to render the portal into.
        // We do this _after_ getting the collection above so that the collection still has content in it from SSR
        // during the current render, before React has finished the client render.
        document.resetAfterSSR();
        return collection;
    }, [
        document
    ]);
    let getServerSnapshot = (0, $4ftIM$react.useCallback)(()=>{
        document.isSSR = true;
        return document.getCollection();
    }, [
        document
    ]);
    let collection = $f20386e2aa690b4a$var$useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    (0, $4ftIM$reactariautils.useLayoutEffect)(()=>{
        document.isMounted = true;
        return ()=>{
            // Mark unmounted so we can skip all of the collection updates caused by 
            // React calling removeChild on every item in the collection.
            document.isMounted = false;
        };
    }, [
        document
    ]);
    return {
        collection: collection,
        document: document
    };
}
const $f20386e2aa690b4a$var$SSRContext = /*#__PURE__*/ (0, $4ftIM$react.createContext)(null);
function $f20386e2aa690b4a$var$useSSRCollectionNode(Type, props, ref, rendered, children, render) {
    // During SSR, portals are not supported, so the collection children will be wrapped in an SSRContext.
    // Since SSR occurs only once, we assume that the elements are rendered in order and never re-render.
    // Therefore we can create elements in our collection document during render so that they are in the
    // collection by the time we need to use the collection to render to the real DOM.
    // After hydration, we switch to client rendering using the portal.
    let itemRef = (0, $4ftIM$react.useCallback)((element)=>{
        element === null || element === void 0 ? void 0 : element.setProps(props, ref, rendered, render);
    }, [
        props,
        ref,
        rendered,
        render
    ]);
    let parentNode = (0, $4ftIM$react.useContext)($f20386e2aa690b4a$var$SSRContext);
    if (parentNode) {
        // Guard against double rendering in strict mode.
        let element = parentNode.ownerDocument.nodesByProps.get(props);
        if (!element) {
            element = parentNode.ownerDocument.createElement(Type);
            element.setProps(props, ref, rendered, render);
            parentNode.appendChild(element);
            parentNode.ownerDocument.updateCollection();
            parentNode.ownerDocument.nodesByProps.set(props, element);
        }
        return children ? /*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement($f20386e2aa690b4a$var$SSRContext.Provider, {
            value: element
        }, children) : null;
    }
    // @ts-ignore
    return /*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement(Type, {
        ref: itemRef
    }, children);
}
function $f20386e2aa690b4a$export$18af5c7a9e9b3664(type, render) {
    let Component = ({ node: node })=>render(node.props, node.props.ref, node);
    let Result = (0, $4ftIM$react.forwardRef)((props, ref)=>{
        let isShallow = (0, $4ftIM$react.useContext)($f20386e2aa690b4a$var$ShallowRenderContext);
        if (!isShallow) {
            if (render.length >= 3) throw new Error(render.name + ' cannot be rendered outside a collection.');
            return render(props, ref);
        }
        return $f20386e2aa690b4a$var$useSSRCollectionNode(type, props, ref, 'children' in props ? props.children : null, null, (node)=>/*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement(Component, {
                node: node
            }));
    });
    // @ts-ignore
    Result.displayName = render.name;
    return Result;
}
function $f20386e2aa690b4a$export$e953bb1cd0f19726(type, render, useChildren = $f20386e2aa690b4a$var$useCollectionChildren) {
    let Component = ({ node: node })=>render(node.props, node.props.ref, node);
    let Result = (0, $4ftIM$react.forwardRef)((props, ref)=>{
        let children = useChildren(props);
        var _useSSRCollectionNode;
        return (_useSSRCollectionNode = $f20386e2aa690b4a$var$useSSRCollectionNode(type, props, ref, null, children, (node)=>/*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement(Component, {
                node: node
            }))) !== null && _useSSRCollectionNode !== void 0 ? _useSSRCollectionNode : /*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement((0, ($parcel$interopDefault($4ftIM$react))).Fragment, null);
    });
    // @ts-ignore
    Result.displayName = render.name;
    return Result;
}
function $f20386e2aa690b4a$var$useCollectionChildren(options) {
    return (0, $245f3f827bea6653$exports.useCachedChildren)({
        ...options,
        addIdAndValue: true
    });
}
const $f20386e2aa690b4a$var$CollectionContext = /*#__PURE__*/ (0, $4ftIM$react.createContext)(null);
function $f20386e2aa690b4a$export$fb8073518f34e6ec(props) {
    let ctx = (0, $4ftIM$react.useContext)($f20386e2aa690b4a$var$CollectionContext);
    let dependencies = ((ctx === null || ctx === void 0 ? void 0 : ctx.dependencies) || []).concat(props.dependencies);
    let idScope = props.idScope || (ctx === null || ctx === void 0 ? void 0 : ctx.idScope);
    let children = $f20386e2aa690b4a$var$useCollectionChildren({
        ...props,
        idScope: idScope,
        dependencies: dependencies
    });
    let doc = (0, $4ftIM$react.useContext)($f20386e2aa690b4a$var$CollectionDocumentContext);
    if (doc) children = /*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement($f20386e2aa690b4a$var$CollectionRoot, null, children);
    // Propagate dependencies and idScope to child collections.
    ctx = (0, $4ftIM$react.useMemo)(()=>({
            dependencies: dependencies,
            idScope: idScope
        }), [
        idScope,
        ...dependencies
    ]);
    return /*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement($f20386e2aa690b4a$var$CollectionContext.Provider, {
        value: ctx
    }, children);
}
function $f20386e2aa690b4a$var$CollectionRoot({ children: children }) {
    let doc = (0, $4ftIM$react.useContext)($f20386e2aa690b4a$var$CollectionDocumentContext);
    let wrappedChildren = (0, $4ftIM$react.useMemo)(()=>/*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement($f20386e2aa690b4a$var$CollectionDocumentContext.Provider, {
            value: null
        }, /*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement($f20386e2aa690b4a$var$ShallowRenderContext.Provider, {
            value: true
        }, children)), [
        children
    ]);
    // During SSR, we render the content directly, and append nodes to the document during render.
    // The collection children return null so that nothing is actually rendered into the HTML.
    return (0, $4ftIM$reactariassr.useIsSSR)() ? /*#__PURE__*/ (0, ($parcel$interopDefault($4ftIM$react))).createElement($f20386e2aa690b4a$var$SSRContext.Provider, {
        value: doc
    }, wrappedChildren) : /*#__PURE__*/ (0, $4ftIM$reactdom.createPortal)(wrappedChildren, doc);
}


//# sourceMappingURL=CollectionBuilder.main.js.map
