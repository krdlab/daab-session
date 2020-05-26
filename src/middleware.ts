// Copyright (c) 2020 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Store, StoreCallback } from "./store";
import { Session } from "./session";
import { Response } from "lisb-hubot";
import "./types/daab";

type SessionMiddlewareParams<D> = {
    store: Store<D>;
    isSessionable: (res: Response<any>) => boolean;
};

export function getSession<D>(store: Store<D>, res: Response<any>, cb: StoreCallback<D>): void {
    store.find(res, (err, session) => {
        if (!!session) {
            cb(err, session);
        } else {
            cb(undefined, store.generate(res));
        }
    });
}

export function endSession<D>(session?: Session<D>): void {
    if (!session) {
        return;
    }
    if (session.isInvalid) {
        session.destroy();
    } else {
        session.save();
    }
}

export function middleware<D>({ store, isSessionable }: SessionMiddlewareParams<D>): daab.Middleware<D> {
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
