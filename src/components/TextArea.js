import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';
import { applyBatch } from '../client/rafBatch';
import merge from '../utils/merge';

export default createComponent({
    onInit() {
        this.onInput = e => {
            const { onInput, onChange } = this.getAttrs();

            onInput && onInput(e);
            onChange && onChange(e);

            applyBatch();

            if(this.isMounted()) {
                const control = this.getDomRef('control'),
                    { value } = this.getAttrs(); // attrs could be changed during applyBatch()

                if(typeof value !== 'undefined' && control.value !== value) {
                    control.value = value;
                }
            }
        };

        this._controlAddAttrs = { onInput : this.onInput, onChange : null };
    },

    onRender(attrs) {
        return this.setDomRef(
            'control',
            new TagNode('textarea').attrs(merge(attrs, this._controlAddAttrs)));
    }
});
