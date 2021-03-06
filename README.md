# daab-session

This library adds support for a conversation session to daab.

## Installation

```sh
npm install daab-session
```

## Usage

You can use this library as follows:

```javascript
const { withSession } = require('daab-session');

const actions = robot => {
  robot.respond(/ping$/i, res => {
    let session = res.session; // current session object. it has 'id' and 'data' fields.
    ...
  });
};

module.exports = withSession(actions);
```

The default store is MemoryStore. There is RedisStore as another store implementation.

More information about usage can be found in the [examples directory](examples/).
