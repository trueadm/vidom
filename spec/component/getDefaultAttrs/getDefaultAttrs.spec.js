import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mountToDomSync, unmountFromDomSync } from '../../../src/client/mounter';

describe('getDefaultAttrs', () => {
    let domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountFromDomSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should provide empty attributes if not defined', done => {
        const C1 = createComponent({
            onInit(attrs) {
                expect(attrs).to.be.eql({});
                done();
            }
        });

        mountToDomSync(domNode, createNode(C1));
    });

    it('should provide passed attributes if not defined', done => {
        const attrs = { a : 1 },
            C1 = createComponent({
                onInit(attrs) {
                    expect(attrs).to.be.equal(attrs);
                    done();
                }
            });

        mountToDomSync(domNode, createNode(C1).attrs(attrs));
    });

    it('should merge passed with default attributes', done => {
        const C1 = createComponent({
            onInit(attrs) {
                expect(attrs).to.be.eql({ a : 3, b : 2 });
                done();
            }
        }, {
            getDefaultAttrs() {
                return { a : 1, b : 2 };
            }
        });

        mountToDomSync(domNode, createNode(C1).attrs({ a : 3 }));
    });
});
