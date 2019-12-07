// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const nop = () => {};

class Session {
    constructor(res, data) {
        Object.defineProperty(this, 'res', { value: res });
        Object.defineProperty(this, 'id', { value: res.sessionID });
        Object.defineProperty(this, 'invalid', { value: false, writable: true });

        if (!!data && typeof data === 'object') {
            this._copyFrom(data);
        }
    }

    _copyFrom(data) {
        for (let key in data) {
            if (!(key in this)) {
                this[key] = data[key];
            }
        }
    }

    get isInvalid() {
        return this.invalid;
    }

    invalidate() {
        this.invalid = true;
    }

    save(cb = nop) {
        if (this.isInvalid) {
            throw new Error(`the session (${this.id}) is invalid`);
        }
        this.res.sessionStore.set(this.id, this, cb);
    }

    destroy(cb = nop) {
        this.res.sessionStore.destroy(this.id, cb);
    }
}

module.exports = Session;
