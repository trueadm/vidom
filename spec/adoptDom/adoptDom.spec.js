import { node, createComponent, mountSync, unmountSync } from '../../src/vidom';

describe('adoptDom', () => {
    let domNode;

    beforeEach(() => {
        domNode = document.createElement('div');
        domNode.appendChild(document.createComment('vidom'));
        document.body.appendChild(domNode);
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should properly adopt existing dom nodes', () => {
        const firstChildNode = node('span'),
            secondChildNode = node('i'),
            tree = node('div').children([firstChildNode, secondChildNode]),
            treeDomNode = document.createElement('div'),
            firstChildDomNode = document.createElement('span'),
            secondChildDomNode = document.createElement('i');

        treeDomNode.appendChild(firstChildDomNode);
        treeDomNode.appendChild(secondChildDomNode);
        domNode.appendChild(treeDomNode);

        mountSync(domNode, tree);

        expect(tree.getDomNode()).to.equal(treeDomNode);
        expect(firstChildNode.getDomNode()).to.equal(firstChildDomNode);
        expect(secondChildNode.getDomNode()).to.equal(secondChildDomNode);
    });

    it('should properly adopt existing text dom nodes', () => {
        const firstChildNode = node('text').children('text1'),
            secondChildNode = node('text').children('text2'),
            tree = node('div').children([firstChildNode, secondChildNode]),
            treeDomNode = document.createElement('div'),
            firstChildDomNode = [document.createComment(''), document.createComment('')],
            secondChildDomNode = [document.createComment(''), document.createComment('')];

        treeDomNode.appendChild(firstChildDomNode[0]);
        treeDomNode.appendChild(document.createTextNode('text1'));
        treeDomNode.appendChild(firstChildDomNode[1]);
        treeDomNode.appendChild(secondChildDomNode[0]);
        treeDomNode.appendChild(document.createTextNode('text2'));
        treeDomNode.appendChild(secondChildDomNode[1]);
        domNode.appendChild(treeDomNode);

        mountSync(domNode, tree);

        expect(firstChildNode.getDomNode()).to.eql(firstChildDomNode);
        expect(secondChildNode.getDomNode()).to.eql(secondChildDomNode);
    });

    it('should properly adopt existing top level text dom node', () => {
        const tree = node('text').children('text1'),
            textDomNode = [document.createComment(''), document.createComment('')];

        domNode.appendChild(textDomNode[0]);
        domNode.appendChild(document.createTextNode('text1'));
        domNode.appendChild(textDomNode[1]);

        mountSync(domNode, tree);

        expect(tree.getDomNode()).to.eql(textDomNode);
    });

    it('should properly adopt existing top level fragment dom node', () => {
        const tree = node('fragment').children([node('div'), node('div')]),
            fragmentDomNode = [document.createComment(''), document.createComment('')];

        domNode.appendChild(fragmentDomNode[0]);
        domNode.appendChild(document.createElement('div'));
        domNode.appendChild(document.createElement('div'));
        domNode.appendChild(fragmentDomNode[1]);

        mountSync(domNode, tree);

        expect(tree.getDomNode()).to.eql(fragmentDomNode);
    });

    it('should properly adopt existing dom nodes through components', () => {
        const spanNode = node('span'),
            C1 = createComponent({
                onRender() {
                    return node(C2);
                }
            }),
            C2 = createComponent({
                onRender() {
                    return spanNode;
                }
            }),
            tree = node('div').children(node(C1)),
            treeDomNode = document.createElement('div'),
            childDomNode = document.createElement('span');

        treeDomNode.appendChild(childDomNode);
        domNode.appendChild(treeDomNode);

        mountSync(domNode, tree);

        expect(spanNode.getDomNode()).to.equal(childDomNode);
    });

    it('should properly adopt existing dom nodes through function components', () => {
        const spanNode = node('span'),
            C1 = () => node(C2),
            C2 = () => spanNode,
            tree = node('div').children(node(C1)),
            treeDomNode = document.createElement('div'),
            childDomNode = document.createElement('span');

        treeDomNode.appendChild(childDomNode);
        domNode.appendChild(treeDomNode);

        mountSync(domNode, tree);

        expect(spanNode.getDomNode()).to.equal(childDomNode);
    });
});
