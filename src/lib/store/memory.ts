// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const Store = require('../store.js');

const nop = () => {};

class MemoryStore extends Store {
    constructor() {
        super();
        this.sessions = {};
    }

    destroy(id, cb = nop) {
        delete this.sessions[id];
        cb();
    }

    get(id, cb = nop) {
        const data = this.sessions[id];
        const parsed = data ? JSON.parse(data) : null;
        cb(null, parsed);
    }

    set(id, data, cb = nop) {
        this.sessions[id] = JSON.stringify(data);
        cb();
    }

    length(cb = nop) {
        cb(null, Object.keys(this.sessions).length);
    }
}

module.exports = MemoryStore;
