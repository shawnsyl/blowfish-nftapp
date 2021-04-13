import React, { createContext, useContext, useEffect, useState } from 'react'

import { getWeb3, getContract } from '../../Web3Util';

const networkId = process.env.NODE_ENV === 'development' ? 97 : 56;

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
    const [contractData, setContractData] = useState(() => getLocalStorage('contractData', null));
    const [loadingData, setLoadingData] = useState(false);
    const [reloadRequired, setReloadRequired] = useState(() => getLocalStorage('reloadRequired', false));
    const [tokenInst, setTokenInst] = useState(() => getLocalStorage('tokenInst', null));
    const [user, setUser] = useState(() => getLocalStorage('user', null));
    const [web3, setWeb3] = useState(null);

    const setup = async () => {
        const web3 = await getWeb3();
        let contract;
        // let tokenInst = new web3.eth.Contract(tokenContract, tokenAddress);

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
            setContract(contract);
        }

        // if (tokenInst) {
        //     console.log(tokenInst);
        //     setTokenInst(tokenInst)
        // }
    }

    useEffect(() => {
        if (contractData) {
            setup();
        }
    }, [])

    useEffect(() => {
        if (!!user && !!contract && !!web3) { //TODO: include !!tokenInst when/if we have tokenInst data
            if (Object.keys(contract.methods).length) { //Object.keys(tokenInst.methods);
                web3.eth.net.getId()
                .then(result => {
                    console.log(result, networkId);
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
        };
    }, [contract, user, web3])

    useEffect(() => {
        setLocalStorage('contractData', contractData);
    }, [contractData])

    useEffect(() => {
        setLocalStorage('reloadRequired', reloadRequired)
    }, [reloadRequired])

    const disconnectWallet = () => {
        setContract(null);
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

    const loadData = async () => {;
        const playerBalance = process.env.NODE_ENV === 'development' ?
            await web3.eth.getBalance(user) :   
            await web3.eth.getBalance(user);
        const puffCratePrice = await contract.methods.getCryptoPuffsPrice().call();

        return {
            playerBalance,
            puffCratePrice
        };
    }

    return (
        <ContractDataContext.Provider value={{
            connectWallet: connectWallet,
            disconnectWallet: disconnectWallet,
            contract: contract,
            contractData: contractData,
            loadingData: loadingData,
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