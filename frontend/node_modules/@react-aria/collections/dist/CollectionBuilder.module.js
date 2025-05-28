import {BaseCollection as $23b9f4fcf0fe224b$export$408d25a4e12db025} from "./BaseCollection.module.js";
import {Document as $681cc3c98f569e39$export$b34a105447964f9f} from "./Document.module.js";
import {useCachedChildren as $e948873055cbafe4$export$727c8fc270210f13} from "./useCachedChildren.module.js";
import {Hidden as $f39a9eba43920ace$export$8dc98ba7eadeaa56} from "./Hidden.module.js";
import {createPortal as $95feo$createPortal} from "react-dom";
import $95feo$react, {createContext as $95feo$createContext, useContext as $95feo$useContext, useRef as $95feo$useRef, useCallback as $95feo$useCallback, useState as $95feo$useState, forwardRef as $95feo$forwardRef, useMemo as $95feo$useMemo} from "react";
import {useIsSSR as $95feo$useIsSSR} from "@react-aria/ssr";
import {useLayoutEffect as $95feo$useLayoutEffect} from "@react-aria/utils";
import {useSyncExternalStore as $95feo$useSyncExternalStore} from "use-sync-external-store/shim/index.js";

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








const $e1995378a142960e$var$ShallowRenderContext = /*#__PURE__*/ (0, $95feo$createContext)(false);
const $e1995378a142960e$var$CollectionDocumentContext = /*#__PURE__*/ (0, $95feo$createContext)(null);
function $e1995378a142960e$export$bf788dd355e3a401(props) {
    // If a document was provided above us, we're already in a hidden tree. Just render the content.
    let doc = (0, $95feo$useContext)($e1995378a142960e$var$CollectionDocumentContext);
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
    let { collection: collection, document: document } = $e1995378a142960e$var$useCollectionDocument(props.createCollection);
    return /*#__PURE__*/ (0, $95feo$react).createElement((0, $95feo$react).Fragment, null, /*#__PURE__*/ (0, $95feo$react).createElement((0, $f39a9eba43920ace$export$8dc98ba7eadeaa56), null, /*#__PURE__*/ (0, $95feo$react).createElement($e1995378a142960e$var$CollectionDocumentContext.Provider, {
        value: document
    }, props.content)), /*#__PURE__*/ (0, $95feo$react).createElement($e1995378a142960e$var$CollectionInner, {
        render: props.children,
        collection: collection
    }));
}
function $e1995378a142960e$var$CollectionInner({ collection: collection, render: render }) {
    return render(collection);
}
// React 16 and 17 don't support useSyncExternalStore natively, and the shim provided by React does not support getServerSnapshot.
// This wrapper uses the shim, but additionally calls getServerSnapshot during SSR (according to SSRProvider).
function $e1995378a142960e$var$useSyncExternalStoreFallback(subscribe, getSnapshot, getServerSnapshot) {
    let isSSR = (0, $95feo$useIsSSR)();
    let isSSRRef = (0, $95feo$useRef)(isSSR);
    // This is read immediately inside the wrapper, which also runs during render.
    // We just need a ref to avoid invalidating the callback itself, which
    // would cause React to re-run the callback more than necessary.
    // eslint-disable-next-line rulesdir/pure-render
    isSSRRef.current = isSSR;
    let getSnapshotWrapper = (0, $95feo$useCallback)(()=>{
        return isSSRRef.current ? getServerSnapshot() : getSnapshot();
    }, [
        getSnapshot,
        getServerSnapshot
    ]);
    return (0, $95feo$useSyncExternalStore)(subscribe, getSnapshotWrapper);
}
const $e1995378a142960e$var$useSyncExternalStore = typeof (0, $95feo$react)['useSyncExternalStore'] === 'function' ? (0, $95feo$react)['useSyncExternalStore'] : $e1995378a142960e$var$useSyncExternalStoreFallback;
function $e1995378a142960e$var$useCollectionDocument(createCollection) {
    // The document instance is mutable, and should never change between renders.
    // useSyncExternalStore is used to subscribe to updates, which vends immutable Collection objects.
    let [document] = (0, $95feo$useState)(()=>new (0, $681cc3c98f569e39$export$b34a105447964f9f)((createCollection === null || createCollection === void 0 ? void 0 : createCollection()) || new (0, $23b9f4fcf0fe224b$export$408d25a4e12db025)()));
    let subscribe = (0, $95feo$useCallback)((fn)=>document.subscribe(fn), [
        document
    ]);
    let getSnapshot = (0, $95feo$useCallback)(()=>{
        let collection = document.getCollection();
        if (document.isSSR) // After SSR is complete, reset the document to empty so it is ready for React to render the portal into.
        // We do this _after_ getting the collection above so that the collection still has content in it from SSR
        // during the current render, before React has finished the client render.
        document.resetAfterSSR();
        return collection;
    }, [
        document
    ]);
    let getServerSnapshot = (0, $95feo$useCallback)(()=>{
        document.isSSR = true;
        return document.getCollection();
    }, [
        document
    ]);
    let collection = $e1995378a142960e$var$useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    (0, $95feo$useLayoutEffect)(()=>{
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
const $e1995378a142960e$var$SSRContext = /*#__PURE__*/ (0, $95feo$createContext)(null);
function $e1995378a142960e$var$useSSRCollectionNode(Type, props, ref, rendered, children, render) {
    // During SSR, portals are not supported, so the collection children will be wrapped in an SSRContext.
    // Since SSR occurs only once, we assume that the elements are rendered in order and never re-render.
    // Therefore we can create elements in our collection document during render so that they are in the
    // collection by the time we need to use the collection to render to the real DOM.
    // After hydration, we switch to client rendering using the portal.
    let itemRef = (0, $95feo$useCallback)((element)=>{
        element === null || element === void 0 ? void 0 : element.setProps(props, ref, rendered, render);
    }, [
        props,
        ref,
        rendered,
        render
    ]);
    let parentNode = (0, $95feo$useContext)($e1995378a142960e$var$SSRContext);
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
        return children ? /*#__PURE__*/ (0, $95feo$react).createElement($e1995378a142960e$var$SSRContext.Provider, {
            value: element
        }, children) : null;
    }
    // @ts-ignore
    return /*#__PURE__*/ (0, $95feo$react).createElement(Type, {
        ref: itemRef
    }, children);
}
function $e1995378a142960e$export$18af5c7a9e9b3664(type, render) {
    let Component = ({ node: node })=>render(node.props, node.props.ref, node);
    let Result = (0, $95feo$forwardRef)((props, ref)=>{
        let isShallow = (0, $95feo$useContext)($e1995378a142960e$var$ShallowRenderContext);
        if (!isShallow) {
            if (render.length >= 3) throw new Error(render.name + ' cannot be rendered outside a collection.');
            return render(props, ref);
        }
        return $e1995378a142960e$var$useSSRCollectionNode(type, props, ref, 'children' in props ? props.children : null, null, (node)=>/*#__PURE__*/ (0, $95feo$react).createElement(Component, {
                node: node
            }));
    });
    // @ts-ignore
    Result.displayName = render.name;
    return Result;
}
function $e1995378a142960e$export$e953bb1cd0f19726(type, render, useChildren = $e1995378a142960e$var$useCollectionChildren) {
    let Component = ({ node: node })=>render(node.props, node.props.ref, node);
    let Result = (0, $95feo$forwardRef)((props, ref)=>{
        let children = useChildren(props);
        var _useSSRCollectionNode;
        return (_useSSRCollectionNode = $e1995378a142960e$var$useSSRCollectionNode(type, props, ref, null, children, (node)=>/*#__PURE__*/ (0, $95feo$react).createElement(Component, {
                node: node
            }))) !== null && _useSSRCollectionNode !== void 0 ? _useSSRCollectionNode : /*#__PURE__*/ (0, $95feo$react).createElement((0, $95feo$react).Fragment, null);
    });
    // @ts-ignore
    Result.displayName = render.name;
    return Result;
}
function $e1995378a142960e$var$useCollectionChildren(options) {
    return (0, $e948873055cbafe4$export$727c8fc270210f13)({
        ...options,
        addIdAndValue: true
    });
}
const $e1995378a142960e$var$CollectionContext = /*#__PURE__*/ (0, $95feo$createContext)(null);
function $e1995378a142960e$export$fb8073518f34e6ec(props) {
    let ctx = (0, $95feo$useContext)($e1995378a142960e$var$CollectionContext);
    let dependencies = ((ctx === null || ctx === void 0 ? void 0 : ctx.dependencies) || []).concat(props.dependencies);
    let idScope = props.idScope || (ctx === null || ctx === void 0 ? void 0 : ctx.idScope);
    let children = $e1995378a142960e$var$useCollectionChildren({
        ...props,
        idScope: idScope,
        dependencies: dependencies
    });
    let doc = (0, $95feo$useContext)($e1995378a142960e$var$CollectionDocumentContext);
    if (doc) children = /*#__PURE__*/ (0, $95feo$react).createElement($e1995378a142960e$var$CollectionRoot, null, children);
    // Propagate dependencies and idScope to child collections.
    ctx = (0, $95feo$useMemo)(()=>({
            dependencies: dependencies,
            idScope: idScope
        }), [
        idScope,
        ...dependencies
    ]);
    return /*#__PURE__*/ (0, $95feo$react).createElement($e1995378a142960e$var$CollectionContext.Provider, {
        value: ctx
    }, children);
}
function $e1995378a142960e$var$CollectionRoot({ children: children }) {
    let doc = (0, $95feo$useContext)($e1995378a142960e$var$CollectionDocumentContext);
    let wrappedChildren = (0, $95feo$useMemo)(()=>/*#__PURE__*/ (0, $95feo$react).createElement($e1995378a142960e$var$CollectionDocumentContext.Provider, {
            value: null
        }, /*#__PURE__*/ (0, $95feo$react).createElement($e1995378a142960e$var$ShallowRenderContext.Provider, {
            value: true
        }, children)), [
        children
    ]);
    // During SSR, we render the content directly, and append nodes to the document during render.
    // The collection children return null so that nothing is actually rendered into the HTML.
    return (0, $95feo$useIsSSR)() ? /*#__PURE__*/ (0, $95feo$react).createElement($e1995378a142960e$var$SSRContext.Provider, {
        value: doc
    }, wrappedChildren) : /*#__PURE__*/ (0, $95feo$createPortal)(wrappedChildren, doc);
}


export {$e1995378a142960e$export$bf788dd355e3a401 as CollectionBuilder, $e1995378a142960e$export$18af5c7a9e9b3664 as createLeafComponent, $e1995378a142960e$export$e953bb1cd0f19726 as createBranchComponent, $e1995378a142960e$export$fb8073518f34e6ec as Collection};
//# sourceMappingURL=CollectionBuilder.module.js.map
