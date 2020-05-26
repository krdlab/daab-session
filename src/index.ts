// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Store } from "./store";
import { MemoryStore } from "./store/memory";
import { RedisStore } from "./store/redis";
import { middleware } from "./middleware";
import { Response } from "lisb-hubot";
import "./types/daab";

type SessionOptions<D> = {
    isSessionable: (res: Response<any>) => boolean;
    generateId: (res: Response<any>) => string;
    store: Store<D>;
};

type DaabActions<D, R extends daab.Robot<D>> = (robot: R) => void;

const withSession = <D, R extends daab.Robot<D>>(
    actions: DaabActions<D, R>,
    options: Partial<SessionOptions<D>> = {}
) => {
    const isSessionable = options.isSessionable || ((res) => !!res.message.room && !!res.message.user);
    const generateId = options.generateId || ((res) => `${res.message.room}.${res.message.user.id}`);
    const store = options.store || new MemoryStore<D>();

    store.find = (res, cb) => {
        res.sessionID = generateId(res);
        res.sessionStore = store;
        store.get(res.sessionID, cb);
    };
    store.generate = (res) => {
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
    RedisStore,
};
