import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';
import { applyBatch } from '../client/rafBatch';
import merge from '../utils/merge';

const namedRadioInputs = {};

export default createComponent({
    onInit() {
        this.onChange = e => {
            const { onChange } = this.getAttrs(),
                control = this.getDomRef('control');

            onChange && onChange(e);

            applyBatch();

            if(this.isMounted()) {
                const { name, checked } = this.getAttrs(); // attrs could be changed during applyBatch()

                if(typeof checked !== 'undefined' && control.checked !== checked) {
                    if(name) {
                        const radioInputs = namedRadioInputs[name],
                            len = radioInputs.length;
                        let i = 0,
                            radioInput,
                            checked;

                        while(i < len) {
                            radioInput = radioInputs[i++];
                            checked = radioInput.getAttrs().checked;

                            if(typeof checked !== 'undefined') {
                                const radioControl = radioInput.getDomRef('control');

                                if(checked !== radioControl.checked) {
                                    radioControl.checked = checked;
                                }
                            }
                        }
                    }
                    else {
                        control.checked = checked;
                    }
                }
            }
        };

        this._controlAddAttrs = { type : 'radio', onChange : this.onChange };
    },

    onRender(attrs) {
        return this.setDomRef(
            'control',
            new TagNode('input').attrs(merge(attrs, this._controlAddAttrs)));
    },

    onMount({ name }) {
        if(name) {
            addToNamedRadioInputs(name, this);
        }
    },

    onUpdate({ name }, { name : prevName }) {
        if(name !== prevName) {
            if(prevName) {
                removeFromNamedRadioInputs(prevName, this);
            }

            if(name) {
                addToNamedRadioInputs(name, this);
            }
        }
    },

    onUnmount() {
        const { name } = this.getAttrs();

        if(name) {
            removeFromNamedRadioInputs(name, this);
        }
    }
});

function addToNamedRadioInputs(name, input) {
    (namedRadioInputs[name] || (namedRadioInputs[name] = [])).push(input);
}

function removeFromNamedRadioInputs(name, input) {
    const radioInputs = namedRadioInputs[name],
        len = radioInputs.length;
    let i = 0;

    while(i < len) {
        if(radioInputs[i] === input) {
            if(len === 1) {
                delete namedRadioInputs[name];
                return;
            }
            else {
                radioInputs.splice(i, 1);
                break;
            }
        }

        i++;
    }

    if(!radioInputs.length) {
        delete namedRadioInputs[name];
    }
}
