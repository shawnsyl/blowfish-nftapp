import React from 'react'

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Loader,
} from 'semantic-ui-react'

import Image from '../components/elements/Image';
import crate from '../assets/images/crate.png'
import bonding from '../assets/images/bonding_curve.png'
import bShark from '../assets/images/b_shark.png'

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
                        <Loader active inverted inline='centered'>Please connect your wallet</Loader>
                    </div>
                )
            }
            <h2>
                How does this work?
            </h2>
            <p>
                Connect your BSC wallet first!
            </p>
            <ol>
                <li>Pick how many crates you want to open and the lock duration. The contract swaps your BNB for BLOWF tokens.</li>
                <li>Your new BLOWF tokens are locked for 1-8 weeks.</li>
                <li>When the lock period passes, you can withdraw your BLOWF from the Puff Vault.</li>
            </ol>
            <p>
                The process is the same when swapping BNB for liquidity pool tokens.
            </p>
            <p>
                Locking liquidity for 8 weeks yields the best odds of rare puffs!
            </p>
            <Image src={crate} width={200}/>
            <h2>
                Chance of a Shark
            </h2>
            <ul>
                <li>BLOWF Locked 1 Week: .5%</li>
                <li>BLOWF Locked 8 Weeks: 4%</li>
                <li>Liquidity Locked 8 Weeks: 8%</li>
            </ul>
            <p>
                Even rarer are the elusive whales. The base rate of a whale is only .05%, which scales up to .8% for 8 weeks locked liquidity. Sharks and whales will have special utility in our upcoming games.
            </p>
            <p>
                Your odds of getting a hat increases as you lock longer and/or lock liquidity.
            </p>
            <p>
                For pufferfish, you have a 33% chance of getting the default color, and a 66% of getting a random hue. There is a 50% chance of getting a darker shade. Eyes, mouths, spikes, and backgrounds are equally random. Sharks and whales have equally random features.
            </p>
            <Image src={bShark} width={300}/>
            <h2>
                Bonding Curve (Pricing)
            </h2>
            <p>
                The inital price of opening a CryptoPuff is .1 BNB. The price rises by 25% for the each 1000 Puffs minted until 4000 Puffs are minted. Then, the price rises by 25% for each 500 Puffs minted. There is a hard cap of 10,000 Generation 1 CryptoPuffs.
            </p>
            <Image src={bonding} width={600}/>
            <p className="mt-24">
                There is initially a 30% fee to fund development. As more Puffs are minted and the team's fundraising targets are met, we will decrease the fee.
            </p>
            <h2>
                Where do I see my CryptoPuffs?
            </h2>
            <p>
                Visit the <a href="/catalog/1/none">Catalog page</a> to see your Puffs and what others have found!
            </p>
        </section>
    )
}

export default Purchase;