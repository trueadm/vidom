import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';
import { applyBatch } from '../client/rafBatch';
import merge from '../utils/merge';

export default createComponent({
    onInit() {
        this.onChange = e => {
            const { onChange } = this.getAttrs();

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

        this._controlAddAttrs = { onChange : this.onChange };
    },

    onRender(attrs, children) {
        return this.setDomRef(
            'control',
            new TagNode('select')
                .attrs(merge(attrs, this._controlAddAttrs))
                .children(children));
    }
});
