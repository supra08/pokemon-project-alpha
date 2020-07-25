const tezosNode = 'https://tezos-dev.cryptonomic-infra.tech:443';
const conseilServer = {
    url: 'https://conseil-dev.cryptonomic-infra.tech:443',
    apiKey: 'c8a0617e-2a54-4f99-aabc-dd2958a61227',
    network: 'carthagenet'
}
const networkBlockTime = 30 + 1;
const contractAddress = 'KT1LVCnhJrp9oSbKt4JBP4oSV3kppro4RCCX';

let keyStore = {};

function clearRPCOperationGroupHash(hash) {
    return hash.replace(/\"/g, '').replace(/\n/, '');
}

function parseStorageData(storageResult) {
    let ownerDataList = []
    for (entry of storageResult) {
        let player = entry['args'][0]['string'];

        let pokemons = [];
        for (pokemon of entry['args'][1]) {
            pokemons.push(pokemon['string']);
        }

        ownerData = {
            'player': player,
            'pokemons': pokemons
        }

        ownerDataList.push(ownerData);
    }

    return ownerDataList;
}

async function initAccount() {
    keyStore = {
        publicKey: "edpktkg54QG4RfMt1w1c9FeYXYiowKCXY1Hc2m367X1gV2He4UQkTy",
        privateKey: "edskRhGLSAacEJSnvfaWuSmJjoWPjRTzrcXs9tqwgWDcSDS6Jj9Csq5ZxMdnjP2ebkY1kdDkvKePmM5kTT6BTXb1bsAjxjYsMr",
        publicKeyHash: "tz1aoQSwjDU4pxSwT5AsBiK5Xk15FWgBJoYr",
        seed: "",
        storeType: conseiljs.StoreType.Fundraiser
    }
}

async function getStorage() {
    let storageResult = await conseiljs.TezosNodeReader.getContractStorage(tezosNode, contractAddress);
    return parseStorageData(storageResult);
}

async function invokeContract(action, values) {
    const paramFormat = conseiljs.TezosParameterFormat.Michelson;    

    let params = ``;
    
    if (action == 'add') {
        params = `(Left (Pair "${values.name}" "${values.pokemon}"))`;
    } else if (action == 'release') {
        params = `(Right (Left (Pair "${values.name}" "${values.pokemon}")))`;
    } else if (action == 'transfer') {
        params = `(Right (Right (Pair "${values.senderName}" (Pair "${values.receiverName}" "${values.pokemon}"))))`;
    }
 
    let nodeResult = await conseiljs.TezosNodeWriter.sendContractInvocationOperation(tezosNode, keyStore, contractAddress, 0, 50000, '', 1000, 200000, undefined, params, paramFormat);

    const groupid = clearRPCOperationGroupHash(nodeResult.operationGroupID);
    console.log(`Injected activation operation with ${groupid}`);

    let conseilResult = await conseiljs.TezosConseilClient.awaitOperationConfirmation(conseilServer, conseilServer.network, groupid, 10, networkBlockTime);

    if (conseilResult['status'] === 'applied') {
        console.log(conseilResult);
        conseilResult = await conseiljs.TezosConseilClient.getAccount(conseilServer, conseilServer.network, contractAddress);
        console.log(conseilResult);
    } else if (conseilResult['status'] !== 'applied') {
        console.log(`operation ${groupid} failed`);
        console.log(conseilResult);
        nodeResult = await conseiljs.TezosNodeReader.getBlock(tezosNode, conseilResult['block_hash']);
        console.log(nodeResult);
    } else {
        console.log(`operation ${groupid} appears to have been rejected`);
    }
}