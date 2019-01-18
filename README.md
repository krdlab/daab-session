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

module.exports = withSession(options, actions);
```
