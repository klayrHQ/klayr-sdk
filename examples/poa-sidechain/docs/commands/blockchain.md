# `poa-sidechain blockchain`

Commands relating to poa-sidechain blockchain data.

- [`poa-sidechain blockchain export`](#poa-sidechain-blockchain-export)
- [`poa-sidechain blockchain hash`](#poa-sidechain-blockchain-hash)
- [`poa-sidechain blockchain import FILEPATH`](#poa-sidechain-blockchain-import-filepath)
- [`poa-sidechain blockchain reset`](#poa-sidechain-blockchain-reset)

## `poa-sidechain blockchain export`

Export to <FILE>.

```
USAGE
  $ poa-sidechain blockchain export [-d <value>] [-o <value>]

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
  -o, --output=<value>     [default: /Users/corbifex/Developer/klayr/klayr-sdk-6-1/examples/poa-sidechain] The output
                           directory. Default will set to current working directory.

DESCRIPTION
  Export to <FILE>.

EXAMPLES
  blockchain:export

  blockchain:export --data-path ./data --output ./my/path/
```

## `poa-sidechain blockchain hash`

Generate SHA256 hash from <PATH>.

```
USAGE
  $ poa-sidechain blockchain hash [-d <value>]

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.

DESCRIPTION
  Generate SHA256 hash from <PATH>.

EXAMPLES
  blockchain:hash

  blockchain:hash --data-path ./data
```

## `poa-sidechain blockchain import FILEPATH`

Import from <FILE>.

```
USAGE
  $ poa-sidechain blockchain import FILEPATH [-d <value>] [-f]

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

## `poa-sidechain blockchain reset`

Reset the blockchain data.

```
USAGE
  $ poa-sidechain blockchain reset [-d <value>] [-y]

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
