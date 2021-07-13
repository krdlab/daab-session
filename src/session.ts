// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Store, StoreCallback } from "./store";

const nop = () => {};

export interface SessionData {}

export type SessionContext = {
    sessionID?: string;
    sessionStore?: Store;
};

export class Session {
    public readonly res: SessionContext;
    public readonly id: string;
    private _invalid: boolean = false;
    private _data: Partial<SessionData> = {};

    constructor(res: SessionContext, data: Partial<SessionData>) {
        if (!res.sessionID) {
            throw new Error("illegal"); // TODO
        }

        this.res = res;
        this.id = res.sessionID;
        this._copyFrom(data);
    }

    _copyFrom(data: Partial<SessionData>) {
        this._data = Object.assign({}, data);
    }

    get data() {
        return this._data;
    }

    get isInvalid() {
        return this._invalid;
    }

    invalidate() {
        this._invalid = true;
    }

    save(cb: StoreCallback = nop) {
        if (this.isInvalid) {
            throw new Error(`the session (${this.id}) is invalid`);
        }
        this.res.sessionStore?.set(this.id, this.data, cb);
    }

    destroy(cb: StoreCallback = nop) {
        this.res.sessionStore?.destroy(this.id, cb);
    }
}
