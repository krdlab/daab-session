// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const EventEmitter = require('events').EventEmitter;

class Store extends EventEmitter {
    constructor() {
        super();
    }

    regenerate(req, fn) {
        this.destroy(req.sessionID, err => {
            this.generate(req);
            fn(err);
        });
    }

    /* FIXME
    load(sid, fn) {
        this.get(sid, (err, sess) => {
            if (err) {
                return fn(err);
            }
            if (!sess) {
                return fn();
            }
            const req = { sessionID: sid, sessionStore: this };
            return fn(null, this.createSession(req, sess));
        });
    }

    createSession(req, sess) {
        return new Session(req, sess);
    }
    */
}

module.exports = Store;
