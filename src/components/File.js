import TagNode from '../nodes/TagNode';
import merge from '../utils/merge';

const controlAddAttrs = { type : 'file' };

export default function File(attrs) {
    return new TagNode('input').attrs(merge(attrs, controlAddAttrs));
};
