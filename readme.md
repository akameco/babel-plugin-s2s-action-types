# babel-plugin-s2s-action-types
[![Build Status](https://travis-ci.org/akameco/babel-plugin-s2s-action-types.svg?branch=master)](https://travis-ci.org/akameco/babel-plugin-s2s-action-types)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> generate action types


## Install

```
$ npm install --save-dev babel-plugin-s2s-action-types
```


## Usage

#### In:

```js
export type Action = Increment
```

#### Out:

```js
// @flow
export const INCREMENT: "app/counter/INCREMENT" = "app/counter/INCREMENT";

export const Actions = {
  INCREMENT
};

export type Increment = {
  type: typeof INCREMENT
};

export type Action = Increment;
```

## License

MIT © [akameco](http://akameco.github.io)
