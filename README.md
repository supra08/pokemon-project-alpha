# Pokemon Project Alpha

Pokemon Project Alpha is a Tezos blockchain based pokemon game where you get to store your captured pokemons in the blockchain. It is an AR based game where some pokemons are hidden around you inside your room and you need to find and capture them. The blockchain functions are adding a pokemon to the inventory, releasing a pokemon and transfer a pokemon.

## Installation:

For deploying the smart contract:
- Add your api-key and nodes in the config.json.
- Add the api-key and nodes to the conseilScript.js too in this section at the top:
```
    const tezosNode = 'https://tezos-dev.cryptonomic-infra.tech:443';
    const conseilServer = {
        url: 'https://conseil-dev.cryptonomic-infra.tech:443',
        apiKey: '',
        network: 'carthagenet'
    }
```

- Then perform the following commands:
```
    npm run sync
    npm run compile
    npm run deploy
```

- Then to start the app, run the following app:
```
    npm run start
```
- The app needs https to run, use ngrok for that:
```
    ngrok http 5000
```
- Now open the app in you phone browser.

## About the game

The game renders pokemons based on your current location. You need to find them and click the pokeball. The pokemon gets added to the blockchain. You can view the inventory and click on a pokemon to release and it is released from the blockchain as well. A transfer function is also present and currently not implemented in the UI.












 