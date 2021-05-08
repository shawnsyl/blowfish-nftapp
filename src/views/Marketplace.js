import React, { useEffect, useState } from 'react'
import classNames from 'classnames';

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Container
} from 'semantic-ui-react'

import PuffCarousel from '../components/elements/PuffCarousel';

const axios = require('axios');

const Marketplace = props => {
    const outerClasses = classNames(
      'marketplace section container',
    //   topOuterDivider && 'has-top-divider',
    //   bottomOuterDivider && 'has-bottom-divider',
    //   hasBgColor && 'has-bg-color',
    //   invertColor && 'invert-color',
    //   className
    );

    const [cryptoPuffs, setCryptoPuffs] = useState(null);

    const {
        contract,
        reloadRequired,
        user,
        web3,
    } = useContractDataContext();

    useEffect(() => {
        if (!!web3 && !!contract && !reloadRequired && Object.keys(contract.methods).length) {    
            axios({
                method: 'get', 
                headers: {
                    'Content-Type': 'application/json'
                },
                baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
                url: 'cryptopuffs/',
                params: {
                    puffOwner: user,
                    sortBy: null
                }
            }).then(response => {
                setCryptoPuffs(response.data.cryptopuffs);
            }).catch(err => {
                console.error(err);
            })
        }
    }, [web3, contract, reloadRequired])

    console.log(cryptoPuffs);

    return (
        <section className={outerClasses}>
            <h2>MARKETPLACE</h2>
            {/* <p>TODO: what can we search by, what filters do we need</p>
            <p>pagination - gonna figure out the backend</p>
            <div className='container search'>
                <CatalogueSearch />
            </div>
            <div className='container'>
                <div className={tilesClasses}>
                    {puffData.map((puff, i) => {
                        return <PuffTile delay={i * 200} /> 
                    })}
                </div>
                <div>
                    hello
                </div>

            </div> */}
            <div className='container'>
                <Container text className='mb-32'>
                    <p>
                    Auction your CryptoPuffs here! Set your price and let the market decide.
                    </p>
                    <p>
                    See a Puff you really like? Place a bid!
                    </p>
                    <p>
                    MarketPlace to be released soon after CryptoPuffs initial launch.
                    </p>
                    {!!cryptoPuffs ? <PuffCarousel puffIds={cryptoPuffs.map(puff => puff.puffId)} /> : null}
                </Container>
                
            </div>
        </section>
    )
}

export default Marketplace;