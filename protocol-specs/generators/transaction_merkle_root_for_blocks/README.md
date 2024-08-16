# Replace payload hash with Merkle tree root in block header

Protocol specifications require a transactionRoot property of blocks, which is the merkle root of transaction IDs in a block.

#### Input

- message: Array of hex strings

#### Output

- Hexadecimal string

## Resources

- [LIP-0032](https://github.com/Klayrhq/lips/blob/master/proposals/lip-0032.md)
