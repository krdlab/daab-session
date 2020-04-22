// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Store } from './store';
import { MemoryStore } from './store/memory';
import { RedisStore } from './store/redis';
import { middleware } from './middleware';
import './types/daab';


type SessionOptions<R, D> = {
    isSessionable: (res: daab.Response<R, D>) => boolean;
    generateId: (res: daab.Response<R, D>) => string;
    store: Store<R, D>;
};

type DaabActions<A, D, R extends daab.Robot<A, D>> = (robot: R) => void;

const withSession = <A, D, R extends daab.Robot<A, D>>(actions: DaabActions<A, D, R>, options: Partial<SessionOptions<R, D>> = {}) => {
    const isSessionable = options.isSessionable || (res => (!!res.message.room && !!res.message.user));
    const generateId = options.generateId || (res => (`${res.message.room}.${res.message.user.id}`));
    const store = options.store || new MemoryStore<R, D>();

    store.find = (res, cb) => {
        res.sessionID = generateId(res);
        res.sessionStore = store;
        store.get(res.sessionID, cb);
    };
    store.generate = res => {
        res.sessionID = generateId(res);
        res.sessionStore = store;
        return store.createSession(res.sessionID, {});
    };

    return (robot: R) => {
        robot.listenerMiddleware(middleware({ store, isSessionable }));
        actions(robot);
    };
};

export = {
    withSession,
    Store,
    RedisStore
};
