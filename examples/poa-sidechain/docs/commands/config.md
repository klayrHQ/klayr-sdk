# `poa-sidechain config`

Commands relating to poa-sidechain node configuration.

- [`poa-sidechain config create`](#poa-sidechain-config-create)
- [`poa-sidechain config show`](#poa-sidechain-config-show)

## `poa-sidechain config create`

Creates network configuration file.

```
USAGE
  $ poa-sidechain config create -i <value> [-o <value>] [-l <value>]

FLAGS
  -i, --chain-id=<value>  (required) ChainID in hex format. For example, Klayr mainnet mainchain is 00000000
  -l, --label=<value>     [default: beta-sdk-app] App Label
  -o, --output=<value>    [default: /Users/corbifex/Developer/klayr/klayr-sdk-6-1/examples/poa-sidechain] Directory
                          where the config file is saved

DESCRIPTION
  Creates network configuration file.

EXAMPLES
  config:create --output mydir

  config:create --output mydir --label beta-sdk-app

  config:create --output mydir --label beta-sdk-app --community-identifier sdk
```

## `poa-sidechain config show`

Show application config.

```
USAGE
  $ poa-sidechain config show [-d <value>] [-c <value>] [--pretty]

FLAGS
  -c, --config=<value>     File path to a custom config. Environment variable "KLAYR_CONFIG_FILE" can also be used.
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
      --pretty             Prints JSON in pretty format rather than condensed.

DESCRIPTION
  Show application config.

EXAMPLES
  config:show

  config:show --pretty

  config:show --config ./custom-config.json --data-path ./data
```
