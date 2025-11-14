# url-literal
> A utility for building safe, readable URLs with template literals and query parameters.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
yarn add @jswork/url-literal
```

## usage
```js
import urlLiteral from '@jswork/url-literal';

// Basic path building
const url1 = urlLiteral`/api/users`;
url1.toString(); // '/api/users'

// Path with variables
const userId = 123;
const url2 = urlLiteral`/api/users/${userId}`;
url2.toString(); // '/api/users/123'

// Add query parameters
const url3 = urlLiteral`/api/users`.query({ page: 1, limit: 10 });
// '/api/users?page=1&limit=10'

// Combine variables and query parameters
const url4 = urlLiteral`/api/users/${userId}/posts`.query({ page: 1 });
// '/api/users/123/posts?page=1'

// Ignore null/undefined values
const url5 = urlLiteral`/api/users`.query({ page: 1, search: null });
// '/api/users?page=1'
```

## license
Code released under [the MIT license](https://github.com/afeiship/url-literal/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/url-literal
[version-url]: https://npmjs.org/package/@jswork/url-literal

[license-image]: https://img.shields.io/npm/l/@jswork/url-literal
[license-url]: https://github.com/afeiship/url-literal/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/url-literal
[size-url]: https://github.com/afeiship/url-literal/blob/master/dist/url-literal.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/url-literal
[download-url]: https://www.npmjs.com/package/@jswork/url-literal
