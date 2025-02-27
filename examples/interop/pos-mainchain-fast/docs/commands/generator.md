# `pos-mainchain-fast generator`

Commands relating to pos-mainchain-fast block generator.

- [`pos-mainchain-fast generator disable ADDRESS`](#pos-mainchain-fast-generator-disable-address)
- [`pos-mainchain-fast generator enable ADDRESS`](#pos-mainchain-fast-generator-enable-address)
- [`pos-mainchain-fast generator export`](#pos-mainchain-fast-generator-export)
- [`pos-mainchain-fast generator import`](#pos-mainchain-fast-generator-import)
- [`pos-mainchain-fast generator status`](#pos-mainchain-fast-generator-status)

## `pos-mainchain-fast generator disable ADDRESS`

Disable block generation for given validator address.

```
USAGE
  $ pos-mainchain-fast generator disable ADDRESS [-d <value>] [--pretty] [-w <value>]

ARGUMENTS
  ADDRESS  Address of an account in a klayr32 format.

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
  -w, --password=<value>   Specifies a source for your secret password. Command will prompt you for input if this option
                           is not set.
                           Examples:
                           - --password=pass:password123 (should only be used where security is not important)
      --pretty             Prints JSON in pretty format rather than condensed.

DESCRIPTION
  Disable block generation for given validator address.

EXAMPLES
  generator:disable lskycz7hvr8yfu74bcwxy2n4mopfmjancgdvxq8xz

  generator:disable lskycz7hvr8yfu74bcwxy2n4mopfmjancgdvxq8xz --data-path ./data

  generator:disable lskycz7hvr8yfu74bcwxy2n4mopfmjancgdvxq8xz --data-path ./data --password your_password
```

## `pos-mainchain-fast generator enable ADDRESS`

Enable block generation for given validator address.

```
USAGE
  $ pos-mainchain-fast generator enable ADDRESS [-d <value>] [--pretty] [-w <value>] [--height <value> |
    --use-status-value] [--max-height-generated <value> | ] [--max-height-prevoted <value> | ]

ARGUMENTS
  ADDRESS  Address of an account in a klayr32 format.

FLAGS
  -d, --data-path=<value>             Directory path to specify where node data is stored. Environment variable
                                      "KLAYR_DATA_PATH" can also be used.
  -w, --password=<value>              Specifies a source for your secret password. Command will prompt you for input if
                                      this option is not set.
                                      Examples:
                                      - --password=pass:password123 (should only be used where security is not
                                      important)
      --height=<value>                Last generated block height.
      --max-height-generated=<value>  Validator's largest previously generated height.
      --max-height-prevoted=<value>   Validator's largest prevoted height for a block.
      --pretty                        Prints JSON in pretty format rather than condensed.
      --use-status-value              Use status value from the connected node

DESCRIPTION
  Enable block generation for given validator address.

EXAMPLES
  generator:enable lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu --use-status-value

  generator:enable lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu --height=100 --max-height-generated=30 --max-height-prevoted=10

  generator:enable lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu --height=100 --max-height-generated=30 --max-height-prevoted=10 --data-path ./data

  generator:enable lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu --height=100 --max-height-generated=30 --max-height-prevoted=10 --data-path ./data --password your_password
```

## `pos-mainchain-fast generator export`

Export to <FILE>.

```
USAGE
  $ pos-mainchain-fast generator export [-d <value>] [--pretty] [-o <value>]

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
  -o, --output=<value>     [default: /Users/corbifex/Developer/klayr/klayr-sdk-6-1/examples/interop/pos-mainchain-fast]
                           The output directory. Default will set to current working directory.
      --pretty             Prints JSON in pretty format rather than condensed.

DESCRIPTION
  Export to <FILE>.

EXAMPLES
  generator:export

  generator:export --output /mypath/generator_info.json

  generator:export --output /mypath/generator_info.json --data-path ./data
```

## `pos-mainchain-fast generator import`

Import from <FILE>.

```
USAGE
  $ pos-mainchain-fast generator import -f <value> [-d <value>] [--pretty]

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
  -f, --file-path=<value>  (required) Path of the file to import from
      --pretty             Prints JSON in pretty format rather than condensed.

DESCRIPTION
  Import from <FILE>.

EXAMPLES
  generator:import --file-path ./my/path/genInfo.json

  generator:import --file-path ./my/path/genInfo.json --data-path ./data
```

## `pos-mainchain-fast generator status`

Get forging information for the locally running node.

```
USAGE
  $ pos-mainchain-fast generator status [-d <value>] [--pretty]

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
      --pretty             Prints JSON in pretty format rather than condensed.

DESCRIPTION
  Get forging information for the locally running node.

EXAMPLES
  generator:status

  generator:status --data-path ./sample --pretty
```
