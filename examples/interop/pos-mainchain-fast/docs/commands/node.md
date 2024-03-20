# `pos-mainchain-fast node`

Get node information from a running application.

- [`pos-mainchain-fast node info`](#pos-mainchain-fast-node-info)
- [`pos-mainchain-fast node metadata`](#pos-mainchain-fast-node-metadata)

## `pos-mainchain-fast node info`

Get node information from a running application.

```
USAGE
  $ pos-mainchain-fast node info [-d <value>] [--pretty]

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
  --pretty                 Prints JSON in pretty format rather than condensed.

DESCRIPTION
  Get node information from a running application.

EXAMPLES
  system:node-info

  system:node-info --data-path ./klayr
```

## `pos-mainchain-fast node metadata`

Get node metadata from a running application.

```
USAGE
  $ pos-mainchain-fast node metadata [-d <value>] [--pretty]

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
  --pretty                 Prints JSON in pretty format rather than condensed.

DESCRIPTION
  Get node metadata from a running application.

EXAMPLES
  system:metadata

  system:metadata --data-path ./klayr
```
