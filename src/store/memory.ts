// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Store, StoreCallback, nop } from '../store';

export class MemoryStore<R, D> extends Store<R, D> {
    private sessions: { [id: string]: string };

    constructor() {
        super();
        this.sessions = {};
    }

    destroy(id: string, cb: StoreCallback<R, D> = nop) {
        delete this.sessions[id];
        cb(undefined, undefined);
    }

    get(id: string, cb: StoreCallback<R, D>) {
        const data = this.sessions[id];
        const s = data ? this.createSession(id, JSON.parse(data) as Partial<D>) : undefined;
        cb(undefined, s);
    }

    set(id: string, data: Partial<D>, cb: StoreCallback<R, D> = nop) {
        this.sessions[id] = JSON.stringify(data);
        cb(undefined, undefined);
    }

    length(cb: (err?: Error, data?: number) => void) {
        cb(undefined, Object.keys(this.sessions).length);
    }
}
