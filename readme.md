# Moved. See [s2s-plugins](https://github.com/akameco/s2s-plugins)


---

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

## Related
- [**akameco/s2s**<br>Source to Source](https://github.com/akameco/s2s)
- [**akameco/babel-plugin-s2s-action-root**<br>compose flow + redux action types](https://github.com/akameco/babel-plugin-s2s-action-root)
- [**akameco/babel-plugin-s2s-state-root**<br>compose flow + redux state types](https://github.com/akameco/babel-plugin-s2s-state-root)
- [**akameco/babel-plugin-s2s-reducer-root**<br>compose redux reducer](https://github.com/akameco/babel-plugin-s2s-reducer-root)
- [**akameco/babel-plugin-s2s-action-creater**<br>generate redux action creater](https://github.com/akameco/babel-plugin-s2s-action-creater)

## License

MIT © [akameco](http://akameco.github.io)
