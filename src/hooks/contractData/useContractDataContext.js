import React, { createContext, useContext, useEffect, useState } from 'react'

import { getWeb3, getContract, fromWei } from '../../Web3Util';

import TKNContract from '../../abi/TKN.json';
import BNBContract from '../../abi/BNBMainnet.json';

const tokenContract = process.env.NODE_ENV === 'development' ? TKNContract : BNBContract;
const tokenAddress = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_TEST_TOKEN : process.env.REACT_APP_BNB_MAIN_TOKEN;
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
    const [lotteryRunTime, setLotteryRunTime] = useState(() => getLocalStorage('lotteryRunTime', 600));
    const [lotteryState, setLotteryState] = useState(() => getLocalStorage('lotteryState', null));
    const [openTimestamp, setOpenTimestamp] = useState(() => getLocalStorage('openTimestamp', null));
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
            // contract = await getContract(web3);
            setWeb3(web3);
        }

        if (window.user) {
            console.log('wallet address: ', window.user);
            setUser(window.user);
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
        if (!!user && !!tokenInst && !!web3) { //TODO: include !!contract when we have contract data
            if (Object.keys(tokenInst.methods).length) { //Object.keys(contract.methods);
                web3.eth.net.getId()
                .then(result => {
                    console.log(result, networkId);
                    if (result !== networkId) {
                        setReloadRequired(true)
                        setLoadingData(false);
                    } else {
                        setReloadRequired(false)
                        setLoadingData(false);
                        // setData();
    
                        // setInterval(
                        //     () => setData(), 60000
                        // )
                    }
                });
            }
            setLocalStorage('user', user);
            setLocalStorage('contract', contract);
            setLocalStorage('tokenInst', tokenInst);
        };
    }, [contract, tokenInst, user, web3])

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
        const unique = (value, index, self) => {
            return self.indexOf(value) === index;
        }
        
        loadData()
        .then(result => {
            if (loadingData) {
                setLoadingData(false);
            }
            if (lotteryState !== result.lotteryState) {
                setLotteryState(result.lotteryState);
            }
            if (openTimestamp !== result.openTimestamp) {
                setOpenTimestamp(result.openTimestamp);
                setLocalStorage('openTimestamp', result.openTimestamp)
            }
            if (lotteryRunTime !== result.lotteryRunTime) {
                setLotteryRunTime(result.lotteryRunTime);
                setLocalStorage('lotteryRunTime', result.lotteryRunTime)
            }
            let newPastWinner = result.pastWinners[result.pastWinners.length - 1]

            let entries = [...result.playerEntries].splice(0, result.numPlayers);
            
            setContractData({
                ...result,
                playerEntries: entries.filter(address => {
                    return address === user
                }).length,
                numUnique: entries.filter(unique).length,
                pastWinner: newPastWinner,
                entryIncrement: fromWei(result.entryIncrement),
            })
        })
        .catch(e => {
            console.error(e);
        })
    }

    const loadData = async () => {
        const poolSize = await contract.methods.getPool().call();
        const lotteryState = await contract.methods.lotteryState().call();
        const maximumEntries = await contract.methods.MAXIMUM_ENTRIES().call();
        const maximumPoolSize = await contract.methods.MAXIMIUM_POOL_SIZE().call();
        const entryIncrement = await contract.methods.ENTRY_INCREMENT().call();
        const openTimestamp = await contract.methods.getOpenTimestamp().call();
        const lotteryRunTime = await contract.methods.LOTTERY_RUN_TIME().call();
        const numPlayers = await contract.methods.getNumPlayers().call();
        const playerEntries = await contract.methods.getPlayers().call();
        const playerBalance = await tokenInst.methods.balanceOf(user).call();
        const pastWinners = await contract.methods.getWinners().call();

        return {
            poolSize,
            lotteryState,
            maximumEntries,
            maximumPoolSize,
            entryIncrement,
            openTimestamp,
            lotteryRunTime,
            numPlayers,
            playerEntries,
            playerBalance,
            pastWinners
        };
    }

    return (
        <ContractDataContext.Provider value={{
            connectWallet: connectWallet,
            disconnectWallet: disconnectWallet,
            contract: contract,
            contractData: contractData,
            loadingData: loadingData,
            lotteryRunTime: lotteryRunTime,
            lotteryState: lotteryState,
            openTimestamp: openTimestamp,
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