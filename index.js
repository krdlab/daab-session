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
        const val = this.sessions[id];
        return val ? JSON.parse(val) : null;
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
    constructor(id) {
        this.id = id;
    }
}

const middleware = ({store, sessionable}) => {
    return (context, next , done) => {
        const res = context.response;
        if (res.session) {
            next();
            return;
        }

        res.message.session = sessionable(res) ? (store.find(res) || store.generate(res)) : null;
        try {
            next();
        } finally {
            res.message.session && store.save(res.message.session);
        }
    };
};

const withSession = (options, actions) => {
    const sessionable = options.sessionable || (res => (res.message.room && res.message.user));
    const createId = options.createId || (res => (`${res.message.room}-${res.message.user.id}`));
    const store = options.store || new MemoryStore();

    store.find = res => (store.get(createId(res)));
    store.generate = res => (new Session(createId(res), store));

    return robot => {
        robot.listenerMiddleware(middleware({store, sessionable}, createId));
        actions(robot);
    };
}

module.exports = withSession;
