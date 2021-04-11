import React from 'react'
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

const Stake = props => {
    const outerClasses = classNames(
        'stake section',
      //   topOuterDivider && 'has-top-divider',
      //   bottomOuterDivider && 'has-bottom-divider',
      //   hasBgColor && 'has-bg-color',
      //   invertColor && 'invert-color',
      //   className
    );

    return (
        <section className={outerClasses}>
            <div className='container'>
                <div className='stake-window'>
                    <h3>Stake BLOWF-wBNB LP </h3>
                    <p>Stake your LP tokens and receive CryptoPuff lootboxes</p>

                    <p>Available: 42069 BLOWF-wBNB</p>
                    <Input action='Max' fluid/>
                    <p>Select stake duration</p>

                    <Dropdown
                    fluid
                    selection
                    options={stakeOptions} />

                    <Button className='button-primary' fluid>Stake BLOWF-wBNB</Button>

                </div>
            </div>
        </section>
    )
}

export default Stake;