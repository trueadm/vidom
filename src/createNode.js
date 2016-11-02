import TagNode from './nodes/TagNode';
import ComponentNode from './nodes/ComponentNode';
import FunctionComponentNode from './nodes/FunctionComponentNode';
import FragmentNode from './nodes/FragmentNode';
import TextNode from './nodes/TextNode';
import TextInput from './components/TextInput';
import TextArea from './components/TextArea';
import Select from './components/Select';
import Radio from './components/Radio';
import CheckBox from './components/CheckBox';
import File from './components/File';
import console from './utils/console';
import { IS_DEBUG } from './utils/debug';

export default function(type) {
    switch(typeof type) {
        case 'string':
            switch(type) {
                case 'fragment':
                    return new FragmentNode();

                case 'text':
                    return new TextNode();

                case 'textinput':
                    return new ComponentNode(TextInput);

                case 'textarea':
                    return new ComponentNode(TextArea);

                case 'select':
                    return new ComponentNode(Select);

                case 'radio':
                    return new ComponentNode(Radio);

                case 'checkbox':
                    return new ComponentNode(CheckBox);

                case 'file':
                    return new FunctionComponentNode(File);

                default:
                    return new TagNode(type);
            }

        case 'function':
            return type.__vidom__component__?
                new ComponentNode(type) :
                new FunctionComponentNode(type);

        default:
            if(IS_DEBUG) {
                console.error('Unsupported type of node');
            }
    }
}
