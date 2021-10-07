# 🌟 Injective TS Example

_Decentralized Derivatives Trading. Any Market. Anytime. Anywhere._

An example repository based on TypeScript on interacting with our chain

---

## 📚 Getting Started

1. Clone the repository

```bash
$ git clone git@github.com:InjectiveLabs/injective-ts-example.git
$ cd injective-ts-example
$ yarn
```

2. Duplicate the .env.example to .env and fill the values

```bash
## ChainId should be 1 for mainnet, 42 for testnet
CHAIN_ID=1

### Used to fetch predefined endpoints for our sentry nodes, can be
### public (mainnet) or testnet (testnet)
NETWORK=public

### Account's private key used for signing
PRIVATE_KEY=
```

3. Execute the example (optional)
   
```bash
## Example getting data from the chain
$ yarn consume 

## Example writing transactions to the chain
$ yarn broadcast
```

## 📖 Documentation

---

## ⛑ Support

Reach out to us at one of the following places!

- Website at <a href="https://injectiveprotocol.com" target="_blank">`injectiveprotocol.com`</a>
- Twitter at <a href="https://twitter.com/InjectiveLabs" target="_blank">`@InjectiveLabs`</a>

---

## 🔓 License
