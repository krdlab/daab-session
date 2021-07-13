// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { SessionData } from "../session";
import { Store, StoreCallback, nop } from "../store";

type D = SessionData;

export class MemoryStore extends Store {
    private sessions: { [id: string]: string };

    constructor() {
        super();
        this.sessions = {};
    }

    destroy(id: string, cb: StoreCallback = nop) {
        delete this.sessions[id];
        cb(undefined, undefined);
    }

    get(id: string, cb: StoreCallback) {
        const data = this.sessions[id];
        const s = data ? this.createSession(id, JSON.parse(data) as Partial<D>) : undefined;
        cb(undefined, s);
    }

    set(id: string, data: Partial<D>, cb: StoreCallback = nop) {
        this.sessions[id] = JSON.stringify(data);
        cb(undefined, undefined);
    }

    length(cb: (err?: Error, data?: number) => void) {
        cb(undefined, Object.keys(this.sessions).length);
    }
}
