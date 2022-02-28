# Crypton-test-task

>This is my first project that I wrote in Js and Solidity. It was written as a test assignment for admission to an internship at Crypton.

>The project contains a smart contract, tasks for performing the functions prescribed in the smart contract, script to deploy it to rinkeby network and unit tests, that can be run through the solidity coverage plugin.


Run script to deploy contract in Rinkeby:
```shell
npx hardhat run scripts/deploy.js
```

Tasks:

- Donates money from an account whose private key is registered in hardhat.config.js
```shell
npx hardhat donate

Usage: hardhat [GLOBAL OPTIONS] donate --amount <STRING> --contract <STRING>

OPTIONS:

  --amount  	Amount of money in ETH 
  --contract	Address of contract 
```
Example:
```shell
npx hardhat donate --amount 0.01 --contract 0x0b450f342c593B2546A8989947920293C89eEd94
```
- Withdraws money to a certain address (The command can only be run by the contract owner)
```shell
npx hardhat withdraw

Usage: hardhat [GLOBAL OPTIONS] withdraw --amount <STRING> --contract <STRING> --user <STRING>

OPTIONS:

  --amount  	Amount of money in ETH 
  --contract	Address of contract 
  --user    	Address of user
```
Example:
```shell
npx hardhat withdraw --amount 0.01 --contract 0x0b450f342c593B2546A8989947920293C89eEd94 --user 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95
```
- Shows the amount of money donated by the user
```shell
npx hardhat total

Usage: hardhat [GLOBAL OPTIONS] total --contract <STRING> --user <STRING>

OPTIONS:

  --contract	Address of contract 
  --user    	Address of user 
```
Example:
```shell
npx hardhat total --contract 0x0b450f342c593B2546A8989947920293C89eEd94 --user 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95
```
- Shows a list of people who donated money
```shell
npx hardhat donaters

Usage: hardhat [GLOBAL OPTIONS] donaters --contract <STRING>

OPTIONS:

  --contract	Address of contract 
```
Example:
```shell
npx hardhat total --contract 0x0b450f342c593B2546A8989947920293C89eEd94
```


Run solidity coverage:
`npx hardhat coverage --network hardhat`
