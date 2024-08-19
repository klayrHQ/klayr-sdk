# Klayr Elements

Klayr Elements is a JavaScript library for building blockchain applications in the Klayr network

## Installation

### Installation via npm

Add Klayr Elements as a dependency of your project:

```sh
$ npm install --save @klayr/elements
```

Import using ES6 modules syntax:

```js
import * as klayr from '@klayr/elements';
```

Or using Node.js modules:

```js
const klayr = require('@klayr/elements');
```

Or import specific namespaced functionality:

```js
import { transactions } from '@klayr/elements';
// or
const { transactions } = require('@klayr/elements');
```

## Packages

| Package                                                                          |                           Version                            | Description                                                                                               |
| -------------------------------------------------------------------------------- | :----------------------------------------------------------: | --------------------------------------------------------------------------------------------------------- |
| [@klayr/elements](https://www.npmjs.com/package/@klayr/elements)                 |     ![npm](https://img.shields.io/npm/v/@klayr/elements)     | Package contains everything                                                                               |
| [@klayr/api-client](https://www.npmjs.com/package/@klayr/api-client)             |    ![npm](https://img.shields.io/npm/v/@klayr/api-client)    | An API client for the Klayr network                                                                       |
| [@klayr/chain](https://www.npmjs.com/package/@klayr/chain)                       |      ![npm](https://img.shields.io/npm/v/@klayr/chain)       | Implements blocks and state management that are used for block processing according to the Klayr protocol |
| [@klayr/codec](https://www.npmjs.com/package/@klayr/codec)                       |      ![npm](https://img.shields.io/npm/v/@klayr/codec)       | Decoder and encoder using Klayr JSON schema according to the Klayr protocol                               |
| [@klayr/cryptography](https://www.npmjs.com/package/@klayr/cryptography)         |   ![npm](https://img.shields.io/npm/v/@klayr/cryptography)   | General cryptographic functions for use with Klayr-related software                                       |
| [@liskhq/lisk-db](https://www.npmjs.com/package/@liskhq/lisk-db)                 |     ![npm](https://img.shields.io/npm/v/@liskhq/lisk-db)     | A database access implementation for use with Klayr-related software                                      |
| [@klayr/p2p](https://www.npmjs.com/package/@klayr/p2p)                           |       ![npm](https://img.shields.io/npm/v/@klayr/p2p)        | _unstructured_ P2P library for the Klayr protocol                                                         |
| [@klayr/passphrase](https://www.npmjs.com/package/@klayr/passphrase)             |    ![npm](https://img.shields.io/npm/v/@klayr/passphrase)    | Mnemonic passphrase helpers for use with Klayr-related software                                           |
| [@klayr/transactions](https://www.npmjs.com/package/@klayr/transactions)         |   ![npm](https://img.shields.io/npm/v/@klayr/transactions)   | Everything related to transactions according to the Klayr protocol                                        |
| [@klayr/transaction-pool](https://www.npmjs.com/package/@klayr/transaction-pool) | ![npm](https://img.shields.io/npm/v/@klayr/transaction-pool) | Transaction pool implementation for the Klayr network                                                     |
| [@klayr/tree](https://www.npmjs.com/package/@klayr/tree)                         |       ![npm](https://img.shields.io/npm/v/@klayr/tree)       | Merkle tree implementations for use with Klayr-related software                                           |
| [@klayr/utils](https://www.npmjs.com/package/@klayr/utils)                       |      ![npm](https://img.shields.io/npm/v/@klayr/utils)       | Generic utility functions for use with Klayr-related software                                             |
| [@klayr/validator](https://www.npmjs.com/package/@klayr/validator)               |    ![npm](https://img.shields.io/npm/v/@klayr/validator)     | Validation library according to the Klayr protocol                                                        |

## License

Copyright 2016-2020 Lisk Foundation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

[klayr core github]: https://github.com/Klayrhq/klayr
[klayr documentation site]: https://klayr.xyz/documentation/klayr-sdk/references/klayr-elements
