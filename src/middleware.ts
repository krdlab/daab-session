// Copyright (c) 2020 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Store, StoreCallback } from "./store";
import { Session } from "./session";
import "./types/daab";

type SessionMiddlewareParams<R, D> = {
    store: Store<R, D>;
    isSessionable: (res: daab.Response<R, D>) => boolean;
};

export function getSession<R, D>(
    { store, isSessionable }: SessionMiddlewareParams<R, D>,
    res: daab.Response<R, D>,
    cb: StoreCallback<R, D>
): void {
    if (!isSessionable(res)) {
        cb(undefined, undefined);
    }
    store.find(res, (err, se) => {
        if (!!se) {
            cb(err, se);
        } else {
            cb(undefined, store.generate(res));
        }
    });
}

export function endSession<R, D>(session?: Session<R, D>): void {
    if (!session) {
        return;
    }
    if (session.isInvalid) {
        session.destroy();
    } else {
        session.save();
    }
}

export function middleware<R, D>(
    params: SessionMiddlewareParams<R, D>
): daab.Middleware<R, D> {
    return (context, next, _done) => {
        const res = context.response;
        if (!!res.session) {
            next();
            return;
        }

        getSession(params, res, (err, session) => {
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
