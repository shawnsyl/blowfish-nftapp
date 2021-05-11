import Web3 from 'web3';

import MainContract from './abi/MainContract.json';
import TestContract from './abi/TestContract.json';
import TestMarketContract from './abi/TestMarket.json';
const contractAddress = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? process.env.REACT_APP_TEST_PUFF_CONTRACT : process.env.REACT_APP_CRYPTOPUFF_CONTRACT;
const marketContractAddress = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? process.env.REACT_APP_TEST_MARKET_CONTRACT : process.env.REACT_APP_TEST_MARKET_CONTRACT;

export const getWeb3 = () =>
    new Promise(async(resolve, reject) => {
    //window.addEventListener("load", async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
        await window.ethereum.enable();
        resolve(web3);
        } catch (error) {
        reject(error);
        }
    } else if (window.web3) {
        // load metamask provider
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
    } else {
        console.log(process.env.PUBLIC_URL)
        const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
    }
    //});
});

export const getContract = async (web3) => {
    const contractAbi = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? TestContract : MainContract
    const marketAbi = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? TestMarketContract : TestMarketContract
    window.user = (await web3.eth.getAccounts())[0];
    
    window.instance = [
        new web3.eth.Contract(
            contractAbi,
            contractAddress, // contract address here
            {
                from: window.user
            }
        ), 
        new web3.eth.Contract(
            marketAbi,
            marketContractAddress, // contract address here
            {
                from: window.user
            }
        ),
    ];
    return window.instance;
}

export const fromWei = value => {
    return (value / (1000000000000000000)).toString();
}

export const toWei = value => {
    return (value * (1000000000000000000)).toString();
}