# `poa-sidechain system`

Commands relating to poa-sidechain node.

- [`poa-sidechain system metadata`](#poa-sidechain-system-metadata)
- [`poa-sidechain system node-info`](#poa-sidechain-system-node-info)

## `poa-sidechain system metadata`

Get node metadata from a running application.

```
USAGE
  $ poa-sidechain system metadata [-d <value>] [--pretty]

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

## `poa-sidechain system node-info`

Get node information from a running application.

```
USAGE
  $ poa-sidechain system node-info [-d <value>] [--pretty]

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
