import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div'),
    newNode = createNode('span'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace10',
    'trees' : [
        oldNode,
        createNode(() => newNode)
    ],
    'patch' : topNode => [
        { op : replaceOp, args : [topNode, oldNode, newNode] }
    ]
}
