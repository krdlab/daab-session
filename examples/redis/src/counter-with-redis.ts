// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { withSession, RedisStore, DaabActions } from "daab-session";
import { createClient } from "redis";

declare module 'daab-session' {
    interface SessionData {
        count: number;
    }
}

const client = createClient();

const options = {
    store: new RedisStore({ client }),
};

const actions: DaabActions = (robot) => {
    robot.respond(/count$/i, (res) => {
        // NOTE: increase a counter for each (talk, user)
        let i = res.session!.data.count || 0;
        res.session!.data.count = ++i;
        res.send("" + i);
    });
};

export = withSession(actions, options);
