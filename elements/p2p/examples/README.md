# P2P Examples

A few examples to demonstrate the usage of @klayr/p2p library. Make sure you run `npm run build` before running these examples.

- Echo: Nodes will simply say hi to each other and they will get a response back until some node gets 10 "hi"s in total.

  - Run : `node examples/echo` from root folder.

- A network can be thought of as people who move from one city to other and if they find a peer in the same city, they broadcast it to others and shutdown.

  - Run: `node examples/find-city-game` from root folder.

- Client to connect to different networks within Klayr networks.
  - Run: `node examples/klayr-network {NETWORK_NAME}` where `NETWORK_NAME` can be testnet, devnet and mainnet.
