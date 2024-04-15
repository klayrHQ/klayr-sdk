# `pos-sidechain-example-two node`

Get node information from a running application.

- [`pos-sidechain-example-two node info`](#pos-sidechain-example-two-node-info)
- [`pos-sidechain-example-two node metadata`](#pos-sidechain-example-two-node-metadata)

## `pos-sidechain-example-two node info`

Get node information from a running application.

```
USAGE
  $ pos-sidechain-example-two node info [-d <value>] [--pretty]

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

## `pos-sidechain-example-two node metadata`

Get node metadata from a running application.

```
USAGE
  $ pos-sidechain-example-two node metadata [-d <value>] [--pretty]

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
