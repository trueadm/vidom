import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';
import { applyBatch } from '../client/rafBatch';
import merge from '../utils/merge';

export default createComponent({
    onInit() {
        this.onChange = e => {
            const { onChange } = this.getAttrs(),
                control = this.getDomRef('control');

            onChange && onChange(e);

            applyBatch();

            if(this.isMounted()) {
                const { checked } = this.getAttrs(); // attrs could be changed during applyBatch()

                if(typeof checked !== 'undefined' && control.checked !== checked) {
                    control.checked = checked;
                }
            }
        };

        this._controlAddAttrs = { type : 'checkbox', onChange : this.onChange };
    },

    onRender(attrs) {
        return this.setDomRef(
            'control',
            new TagNode('input').attrs(merge(attrs, this._controlAddAttrs)));
    }
});
