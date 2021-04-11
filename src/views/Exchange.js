import React, { Fragment, useState } from 'react'
import classNames from 'classnames';

import {
    Button,
    Dropdown,
    Input
} from 'semantic-ui-react'

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
        'exchange section',
      //   topOuterDivider && 'has-top-divider',
      //   bottomOuterDivider && 'has-bottom-divider',
      //   hasBgColor && 'has-bg-color',
      //   invertColor && 'invert-color',
      //   className
    );

    const [isStake, setIsStake] = useState(true);
    const [tokensToStake, setTokensToStake] = useState('')
    const [value, setValue] = useState('');

    console.log(tokensToStake, value);

    const stakingForm = () => {
        return (
            <Fragment>
                <p>Stake your LP tokens and receive CryptoPuff lootboxes</p>

                <p>Available: 42069 BLOWF-wBNB</p>
                <Input 
                action='Max' 
                fluid 
                label={<Dropdown defaultValue='BNB' options={tokenOptions} />}
                labelPosition='right'onChange={(_,d) => {
                    setTokensToStake(d.value)
                }}
                value={tokensToStake} />
                
                <p>Select stake duration</p>

                <Dropdown
                fluid
                selection
                options={stakeOptions} />

                <Button className='button-primary' fluid>Stake BLOWF-wBNB</Button>
            </Fragment>
        )
    }

    const liquidityForm = () => {
        return (
            <Fragment>
                <p>Stake your LP tokens and receive CryptoPuff lootboxes</p>

                <p>Available: 42069 BLOWF-wBNB</p>
                <Input 
                action='Max' 
                fluid 
                label={<Dropdown defaultValue='BNB' options={tokenOptions} />}
                labelPosition='right'
                onChange={(_,d) => {
                    setValue(d.value)
                }}
                value={value} />
                <p>Select stake duration</p>

                <Dropdown
                fluid
                selection
                options={stakeOptions} />

                <Button className='button-primary' fluid>Stake BLOWF-wBNB</Button>
            </Fragment>
        )
    }

    return (
        <section className={outerClasses}>
            <div className='container'>
                <div className='exchange-window'>
                    <div className='exchange-links'>
                        <div>
                            <a className={isStake ? 'exchange-link-active' : 'exchange-link-inactive'} href='#' onClick={() => setIsStake(true)}>
                                Stake
                            </a>
                        </div>
                        <div>
                            <a className={!isStake ? 'exchange-link-active' : 'exchange-link-inactive'} href='#' onClick={() => setIsStake(false)}>
                                Liquidity
                            </a>
                        </div>
                    </div>
                    {
                        isStake ? (
                            stakingForm()
                        ) : (
                            liquidityForm()
                        )
                    }
                    

                </div>
            </div>
        </section>
    )
}

export default Exchange;