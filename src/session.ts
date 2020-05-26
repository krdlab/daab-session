// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Store, StoreCallback } from "./store";

const nop = () => {};

export type SessionContext<D> = {
    sessionID?: string;
    sessionStore?: Store<D>;
};

export class Session<D> {
    public readonly res: SessionContext<D>;
    public readonly id: string;
    private _invalid: boolean = false;
    private _data: Partial<D> = {};

    constructor(res: SessionContext<D>, data: Partial<D>) {
        if (!res.sessionID) {
            throw new Error("illegal"); // TODO
        }

        this.res = res;
        this.id = res.sessionID;
        this._copyFrom(data);
    }

    _copyFrom(data: Partial<D>) {
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

    save(cb: StoreCallback<D> = nop) {
        if (this.isInvalid) {
            throw new Error(`the session (${this.id}) is invalid`);
        }
        this.res.sessionStore?.set(this.id, this.data, cb);
    }

    destroy(cb: StoreCallback<D> = nop) {
        this.res.sessionStore?.destroy(this.id, cb);
    }
}
