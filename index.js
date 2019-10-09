// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

const Store = require('./lib/store.js');
const MemoryStore = require('./lib/store/memory.js');
const Session = require('./lib/session.js');

const middleware = ({ store, sessionable }) => {
    const getSession = (res, cb) => {
        if (!sessionable(res)) {
            cb(null, null);
        }
        store.find(res, (err, se) => {
            if (!!se) {
                cb(err, se);
            } else {
                cb(null, store.generate(res))
            }
        });
    };
    const endSession = session => {
        if (!session) {
            return;
        }
        if (session.isInvalid) {
            session.destroy();
        } else {
            session.save();
        }
    };

    return (context, next , done) => {
        const res = context.response;
        if (!!res.session) {
            next();
            return;
        }

        getSession(res, (err, session) => {
            // ! TODO: err
            res.session = session;
            try {
                next();
            } finally {
                endSession(res.session);
            }
        });
    };
};

const withSession = (actions, options = {}) => {
    const sessionable = options.sessionable || (res => (res.message.room && res.message.user));
    const sessionIdPrefix = options.sessionIdPrefix || 'daab.';
    const createID = options.createID || (res => (`${sessionIdPrefix}${res.message.room}.${res.message.user.id}`));
    const store = options.store || new MemoryStore();

    store.find = (res, cb) => {
        res.sessionID = createID(res);
        res.sessionStore = store;
        store.get(res.sessionID, (err, data) => cb(err, new Session(res, data)));
    };
    store.generate = res => {
        res.sessionID = createID(res);
        res.sessionStore = store;
        return new Session(res, {});
    };

    return robot => {
        robot.listenerMiddleware(middleware({ store, sessionable }));
        actions(robot);
    };
}

module.exports = withSession;
module.exports.Store = Store; // * for connect-redis
