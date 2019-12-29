// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Store } from './store';

const nop = () => {};

export type SessionContext<R, D> = {
    sessionID?: string,
    sessionStore?: Store<R, D>
};

export class Session<R, D> {
    public readonly res: SessionContext<R, D>;
    public readonly id: string;
    private _invalid: boolean = false;
    private _data: Partial<D> = {};

    constructor(res: SessionContext<R, D>, data?: Partial<D>) {
        if (!res.sessionID) {
            throw new Error('illegal'); // TODO
        }

        this.res = res;
        this.id = res.sessionID;
        if (!!data && typeof data === 'object') {
            this._copyFrom(data);
        }
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

    save(cb = nop) {
        if (this.isInvalid) {
            throw new Error(`the session (${this.id}) is invalid`);
        }
        this.res.sessionStore?.set(this.id, this.data, cb);
    }

    destroy(cb = nop) {
        this.res.sessionStore?.destroy(this.id, cb);
    }
}
