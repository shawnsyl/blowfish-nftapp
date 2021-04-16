import React, { Fragment, useEffect, useState } from 'react'
import classNames from 'classnames';

import { fromWei, toWei }  from '../../Web3Util';

import { useContractDataContext } from '../../hooks/contractData/useContractDataContext'

import {
    Accordion,
    Button,
    Dropdown,
    Icon,
    Input,
    Select
} from 'semantic-ui-react'

import Countdown from '../elements/Countdown'

const axios = require('axios');

const stakeOptions = [
    {
        text: '1 Week',
        value: 1
    },
    {
        text: '2 Weeks',
        value: 2
    },
    {
        text: '3 Weeks',
        value: 3
    },
    {
        text: '4 Weeks',
        value: 4
    },
    {
        text: '5 Weeks',
        value: 5
    },
    {
        text: '6 Weeks',
        value: 6
    },
    {
        text: '7 Weeks',
        value: 7
    },
    {
        text: '8 Weeks',
        value: 8
    },
    
]

const tokenOptions = [
    {
        text: 'BLOWF-BNB',
        value: 'BLOWF-BNB'
    },
    {
        text: 'BNB',
        value: 'BNB'
    }
]

const contractAddress = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_TEST_PUFF_CONTRACT : process.env.REACT_APP_TEST_PUFF_CONTRACT;

const Exchange = props => {
    const outerClasses = classNames(
        'exchange section'
    );
    
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isStake, setIsStake] = useState(true);
    const [isAddingLp, setIsAddingLp] = useState(true);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [lockDuration, setLockDuration] = useState(0);
    const [puffCrateOptions, setPuffCrateOptions] = useState([{text: 'Loading...'}])
    const [puffCrateQuantity, setPuffCrateQuantity] = useState(0);
    const [tokensToStake, setTokensToStake] = useState('');
    const [unlocked, setUnlocked] = useState(false);

    const {
        contract,
        contractData,
        loadingData,
        reloadRequired,
        tokenInst,
        user,
        web3
    } = useContractDataContext();
    console.log(puffCrateQuantity, lockDuration)

    useEffect(() => {
        axios({
            method: 'GET', 
            url: 'https://api.pancakeswap.info/api/tokens'
        })
        .then(response => {
            console.log(response);
        })
    }, [])

    useEffect(()=> {
        if (web3 && contractData) {
            let newPuffCrateOptions = []
            const {
                puffCratePrice
            } = contractData
            for (let i = 0; i < 5; i++) {
                newPuffCrateOptions.push({
                    text: `${i+1} Crate${i > 0 ? 's' : ''} (Lock ${(parseFloat(web3.utils.fromWei(puffCratePrice)) * (i + 1)).toFixed(2)} BNB)`,
                    value: i + 1
                })
            }
            setPuffCrateOptions([...newPuffCrateOptions])
        }
    }, [web3, contractData])
    
    const isDisabled = () => {
        if (process.env.NODE_ENV === 'development') {
            return false;
        }
        if (Date.now() >= 1618768800000) {
            return false;
        }
        return true;
    }

    const isButtonDisabled = () => {
        if (!unlocked && isAddingLp) {
            return true;
        }

        if (!(lockDuration > 0 && puffCrateQuantity > 0)) {
            return true;
        }
        
        if (isUnlocking || loadingData) {
            return true;
        }

        return false;
    }

    const getApproveButtonText = () => {
        if (isUnlocking) {
            return 'Approving...'
        }

        if (unlocked) {
            return 'Approved'
        }

        return 'Approve'
    }

    const approve = async () => {
        const { puffCratePrice } = contractData;

        const max = 5 * puffCratePrice;

        tokenInst.methods.allowance(user, contractAddress).call()
        .then(allowance => { 
            if (Number(allowance) < Number(max)) {
                tokenInst.methods.approve(contractAddress, web3.utils.toWei((max).toString())).estimateGas({from: user})
                .then(gasEstimate => {
                    tokenInst.methods.approve(contractAddress, web3.utils.toWei((max).toString())).send({gas: gasEstimate, from: user})
                    .then(approval => {
                        setUnlocked(true);
                        setIsUnlocking(false);
                        return approval
                    })
                    .catch(e => {
                        console.error(e);
                        setUnlocked(false);
                        setIsUnlocking(false);
                    })
                })
            } else {
                setUnlocked(true);
                setIsUnlocking(false);
                return;
            }
            
        })
        .catch(e => {
            console.error(e);
            setUnlocked(true);
            setIsUnlocking(false);
        })
    }

    const approveWallet = () => {
        setIsUnlocking(true);
        approve()
        .then(() => {
        })
        .catch(e => {
            console.error(e);
            setUnlocked(false);
            setIsUnlocking(false);
        })
    }

    const openCrate = () => {
        const {
            puffCratePrice
        } = contractData
        const lockAmount = web3.utils.toWei((fromWei(puffCrateQuantity * puffCratePrice)).toString());
        console.log(lockAmount);
        console.log(contract.methods);

        if (isAddingLp) {
            console.log('disabled')
        } else {
            try {
                contract.methods.purchaseCryptoPuff(lockDuration).estimateGas({from: user, value: lockAmount})
                .then(gasEstimate => {
                    contract.methods.purchaseCryptoPuff(lockDuration).send({
                        gas: gasEstimate + 50000, from: user, value: lockAmount
                    }).then(response => {
                        console.log(response.events.Transfer.returnValues.tokenId);
                        axios({
                            method: 'post', 
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            baseURL:  process.env.REACT_APP_SERVER_HOST + 'api/',
                            url: 'userNfts/add',
                            data: JSON.stringify({
                                puffId: response.events.Transfer.returnValues.tokenId,
                                puffOwner: user
                            })
                        })
                        .then(response => {
                            console.log(response);
                        })
                        .catch(err => {
                            console.error(err);
                        })
                    })
                });
            } catch (e) {
                console.error(e);
            }
        }
    }

    const stakingForm = () => {
        const {
            playerBalance
        } = contractData;
        return (
            <div className='exchange-window'>
                <h3>Lock your BNB to receive CryptoPuff lootboxes</h3>

                <p>Available: {web3.utils.fromWei(playerBalance)} BNB</p>

                <p>Choose to lock:</p>

                <div className='exchange-links'>
                    <div>
                        <a className={isAddingLp ? 'exchange-link-active' : 'exchange-link-inactive'} onClick={() => {
                            setIsAddingLp(true);
                        }}>
                            Liquidity
                        </a>
                    </div>
                    <div>
                        <a className={!isAddingLp ? 'exchange-link-active' : 'exchange-link-inactive'} onClick={() => {
                            setIsAddingLp(false);
                        }}>
                            BLOWF
                        </a>
                    </div>
                </div>

                {isAddingLp ? <p>
                    When you add liquidity, you add and lock pool tokens representing your position in exchange for CryptoPuffs. 
                </p> : null}

                <p>Select number of Puff Crates to open</p>

                <Dropdown
                disabled={isDisabled()}
                fluid
                selection
                onChange={(_, d) => setPuffCrateQuantity(d.value)}
                options={puffCrateOptions} />
                
                <p>Select lock duration. Longer the lock duration, higher the chances of pulling a <strong>higher rarity Puff Crate</strong>!</p>

                <Dropdown
                disabled={isDisabled()}
                fluid
                selection
                onChange={(_, d) => setLockDuration(d.value)}
                options={stakeOptions} />

                {isAddingLp ? (
                    <Button className='button-primary' disabled={isUnlocking || unlocked} fluid onClick={approveWallet}>
                        {getApproveButtonText()}
                    </Button>
                 ) : null}
                <br />
                <Button className='button-primary' disabled={isDisabled() || isButtonDisabled()} fluid onClick={openCrate}>
                    Open Crates!
                </Button>
            </div>
        )
    }

    return  (
        <section className={outerClasses}>

            <Countdown />
            <div className='container'>
                {contractData && !reloadRequired && web3 ? (
                    <Fragment>
                        {stakingForm()}
                    </Fragment>
                ) : null}
            </div>
        </section>
    )
}

export default Exchange;