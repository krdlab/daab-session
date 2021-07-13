// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Store } from "./store";
import { MemoryStore } from "./store/memory";
import { middleware } from "./middleware";
import { Response, Robot } from "lisb-hubot";
import "./types/daab";

type SessionOptions = {
    isSessionable: (res: Response<any>) => boolean;
    generateId: (res: Response<any>) => string;
    store: Store;
};

export type DaabActions = (robot: Robot) => void;

export function withSession(actions: DaabActions, options: Partial<SessionOptions> = {}) {
    const isSessionable = options.isSessionable || ((res) => !!res.message.room && !!res.message.user);
    const generateId = options.generateId || ((res) => `${res.message.room}.${res.message.user.id}`);
    const store = options.store || new MemoryStore();

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

    return (robot: Robot) => {
        robot.listenerMiddleware(middleware({ store, isSessionable }));
        actions(robot);
    };
}

export { SessionData } from "./session";
export { RedisStore } from "./store/redis";
