// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Store, StoreCallback } from './lib/store';
import { MemoryStore } from './lib/store/memory';
import { Session } from './lib/session';
import './types/daab';


type SessionOptions<R, D> = {
    isSessionable: (res: daab.Response<R, D>) => boolean;
    sessionIdPrefix: string;
    createId: (res: daab.Response<R, D>) => string;
    store: Store<R, D>;
};

type SessionMiddlewareParams<R, D> = {
    store: Store<R, D>,
    isSessionable: (res: daab.Response<R, D>) => boolean
};

type DaabActions<A, D, R extends daab.Robot<A, D>> = (robot: R) => void;

const middleware = <R, D>({ store, isSessionable }: SessionMiddlewareParams<R, D>): daab.Middleware<R, D> => {
    const getSession = (res: daab.Response<R, D>, cb: StoreCallback<R, D>) => {
        if (!isSessionable(res)) {
            cb(undefined, undefined);
        }
        store.find(res, (err, se) => {
            if (!!se) {
                cb(err, se);
            } else {
                cb(undefined, store.generate(res))
            }
        });
    };
    const endSession: (session?: Session<R, D>) => void = session => {
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

const withSession = <A, D, R extends daab.Robot<A, D>>(actions: DaabActions<A, D, R>, options: Partial<SessionOptions<R, D>> = {}) => {
    const isSessionable = options.isSessionable || (res => (!!res.message.room && !!res.message.user));
    const sessionIdPrefix = options.sessionIdPrefix || 'daab.';
    const createId = options.createId || (res => (`${sessionIdPrefix}${res.message.room}.${res.message.user.id}`));
    const store = options.store || new MemoryStore<R, D>();

    store.find = (res, cb) => {
        res.sessionID = createId(res);
        res.sessionStore = store;
        store.get(res.sessionID, cb);
    };
    store.generate = res => {
        res.sessionID = createId(res); // NOTE: createID は外部から提供されなければならない
        res.sessionStore = store;
        return new Session(res, {});
    };

    return (robot: R) => {
        robot.listenerMiddleware(middleware({ store, isSessionable }));
        actions(robot);
    };
};

withSession.Store = Store; // * for connect-redis
export = withSession;
