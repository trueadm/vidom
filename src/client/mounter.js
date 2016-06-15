import getDomNodeId from './getDomNodeId';
import rafBatch from './rafBatch';
import globalHook from '../globalHook';
import domOps from './domOps';
import TopNode from '../nodes/TopNode';

const DOM_NODE_TYPE_ELEMENT = 1,
    DOM_NODE_TYPE_COMMENT = 8,
    DEFAULT_NS_URI = 'http://www.w3.org/1999/xhtml',
    mountedNodes = {};
let counter = 0;

function mount(domNode, node, cb, cbCtx, syncMode) {
    let domNodeId = getDomNodeId(domNode),
        mounted = mountedNodes[domNodeId],
        mountId;

    if(mounted && mounted.tree) {
        mountId = ++mounted.id;
        const patchFn = () => {
            if(mountedNodes[domNodeId] && mountedNodes[domNodeId].id === mountId) {
                mounted.tree.patch(node);
                callCb(cb, cbCtx);
                if(process.env.NODE_ENV !== 'production') {
                    globalHook.emit('mount', mounted.tree);
                }
            }
        };

        syncMode? patchFn() : rafBatch(patchFn);
    }
    else {
        mounted = mountedNodes[domNodeId] = { tree : null, id : mountId = ++counter };

        if(domNode.children.length) {
            const tree = mounted.tree = new TopNode(node, getNs(domNode));

            tree.adoptDom(collectTopDomChildren(domNode));
            tree.mount();
            callCb(cb, cbCtx);
            if(process.env.NODE_ENV !== 'production') {
                globalHook.emit('mount', tree);
            }
        }
        else {
            const renderFn = () => {
                const mounted = mountedNodes[domNodeId];

                if(mounted && mounted.id === mountId) {
                    const tree = mounted.tree = new TopNode(node, getNs(domNode));

                    domOps.append(domNode, tree.renderToDom());
                    tree.mount();
                    callCb(cb, cbCtx);
                    if(process.env.NODE_ENV !== 'production') {
                        globalHook.emit('mount', tree);
                    }
                }
            };

            syncMode? renderFn() : rafBatch(renderFn);
        }
    }
}

function unmount(domNode, cb, cbCtx, syncMode) {
    const domNodeId = getDomNodeId(domNode);
    let mounted = mountedNodes[domNodeId];

    if(mounted) {
        const mountId = ++mounted.id,
            unmountFn = () => {
                mounted = mountedNodes[domNodeId];
                if(mounted && mounted.id === mountId) {
                    delete mountedNodes[domNodeId];
                    const tree = mounted.tree;

                    if(tree) {
                        const treeDomNode = tree.getDomNode();

                        tree.unmount();
                        domOps.remove(treeDomNode);
                    }

                    callCb(cb, cbCtx);
                    if(process.env.NODE_ENV !== 'production') {
                        tree && globalHook.emit('unmount', tree);
                    }
                }
            };

        mounted.tree?
            syncMode? unmountFn() : rafBatch(unmountFn) :
            syncMode || callCb(cb, cbCtx);
    }
    else if(!syncMode) {
        callCb(cb, cbCtx);
    }
}

function callCb(cb, cbCtx) {
    cb && cb.call(cbCtx || this);
}

function collectTopDomChildren(node) {
    const children = node.childNodes,
        len = children.length,
        res = [];
    let i = 0,
        nodeType;

    while(i < len) {
        nodeType = children[i].nodeType;

        if(nodeType === DOM_NODE_TYPE_ELEMENT || nodeType === DOM_NODE_TYPE_COMMENT) {
            res.push(children[i]);
        }

        i++;
    }

    return res;
}

function getNs(domNode) {
    return domNode.namespaceURI === DEFAULT_NS_URI? null : domNode.namespaceURI;
}

export function mountToDom(domNode, tree, cb, cbCtx) {
    mount(domNode, tree, cb, cbCtx, false);
}

export function mountToDomSync(domNode, tree) {
    mount(domNode, tree, null, null, true);
}

export function unmountFromDom(domNode, cb, cbCtx) {
    unmount(domNode, cb, cbCtx, false);
}

export function unmountFromDomSync(domNode) {
    unmount(domNode, null, null, true);
}

export function getMountedRootNodes() {
    const res = [];
    let mountedNode;

    for(let id in mountedNodes) {
        mountedNode = mountedNodes[id];
        if(mountedNode.tree) {
            res.push(mountedNode.tree);
        }
    }

    return res;
}
