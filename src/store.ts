// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { EventEmitter } from 'events';
import './types/daab';
import { Session } from './session';

export type StoreCallback<R, D> = (err?: Error, data?: Session<R, D>) => void;

export const nop: StoreCallback<any, any> = (err, data) => {};

export abstract class Store<R, D> extends EventEmitter {

    public generate: (res: daab.Response<R, D>) => Session<R, D> =
        res => new Session(res, {});

    public find: (res: daab.Response<R, D>, cb: StoreCallback<R, D>) => void =
        (_r, cb) => { cb(new Error('not implemented')); };

    constructor() {
        super();
    }

    abstract destroy(id: string, cb: StoreCallback<R, D>): void;

    regenerate(res: daab.Response<R, D>, cb: StoreCallback<R, D>) {
        if (!res.sessionID) {
            cb(new Error('sessionID not found'));
            return;
        }
        this.destroy(res.sessionID, err => {
            const s = err ? undefined : this.generate(res);
            cb(err, s);
        });
    }

    abstract set(id: string, data: Partial<D>, cb: StoreCallback<R, D>): void;
    abstract get(id: string, cb: StoreCallback<R, D>): void;

    createSession(id: string, data: Partial<D>): Session<R, D> {
        return new Session({ sessionID: id, sessionStore: this }, data);
    }
}
