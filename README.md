# daab-session

This library adds support for a conversation session to daab.

## Installation

```sh
npm install krdlab/daab-session
```

## Usage

You can use this library as follows:

```javascript
const withSession = require('daab-session');

const options = {};

const actions = robot => {
  robot.respond(/ping$/i, res => {
    let session = res.session; // current session object
    ...
  });
};

module.exports = withSession(actions, options);
```

## Use Redis

Default store is MemoryStore. Using [tj/connect-redis](https://github.com/tj/connect-redis) is able to use Redis as a store.

```javascript
const withSession = require('daab-session');

const redis = require('redis');
const client = redis.createClient();
const RedisStore = require('connect-redis')(withSession);

const options = {
  store: new RedisStore({ client })
};

const actions = robot => {
  // ...
}

module.exports = withSession(actions, options);
```
