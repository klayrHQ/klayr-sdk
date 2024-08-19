# `pos-mainchain console`

pos-mainchain interactive REPL session to run commands.

- [`pos-mainchain console`](#pos-mainchain-console)

## `pos-mainchain console`

Klayr interactive REPL session to run commands.

```
USAGE
  $ pos-mainchain console [--api-ipc <value> | --api-ws <value>]

FLAGS
  --api-ipc=<value>  Enable api-client with IPC communication.
  --api-ws=<value>   Enable api-client with Websocket communication.

DESCRIPTION
  Klayr interactive REPL session to run commands.

EXAMPLES
  console

  console --api-ws=ws://localhost:8080

  console --api-ipc=/path/to/server
```
