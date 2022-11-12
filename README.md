# weConvertSolJs
Convert solidity contract into a javascript class to interact with it through ethers or web3 library

## How to use

- download the repo
- place your smart contract abi in `json` format inside the `contracts` folder
- run the converter based on what library you ar using
  - using ethers: `node converter-ethers.js` 
  - using web3: `node converter-web3.js` 
- you will now find inside the `class/web3` ( or `class/ethers` based on the used converter ) folder the generated javascript class that will make you easily interact with the smart contract

## ethers
#### Example of generated class intialization

```
let token = new ContractToken(
    provider,
    signer.data,
    tokenAddress,
    (err, code, message) => {
        console.log('Error: ', err);
    },
    (res) => {
        console.log('Success: ', res);
    }
);
_balance = await token.balanceOf(address);
```

## web3
#### Example of generated class intialization
```
let token = new ContractToken(
    web3,
    tokenAddress,
    (err, code, message) => {
        console.log('Error: ', err);
    },
    (res) => {
        console.log('Success: ', res);
    }
);
_balance = await token.balanceOf(address);
```
