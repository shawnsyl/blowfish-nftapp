import React, { Fragment, useEffect, useState } from 'react'
import classNames from 'classnames';

import { useContractDataContext } from '../../hooks/contractData/useContractDataContext'

import {
    Accordion,
    Button,
    Dropdown,
    Icon,
    Input,
    Select
} from 'semantic-ui-react'

const axios = require('axios');

const stakeOptions = [
    {
        text: '1 Month',
        value: 1
    },
    {
        text: '2 Month',
        value: 2
    },
    {
        text: '3 Month',
        value: 3
    },
    {
        text: '4 Month',
        value: 4
    },
    {
        text: '5 Month',
        value: 5
    },
    {
        text: '6 Month',
        value: 6
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

const Exchange = props => {
    const outerClasses = classNames(
        'exchange section'
    );
    
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isStake, setIsStake] = useState(true);
    const [tokensToStake, setTokensToStake] = useState('');
    const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);

    const {
        contractData,
        loadingData,
        reloadRequired,
        web3
    } = useContractDataContext();

    useEffect(() => {
        axios({
            method: 'GET', 
            url: 'https://api.pancakeswap.info/api/tokens'
        })
        .then(response => {
            console.log(response);
        })
    }, [])

    // const liquidityForm = () => {
    //     return !isAddingLiquidity ? (
    //         <Fragment>
    //             <Button className='button-primary liquidity-button' onClick={() => setIsAddingLiquidity(true)}>Add Liquidity</Button>
    //             <p>Add liquidity to receive LP Tokens</p>

    //             <h3>Your Liquidity</h3>
    //             <div className='current-liquidity'>
    //                 <div className='liquidity-message'>
    //                     No liquidity found
    //                 </div>
    //             </div>

    //             <Accordion fluid styled>
    //                 <Accordion.Title
    //                 active={activeIndex === 0}
    //                 index={0}
    //                 onClick={() => handleAccordionClick(0)}
    //                 >
    //                 <Icon name='dropdown' />
    //                 BLOWF/BNB
    //                 </Accordion.Title>
    //                 <Accordion.Content active={activeIndex === 0}>
    //                 <div>
    //                     <div className='my-liquidity-row'>
    //                         <div>POOLED BLOWF: </div>
    //                         <div>269825.67</div>
    //                     </div>
    //                     <div className='my-liquidity-row'>
    //                         <div>POOLED BNB: </div>
    //                         <div>3.99</div>
    //                     </div>
    //                     <div className='my-liquidity-row'>
    //                         <div>YOUR POOLED LP TOKENS: </div>
    //                         <div>900</div>
    //                     </div>
    //                 </div>
    //                 </Accordion.Content>
    //             </Accordion>
    //         </Fragment>
    //     ) : (
    //         <Fragment>
    //             <div className='add-liquidity-header'>
    //                 <Icon link name='arrow left' onClick={() => setIsAddingLiquidity(false)}/>
    //                 <h3>Add Liquidity</h3>
    //                 <div className='liquidity-question'>
    //                     <Icon name='question circle outline'/>
    //                     <div className='hover-info'>
    //                         When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
    //                     </div>
    //                 </div>
    //             </div>
    //             <div className='token-mini-form'>
    //                 <p>Balance: 42069BNB</p>
    //                 <Input 
    //                 action
    //                 fluid
    //                 transparent 
    //                 placeholder='Search...'>
    //                     <input />
    //                     <Button className='button-primary'>Max</Button>
    //                     <Select compact defaultValue='BNB' options={tokenOptions} />
    //                 </Input>
    //             </div>
    //             <div className='plus'>
    //                 <Icon name='plus'/>
    //             </div>
    //             <div className='token-mini-form'>
    //                 <p>Balance: 42069BNB</p>
    //                 <Input 
    //                 action={<Button className='button-primary'>Max</Button>}
    //                 fluid
    //                 label={{ basic: true, content: 'BLOWF' }}
    //                 labelPosition='right'
    //                 transparent 
    //                 placeholder='Search...' />
                    
    //             </div>
    //         </Fragment>
    //     )
    // }

    const stakingForm = () => {
        const {
            playerBalance
        } = contractData;
        return (
            <Fragment>
                <h3>Lock your BNB to receive CryptoPuff lootboxes</h3>

                <p>Available: {web3.utils.fromWei(playerBalance)} BNB</p>
                {/* <Input 
                action
                fluid 
                value={tokensToStake}>
                    <input />
                    <Button className='button-primary'>Max</Button>
                    <Select compact defaultValue='BNB' options={tokenOptions} />
                </Input> */}

                <Input 
                action={<Button className='button-primary' disabled>Max</Button>}
                className='exchange-input'
                disabled
                fluid
                label={{ basic: true, content: 'BNB' }}
                labelPosition='right'
                transparent 
                placeholder='Enter amount to lock...' />
                
                <p>Select lock duration</p>

                <Dropdown
                disabled
                fluid
                selection
                options={stakeOptions} />

                <Button className='button-primary' disabled fluid>Lock BNB</Button>
            </Fragment>
        )
    }

    const handleAccordionClick = (index) => {
        if (activeIndex === index) {
            return setActiveIndex(-1);
        }
        return setActiveIndex(index)
    }

    console.log(web3);

    return (
        <section className={outerClasses}>
            <div className='container'>
                <div className='exchange-window'>
                    {/* <div className='exchange-links'>
                        <div>
                            <a className={isStake ? 'exchange-link-active' : 'exchange-link-inactive'} href='#' onClick={() => {
                                setIsStake(true);
                                setIsAddingLiquidity(false);
                            }}>
                                Stake
                            </a>
                        </div>
                        <div>
                            <a className={!isStake ? 'exchange-link-active' : 'exchange-link-inactive'} href='#' onClick={() => setIsStake(false)}>
                                Liquidity
                            </a>
                        </div>
                    </div> */}
                    {/* {
                        isStake ? (
                            stakingForm()
                        ) : (
                            liquidityForm()
                        )
                    } */}
                    {contractData && !reloadRequired && web3 ? stakingForm() : null}
                </div>
            </div>
        </section>
    )
}

export default Exchange;