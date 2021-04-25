import React from 'react'

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Loader,
} from 'semantic-ui-react'

import Image from '../components/elements/Image';
import crate from '../assets/images/crate.png'

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
            <h1>
                How does this work?
            </h1>
            <p>
                Connect your wallet first!
            </p>
            <p>
                When you open a crate, you swap BNB for BLOWF tokens. The CryptoPuff smart contract automatically buys the BLOWF and locks them for the specified time period. When the lock period passes, you can withdraw the BLOWF tokens.
            </p>
            <p>
                The same process applies when swapping BNB for the BLOWF-BNB liquidity pool tokens.
            </p>
            <p>
                Locking liquidity for 8 weeks yields the best odds of rare puffs.
            </p>
            <Image src={crate} width={200}/>
            <h1>
                Where do I see my CryptoPuffs?
            </h1>
            <p>
                Visit the <a href="/catalog/1/none" rel="noopener noreferrer">Catalog page</a> to see your Puffs and what others have found!
            </p>
        </section>
    )
}

export default Purchase;