// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import "./types/daab";
import { EventEmitter } from "events";
import { Session } from "./session";

export type StoreCallback<D> = (err?: Error, data?: Session<D>) => void;

export const nop: StoreCallback<any> = (err, data) => {};

export abstract class Store<D> extends EventEmitter {
    public generate: (res: daab.Response<any, D>) => Session<D> = (res) => new Session(res, {});

    public find: (res: daab.Response<any, D>, cb: StoreCallback<D>) => void = (_r, cb) => {
        cb(new Error("not implemented"));
    };

    constructor() {
        super();
    }

    abstract destroy(id: string, cb: StoreCallback<D>): void;

    regenerate(res: daab.Response<any, D>, cb: StoreCallback<D>) {
        if (!res.sessionID) {
            cb(new Error("sessionID not found"));
            return;
        }
        this.destroy(res.sessionID, (err) => {
            const s = err ? undefined : this.generate(res);
            cb(err, s);
        });
    }

    abstract set(id: string, data: Partial<D>, cb: StoreCallback<D>): void;
    abstract get(id: string, cb: StoreCallback<D>): void;

    createSession(id: string, data: Partial<D>): Session<D> {
        return new Session({ sessionID: id, sessionStore: this }, data);
    }
}
