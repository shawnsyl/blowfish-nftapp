import React from 'react'

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Loader,
} from 'semantic-ui-react'

import Image from '../components/elements/Image';
import crate from '../assets/images/crate.png'
import bonding from '../assets/images/bonding_curve.png'

import Exchange from '../components/sections/Exchange';

const Purchase = props => {
    const {
        contract,
        reloadRequired,
        web3,
    } = useContractDataContext();

    return (
        <section className='purchase section container'>
            {!!web3 && !!contract & !reloadRequired ? (
                <Exchange />
            ) : (
                    <div className ='purchase-loader'>
                        <Loader active inverted inline='centered'>Loading</Loader>
                    </div>
                )
            }
            <h2>
                How does this work?
            </h2>
            <p>
                Connect your BSC wallet first!
            </p>
            <p>
                When you open a crate, you swap BNB for BLOWF tokens. The CryptoPuffs smart contract automatically buys the BLOWF tokens and locks them for the specified time period. When the lock period passes, you can withdraw the BLOWF tokens.
            </p>
            <p>
                The same process applies when swapping BNB for the BLOWF-BNB liquidity pool tokens.
            </p>
            <p>
                Locking liquidity for 8 weeks yields the best odds of rare puffs.
            </p>
            <h2>
                Chance of a Shark
            </h2>
            <ul>
                <li>BLOWF Locked 1 Week: .5%</li>
                <li>BLOWF Locked 8 Weeks: 4%</li>
                <li>Liquidity Locked 8 Weeks: 8%</li>
            </ul>
            <h2>
                Bonding Curve (Pricing)
            </h2>
            <p>
                The inital price of opening a CryptoPuff is .1 BNB. The price rises by 25% for the each 1000 Puffs minted until 4000 Puffs are minted. Then, the price rises by 25% for each 500 Puffs minted. There is a hard cap of 10,000 Generation 1 CryptoPuffs.
            </p>
            <Image src={bonding} width={600}/>
            <h2>
                Where do I see my CryptoPuffs?
            </h2>
            <p>
                Visit the <a href="/catalog/1/none" rel="noopener noreferrer">Catalog page</a> to see your Puffs and what others have found!
            </p>
            <Image src={crate} width={200}/>
        </section>
    )
}

export default Purchase;