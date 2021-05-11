import React, { createContext, useContext, useEffect, useState } from 'react'

import { getWeb3, getContract } from '../../Web3Util';

import MainLPContract from '../../abi/MainLP.json';
import TestLPContract from '../../abi/TestLP.json'

const tokenContract = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? TestLPContract : MainLPContract;
const tokenAddress = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? process.env.REACT_APP_TEST_LP_TOKEN : process.env.REACT_APP_MAIN_LP_TOKEN;
const networkId = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? 97 : 56;

console.log(process.env.REACT_APP_IS_STAGING)

const setLocalStorage = (key, value) => {
    try {
        window.sessionStorage.setItem(key, JSON.stringify(value)); // JSON.stringify(value)
    } catch (e) {
        console.error(e);
        // catch possible errors:
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    }
}
  
const getLocalStorage = (key, initialValue) => {
    try {
        const value = window.sessionStorage.getItem(key);
        return value ? JSON.parse(value) : initialValue;
    } catch (e) {
        // if error, return initial value
        return initialValue;
    }
}

export const ContractDataContext = createContext();

export const useContractDataContext = () => useContext(ContractDataContext);

export const ContractDataProvider = ({children}) => {
    const [contract, setContract] = useState(() => getLocalStorage('contract', null));
    const [marketContract, setMarketContract] = useState(() => getLocalStorage('marketContract', null))
    const [contractData, setContractData] = useState(() => getLocalStorage('contractData', null));
    const [loadingData, setLoadingData] = useState(false);
    const [reloadRequired, setReloadRequired] = useState(() => getLocalStorage('reloadRequired', false));
    const [tokenInst, setTokenInst] = useState(() => getLocalStorage('tokenInst', null));
    const [user, setUser] = useState(() => getLocalStorage('user', null));
    const [web3, setWeb3] = useState(null);

    const setup = async () => {
        const web3 = await getWeb3();
        let contract;
        let tokenInst = new web3.eth.Contract(tokenContract, tokenAddress);

        if (web3) {
            window.web3 = web3;
            window.user = (await web3.eth.getAccounts())[0];
            contract = await getContract(web3);
            setWeb3(web3);
        }

        if (window.user) {
            console.log('wallet address: ', window.user);
            setUser(window.user);
        }

        if (contract) {
            console.log(contract);
            setContract(contract[0]);
            setMarketContract(contract[1]);
        }

        if (tokenInst) {
            console.log(tokenInst);
            setTokenInst(tokenInst)
        }
    }

    useEffect(() => {
        if (contractData) {
            setup();
        }
    }, [])

    useEffect(() => {
        if (!!tokenInst && !!user && !!contract && !!marketContract && !!web3) {
            if (Object.keys(contract.methods).length && Object.keys(tokenInst.methods).length && Object.keys(marketContract.methods).length) {
                web3.eth.net.getId()
                .then(result => {
                    if (result !== networkId) {
                        setReloadRequired(true)
                        setLoadingData(false);
                    } else {
                        setReloadRequired(false)
                        setData();
    
                        setInterval(
                            () => setData(), 60000
                        )
                    }
                });
            }
            setLocalStorage('user', user);
            setLocalStorage('contract', contract);
            setLocalStorage('marketContract', marketContract);
        };
    }, [contract, marketContract, tokenInst, user, web3])

    useEffect(() => {
        setLocalStorage('contractData', contractData);
    }, [contractData])

    useEffect(() => {
        setLocalStorage('marketContract', marketContract);
    }, [marketContract])

    useEffect(() => {
        setLocalStorage('reloadRequired', reloadRequired)
    }, [reloadRequired])

    const disconnectWallet = () => {
        setContract(null);
        setMarketContract(null);
        setContractData(null);
        setTokenInst(null);
        setUser(null);
        setWeb3(null);

        window.sessionStorage.clear()
    }

    const connectWallet = async () => {
        setLoadingData(true);
        setup();
    }

    const setData = () => {
        loadData()
        .then(result => {
            if (loadingData) {
                setLoadingData(false);
            }
            
            setContractData({
                ...result
            })
        })
        .catch(e => {
            console.error(e);
            setLoadingData(false);
        })
    }

    const getMarketPuffs = async () => {
        return marketContract.methods.getTradeCount().call()
            .then(tradeCount => {
                let tradeArray = [...Array(parseInt(tradeCount)).keys()];
                console.log(tradeArray);
                
                let tradeQueries = tradeArray.map((_, index) => 
                    marketContract.methods.erc721Trades(index + 1).call()
                );
                return Promise.all(tradeQueries)
                    
            })
    }

    const loadData = async () => {;
        const playerBalance = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ?
            await web3.eth.getBalance(user) :   
            await web3.eth.getBalance(user);
        const puffCratePrice = await contract.methods.getCryptoPuffsPrice().call();
        const marketPuffs = await getMarketPuffs();
        console.log(marketPuffs);
        // const market
        return {
            playerBalance,
            puffCratePrice,
            marketPuffs
        };
    }

    return (
        <ContractDataContext.Provider value={{
            connectWallet: connectWallet,
            disconnectWallet: disconnectWallet,
            contract: contract,
            contractData: contractData,
            loadingData: loadingData,
            marketContract: marketContract,
            reloadRequired: reloadRequired,
            tokenInst: tokenInst,
            user: user,
            web3: web3,
        }
        }>
            {children}
        </ContractDataContext.Provider>
    )
};