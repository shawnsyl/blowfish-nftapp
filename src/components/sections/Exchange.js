import React, { Fragment, useEffect, useState } from 'react'
import classNames from 'classnames';

import { fromWei, }  from '../../Web3Util';

import { useContractDataContext } from '../../hooks/contractData/useContractDataContext'

import {
    Button,
    Dropdown,
    Loader,
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

const contractAddress = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? process.env.REACT_APP_TEST_PUFF_CONTRACT : process.env.REACT_APP_TEST_PUFF_CONTRACT;

const Exchange = props => {
    const outerClasses = classNames(
        'exchange section'
    );

    const [infoText, setInfoText] = useState('');
    const [isAddingLp, setIsAddingLp] = useState(false);
    const [isOpening, setIsOpening] = useState(false);
    const [openingText, setOpeningText] = useState('Opening Crates');
    const [lockDuration, setLockDuration] = useState(0);
    const [puffCrateOptions, setPuffCrateOptions] = useState([{text: 'Loading...'}])
    const [puffCrateQuantity, setPuffCrateQuantity] = useState(0);

    const {
        contract,
        contractData,
        loadingData,
        reloadRequired,
        tokenInst,
        user,
        web3
    } = useContractDataContext();

    useEffect(() => {
        let timer;
        timer = setInterval(() => {
            if (openingText === 'Opening Crates...') {
                setOpeningText('Opening Crates');
            } else {
                setOpeningText(openingText + '.');
            }
        }, 1000)

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        }
    }, [openingText])

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
        if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE') {
            return false;
        }
        if (Date.now() >= 1618974000000) {
            return false;
        }
        return true;
    }

    const isButtonDisabled = () => {
        if (!(lockDuration > 0 && puffCrateQuantity > 0)) {
            return true;
        }
        
        if (loadingData) {
            return true;
        }

        if (isOpening) {
            return true;
        }

        return false;
    }

    const approve = async () => {
        const { puffCratePrice } = contractData;

        const max = 5 * puffCratePrice;

        tokenInst.methods.allowance(user, contractAddress).call()
        .then(allowance => { 
            console.log(allowance);
            if (Number(allowance) < Number(max)) {
                tokenInst.methods.approve(contractAddress, web3.utils.toWei((max).toString())).estimateGas({from: user})
                .then(gasEstimate => {
                    tokenInst.methods.approve(contractAddress, web3.utils.toWei((max).toString())).send({gas: gasEstimate, from: user})
                    .then(approval => {
                        return approval
                    })
                    .catch(e => {
                        console.error(e);
                    })
                })
            } else {
                return;
            }
            
        })
        .catch(e => {
            console.error(e);
        })
    }

    const openCrate = () => {
        setIsOpening(true);
        const {
            puffCratePrice
        } = contractData
        const lockAmount = web3.utils.toWei((fromWei(puffCrateQuantity * puffCratePrice)).toString());

        if (isAddingLp) {
            try {
                contract.methods.purchaseCryptoPuffLiquidity(lockDuration, puffCrateQuantity).estimateGas({from: user, value: lockAmount})
                .then(gasEstimate => {
                    contract.methods.purchaseCryptoPuffLiquidity(lockDuration, puffCrateQuantity).send({
                        gas: gasEstimate + 50000, from: user, value: lockAmount
                    }).then(response => {
                        console.log(response.events.Transfer.returnValues)
                        axios({
                            method: 'post', 
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
                            url: 'cryptopuffs/add',
                            data: JSON.stringify({
                                puffId: response.events.Transfer.returnValues.tokenId,
                                puffOwner: user,
                                dateMinted: Date.now()
                            })
                        })
                        .then(response => {
                            console.log(response);
                            setIsOpening(false);
                        })
                        .catch(err => {
                            console.error(err);
                            setIsOpening(false);
                        })
                    }).catch(err => {
                        console.error(err);
                        setIsOpening(false);
                    })
                });
            } catch (e) {
                console.error(e);
                setIsOpening(false);
            }
        } else {
            try {
                contract.methods.purchaseCryptoPuffTokens(lockDuration, puffCrateQuantity).estimateGas({from: user, value: lockAmount})
                .then(gasEstimate => {
                    contract.methods.purchaseCryptoPuffTokens(lockDuration, puffCrateQuantity).send({
                        gas: gasEstimate + 50000, from: user, value: lockAmount
                    }).then(response => {
                        console.log(response.events.Transfer.returnValues)
                        axios({
                            method: 'post', 
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
                            url: 'cryptopuffs/add',
                            data: JSON.stringify({
                                puffId: response.events.Transfer.returnValues.tokenId,
                                puffOwner: user,
                                dateMinted: Date.now()
                            })
                        })
                        .then(response => {
                            setIsOpening(false);
                            console.log(response);
                        })
                        .catch(err => {
                            console.error(err);
                            setIsOpening(false);
                        })
                    }).catch(err => {
                        console.error(err);
                        setIsOpening(false);
                    })
                });
            } catch (e) {
                console.error(e);
                setIsOpening(false);
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
                    <div className={!isAddingLp ? 'exchange-link-active' : 'exchange-link-inactive'} onClick={() => {
                        setIsAddingLp(false);
                    }}>
                        BLOWF
                    </div>
                    <div className={isAddingLp ? 'exchange-link-active' : 'exchange-link-inactive'} onClick={() => {
                        setIsAddingLp(true);
                    }}>
                        Liquidity
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

                <Button className='button-primary' disabled={isDisabled() || isButtonDisabled() || isOpening} fluid onClick={openCrate}>
                    {isOpening ? <span className='openingtext'>{openingText}</span> : 'Open Crates!'}
                </Button>
            </div>
        )
    }

    return  (
        <section className={outerClasses}>
        {Date.now() < 1618974000000 && !(process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE') ? (
            <Countdown />
        ) : (
            <div className='container'>
                {contractData && !reloadRequired && web3 ? (
                    <Fragment>
                        {stakingForm()}
                    </Fragment>
                ) : <Loader active inverted inline='centered'>Loading</Loader>}
            </div>
        )}                   
        </section>
    )
}

export default Exchange;