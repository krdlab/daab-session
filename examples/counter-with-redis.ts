// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { withSession, RedisStore } from 'daab-session';
import { createClient } from 'redis';

const client = createClient();

type SessionData = {
  count: number;
};

type Robot = daab.Robot<any, SessionData>;

const options = {
  store: new RedisStore<Robot, SessionData>({ client })
};

const actions = (robot: Robot) => {
  robot.respond(/count$/i, res => {
    // NOTE: increase a counter for each (talk, user)
    let i = res.session.data.count || 0;
    res.session.data.count = ++i;
    res.send('' + i);
  });
};

exports = withSession(actions, options);
