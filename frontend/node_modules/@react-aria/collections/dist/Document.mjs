import {CollectionNode as $23b9f4fcf0fe224b$export$d68d59712b04d9d1} from "./BaseCollection.mjs";

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
class $681cc3c98f569e39$export$410b0c854570d131 {
    *[Symbol.iterator]() {
        let node = this.firstChild;
        while(node){
            yield node;
            node = node.nextSibling;
        }
    }
    get firstChild() {
        return this._firstChild;
    }
    set firstChild(firstChild) {
        this._firstChild = firstChild;
        this.ownerDocument.markDirty(this);
    }
    get lastChild() {
        return this._lastChild;
    }
    set lastChild(lastChild) {
        this._lastChild = lastChild;
        this.ownerDocument.markDirty(this);
    }
    get previousSibling() {
        return this._previousSibling;
    }
    set previousSibling(previousSibling) {
        this._previousSibling = previousSibling;
        this.ownerDocument.markDirty(this);
    }
    get nextSibling() {
        return this._nextSibling;
    }
    set nextSibling(nextSibling) {
        this._nextSibling = nextSibling;
        this.ownerDocument.markDirty(this);
    }
    get parentNode() {
        return this._parentNode;
    }
    set parentNode(parentNode) {
        this._parentNode = parentNode;
        this.ownerDocument.markDirty(this);
    }
    get isConnected() {
        var _this_parentNode;
        return ((_this_parentNode = this.parentNode) === null || _this_parentNode === void 0 ? void 0 : _this_parentNode.isConnected) || false;
    }
    appendChild(child) {
        this.ownerDocument.startTransaction();
        if (child.parentNode) child.parentNode.removeChild(child);
        if (this.firstChild == null) this.firstChild = child;
        if (this.lastChild) {
            this.lastChild.nextSibling = child;
            child.index = this.lastChild.index + 1;
            child.previousSibling = this.lastChild;
        } else {
            child.previousSibling = null;
            child.index = 0;
        }
        child.parentNode = this;
        child.nextSibling = null;
        this.lastChild = child;
        this.ownerDocument.markDirty(this);
        if (child.hasSetProps) // Only add the node to the collection if we already received props for it.
        // Otherwise wait until then so we have the correct id for the node.
        this.ownerDocument.addNode(child);
        this.ownerDocument.endTransaction();
        this.ownerDocument.queueUpdate();
    }
    insertBefore(newNode, referenceNode) {
        if (referenceNode == null) return this.appendChild(newNode);
        this.ownerDocument.startTransaction();
        if (newNode.parentNode) newNode.parentNode.removeChild(newNode);
        newNode.nextSibling = referenceNode;
        newNode.previousSibling = referenceNode.previousSibling;
        newNode.index = referenceNode.index;
        if (this.firstChild === referenceNode) this.firstChild = newNode;
        else if (referenceNode.previousSibling) referenceNode.previousSibling.nextSibling = newNode;
        referenceNode.previousSibling = newNode;
        newNode.parentNode = referenceNode.parentNode;
        let node = referenceNode;
        while(node){
            node.index++;
            node = node.nextSibling;
        }
        if (newNode.hasSetProps) this.ownerDocument.addNode(newNode);
        this.ownerDocument.endTransaction();
        this.ownerDocument.queueUpdate();
    }
    removeChild(child) {
        if (child.parentNode !== this || !this.ownerDocument.isMounted) return;
        this.ownerDocument.startTransaction();
        let node = child.nextSibling;
        while(node){
            node.index--;
            node = node.nextSibling;
        }
        if (child.nextSibling) child.nextSibling.previousSibling = child.previousSibling;
        if (child.previousSibling) child.previousSibling.nextSibling = child.nextSibling;
        if (this.firstChild === child) this.firstChild = child.nextSibling;
        if (this.lastChild === child) this.lastChild = child.previousSibling;
        child.parentNode = null;
        child.nextSibling = null;
        child.previousSibling = null;
        child.index = 0;
        this.ownerDocument.removeNode(child);
        this.ownerDocument.endTransaction();
        this.ownerDocument.queueUpdate();
    }
    addEventListener() {}
    removeEventListener() {}
    constructor(ownerDocument){
        this._firstChild = null;
        this._lastChild = null;
        this._previousSibling = null;
        this._nextSibling = null;
        this._parentNode = null;
        this.ownerDocument = ownerDocument;
    }
}
class $681cc3c98f569e39$export$dc064fe9e59310fd extends $681cc3c98f569e39$export$410b0c854570d131 {
    get index() {
        return this._index;
    }
    set index(index) {
        this._index = index;
        this.ownerDocument.markDirty(this);
    }
    get level() {
        if (this.parentNode instanceof $681cc3c98f569e39$export$dc064fe9e59310fd) return this.parentNode.level + (this.node.type === 'item' ? 1 : 0);
        return 0;
    }
    updateNode() {
        var _this_previousSibling, _this_nextSibling, _this_firstChild, _this_lastChild;
        let node = this.ownerDocument.getMutableNode(this);
        node.index = this.index;
        node.level = this.level;
        node.parentKey = this.parentNode instanceof $681cc3c98f569e39$export$dc064fe9e59310fd ? this.parentNode.node.key : null;
        var _this_previousSibling_node_key;
        node.prevKey = (_this_previousSibling_node_key = (_this_previousSibling = this.previousSibling) === null || _this_previousSibling === void 0 ? void 0 : _this_previousSibling.node.key) !== null && _this_previousSibling_node_key !== void 0 ? _this_previousSibling_node_key : null;
        var _this_nextSibling_node_key;
        node.nextKey = (_this_nextSibling_node_key = (_this_nextSibling = this.nextSibling) === null || _this_nextSibling === void 0 ? void 0 : _this_nextSibling.node.key) !== null && _this_nextSibling_node_key !== void 0 ? _this_nextSibling_node_key : null;
        node.hasChildNodes = !!this.firstChild;
        var _this_firstChild_node_key;
        node.firstChildKey = (_this_firstChild_node_key = (_this_firstChild = this.firstChild) === null || _this_firstChild === void 0 ? void 0 : _this_firstChild.node.key) !== null && _this_firstChild_node_key !== void 0 ? _this_firstChild_node_key : null;
        var _this_lastChild_node_key;
        node.lastChildKey = (_this_lastChild_node_key = (_this_lastChild = this.lastChild) === null || _this_lastChild === void 0 ? void 0 : _this_lastChild.node.key) !== null && _this_lastChild_node_key !== void 0 ? _this_lastChild_node_key : null;
    }
    setProps(obj, ref, rendered, render) {
        let node = this.ownerDocument.getMutableNode(this);
        let { value: value, textValue: textValue, id: id, ...props } = obj;
        props.ref = ref;
        node.props = props;
        node.rendered = rendered;
        node.render = render;
        node.value = value;
        node.textValue = textValue || (typeof props.children === 'string' ? props.children : '') || obj['aria-label'] || '';
        if (id != null && id !== node.key) {
            if (this.hasSetProps) throw new Error('Cannot change the id of an item');
            node.key = id;
        }
        // If this is the first time props have been set, end the transaction started in the constructor
        // so this node can be emitted.
        if (!this.hasSetProps) {
            this.ownerDocument.addNode(this);
            this.ownerDocument.endTransaction();
            this.hasSetProps = true;
        }
        this.ownerDocument.queueUpdate();
    }
    get style() {
        return {};
    }
    hasAttribute() {}
    setAttribute() {}
    setAttributeNS() {}
    removeAttribute() {}
    constructor(type, ownerDocument){
        super(ownerDocument), this.nodeType = 8 // COMMENT_NODE (we'd use ELEMENT_NODE but React DevTools will fail to get its dimensions)
        , this._index = 0, this.hasSetProps = false;
        this.node = new (0, $23b9f4fcf0fe224b$export$d68d59712b04d9d1)(type, `react-aria-${++ownerDocument.nodeId}`);
        // Start a transaction so that no updates are emitted from the collection
        // until the props for this node are set. We don't know the real id for the
        // node until then, so we need to avoid emitting collections in an inconsistent state.
        this.ownerDocument.startTransaction();
    }
}
class $681cc3c98f569e39$export$b34a105447964f9f extends $681cc3c98f569e39$export$410b0c854570d131 {
    get isConnected() {
        return this.isMounted;
    }
    createElement(type) {
        return new $681cc3c98f569e39$export$dc064fe9e59310fd(type, this);
    }
    /**
   * Lazily gets a mutable instance of a Node. If the node has already
   * been cloned during this update cycle, it just returns the existing one.
   */ getMutableNode(element) {
        let node = element.node;
        if (!this.mutatedNodes.has(element)) {
            node = element.node.clone();
            this.mutatedNodes.add(element);
            element.node = node;
        }
        this.markDirty(element);
        return node;
    }
    getMutableCollection() {
        if (!this.isSSR && !this.collectionMutated) {
            this.collection = this.collection.clone();
            this.collectionMutated = true;
        }
        return this.collection;
    }
    markDirty(node) {
        this.dirtyNodes.add(node);
    }
    startTransaction() {
        this.transactionCount++;
    }
    endTransaction() {
        this.transactionCount--;
    }
    addNode(element) {
        let collection = this.getMutableCollection();
        if (!collection.getItem(element.node.key)) {
            collection.addNode(element.node);
            for (let child of element)this.addNode(child);
        }
        this.markDirty(element);
    }
    removeNode(node) {
        for (let child of node)this.removeNode(child);
        let collection = this.getMutableCollection();
        collection.removeNode(node.node.key);
        this.markDirty(node);
    }
    /** Finalizes the collection update, updating all nodes and freezing the collection. */ getCollection() {
        if (this.transactionCount > 0) return this.collection;
        this.updateCollection();
        return this.collection;
    }
    updateCollection() {
        for (let element of this.dirtyNodes)if (element instanceof $681cc3c98f569e39$export$dc064fe9e59310fd && element.isConnected) element.updateNode();
        this.dirtyNodes.clear();
        if (this.mutatedNodes.size || this.collectionMutated) {
            var _this_firstChild, _this_lastChild;
            let collection = this.getMutableCollection();
            for (let element of this.mutatedNodes)if (element.isConnected) collection.addNode(element.node);
            var _this_firstChild_node_key, _this_lastChild_node_key;
            collection.commit((_this_firstChild_node_key = (_this_firstChild = this.firstChild) === null || _this_firstChild === void 0 ? void 0 : _this_firstChild.node.key) !== null && _this_firstChild_node_key !== void 0 ? _this_firstChild_node_key : null, (_this_lastChild_node_key = (_this_lastChild = this.lastChild) === null || _this_lastChild === void 0 ? void 0 : _this_lastChild.node.key) !== null && _this_lastChild_node_key !== void 0 ? _this_lastChild_node_key : null, this.isSSR);
            this.mutatedNodes.clear();
        }
        this.collectionMutated = false;
    }
    queueUpdate() {
        // Don't emit any updates if there is a transaction in progress.
        // queueUpdate should be called again after the transaction.
        if (this.dirtyNodes.size === 0 || this.transactionCount > 0) return;
        for (let fn of this.subscriptions)fn();
    }
    subscribe(fn) {
        this.subscriptions.add(fn);
        return ()=>this.subscriptions.delete(fn);
    }
    resetAfterSSR() {
        if (this.isSSR) {
            this.isSSR = false;
            this.firstChild = null;
            this.lastChild = null;
            this.nodeId = 0;
        }
    }
    constructor(collection){
        // @ts-ignore
        super(null), this.nodeType = 11 // DOCUMENT_FRAGMENT_NODE
        , this.ownerDocument = this, this.dirtyNodes = new Set(), this.isSSR = false, this.nodeId = 0, this.nodesByProps = new WeakMap(), this.isMounted = true, this.mutatedNodes = new Set(), this.subscriptions = new Set(), this.transactionCount = 0;
        this.collection = collection;
        this.collectionMutated = true;
    }
}


export {$681cc3c98f569e39$export$410b0c854570d131 as BaseNode, $681cc3c98f569e39$export$dc064fe9e59310fd as ElementNode, $681cc3c98f569e39$export$b34a105447964f9f as Document};
//# sourceMappingURL=Document.module.js.map
