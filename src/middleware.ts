// Copyright (c) 2020 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Store, StoreCallback } from "./store";
import { Session } from "./session";
import { Middleware, Response } from "lisb-hubot";

type SessionMiddlewareParams = {
    store: Store;
    isSessionable: (res: Response<any>) => boolean;
};

export function getSession<D>(store: Store, res: Response<any>, cb: StoreCallback): void {
    store.find(res, (err, session) => {
        if (!!session) {
            cb(err, session);
        } else {
            cb(undefined, store.generate(res));
        }
    });
}

export function endSession(session?: Session): void {
    if (!session) {
        return;
    }
    if (session.isInvalid) {
        session.destroy();
    } else {
        session.save();
    }
}

export function middleware({ store, isSessionable }: SessionMiddlewareParams): Middleware {
    return (context, next, _done) => {
        const res = context.response;
        if (!!res.session) {
            next();
            return;
        }
        if (!isSessionable(res)) {
            next();
            return;
        }

        getSession(store, res, (_err, session) => {
            // ! TODO: err
            res.session = session;
            try {
                next();
            } finally {
                endSession(res.session);
            }
        });
    };
}
