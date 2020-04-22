// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

const { withSession, RedisStore } = require('daab-session');

const redis = require('redis');
const client = redis.createClient();
const options = {
  store: new RedisStore({ client })
};


const actions = robot => {
  robot.hear(/count$/i, res => {
    // NOTE: increase a counter for each (talk, user)
    let i = res.session.data.count || 0;
    res.session.data.count = ++i;
    res.send('' + i);
  });
};

module.exports = withSession(actions, options);
