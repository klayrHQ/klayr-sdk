# PoA Example

This project was bootstrapped with [Klayr SDK](https://github.com/Klayrhq/klayr-sdk)

### Start a node

```
./bin/run start
```

### Add a new module

```
klayr generate:module ModuleName ModuleID
// Example
klayr generate:module token 1
```

### Add a new asset

```
klayr generate:asset ModuleName AssetName AssetID
// Example
klayr generate:asset token transfer 1
```

### Add a new plugin

```
klayr generate:plugin PluginName
// Example
klayr generate:plugin httpAPI
```

## Learn More

You can learn more in the [documentation](https://klayr.xyz/documentation/klayr-sdk/).
