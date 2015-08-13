import { node, Component, mountToDom } from '../lib/vidom';

class App extends Component {
    // onInit() hook is the best place to store initial state. Let's use `this._users` for the list of users.
    onInit() {
        this._users = [];
    }

    // onRender() hook is called when the component needs to be rendered.
    onRender() {
        return node('div')
            .attrs({ className : 'app' })
            .children([
                node(NewUser)
                    .key('new-user')
                    .attrs({ onAdd : login => this.onAddUser(login) }),
                node(UserList)
                    .key('user-list')
                    .attrs({ list : this._users, onRemove : id => this.onRemoveUser(id) })
            ]);
    }

    onAddUser(login) {
        // Just adding a new user to the array and resorting it.
        this._users.push({ id : generateId(), login });
        this._users.sort((a, b) => a.login > b.login);

        // We should call update to reflect state changes to the rendering
        this.update();
    }

    onRemoveUser(id) {
        // Just removing a user from the array using "id".
        this._users = this._users.filter(item => item.id !== id);

        // And reflecting changes
        this.update();
    }
}

let counter = 0;
function generateId() {
    return counter++;
}

class UserList extends Component {
    onRender({ list, onRemove }) {
        return node('ul').children(list.map(user => {
            return node(UserListItem)
                .key(user.id)
                .attrs({ user, onRemove });
        }));
    }
}

class UserListItem extends Component {
    onRender({ user : { id, login }, onRemove }) {
        return node('li').children([
            node('span')
                .key('login')
                .children(login),
            node('button')
                .key('remove')
                .attrs({ onClick : e => onRemove(id) })
                .children('remove')
        ]);
    }
}

class NewUser extends Component {
    onInit() {
        this._login = '';
    }

    onRender() {
        return node('input').attrs({
            type : 'login',
            placeholder : 'enter new login',
            value : this._login,
            onKeyUp : e => this.onKeyUp(e)
        });
    }

    onKeyUp(e) {
        let value = e.target.value;

        if(e.nativeEvent.keyCode === 13) {
            value = value.trim();
            if(value) {
                this._login = '';
                this.getAttrs().onAdd(value);
            }
        }
        else {
            this._login = value;
        }

        this.update();
    }
}

mountToDom(document.getElementById('app-root'), node(App));
