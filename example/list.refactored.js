import { createNode, Component, mountToDom } from '../lib/vidom';

class StatefulComponent extends Component {
    onInit() {
        this._state = this.getInitialState(this.getAttrs());
    }

    getInitialState() {
        return {};
    }

    setState(state) {
        this._state = { ...this._state, ...state };
        this.update();
    }

    getState() {
        return this._state;
    }
}

let counter = 0;
function generateId() {
    return counter++;
}

class App extends StatefulComponent {
    getInitialState() {
        return { users : [] };
    }

    onRender() {
        return createNode('div')
            .attrs({ className : 'app' })
            .children([
                createNode(NewUser)
                    .key('new-user')
                    .attrs({ onAdd : login => this.onAddUser(login) }),
                createNode(UserList)
                    .key('user-list')
                    .attrs({ list : this.getState().users, onRemove : id => this.onRemoveUser(id) })
            ]);
    }

    onAddUser(login) {
        this.setState({
            users : this.getState().users
                .concat({ id : generateId(), login })
                .sort((a, b) => a.login > b.login)
        });
    }

    onRemoveUser(id) {
        this.setState({
            users : this.getState().users.filter(item => item.id !== id)
        });
    }
}

class UserList extends Component {
    onRender({ list, onRemove }) {
        return createNode('ul').children(list.map(user => {
            return createNode(UserListItem)
                .key(user.id)
                .attrs({ user, onRemove });
        }));
    }
}

class UserListItem extends Component {
    onRender({ user : { id, login }, onRemove }) {
        return createNode('li').children([
            createNode('span')
                .key('login')
                .children(login),
            createNode('button')
                .key('remove')
                .attrs({ onClick : e => onRemove(id) })
                .children('remove')
        ]);
    }
}

class NewUser extends StatefulComponent {
    getInitialState() {
        return { login : '' };
    }

    onRender() {
        return createNode('input').attrs({
            type : 'login',
            placeholder : 'enter new login',
            value : this.getState().login,
            onKeyUp : e => this.onKeyUp(e)
        });
    }

    onKeyUp(e) {
        let value = e.target.value;

        if(e.nativeEvent.keyCode === 13) {
            value = value.trim();
            if(value) {
                this.setState({ login : '' });
                this.getAttrs().onAdd(value);
            }
        }
        else {
            this.setState({ login : value });
        }
    }
}

mountToDom(document.getElementById('app-root'), createNode(App));
