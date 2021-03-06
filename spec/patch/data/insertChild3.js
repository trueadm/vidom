import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const newNode = createNode('input').key('a'),
    beforeNode = createNode('input');

export default {
    'name' : 'insertChild3',
    'trees' : [
        createNode('fragment').children([
            createNode('span'),
            createNode('input')
        ]),
        createNode('fragment').children([
            createNode('span'),
            newNode,
            beforeNode
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, beforeNode] }
    ]
}
