import { Store, StoreCallback } from "./store";
import { Session } from "./session";
import "./types/daab";

type SessionMiddlewareParams<R, D> = {
    store: Store<R, D>;
    isSessionable: (res: daab.Response<R, D>) => boolean;
};

export function middleware<R, D>({
    store,
    isSessionable,
}: SessionMiddlewareParams<R, D>): daab.Middleware<R, D> {
    const getSession = (res: daab.Response<R, D>, cb: StoreCallback<R, D>) => {
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
    };
    const endSession: (session?: Session<R, D>) => void = (session) => {
        if (!session) {
            return;
        }
        if (session.isInvalid) {
            session.destroy();
        } else {
            session.save();
        }
    };

    return (context, next, _done) => {
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
}
