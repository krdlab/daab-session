// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { EventEmitter } from "events";
import { Session, SessionData } from "./session";
import { Response } from "lisb-hubot";

type Data = Partial<SessionData>;

export type StoreCallback = (err?: Error, data?: Session) => void;

export const nop: StoreCallback = (err, data) => {};

export abstract class Store extends EventEmitter {
    public generate: (res: Response<any>) => Session = (res) => new Session(res, {});

    public find: (res: Response<any>, cb: StoreCallback) => void = (_r, cb) => {
        cb(new Error("not implemented"));
    };

    constructor() {
        super();
    }

    abstract destroy(id: string, cb: StoreCallback): void;

    regenerate(res: Response<any>, cb: StoreCallback) {
        if (!res.sessionID) {
            cb(new Error("sessionID not found"));
            return;
        }
        this.destroy(res.sessionID, (err) => {
            const s = err ? undefined : this.generate(res);
            cb(err, s);
        });
    }

    abstract set(id: string, data: Data, cb: StoreCallback): void;
    abstract get(id: string, cb: StoreCallback): void;

    createSession(id: string, data: Data): Session {
        return new Session({ sessionID: id, sessionStore: this }, data);
    }
}
