# `poa-sidechain endpoint`

Commands relating to endpoints.

- [`poa-sidechain endpoint invoke ENDPOINT [PARAMS]`](#poa-sidechain-endpoint-invoke-endpoint-params)
- [`poa-sidechain endpoint list [ENDPOINT]`](#poa-sidechain-endpoint-list-endpoint)

## `poa-sidechain endpoint invoke ENDPOINT [PARAMS]`

Invokes the provided endpoint.

```
USAGE
  $ poa-sidechain endpoint invoke ENDPOINT [PARAMS] [-d <value>] [--pretty] [-f <value>]

ARGUMENTS
  ENDPOINT  Endpoint to invoke
  PARAMS    Endpoint parameters (Optional)

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
  -f, --file=<value>       Input file.
      --pretty             Prints JSON in pretty format rather than condensed.

DESCRIPTION
  Invokes the provided endpoint.

EXAMPLES
  endpoint:invoke {endpoint} {parameters}

  endpoint:invoke --data-path --file

  endpoint:invoke generator_getAllKeys

  endpoint:invoke consensus_getBFTParameters '{"height": 2}' -d ~/.klayr/pos-mainchain --pretty

  endpoint:invoke consensus_getBFTParameters -f ./input.json
```

## `poa-sidechain endpoint list [ENDPOINT]`

Lists registered endpoints.

```
USAGE
  $ poa-sidechain endpoint list [ENDPOINT] [-d <value>] [--pretty] [-m <value>] [-i]

ARGUMENTS
  ENDPOINT  Endpoint name (Optional)

FLAGS
  -d, --data-path=<value>  Directory path to specify where node data is stored. Environment variable "KLAYR_DATA_PATH"
                           can also be used.
  -i, --info               Prints additional info; Request and Response objects.
  -m, --module=<value>     Parent module.
      --pretty             Prints JSON in pretty format rather than condensed.

DESCRIPTION
  Lists registered endpoints.

EXAMPLES
  endpoint:list

  endpoint:list {endpoint} -m {module}

  endpoint:list {endpoint} -m {module} -i

  endpoint:list -m validator

  endopint:list getBalance

  endpoint:list get -m token

  endpoint:list getBalances -m token -i --pretty

  endpoint:list getBalances -m token -d ~/.klayr/pos-mainchain
```
