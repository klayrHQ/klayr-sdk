# `pos-mainchain blockchain`

Commands relating to pos-mainchain blockchain data.

- [`pos-mainchain blockchain export`](#pos-mainchain-blockchain-export)
- [`pos-mainchain blockchain hash`](#pos-mainchain-blockchain-hash)
- [`pos-mainchain blockchain import FILEPATH`](#pos-mainchain-blockchain-import-filepath)
- [`pos-mainchain blockchain reset`](#pos-mainchain-blockchain-reset)

## `pos-mainchain blockchain export`

Export to <FILE>.

```
USAGE
  $ pos-mainchain blockchain export [-d <value>] [-o <value>]

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
  -o, --output=<value>     The output directory. Default will set to current working directory.

DESCRIPTION
  Export to <FILE>.

EXAMPLES
  blockchain:export

  blockchain:export --data-path ./data --output ./my/path/
```

## `pos-mainchain blockchain hash`

Generate SHA256 hash from <PATH>.

```
USAGE
  $ pos-mainchain blockchain hash [-d <value>]

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.

DESCRIPTION
  Generate SHA256 hash from <PATH>.

EXAMPLES
  blockchain:hash

  blockchain:hash --data-path ./data
```

## `pos-mainchain blockchain import FILEPATH`

Import from <FILE>.

```
USAGE
  $ pos-mainchain blockchain import [FILEPATH] [-d <value>] [-f]

ARGUMENTS
  FILEPATH  Path to the gzipped blockchain data.

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
  -f, --force              Delete and overwrite existing blockchain data

DESCRIPTION
  Import from <FILE>.

EXAMPLES
  blockchain:import ./path/to/blockchain.tar.gz

  blockchain:import ./path/to/blockchain.tar.gz --data-path ./klayr/

  blockchain:import ./path/to/blockchain.tar.gz --data-path ./klayr/ --force
```

## `pos-mainchain blockchain reset`

Reset the blockchain data.

```
USAGE
  $ pos-mainchain blockchain reset [-d <value>] [-y]

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
  -y, --yes                Skip confirmation prompt.

DESCRIPTION
  Reset the blockchain data.

EXAMPLES
  blockchain:reset

  blockchain:reset --data-path ./klayr

  blockchain:reset --yes
```
