// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { SessionData } from "../session";
import { Store, StoreCallback, nop } from "../store";
import redis from "redis";

type D = SessionData;

export interface Serializer {
    parse: Function;
    stringify: Function;
}

export interface RedisStoreOptions {
    client: redis.RedisClient;
    prefix?: string;
    serializer?: Serializer;
    ttl?: number;
}

export class RedisStore extends Store {
    private readonly client: redis.RedisClient;
    private readonly prefix: string;
    private readonly serializer: Serializer;
    private readonly ttl?: number;

    constructor(options: RedisStoreOptions) {
        super();
        this.client = options.client;
        this.prefix = options.prefix ? options.prefix : "daab.";
        this.serializer = options.serializer ? options.serializer : JSON;
        this.ttl = options.ttl;
    }

    _createKey(id: string) {
        return this.prefix + id;
    }

    destroy(id: string, cb: StoreCallback = nop) {
        const key = this._createKey(id);
        const _cb: redis.Callback<number> = (err, _) => {
            cb(err ? err : undefined, undefined);
        };
        this.client.del(key, _cb);
    }

    get(id: string, cb: StoreCallback) {
        const key = this._createKey(id);
        this.client.get(key, (err, data) => {
            if (err) {
                cb(err);
            } else {
                const s = data ? this.createSession(id, this.serializer.parse(data) as Partial<D>) : undefined;
                cb(undefined, s);
            }
        });
    }

    set(id: string, data: Partial<D>, cb: StoreCallback = nop) {
        const key = this._createKey(id);
        const value = this.serializer.stringify(data);

        const _cb: redis.Callback<"OK" | undefined> = (err, _) => {
            cb(err ? err : undefined, undefined);
        };

        if (this.ttl != null) {
            this.client.set(key, value, "EX", this.ttl, _cb);
        } else {
            this.client.set(key, value, _cb);
        }
    }
}
