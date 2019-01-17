// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

// interface Store {
//     load();
//     get(id: string): any;
//     set(id: string, data: {id: string});
//     save(session: {id: string})
//     destroy(id: string);
// }

class MemoryStore /* implements Store */ {
    constructor() {
        this.sessions = {};
    }

    load() { /* nop */ }

    get(id) {
        const data = this.sessions[id];
        return data ? new Session(id, JSON.parse(data)) : null;
    }
    set(id, data) {
        this.sessions[id] = JSON.stringify(data);
    }
    save(session) {
        this.set(session.id, session);
    }
    destroy(id) {
        delete this.sessions[id];
    }
}

class Session {
    constructor(id, data) {
        this.id = id;
        this._invalid = false;
        if (!!data && typeof data === 'object') {
            for (let prop in data) {
                if (!(prop in this)) {
                    this[prop] = data[prop];
                }
            }
        }
    }

    get isInvalid() {
        return this._invalid;
    }

    invalidate() {
        this._invalid = true;
    }
}

const middleware = ({store, sessionable}) => {
    const getSession = res => (store.find(res) || store.generate(res));

    return (context, next , done) => {
        const res = context.response;
        if (res.session) {
            next();
            return;
        }

        res.session = sessionable(res) ? getSession(res) : null;
        try {
            next();
        } finally {
            if (res.session) {
                if (res.session.isInvalid) {
                    store.destroy(res.session.id)
                } else {
                    store.save(res.session);
                }
            }
        }
    };
};

const withSession = (options, actions) => {
    const sessionable = options.sessionable || (res => (res.message.room && res.message.user));
    const createId = options.createId || (res => (`${res.message.room}-${res.message.user.id}`));
    const store = options.store || new MemoryStore();

    store.find = res => (store.get(createId(res)));
    store.generate = res => (new Session(createId(res), null));

    return robot => {
        robot.listenerMiddleware(middleware({store, sessionable}, createId));
        actions(robot);
    };
}

module.exports = withSession;
