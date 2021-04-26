import React, { Fragment, useEffect, useState } from 'react'
import { Prompt } from 'react-router'
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
const networkId = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? 97 : 56;

const Exchange = props => {
    const outerClasses = classNames(
        'exchange section'
    );

    const [infoText, setInfoText] = useState('');
    const [isAddingLp, setIsAddingLp] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
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
                    text: `${i+1} Crate${i > 0 ? 's' : ''} (${(parseFloat(web3.utils.fromWei(puffCratePrice)) * (i + 1)).toFixed(2)} BNB)`,
                    value: i + 1
                })
            }
            setPuffCrateOptions([...newPuffCrateOptions])
        }
    }, [web3, contractData])

    useEffect(() => {
        if (infoText.length) {
            setTimeout(() => {
                setInfoText('');
            }, 10000);
        }
    }, [infoText])
    
    const isDisabled = () => {
        if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE') {
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

    const updateDb = transferArray => {
        if (Array.isArray(transferArray)) {
            let requests = transferArray.map(transfer => axios({
                method: 'post', 
                headers: {
                    'Content-Type': 'application/json'
                },
                baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
                url: 'cryptopuffs/add',
                data: JSON.stringify({
                    puffId: transfer.returnValues.tokenId,
                    puffOwner: user,
                    dateMinted: Date.now()
                })
            }));
            Promise.all(requests)
                .then(responses => {
                    setIsOpening(false);
                    console.log(responses);
                    setInfoText('Succesfully Opened Crates!');
                    setIsComplete(true);
                })
                .catch(err => {
                    console.error(err);
                    setIsOpening(false);
                    setInfoText('Failed to open crates!');
                })
        } else {
            axios({
                method: 'post', 
                headers: {
                    'Content-Type': 'application/json'
                },
                baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
                url: 'cryptopuffs/add',
                data: JSON.stringify({
                    puffId: transferArray.returnValues.tokenId,
                    puffOwner: user,
                    dateMinted: Date.now()
                })
            })
            .then(response => {
                setIsOpening(false);
                console.log(response);
                setInfoText('Succesfully Opened Crates!');
                setIsComplete(true);
            })
            .catch(err => {
                console.error(err);
                setIsOpening(false);
                setInfoText('Failed to open crates!');
            })
        }
    }

    const openCrate = () => {
        setIsOpening(true);
        setIsComplete(false);
        const {
            puffCratePrice
        } = contractData
        const lockAmount = web3.utils.toWei((fromWei(puffCrateQuantity * puffCratePrice)).toString());

        web3.eth.net.getId()
        .then(result => {
            if (result !== networkId) {
                setInfoText('Make sure you are on the BSC Mainnet!');
                setIsOpening(false);
                return;
            } else {
                if (isAddingLp) {
                    try {
                        contract.methods.purchaseCryptoPuffLiquidity(lockDuration, puffCrateQuantity).estimateGas({from: user, value: lockAmount})
                        .then(gasEstimate => {
                            contract.methods.purchaseCryptoPuffLiquidity(lockDuration, puffCrateQuantity).send({
                                gas: gasEstimate + 50000, from: user, value: lockAmount
                            }).then(response => {
                                console.log(response)
                                console.log(response.events);
                                console.log(response.events.Transfer.returnValues)
                                updateDb(response.events.Transfer)
                            }).catch(err => {
                                console.log(err);
                                setIsOpening(false);
                                if (err.code === 4001) {
                                    setInfoText('User cancelled transaction!');
                                }
                            })
                        });
                    } catch (e) {
                        console.error(e);
                        setIsOpening(false);
                        setInfoText('Failed to open crates!');
                    }
                } else {
                    try {
                        contract.methods.purchaseCryptoPuffTokens(lockDuration, puffCrateQuantity).estimateGas({from: user, value: lockAmount})
                        .then(gasEstimate => {
                            contract.methods.purchaseCryptoPuffTokens(lockDuration, puffCrateQuantity).send({
                                gas: gasEstimate + 50000, from: user, value: lockAmount
                            }).then(response => {
                                console.log(response)
                                console.log(response.events);
                                console.log(response.events.Transfer.returnValues)
                                updateDb(response.events.Transfer)
                            }).catch(err => {
                                console.log(err);
                                setIsOpening(false);
                                if (err.code === 4001) {
                                    setInfoText('User cancelled transaction!');
                                }
                            })
                        });
                    } catch (e) {
                        console.error(e);
                        setIsOpening(false);
                        setInfoText('Failed to open crates!');
                    }
                }
            }
        });
    }

    const stakingForm = () => {
        const {
            playerBalance
        } = contractData;

        return (
            <div className='exchange-window'>
                <h3>Swap BNB to Open Crates</h3>

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

                {!isAddingLp ? <p>
                    Swap BNB for BLOWF tokens.
                </p> :
                <p>
                    Swap BNB for BLOWF-BNB liquidity tokens.<br/>
                    The liquidity option doubles your odds of certain rare features.
                </p> }

                <p>Select number of Puff Crates to open.</p>

                <Dropdown
                disabled={isDisabled()}
                fluid
                selection
                onChange={(_, d) => setPuffCrateQuantity(d.value)}
                options={puffCrateOptions} />
                
                <p>Select lock duration of your tokens. The longer the duration, the higher the chances of pulling a <strong>rarer Puff Crate</strong>!</p>

                <Dropdown
                disabled={isDisabled()}
                fluid
                selection
                onChange={(_, d) => setLockDuration(d.value)}
                options={stakeOptions} />

                <Button className='button-primary' disabled={isDisabled() || isButtonDisabled() || isOpening} fluid onClick={openCrate}>
                    {isOpening ? <span className='openingtext'>{openingText}</span> : 'Open Crates!'}
                </Button>

                <p style={{textAlign: 'right', paddingTop: 10}}>30% development fee</p>

                {isOpening ? <p>Please do not refresh or navigate away from the page while transaction is in progress...</p> : null}

                {isComplete ? <p>Transaction complete. Check your new NFTs on the Catalog page!</p> : null}

                <p className={infoText.toLowerCase().includes('failed') || infoText.toLowerCase().includes('cancelled') ? 'warn' : ''}>{infoText}</p>
            </div>
        )
    }

    return  (
        <section className={outerClasses}>
        <Prompt
          when={isOpening}
          message='You have transactions in progress!'
        />
        {!(process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE') ? (
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