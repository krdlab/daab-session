// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

const withSession = require('daab-session');

const actions = robot => {
  robot.respond(/count$/i, res => {
    // NOTE: increase a counter for each (talk, user)
    let i = res.session.count || 0;
    res.session.count = ++i;
    res.send('' + i);
  });
};

module.exports = withSession(actions);
