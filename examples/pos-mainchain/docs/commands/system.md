# `pos-mainchain system`

Commands relating to pos-mainchain node.

- [`pos-mainchain system metadata`](#pos-mainchain-system-metadata)
- [`pos-mainchain system node-info`](#pos-mainchain-system-node-info)

## `pos-mainchain system metadata`

Get node metadata from a running application.

```
USAGE
  $ pos-mainchain system metadata [-d <value>] [--pretty]

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
      --pretty             Prints JSON in pretty format rather than condensed.

DESCRIPTION
  Get node metadata from a running application.

EXAMPLES
  system:metadata

  system:metadata --data-path ./klayr
```

## `pos-mainchain system node-info`

Get node information from a running application.

```
USAGE
  $ pos-mainchain system node-info [-d <value>] [--pretty]

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
      --pretty             Prints JSON in pretty format rather than condensed.

DESCRIPTION
  Get node information from a running application.

EXAMPLES
  system:node-info

  system:node-info --data-path ./klayr
```
