// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { EventEmitter } from 'events';
import '../types/daab';
import { Session } from './session';

export type StoreCallback<R, D> = (err?: Error, data?: Session<R, D>) => void;

export const nop: StoreCallback<any, any> = (err, data) => {};

// * NOTE: A stored data is an internal data itself held by a Session type value. It's not the Session type.
export abstract class Store<R, D> extends EventEmitter {
    public generate: (res: daab.Response<R, D>) => Session<R, D> = res => new Session(res, undefined);
    public find: (res: daab.Response<R, D>, cb: StoreCallback<R, D>) => void = (_r, _c) => {};

    constructor() {
        super();
    }

    abstract destroy(id: string, cb: StoreCallback<R, D>): void;

    regenerate(res: daab.Response<R, D>, fn: StoreCallback<R, D>) {
        if (!res.sessionID) {
            fn(new Error('sessionID not found'));
            return;
        }
        this.destroy(res.sessionID, err => {
            const s = err ? undefined : this.generate(res);
            fn(err, s);
        });
    }

    abstract set(id: string, data: Partial<D>, cb: StoreCallback<R, D>): void;
    abstract get(id: string, cb: StoreCallback<R, D>): void;

    createSession(id: string, data: Partial<D>): Session<R, D> {
        return new Session({ sessionID: id, sessionStore: this }, data);
    }

    /* FIXME
    load(sid, fn) {
        this.get(sid, (err, sess) => {
            if (err) {
                return fn(err);
            }
            if (!sess) {
                return fn();
            }
            const req = { sessionID: sid, sessionStore: this };
            return fn(null, this.createSession(req, sess));
        });
    }
    */
}
