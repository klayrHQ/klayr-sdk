# `pos-sidechain-example-two hash-onion`

Create hash onions to be used by the forger.

- [`pos-sidechain-example-two hash-onion`](#pos-sidechain-example-two-hash-onion)

## `pos-sidechain-example-two hash-onion`

Create hash onions to be used by the forger.

```
USAGE
  $ pos-sidechain-example-two hash-onion [-o <value>] [-c <value>] [-d <value>] [--pretty]

FLAGS
  -c, --count=<value>     [default: 1000000] Total number of hashes to produce
  -d, --distance=<value>  [default: 1000] Distance between each hash
  -o, --output=<value>    Output file path
  --pretty                Prints JSON in pretty format rather than condensed.

DESCRIPTION
  Create hash onions to be used by the forger.

EXAMPLES
  hash-onion --count=1000000 --distance=2000 --pretty

  hash-onion --count=1000000 --distance=2000 --output ~/my_onion.json
```
