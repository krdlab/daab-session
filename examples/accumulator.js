// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

const { withSession } = require('daab-session');

const actions = robot => {
  robot.respond(/add (\d+)$/i, res => {
    // NOTE: accumulate an integer value for each (talk, user)
    let result = res.session.data.result || 0;
    result += parseInt(res.match[1]);
    res.session.data.result = result;
    res.send(`result = ${result}`);
  });

  robot.respond(/abort$/i, res => {
    res.session.invalidate();
    res.send('result discarded');
  });
};

module.exports = withSession(actions);
