# @klayr/faucet-plugin

@klayr/faucet-plugin is a plugin for distributing testnet tokens from a newly developed blockchain application.

## Installation

```sh
$ npm install --save @klayr/faucet-plugin
```

## Config Options

```
{
	encryptedPassphrase: string,
	applicationURL?: string,
  fee?:number,
	tokensToDistribute?: number,
	tokenPrefix?: string,
  logoURL?: string,
  captcha?: object,
}
```

## License

Copyright 2016-2021 Lisk Foundation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

[klayr core github]: https://github.com/KlayrHQ/klayr
[klayr documentation site]: https://klayr.xyz/documentation/klayr-sdk/references/klayr-framework/faucet-plugin.html
